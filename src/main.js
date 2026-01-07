import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
//================= 引入 Element Plus ========================
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

//================= 引入懒加载指令 ========================
import lazyLoad from './directives/lazyLoad.js'

// createApp(App).use(router).mount('#app')
const app = createApp(App)
app.use(ElementPlus)
app.use(router)
app.directive('lazyload', lazyLoad)
app.mount('#app')