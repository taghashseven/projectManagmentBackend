import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../app.js';

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe('Auth Routes', () => {
  it('should register a user', async () => {
    const res = await request(app).post('/auth/register').send({
      name: 'John Doe',
      email: 'john@example.com',
      password: '123456'
    });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body.email).toBe('john@example.com');
  });

  it('should not register user with existing email', async () => {
    // First registration
    await request(app).post('/auth/register').send({
      name: 'John Doe',
      email: 'john@example.com',
      password: '123456'
    });

    // Attempt duplicate registration
    const res = await request(app).post('/auth/register').send({
      name: 'John Doe',
      email: 'john@example.com',
      password: '123456'
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/User already exists/);
  });

  it('should login a registered user', async () => {
    // Register first
    await request(app).post('/auth/register').send({
      name: 'Jane Doe',
      email: 'jane@example.com',
      password: 'pass123'
    });

    // Then login
    const res = await request(app).post('/auth/login').send({
      email: 'jane@example.com',
      password: 'pass123'
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body.email).toBe('jane@example.com');
  });

  it('should fail to login with wrong password', async () => {
    // Register first
    await request(app).post('/auth/register').send({
      name: 'Jane Doe',
      email: 'jane2@example.com',
      password: 'correctpass'
    });

    // Try logging in with wrong password
    const res = await request(app).post('/auth/login').send({
      email: 'jane2@example.com',
      password: 'wrongpass'
    });

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toMatch(/Invalid email or password/);
  });

  it('should get profile with valid token', async () => {
    // Register
    await request(app).post('/auth/register').send({
      name: 'Jane',
      email: 'profile@example.com',
      password: 'pass123'
    });

    // Login to get token
    const loginRes = await request(app).post('/auth/login').send({
      email: 'profile@example.com',
      password: 'pass123'
    });

    const token = loginRes.body.token;

    // Get profile with valid token
    const res = await request(app)
      .get('/auth/profile')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.email).toBe('profile@example.com');
  });
});
