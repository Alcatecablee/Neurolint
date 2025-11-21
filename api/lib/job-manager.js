const { randomUUID } = require('crypto');

class JobManager {
  constructor() {
    this.jobs = new Map();
    this.MAX_JOBS = 100;
    this.CLEANUP_INTERVAL = 5 * 60 * 1000;
    this.JOB_TTL = 10 * 60 * 1000;
    
    this.startCleanup();
  }

  createJob(code, options = {}) {
    const jobId = randomUUID();
    const job = {
      id: jobId,
      code,
      options,
      status: 'pending',
      createdAt: Date.now(),
      layers: [],
      currentLayer: null,
      progress: 0,
      detectedIssues: [],
      transformedCode: null,
      error: null,
      subscribers: new Set()
    };

    if (this.jobs.size >= this.MAX_JOBS) {
      const oldestJob = Array.from(this.jobs.entries())
        .sort((a, b) => a[1].createdAt - b[1].createdAt)[0];
      this.jobs.delete(oldestJob[0]);
    }

    this.jobs.set(jobId, job);
    return job;
  }

  getJob(jobId) {
    return this.jobs.get(jobId);
  }

  updateJob(jobId, updates) {
    const job = this.jobs.get(jobId);
    if (!job) return null;

    Object.assign(job, updates);
    this.notifySubscribers(jobId, updates);
    return job;
  }

  updateLayerProgress(jobId, layerId, status, data = {}) {
    const job = this.jobs.get(jobId);
    if (!job) return null;

    const layerUpdate = {
      layerId,
      status,
      timestamp: Date.now(),
      ...data
    };

    job.layers.push(layerUpdate);
    job.currentLayer = layerId;
    job.progress = Math.round((layerId / 7) * 100);

    this.notifySubscribers(jobId, {
      type: 'layer_update',
      layer: layerUpdate
    });

    return job;
  }

  addIssue(jobId, issue) {
    const job = this.jobs.get(jobId);
    if (!job) return null;

    job.detectedIssues.push(issue);
    return job;
  }

  completeJob(jobId, result) {
    const job = this.jobs.get(jobId);
    if (!job) return null;

    job.status = 'completed';
    job.transformedCode = result.transformedCode;
    job.progress = 100;
    job.completedAt = Date.now();

    this.notifySubscribers(jobId, {
      type: 'complete',
      result
    });

    return job;
  }

  failJob(jobId, error) {
    const job = this.jobs.get(jobId);
    if (!job) return null;

    job.status = 'failed';
    job.error = error;

    this.notifySubscribers(jobId, {
      type: 'error',
      error
    });

    return job;
  }

  subscribe(jobId, callback) {
    const job = this.jobs.get(jobId);
    if (!job) return null;

    job.subscribers.add(callback);

    return () => {
      job.subscribers.delete(callback);
    };
  }

  notifySubscribers(jobId, data) {
    const job = this.jobs.get(jobId);
    if (!job) return;

    job.subscribers.forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error('Subscriber error:', error);
      }
    });
  }

  startCleanup() {
    setInterval(() => {
      const now = Date.now();
      for (const [jobId, job] of this.jobs.entries()) {
        if (now - job.createdAt > this.JOB_TTL) {
          this.jobs.delete(jobId);
        }
      }
    }, this.CLEANUP_INTERVAL);
  }

  getStats() {
    return {
      totalJobs: this.jobs.size,
      pending: Array.from(this.jobs.values()).filter(j => j.status === 'pending').length,
      running: Array.from(this.jobs.values()).filter(j => j.status === 'running').length,
      completed: Array.from(this.jobs.values()).filter(j => j.status === 'completed').length,
      failed: Array.from(this.jobs.values()).filter(j => j.status === 'failed').length
    };
  }
}

const jobManager = new JobManager();

module.exports = jobManager;
