<template>
  <el-table-column type="expand" label="演唱记录" width="120">
    <template #default="props">
      <RecordList 
        :song-id="props.row.id" 
        :song-name="props.row.song_name"
      />
    </template>
  </el-table-column>
</template>

<script setup>
import RecordList from '../views/RecordList.vue'
</script>

<style scoped>
/* 可以根据需要添加样式 */
</style>