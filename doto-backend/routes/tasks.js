const Task = require('../models/Task'); 
const express = require('express')
const authenticateToken = require('../authentication/authenticateToken')
const router = express.Router();



router.post('/create-task', authenticateToken, async (req, res) => {
  const { title, description, dueDate, status } = req.body;

  if (!title || !description || !dueDate) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const newTask = new Task({
      user: req.user._id, // comes from decoded JWT
      title,
      description,
      dueDate,
      status: status || 'pending'
    });

    await newTask.save();

    res.status(201).json({ message: 'Task created', task: newTask });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create task' });
  }
});

  router.get('/my-tasks', authenticateToken, async (req, res) => {
  try {
    //find by user._id in login field
    const tasks = await Task.find({ user: req.user._id });

    res.status(200).json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

router.patch('/edit-task', authenticateToken, async (req, res) => {
  const { _id, title, description, dueDate, status } = req.body;

  if (!_id) {
    return res.status(400).json({ error: 'Task ID is required' });
  }

  try {
    // Find the task by _id and ensure it belongs to the authenticated user
    const task = await Task.findOne({ _id, user: req.user._id });

    if (!task) {
      return res.status(404).json({ error: 'Task not found or unauthorized' });
    }

    // Update the task fields if provided
    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (dueDate !== undefined) task.dueDate = dueDate;
    if(status !== undefined) task.status = status;
    await task.save();

    res.status(200).json({ message: 'Task updated successfully', task });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update task' });
  }
});

   
router.delete('/delete-task/:id', authenticateToken, async (req, res) => {
  const taskId = req.params.id;

  if (!taskId) {
    return res.status(400).json({ message: 'Task ID is required' });
  }

  try {
    const task = await Task.findOneAndDelete({ _id: taskId, user: req.user._id });

    if (!task) {
      return res.status(404).json({ error: 'Task not found or unauthorized' });
    }

    return res.status(200).json({ message: 'Task deleted successfully' });
  } catch (err) {
    console.error('Delete task error:', err);
    return res.status(500).json({ error: 'Failed to delete task' });
  }
});

module.exports = router;