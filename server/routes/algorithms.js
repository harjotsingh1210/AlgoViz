const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');

// Algorithm data is stored in the frontend JS file (algorithms.js)
// This route provides a lightweight API for admin analytics
// In the future, you could move algorithm data to the DB

// ─────────────────────────────────────
// @route  GET /api/algorithms
// @desc   Get list of algorithm IDs and metadata for API consumers
// @access Public
// ─────────────────────────────────────
const ALGORITHM_META = [
  { id: 'bubble-sort', name: 'Bubble Sort', category: 'sorting', difficulty: 'easy', timeAvg: 'O(n²)', space: 'O(1)', stable: true },
  { id: 'insertion-sort', name: 'Insertion Sort', category: 'sorting', difficulty: 'easy', timeAvg: 'O(n²)', space: 'O(1)', stable: true },
  { id: 'merge-sort', name: 'Merge Sort', category: 'sorting', difficulty: 'medium', timeAvg: 'O(n log n)', space: 'O(n)', stable: true },
  { id: 'quick-sort', name: 'Quick Sort', category: 'sorting', difficulty: 'medium', timeAvg: 'O(n log n)', space: 'O(log n)', stable: false },
  { id: 'linear-search', name: 'Linear Search', category: 'searching', difficulty: 'easy', timeAvg: 'O(n)', space: 'O(1)', stable: true },
  { id: 'binary-search', name: 'Binary Search', category: 'searching', difficulty: 'easy', timeAvg: 'O(log n)', space: 'O(1)', stable: true },
  { id: 'bfs', name: 'Breadth-First Search', category: 'graph', difficulty: 'medium', timeAvg: 'O(V + E)', space: 'O(V)', stable: true },
  { id: 'dfs', name: 'Depth-First Search', category: 'graph', difficulty: 'medium', timeAvg: 'O(V + E)', space: 'O(V)', stable: true },
  { id: 'dijkstra', name: "Dijkstra's Algorithm", category: 'graph', difficulty: 'hard', timeAvg: 'O((V + E) log V)', space: 'O(V)', stable: true },
  { id: 'fibonacci-dp', name: 'Fibonacci (DP)', category: 'dp', difficulty: 'easy', timeAvg: 'O(n)', space: 'O(n)', stable: true },
  { id: 'knapsack', name: '0/1 Knapsack', category: 'dp', difficulty: 'hard', timeAvg: 'O(n × W)', space: 'O(n × W)', stable: true },
];

router.get('/', (req, res) => {
  const { category, difficulty } = req.query;
  let algos = [...ALGORITHM_META];
  if (category) algos = algos.filter(a => a.category === category);
  if (difficulty) algos = algos.filter(a => a.difficulty === difficulty);
  res.json({ success: true, count: algos.length, data: algos });
});

router.get('/:id', (req, res) => {
  const algo = ALGORITHM_META.find(a => a.id === req.params.id);
  if (!algo) return res.status(404).json({ success: false, message: 'Algorithm not found.' });
  res.json({ success: true, data: algo });
});

module.exports = router;
