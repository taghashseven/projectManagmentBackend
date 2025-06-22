import mongoose from 'mongoose';
import User from '../models/User.js'; // Adjust the path as needed
import dotenv from 'dotenv';

dotenv.config();

const users = [
  {
    name: 'admin',
    email: 'superadmin@zchpc.ac.zw',
    password: 'user@123',
    role: 'admin',
  },
];

async function seedUsers() {
  try {
    await mongoose.connect('mongodb://localhost:27017/project', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('MongoDB connected');

    for (const userData of users) {
      const updatedUser = await User.findOneAndUpdate(
        { email: userData.email }, // Find by unique field
        {
          $set: {
            name: userData.name,
            password: userData.password, // You may want to hash this
            role: userData.role,
          },
        },
        {
          new: true,     // Return the updated document
          upsert: true,  // Create the user if not found
        }
      );

      console.log(`User upserted: ${updatedUser.email}`);
    }

    console.log('User seeding complete');
    process.exit();
  } catch (error) {
    console.error('Error seeding users:', error);
    process.exit(1);
  }
}

seedUsers();
