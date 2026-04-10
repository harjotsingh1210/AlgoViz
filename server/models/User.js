const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true  // Allow multiple nulls
  },
  password: {
    type: String,
    required: false,  // Not required for Google OAuth users
    minlength: [6, 'Password must be at least 6 characters'],
    select: false  // Never return password in queries by default
  },
  avatar: {
    type: String,
    default: ''
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  role: {
    type: String,
    default: 'student',
    enum: ['student', 'admin', 'superadmin']
  },
  isBlocked: {
    type: Boolean,
    default: false
  },
  joinedAt: {
    type: Date,
    default: Date.now
  },
  lastLogin: {
    type: Date
  }
}, {
  timestamps: true
});

// Hash password before saving
UserSchema.pre('save', async function(next) {
  // Set default avatar using initials
  if (!this.avatar) {
    this.avatar = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(this.name)}&backgroundColor=f97316`;
  }
  if (!this.isModified('password') || !this.password) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Compare password method
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Return safe user object (no password)
UserSchema.methods.toPublic = function() {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    avatar: this.avatar,
    isAdmin: this.isAdmin,
    role: this.role,
    isBlocked: this.isBlocked,
    joinedAt: this.joinedAt,
    lastLogin: this.lastLogin,
    googleId: this.googleId || null
  };
};

module.exports = mongoose.model('User', UserSchema);
