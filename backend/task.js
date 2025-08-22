const mongoose = require("mongoose");

// Task Schema
const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
    default: "",
  },
  completed: {
    type: Boolean,
    default: false,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt field before saving
taskSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

const Task = mongoose.model("Task", taskSchema);

// Task CRUD Operations
const taskController = {
  // CREATE - Add a new task
  createTask: async (req, res) => {
    try {
      const { title, description, userId } = req.body;

      // Validation
      if (!title || !userId) {
        return res.status(400).json({
          message: "Missing required fields",
          error: "Title and userId are required",
        });
      }

      // Create new task
      const task = new Task({
        title: title.trim(),
        description: description ? description.trim() : "",
        userId: userId,
      });

      await task.save();

      res.status(201).json({
        message: "Task created successfully",
        task: task,
      });
    } catch (error) {
      res.status(400).json({
        message: "Error creating task",
        error: error.message,
      });
    }
  },

  // READ - Get all tasks (with optional user filter)
  getTasks: async (req, res) => {
    try {
      const { userId, completed } = req.query;

      // Build filter object
      let filter = {};
      if (userId) filter.userId = userId;
      if (completed !== undefined) filter.completed = completed === "true";

      const tasks = await Task.find(filter)
        .populate("userId", "username email")
        .sort({ createdAt: -1 });

      res.json({
        message: "Tasks retrieved successfully",
        count: tasks.length,
        tasks: tasks,
      });
    } catch (error) {
      res.status(500).json({
        message: "Error retrieving tasks",
        error: error.message,
      });
    }
  },

  // READ - Get a single task by ID
  getTaskById: async (req, res) => {
    try {
      const { id } = req.params;

      const task = await Task.findById(id).populate("userId", "username email");

      if (!task) {
        return res.status(404).json({
          message: "Task not found",
          error: "No task found with the provided ID",
        });
      }

      res.json({
        message: "Task retrieved successfully",
        task: task,
      });
    } catch (error) {
      if (error.name === "CastError") {
        return res.status(400).json({
          message: "Invalid task ID",
          error: "The provided ID is not valid",
        });
      }

      res.status(500).json({
        message: "Error retrieving task",
        error: error.message,
      });
    }
  },

  // UPDATE - Update a task by ID
  updateTask: async (req, res) => {
    try {
      const { id } = req.params;
      const { title, description, completed } = req.body;

      // Build update object
      const updateData = {};
      if (title !== undefined) updateData.title = title.trim();
      if (description !== undefined)
        updateData.description = description.trim();
      if (completed !== undefined) updateData.completed = completed;
      updateData.updatedAt = new Date();

      const task = await Task.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
      }).populate("userId", "username email");

      if (!task) {
        return res.status(404).json({
          message: "Task not found",
          error: "No task found with the provided ID",
        });
      }

      res.json({
        message: "Task updated successfully",
        task: task,
      });
    } catch (error) {
      if (error.name === "CastError") {
        return res.status(400).json({
          message: "Invalid task ID",
          error: "The provided ID is not valid",
        });
      }

      res.status(400).json({
        message: "Error updating task",
        error: error.message,
      });
    }
  },

  // DELETE - Delete a task by ID
  deleteTask: async (req, res) => {
    try {
      const { id } = req.params;

      const task = await Task.findByIdAndDelete(id);

      if (!task) {
        return res.status(404).json({
          message: "Task not found",
          error: "No task found with the provided ID",
        });
      }

      res.json({
        message: "Task deleted successfully",
        task: task,
      });
    } catch (error) {
      if (error.name === "CastError") {
        return res.status(400).json({
          message: "Invalid task ID",
          error: "The provided ID is not valid",
        });
      }

      res.status(500).json({
        message: "Error deleting task",
        error: error.message,
      });
    }
  },

  // UTILITY - Get user's task statistics
  getTaskStats: async (req, res) => {
    try {
      const { userId } = req.params;

      const stats = await Task.aggregate([
        { $match: { userId: new mongoose.Types.ObjectId(userId) } },
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            completed: { $sum: { $cond: ["$completed", 1, 0] } },
            pending: { $sum: { $cond: ["$completed", 0, 1] } },
          },
        },
      ]);

      const result =
        stats.length > 0 ? stats[0] : { total: 0, completed: 0, pending: 0 };
      delete result._id;

      res.json({
        message: "Task statistics retrieved successfully",
        stats: result,
      });
    } catch (error) {
      res.status(500).json({
        message: "Error retrieving task statistics",
        error: error.message,
      });
    }
  },
};

module.exports = {
  Task,
  taskController,
};
