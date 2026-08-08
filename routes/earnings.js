const express = require('express');
const Earnings = require('../models/Earnings');
const User = require('../models/User');
const Video = require('../models/Video');
const router = express.Router();

// ============ GET EARNINGS FOR USER ============
router.get('/:userId', async (req, res) => {
  try {
    const earnings = await Earnings.find({ userId: req.params.userId })
      .sort({ date: -1 })
      .limit(100);
    
    // Get summary by type
    const summary = await Earnings.aggregate([
      { $match: { userId: require('mongoose').Types.ObjectId(req.params.userId) } },
      { $group: { _id: '$earningType', total: { $sum: '$amount' } } }
    ]);

    res.json({ earnings, summary });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============ RECORD EARNING ============
router.post('/', async (req, res) => {
  try {
    const { userId, videoId, earningType, amount, source } = req.body;

    if (!userId || !earningType || !amount) {
      return res.status(400).json({ msg: '❌ Missing required fields' });
    }

    const earning = new Earnings({
      userId,
      videoId,
      earningType,
      amount,
      source
    });

    await earning.save();

    // Update user's pending earnings
    await User.findByIdAndUpdate(userId, { $inc: { pendingEarnings: amount } });

    res.status(201).json({ earning, msg: '✅ Earning recorded' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============ GET EARNINGS BY VIDEO ============
router.get('/video/:videoId', async (req, res) => {
  try {
    const earnings = await Earnings.find({ videoId: req.params.videoId }).sort({ date: -1 });
    
    const total = earnings.reduce((sum, e) => sum + e.amount, 0);
    
    res.json({ earnings, total });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============ PROCESS MONTHLY EARNINGS ============
router.post('/process/monthly', async (req, res) => {
  try {
    const unprocessedEarnings = await Earnings.find({ processed: false });
    
    // Group by user
    const userEarnings = {};
    unprocessedEarnings.forEach(e => {
      if (!userEarnings[e.userId]) userEarnings[e.userId] = 0;
      userEarnings[e.userId] += e.amount;
    });

    // Update users
    for (const userId in userEarnings) {
      await User.findByIdAndUpdate(userId, { 
        $inc: { totalEarnings: userEarnings[userId] }
      });
    }

    // Mark as processed
    await Earnings.updateMany({ processed: false }, { processed: true });

    res.json({ msg: '✅ Monthly earnings processed', summary: userEarnings });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
