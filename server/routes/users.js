const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Progress = require('../models/Progress');
const { protect, adminOnly } = require('../middleware/auth');

// All routes require admin authentication
router.use(protect, adminOnly);

// ─────────────────────────────────────
// @route  GET /api/users
// @desc   Get all users (with pagination)
// @access Admin only
// ─────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const search = req.query.search || '';

    const query = search
      ? { $or: [{ name: new RegExp(search, 'i') }, { email: new RegExp(search, 'i') }] }
      : {};

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .select('-password');

    // Attach progress to each user
    const usersWithProgress = await Promise.all(users.map(async u => {
      const progress = await Progress.findOne({ userId: u._id });
      return {
        ...u.toPublic(),
        progress: progress ? {
          explored: progress.explored,
          quizCount: progress.quizScores ? progress.quizScores.size : 0,
          totalPoints: progress.totalPoints
        } : { explored: [], quizCount: 0, totalPoints: 0 }
      };
    }));

    res.json({
      success: true,
      data: usersWithProgress,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) }
    });
  } catch (err) {
    console.error('Get users error:', err.message);
    res.status(500).json({ success: false, message: 'Error fetching users.' });
  }
});

// ─────────────────────────────────────
// @route  GET /api/users/stats
// @desc   Get platform-wide stats for admin dashboard
// @access Admin only
// ─────────────────────────────────────
router.get('/stats', async (req, res) => {
  try {
    const [totalUsers, blockedUsers, allProgress] = await Promise.all([
      User.countDocuments({ isAdmin: false }),
      User.countDocuments({ isBlocked: true }),
      Progress.find()
    ]);

    const allScores = allProgress.flatMap(p => Array.from(p.quizScores?.values() || []));
    const allExplores = allProgress.flatMap(p => p.explored || []);
    const totalQuizzes = allScores.length;
    const avgScore = totalQuizzes ? (allScores.reduce((a, b) => a + b, 0) / totalQuizzes).toFixed(1) : 0;

    // Most explored algorithms
    const exploreCount = {};
    allExplores.forEach(id => { exploreCount[id] = (exploreCount[id] || 0) + 1; });
    const topAlgos = Object.entries(exploreCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([id, count]) => ({ id, count }));

    res.json({
      success: true,
      stats: { totalUsers, blockedUsers, totalQuizzes, avgScore, topAlgos, totalExplores: allExplores.length }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching stats.' });
  }
});

// ─────────────────────────────────────
// @route  PUT /api/users/:id/block
// @desc   Toggle block/unblock user
// @access Admin only
// ─────────────────────────────────────
router.put('/:id/block', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    if (user.isAdmin) return res.status(403).json({ success: false, message: 'Cannot block an admin.' });

    user.isBlocked = !user.isBlocked;
    await user.save();
    res.json({
      success: true,
      message: `User ${user.isBlocked ? 'blocked' : 'unblocked'} successfully.`,
      isBlocked: user.isBlocked
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error updating user.' });
  }
});

// ─────────────────────────────────────
// @route  DELETE /api/users/:id
// @desc   Delete user and their progress
// @access Admin only
// ─────────────────────────────────────
router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    if (user.isAdmin) return res.status(403).json({ success: false, message: 'Cannot delete an admin.' });

    await Promise.all([
      User.findByIdAndDelete(req.params.id),
      Progress.findOneAndDelete({ userId: req.params.id })
    ]);
    res.json({ success: true, message: 'User deleted successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error deleting user.' });
  }
});

module.exports = router;
