## Security: Stack Trace Exposure
- **Issue:** 4xx client errors returning full execution stack traces.
- **Fix:** Update `errorHandler.ts` to gate `response.stack` strictly behind `statusCode >= 500` alongside environment checks.