const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  videoUrl: {
    type: String,
    required: true
  },
  thumbnail: {
    type: String,
    default: 'https://via.placeholder.com/300'
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    default: 'General'
  },
  tags: [String],
  views: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  },
  dislikes: {
    type: Number,
    default: 0
  },
  comments: [{
    userId: mongoose.Schema.Types.ObjectId,
    username: String,
    text: String,
    createdAt: { type: Date, default: Date.now }
  }],
  duration: Number,
  monetized: {
    type: Boolean,
    default: true
  },
  adEnabled: {
    type: Boolean,
    default: true
  },
  earnings: {
    viewsEarning: { type: Number, default: 0 },
    adsEarning: { type: Number, default: 0 },
    donationsEarning: { type: Number, default: 0 }
  },
  visibility: {
    type: String,
    enum: ['public', 'private', 'unlisted'],
    default: 'public'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Video', videoSchema);
