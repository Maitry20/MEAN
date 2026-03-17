const express = require('express');
const router = express.Namespace ? express.Router() : express.Router();
const MonthlySummary = require('../models/MonthlySummary');
const auth = require('../middleware/auth');

// GET /api/reports/monthly
router.get('/monthly', auth, async (req, res) => {
  try {
    const accountId = req.user.accountId || req.user._id.toString();
    const summaries = await MonthlySummary.find({ accountId })
      .sort({ month: -1 }); // Newest first
    res.json(summaries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
