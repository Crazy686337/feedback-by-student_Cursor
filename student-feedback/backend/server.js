'use strict';

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const app = express();

// Middleware
app.use(helmet());
app.use(cors({ origin: '*'}));
app.use(express.json());
app.use(morgan('dev'));

// Mongo Connection
const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/student_feedback_db';
mongoose
  .connect(mongoUri, { dbName: undefined })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  });

// Models
const Feedback = require('./src/models/Feedback');

// Routes
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Student Feedback API' });
});

// POST /feedback - create new feedback
app.post('/feedback', async (req, res) => {
  try {
    const { name, rollNo, course, rating, feedback } = req.body;
    if (!name || !rollNo || !course || typeof rating !== 'number' || !feedback) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    const created = await Feedback.create({ name, rollNo, course, rating, feedback });
    return res.status(201).json(created);
  } catch (error) {
    console.error('POST /feedback error', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /feedback - list all feedback
app.get('/feedback', async (req, res) => {
  try {
    const all = await Feedback.find({}).sort({ createdAt: -1 });
    return res.json(all);
  } catch (error) {
    console.error('GET /feedback error', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /feedback/stats - basic aggregations
app.get('/feedback/stats', async (req, res) => {
  try {
    const [byCourse, distribution] = await Promise.all([
      Feedback.aggregate([
        { $group: { _id: '$course', avgRating: { $avg: '$rating' }, count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ]),
      Feedback.aggregate([
        { $group: { _id: '$rating', count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ]),
    ]);
    res.json({ byCourse, distribution });
  } catch (error) {
    console.error('GET /feedback/stats error', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

