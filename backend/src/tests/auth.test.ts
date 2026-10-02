import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../app';

describe('Protected Routes & Auth Middleware', () => {
  it('should return 401 with expected message when no token or cookie is provided to protected upload routes', async () => {
    const res = await request(app).post('/api/v1/settings/images');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('You are not logged in. Please log in to get access.');
  });

  it('should return 401 with expected message when logged_out cookie is sent', async () => {
    const res = await request(app)
      .post('/api/v1/settings/cv')
      .set('Cookie', ['jwt=logged_out']);
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('You are not logged in. Please log in to get access.');
  });

  it('should return 401 when invalid bearer token is provided', async () => {
    const res = await request(app)
      .post('/api/v1/settings/images')
      .set('Authorization', 'Bearer invalid_dummy_token_value');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/invalid token/i);
  });
});
