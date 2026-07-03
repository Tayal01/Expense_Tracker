const express = require('express');
const mongoose = require('mongoose');
const Expense = require('../models/Expense');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Every route below runs authMiddleware first, so req.userId is always
// guaranteed to exist by the time the handler code runs.
router.use(authMiddleware);

// GET /api/expenses?type=income&category=Food&from=2026-01-01&to=2026-01-31
// Returns the logged-in user's transactions (income + expense), optionally filtered.
router.get('/', async (req, res) => {
  try {
    const { type, category, from, to } = req.query;

    const filter = { user: req.userId };

    if (type) filter.type = type; // 'income' or 'expense'
    if (category) filter.category = category;

    if (from || to) {
      filter.date = {};
      if (from) filter.date.$gte = new Date(from);
      if (to) filter.date.$lte = new Date(to);
    }

    const expenses = await Expense.find(filter).sort({ date: -1 });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch expenses', error: err.message });
  }
});

// POST /api/expenses
// `type` defaults to 'expense' if not sent, so old frontend calls still work.
router.post('/', async (req, res) => {
  try {
    const { title, amount, category, date, notes, type } = req.body;

    if (!title || amount === undefined) {
      return res.status(400).json({ message: 'Title and amount are required' });
    }

    const expense = await Expense.create({
      user: req.userId,
      type: type === 'income' ? 'income' : 'expense',
      title,
      amount,
      category,
      date,
      notes,
    });

    res.status(201).json(expense);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create expense', error: err.message });
  }
});

// PUT /api/expenses/:id
router.put('/:id', async (req, res) => {
  try {
    // Match on BOTH _id and user, so someone can never edit another user's expense
    // just by guessing an id.
    const expense = await Expense.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    res.json(expense);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update expense', error: err.message });
  }
});

// DELETE /api/expenses/:id
router.delete('/:id', async (req, res) => {
  try {
    const expense = await Expense.findOneAndDelete({ _id: req.params.id, user: req.userId });

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    res.json({ message: 'Expense deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete expense', error: err.message });
  }
});

// GET /api/expenses/analytics/summary
// This is the "financial insights" feature - a set of MongoDB aggregation
// pipelines that compute net balance, this month's income/expense, spend
// by category, and month-over-month totals - all on the database side.
router.get('/analytics/summary', async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.userId);
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    // 1. Net balance = all-time income minus all-time expense
    const totalsByType = await Expense.aggregate([
      { $match: { user: userId } },
      { $group: { _id: '$type', total: { $sum: '$amount' } } },
    ]);
    const totalIncomeAllTime = totalsByType.find((t) => t._id === 'income')?.total || 0;
    const totalExpenseAllTime = totalsByType.find((t) => t._id === 'expense')?.total || 0;

    // 2. This month's income vs expense (for the "Income vs Expense" bar chart)
    const thisMonthByType = await Expense.aggregate([
      {
        $match: {
          user: userId,
          date: { $gte: startOfMonth, $lt: startOfNextMonth },
        },
      },
      { $group: { _id: '$type', total: { $sum: '$amount' } } },
    ]);
    const monthIncome = thisMonthByType.find((t) => t._id === 'income')?.total || 0;
    const monthExpense = thisMonthByType.find((t) => t._id === 'expense')?.total || 0;

    // 3. Expense breakdown by category (only 'expense' type - income
    //    categories like "Salary" don't belong in a spending breakdown)
    const byCategory = await Expense.aggregate([
      { $match: { user: userId, type: 'expense' } },
      { $group: { _id: '$category', total: { $sum: '$amount' }, count: { $sum: 1 } } },
      { $sort: { total: -1 } },
    ]);

    // 4. Month-over-month trend, split by type
    const byMonth = await Expense.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: { year: { $year: '$date' }, month: { $month: '$date' }, type: '$type' },
          total: { $sum: '$amount' },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    res.json({
      netBalance: totalIncomeAllTime - totalExpenseAllTime,
      totalIncomeAllTime,
      totalExpenseAllTime,
      currentMonth: { income: monthIncome, expense: monthExpense },
      byCategory,
      byMonth,
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to compute analytics', error: err.message });
  }
});

module.exports = router;
