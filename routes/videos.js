const express = require('express');
const Video = require('../models/Video');
const User = require('../models/User');
const router = express.Router();

// ============ GET ALL VIDEOS ============
router.get('/', async (req, res) => {
  try {
    const videos = await Video.find({ visibility: 'public' })
      .populate('creator', 'username profilePic subscriberCount')
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(videos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============ GET VIDEO BY ID ============
router.get('/:id', async (req, res) => {
  try {
    const video = await Video.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    ).populate('creator', 'username profilePic subscriberCount bio');
    
    if (!video) return res.status(404).json({ msg: '❌ Video not found' });
    res.json(video);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============ UPLOAD VIDEO ============
router.post('/', async (req, res) => {
  try {
    const { title, description, videoUrl, thumbnail, creator, category } = req.body;
    
    if (!title || !videoUrl || !creator) {
      return res.status(400).json({ msg: '❌ Missing required fields' });
    }
    
    const video = new Video({
      title,
      description,
      videoUrl,
      thumbnail,
      creator,
      category
    });
    
    await video.save();
    res.status(201).json({ video, msg: '✅ Video uploaded successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============ LIKE VIDEO ============
router.put('/:id/like', async (req, res) => {
  try {
    const video = await Video.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: 1 } },
      { new: true }
    );
    res.json({ video, msg: '✅ Video liked' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============ ADD COMMENT ============
router.post('/:id/comment', async (req, res) => {
  try {
    const { userId, username, text } = req.body;
    
    const video = await Video.findByIdAndUpdate(
      req.params.id,
      { $push: { comments: { userId, username, text } } },
      { new: true }
    );
    
    res.json({ video, msg: '✅ Comment added' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============ DELETE VIDEO ============
router.delete('/:id', async (req, res) => {
  try {
    const video = await Video.findByIdAndDelete(req.params.id);
    if (!video) return res.status(404).json({ msg: '❌ Video not found' });
    res.json({ msg: '✅ Video deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============ GET CREATOR'S VIDEOS ============
router.get('/creator/:creatorId', async (req, res) => {
  try {
    const videos = await Video.find({ creator: req.params.creatorId })
      .sort({ createdAt: -1 });
    res.json(videos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
