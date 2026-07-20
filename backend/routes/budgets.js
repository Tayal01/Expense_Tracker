const express = require('express');
const mongoose = require('mongoose');
const Budget = require('../models/Budget');
const Expense = require('../models/Expense');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);

// GET /api/budgets?month=7&year=2026
// Returns budgets for that month, each enriched with "spent so far" -
// computed by aggregating actual expenses against the budget's category
// (or all expenses, if it's an overall/non-category budget).
router.get('/', async (req, res) => {
  try {
    const month = Number(req.query.month) || new Date().getMonth() + 1;
    const year = Number(req.query.year) || new Date().getFullYear();
    const userId = new mongoose.Types.ObjectId(req.userId);

    const budgets = await Budget.find({ user: req.userId, month, year });

    const startOfMonth = new Date(year, month - 1, 1);
    const startOfNextMonth = new Date(year, month, 1);

    // For each budget, work out how much has actually been spent so we
    // can show "₹3,200 / ₹5,000 spent" style progress in the UI.
    const enriched = await Promise.all(
      budgets.map(async (budget) => {
        const cat = budget.category ? budget.category.trim() : '';
        const isOverall = !cat || cat.toLowerCase() === 'overall' || cat.toLowerCase() === 'monthly budget';
        const normalizedCategory = isOverall ? null : budget.category;

        const matchStage = {
          user: userId,
          type: 'expense',
          date: { $gte: startOfMonth, $lt: startOfNextMonth },
        };
        if (normalizedCategory) matchStage.category = normalizedCategory;

        const result = await Expense.aggregate([
          { $match: matchStage },
          { $group: { _id: null, total: { $sum: '$amount' } } },
        ]);

        return {
          ...budget.toObject(),
          category: normalizedCategory,
          spent: result[0]?.total || 0,
        };
      })
    );

    res.json(enriched);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch budgets', error: err.message });
  }
});

// POST /api/budgets
// Creates a budget, or updates it if one already exists for the same
// user + month + year + category ("upsert"), so setting a budget twice
// for the same month just overwrites the cap instead of duplicating it.
router.post('/', async (req, res) => {
  try {
    const { month, year, category, amount } = req.body;

    if (!month || !year || amount === undefined) {
      return res.status(400).json({ message: 'month, year and amount are required' });
    }

    const cat = category ? category.trim() : null;
    const isOverall = !cat || cat.toLowerCase() === 'overall' || cat.toLowerCase() === 'monthly budget';
    const normalizedCategory = isOverall ? null : cat;

    const budget = await Budget.findOneAndUpdate(
      { user: req.userId, month, year, category: normalizedCategory },
      { amount },
      { new: true, upsert: true, runValidators: true }
    );

    res.status(201).json(budget);
  } catch (err) {
    res.status(500).json({ message: 'Failed to set budget', error: err.message });
  }
});

// DELETE /api/budgets/:id
router.delete('/:id', async (req, res) => {
  try {
    const budget = await Budget.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!budget) return res.status(404).json({ message: 'Budget not found' });
    res.json({ message: 'Budget deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete budget', error: err.message });
  }
});

module.exports = router;
