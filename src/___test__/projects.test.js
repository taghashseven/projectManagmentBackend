import request from 'supertest';
import app from '../app.js';
import {  disconnectDB } from '../config/db.js';

// Close connection after all tests
afterAll(async () => {
    await disconnectDB();
  });


describe('GET /', () => {
    it('should return Hello, World!', async () => {
      const res = await request(app).get('/');
      expect(res.statusCode).toEqual(200);
      expect(res.text).toBe('Hello, World!');
    });
  });