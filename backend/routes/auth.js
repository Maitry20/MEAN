const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = express.Router();

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

// POST /api/auth/register
router.post('/register', async (req, res, next) => {
  const { name, email, password } = req.body;
  console.log('--- REGISTRATION ATTEMPT ---');
  console.log('Email:', email);

  try {
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields required' });
    }

    const emailLower = email.toLowerCase();
    const exists = await User.findOne({ email: emailLower });
    if (exists) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    console.log('Creating user...');
    // In Mongoose 8.x, we can still use this pattern
    const user = new User({ name, email: emailLower, password });
    user.accountId = user._id.toString();
    
    await user.save();
    console.log('User saved to MongoDB');

    const token = signToken(user._id);

    return res.status(201).json({ 
      token,
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        accountId: user.accountId 
      }
    });
  } catch (err) {
    console.error('CRITICAL REGISTRATION ERROR:', err);
    // Express 4 needs next(err) for async errors
    return next(err);
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: 'Email and password required' });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ message: 'Invalid email or password' });

    res.json({ 
      token: signToken(user._id),
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        accountId: user.accountId, 
        startingBalance: user.startingBalance,
        savingsGoal: user.savingsGoal,
        investmentPlan: user.investmentPlan,
        previousMonthClose: user.previousMonthClose
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/auth/me
router.get('/me', require('../middleware/auth'), async (req, res) => {
  const u = req.user;
  res.json({ 
    id: u._id, 
    name: u.name, 
    email: u.email, 
    accountId: u.accountId, 
    previousMonthClose: u.previousMonthClose
  });
});

// Update profile (e.g. starting balance, investment plan)
router.patch('/profile', auth, async (req, res) => {
  const { startingBalance, savingsGoal, investmentPlan } = req.body;
  
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    if (startingBalance !== undefined) user.startingBalance = startingBalance;
    if (savingsGoal !== undefined) user.savingsGoal = savingsGoal;
    if (investmentPlan !== undefined) {
      user.investmentPlan = {
        amount: investmentPlan.amount || 0,
        dayOfMonth: investmentPlan.dayOfMonth || 1
      };
    }
    
    await user.save();
    
    res.json({
      message: 'Profile updated',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        accountId: user.accountId || user._id,
        startingBalance: user.startingBalance,
        savingsGoal: user.savingsGoal,
        investmentPlan: user.investmentPlan,
        previousMonthClose: user.previousMonthClose
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
