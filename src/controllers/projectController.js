import  Project from '../models/Project.js'
import User from '../models/User.js';

// @desc    Create new project
// @route   POST /api/projects
// @access  Private
const createProject = async (req, res) => {
  const { name, description, startDate, team } = req.body;

  const project = await Project.create({
    name,
    description,
    startDate,
    owner: req.user._id,
    team: team || []
  });

  res.status(201).json(project);
}

// @desc    Get all projects for user
// @route   GET /api/projects
// @access  Private
const getProjects = async (req, res) => {
  const projects = await Project.find({
    $or: [
      { owner: req.user._id },
      { team: req.user._id }
    ]
  })
  .populate('owner', 'name email avatar')
  .populate('team', 'name email avatar')
  .sort('-createdAt');

  res.json(projects);
}

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Private
const getProjectById = async (req, res) => {
  const project = await Project.findById(req.params.id)
    .populate('owner', 'name email avatar')
    .populate('team', 'name email avatar');

  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  // Check if user is owner or team member
  if (!project.owner.equals(req.user._id) && 
      !project.team.some(member => member.equals(req.user._id))) {
    res.status(401);
    throw new Error('Not authorized to access this project');
  }

  res.json(project);
}

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private
const updateProject = async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  // Check if user is owner
  if (!project.owner.equals(req.user._id)) {
    res.status(401);
    throw new Error('Not authorized to update this project');
  }

  const updatedProject = await Project.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  )
  .populate('owner', 'name email avatar')
  .populate('team', 'name email avatar');

  res.json(updatedProject);
}

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private

const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if user is owner
    if (!project.owner.equals(req.user._id)) {
      return res.status(401).json({ message: 'Not authorized to delete this project' });
    }

    await project.removeProject();
    res.status(200).json({ message: 'Project removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


// @desc    Add team member to project
// @route   POST /api/projects/:id/team
// @access  Private
// @body    userId or email
const addTeamMember = async (req, res) => {
  let { userId , email } = req.body;
  // if userid is not provided, use email to find user
  if (!userId) {
    try{
      const user = await User.findOne({ email });
      console.log("user"  , user)
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      userId = user._id;
    }
    catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error' });
    }
  }
  const project = await Project.findById(req.params.id);

  if (!project) {
    return res.status(404).json({ message: 'Project not found' });
  }

  // Check if user is owner
  // if (!project.owner.equals(req.user._id)) {
  //   res.status(401);
  //   throw new Error('Not authorized to add team members');
  // }

  // Check if user is already in team
  if (project.team.includes(userId)) {
    return res.status(400).json({ message: 'User is already in team' });
  }

  project.team.push(userId);
  const updatedProject = await project.save();

  // get project 
  try {
    let proj =  await Project.findById(project._id)
    .populate('team')
    return res.status(201).json(proj);
  }
  catch(err){
    return res.status(500).json({err : "something went wrong"})
  }

  
}

// @desc    Remove team member from project
// @route   DELETE /api/projects/:id/team/:userId
// @access  Private
const removeTeamMember = async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    return res.status(404).json({ message: 'Project not found' });
  }

  // Check if user is owner
  // if (!project.owner.equals(req.user._id)) {
  //   return res.status(401).json({ message: 'Not authorized to remove team members' });
  // }

  project.team = project.team.filter(
    memberId => !memberId.equals(req.params.userId)
  );


  await project.save();
  const updatedProject = await Project.findById(project._id).populate('team');
  res.json(updatedProject);
}

// put a task 
// @desc    Add or update a task in a project
// @route   PUT /api/projects/:projectId/tasks
// @access  Private
const putTask = async (req, res) => {

  const { projectId } = req.params;
  const { _id, ...taskData } = req.body;

  const project = await Project.findById(projectId);

  if (!project) {
    return res.status(404).json({ message: 'Project not found' });
  }

  // If task ID is provided, update the task
  if (_id) {
    const taskIndex = project.tasks.findIndex(t => t._id.toString() === _id);
    if (taskIndex === -1) {
      return res.status(404).json({ message: 'Task not found in project' });
    }
    project.tasks[taskIndex] = { ...project.tasks[taskIndex]._doc, ...taskData };
  } 
  else {
    // task title is not provided
    if (!taskData.title) {
      return res.status(400).json({ message: 'Task title is required' });
    }

    // Otherwise, add a new task
    project.tasks.push(taskData);
  }

  await project.save();
  return res.status(200).json(project.tasks);
};


// @desc    Delete a task from a project
// @route   DELETE /api/projects/:projectId/tasks/:taskId
// @access  Private
const deleteTask = async (req, res) => {
  const { projectId, taskId } = req.params;

  console.log(projectId , taskId , "delte task");
  const project = await Project.findById(projectId);

  if (!project) {
    return res.status(404).json({ message: 'Project not found' });
  }

  const initialLength = project.tasks.length;
  project.tasks = project.tasks.filter(task => task._id.toString() !== taskId);

  if (project.tasks.length === initialLength) {
    return res.status(404).json({ message: 'Task not found' });
  }

  await project.save();
  res.status(200).json({ message: 'Task deleted', tasks: project.tasks });
};

// @desc    Add resource to project
// @route   POST /api/projects/:projectId/resources
// @access  Private
const addResource = async (req, res) => {
  const { projectId } = req.params;
  const { name, type, url, description } = req.body;

  if (!name || !type || !url) {
    return res.status(400).json({ message: 'Name, type and URL are required' });
  }

  // if url is not a valid URL
  if (/^https?:\/\//.test(url) === false) {
    return res.status(400).json({ message: 'Invalid URL' });
  }

  try {
    const project = await Project.findById(projectId);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if user is owner or team member
    if (!project.owner.equals(req.user._id) && 
        !project.team.some(member => member.equals(req.user._id))) {
      return res.status(401).json({ message: 'Not authorized to add resources to this project' });
    }

    const newResource = {
      name,
      type,
      url,
      description: description || '',
      createdBy: req.user._id
    };

    project.resources.push(newResource);
    const updatedProject = await project.save();

    console.log(JSON.stringify(updatedProject , null, 2))

    res.status(201).json(updatedProject);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete resource from project
// @route   DELETE /api/projects/:projectId/resources/:resourceId
// @access  Private
const deleteResource = async (req, res) => {
  const { projectId, resourceId } = req.params;


  try {
    const project = await Project.findById(projectId);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if user is owner or resource creator
    const resource = project.resources.id(resourceId);
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    if (!project.owner.equals(req.user._id) && 
        !resource.createdBy.equals(req.user._id)) {
      return res.status(401).json({ message: 'Not authorized to delete this resource' });
    }

    project.resources = project.resources.filter(
      r => r._id.toString() !== resourceId
    );

    await project.save();
    let updatedProject = await Project.findById(project._id)
    res.status(200).json(updatedProject);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};



export {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  addTeamMember,
  removeTeamMember ,
  putTask,
  deleteTask ,
  addResource,
  deleteResource
};