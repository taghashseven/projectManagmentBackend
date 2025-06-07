import  Message from '../models/Message.js'

// @desc    Create new message
// @route   POST /api/chat
// @access  Private
const createMessage = async (req, res) => {
  const { content, project } = req.body;

  const message = await Message.create({
    content,
    project,
    sender: req.user._id
  });

  const populatedMessage = await Message.findById(message._id)
    .populate('sender', 'name email avatar');

  res.status(201).json(populatedMessage);
};

// @desc    Get messages by project
// @route   GET /api/chat/project/:projectId
// @access  Private
const getMessagesByProject = async (req, res) => {
  const messages = await Message.find({ project: req.params.projectId })
    .populate('sender', 'name email avatar')
    .sort('createdAt');

  res.json(messages);
};

// @desc    Mark message as read
// @route   PUT /api/chat/:id/read
// @access  Private
const markMessageAsRead = async (req, res) => {
  const message = await Message.findById(req.params.id);

  if (!message) {
    res.status(404);
    throw new Error('Message not found');
  }

  // Check if user is in project team
  const project = await Project.findById(message.project);
  if (!project.owner.equals(req.user._id) && 
      !project.team.some(member => member.equals(req.user._id))) {
    res.status(401);
    throw new Error('Not authorized to mark this message as read');
  }

  // Add user to readBy array if not already present
  if (!message.readBy.includes(req.user._id)) {
    message.readBy.push(req.user._id);
    await message.save();
  }

  res.json(message);
};

export  {
  createMessage,
  getMessagesByProject,
  markMessageAsRead
};