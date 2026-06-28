const Task = require("../models/Task");
const { createTaskSchema, updateTaskSchema } = require("../schema/taskSchema");

/**
 * @route   GET /api/tasks
 * @desc    Get all tasks for the logged-in user
 * @access  Private
 */
const getTasks = async (req, res) => {
  try {
    const query = {
      user: req.user._id,
    };

    if (req.query.status) {
      query.status = req.query.status;
    }

    if (req.query.priority) {
      query.priority = req.query.priority;
    }

    if (req.query.search) {
      query.$or = [
        {
          title: {
            $regex: req.query.search,
            $options: "i",
          },
        },
        {
          description: {
            $regex: req.query.search,
            $options: "i",
          },
        },
      ];
    }

    let sort = {
      createdAt: -1,
    };

    switch (req.query.sort) {
      case "oldest":
        sort = { createdAt: 1 };
        break;

      case "dueDate":
        sort = { dueDate: 1 };
        break;

      case "newest":
        sort = { createdAt: -1 };
        break;
    }

    const tasks = await Task.find(query).sort(sort);

    return res.status(200).json({
      success: true,
      tasks,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @route   GET /api/tasks/:id
 * @desc    Get a single task by ID for the logged-in user
 * @access  Private
 */
const getTask = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    return res.status(200).json({
      success: true,
      task,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @route   POST /api/tasks
 * @desc    Create a new task for the logged-in user
 * @access  Private
 */
const createTask = async (req, res) => {
  const result = createTaskSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      success: false,
      errors: result.error.flatten().fieldErrors,
    });
  }

  try {
    const { title, description, status, priority, dueDate } = result.data;

    const task = await Task.create({
      title,
      description,
      status,
      priority,
      dueDate,
      user: req.user._id,
    });

    return res.status(201).json({
      success: true,
      message: "Task created successfully",
      task,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @route   PUT /api/tasks/:id
 * @desc    Update an existing task for the logged-in user
 * @access  Private
 */
const updateTask = async (req, res) => {
  const result = updateTaskSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      success: false,
      errors: result.error.flatten().fieldErrors,
    });
  }

  try {
    const task = await Task.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user._id,
      },
      result.data,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Task updated successfully",
      task,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @route   DELETE /api/tasks/:id
 * @desc    Delete a task for the logged-in user
 * @access  Private
 */
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @route   PATCH /api/tasks/:id/toggle
 * @desc    Toggle a task's status between Pending and Completed
 * @access  Private
 */
const toggleTaskStatus = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    task.status = task.status === "Completed" ? "Pending" : "Completed";

    await task.save();

    return res.status(200).json({
      success: true,
      task,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  toggleTaskStatus,
};