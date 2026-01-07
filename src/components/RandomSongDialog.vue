<template>
  <div style="text-align: center; padding: 20px;">
    <p style="font-size: 18px; margin-bottom: 10px;">{{ song.song_name }}</p>
    <p style="font-size: 14px; color: #666; margin-bottom: 15px;">{{ song.singer }}</p>
    <p style="font-size: 14px; color: #999;">演唱次数: {{ song.perform_count }}</p>
    
    <div style="margin-top: 20px; text-align: left;">
      <h3 style="margin-bottom: 10px;">演唱记录</h3>
      <RecordList 
        :song-id="song.id" 
        :song-name="song.song_name"
      />
    </div>
  </div>
</template>

<script setup>
import RecordList from '../views/RecordList.vue'

const props = defineProps({
  song: {
    type: Object,
    required: true
  }
})
</script>