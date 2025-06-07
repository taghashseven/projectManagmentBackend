import mongoose from 'mongoose';
const MONGO_URI = 'mongodb://localhost:27017/project'; // replace with your URI


// Connect to MongoDB
mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  });

  export default mongoose