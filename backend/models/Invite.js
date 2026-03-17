const mongoose = require('mongoose');

const InviteSchema = new mongoose.Schema({
  fromEmail: { type: String, required: true },
  fromName: { type: String },
  toEmail: { type: String, required: true, lowercase: true },
  accountId: { type: String, required: true },
  status: { type: String, enum: ['pending', 'accepted', 'declined'], default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model('Invite', InviteSchema);
