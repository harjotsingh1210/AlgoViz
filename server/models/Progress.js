const mongoose = require('mongoose');

const ProgressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  explored: {
    type: [String],  // Array of algorithm IDs e.g. ['bubble-sort', 'bfs']
    default: []
  },
  quizScores: {
    type: Map,
    of: Number,  // { 'bubble-sort': 3, 'bfs': 4 }
    default: {}
  },
  completedChallenges: {
    type: [String],
    default: []
  },
  learningPath: {
    currentStep: { type: Number, default: 0 },
    completedSteps: { type: [Number], default: [] }
  },
  totalPoints: {
    type: Number,
    default: 0
  },
  streak: {
    count: { type: Number, default: 0 },
    lastActivity: { type: Date }
  }
}, {
  timestamps: true
});

// Auto-calculate totalPoints before saving
ProgressSchema.pre('save', function(next) {
  let points = 0;
  // 10 points per algorithm explored
  points += this.explored.length * 10;
  // Quiz score points
  for (const [, score] of this.quizScores) {
    points += score * 5;
  }
  this.totalPoints = points;
  next();
});

module.exports = mongoose.model('Progress', ProgressSchema);
