const express = require('express');
const http = require('http');
const cors = require('cors');
const helmet = require('helmet');
const { Server } = require('socket.io');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');

const executeRoute = require('./routes/execute');
const snippetsRoute = require('./routes/snippets');
const dsaExamplesRoute = require('./routes/dsaExamples');
const problemsRoute = require('./routes/problems');
const explainRoute = require('./routes/explain');
const { seedProblems } = require('./data/seedProblems');

const app = express();
const server = http.createServer(app);

// ─── Socket.io ────────────────────────────────────────────────────────────────
const io = new Server(server, {
  cors: { origin: ['http://localhost:5173', 'http://127.0.0.1:5173'], methods: ['GET', 'POST'] },
});
app.set('io', io);

// ─── Middleware ────────────────────────────────────────────────────────────────
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: ['http://localhost:5173', 'http://127.0.0.1:5173'] }));
app.use(express.json({ limit: '100kb' }));

// Rate limiting — 20 execute requests per minute per IP
const executeLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  message: { error: 'Too many execution requests. Please wait a moment.' },
});
app.use('/api/execute', executeLimiter);

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/execute', executeRoute);
app.use('/api/snippets', snippetsRoute);
app.use('/api/dsa-examples', dsaExamplesRoute);
app.use('/api/problems', problemsRoute);
app.use('/api/explain', explainRoute);

app.get('/api/health', (req, res) => res.json({ status: 'ok', time: new Date().toISOString() }));

// ─── Socket.io events ─────────────────────────────────────────────────────────
io.on('connection', (socket) => {
  console.log('[Socket] client connected:', socket.id);
  socket.on('disconnect', () => console.log('[Socket] client disconnected:', socket.id));
});

// ─── MongoDB ──────────────────────────────────────────────────────────────────
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/codeviz';

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('[MongoDB] Connected to', MONGO_URI);
    seedProblems();
  })
  .catch((err) => {
    console.warn('[MongoDB] Connection failed — snippet persistence disabled:', err.message);
  });


// ─── Start server ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`[CodeViz Server] Running on http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  server.close(() => {
    mongoose.connection.close();
    process.exit(0);
  });
});
