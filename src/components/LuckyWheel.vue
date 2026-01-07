<template>
  <div class="lucky-wheel-container">
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
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import axios from 'axios'

// 引入大转盘组件
import { LuckyWheel } from '@lucky-canvas/vue'

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

// 生成20个奖项
const prizes = ref([])
const generatePrizes = () => {
  const prizeList = []
  for (let i = 0; i < 20; i++) {
    prizeList.push({
      fonts: [{ text: `奖品${i}`, top: '10%', color: '#4a90e2' }], // 蓝色文字
      background: i % 2 === 0 ? '#ffffff' : '#e6f2ff' // 白色和浅蓝色交替
    })
  }
  prizes.value = prizeList
}

// 初始化奖项
onMounted(() => {
  generatePrizes()
})

// 抽奖开始回调
function startCallback() {
  // 调用抽奖组件的play方法开始游戏
  myLucky.value.play()
  
  // 模拟调用接口异步抽奖
  setTimeout(() => {
    // 随机生成一个中奖索引 (0-19)
    const index = Math.floor(Math.random() * 20)
    // 调用stop停止旋转并传递中奖索引
    myLucky.value.stop(index)
  }, 3000)
}

// 抽奖结束回调
function endCallback(prize) {
  ElMessage.success(`恭喜你抽中了: ${prize.fonts[0].text}`)
  console.log('中奖信息:', prize)
}
</script>

<style scoped>
.lucky-wheel-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  overflow: visible;
}
</style>