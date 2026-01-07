<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import axios from 'axios'
import { ElDialog } from 'element-plus'
import RecordList from './RecordList.vue'

const topSongs = ref([])
const loading = ref(false)
const timeRange = ref('all')
const timeOptions = [
  { label: '全部', value: 'all' },
  { label: '近1月', value: '1m' },
  { label: '近3月', value: '3m' },
  { label: '近1年', value: '1y' },
]

// 推荐语相关
const recommendation = ref('')
const recommendedSongs = ref([])

// 弹窗相关
const showDialog = ref(false)
const selectedSong = ref({})

function showSongRecords(song) {
  selectedSong.value = song
  showDialog.value = true
}

const fetchTopSongs = async () => {
  loading.value = true
  try {
    // 假设后端支持 /api/top_songs?range=xxx
    const res = await axios.get('/api/top_songs', { params: { range: timeRange.value, limit: 15 } })
    topSongs.value = res.data
  } catch (err) {
    topSongs.value = []
  } finally {
    loading.value = false
  }
}

const fetchRecommendation = async () => {
  try {
    const res = await axios.get('/api/recommendation/')
    recommendation.value = res.data.content
    recommendedSongs.value = res.data.recommended_songs || []
  } catch (err) {
    recommendation.value = '欢迎来到热歌榜！'
    recommendedSongs.value = []
  }
}

onMounted(() => {
  fetchTopSongs()
  fetchRecommendation()
})

watch(timeRange, fetchTopSongs)

const minCount = computed(() => topSongs.value.length ? Math.min(...topSongs.value.map(s => s.perform_count)) : 0)
const maxCount = computed(() => topSongs.value.length ? Math.max(...topSongs.value.map(s => s.perform_count)) : 1)
</script>

<template>
  <div class="top-chart-container">
    <!-- 推荐语展示区域 -->
    <div class="recommendation-banner" v-if="recommendation">
      <div class="recommendation-content">
        {{ recommendation }}
      </div>
      <!-- 推荐歌曲按钮 -->
      <div class="recommended-songs" v-if="recommendedSongs.length > 0">
        <el-button 
          v-for="song in recommendedSongs" 
          :key="song.id"
          type="primary" 
          plain
          size="small"
          @click="showSongRecords(song)"
          class="song-button"
        >
          {{ song.song_name }}
        </el-button>
      </div>
    </div>
    
    <div class="top-bar">
      <span style="font-weight:bold;font-size:18px;">热歌榜</span>
      <div class="range-select">
        <label v-for="opt in timeOptions" :key="opt.value" class="range-btn">
          <input type="radio" v-model="timeRange" :value="opt.value" />
          {{ opt.label }}
        </label>
      </div>
    </div>
    
    <div v-loading="loading" class="chart-content">
      <div v-if="topSongs.length > 0" class="bar-list">
        <div v-for="(song, idx) in topSongs" :key="song.id" class="bar-item">
          <div class="bar-rank">{{ idx+1 }}</div>
          <div class="bar-label clickable" @click="showSongRecords(song)">{{ song.song_name }}</div>
          <div class="bar-bar">
            <div class="bar-inner" :style="{ width: ((song.perform_count - minCount) / (maxCount - minCount || 1) * 90 + 10) + '%' }"></div>
            <span class="bar-count">{{ song.perform_count }} 次</span>
          </div>
        </div>
      </div>
      <div v-else class="no-data">暂无数据</div>
    </div>
  </div>
  
  <!-- 歌曲演唱记录弹窗 -->
  <el-dialog
    v-model="showDialog"
    :title="selectedSong.song_name + ' - 演唱记录'"
    width="800px"
    custom-class="song-records-dialog"
  >
    <div style="padding: 20px;">
      <p style="font-size: 16px; color: #666; margin-bottom: 15px;">歌手: {{ selectedSong.singer }}</p>
      <p style="font-size: 16px; color: #666; margin-bottom: 20px;">总演唱次数: {{ selectedSong.perform_count }}</p>
      
      <div style="margin-top: 20px;">
        <h3 style="margin-bottom: 15px; border-bottom: 1px solid #eee; padding-bottom: 10px; text-align: center;">演唱记录</h3>
        <RecordList 
          :song-id="selectedSong.id" 
          :song-name="selectedSong.song_name"
          style="width: 100%;"
        />
      </div>
    </div>
  </el-dialog>
</template>

<style scoped>
.top-chart-container {
  max-width: 1200px;
  min-width: 800px;
  min-height: 420px;
  margin: 0 auto;
  padding: 32px;
  background: rgba(255,255,255,0.7) !important;
  border-radius: 18px;
  box-shadow: none;
}
.top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 30px;
}
.range-select {
  display: flex;
  gap: 10px;
}
.range-btn {
  font-size: 14px;
  color: #666;
  margin-right: 8px;
  cursor: pointer;
}
.range-btn input[type="radio"] {
  margin-right: 3px;
}
.bar-list {
  margin-top: 10px;
}
.bar-item {
  display: flex;
  align-items: center;
  margin-bottom: 18px;
}
.bar-rank {
  width: 28px;
  font-size: 18px;
  font-weight: bold;
  color: #fda5c1;
  text-align: right;
  margin-right: 10px;
}
.bar-label {
  width: 120px;
  text-align: left;
  font-size: 15px;
  color: #333;
  margin-right: 10px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.bar-label.clickable {
  cursor: pointer;
  color: #409EFF;
  text-decoration: underline;
}
.bar-label.clickable:hover {
  color: #fda5c1;
}
.bar-bar {
  flex: 1;
  display: flex;
  align-items: center;
  position: relative;
}
.bar-inner {
  height: 18px;
  background: linear-gradient(90deg, #fda5c1 60%, #fbc2eb 100%);
  border-radius: 9px;
  transition: width 0.5s;
}
.bar-count {
  margin-left: 12px;
  font-size: 14px;
  color: #888;
  min-width: 40px;
}
.no-data {
  text-align: center;
  color: #888;
  margin: 40px 0;
  font-size: 16px;
}

/* 自定义loading样式 */
.chart-content :deep(.el-loading-mask) {
  background-color: rgba(255, 255, 255, 0.8);
}

.chart-content :deep(.el-loading-spinner .circular) {
  width: 42px;
  height: 42px;
}

/* 推荐语样式 */
.recommendation-banner {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 30px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  animation: fadeIn 0.5s ease-in;
}

.recommendation-content {
  color: white;
  font-size: 18px;
  font-weight: 500;
  text-align: center;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  margin-bottom: 15px;
}

.recommended-songs {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 10px;
}

.song-button {
  background: rgba(255, 255, 255, 0.2) !important;
  border: 1px solid rgba(255, 255, 255, 0.3) !important;
  color: white !important;
  border-radius: 20px !important;
  transition: all 0.3s ease;
}

.song-button:hover {
  background: rgba(255, 255, 255, 0.3) !important;
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
