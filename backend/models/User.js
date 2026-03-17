const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  accountId: { type: String }, // shared account ID for group tracking
  startingBalance: { type: Number, default: 0 },
  savingsGoal: { type: Number, default: 0 },
  investmentPlan: {
    amount: { type: Number, default: 0 },
    dayOfMonth: { type: Number, default: 1 }
  },
  lastInvestmentMonth: { type: String, default: '' }, // Format: YYYY-MM
  lastSavingsMonth: { type: String, default: '' }, // Format: YYYY-MM
  lastResetMonth: { type: String, default: '' }, // Format: YYYY-MM
  previousMonthClose: { type: Number, default: 0 }
}, { timestamps: true });

// Hash password before saving
UserSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 12);
});

// Compare passwords
UserSchema.methods.comparePassword = async function(candidate) {
  return bcrypt.compare(candidate, this.password);
};

module.exports = mongoose.model('User', UserSchema);
