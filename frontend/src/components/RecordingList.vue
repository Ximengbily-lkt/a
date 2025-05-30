<template>
  <div class="recording-list">
    <h2>直播回放</h2>
    <div v-if="loading" class="loading">加载中...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else-if="recordings.length === 0" class="empty">暂无回放视频</div>
    <ul v-else class="recordings">
      <li 
        v-for="recording in recordings" 
        :key="recording.id" 
        @click="selectRecording(recording)"
        :class="{ 'active': isActive(recording) }"
      >
        <div class="recording-item">
          <h3>{{ recording.title }}</h3>
          <p class="description">{{ recording.description }}</p>
          <p class="meta">创建时间: {{ formatDate(recording.createdAt) }}</p>
          <p class="meta">时长: {{ formatDuration(recording.duration) }}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';

interface Recording {
  id: string;
  title: string;
  description: string;
  filename: string;
  createdAt: string | Date;
  duration: number;
}

const recordings = ref<Recording[]>([]);
const loading = ref(true);
const error = ref('');
const selectedId = ref<string | null>(null);

const emit = defineEmits(['select']);

onMounted(async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/recordings');
    recordings.value = response.data.map((item: any) => {
      let createdAt: Date;
      if (item.createdAt) {
        const d = new Date(item.createdAt);
        createdAt = isNaN(d.getTime()) ? new Date() : d;
      } else {
        createdAt = new Date();
      }
      return {
        id: item.id ?? '',
        title: item.title ?? '',
        description: item.description ?? '',
        filename: item.filename ?? '',
        duration: item.duration ?? 0,
        createdAt
      };
    });
  } catch (err) {
    error.value = '加载回放列表失败';
    console.error(err);
  } finally {
    loading.value = false;
  }
});

// 更健壮的日期格式化
function formatDate(date: string | Date) {
  try {
    const d = date instanceof Date ? date : new Date(date);
    return isNaN(d.getTime()) ? '未知时间' : d.toLocaleDateString() + ' ' + d.toLocaleTimeString();
  } catch {
    return '未知时间';
  }
}

// 更安全的时长格式化
function formatDuration(seconds: number) {
  if (!seconds || isNaN(seconds)) return '00:00:00';
  seconds = Math.floor(seconds);
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

function selectRecording(recording: Recording) {
  selectedId.value = recording.id;
  emit('select', recording);
}

function isActive(recording: Recording) {
  return selectedId.value === recording.id;
}
</script>

<style scoped>
.recording-list {
  max-width: 100%;
  background: #f8f9fa;
  padding: 15px;
  height: 100%;
}

.recordings {
  list-style: none;
  padding: 0;
  margin: 0;
}

.recording-item {
  padding: 12px;
  margin-bottom: 8px;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid #e0e0e0;
}

.recording-item:hover {
  background: #e9f5ff;
  border-color: #cce0ff;
}

.recording-item.active {
  background: #d1e7ff;
  border-color: #99c2ff;
}

.recording-item h3 {
  margin: 0 0 5px 0;
  color: #333;
  font-size: 16px;
}

.recording-item .description {
  margin: 0 0 8px 0;
  color: #666;
  font-size: 14px;
}

.meta {
  margin: 4px 0 0 0;
  font-size: 12px;
  color: #888;
}

.loading, .error, .empty {
  text-align: center;
  padding: 20px;
  color: #666;
}
</style>