// api.test.js
const request = require('supertest');
const app = require('./server');

describe('API', () => {
  it('should create a new API', async () => {
    const response = await request(app).post('/api/create').send({ name: 'Test API', description: 'This is a test API' });
    expect(response.status).toBe(201);
  });

  it('should read all APIs', async () => {
    const response = await request(app).get('/api/read');
    expect(response.status).toBe(200);
  });

  it('should update an API', async () => {
    const response = await request(app).put('/api/update/1').send({ name: 'Updated API', description: 'This is an updated API' });
    expect(response.status).toBe(200);
  });

  it('should delete an API', async () => {
    const response = await request(app).delete('/api/delete/1');
    expect(response.status).toBe(200);
  });
});
