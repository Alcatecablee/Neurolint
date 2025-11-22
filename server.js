/**
 * NeuroLint API Server
 * 
 * Copyright (c) 2025 NeuroLint
 * Licensed under the Business Source License 1.1
 * 
 * Use Limitation: You may not use this software to provide a commercial
 * SaaS offering that competes with NeuroLint's code transformation services.
 * 
 * Change Date: 2029-11-22
 * Change License: GPL-3.0-or-later
 * 
 * For commercial licensing: contact@neurolint.dev
 * Full license: https://github.com/Alcatecablee/Neurolint/blob/main/LICENSE
 */

const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3001;

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false
}));
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

// 404 handler
app.use((req, res) => {
  console.log('[SERVER] 404 - Not found:', req.method, req.path);
  res.status(404).json({
    error: 'Not found',
    message: `${req.method} ${req.path} not found`
  });
});

// Error handler (must be last)
app.use((err, req, res, next) => {
  console.error('[SERVER] Error handler caught:', err.message, err.stack);

  if (res.headersSent) {
    console.log('[SERVER] Headers already sent, delegating to default handler');
    return next(err);
  }

  res.status(err.status || 500).json({
    error: err.error || 'Internal server error',
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
