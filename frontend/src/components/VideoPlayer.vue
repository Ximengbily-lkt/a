<template>
  <div class="video-player">
    <video
      v-if="currentRecording"
      :src="`http://localhost:3000/api/stream/${currentRecording.filename}`"
      controls
      width="100%"
      style="max-width:800px;"
    ></video>
    <div v-else class="empty-player">
      <div class="empty-message">
        <img src="@/assets/empty-video.png" alt="空状态" width="120">
        <p>请从左侧选择回放视频</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  currentRecording: {
    id: string;
    title: string;
    description: string;
    filename: string;
  } | null;
}>();
</script>

<style scoped>
.video-player {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.empty-player {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.empty-message {
  text-align: center;
  color: #888;
}
.empty-message img {
  opacity: 0.6;
  margin-bottom: 15px;
}
.empty-message p {
  margin: 0;
  font-size: 16px;
}
</style>