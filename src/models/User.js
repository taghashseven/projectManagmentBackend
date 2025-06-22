import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
    default: ''
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user'
  }
}, {
  timestamps: true
});

// Method to match entered password with hashed password
userSchema.methods.matchPassword = async function(enteredPassword) {
  return enteredPassword === this.password
};


// remove method that delte user 
userSchema.methods.remove = async function() {
  await this.deleteOne();
};

export default mongoose.model('User', userSchema);