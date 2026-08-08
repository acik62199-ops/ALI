const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_test_demo');
const Payment = require('../models/Payment');
const User = require('../models/User');
const router = express.Router();

// ============ CREATE PAYMENT INTENT ============
router.post('/create-intent', async (req, res) => {
  try {
    const { amount, userId, type, description } = req.body;

    if (!amount || !userId || !type) {
      return res.status(400).json({ msg: '❌ Missing required fields' });
    }

    // Create Stripe payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: 'usd',
      metadata: { userId, type }
    });

    // Save payment record
    const payment = new Payment({
      userId,
      amount,
      type,
      stripeTransactionId: paymentIntent.id,
      status: 'pending',
      description
    });

    await payment.save();

    res.json({ 
      clientSecret: paymentIntent.client_secret, 
      paymentId: payment._id,
      msg: '✅ Payment intent created'
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============ CONFIRM PAYMENT ============
router.post('/confirm', async (req, res) => {
  try {
    const { paymentId } = req.body;
    
    const payment = await Payment.findByIdAndUpdate(
      paymentId, 
      { status: 'completed', completedAt: new Date() }, 
      { new: true }
    );
    
    if (!payment) return res.status(404).json({ msg: '❌ Payment not found' });

    // Update user earnings for withdrawals
    if (payment.type === 'withdrawal') {
      await User.findByIdAndUpdate(payment.userId, { 
        $inc: { totalEarnings: -payment.amount, pendingEarnings: -payment.amount } 
      });
    }

    res.json({ payment, msg: '✅ Payment confirmed successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============ GET PAYMENT HISTORY ============
router.get('/history/:userId', async (req, res) => {
  try {
    const payments = await Payment.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json(payments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============ GET PAYMENT BY ID ============
router.get('/:id', async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) return res.status(404).json({ msg: '❌ Payment not found' });
    res.json(payment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
