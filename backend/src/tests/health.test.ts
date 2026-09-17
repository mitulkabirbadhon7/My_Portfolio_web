import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../app';

describe('API Route: /api/v1/health', () => {
  it('should return a 200 OK status and a success message', async () => {
    const response = await request(app).get('/api/v1/health');

    // Assert HTTP status
    expect(response.status).toBe(200);
    
    // Assert JSON response body structure
    expect(response.body.success).toBe(true);
    expect(response.body.message).toMatch(/running securely/i);
    expect(response.body).toHaveProperty('timestamp');
  });

  it('should return a 404 for an unknown route', async () => {
    const response = await request(app).get('/api/v1/this-route-does-not-exist');

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toMatch(/not found on this server/i);
  });
});