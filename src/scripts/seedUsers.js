import mongoose from 'mongoose';
import User from '../models/User.js';  // adjust the path if needed
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

const users = [
  { name: 'Jonah', email: 'jmudzingwa@zchpc.ac.zw', password: 'user@123' },
  { name: 'Sharon', email: 'sjakarasi@zchpc.ac.zw', password: 'user@123' },
  { name: 'Zimunhu', email: 'tzimunhu@zchpc.ac.zw', password: 'user@123' },
  { name: 'kevin', email: 'kshumba@zchpc.ac.zw', password: 'user@123' },
  { name: 'ZCHPC', email: 'zchpc@zchpc.ac.zw', password: 'user@123' },
  { name: 'admin', email: 'admin@zchpc.ac.zw', password: 'user@123' }
];

async function seedUsers() {
  try {
    await mongoose.connect("mongodb://localhost:27017/project", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('MongoDB connected');

    // Process each user
    for (const userData of users) {
      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.password, salt);

      // Check if user exists
      const existingUser = await User.findOne({ email: userData.email });

      if (existingUser) {
        // Update existing user
        existingUser.name = userData.name;
        existingUser.password = hashedPassword;
        await existingUser.save();
        console.log(`User updated: ${userData.email}`);
      } else {
        // Create new user
        const user = new User({
          name: userData.name,
          email: userData.email,
          password: hashedPassword,
        });
        await user.save();
        console.log(`User created: ${userData.email}`);
      }
    }

    console.log('User seeding complete');
    process.exit(0);

  } catch (error) {
    console.error('Error seeding users:', error);
    process.exit(1);
  }
}

seedUsers();