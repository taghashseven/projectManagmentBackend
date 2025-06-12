import app from './app.js';
import dotenv from 'dotenv';
dotenv.config();
import { connectDB } from './config/db.js';

connectDB();

const port = process.env.PORT || 3000;

app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Server is running on http://0.0.0.0:${port}`);
});
