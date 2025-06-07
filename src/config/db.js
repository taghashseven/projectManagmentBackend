import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGO_URI = process.env.MONGODB_URI;

// Blocking MongoDB connection
try {
  await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log('✅ Connected to MongoDB (blocking)');
} catch (err) {
  console.error('❌ Failed to connect to MongoDB', err);
  process.exit(1);
}


// Disconnect from MongoDB
async function disconnectDB() {
    try {
      await mongoose.disconnect();
      console.log('✅ MongoDB disconnected');
    } catch (err) {
      console.error('❌ MongoDB disconnection error', err);
      process.exit(1);
    }
}

export default mongoose;
export { disconnectDB };