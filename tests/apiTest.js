const request = require('supertest');
const app = require('../server');

describe('API Routes', () => {
  describe('GET /api/users', () => {
    it('should return a list of users', async () => {
      const response = await request(app).get('/api/users');
      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
    });
  });

  describe('POST /api/users', () => {
    it('should create a new user', async () => {
      const userData = { name: 'John Doe', email: 'john@example.com' };
      const response = await request(app).post('/api/users').send(userData);
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('name', userData.name);
      expect(response.body).toHaveProperty('email', userData.email);
    });
  });

  describe('PUT /api/users/:id', () => {
    it('should update an existing user', async () => {
      const userData = { name: 'Jane Doe', email: 'jane@example.com' };
      const response = await request(app).post('/api/users').send(userData);
      const userId = response.body._id;
      const updatedUserData = { name: 'Jane Doe Updated', email: 'jane.updated@example.com' };
      const updateResponse = await request(app).put(`/api/users/${userId}`).send(updatedUserData);
      expect(updateResponse.status).toBe(200);
      expect(updateResponse.body).toHaveProperty('name', updatedUserData.name);
      expect(updateResponse.body).toHaveProperty('email', updatedUserData.email);
    });
  });

  describe('DELETE /api/users/:id', () => {
    it('should delete an existing user', async () => {
      const userData = { name: 'John Doe', email: 'john@example.com' };
      const response = await request(app).post('/api/users').send(userData);
      const userId = response.body._id;
      const deleteResponse = await request(app).delete(`/api/users/${userId}`);
      expect(deleteResponse.status).toBe(200);
      expect(deleteResponse.body).toHaveProperty('message', 'User deleted successfully');
    });
  });
});