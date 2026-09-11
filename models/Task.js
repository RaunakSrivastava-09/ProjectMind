import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    assignee: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["open", "in-progress", "completed"],
      default: "open",
    },

    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Task =
  mongoose.models.Task ||
  mongoose.model("Task", TaskSchema);

export default Task;