<template>
  <div class="chat-room">
    <div class="user-bar">
      <input v-model="userInput" placeholder="输入用户名" class="user-input" />
      <button @click="setUser">确定</button>
      <span class="current-user">当前用户名：{{ user }}</span>
    </div>
    <div class="messages">
      <div v-for="(msg, idx) in messages" :key="idx" class="msg">
        <span class="user">{{ msg.user }}：</span>
        <span class="text">{{ msg.text }}</span>
      </div>
    </div>
    <form @submit.prevent="send">
      <input v-model="input" placeholder="输入消息..." autocomplete="off" />
      <button type="submit">发送</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const messages = ref<{ user: string; text: string }[]>([]);
const input = ref('');
let ws: WebSocket | null = null;

const userInput = ref('');
const user = ref('用户' + Math.floor(Math.random() * 1000));

function setUser() {
  if (userInput.value.trim()) {
    user.value = userInput.value.trim();
    userInput.value = '';
  }
}

function send() {
  if (input.value.trim() && ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({ user: user.value, text: input.value }));
    input.value = '';
  }
}

onMounted(() => {
  ws = new WebSocket('ws://localhost:3000/chat');
  ws.onmessage = async (event) => {
    if (event.data instanceof Blob) {
      const text = await event.data.text();
      try {
        const msg = JSON.parse(text);
        messages.value.push(msg);
      } catch (e) {}
    } else {
      try {
        const msg = JSON.parse(event.data);
        messages.value.push(msg);
      } catch (e) {}
    }
  };
});

onUnmounted(() => {
  ws?.close();
});
</script>

<style scoped>
.chat-room {
  background: #fff;
  border-radius: 6px;
  border: 1px solid #e0e0e0;
  padding: 10px;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.user-bar {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  gap: 8px;
}
.user-input {
  flex: 0 0 120px;
  padding: 4px 8px;
  border: 1px solid #ccc;
  border-radius: 3px;
}
.current-user {
  color: #888;
  font-size: 13px;
}
.messages {
  flex: 1;
  color: black;
  overflow-y: auto;
  margin-bottom: 10px;
}
.msg {
  margin-bottom: 6px;
  font-size: 14px;
  word-break: break-all;
}
.user {
  color: #1976d2;
  font-weight: bold;
}
form {
  display: flex;
  gap: 6px;
}
input {
  flex: 1;
  padding: 4px 8px;
  border: 1px solid #ccc;
  border-radius: 3px;
}
button {
  padding: 4px 12px;
  border: none;
  background: #1976d2;
  color: #fff;
  border-radius: 3px;
  cursor: pointer;
}
button:hover {
  background: #1565c0;
}
</style>