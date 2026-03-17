const express = require('express');
const Expense = require('../models/Expense');
const auth = require('../middleware/auth');
const router = express.Router();

// GET /api/expenses — get all expenses for the user's accountId
router.get('/', auth, async (req, res) => {
  try {
    const expenses = await Expense.find({ accountId: req.user.accountId })
      .sort({ date: -1, createdAt: -1 });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/expenses — add a new expense
router.post('/', auth, async (req, res) => {
  try {
    const { date, description, category, amount, type } = req.body;
    if (!date || !description || !category || !amount || !type)
      return res.status(400).json({ message: 'All fields required' });

    const expense = await Expense.create({
      date, description, category,
      amount: parseFloat(amount),
      type,
      accountId: req.user.accountId,
      addedBy: req.user.name || req.user.email
    });
    res.status(201).json(expense);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/expenses/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    const expense = await Expense.findOneAndDelete({ _id: req.params.id, accountId: req.user.accountId });
    if (!expense) return res.status(404).json({ message: 'Expense not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
