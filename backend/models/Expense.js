const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
  date: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  amount: { type: Number, required: true },
  type: { type: String, enum: ['debited', 'credited'], required: true },
  accountId: { type: String, required: true },
  addedBy: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Expense', ExpenseSchema);
