const request = require('supertest');
const app = require('../server');

describe('Authentication Routes', () => {
  describe('GET /auth/linkedin', () => {
    it('should redirect to LinkedIn authorization page', async () => {
      const response = await request(app).get('/auth/linkedin');
      expect(response.status).toBe(302);
      expect(response.headers.location).toContain('https://www.linkedin.com/oauth/v2/authorization');
    });
  });

  describe('GET /auth/linkedin/callback', () => {
    it('should handle LinkedIn authorization callback', async () => {
      const code = 'example-code';
      const response = await request(app).get(`/auth/linkedin/callback?code=${code}`);
      expect(response.status).toBe(302);
      expect(response.headers.location).toBe('/crud');
    });
  });

  describe('GET /auth/google', () => {
    it('should redirect to Google authorization page', async () => {
      const response = await request(app).get('/auth/google');
      expect(response.status).toBe(302);
      expect(response.headers.location).toContain('https://accounts.google.com/o/oauth2/v2/auth');
    });
  });

  describe('GET /auth/google/callback', () => {
    it('should handle Google authorization callback', async () => {
      const code = 'example-code';
      const response = await request(app).get(`/auth/google/callback?code=${code}`);
      expect(response.status).toBe(302);
      expect(response.headers.location).toBe('/crud');
    });
  });
});