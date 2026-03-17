const express = require('express');
const Invite = require('../models/Invite');
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = express.Router();

// GET /api/invites — get pending invites for the logged-in user
router.get('/', auth, async (req, res) => {
  try {
    const invites = await Invite.find({ toEmail: req.user.email, status: 'pending' });
    res.json(invites);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/invites — send an invite
router.post('/', auth, async (req, res) => {
  try {
    const { toEmail } = req.body;
    if (!toEmail) return res.status(400).json({ message: 'Email required' });
    const invite = await Invite.create({
      fromEmail: req.user.email,
      fromName: req.user.name,
      toEmail: toEmail.toLowerCase(),
      accountId: req.user.accountId,
      status: 'pending'
    });
    res.status(201).json(invite);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH /api/invites/:id/accept — accept an invite
router.patch('/:id/accept', auth, async (req, res) => {
  try {
    const invite = await Invite.findById(req.params.id);
    if (!invite) return res.status(404).json({ message: 'Invite not found' });
    invite.status = 'accepted';
    await invite.save();
    // Move user to the shared accountId
    await User.findByIdAndUpdate(req.user._id, { accountId: invite.accountId });
    res.json({ message: 'Accepted', accountId: invite.accountId });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH /api/invites/:id/decline
router.patch('/:id/decline', auth, async (req, res) => {
  try {
    await Invite.findByIdAndUpdate(req.params.id, { status: 'declined' });
    res.json({ message: 'Declined' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
