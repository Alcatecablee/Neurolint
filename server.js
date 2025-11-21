const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.use((req, res, next) => {
  console.log(`[SERVER] ${req.method} ${req.path}`);

  // Log body parsing for POST/PUT requests
  if ((req.method === 'POST' || req.method === 'PUT') && req.path.includes('/api/')) {
    console.log('[SERVER] Body type:', typeof req.body, 'is object:', typeof req.body === 'object');
    if (req.body && typeof req.body === 'object') {
      console.log('[SERVER] Body keys:', Object.keys(req.body));
    }
  }

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
