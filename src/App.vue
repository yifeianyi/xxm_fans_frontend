<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import NavBar from './components/NavBar.vue'
const router = useRouter()
const activeIndex = ref('1')

const handleSelect = (key) => {
  router.push(key)
}
</script>

<template>
  <NavBar />
  <!-- <xxmCard /> -->
  <el-container style="min-height: 100vh;">
    <el-main style="padding-top: 70px;">
      <router-view />
    </el-main>
    <el-footer class="footer">
      <div class="footer-content">
        <p class="beian-info">
          <a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener noreferrer">
            备案号：鄂ICP备2025100707号-2
          </a>
        </p>
        <p class="copyright">
          © 2025 小满虫之家. All rights reserved.
        </p>
      </div>
    </el-footer>
  </el-container>
</template>
<style>
html, body {
  margin: 0;
  padding: 0;
  min-height: 100vh;
  background-image: url('./assets/background.jpg'); /* ✅ 替换为你的图片路径 */
  background-repeat: repeat-y;
  background-size: 100% auto;
  background-position: top center;
  background-attachment: scroll;
  overflow-x: hidden;
  background-color: #fff9f2;
}

.footer {
  background: transparent;
  border-top: 1px solid rgba(253, 165, 193, 0.2);
  padding: 20px 0;
  text-align: center;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.beian-info {
  margin: 0 0 8px 0;
  font-size: 14px;
  color: #666;
}

.beian-info a {
  color: #666;
  text-decoration: none;
  transition: color 0.3s;
}

.beian-info a:hover {
  color: #fda5c1;
}

.copyright {
  margin: 0;
  font-size: 12px;
  color: #999;
}
</style>
