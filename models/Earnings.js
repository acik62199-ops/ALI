const mongoose = require('mongoose');

const earningsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  videoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Video'
  },
  earningType: {
    type: String,
    enum: ['views', 'ads', 'donations', 'subscriptions', 'sponsorship'],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  source: String,
  date: {
    type: Date,
    default: Date.now
  },
  processed: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('Earnings', earningsSchema);
