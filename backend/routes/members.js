const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = express.Router();

// GET /api/members — all users sharing the same accountId
router.get('/', auth, async (req, res) => {
  try {
    const members = await User.find({ accountId: req.user.accountId }).select('-password');
    res.json(members.map(m => ({ id: m._id, name: m.name, email: m.email })));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
