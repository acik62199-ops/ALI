const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// ============ REGISTER ============
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user exists
    let user = await User.findOne({ $or: [{ email }, { username }] });
    if (user) return res.status(400).json({ msg: '❌ User already exists' });

    // Create new user
    user = new User({ username, email, password });
    await user.save();

    // Generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
    
    res.status(201).json({ 
      token, 
      user: { id: user._id, username, email },
      msg: '✅ Registration successful'
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============ LOGIN ============
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: '❌ Invalid credentials' });

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ msg: '❌ Invalid credentials' });

    // Generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
    
    res.json({ 
      token, 
      user: { id: user._id, username: user.username, email },
      msg: '✅ Login successful'
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
