const jobManager = require('../lib/job-manager');

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { jobId } = req.query;

  const job = jobManager.getJob(jobId);
  if (!job) {
    return res.status(404).json({ error: 'Job not found' });
  }

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Access-Control-Allow-Origin', '*');

  const sendEvent = (event, data) => {
    res.write(`event: ${event}\n`);
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  sendEvent('connected', {
    jobId: job.id,
    status: job.status,
    progress: job.progress
  });

  job.layers.forEach(layer => {
    sendEvent('layer_update', layer);
  });

  if (job.status === 'completed') {
    sendEvent('complete', {
      transformedCode: job.transformedCode,
      detectedIssues: job.detectedIssues,
      processingTime: job.completedAt - job.createdAt
    });
    res.end();
    return;
  }

  if (job.status === 'failed') {
    sendEvent('error', { error: job.error });
    res.end();
    return;
  }

  const unsubscribe = jobManager.subscribe(jobId, (update) => {
    if (update.type === 'layer_update') {
      sendEvent('layer_update', update.layer);
    } else if (update.type === 'complete') {
      sendEvent('complete', {
        transformedCode: update.result.transformedCode,
        detectedIssues: update.result.detectedIssues,
        appliedFixes: update.result.appliedFixes,
        processingTime: update.result.processingTime
      });
      res.end();
      unsubscribe();
    } else if (update.type === 'error') {
      sendEvent('error', { error: update.error });
      res.end();
      unsubscribe();
    }
  });

  req.on('close', () => {
    unsubscribe();
  });
};
