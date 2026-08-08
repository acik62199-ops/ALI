const mongoose = require('mongoose');

const adSchema = new mongoose.Schema({
  videoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Video',
    required: true
  },
  adType: {
    type: String,
    enum: ['pre-roll', 'mid-roll', 'post-roll'],
    default: 'pre-roll'
  },
  impressions: {
    type: Number,
    default: 0
  },
  clicks: {
    type: Number,
    default: 0
  },
  earnings: {
    type: Number,
    default: 0
  },
  cpm: {
    type: Number,
    default: 5
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Advertisement', adSchema);
