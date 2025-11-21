const jobManager = require('../lib/job-manager');

module.exports = async (req, res) => {
  try {
    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const { jobId } = req.query;

    console.log('[RESULT] Fetching job:', jobId);

    const job = jobManager.getJob(jobId);

    if (!job) {
      console.log('[RESULT] Job not found:', jobId);
      return res.status(404).json({
        error: 'Job not found',
        message: 'The requested job does not exist or has expired'
      });
    }

    console.log('[RESULT] Job status:', job.status);

    const response = {
      jobId: job.id,
      status: job.status,
      progress: job.progress,
      createdAt: job.createdAt
    };

    if (job.status === 'completed') {
      response.result = {
        transformedCode: job.transformedCode,
        detectedIssues: job.detectedIssues || [],
        layers: job.layers || [],
        processingTime: (job.completedAt || Date.now()) - job.createdAt
      };
    } else if (job.status === 'failed') {
      response.error = job.error;
    } else if (job.status === 'running') {
      response.currentLayer = job.currentLayer;
      response.layers = job.layers || [];
    }

    res.status(200).json(response);
  } catch (error) {
    console.error('[RESULT] Error:', error.message);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
};
