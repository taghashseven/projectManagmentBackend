// src/__tests__/jest.setup.js
import { clearDB } from '../config/db.js';

beforeEach(async () => {
  await clearDB();
});