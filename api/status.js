const jobManager = require('./lib/job-manager');

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const stats = jobManager.getStats();
    
    res.status(200).json({
      status: 'healthy',
      version: '1.0.0',
      stats,
      layers: [
        { id: 1, name: 'Configuration' },
        { id: 2, name: 'Patterns' },
        { id: 3, name: 'Components' },
        { id: 4, name: 'Hydration' },
        { id: 5, name: 'Next.js' },
        { id: 6, name: 'Testing' },
        { id: 7, name: 'Adaptive' }
      ]
    });
  } catch (error) {
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
};
