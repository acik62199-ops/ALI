const express = require('express');
const User = require('../models/User');
const router = express.Router();

// ============ GET USER PROFILE ============
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password').populate('subscribers', 'username profilePic');
    if (!user) return res.status(404).json({ msg: '❌ User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============ UPDATE PROFILE ============
router.put('/:id', async (req, res) => {
  try {
    const { username, bio, profilePic, bankAccount } = req.body;
    
    const user = await User.findByIdAndUpdate(req.params.id, 
      { username, bio, profilePic, bankAccount },
      { new: true }
    ).select('-password');

    res.json({ user, msg: '✅ Profile updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============ SUBSCRIBE TO CREATOR ============
router.post('/:id/subscribe', async (req, res) => {
  try {
    const { userId } = req.body;
    
    const user = await User.findByIdAndUpdate(req.params.id,
      { $addToSet: { subscribers: userId }, $inc: { subscriberCount: 1 } },
      { new: true }
    );

    res.json({ user, msg: '✅ Subscribed successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============ GET EARNINGS DASHBOARD ============
router.get('/:id/dashboard', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('totalEarnings pendingEarnings subscriberCount');
    if (!user) return res.status(404).json({ msg: '❌ User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============ GET ALL USERS ============
router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('-password').limit(50);
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
