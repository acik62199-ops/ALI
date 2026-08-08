const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_test_demo');
const Earnings = require('../models/Earnings');
const User = require('../models/User');
const router = express.Router();

// ============ CREATE DONATION ============
router.post('/donate', async (req, res) => {
  try {
    const { amount, videoId, creatorId, donorId, donorName } = req.body;

    if (!amount || !videoId || !creatorId) {
      return res.status(400).json({ msg: '❌ Missing required fields' });
    }

    // Create Stripe payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: 'usd',
      metadata: { videoId, creatorId, donorId, type: 'donation' }
    });

    res.json({ 
      clientSecret: paymentIntent.client_secret,
      msg: '✅ Donation intent created'
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============ CONFIRM DONATION ============
router.post('/confirm-donation', async (req, res) => {
  try {
    const { amount, videoId, creatorId, donorId } = req.body;

    if (!amount || !videoId || !creatorId) {
      return res.status(400).json({ msg: '❌ Missing required fields' });
    }

    // Record earning
    const earning = await Earnings.create({
      userId: creatorId,
      videoId,
      earningType: 'donations',
      amount,
      source: `donor_${donorId}`
    });

    // Update creator's pending earnings
    await User.findByIdAndUpdate(creatorId, { $inc: { pendingEarnings: amount } });

    res.status(201).json({ 
      earning, 
      msg: '✅ Donation confirmed successfully' 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============ GET DONATIONS FOR VIDEO ============
router.get('/video/:videoId', async (req, res) => {
  try {
    const donations = await Earnings.find({ 
      videoId: req.params.videoId, 
      earningType: 'donations' 
    }).sort({ date: -1 });
    
    const total = donations.reduce((sum, d) => sum + d.amount, 0);
    
    res.json({ donations, total, count: donations.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============ GET DONATIONS FOR USER ============
router.get('/user/:userId', async (req, res) => {
  try {
    const donations = await Earnings.find({ 
      userId: req.params.userId, 
      earningType: 'donations' 
    }).sort({ date: -1 });
    
    const total = donations.reduce((sum, d) => sum + d.amount, 0);
    
    res.json({ donations, total, count: donations.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
