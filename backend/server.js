const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
const allowedOrigins = [process.env.FRONTEND_URL, 'http://localhost:5173'].filter(Boolean);
app.use(cors({ origin: Math.max(allowedOrigins.length, 1) > 1 ? allowedOrigins : allowedOrigins[0], credentials: true }));
app.use(express.json());

const authRoutes = require('./routes/auth');
const expenseRoutes = require('./routes/expenses');
const memberRoutes = require('./routes/members');
const inviteRoutes = require('./routes/invites');
const reportRoutes = require('./routes/reports');
const User = require('./models/User');
const Expense = require('./models/Expense');
const MonthlySummary = require('./models/MonthlySummary');

// Background Worker: Auto-Investment, Savings & Monthly Reset
async function processScheduledDebits() {
  const today = new Date();
  const currentDay = today.getDate();
  const currentMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
  
  // Calculate previous month string
  const prevDate = new Date();
  prevDate.setMonth(prevDate.getMonth() - 1);
  const prevMonth = `${prevDate.getFullYear()}-${String(prevDate.getMonth() + 1).padStart(2, '0')}`;

  console.log(`[Auto-Debit Check] ${new Date().toISOString()} - Current: ${currentMonth}, Prev: ${prevMonth}`);

  try {
    const users = await User.find({});
    
    for (const user of users) {
      // 0. Monthly Reset (at start of month)
      if (user.lastResetMonth !== currentMonth) {
        console.log(`[Monthly Reset] Processing reset for ${user.email} (${prevMonth} -> ${currentMonth})`);
        
        // Find all expenses from PREVIOUS month
        const prevExpenses = await Expense.find({
          accountId: user.accountId || user._id.toString(),
          date: { $regex: `^${prevMonth}` }
        });

        const prevDebits = prevExpenses
          .filter(e => e.type === 'debited')
          .reduce((s, e) => s + (e.amount || 0), 0);
        const prevCredits = prevExpenses
          .filter(e => e.type === 'credited')
          .reduce((s, e) => s + (e.amount || 0), 0);

        const closingBalance = (user.startingBalance || 0) + prevCredits - prevDebits;
        
        // Save Monthly Summary for Reporting
        await MonthlySummary.findOneAndUpdate(
          { accountId: user.accountId || user._id.toString(), month: prevMonth },
          {
            startingBalance: user.startingBalance || 0,
            totalCredited: prevCredits,
            totalDebited: prevDebits,
            closingBalance: closingBalance,
            savingsGoal: user.savingsGoal || 0,
            investmentAmount: user.investmentPlan?.amount || 0
          },
          { upsert: true, new: true }
        );

        user.previousMonthClose = closingBalance;
        user.startingBalance = 0; // Reset to 0 as we are adding carryover as a credit
        user.lastResetMonth = currentMonth;

        // Create a 'credited' expense for the carryover amount
        if (closingBalance > 0) {
          await new Expense({
            description: `Carryover from ${prevMonth}`,
            amount: closingBalance,
            category: 'Salary', // Or 'Other'
            type: 'credited',
            date: today.toISOString().split('T')[0],
            accountId: user.accountId || user._id.toString(),
            addedBy: 'System'
          }).save();
        }
        
        console.log(`[Monthly Reset Success] ${user.email}: Prev Close: ₹${closingBalance} added as Credit`);
      }

      // 1. Process Investment Plan
      const invProcessed = user.lastInvestmentMonth === currentMonth;
      const invTargetDay = currentDay >= (user.investmentPlan?.dayOfMonth || 1);
      
      if (user.investmentPlan?.amount > 0 && invTargetDay && !invProcessed) {
        await new Expense({
          description: `Monthly Investment: ₹${user.investmentPlan.amount}`,
          amount: user.investmentPlan.amount,
          category: 'Investment',
          type: 'debited',
          date: today.toISOString().split('T')[0],
          accountId: user.accountId || user._id.toString(),
          addedBy: 'System'
        }).save();
        
        user.lastInvestmentMonth = currentMonth;
        console.log(`[Auto-Debit Success] Investment ₹${user.investmentPlan.amount} for ${user.email}`);
      }

      // 2. Process Savings Goal
      const savProcessed = user.lastSavingsMonth === currentMonth;
      const savTargetDay = currentDay >= 1; 

      if (user.savingsGoal > 0 && savTargetDay && !savProcessed) {
        await new Expense({
          description: `Monthly Savings Goal: ₹${user.savingsGoal}`,
          amount: user.savingsGoal,
          category: 'Other',
          type: 'debited',
          date: today.toISOString().split('T')[0],
          accountId: user.accountId || user._id.toString(),
          addedBy: 'System'
        }).save();
        
        user.lastSavingsMonth = currentMonth;
        console.log(`[Auto-Debit Success] Savings ₹${user.savingsGoal} for ${user.email}`);
      }

      if (user.isModified()) {
        await user.save();
      }
    }
  } catch (err) {
    console.error('[Auto-Debit Error]:', err);
  }
}

// Check every 6 hours and on startup
setInterval(processScheduledDebits, 6 * 60 * 60 * 1000);
setTimeout(processScheduledDebits, 5000); // 5s after startup


// Routes
app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/invites', inviteRoutes);
app.use('/api/reports', reportRoutes);

// Simple Test Route
app.get('/test', (req, res) => res.send('API is Working!'));
app.get('/', (req, res) => res.send('Expense Tracker Backend API is running! 🚀'));

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('SERVER ERROR:', err);
  res.status(500).json({ message: err.message, stack: err.stack });
});

// Connect to MongoDB and start server
const PORT = process.env.PORT || 5001;
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB Atlas');
    app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
  })
  .catch(err => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });
