import   Task  from '../models/Task.js'

// @desc    Create new task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res) => {
  const { title, description, status, dueDate, project, assignedTo } = req.body;

  const task = await Task.create({
    title,
    description,
    status,
    dueDate,
    project,
    assignedTo,
    createdBy: req.user._id
  });

  res.status(201).json(task);
}

// @desc    Get tasks by project
// @route   GET /api/tasks/project/:projectId
// @access  Private
const getTasksByProject = async (req, res) => {
  const tasks = await Task.find({ project: req.params.projectId })
    .populate('assignedTo', 'name email avatar')
    .populate('createdBy', 'name email avatar')
    .sort('-createdAt');

  res.json(tasks);
}

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  // Check if user created the task or is project owner
  const project = await Project.findById(task.project);
  if (!task.createdBy.equals(req.user._id) && 
      !project.owner.equals(req.user._id)) {
    res.status(401);
    throw new Error('Not authorized to update this task');
  }

  const updatedTask = await Task.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  )
  .populate('assignedTo', 'name email avatar')
  .populate('createdBy', 'name email avatar');

  res.json(updatedTask);
}

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  // Check if user created the task or is project owner
  const project = await Project.findById(task.project);
  if (!task.createdBy.equals(req.user._id) && 
      !project.owner.equals(req.user._id)) {
    res.status(401);
    throw new Error('Not authorized to delete this task');
  }

  await task.remove();
  res.json({ message: 'Task removed' });
}

export  {
  createTask,
  getTasksByProject,
  updateTask,
  deleteTask
};