const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);


router.get('/', async (req, res) => {
  try {
    const { status, search } = req.query;
    let filter = { userId: req.userId };

    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const tasks = await Task.find(filter).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


router.get('/stats', async (req, res) => {
  try {
    const total = await Task.countDocuments({ userId: req.userId });
    const pending = await Task.countDocuments({ userId: req.userId, status: 'Pending' });
    const completed = await Task.countDocuments({ userId: req.userId, status: 'Completed' });

    res.json({ total, pending, completed });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


router.post('/', async (req, res) => {
  const { title, description, status } = req.body;

  try {
    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const task = await Task.create({
      userId: req.userId,
      title,
      description,
      status: status || 'Pending',
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


router.put('/:id', async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.userId });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true, runValidators: true }
    );

    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.userId });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;