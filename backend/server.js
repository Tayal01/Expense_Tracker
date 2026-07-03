const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const expenseRoutes = require('./routes/expenses');
const budgetRoutes = require('./routes/budgets');

const app = express();

// Middleware: parse incoming JSON bodies, allow requests from the frontend
app.use(cors());
app.use(express.json());

// Mount the route groups. Every URL starting with /api/auth goes to
// auth.js, /api/expenses goes to expenses.js, /api/budgets goes to budgets.js.
app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/budgets', budgetRoutes);

// Simple health check route - useful to confirm the server is alive
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 8001;

// Connect to MongoDB first, only start listening for requests once
// the DB connection succeeds - avoids handling requests with no DB.
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('MongoDB connection failed:', err.message);
  });
