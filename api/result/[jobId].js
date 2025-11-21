const jobManager = require('../lib/job-manager');

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { jobId } = req.query;

  const job = jobManager.getJob(jobId);
  
  if (!job) {
    return res.status(404).json({
      error: 'Job not found',
      message: 'The requested job does not exist or has expired'
    });
  }

  const response = {
    jobId: job.id,
    status: job.status,
    progress: job.progress,
    createdAt: job.createdAt
  };

  if (job.status === 'completed') {
    response.result = {
      transformedCode: job.transformedCode,
      detectedIssues: job.detectedIssues,
      layers: job.layers,
      processingTime: job.completedAt - job.createdAt
    };
  } else if (job.status === 'failed') {
    response.error = job.error;
  } else if (job.status === 'running') {
    response.currentLayer = job.currentLayer;
    response.layers = job.layers;
  }

  res.status(200).json(response);
};
