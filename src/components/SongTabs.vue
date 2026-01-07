<template>
  <div class="song-tabs-wrapper">
    <div class="custom-tabs" @mouseleave="resetSlider">
      <!-- 滑动指示器 -->
      <div class="tab-slider" ref="slider"></div>
      <div
        class="tab-btn"
        :class="{ active: activeTab === 'top' }"
        @click="switchTab('top')"
        @mouseenter="slideToTab('top')"
        data-tab="top"
      >热歌榜</div>
      <div
        class="tab-btn"
        :class="{ active: activeTab === 'songs' }"
        @click="switchTab('songs')"
        @mouseenter="slideToTab('songs')"
        data-tab="songs"
      >满的歌声</div>
    </div>
    <div class="card-content-bg">
      <div class="tab-content">
        <transition name="fade" mode="out-in">
          <div :key="activeTab">
            <TopChart v-if="activeTab === 'top'" />
            <SongList v-else />
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'

// ✅ 直接引用两个页面
// import TopChart from './TopChart.vue'
import SongList from '../views/SongList.vue'
import TopChart from '../views/TopChart.vue'

const activeTab = ref('songs')
const slider = ref(null)
const activeTabElement = ref(null)

function switchTab(tab) {
  activeTab.value = tab
  // 延迟执行以确保DOM更新
  nextTick(() => {
    slideToTab(tab)
  })
}

function slideToTab(tab) {
  // 延迟执行以确保DOM更新
  nextTick(() => {
    const targetBtn = document.querySelector(`.tab-btn[data-tab="${tab}"]`)
    if (targetBtn && slider.value) {
      const rect = targetBtn.getBoundingClientRect()
      const parentRect = targetBtn.parentElement.getBoundingClientRect()
      
      // 计算相对位置
      const left = rect.left - parentRect.left
      const width = rect.width
      
      // 设置滑块样式
      slider.value.style.width = `${width}px`
      slider.value.style.left = `${left}px`
    }
  })
}

function resetSlider() {
  if (slider.value) {
    // 重置滑块到当前激活的tab
    slideToTab(activeTab.value)
  }
}

onMounted(() => {
  // 初始化滑块位置
  slideToTab(activeTab.value)
})
</script>

<style scoped>
.song-tabs-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px 20px 40px 20px;
  position: relative;
  background: transparent;
}
.custom-tabs {
  display: flex;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 26px;
  margin-bottom: 10px;
  padding: 4px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  position: relative;
  overflow: hidden;
}
.tab-slider {
  position: absolute;
  height: 48px;
  background: linear-gradient(135deg, #fda5c1, #f8b88a);
  border-radius: 22px;
  transition: all 0.3s ease;
  z-index: 0;
  top: 4px;
  opacity: 0.9;
}
.tab-btn {
  flex: 1;
  height: 48px;
  font-size: 16px;
  font-weight: 500;
  color: #2c2c2c;
  background: transparent;
  border: none;
  outline: none;
  cursor: pointer;
  transition: all 0.3s ease;
  user-select: none;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 22px;
  font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
  position: relative;
  z-index: 1;
}
.tab-btn.active {
  background: transparent;
  color: #ffffff;
  font-weight: 500;
  box-shadow: none;
  text-shadow: 0 0 6px rgba(120, 0, 0, 0.8);
}

.tab-btn:not(.active) {
  color: #2c2c2c;
}
.tab-btn:hover:not(.active) {
  background: rgba(253, 165, 193, 0.2);
  color: #d81b60;
}
.card-content-bg {
  background: rgba(255, 255, 255, 0.5);
  border-radius: 20px;
  width: 100%;
}
.tab-content {
  padding: 32px;
  min-height: 300px;
  background-color: rgba(255, 255, 255, 0.5);
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
  position: relative;
  overflow: hidden;
}

/* 淡入淡出动画 */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
.blindbox-content {
  text-align: center;
  padding: 20px;
}
.no-songs {
  font-size: 16px;
  color: #999;
  margin-top: 50px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .custom-tabs {
    margin: 0 10px 10px;
  }
  .tab-btn {
    font-size: 15px;
    height: 42px;
  }
  .tab-content {
    padding: 20px 16px;
  }
}
</style>
