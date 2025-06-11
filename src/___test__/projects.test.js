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


  // should add a team member to project given a email
  it('should add a team member to project given a email', async () => {
    // Create a second user to add as team member
    const secondUserRes = await request(app).post('/auth/register').send({
      name: 'Team Member',
      email: 'teammember2@example.com',
      password: 'password123',
    });

    const res = await request(app)
      .post(`/projects/${projectId}/team`)
      .set('Authorization', `Bearer ${token}`)
      .send({ email: 'teammember2@example.com' });

    expect(res.statusCode).toBe(201);
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



describe('Project Task Routes', () => {
  let taskId;
  let projectId;

  beforeAll(async () => {
    // Create a new project for task testing
    const projectRes = await request(app)
      .post('/projects')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Task Project',
        description: 'Project to test tasks',
        startDate: '2025-01-01',
        team: [],
      });

    projectId = projectRes.body._id;

  });

  it('should add a new task to the project', async () => {
    const res = await request(app)
      .put(`/projects/${projectId}/tasks`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Initial Task',
        description: 'First task in the project',
        dueDate: '2025-12-31',
        status: 'done',
      });

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(1);
    
    const task = res.body[0];
    expect(task.title).toBe('Initial Task');
    
    taskId = task._id; // Save for later tests
  });

  it('should update an existing task', async () => {
    const res = await request(app)
      .put(`/projects/${projectId}/tasks`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        _id: taskId,
        status: 'in-progress',
        priority: 'high'
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
    
    const updatedTask = res.body.find(t => t._id === taskId);
    expect(updatedTask.status).toBe('in-progress');
    expect(updatedTask.priority).toBe('high');
    expect(updatedTask.title).toBe('Initial Task'); // Ensure other fields remain
  });

  it('should add a second task to the project', async () => {
    const res = await request(app)
      .put(`/projects/${projectId}/tasks`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Second Task',
        description: 'Another task in the project',
        dueDate: '2025-12-15',
        status: 'review',
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(2);
    
    const newTask = res.body.find(t => t.title === 'Second Task');
    expect(newTask).toBeDefined();
  });

  it('should delete a task from the project', async () => {
    const res = await request(app)
      .delete(`/projects/${projectId}/tasks/${taskId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Task deleted');
    expect(res.body.tasks.length).toBe(1);
    expect(res.body.tasks.some(t => t._id === taskId)).toBe(false);
  });

  it('should return 404 when deleting non-existent task', async () => {
    const fakeTaskId = new mongoose.Types.ObjectId();
    const res = await request(app)
      .delete(`/projects/${projectId}/tasks/${fakeTaskId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe('Task not found');
  });

  it('should handle invalid task data when adding/updating', async () => {
    const res = await request(app)
      .put(`/projects/${projectId}/tasks`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: '', // Invalid - empty title
        status: 'review' // Invalid stratus
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBeDefined();
  });
});


describe('Project Resource Routes', () => {
  let projectId;
  let resourceId;

  beforeAll(async () => {
    // Create a new project for resource testing
    const projectRes = await request(app)
      .post('/projects')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Resource Project',
        description: 'Project to test resources',
        startDate: '2025-01-01',
        team: [],
      });

    projectId = projectRes.body._id;
  });

  it('should add a new resource to the project', async () => {
    const res = await request(app)
      .post(`/projects/${projectId}/resources`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Project Design',
        type: 'document',
        url: 'https://drive.google.com/document/123',
        description: 'Initial design document'
      });

    expect(res.statusCode).toBe(201);
    
    resourceId = res.body._id; // Save for later tests
  });

  it('should fail to add resource with missing required fields', async () => {
    const res = await request(app)
      .post(`/projects/${projectId}/resources`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        type: 'document',
        url: 'https://drive.google.com/document/123'
        // Missing name
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/required/);
  });

  it('should fail to add resource with invalid URL', async () => {
    const res = await request(app)
      .post(`/projects/${projectId}/resources`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Invalid Resource',
        type: 'document',
        url: 'not-a-valid-url',
        description: 'This should fail'
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/valid URL/);
  });

  it('should delete a resource from the project', async () => {
    // Create the resource first
    const resourceRes = await request(app)
      .post(`/projects/${projectId}/resources`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Temp Resource',
        type: 'document',
        url: 'https://temp.com/resource'
      });
  
    const addedResource = resourceRes.body.resources.find(
      (r) => r.url === 'https://temp.com/resource'
    );
    const resourceId = addedResource._id;
  
    // Delete it
    const res = await request(app)
      .delete(`/projects/${projectId}/resources/${resourceId}`)
      .set('Authorization', `Bearer ${token}`);
  
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Resource deleted');
  });
  

  it('should return 404 when deleting non-existent resource', async () => {
    const fakeResourceId = new mongoose.Types.ObjectId();
    const res = await request(app)
      .delete(`/projects/${projectId}/resources/${fakeResourceId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe('Resource not found');
  });

  it('should prevent unauthorized users from adding resources', async () => {
    // Create a new user who is not part of the project
    const newUserRes = await request(app).post('/auth/register').send({
      name: 'Unauthorized User',
      email: 'unauthorized@example.com',
      password: 'password123',
    });
    const newToken = newUserRes.body.token;

    const res = await request(app)
      .post(`/projects/${projectId}/resources`)
      .set('Authorization', `Bearer ${newToken}`)
      .send({
        name: 'Unauthorized Resource',
        type: 'document',
        url: 'https://drive.google.com/document/456'
      });

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toMatch(/Not authorized/);
  });

  it('should prevent unauthorized users from deleting resources', async () => {
    // First add a resource as the owner
    const resourceRes = await request(app)
      .post(`/projects/${projectId}/resources`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Test Resource',
        type: 'document',
        url: 'https://drive.google.com/document/789'
      });

    console.log("resourceRes -------------" , resourceRes.body)
    
    const testResource = resourceRes.body.resources.find(
      (r) => r.url === 'https://drive.google.com/document/789'
    );
    const testResourceId = testResource._id;

    // Try to delete as unauthorized user
    const newUserRes = await request(app).post('/auth/register').send({
      name: 'Another User',
      email: 'another@example.com',
      password: 'password123',
    });
    const newToken = newUserRes.body.token;

    const deleteRes = await request(app)
      .delete(`/projects/${projectId}/resources/${testResourceId}`)
      .set('Authorization', `Bearer ${newToken}`);

    expect(deleteRes.statusCode).toBe(401);
    expect(deleteRes.body.message).toMatch(/Not authorized/);
  });
});