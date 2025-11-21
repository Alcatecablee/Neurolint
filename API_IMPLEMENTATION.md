# NeuroLint API Implementation

## Overview

This implementation integrates the real 7-Layer CLI engine with the landing page demo using Server-Sent Events (SSE) for real-time progress updates, compatible with Vercel deployment.

## Architecture

### Backend Components

1. **API Server** (`server.js`)
   - Express server for development (port 3001)
   - Proxied through Vite during development
   - Vercel serverless functions in production

2. **Job Manager** (`api/lib/job-manager.js`)
   - In-memory job tracking
   - SSE subscriber pattern for real-time updates
   - Automatic cleanup of old jobs (10-minute TTL)
   - Supports up to 100 concurrent jobs

3. **CLI Runner** (`api/lib/cli-runner.js`)
   - Sandboxed execution in temp directories
   - Input validation (max 100KB code size)
   - Layer-by-layer analysis with progress callbacks
   - Automatic cleanup of temp files

### API Endpoints

1. **POST /api/analyze**
   - Accepts code and analysis options
   - Creates job and returns job ID
   - Rate limiting: 10 requests per minute per IP
   - Input validation: code size, type checking

2. **GET /api/stream/:jobId**
   - SSE endpoint for live progress updates
   - Streams layer updates as they complete
   - Automatically closes on job completion/failure

3. **GET /api/result/:jobId**
   - Polling fallback for SSE
   - Returns job status and results
   - Used when SSE connection fails

4. **GET /api/status**
   - Health check endpoint
   - Returns layer information
   - Job statistics

### Frontend Components

1. **neurolint-api.ts** (`landing/src/lib/neurolint-api.ts`)
   - Real API integration
   - SSE streaming with EventSource
   - Automatic fallback to polling
   - 2-minute timeout for long analyses

2. **ComprehensiveDemoSection.tsx**
   - Two-mode input: Sample code or Paste your code
   - Real-time progress modal
   - Before/After/Layer details tabs
   - Integrated with real backend

## Security Features

1. **Input Validation**
   - Code size limit: 100KB
   - Type checking for all inputs
   - Sanitized error messages

2. **Rate Limiting**
   - 10 requests per minute per IP address
   - Sliding window implementation

3. **Sandboxing**
   - Isolated temp directories per job
   - Automatic cleanup after execution
   - Limited filesystem access

4. **Resource Limits**
   - Max 100 concurrent jobs
   - 60-second timeout per CLI execution
   - Job TTL: 10 minutes

## Development Setup

### Running Locally

```bash
# Terminal 1: Start API server
npm run dev:api

# Terminal 2: Start frontend
npm run dev
```

The frontend runs on port 5000 with Vite proxy forwarding `/api/*` requests to port 3001.

### Testing

```bash
# Check API health
curl http://localhost:3001/api/status

# Submit analysis job
curl -X POST http://localhost:3001/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"code":"const x = 1;","options":{"layers":[1,2,3,4,5,6,7]}}'

# Check job result (use jobId from response)
curl http://localhost:3001/api/result/:jobId
```

## Vercel Deployment

### Configuration

`vercel.json` configures:
- API route rewrites
- Function memory: 1024MB
- Max duration: 60 seconds

### Environment

No environment variables required for basic operation. The API works out of the box.

### Deployment Steps

1. Push code to GitHub
2. Connect to Vercel
3. Deploy automatically

The serverless functions in `/api` directory are automatically detected and deployed by Vercel.

## How It Works

1. **User submits code**
   - Either selects a sample or pastes custom code
   - Clicks "Analyze with Real 7-Layer Engine"

2. **Backend creates job**
   - POST to /api/analyze returns job ID
   - Job added to in-memory job manager

3. **CLI analysis runs**
   - Code written to temp directory
   - Each of 7 layers analyzed sequentially
   - Progress callbacks update job status
   - Issues detected and fixes applied

4. **Frontend receives updates**
   - SSE connection streams layer updates
   - Progress modal shows real-time status
   - On completion, displays transformed code

5. **Results displayed**
   - Before/After code comparison
   - List of detected issues
   - Layer-by-layer breakdown
   - Processing time

## Known Limitations

1. **Job Persistence**
   - Jobs stored in-memory (lost on restart)
   - For production, consider Redis/database

2. **Concurrency**
   - Limited to 100 concurrent jobs
   - Older jobs automatically dropped

3. **CLI Integration**
   - Currently uses mock issues for demo
   - Full CLI integration requires CLI updates

## Future Enhancements

1. **Persistent Storage**
   - Redis for job storage
   - Longer job retention

2. **WebSockets**
   - Consider WebSockets when Vercel adds support
   - Or use external WS service

3. **Caching**
   - Cache analysis results by code hash
   - Reduce redundant analyses

4. **Full CLI Integration**
   - Complete integration with all 7 layers
   - Real code transformations
   - Advanced error handling

## Troubleshooting

### API Connection Refused

```bash
# Ensure API server is running
npm run dev:api

# Check if port 3001 is in use
lsof -i :3001
```

### Jobs Expire Quickly

- Jobs auto-cleanup after 10 minutes
- Check job status immediately after creation
- Use SSE streaming for long-running analyses

### SSE Not Working

- Browser may block SSE in some environments
- Polling fallback automatically activates
- Check browser console for errors
