<template>
  <div class="replay-view">
    <div class="sidebar">
      <RecordingList @select="setCurrentRecording" />
    </div>
    <div class="main-content">
      <VideoPlayer 
        :current-recording="currentRecording" 
        v-if="currentRecording"
      />
      <div v-else class="empty-player">
        <div class="empty-message">
          <img src="@/assets/empty-video.png" alt="空状态" width="120">
          <p>请从左侧选择回放视频</p>
        </div>
      </div>
    </div>
  </div>
  <!-- 聊天室面板 -->
    <div class="chat-panel">
      <ChatRoom />
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import RecordingList from '@/components/RecordingList.vue';
import VideoPlayer from '@/components/VideoPlayer.vue';
import ChatRoom from '@/components/ChatRoom.vue';

interface Recording {
  id: string;
  title: string;
  description: string;
  filename: string;
}

const currentRecording = ref<Recording | null>(null);

function setCurrentRecording(recording: Recording) {
  currentRecording.value = recording;
}
</script>

<style scoped>
.replay-view {
  display: flex;
  min-height: 100vh;
  background: #f5f7fa;
}

.sidebar {
  width: 320px;
  padding: 15px;
  background: white;
  border-right: 1px solid #e0e0e0;
  overflow-y: auto;
  box-shadow: 1px 0 5px rgba(0,0,0,0.05);
}

.main-content {
  flex: 1;
  padding: 20px;
  background: white;
  display: flex;
  justify-content: center;
  align-items: flex-start;
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

.chat-panel {
  width: 340px;
  padding: 20px 10px 20px 20px;
  background: #fff;
  border-left: 1px solid #e0e0e0;
  box-shadow: -1px 0 5px rgba(0,0,0,0.03);
  display: flex;
  flex-direction: column;
}
</style>