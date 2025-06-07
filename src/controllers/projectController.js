import  Project from '../models/Project.js'

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
const addTeamMember = async (req, res) => {
  const { userId } = req.body;
  const project = await Project.findById(req.params.id);

  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  // Check if user is owner
  if (!project.owner.equals(req.user._id)) {
    res.status(401);
    throw new Error('Not authorized to add team members');
  }

  // Check if user is already in team
  if (project.team.includes(userId)) {
    res.status(400);
    throw new Error('User is already in the team');
  }

  project.team.push(userId);
  const updatedProject = await project.save();

  res.status(201).json(updatedProject);
}

// @desc    Remove team member from project
// @route   DELETE /api/projects/:id/team/:userId
// @access  Private
const removeTeamMember = async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  // Check if user is owner
  if (!project.owner.equals(req.user._id)) {
    res.status(401);
    throw new Error('Not authorized to remove team members');
  }

  project.team = project.team.filter(
    memberId => !memberId.equals(req.params.userId)
  );

  const updatedProject = await project.save();
  res.json(updatedProject);
}

export {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  addTeamMember,
  removeTeamMember
};