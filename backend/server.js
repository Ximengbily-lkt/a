const express = require('express');
const multer = require('multer');
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const cors = require('cors');
const fs = require('fs');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const port = 3000;

// 启用CORS
app.use(cors());
app.use(express.json());

// 配置上传存储
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// 存储直播回放信息
let liveRecordings = [{
  id: '1',
  filename: 'test.mp4',
  title: '测试视频',
  description: '示例回放视频',
  status: 'ready',
  duration: 10
},
{
  id: '2',
  filename: '许嵩-乌鸦.mp4',
  title: '测试视频2',
  description: '示例回放视频2',
  status: 'ready',
  duration: 385
}
];

// 上传直播流端点
app.post('/api/upload-stream', upload.single('stream'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const recording = {
    id: Date.now().toString(),
    filename: req.file.filename,
    originalname: req.file.originalname,
    path: req.file.path,
    createdAt: new Date(),
    title: req.body.title || 'Untitled Stream',
    description: req.body.description || '',
    duration: 0,
    status: 'processing'
  };

  liveRecordings.push(recording);

  // 模拟处理视频(实际应用中应使用FFmpeg进行处理)
  setTimeout(() => {
    recording.status = 'ready';
    recording.duration = 3600; // 假设1小时
    console.log(`Recording ${recording.id} processed`);
  }, 5000);

  res.json({ id: recording.id });
});

// 获取所有回放列表
app.get('/api/recordings', (req, res) => {
  res.json(liveRecordings.filter(r => r.status === 'ready'));
});

// 获取单个回放信息
app.get('/api/recordings/:id', (req, res) => {
  const recording = liveRecordings.find(r => r.id === req.params.id);
  if (!recording) {
    return res.status(404).json({ error: 'Recording not found' });
  }
  res.json(recording);
});

// 视频流端点
app.get('/api/stream/:filename', (req, res) => {
  const filePath = path.join(__dirname, 'uploads', req.params.filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).send('File not found');
  }

  const stat = fs.statSync(filePath);
  const fileSize = stat.size;
  const range = req.headers.range;

  if (range) {
    // 处理部分内容请求(流式播放)
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize-1;
    const chunksize = (end-start)+1;
    const file = fs.createReadStream(filePath, {start, end});
    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'video/mp4',
    };

    res.writeHead(206, head);
    file.pipe(res);
  } else {
    // 完整文件请求
    const head = {
      'Content-Length': fileSize,
      'Content-Type': 'video/mp4',
    };
    res.writeHead(200, head);
    fs.createReadStream(filePath).pipe(res);
  }
});

// ===== WebSocket 聊天室功能整合 =====
const server = http.createServer(app);

const wss = new WebSocket.Server({ server, path: '/chat' });

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    // 广播给所有客户端
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });
});

// 用 server.listen 启动服务（替换 app.listen）
server.listen(port, () => {
  console.log(`HTTP/WS server running at http://localhost:${port}`);
});