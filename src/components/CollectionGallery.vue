<template>
  <div class="collection-gallery" v-loading="loading">
    <div 
      v-for="collection in sortedCollections" 
      :key="collection.id" 
      class="collection-section"
    >
      <!-- 合集标题在上 -->
      <div class="collection-header">
        <h2 class="collection-title">{{ collection.name }}</h2>
        <span class="works-count">({{ collection.works_count }}个作品)</span>
      </div>
      
      <!-- 合集内容在下 -->
      <div class="works-container">
        <div 
          v-for="work in getSortedWorks(collection)" 
          :key="work.id" 
          class="work-card"
          @click="openWorkDialog(work)"
        >
          <div class="work-cover">
            <img v-lazyload="work.cover_url" :alt="work.title" class="work-image">
          </div>
          <div class="work-info">
            <h4 class="work-title">{{ work.title }}</h4>
            <p class="work-author">UP主: {{ work.author }}</p>
            <p class="work-notes" v-if="work.notes">{{ work.notes }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>

  
  
  <!-- 视频播放弹窗 -->
  <VideoPlayerDialog
    v-if="selectedWork"
    v-model:visible="showPlayer"
    :url="selectedWork.view_url"
    :songName="selectedWork.title"
  />
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import VideoPlayerDialog from './VideoPlayerDialog.vue'
import { ElLoading } from 'element-plus'

const collections = ref([])
const selectedWork = ref(null)
const showPlayer = ref(false)
const loading = ref(false)

// 根据position字段排序的合集（position数值大的在上面）
const sortedCollections = computed(() => {
  return [...collections.value].sort((a, b) => {
    // 首先按position降序排序，然后按display_order排序，最后按创建时间排序
    if (a.position !== b.position) {
      return b.position - a.position  // 降序排列
    }
    if (a.display_order !== b.display_order) {
      return a.display_order - b.display_order
    }
    // 如果是字符串时间，需要转换为日期对象进行比较
    const dateA = new Date(a.created_at)
    const dateB = new Date(b.created_at)
    return dateB - dateA
  })
})

// 获取合集数据
const fetchData = async () => {
  loading.value = true
  try {
    // 获取所有合集，按position排序
    const res = await axios.get('/api/fansDIY/collections/')
    const list = res.data.results || []
    
    // 并发获取每个合集的作品
    const worksList = await Promise.all(
      list.map(async col => {
        const res2 = await axios.get('/api/fansDIY/works/', { params: { collection: col.id } })
        return { ...col, works: res2.data.results || [] }
      })
    )
    
    collections.value = worksList
  } catch (error) {
    console.error('获取合集数据失败:', error)
  } finally {
    loading.value = false
  }
}

// 获取排序后的作品（position数值大的在上面）
const getSortedWorks = (collection) => {
  if (!collection || !collection.works) {
    return []
  }
  return [...collection.works].sort((a, b) => {
    // 首先按position降序排序，然后按display_order排序，最后按ID排序
    if (a.position !== b.position) {
      return b.position - a.position  // 降序排列
    }
    if (a.display_order !== b.display_order) {
      return a.display_order - b.display_order
    }
    return b.id - a.id
  })
}

// 查看作品详情
const openWorkDialog = (work) => {
  selectedWork.value = work
  // 如果有视频链接，直接打开视频播放器
  if (work.view_url) {
    showPlayer.value = true
  }
}



onMounted(fetchData)
</script>

<style scoped>
.collection-gallery {
  padding: 20px;
  min-height: 400px;
}

/* 自定义loading样式 */
.collection-gallery :deep(.el-loading-mask) {
  background-color: rgba(255, 255, 255, 0.8);
}

.collection-gallery :deep(.el-loading-spinner .circular) {
  width: 42px;
  height: 42px;
}

.collection-section {
  margin-bottom: 40px;
}

.collection-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #eee;
}

.collection-title {
  margin: 0;
  font-size: 24px;
  font-weight: bold;
  color: #333;
}

.works-count {
  margin-left: 12px;
  font-size: 16px;
  color: #666;
}

.works-container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.work-card {
    background: #f9f9f9;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    transition: all 0.2s ease;
    cursor: pointer;
  }

.work-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.work-cover {
  position: relative;
  width: 100%;
  padding-top: 56.25%; /* 16:9 宽高比 */
  overflow: hidden;
}

.work-cover .work-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.work-card:hover .work-image {
  transform: scale(1.05);
}

.work-info {
  padding: 12px;
}

.work-title {
  margin: 0 0 6px 0;
  font-size: 15px;
  font-weight: bold;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.work-author {
  margin: 0;
  font-size: 13px;
  color: #666;
}

.work-notes {
  margin: 4px 0 0 0;
  font-size: 12px;
  color: #999;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}



/* 响应式设计 */
@media (max-width: 1200px) {
  .works-container {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (max-width: 992px) {
  .works-container {
    grid-template-columns: repeat(4, 1fr);
  }
  
  .work-cover {
    padding-top: 56.25%; /* 保持16:9宽高比 */
  }
}

@media (max-width: 768px) {
  .collection-gallery {
    padding: 16px;
  }
  
  .collection-header {
    margin-bottom: 16px;
  }
  
  .collection-title {
    font-size: 20px;
  }
  
  .works-container {
    gap: 16px;
    grid-template-columns: repeat(4, 1fr);
  }
  
  .work-cover {
    padding-top: 56.25%; /* 保持16:9宽高比 */
  }
  
  
}

@media (max-width: 576px) {
  .works-container {
    grid-template-columns: repeat(4, 1fr);
  }
  
  .work-cover {
    padding-top: 56.25%; /* 保持16:9宽高比 */
  }
}
</style>