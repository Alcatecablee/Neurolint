/**
 * NeuroLint API - Analyze Endpoint
 * 
 * Copyright (c) 2025 NeuroLint
 * Licensed under the Business Source License 1.1
 * Change Date: 2029-11-22 | Change License: GPL-3.0-or-later
 * Full license: https://github.com/Alcatecablee/Neurolint/blob/main/LICENSE
 */

const jobManager = require('./lib/job-manager');
const cliRunner = require('./lib/cli-runner');

const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 60000;
const MAX_REQUESTS_PER_WINDOW = 10;

function checkRateLimit(ip) {
  const now = Date.now();
  const userRequests = rateLimitMap.get(ip) || [];
  
  const recentRequests = userRequests.filter(
    timestamp => now - timestamp < RATE_LIMIT_WINDOW
  );

  if (recentRequests.length >= MAX_REQUESTS_PER_WINDOW) {
    return false;
  }

  recentRequests.push(now);
  rateLimitMap.set(ip, recentRequests);
  
  return true;
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    console.log('[API] Invalid method:', req.method);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  console.log('[API] Analyze request from IP:', ip);

  if (!checkRateLimit(ip)) {
    console.log('[API] Rate limit exceeded for IP:', ip);
    return res.status(429).json({
      error: 'Rate limit exceeded',
      message: 'Too many requests. Please try again later.'
    });
  }

  try {
    // Ensure body is available - sometimes proxy middleware consumes it
    let body = req.body;

    console.log('[API] Request body type:', typeof body, 'is object:', typeof body === 'object');

    // If body is empty or not an object, try to parse from raw stream
    if (!body || typeof body !== 'object') {
      console.log('[API] Invalid body, returning 400');
      return res.status(400).json({
        error: 'Invalid request',
        message: 'Request body must be valid JSON'
      });
    }

    const { code, options = {} } = body;

    console.log('[API] Code received, length:', code ? code.length : 'null');

    if (!code || typeof code !== 'string') {
      console.log('[API] Invalid code');
      return res.status(400).json({
        error: 'Invalid input',
        message: 'Code must be a non-empty string'
      });
    }

    if (code.length > 100000) {
      console.log('[API] Code too large:', code.length);
      return res.status(400).json({
        error: 'Code too large',
        message: 'Code must be less than 100KB'
      });
    }

    const job = jobManager.createJob(code, options);
    console.log('[API] Job created:', job.id);

    // Send 202 Accepted response
    const response = {
      success: true,
      jobId: job.id,
      status: job.status,
      message: 'Analysis started'
    };

    console.log('[API] Sending response:', response);

    res.status(202)
      .header('Content-Type', 'application/json')
      .json(response);

    setImmediate(async () => {
      try {
        console.log('[API] Starting analysis for job:', job.id);
        jobManager.updateJob(job.id, { status: 'running' });

        let result;
        try {
          console.log('[API] Calling cliRunner.analyzeCode');
          result = await cliRunner.analyzeCode(
            code,
            options,
            (progress) => {
              try {
                if (progress.type === 'layer_start') {
                  jobManager.updateLayerProgress(
                    job.id,
                    progress.layerId,
                    'processing',
                    { name: progress.name }
                  );
                } else if (progress.type === 'layer_complete') {
                  jobManager.updateLayerProgress(
                    job.id,
                    progress.layerId,
                    'completed',
                    {
                      name: progress.name,
                      issuesFound: progress.issuesFound
                    }
                  );
                }
              } catch (progressError) {
                console.error('[API] Error in progress callback:', progressError.message);
              }
            }
          );
        } catch (analyzeError) {
          console.error('[API] cliRunner.analyzeCode failed:', analyzeError.message, analyzeError.stack);
          throw new Error(`Analysis failed: ${analyzeError.message}`);
        }

        if (!result) {
          throw new Error('Analysis returned no result');
        }

        console.log('[API] Analysis complete, issues found:', result.detectedIssues ? result.detectedIssues.length : 0);

        if (result.detectedIssues) {
          result.detectedIssues.forEach(issue => {
            try {
              jobManager.addIssue(job.id, issue);
            } catch (issueError) {
              console.error('[API] Error adding issue:', issueError.message);
            }
          });
        }

        if (result.detectedIssues && result.detectedIssues.length > 0) {
          try {
            console.log('[API] Applying fixes for job:', job.id);
            const fixResult = await cliRunner.fixCode(
              code,
              result.detectedIssues,
              options
            );

            if (fixResult && fixResult.success) {
              result.transformedCode = fixResult.code;
              result.appliedFixes = fixResult.appliedFixes;
              console.log('[API] Fixes applied successfully');
            } else {
              console.log('[API] Fix result not successful:', fixResult);
            }
          } catch (fixError) {
            console.error('[API] Error during fix:', fixError.message);
            // Don't fail the job if fixing fails, just continue with original code
          }
        }

        jobManager.completeJob(job.id, {
          transformedCode: result.transformedCode || code,
          detectedIssues: result.detectedIssues || [],
          layerResults: result.layerResults || [],
          appliedFixes: result.appliedFixes || [],
          processingTime: Date.now() - job.createdAt
        });

        console.log('[API] Job completed successfully:', job.id);

      } catch (error) {
        console.error('[API] Analysis error for job', job.id, ':', error.message);
        console.error('[API] Error details:', error.stack);
        jobManager.failJob(job.id, error instanceof Error ? error.message : String(error));
      }
    });

  } catch (error) {
    console.error('[API] Request handling error:', error.message);
    console.error('[API] Error stack:', error.stack);

    // Don't send 500 errors without details
    const statusCode = error.statusCode || 500;
    const response = {
      error: error.name || 'Internal server error',
      message: error.message || 'An unexpected error occurred',
      details: error.details || null
    };

    if (process.env.NODE_ENV !== 'production') {
      response.stack = error.stack;
    }

    res.status(statusCode).json(response);
  }
};
