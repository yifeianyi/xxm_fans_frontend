<template>
  <div class="advanced-blindbox">
    <el-dialog
      v-model="showDialog"
      title="自定义盲盒"
      width="90%"
      custom-class="advanced-blindbox-dialog"
      @close="handleClose"
    >
      <div class="blindbox-content">
        <!-- 筛选区域 -->
        <div class="filter-section">
          <h3>筛选条件</h3>
          <div class="filter-options">
            <!-- 语言筛选 -->
            <div class="filter-group">
              <label>语言：</label>
              <el-checkbox-group v-model="selectedLanguages">
                <el-checkbox
                  v-for="language in languageOptions"
                  :key="language"
                  :label="language"
                  :value="language"
                >
                  {{ language }}
                </el-checkbox>
              </el-checkbox-group>
            </div>
            
            <!-- 曲风筛选 -->
            <div class="filter-group">
              <label>曲风：</label>
              <el-checkbox-group v-model="selectedStyles">
                <el-checkbox
                  v-for="style in styleOptions"
                  :key="style"
                  :label="style"
                  :value="style"
                >
                  {{ style }}
                </el-checkbox>
              </el-checkbox-group>
            </div>
            
            <!-- 歌手名筛选 -->
            <div class="filter-group">
              <label>歌手名：</label>
              <el-input 
                v-model="singerQuery" 
                placeholder="请输入歌手名" 
                style="width: 100%"
              />
            </div>
          </div>
          
          <div class="filter-actions">
            <el-button type="primary" @click="applyFilters">确定</el-button>
            <el-button @click="resetFilters">重置</el-button>
          </div>
        </div>
        
        <!-- 转盘区域 -->
        <div class="wheel-section">
          <h3>歌曲转盘 <span v-if="hasFiltered">(共{{ filteredSongs.length }}首)</span></h3>
          <div class="lucky-wheel-wrapper">
            <LuckyWheel
              ref="myLucky"
              width="400px"
              height="400px"
              :prizes="prizes"
              :blocks="blocks"
              :buttons="buttons"
              @start="startCallback"
              @end="endCallback"
            />
          </div>
          <div style="margin-top: 20px;">
            <el-button type="primary" @click="applyFilters">重新筛选</el-button>
          </div>
        </div>
        
        <div v-if="hasFiltered && filteredSongs.length === 0" class="no-songs">
          <p>没有找到符合条件的歌曲</p>
        </div>
      </div>
    </el-dialog>
    
    <!-- 歌曲记录弹窗 -->
    <el-dialog
      v-model="showRecordDialog"
      :title="`《${selectedSong.song_name}》演唱记录`"
      width="800px"
      custom-class="record-dialog"
    >
      <RecordList 
        v-if="selectedSong.id"
        :song-id="selectedSong.id" 
        :song-name="selectedSong.song_name"
        style="width: 100%"
      />
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { ElMessage } from 'element-plus'
import axios from 'axios'
import RecordList from '../views/RecordList.vue'

// 引入大转盘组件
import { LuckyWheel } from '@lucky-canvas/vue'

const props = defineProps({
  modelValue: Boolean
})

const emit = defineEmits(['update:modelValue'])

// 控制弹窗显示
const showDialog = ref(false)
const showRecordDialog = ref(false)

// 监听 v-model
watch(() => props.modelValue, (val) => {
  showDialog.value = val
})

// 关闭弹窗
function handleClose() {
  emit('update:modelValue', false)
}

// 筛选条件
const selectedLanguages = ref([])
const selectedStyles = ref([])
const singerQuery = ref('')

// 所有可选项
const languageOptions = ref([])
const styleOptions = ref([])

// 歌曲数据
const allSongs = ref([])
const filteredSongs = ref([])
const hasFiltered = ref(false)
const selectedSong = ref({})

// 大转盘相关
const myLucky = ref()

// 定义大转盘配置
const blocks = ref([{ padding: '13px', background: '#4a90e2' }]) // 蓝色外圈
const buttons = ref([{
  radius: '40%',
  background: '#4a90e2', // 蓝色按钮
  pointer: true,
  fonts: [{ text: '开始', top: '-10px', color: '#ffffff' }], // 白色文字
  shadow: '0 2px 4px rgba(74, 144, 226, 0.5)' // 蓝色阴影
}])

// 奖项数据
const prizes = ref([])

// 初始化转盘奖项
const initializePrizes = () => {
  const prizeList = []
  // 创建26个空奖项作为默认值
  for (let i = 0; i < 26; i++) {
    prizeList.push({
      fonts: [{ text: '', top: '10%' }],
      background: i % 2 === 0 ? '#f0f8ff' : '#d0e6ff' // 浅蓝色系
    })
  }
  prizes.value = prizeList
}

// 更新转盘奖项
const updatePrizes = () => {
  const prizeList = []
  const songCount = filteredSongs.value.length
  
  // 根据实际筛选出的歌曲数量动态创建奖项
  if (songCount > 0) {
    // 按实际歌曲数量创建相应数量的奖项
    for (let i = 0; i < songCount; i++) {
      const song = filteredSongs.value[i]
      prizeList.push({
        id: song.id,
        song: song,
        fonts: [{ text: song.song_name, top: '10%', fontSize: '12px', color: '#4a90e2' }], // 蓝色文字
        background: i % 2 === 0 ? '#ffffff' : '#e6f2ff' // 白色和浅蓝色交替
      })
    }
  } else {
    // 如果没有歌曲，创建26个空奖项
    for (let i = 0; i < 26; i++) {
      prizeList.push({
        fonts: [{ text: '', top: '10%' }],
        background: i % 2 === 0 ? '#f0f8ff' : '#d0e6ff' // 浅蓝色系
      })
    }
  }
  prizes.value = prizeList
}

// 获取语言选项
const getLanguageOptions = () => {
  // 从歌曲数据中提取唯一语言
  const languages = [...new Set(allSongs.value.map(song => song.language).filter(lang => lang))]
  languageOptions.value = languages
}

// 获取曲风选项
const loadStyleOptions = async () => {
  try {
    const res = await axios.get('/api/styles')
    styleOptions.value = res.data
  } catch (err) {
    console.error('❌ 获取曲风列表失败:', err)
    ElMessage.error('获取曲风列表失败，请稍后重试')
  }
}

// 获取所有歌曲数据
const loadAllSongs = async () => {
  try {
    const res = await axios.get('/api/songs', {
      params: {
        limit: 1000  // 获取足够多的歌曲
      }
    })
    allSongs.value = res.data.results
    getLanguageOptions()
  } catch (err) {
    console.error('❌ 获取歌曲失败:', err)
    ElMessage.error('获取歌曲失败，请稍后重试')
  }
}

// 应用筛选条件
const applyFilters = async () => {
  try {
    // 构建筛选参数
    const params = {
      limit: 1000
    }
    
    // 添加语言筛选
    if (selectedLanguages.value.length > 0) {
      params.language = selectedLanguages.value.join(',')
    }
    
    // 添加曲风筛选
    if (selectedStyles.value.length > 0) {
      params.styles = selectedStyles.value.join(',')
    }
    
    // 添加歌手筛选
    if (singerQuery.value) {
      params.q = singerQuery.value
    }
    
    // 获取筛选后的歌曲
    const res = await axios.get('/api/songs', { params })
    
    // 随机打乱歌曲顺序
    const shuffledSongs = res.data.results
      .map(value => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value)
    
    // 限制最多26首用于转盘
    filteredSongs.value = shuffledSongs.slice(0, 26)
    hasFiltered.value = true
    
    // 更新转盘奖项
    updatePrizes()
    
    ElMessage.success(`筛选出 ${filteredSongs.value.length} 首歌曲`)
  } catch (err) {
    console.error('❌ 筛选歌曲失败:', err)
    ElMessage.error('筛选歌曲失败，请稍后重试')
  }
}

// 重置筛选条件
const resetFilters = () => {
  selectedLanguages.value = []
  selectedStyles.value = []
  singerQuery.value = ''
  filteredSongs.value = []
  hasFiltered.value = false
  // 重新初始化转盘奖项
  initializePrizes()
}

// 抽奖开始回调
function startCallback() {
  // 检查是否已经应用了筛选条件
  if (!hasFiltered.value) {
    ElMessage.warning('请先完成筛选条件并点击确定按钮')
    return
  }
  
  // 检查是否有有效歌曲
  if (filteredSongs.value.length === 0) {
    ElMessage.warning('没有符合条件的歌曲，请调整筛选条件')
    return
  }
  
  // 调用抽奖组件的play方法开始游戏
  myLucky.value.play()
  
  // 获取当前奖项数量
  const currentPrizeCount = prizes.value.length
  
  // 模拟调用接口异步抽奖
  setTimeout(() => {
    // 随机生成一个中奖索引 (0到当前奖项数量-1)
    const index = Math.floor(Math.random() * currentPrizeCount)
    // 调用stop停止旋转并传递中奖索引
    myLucky.value.stop(index)
  }, 3000)
}

// 抽奖结束回调
function endCallback(prize) {
  // 检查是否是有效歌曲奖项（有song属性且有id）
  if (prize.song && prize.id) {
    selectedSong.value = prize.song
    showRecordDialog.value = true
  } else {
    ElMessage.info('未抽中有效歌曲')
  }
}

// 选择歌曲（表格中的选择按钮）
function selectSong(song) {
  selectedSong.value = song
  showRecordDialog.value = true
}

// 初始化数据
onMounted(() => {
  loadAllSongs()
  loadStyleOptions()
  // 初始化转盘奖项
  initializePrizes()
})

// 监听弹窗显示状态变化
watch(showDialog, (val) => {
  if (val) {
    // 重新加载数据
    loadAllSongs()
    loadStyleOptions()
  }
})
</script>

<style scoped>
.advanced-blindbox {
  width: 100%;
}

.blindbox-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.filter-section {
  width: 100%;
  max-width: 600px;
  margin-bottom: 20px;
  padding: 20px;
  border: 1px solid #eee;
  border-radius: 8px;
}

.filter-section h3 {
  text-align: center;
  margin-top: 0;
}

.filter-options {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.filter-group label {
  font-weight: bold;
}

/* 复选框组样式 */
.el-checkbox-group {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.el-checkbox {
  margin-right: 0;
}

.filter-actions {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;
}

.wheel-section {
  width: 100%;
  text-align: center;
  padding: 20px 0;
  margin: 0 auto;
  max-width: 600px;
  overflow: visible;
}

.wheel-section h3 {
  margin-bottom: 20px;
}

.lucky-wheel-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: visible;
  padding: 20px;
  box-sizing: content-box;
  margin: 0 auto;
}

.song-list-container {
  padding: 0 20px;
}

.no-songs {
  text-align: center;
  padding: 40px;
  color: #999;
}
</style>

<style>
.advanced-blindbox-dialog {
  max-width: 1300px !important;
  width: 95% !important;
  max-height: 95vh !important;
}

.advanced-blindbox-dialog .el-dialog__body {
  padding: 10px 20px 20px;
  max-height: calc(95vh - 120px);
  overflow-y: visible;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .advanced-blindbox-dialog {
    width: 100% !important;
    max-height: 95vh !important;
  }
  
  .filter-section {
    padding: 15px;
  }
  
  .wheel-section {
    max-width: 450px;
  }
}
</style>