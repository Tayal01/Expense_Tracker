const mongoose = require('mongoose');

// One Budget document = one monthly spending cap. If `category` is null,
// it's an overall monthly budget. If set, it's a per-category cap
// (e.g. "Food: 8000/month").
const budgetSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    month: {
      type: Number, // 1-12
      required: true,
      min: 1,
      max: 12,
    },
    year: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      default: null, // null = overall budget, not tied to one category
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { timestamps: true }
);

// A user can only have ONE budget per (month, year, category) combination -
// this prevents duplicate caps for the same thing and lets us "upsert"
// cleanly when the user updates an existing budget.
budgetSchema.index({ user: 1, month: 1, year: 1, category: 1 }, { unique: true });

module.exports = mongoose.model('Budget', budgetSchema);
