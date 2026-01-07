<template>
  <div style="padding: 10px 30px; width: 100%;">
    <div v-if="loading" style="text-align: center; color: #666; padding: 20px;">
      <span>加载中...</span>
    </div>
    <div v-else-if="records && records.length > 0">
      <div class="record-card-list">
        <div
            v-for="(record, index) in records"
            :key="`${props.songId}-${index}`"
            class="record-card"
        >
            <img
            v-if="record.cover_url"
            :src="record.cover_url"
            alt="cover"
            class="record-cover"
            @error="e => (e.target.src = '/covers/default.jpg')"
            />

          <div class="record-time clickable" @click="openPlayer(record.url)">
            ▶ {{ record.performed_at }}
            </div>
            <div class="record-notes">{{ record.notes || '' }}</div>
        </div>

        <div ref="loadingMoreRef" style="text-align: center; padding: 12px; min-height: 1px;">
          <span v-if="loadingMore">加载中...</span>
          <span v-else-if="!hasMore" style="color: #999;">已全部加载</span>
        </div>
      </div>
    </div>
    <div v-else style="padding: 20px; color: #999; text-align: center;">
      暂无演唱记录
    </div>
  </div>

  <VideoPlayerDialog
    v-model:visible="showPlayer"
    :url="currentUrl"
    :songName="props.songName"
  />
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'
import VideoPlayerDialog from '../components/VideoPlayerDialog.vue'

const props = defineProps({
  songId: { type: Number, required: true },
  songName: { type: String, required: true }
})

const showPlayer = ref(false)
const currentUrl = ref('')
const records = ref([])
const loading = ref(false)
const loadingMore = ref(false)
const hasMore = ref(true)
const page = ref(1)
const pageSize = 20
const total = ref(0)

const recordCache = ref({})  // 替代 Map

const loadingMoreRef = ref(null)
let observer = null

const openPlayer = (url) => {
  if (!url) {
    ElMessage.warning('暂无视频链接')
    return
  }
  currentUrl.value = url
  showPlayer.value = true
}

const fetchRecords = async (reset = false) => {
  if (reset) {
    page.value = 1
    records.value = []
    hasMore.value = true
    total.value = 0
  }
  if (!hasMore.value && !reset) return
  if (loading.value || loadingMore.value) return
  if (reset) loading.value = true
  else loadingMore.value = true
  try {
    const res = await axios.get(`/api/songs/${props.songId}/records`, {
      params: { page: page.value, page_size: pageSize }
    })
    const data = res.data.results || res.data
    total.value = res.data.total || 0
    if (reset) {
      records.value = data
    } else {
      records.value = records.value.concat(data)
    }
    if (data.length < pageSize || records.value.length >= total.value) {
      hasMore.value = false
    } else {
      page.value += 1
    }
    recordCache.value[props.songId] = records.value
  } catch (err) {
    ElMessage.error('加载失败，请稍后重试')
  } finally {
    loading.value = false
    loadingMore.value = false
  }
}

// 监听 songId 变化，重置分页
watch(() => props.songId, (newId) => {
  if (newId) fetchRecords(true)
}, { immediate: true })

function setupObserver() {
  if (observer) observer.disconnect()
  observer = new window.IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && hasMore.value && !loadingMore.value && !loading.value) {
      fetchRecords(false)
    }
  }, { root: null, threshold: 0.1 })
  nextTick(() => {
    if (loadingMoreRef.value) {
      observer.observe(loadingMoreRef.value)
    }
  })
}

onMounted(() => {
  setupObserver()
})
onBeforeUnmount(() => {
  if (observer) observer.disconnect()
})

watch([records, hasMore], () => {
  setupObserver()
})

// 自动填满页面（如有需要）
async function autoFillList() {
  await nextTick()
  const el = document.documentElement
  if (!el) return
  while (el.scrollHeight <= el.clientHeight && hasMore.value) {
    await fetchRecords(false)
    await nextTick()
  }
}
watch(records, () => {
  autoFillList()
})
</script>

<style scoped>
.video-wrapper {
  position: relative;
  width: 100%;
  padding-top: 56.25%;
  background-color: black;
}

.video-wrapper iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: none;
}

.clickable {
  cursor: pointer;
  color: #409EFF;
  font-weight: bold;
}
.clickable:hover {
  text-decoration: underline;
}

.record-card-list {
  display: flex;
  flex-wrap: wrap;
  gap: 13px;
  justify-content: center;
}

.record-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 12px 16px;
  width: calc(20% - 12px);
  box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.05);
  background-color: #fafafa;
  transition: box-shadow 0.3s;
  min-width: 150px;
}

.record-card:hover {
  box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.1);
}

.record-notes {
  margin-top: 6px;
  font-size: 13px;
  color: #333;
  white-space: pre-line;
}

.record-cover {
  width: 100%;
  height: 140px;
  object-fit: cover;
  border-radius: 6px;
  margin-bottom: 8px;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .record-card {
    width: calc(20% - 12px);
  }
}

@media (max-width: 600px) {
  .record-card {
    width: calc(33.333% - 10px);
  }
}

@media (max-width: 480px) {
  .record-card {
    width: calc(50% - 10px);
  }
}
</style>

<style>
.el-overlay-dialog {
  z-index: 3000 !important;
}

.el-dialog__body {
  padding: 0 !important;
  background-color: #fff !important;
  max-height: 80vh;
  overflow-y: auto;
}

.song-list-container {
  z-index: auto !important;
  position: relative;
}
</style>