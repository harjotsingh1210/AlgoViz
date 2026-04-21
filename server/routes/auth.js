const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Progress = require('../models/Progress');
const { protect, generateToken } = require('../middleware/auth');

// Validation helpers
const handleValidation = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: errors.array()[0].msg });
  }
  return null;
};

// ─────────────────────────────────────
// @route  POST /api/auth/signup
// @desc   Register new user
// @access Public
// ─────────────────────────────────────
router.post('/signup', [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Please enter a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
], async (req, res) => {
  const err = handleValidation(req, res);
  if (err) return;

  try {
    const { name, email, password } = req.body;

    // Check if email already in use
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Email already registered. Please login.' });
    }

    // Create user
    const user = await User.create({ name, email, password });

    // Create blank progress record
    await Progress.create({ userId: user._id });

    // Update lastLogin
    user.lastLogin = new Date();
    await user.save();

    const token = generateToken(user._id);
    res.status(201).json({
      success: true,
      message: 'Account created successfully!',
      token,
      user: user.toPublic()
    });
  } catch (err) {
    console.error('Signup error:', err.message);
    res.status(500).json({ success: false, message: 'Server error during signup.' });
  }
});

// ─────────────────────────────────────
// @route  POST /api/auth/login
// @desc   Login user, return token
// @access Public
// ─────────────────────────────────────
router.post('/login', [
  body('email').isEmail().normalizeEmail().withMessage('Please enter a valid email'),
  body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
  const err = handleValidation(req, res);
  if (err) return;

  try {
    const { email, password } = req.body;

    // Find user with password
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    // Check if blocked
    if (user.isBlocked) {
      return res.status(403).json({ success: false, message: 'Your account has been suspended. Please contact support.' });
    }

    // Compare password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    // Update lastLogin
    user.lastLogin = new Date();
    await user.save();

    const token = generateToken(user._id);
    res.json({
      success: true,
      message: `Welcome back, ${user.name}!`,
      token,
      user: user.toPublic()
    });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ success: false, message: 'Server error during login.' });
  }
});

// ─────────────────────────────────────
// @route  GET /api/auth/me
// @desc   Get current logged-in user
// @access Private (JWT required)
// ─────────────────────────────────────
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const progress = await Progress.findOne({ userId: req.user._id });
    res.json({
      success: true,
      user: user.toPublic(),
      progress: progress || {}
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching user data.' });
  }
});

// ─────────────────────────────────────
// @route  PUT /api/auth/profile
// @desc   Update profile (name, email, password, avatar)
// @access Private
// ─────────────────────────────────────
router.put('/profile', protect, [
  body('name').optional().trim().isLength({ min: 2 }).withMessage('Name too short'),
  body('email').optional().isEmail().normalizeEmail().withMessage('Invalid email'),
  body('newPassword').optional().isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], async (req, res) => {
  const err = handleValidation(req, res);
  if (err) return;

  try {
    const { name, email, newPassword, currentPassword } = req.body;
    const user = await User.findById(req.user._id).select('+password');

    if (name) user.name = name;

    // Email update — check if taken
    if (email && email !== user.email) {
      const taken = await User.findOne({ email });
      if (taken) return res.status(400).json({ success: false, message: 'Email already in use.' });
      user.email = email;
    }

    // Password update — must verify current password
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ success: false, message: 'Current password is required to change your password.' });
      }
      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Current password is incorrect.' });
      }
      user.password = newPassword; // will be hashed by pre-save hook
    }

    // Update avatar whenever name changes
    if (name) {
      user.avatar = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=f97316`;
    }

    await user.save();

    const token = generateToken(user._id); // Re-issue token
    res.json({
      success: true,
      message: 'Profile updated successfully!',
      token,
      user: user.toPublic()
    });
  } catch (err) {
    console.error('Profile update error:', err.message);
    res.status(500).json({ success: false, message: 'Error updating profile.' });
  }
});

// ─────────────────────────────────────
// @route  POST /api/auth/forgot-password
// @desc   Send password reset info (demo: just returns instructions)
// @access Public
// ─────────────────────────────────────
router.post('/forgot-password', [
  body('email').isEmail().withMessage('Valid email required')
], async (req, res) => {
  // In production, send a real reset email via Nodemailer / SendGrid
  // For now, return a simulated success
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    // Don't reveal whether email exists (security)
    return res.json({ success: true, message: 'If that email exists, a reset link has been sent.' });
  }
  res.json({ success: true, message: 'Password reset instructions sent to your email.' });
});

// ─────────────────────────────────────
// @route  POST /api/auth/google
// @desc   Login/register via Google One Tap / Sign-In
// @access Public
// ─────────────────────────────────────
const { OAuth2Client } = require('google-auth-library');
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post('/google', async (req, res) => {
  try {
    const { credential } = req.body;
    if (!credential) {
      return res.status(400).json({ success: false, message: 'Google credential is required.' });
    }

    // Verify Google ID token (accepting both old and new Client IDs to prevent sync issues)
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: [
        process.env.GOOGLE_CLIENT_ID,
        '615619658013-fbdmbv87rq4v3oqanpgt32upn08dofhf.apps.googleusercontent.com', // New Web.app ID
        '615619658013-pcgmkij39uvjppubif0sntd526vqh7na.apps.googleusercontent.com'  // Old Vercel ID
      ].filter(Boolean)
    });
    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;

    // Find existing user by googleId or email
    let user = await User.findOne({ $or: [{ googleId }, { email }] });

    if (user) {
      // Link Google account if user exists by email but not yet linked
      if (!user.googleId) {
        user.googleId = googleId;
        if (picture && !user.avatar.includes('dicebear')) user.avatar = picture;
      }
      // Check if blocked
      if (user.isBlocked) {
        return res.status(403).json({ success: false, message: 'Your account has been suspended.' });
      }
      user.lastLogin = new Date();
      await user.save();
    } else {
      // Create new user (no password needed for Google users)
      user = await User.create({
        name,
        email,
        googleId,
        avatar: picture || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=f97316`
      });
      await Progress.create({ userId: user._id });
      user.lastLogin = new Date();
      await user.save();
    }

    const token = generateToken(user._id);
    res.json({
      success: true,
      message: `Welcome, ${user.name}!`,
      token,
      user: user.toPublic()
    });
  } catch (err) {
    console.error('Google auth error:', err.message);
    if (err.message?.includes('Token used too late') || err.message?.includes('Invalid token')) {
      return res.status(401).json({ success: false, message: 'Google token expired or invalid. Please try again.' });
    }
    res.status(500).json({ success: false, message: 'Google authentication failed.' });
  }
});

module.exports = router;
