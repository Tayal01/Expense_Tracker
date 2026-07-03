const mongoose = require('mongoose');

// Each expense belongs to exactly one user (the "user" field below).
// This is how we make sure users only ever see their own expenses.
//
// Design note: instead of creating two separate collections for "income"
// and "expense", we use a single Transaction-style schema with a `type`
// discriminator field. Income and expense entries share the exact same
// shape (amount, category, date, notes) so one schema keeps things DRY
// and makes it trivial to query "all money movement" in one go.
const expenseSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['income', 'expense'],
      required: true,
      default: 'expense',
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      // Free text now (not a strict enum) because income categories
      // like "Salary" or "Freelance" are different from expense
      // categories like "Food" or "Rent". The frontend still suggests
      // sensible options per type, but the schema stays flexible.
      type: String,
      required: true,
      trim: true,
      default: 'Other',
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

// Index to make "get my expenses sorted by date" queries fast.
expenseSchema.index({ user: 1, date: -1 });
expenseSchema.index({ user: 1, type: 1 });

module.exports = mongoose.model('Expense', expenseSchema);

