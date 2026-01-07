<script setup>
import { ref, onMounted, watch } from 'vue'
import axios from 'axios'
import RecordList from './RecordList.vue'
import SongRecordExpand from '../components/SongRecordExpand.vue'
import { useRoute, useRouter } from 'vue-router'
import { ElNotification, ElMessage, ElDialog, ElLoading } from 'element-plus'
import SongTabs from '../components/SongTabs.vue'
import LuckyWheel from '../components/LuckyWheel.vue'
import AdvancedBlindBox from '../components/AdvancedBlindBox.vue'

const songs = ref([])
const total = ref(0)
const curPage = ref(1)
const pageSize = 50
const loading = ref(false) // 添加loading状态

// 确保pageSize不超过50
const getPageSize = () => Math.min(pageSize, 50)
const query = ref('')
const sortField = ref('last_performed') // 默认按日期排序
const sortOrder = ref('descending') // 默认倒序

// 获取分页歌曲数据
const fetchSongs = async () => {
  await fetchSongsWithParams()
}
// ✅ 选中的曲风（多选）
const selectedStyles = ref([])
// ✅ 选中的标签（多选）
const selectedTags = ref([])

// ✅ 可供选择的曲风列表
const styleOptions = ref([])
// ✅ 可供选择的标签列表
const tagOptions = ref([])
const route = useRoute()
const router = useRouter()

const loadStyleOptions = async () => {
  try {
    const res = await axios.get('/api/styles')
    styleOptions.value = res.data
  } catch (err) {
    console.error('❌ 获取曲风列表失败:', err)
    ElMessage.error('获取曲风列表失败，请稍后重试')
  }
}

const loadTagOptions = async () => {
  try {
    const res = await axios.get('/api/tags')
    // 检查返回的数据是否有效
    if (Array.isArray(res.data)) {
      tagOptions.value = res.data
      // 如果标签选项为空，显示提示信息
      if (res.data.length === 0) {
        console.warn('标签列表为空，请检查是否已添加标签数据')
        ElMessage.warning('暂无标签数据')
      }
    } else {
      console.error('❌ 获取标签列表格式错误:', res.data)
      ElMessage.error('标签数据格式错误')
      tagOptions.value = []
    }
  } catch (err) {
    console.error('❌ 获取标签列表失败:', err)
    ElMessage.error('获取标签列表失败，请稍后重试')
    tagOptions.value = [] // 确保在错误情况下也设置为空数组
  }
}

const handleSortChange = ({ prop, order }) => {
  // 只支持指定字段
  if(['singer','last_performed','perform_count'].includes(prop)) {
    sortField.value = prop
    sortOrder.value = order
    curPage.value = 1
    fetchSongs()
  }
}

onMounted(() => {
  loadStyleOptions()
  loadTagOptions()
  // 路由参数自动填充搜索
  if (route.query.q) {
    query.value = route.query.q
    fetchSongs()
  } else {
    // 默认按日期倒序排列
    sortField.value = 'last_performed'
    sortOrder.value = 'descending'
    fetchSongs()
  }
})
watch(curPage, fetchSongs)
// 监听路由变化，支持外部跳转
watch(
  () => route.query.q,
  (val) => {
    if (val !== undefined) {
      query.value = val
      fetchSongs()
    }
  }
)

async function copySongName(name) {
  try {
    await navigator.clipboard.writeText(name)
    ElNotification({
      message: '已复制歌曲名：' + name,
      type: 'success',
      customClass: 'copy-message-card',
      duration: 1800,
      showClose: false,
      offset: 40,
      position: 'top-right'
    })
  } catch (err) {
    // 兼容旧浏览器
    const input = document.createElement('input')
    input.value = name
    document.body.appendChild(input)
    input.select()
    try {
      document.execCommand('copy')
      ElNotification({
        message: '已复制歌曲名：' + name,
        type: 'success',
        customClass: 'copy-message-card',
        duration: 1800,
        showClose: false,
        offset: 40,
        position: 'top-right'
      })
    } catch {
      ElMessage.error('复制失败')
    }
    document.body.removeChild(input)
  }
}

// 获取随机歌曲
const showRandomSongDialog = ref(false)
const showLuckyWheelDialog = ref(false)
const showAdvancedBlindBox = ref(false)
const randomSong = ref({})
const isFilterPanelVisible = ref(false)

// 切换筛选面板显示/隐藏
const toggleFilterPanel = () => {
  isFilterPanelVisible.value = !isFilterPanelVisible.value
}

async function getRandomSong() {
  try {
    const loading = ElLoading.service({
      lock: true,
      text: '正在抽取歌曲...',
      background: 'rgba(0, 0, 0, 0.7)'
    })
    
    const res = await axios.get('/api/random-song')
    randomSong.value = res.data
    showRandomSongDialog.value = true
    
    loading.close()
  } catch (err) {
    console.error('获取随机歌曲失败:', err)
    ElMessage.error('获取随机歌曲失败')
  }
}

// 点击原唱进行筛选
const filterBySinger = (singer) => {
  if (singer) {
    query.value = singer
    curPage.value = 1
    fetchSongs()
  }
}

// 点击曲风进行筛选
const filterByStyle = (style) => {
  if (style) {
    // 清除其他筛选条件
    selectedStyles.value = [style]
    selectedTags.value = []
    query.value = ''
    curPage.value = 1
    fetchSongs()
  }
}

// 点击语言进行筛选
const filterByLanguage = (language) => {
  if (language) {
    query.value = ''
    selectedStyles.value = []
    selectedTags.value = []
    // 直接通过修改fetchSongs函数传递language参数
    curPage.value = 1
    fetchSongsWithParams({ language: language })
  }
}

// 点击标签进行筛选
const filterByTag = (tag) => {
  if (tag) {
    // 清除其他筛选条件
    selectedTags.value = [tag]
    selectedStyles.value = []
    query.value = ''
    curPage.value = 1
    fetchSongs()
  }
}

// 带自定义参数的获取歌曲数据函数
const fetchSongsWithParams = async (additionalParams = {}) => {
  loading.value = true
  try {
    const params = {
      page: curPage.value,
      limit: getPageSize(),
      ...additionalParams
    }
    
    // 添加搜索查询参数
    if (query.value) {
      params.q = query.value
    }
    
    // 添加曲风筛选参数
    if (selectedStyles.value.length > 0) {
      params.styles = selectedStyles.value.join(',')
    }
    
    // 添加标签筛选参数
    if (selectedTags.value.length > 0) {
      params.tags = selectedTags.value.join(',')
    }
    
    // 处理排序参数
    if (sortField.value && sortOrder.value) {
      // 特殊处理日期字段，确保使用正确的字段名
      let field = sortField.value
      if (field === 'last_performed') {
        field = 'last_performed'
      } else if (field === 'perform_count') {
        field = 'perform_count'
      }
      params.ordering = (sortOrder.value === 'descending' ? '-' : '') + field
    }
    
    const res = await axios.get('/api/songs', { params })
    songs.value = res.data.results
    total.value = res.data.total
  } catch (err) {
    console.error('❌ 获取歌曲失败:', err)
    ElMessage.error('获取歌曲失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

</script>

<template>
    <!-- <SongTabs /> -->
  <div class="song-list-container">
  <!-- 搜索框 -->
    <div class="search-bar">
        <el-input
            v-model="query"
            placeholder="请输入歌名或歌手"
            style="width: 300px; margin-right: 10px"
            @keyup.enter="() => { curPage = 1; fetchSongs() }"
            />
        <el-button type="primary" @click="() => { curPage = 1; fetchSongs() }" class="action-button">搜索</el-button>
        <el-button type="success" @click="getRandomSong" class="action-button action-button-success">盲盒</el-button>
        <el-button type="warning" @click="showAdvancedBlindBox = true" class="action-button action-button-warning">自定义盲盒</el-button>
        <el-button type="info" @click="toggleFilterPanel" class="action-button action-button-info">
          {{ isFilterPanelVisible ? '收起筛选' : '更多筛选' }}
        </el-button>
    </div>

    <!-- ✅ 筛选区域 -->
    <transition name="slide-fade">
      <div class="filter-container" v-show="isFilterPanelVisible">
        <div class="filter-section">
          <div class="filter-header">
            <h3>曲风筛选</h3>
          </div>
          <div class="filter-content">
            <el-checkbox-group v-model="selectedStyles" class="filter-checkbox-group">
              <el-checkbox
                v-for="style in styleOptions"
                :key="style"
                :value="style"
                class="filter-checkbox"
              >
                {{ style }}
              </el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
        
        <div class="filter-section" style="margin-top: 20px;">
          <div class="filter-header">
            <h3>标签筛选</h3>
          </div>
          <div class="filter-content">
            <!-- 当标签选项为空时显示提示信息 -->
            <div v-if="tagOptions.length === 0" class="no-tags-message">
              暂无标签数据
            </div>
            <el-checkbox-group v-else v-model="selectedTags" class="filter-checkbox-group">
              <el-checkbox
                v-for="tag in tagOptions"
                :key="tag"
                :value="tag"
                class="filter-checkbox"
              >
                {{ tag }}
              </el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
        
        <el-button
          type="primary"
          @click="() => { curPage = 1; fetchSongs() }"
          class="filter-button"
        >
          🔍 筛选歌曲
        </el-button>
      </div>
    </transition>

    <el-table
      v-loading="loading"
      :data="songs"
      stripe
      border
      fit
      style="width: 100%" 
      @sort-change="handleSortChange"
    >
        <!-- 移除No字段 -->
        <!-- <el-table-column prop="id" label="No" min-width="80" align="center" header-align="center" /> -->
        <el-table-column prop="song_name" label="歌曲名" min-width="130" align="center" header-align="center">
          <template #default="{ row }">
            <span class="copy-song-name" @click="copySongName(row.song_name)">{{ row.song_name }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="singer" label="原唱" min-width="100" align="center" header-align="center" sortable>
          <template #default="{ row }">
            <span class="filterable-cell" @click="filterBySinger(row.singer)">{{ row.singer }}</span>
          </template>
        </el-table-column>
        <el-table-column label="曲风" width="120" min-width="80" align="center" header-align="center">
            <template #default="{ row }">
                <span v-if="row.styles && row.styles.length > 0">
                  <span 
                    v-for="(style, index) in row.styles" 
                    :key="style"
                    class="filterable-cell"
                    @click="filterByStyle(style)"
                  >
                    {{ style }}<span v-if="index < row.styles.length - 1">、</span>
                  </span>
                </span>
            </template>
        </el-table-column>
        <el-table-column prop="language" label="语言" min-width="80" align="center" header-align="center" sortable>
          <template #default="{ row }">
            <span class="filterable-cell" @click="filterByLanguage(row.language)">{{ row.language }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="last_performed" label="最近一次演唱" min-width="140" align="center" header-align="center" sortable />
        <el-table-column prop="perform_count" label="演唱次数" min-width="100" align="center" header-align="center" sortable />
        <el-table-column label="标签" min-width="100" align="center" header-align="center">
            <template #default="{ row }">
                <span v-if="row.tags && row.tags.length > 0">
                  <span 
                    v-for="(tag, index) in row.tags" 
                    :key="tag"
                    class="filterable-cell"
                    @click="filterByTag(tag)"
                  >
                    {{ tag }}<span v-if="index < row.tags.length - 1">、</span>
                  </span>
                </span>
            </template>
        </el-table-column>

      <!-- 展开列 -->
      <SongRecordExpand />

    </el-table>

    <!-- 分页歌曲列表 -->
    <el-pagination
      v-model:current-page="curPage"
      :page-size="pageSize"
      :total="total"
      layout="prev, pager, next"
      background
      style="margin-top: 20px; text-align: center"
    />
  </div>
  
  <!-- 盲盒歌曲弹窗 -->
  <el-dialog
    v-model="showRandomSongDialog"
    title="盲盒歌曲"
    width="800px"
    custom-class="random-song-dialog"
  >
    <div style="text-align: center; padding: 20px;">
      <p style="font-size: 24px; margin-bottom: 10px; font-weight: bold;">{{ randomSong.song_name }}</p>
      <p style="font-size: 18px; color: #666; margin-bottom: 15px;">{{ randomSong.singer }}</p>
      <p style="font-size: 16px; color: #999;">演唱次数: {{ randomSong.perform_count }}</p>
      
      <div style="margin-top: 30px;">
        <h3 style="margin-bottom: 15px; border-bottom: 1px solid #eee; padding-bottom: 10px; text-align: center;">演唱记录</h3>
        <div style="display: flex; justify-content: center;">
          <RecordList 
            :song-id="randomSong.id" 
            :song-name="randomSong.song_name"
            style="width: 100%; max-width: 800px;"
          />
        </div>
      </div>
    </div>
  </el-dialog>
  
  <!-- 大转盘弹窗 -->
  <el-dialog
    v-model="showLuckyWheelDialog"
    title="大转盘"
    width="550px"
    custom-class="lucky-wheel-dialog"
  >
    <LuckyWheel />
  </el-dialog>
  
  <!-- 高级盲盒弹窗 -->
  <AdvancedBlindBox v-model="showAdvancedBlindBox" />
</template>

<style scoped>
.search-bar {
  margin-bottom: 20px;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
}
.song-list-container {
  position: relative;
  z-index: 1;
  padding: 20px;
  max-width: 1000px;
  margin: 0 auto;
  text-align: center;
  background-color: transparent !important; /* 全透明背景 */
}

.video-dialog {
  max-width: 960px;
  z-index: 99999 !important;
}

.filter-container {
  border: 1px solid #e0e0e0;
  padding: 20px;
  border-radius: 12px;
  background-color: rgba(255, 255, 255, 0.85) !important;
  margin-bottom: 20px;
  width: 100%;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.filter-section {
  border: none;
  padding: 0;
  border-radius: 0;
  background-color: transparent !important;
}

.filter-header h3 {
  margin-top: 0;
  margin-bottom: 15px;
  text-align: left;
  color: #333;
  font-size: 18px;
  font-weight: 600;
  padding-bottom: 8px;
  border-bottom: 2px solid #f0f0f0;
}

.filter-content {
  text-align: left;
}

/* 美化复选框组 */
.filter-checkbox-group {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.filter-checkbox {
  margin-right: 0 !important;
}

.filter-checkbox :deep(.el-checkbox__input) {
  border-radius: 6px;
}

.filter-checkbox :deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
  background-color: #409eff;
  border-color: #409eff;
}

.filter-checkbox :deep(.el-checkbox__input.is-checked .el-checkbox__inner::after) {
  border-color: #fff;
}

.filter-checkbox :deep(.el-checkbox__label) {
  font-size: 14px;
  color: #555;
  padding-left: 8px;
}

.filter-checkbox :deep(.el-checkbox__inner) {
  border-radius: 6px;
  width: 18px;
  height: 18px;
}

.filter-checkbox:hover :deep(.el-checkbox__inner) {
  border-color: #409eff;
}

.filter-button {
  margin-top: 20px;
  width: 100%;
  background: linear-gradient(135deg, #409eff, #1a73e8);
  border: none;
  border-radius: 8px;
  padding: 12px 20px;
  font-size: 16px;
  font-weight: 500;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 8px rgba(64, 158, 255, 0.2);
}

.filter-button:hover {
  background: linear-gradient(135deg, #1a73e8, #0d5cb6);
  box-shadow: 0 6px 12px rgba(64, 158, 255, 0.3);
  transform: translateY(-2px);
}

.filter-button:active {
  transform: translateY(0);
}

.el-pagination {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.copy-song-name {
  cursor: pointer;
  color: inherit;
  text-decoration: none;
}
.copy-song-name:hover {
  color: inherit;
}

.copy-message-card {
  border: 2px solid #222;
  border-radius: 12px;
  background: #fff;
  color: #222;
  font-size: 20px;
  font-weight: 500;
  box-shadow: 0 4px 18px rgba(0,0,0,0.10);
  padding: 18px 36px;
  min-width: 180px;
  max-width: 420px;
  text-align: center;
}

/* 可筛选单元格样式 */
.filterable-cell {
  cursor: pointer;
  color: inherit;
  text-decoration: underline;
  transition: color 0.3s;
}

.filterable-cell:hover {
  color: #1a73e8;
}

/* 统一按钮样式 */
.action-button {
  border: none;
  border-radius: 8px;
  padding: 10px 16px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  min-width: 80px;
}

.action-button:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.action-button:active {
  transform: translateY(0);
}

/* 无标签数据提示样式 */
.no-tags-message {
  color: #999;
  font-size: 14px;
  text-align: center;
  padding: 20px 0;
}

/* 主要按钮 (搜索) */
.action-button.el-button--primary {
  background: linear-gradient(135deg, #409eff, #1a73e8);
  color: white;
}

.action-button.el-button--primary:hover {
  background: linear-gradient(135deg, #1a73e8, #0d5cb6);
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
}

/* 成功按钮 (盲盒) */
.action-button.el-button--success {
  background: linear-gradient(135deg, #67c23a, #419f23);
  color: white;
}

.action-button.el-button--success:hover {
  background: linear-gradient(135deg, #419f23, #2d7a19);
  box-shadow: 0 4px 12px rgba(103, 194, 58, 0.3);
}

/* 警告按钮 (自定义盲盒) */
.action-button.el-button--warning {
  background: linear-gradient(135deg, #e6a23c, #c67a18);
  color: white;
}

.action-button.el-button--warning:hover {
  background: linear-gradient(135deg, #c67a18, #a56214);
  box-shadow: 0 4px 12px rgba(230, 162, 60, 0.3);
}

/* 信息按钮 (筛选) */
.action-button.el-button--info {
  background: linear-gradient(135deg, #909399, #6b6d72);
  color: white;
}

.action-button.el-button--info:hover {
  background: linear-gradient(135deg, #6b6d72, #525459);
  box-shadow: 0 4px 12px rgba(144, 147, 153, 0.3);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .filter-container {
    padding: 15px;
  }
  
  .filter-checkbox-group {
    gap: 8px;
  }
  
  .filter-header h3 {
    font-size: 16px;
  }
  
  .filter-checkbox :deep(.el-checkbox__label) {
    font-size: 13px;
  }
}

/* 筛选区域展开/收起动画 */
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(-20px);
  opacity: 0;
}
</style>
