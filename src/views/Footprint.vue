<template>
  <div class="footprint-page">
    <div class="card-content-bg">
      <div class="tab-content">
        <!-- 使用新的合集画廊组件 -->
        <CollectionGallery />
      </div>
    </div>
  </div>
</template>

<script setup>
import CollectionGallery from '../components/CollectionGallery.vue'
</script>

<style scoped>
.footprint-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px 20px 40px 20px;
  min-height: 400px;
  text-align: center;
  position: relative;
  background: transparent;
}

.card-content-bg {
  background: transparent;
  border-radius: 20px;
  width: 66vw;
  max-width: 1200px;
  min-width: 350px;
  margin: 0 auto;
}

.tab-content {
  padding: 32px 0 32px 0;
  min-height: 300px;
  background-color: rgba(250, 250, 250, 0.6);
}

@media (max-width: 768px) {
  .card-content-bg {
    width: 95vw;
  }
}
</style>