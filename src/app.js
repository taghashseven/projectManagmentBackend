import express from 'express';
import dotenv from 'dotenv';
import routes from './routes/chatRoutes.js';
import authRoutes from './routes/authRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import resourceRoutes from './routes/resourceRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import "./config/db.js";
import cors from 'cors';
import requestLogger from './middleware/loggerMidleware.js';


dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);




// Routes
app.use('/', routes);


// hello world
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.use('/auth', authRoutes);
app.use('/projects', projectRoutes);
app.use('/resources', resourceRoutes);
app.use('/tasks', taskRoutes);

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ error: 'Not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});


export default app 