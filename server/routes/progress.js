const express = require('express');
const router = express.Router();
const Progress = require('../models/Progress');
const { protect } = require('../middleware/auth');

// All progress routes require JWT
router.use(protect);

// ─────────────────────────────────────
// @route  GET /api/progress
// @desc   Get current user's progress
// @access Private
// ─────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    let progress = await Progress.findOne({ userId: req.user._id });
    if (!progress) {
      progress = await Progress.create({ userId: req.user._id });
    }
    res.json({ success: true, data: progress });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching progress.' });
  }
});

// ─────────────────────────────────────
// @route  PUT /api/progress/explore/:algoId
// @desc   Mark an algorithm as explored
// @access Private
// ─────────────────────────────────────
router.put('/explore/:algoId', async (req, res) => {
  try {
    const { algoId } = req.params;
    let progress = await Progress.findOne({ userId: req.user._id });
    if (!progress) progress = await Progress.create({ userId: req.user._id });

    if (!progress.explored.includes(algoId)) {
      progress.explored.push(algoId);
      // Update streak
      const now = new Date();
      const lastActivity = progress.streak.lastActivity;
      const diffDays = lastActivity
        ? Math.floor((now - lastActivity) / (1000 * 60 * 60 * 24))
        : null;

      if (diffDays === 1) progress.streak.count += 1;
      else if (diffDays === null || diffDays > 1) progress.streak.count = 1;
      progress.streak.lastActivity = now;

      await progress.save();
    }

    res.json({ success: true, message: `${algoId} marked as explored!`, data: progress });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error updating progress.' });
  }
});

// ─────────────────────────────────────
// @route  PUT /api/progress/quiz/:algoId
// @desc   Save quiz score for an algorithm
// @access Private
// ─────────────────────────────────────
router.put('/quiz/:algoId', async (req, res) => {
  try {
    const { algoId } = req.params;
    const { score } = req.body;

    if (typeof score !== 'number' || score < 0 || score > 4) {
      return res.status(400).json({ success: false, message: 'Score must be between 0 and 4.' });
    }

    let progress = await Progress.findOne({ userId: req.user._id });
    if (!progress) progress = await Progress.create({ userId: req.user._id });

    progress.quizScores.set(algoId, score);
    await progress.save();

    res.json({
      success: true,
      message: `Quiz score ${score}/4 saved for ${algoId}`,
      totalPoints: progress.totalPoints,
      data: progress
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error saving quiz score.' });
  }
});

// ─────────────────────────────────────
// @route  DELETE /api/progress/reset
// @desc   Reset all user progress
// @access Private
// ─────────────────────────────────────
router.delete('/reset', async (req, res) => {
  try {
    await Progress.findOneAndUpdate(
      { userId: req.user._id },
      { explored: [], quizScores: new Map(), totalPoints: 0, streak: { count: 0 } }
    );
    res.json({ success: true, message: 'Progress reset successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error resetting progress.' });
  }
});

module.exports = router;
