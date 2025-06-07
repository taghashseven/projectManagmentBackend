import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../app.js';  // Your Express app
import User from '../models/User.js';  // Assuming you have a User model
import Project from '../models/Project.js';

let mongoServer;
let token;  // Auth token for requests
let userId; // The logged-in user's id
let projectId; // To store created project ID for further tests

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);

  // Create a user and get a token for protected routes
  const userRes = await request(app).post('/auth/register').send({
    name: 'Test User',
    email: 'testuser@example.com',
    password: 'password123',
  });

  token = userRes.body.token;
  userId = userRes.body._id;
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe('Project Routes', () => {
  it('should create a new project', async () => {
    const res = await request(app)
      .post('/projects')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Project Alpha',
        description: 'First test project',
        startDate: '2025-01-01',
        team: [],
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe('Project Alpha');
    expect(res.body.owner).toBe(userId);
    projectId = res.body._id;  // Save for later tests
  });

  it('should get all projects for user', async () => {
    const res = await request(app)
      .get('/projects')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('should get project by id', async () => {
    const res = await request(app)
      .get(`/projects/${projectId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body._id).toBe(projectId);
    expect(res.body.owner._id).toBe(userId);
  });

  it('should update a project', async () => {
    const res = await request(app)
      .put(`/projects/${projectId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        description: 'Updated description',
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.description).toBe('Updated description');
  });

  it('should add a team member to project', async () => {
    // Create a second user to add as team member
    const secondUserRes = await request(app).post('/auth/register').send({
      name: 'Team Member',
      email: 'teammember@example.com',
      password: 'password123',
    });
    const memberId = secondUserRes.body._id;

    const res = await request(app)
      .post(`/projects/${projectId}/team`)
      .set('Authorization', `Bearer ${token}`)
      .send({ userId: memberId });

    expect(res.statusCode).toBe(201);
    expect(res.body.team).toContain(memberId);
  });

  it('should remove a team member from project', async () => {
    // Remove the member added in the previous test
    const res = await request(app)
      .delete(`/projects/${projectId}/team/${userId}`) // Trying to remove owner (should fail?)
      .set('Authorization', `Bearer ${token}`);

    // Since owner can't be removed, expect some error or handle it as needed
    // But let's try to remove a real team member (the member we added)

    // For safer test, let's remove the other user instead:
    const secondUser = await User.findOne({ email: 'teammember@example.com' });

    const res2 = await request(app)
      .delete(`/projects/${projectId}/team/${secondUser._id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res2.statusCode).toBe(200);
    expect(res2.body.team).not.toContainEqual(secondUser._id.toString());
  });

  it('should delete a project', async () => {
    const res = await request(app)
      .delete(`/projects/${projectId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Project removed');
  });
});
