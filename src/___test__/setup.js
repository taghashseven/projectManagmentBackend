// src/__tests__/setup.js
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer;

export default async () => {
  mongoServer = await MongoMemoryServer.create();
  process.env.MONGODB_URI = mongoServer.getUri();
};