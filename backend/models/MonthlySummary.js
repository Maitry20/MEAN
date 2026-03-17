const mongoose = require('mongoose');

const MonthlySummarySchema = new mongoose.Schema({
  accountId: { type: String, required: true },
  month: { type: String, required: true }, // Format: YYYY-MM
  startingBalance: { type: Number, default: 0 },
  totalCredited: { type: Number, default: 0 },
  totalDebited: { type: Number, default: 0 },
  closingBalance: { type: Number, default: 0 },
  savingsGoal: { type: Number, default: 0 },
  investmentAmount: { type: Number, default: 0 }
}, { timestamps: true });

// Ensure one summary per month per account
MonthlySummarySchema.index({ accountId: 1, month: 1 }, { unique: true });

module.exports = mongoose.model('MonthlySummary', MonthlySummarySchema);
