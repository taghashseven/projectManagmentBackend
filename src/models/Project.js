import mongoose from "mongoose";

const resourceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Resource name is required"],
    },
    type: {
      type: String,
      enum: ["drive", "folder", "document", "link", "other"],
    },
    url: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/.test(v);
        },
        message: (props) => `${props.value} is not a valid URL!`,
      },
    },
    description: {
      type: String,
      default: "",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: true }
); // Keep _id for embedded docs if needed

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },
    status: {
      type: String,
      enum: ["todo", "in-progress", "review", "done"],
      default: "todo",
    },
    assignedTo: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    weight: {
      type: Number,
      default: 1,
      min: 1,
      max: 10,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "medium",
    },
    dueDate: { type: Date },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const projectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, default: "" },
    status: {
      type: String,
      enum: ["not-started", "in-progress", "on-hold", "completed"],
      default: "not-started",
    },
    startDate: { type: Date, required: true },
    endDate: Date,
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },

    team: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    tasks: [taskSchema],
    resources: [resourceSchema], // Embedded resources
  },
  {
    timestamps: true,
  }
);

// Cascade delete resources when project is deleted
projectSchema.pre("deleteOne", { document: true }, async function (next) {
  await mongoose.model("Resource").deleteMany({ project: this._id });
  next();
});

projectSchema.methods.removeProject = async function () {
  return await this.deleteOne(); // Triggers the pre 'deleteOne' middleware
};

export default mongoose.model("Project", projectSchema);
