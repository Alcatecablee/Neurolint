const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

app.post('/api/analyze', require('./api/analyze'));
app.get('/api/stream/:jobId', require('./api/stream/[jobId]'));
app.get('/api/result/:jobId', require('./api/result/[jobId]'));
app.get('/api/status', require('./api/status'));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'API server is running' });
});

app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`API server running on http://0.0.0.0:${PORT}`);
  console.log('Available endpoints:');
  console.log(`  POST http://localhost:${PORT}/api/analyze`);
  console.log(`  GET  http://localhost:${PORT}/api/stream/:jobId`);
  console.log(`  GET  http://localhost:${PORT}/api/result/:jobId`);
  console.log(`  GET  http://localhost:${PORT}/api/status`);
});
