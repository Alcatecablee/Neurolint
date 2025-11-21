const jobManager = require('../lib/job-manager');

module.exports = async (req, res) => {
  try {
    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const { jobId } = req.query;

    console.log('[STREAM] Client connected for job:', jobId);

    const job = jobManager.getJob(jobId);
    if (!job) {
      console.log('[STREAM] Job not found:', jobId);
      return res.status(404).json({ error: 'Job not found' });
    }

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Access-Control-Allow-Origin', '*');

    const sendEvent = (event, data) => {
      try {
        res.write(`event: ${event}\n`);
        res.write(`data: ${JSON.stringify(data)}\n\n`);
      } catch (writeError) {
        console.error('[STREAM] Error writing event:', event, writeError.message);
      }
    };

    sendEvent('connected', {
      jobId: job.id,
      status: job.status,
      progress: job.progress
    });

    if (job.layers && job.layers.length > 0) {
      job.layers.forEach(layer => {
        sendEvent('layer_update', layer);
      });
    }

    if (job.status === 'completed') {
      sendEvent('complete', {
        transformedCode: job.transformedCode,
        detectedIssues: job.detectedIssues || [],
        processingTime: (job.completedAt || Date.now()) - job.createdAt
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
      try {
        if (update.type === 'layer_update') {
          sendEvent('layer_update', update.layer);
        } else if (update.type === 'complete') {
          sendEvent('complete', {
            transformedCode: update.result?.transformedCode,
            detectedIssues: update.result?.detectedIssues || [],
            appliedFixes: update.result?.appliedFixes || [],
            processingTime: update.result?.processingTime || 0
          });
          res.end();
          unsubscribe();
        } else if (update.type === 'error') {
          sendEvent('error', { error: update.error });
          res.end();
          unsubscribe();
        }
      } catch (updateError) {
        console.error('[STREAM] Error handling update:', updateError.message);
      }
    });

    req.on('close', () => {
      console.log('[STREAM] Client disconnected for job:', jobId);
      unsubscribe();
    });

    req.on('error', (error) => {
      console.error('[STREAM] Request error:', error.message);
      unsubscribe();
    });
  } catch (error) {
    console.error('[STREAM] Unexpected error:', error.message);
    if (!res.headersSent) {
      res.status(500).json({
        error: 'Internal server error',
        message: error.message
      });
    }
  }
};
