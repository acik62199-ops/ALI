const express = require('express');
const Advertisement = require('../models/Advertisement');
const Earnings = require('../models/Earnings');
const Video = require('../models/Video');
const router = express.Router();

// ============ CREATE ADVERTISEMENT ============
router.post('/', async (req, res) => {
  try {
    const { videoId, adType } = req.body;

    if (!videoId) {
      return res.status(400).json({ msg: '❌ Video ID is required' });
    }

    const ad = new Advertisement({ videoId, adType });
    await ad.save();

    res.status(201).json({ ad, msg: '✅ Advertisement created' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============ RECORD AD IMPRESSION ============
router.post('/:adId/impression', async (req, res) => {
  try {
    const ad = await Advertisement.findByIdAndUpdate(
      req.params.adId,
      { $inc: { impressions: 1 } },
      { new: true }
    );

    if (!ad) return res.status(404).json({ msg: '❌ Ad not found' });
    
    // Calculate earnings (CPM model)
    const earningsAmount = (ad.impressions / 1000) * ad.cpm;
    
    const video = await Video.findById(ad.videoId);
    
    // Record earning
    await Earnings.create({
      userId: video.creator,
      videoId: ad.videoId,
      earningType: 'ads',
      amount: earningsAmount / 1000,
      source: 'advertisement'
    });

    res.json({ ad, msg: '✅ Impression recorded' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============ RECORD AD CLICK ============
router.post('/:adId/click', async (req, res) => {
  try {
    const ad = await Advertisement.findByIdAndUpdate(
      req.params.adId,
      { $inc: { clicks: 1 } },
      { new: true }
    );

    if (!ad) return res.status(404).json({ msg: '❌ Ad not found' });

    res.json({ ad, msg: '✅ Click recorded' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============ GET AD BY ID ============
router.get('/:id', async (req, res) => {
  try {
    const ad = await Advertisement.findById(req.params.id).populate('videoId');
    if (!ad) return res.status(404).json({ msg: '❌ Ad not found' });
    res.json(ad);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============ GET ADS FOR VIDEO ============
router.get('/video/:videoId', async (req, res) => {
  try {
    const ads = await Advertisement.find({ videoId: req.params.videoId });
    res.json(ads);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
