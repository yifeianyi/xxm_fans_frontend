<template>
  <div class="navbar">
    <div class="navbar-content">
      <el-button link @click="go('/songs')" :class="{active: isActive('/songs')}">满的歌声</el-button>
      <div class="navbar-center">
        <img src="/covers/favicon.ico" class="logo" alt="logo" />
        <span class="title">小满虫之家</span>
      </div>
      <el-button link @click="go('/fansDIY')" :class="{active: isActive('/fansDIY')}">精选二创</el-button>
    </div>
  </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'
const router = useRouter()
const route = useRoute()
function go(path) {
  router.push(path)
}
function isActive(path) {
  return route.path.startsWith(path)
}
</script>

<style scoped>
.navbar {
  width: 100%;
  height: 60px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4vw;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
  box-sizing: border-box;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  border-bottom: 1px solid rgba(248, 165, 194, 0.2);
}
.navbar-content {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 1200px;
}
.navbar-center {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 30px;
}
.logo {
  width: 40px;
  height: 40px;
  margin-right: 12px;
  border-radius: 50%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
.title {
  font-size: 22px;
  font-weight: 700;
  color: #000000;
}
.navbar-content .el-button {
  font-size: 16px;
  color: #444444;
  transition: all 0.3s ease;
  position: relative;
  font-weight: 500;
}
.navbar-content .el-button.active, .navbar-content .el-button:hover {
  color: #f8a5c2;
  font-weight: 600;
}
.navbar-content .el-button.active::after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 0;
  width: 100%;
  height: 3px;
  background: linear-gradient(90deg, #f8a5c2, #e9967a);
  border-radius: 2px;
}
@media (max-width: 600px) {
  .navbar {
    padding: 0 8px;
    height: 50px;
  }
  .title {
    font-size: 18px;
    font-weight: 700;
    color: #000000;
  }
  .logo {
    width: 32px;
    height: 32px;
  }
  .navbar-content .el-button {
    font-size: 14px;
    padding: 0 6px;
  }
  .navbar-center {
    margin: 0 15px;
  }
}
</style> 