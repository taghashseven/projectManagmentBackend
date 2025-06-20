import mongoose from 'mongoose';
import User from '../models/User.js';  // adjust the path if needed
import dotenv from 'dotenv';

dotenv.config();

const users = [
  { name: 'admin', email: 'superadmin@zchpc.ac.zw', password: 'user@123' , role:"admin" },

];

async function seedUsers() {
  try {
    await mongoose.connect("mongodb://localhost:27017/project", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('MongoDB connected');



    // Hash passwords before saving users
    for (const userData of users) {
    //   const salt = await bcrypt.genSalt(10);
    //   const hashedPassword = await bcrypt.hash(userData.password, salt);

      const user = new User({
        name: userData.name,
        email: userData.email,
        // password: hashedPassword,
        password: userData.password,
      });

      await user.save();
      console.log(`User created: ${user.email}`);
    }

    console.log('User seeding complete');
    process.exit();

  } catch (error) {
    console.error('Error seeding users:', error);
    process.exit(1);
  }
}

seedUsers();
