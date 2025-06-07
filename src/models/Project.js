import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['not-started', 'in-progress', 'on-hold', 'completed'],
    default: 'not-started'
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: Date,
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  team: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true
});

projectSchema.methods.removeProject = async function() {
  return await this.deleteOne();
};

export default mongoose.model('Project', projectSchema);