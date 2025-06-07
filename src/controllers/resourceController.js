import Resource  from '../models/Resource.js';
import  upload from '../utils/upload.js'

// @desc    Create new resource
// @route   POST /api/resources
// @access  Private
const createResource = async (req, res) => {
  const { name, description, type, project } = req.body;
  const url = req.file ? req.file.path : req.body.url;

  if (!url) {
    res.status(400);
    throw new Error('Resource URL is required');
  }

  const resource = await Resource.create({
    name,
    description,
    type,
    url,
    project,
    uploadedBy: req.user._id
  });

  res.status(201).json(resource);
}

// @desc    Get resources by project
// @route   GET /api/resources/project/:projectId
// @access  Private
const getResourcesByProject = async (req, res) => {
  const resources = await Resource.find({ project: req.params.projectId })
    .populate('uploadedBy', 'name email avatar')
    .sort('-createdAt');

  res.json(resources);
}

// @desc    Delete resource
// @route   DELETE /api/resources/:id
// @access  Private
const deleteResource = async (req, res) => {
  const resource = await Resource.findById(req.params.id);

  if (!resource) {
    res.status(404);
    throw new Error('Resource not found');
  }

  // Check if user uploaded the resource or is project owner
  const project = await Project.findById(resource.project);
  if (!resource.uploadedBy.equals(req.user._id) && 
      !project.owner.equals(req.user._id)) {
    res.status(401);
    throw new Error('Not authorized to delete this resource');
  }

  await resource.remove();
  res.json({ message: 'Resource removed' });
}



const createResourceWithUpload = [upload.single('file'), createResource];

export {
  createResourceWithUpload as createResource,
  getResourcesByProject,
  deleteResource
};
  
