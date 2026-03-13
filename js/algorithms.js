// ===== Algorithm Data Store =====
const ALGORITHMS = [
  // ===== SORTING =====
  {
    id: 'bubble-sort',
    name: 'Bubble Sort',
    category: 'sorting',
    difficulty: 'easy',
    icon: '🫧',
    timeComplexity: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)' },
    spaceComplexity: 'O(1)',
    stable: true,
    description: 'Bubble Sort repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order. The pass through the list is repeated until no swaps are needed.',
    longDesc: `Bubble Sort is one of the simplest sorting algorithms. It works by repeatedly comparing adjacent elements and swapping them if needed. After each pass, the largest unsorted element "bubbles up" to its correct position. While simple to understand, it is inefficient for large datasets.`,
    useCases: 'Educational purposes, small datasets, nearly sorted arrays',
    code: {
      javascript: `function bubbleSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    for (let j = 0; j < n - i - 1; j++) {
      // Compare adjacent elements
      if (arr[j] > arr[j + 1]) {
        // Swap elements
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swapped = true;
      }
    }
    // If no swap, array is sorted
    if (!swapped) break;
  }
  return arr;
}`,
      python: `def bubble_sort(arr):
    n = len(arr)
    for i in range(n - 1):
        swapped = False
        for j in range(n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                swapped = True
        if not swapped:
            break
    return arr`
    },
    related: ['insertion-sort', 'selection-sort', 'merge-sort'],
    tags: ['comparison', 'in-place', 'stable']
  },
  {
    id: 'merge-sort',
    name: 'Merge Sort',
    category: 'sorting',
    difficulty: 'medium',
    icon: '🔀',
    timeComplexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)' },
    spaceComplexity: 'O(n)',
    stable: true,
    description: 'Merge Sort is a divide-and-conquer algorithm that splits the array in half, sorts each half recursively, then merges the sorted halves back together.',
    longDesc: `Merge Sort divides the input array into two halves, recursively sorts each half, and then merges the two sorted halves. It guarantees O(n log n) time complexity in all cases, making it efficient for large datasets. It requires O(n) extra space for the temporary arrays.`,
    useCases: 'Large datasets, linked lists, external sorting, stable sort needed',
    code: {
      javascript: `function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  
  return merge(left, right);
}

function merge(left, right) {
  const result = [];
  let i = 0, j = 0;
  
  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) {
      result.push(left[i++]);
    } else {
      result.push(right[j++]);
    }
  }
  return [...result, ...left.slice(i), ...right.slice(j)];
}`,
      python: `def merge_sort(arr):
    if len(arr) <= 1:
        return arr
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    return merge(left, right)

def merge(left, right):
    result, i, j = [], 0, 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i]); i += 1
        else:
            result.append(right[j]); j += 1
    return result + left[i:] + right[j:]`
    },
    related: ['quick-sort', 'bubble-sort', 'heap-sort'],
    tags: ['divide-and-conquer', 'recursive', 'stable']
  },
  {
    id: 'quick-sort',
    name: 'Quick Sort',
    category: 'sorting',
    difficulty: 'medium',
    icon: '⚡',
    timeComplexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n²)' },
    spaceComplexity: 'O(log n)',
    stable: false,
    description: 'Quick Sort selects a pivot element and partitions the array around the pivot, ensuring elements smaller than pivot are on the left and larger on the right.',
    longDesc: `Quick Sort is a highly efficient sorting algorithm that uses a divide-and-conquer strategy. It picks a pivot element and rearranges the array so that all elements smaller than the pivot come before it and all greater elements come after it. Then it recursively sorts the sub-arrays.`,
    useCases: 'General-purpose sorting, arrays, cache-friendly operations',
    code: {
      javascript: `function quickSort(arr, low = 0, high = arr.length - 1) {
  if (low < high) {
    const pi = partition(arr, low, high);
    quickSort(arr, low, pi - 1);
    quickSort(arr, pi + 1, high);
  }
  return arr;
}

function partition(arr, low, high) {
  const pivot = arr[high];
  let i = low - 1;
  
  for (let j = low; j < high; j++) {
    if (arr[j] <= pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  return i + 1;
}`,
      python: `def quick_sort(arr, low=0, high=None):
    if high is None: high = len(arr) - 1
    if low < high:
        pi = partition(arr, low, high)
        quick_sort(arr, low, pi - 1)
        quick_sort(arr, pi + 1, high)
    return arr

def partition(arr, low, high):
    pivot = arr[high]
    i = low - 1
    for j in range(low, high):
        if arr[j] <= pivot:
            i += 1
            arr[i], arr[j] = arr[j], arr[i]
    arr[i+1], arr[high] = arr[high], arr[i+1]
    return i + 1`
    },
    related: ['merge-sort', 'heap-sort', 'insertion-sort'],
    tags: ['divide-and-conquer', 'in-place', 'recursive']
  },
  {
    id: 'insertion-sort',
    name: 'Insertion Sort',
    category: 'sorting',
    difficulty: 'easy',
    icon: '🃏',
    timeComplexity: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)' },
    spaceComplexity: 'O(1)',
    stable: true,
    description: 'Insertion Sort builds the sorted array one element at a time by inserting each element into its correct position among the previously sorted elements.',
    longDesc: `Insertion Sort iterates through the array and for each element, finds the correct position in the sorted portion and shifts elements to insert it there. It is efficient for small datasets and performs well on nearly sorted arrays.`,
    useCases: 'Small arrays, nearly sorted data, online sorting (streaming)',
    code: {
      javascript: `function insertionSort(arr) {
  for (let i = 1; i < arr.length; i++) {
    const key = arr[i];
    let j = i - 1;
    
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j--;
    }
    arr[j + 1] = key;
  }
  return arr;
}`,
      python: `def insertion_sort(arr):
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1
        while j >= 0 and arr[j] > key:
            arr[j + 1] = arr[j]
            j -= 1
        arr[j + 1] = key
    return arr`
    },
    related: ['bubble-sort', 'selection-sort', 'shell-sort'],
    tags: ['comparison', 'in-place', 'stable', 'online']
  },

  // ===== SEARCHING =====
  {
    id: 'linear-search',
    name: 'Linear Search',
    category: 'searching',
    difficulty: 'easy',
    icon: '🔍',
    timeComplexity: { best: 'O(1)', average: 'O(n)', worst: 'O(n)' },
    spaceComplexity: 'O(1)',
    stable: true,
    description: 'Linear Search sequentially checks each element of the list until a match is found or the whole list has been searched.',
    longDesc: `Linear Search is the simplest searching algorithm. It traverses the array from the beginning and compares each element with the target value. If a match is found, the position is returned; otherwise, -1 is returned. Works on both sorted and unsorted arrays.`,
    useCases: 'Unsorted arrays, small datasets, single search on a list',
    code: {
      javascript: `function linearSearch(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) {
      return i; // Found at index i
    }
  }
  return -1; // Not found
}`,
      python: `def linear_search(arr, target):
    for i, val in enumerate(arr):
        if val == target:
            return i  # Found
    return -1  # Not found`
    },
    related: ['binary-search'],
    tags: ['sequential', 'unsorted']
  },
  {
    id: 'binary-search',
    name: 'Binary Search',
    category: 'searching',
    difficulty: 'easy',
    icon: '🎯',
    timeComplexity: { best: 'O(1)', average: 'O(log n)', worst: 'O(log n)' },
    spaceComplexity: 'O(1)',
    stable: true,
    description: 'Binary Search works on sorted arrays by repeatedly dividing the search interval in half, dramatically reducing the number of comparisons needed.',
    longDesc: `Binary Search is a fast search algorithm that works on sorted arrays. It compares the target with the middle element; if equal, the position is returned. If the target is smaller, the left half is searched; if larger, the right half. This halves the search space with each comparison.`,
    useCases: 'Sorted arrays, large datasets, frequent searches',
    code: {
      javascript: `function binarySearch(arr, target) {
  let left = 0, right = arr.length - 1;
  
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1; // Not found
}`,
      python: `def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1`
    },
    related: ['linear-search', 'jump-search', 'interpolation-search'],
    tags: ['divide-and-conquer', 'sorted', 'efficient']
  },

  // ===== GRAPH =====
  {
    id: 'bfs',
    name: 'Breadth-First Search',
    category: 'graph',
    difficulty: 'medium',
    icon: '🌊',
    timeComplexity: { best: 'O(V+E)', average: 'O(V+E)', worst: 'O(V+E)' },
    spaceComplexity: 'O(V)',
    stable: true,
    description: 'BFS explores all vertices at the current depth before moving to vertices at the next depth level, using a queue data structure.',
    longDesc: `Breadth-First Search starts at a source vertex and explores all neighbors at the current depth before moving deeper. It uses a queue to track vertices to visit. BFS guarantees the shortest path in unweighted graphs.`,
    useCases: 'Shortest path in unweighted graphs, level-order traversal, social networks',
    code: {
      javascript: `function bfs(graph, start) {
  const visited = new Set();
  const queue = [start];
  const order = [];
  
  visited.add(start);
  
  while (queue.length > 0) {
    const vertex = queue.shift();
    order.push(vertex);
    
    for (const neighbor of graph[vertex] || []) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }
  return order;
}`,
      python: `from collections import deque

def bfs(graph, start):
    visited = set([start])
    queue = deque([start])
    order = []
    
    while queue:
        vertex = queue.popleft()
        order.append(vertex)
        for neighbor in graph.get(vertex, []):
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)
    return order`
    },
    related: ['dfs', 'dijkstra'],
    tags: ['graph', 'queue', 'shortest-path']
  },
  {
    id: 'dfs',
    name: 'Depth-First Search',
    category: 'graph',
    difficulty: 'medium',
    icon: '🌲',
    timeComplexity: { best: 'O(V+E)', average: 'O(V+E)', worst: 'O(V+E)' },
    spaceComplexity: 'O(V)',
    stable: true,
    description: 'DFS explores as far as possible along each branch before backtracking, using a stack (or recursion) to traverse the graph.',
    longDesc: `Depth-First Search starts at a source vertex and explores as far as possible along each branch before backtracking. It uses a stack (or recursion) to keep track of the path. DFS is useful for detecting cycles, topological sorting, and finding connected components.`,
    useCases: 'Cycle detection, topological sort, maze solving, connected components',
    code: {
      javascript: `function dfs(graph, start, visited = new Set()) {
  visited.add(start);
  const order = [start];
  
  for (const neighbor of graph[start] || []) {
    if (!visited.has(neighbor)) {
      order.push(...dfs(graph, neighbor, visited));
    }
  }
  return order;
}

// Iterative version
function dfsIterative(graph, start) {
  const visited = new Set();
  const stack = [start];
  const order = [];
  
  while (stack.length > 0) {
    const vertex = stack.pop();
    if (!visited.has(vertex)) {
      visited.add(vertex);
      order.push(vertex);
      for (const n of (graph[vertex] || []).reverse())
        stack.push(n);
    }
  }
  return order;
}`,
      python: `def dfs(graph, start, visited=None):
    if visited is None: visited = set()
    visited.add(start)
    order = [start]
    for neighbor in graph.get(start, []):
        if neighbor not in visited:
            order.extend(dfs(graph, neighbor, visited))
    return order`
    },
    related: ['bfs', 'dijkstra'],
    tags: ['graph', 'stack', 'recursive']
  },
  {
    id: 'dijkstra',
    name: "Dijkstra's Algorithm",
    category: 'graph',
    difficulty: 'hard',
    icon: '🗺️',
    timeComplexity: { best: 'O(V²)', average: 'O((V+E) log V)', worst: 'O(V²)' },
    spaceComplexity: 'O(V)',
    stable: true,
    description: "Dijkstra's algorithm finds the shortest path between nodes in a weighted graph by greedily selecting the minimum distance vertex at each step.",
    longDesc: `Dijkstra's algorithm solves the single-source shortest path problem for graphs with non-negative edge weights. It maintains a priority queue of vertices ordered by their distance from the source and repeatedly relaxes edges to find the shortest path to each vertex.`,
    useCases: 'GPS navigation, network routing, shortest path in weighted graphs',
    code: {
      javascript: `function dijkstra(graph, start) {
  const dist = {};
  const visited = new Set();
  
  for (const v in graph) dist[v] = Infinity;
  dist[start] = 0;
  
  while (true) {
    // Find unvisited vertex with min distance
    let u = null;
    for (const v in dist) {
      if (!visited.has(v) && (u === null || dist[v] < dist[u]))
        u = v;
    }
    if (u === null || dist[u] === Infinity) break;
    visited.add(u);
    
    for (const [v, weight] of graph[u] || []) {
      if (dist[u] + weight < dist[v]) {
        dist[v] = dist[u] + weight;
      }
    }
  }
  return dist;
}`,
      python: `import heapq

def dijkstra(graph, start):
    dist = {v: float('inf') for v in graph}
    dist[start] = 0
    pq = [(0, start)]
    
    while pq:
        d, u = heapq.heappop(pq)
        if d > dist[u]: continue
        for v, w in graph.get(u, []):
            if dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
                heapq.heappush(pq, (dist[v], v))
    return dist`
    },
    related: ['bfs', 'bellman-ford', 'a-star'],
    tags: ['graph', 'greedy', 'shortest-path', 'weighted']
  },

  // ===== DYNAMIC PROGRAMMING =====
  {
    id: 'fibonacci-dp',
    name: 'Fibonacci (DP)',
    category: 'dp',
    difficulty: 'easy',
    icon: '🌀',
    timeComplexity: { best: 'O(n)', average: 'O(n)', worst: 'O(n)' },
    spaceComplexity: 'O(n)',
    stable: true,
    description: 'Dynamic Programming approach to Fibonacci avoids redundant calculations by storing computed values, reducing exponential to linear time.',
    longDesc: `The naive recursive Fibonacci has O(2^n) complexity due to overlapping subproblems. Dynamic Programming (memoization/tabulation) stores computed results so each subproblem is solved only once, achieving O(n) time complexity.`,
    useCases: 'Introduction to DP concepts, memoization demonstration',
    code: {
      javascript: `// Memoization (Top-Down)
function fibMemo(n, memo = {}) {
  if (n <= 1) return n;
  if (memo[n]) return memo[n];
  memo[n] = fibMemo(n-1, memo) + fibMemo(n-2, memo);
  return memo[n];
}

// Tabulation (Bottom-Up)
function fibTab(n) {
  if (n <= 1) return n;
  const dp = [0, 1];
  for (let i = 2; i <= n; i++) {
    dp[i] = dp[i-1] + dp[i-2];
  }
  return dp[n];
}`,
      python: `# Memoization
def fib_memo(n, memo={}):
    if n <= 1: return n
    if n in memo: return memo[n]
    memo[n] = fib_memo(n-1) + fib_memo(n-2)
    return memo[n]

# Tabulation
def fib_tab(n):
    if n <= 1: return n
    dp = [0, 1]
    for i in range(2, n+1):
        dp.append(dp[-1] + dp[-2])
    return dp[n]`
    },
    related: ['knapsack', 'lcs'],
    tags: ['dp', 'memoization', 'tabulation']
  },
  {
    id: 'knapsack',
    name: '0/1 Knapsack',
    category: 'dp',
    difficulty: 'hard',
    icon: '🎒',
    timeComplexity: { best: 'O(nW)', average: 'O(nW)', worst: 'O(nW)' },
    spaceComplexity: 'O(nW)',
    stable: true,
    description: 'The 0/1 Knapsack problem maximizes value under a weight constraint. DP solves it by building a table of optimal solutions for subproblems.',
    longDesc: `Given items with weights and values, the 0/1 Knapsack problem asks: what is the maximum value we can achieve with a given weight capacity? Each item can be included or excluded. DP fills a 2D table where dp[i][w] represents the max value using first i items and weight capacity w.`,
    useCases: 'Resource allocation, budget planning, cut stock problem',
    code: {
      javascript: `function knapsack(weights, values, capacity) {
  const n = weights.length;
  const dp = Array(n+1).fill(null)
    .map(() => Array(capacity+1).fill(0));
  
  for (let i = 1; i <= n; i++) {
    for (let w = 0; w <= capacity; w++) {
      // Don't include item i
      dp[i][w] = dp[i-1][w];
      // Include item i if it fits
      if (weights[i-1] <= w) {
        dp[i][w] = Math.max(dp[i][w],
          values[i-1] + dp[i-1][w - weights[i-1]]);
      }
    }
  }
  return dp[n][capacity];
}`,
      python: `def knapsack(weights, values, capacity):
    n = len(weights)
    dp = [[0]*(capacity+1) for _ in range(n+1)]
    for i in range(1, n+1):
        for w in range(capacity+1):
            dp[i][w] = dp[i-1][w]
            if weights[i-1] <= w:
                dp[i][w] = max(dp[i][w],
                  values[i-1] + dp[i-1][w-weights[i-1]])
    return dp[n][capacity]`
    },
    related: ['fibonacci-dp', 'lcs'],
    tags: ['dp', 'optimization', 'combinatorics']
  }
];

// Helper functions
function getAlgorithmById(id) {
  return ALGORITHMS.find(a => a.id === id);
}
function getAlgorithmsByCategory(cat) {
  return cat === 'all' ? ALGORITHMS : ALGORITHMS.filter(a => a.category === cat);
}
function getAlgorithmsByDifficulty(diff) {
  return ALGORITHMS.filter(a => a.difficulty === diff);
}
function searchAlgorithms(query) {
  const q = query.toLowerCase();
  return ALGORITHMS.filter(a =>
    a.name.toLowerCase().includes(q) ||
    a.description.toLowerCase().includes(q) ||
    a.tags.some(t => t.includes(q))
  );
}

// Category metadata
const CATEGORIES = {
  sorting: { label: 'Sorting', icon: '↕️', color: '#818cf8' },
  searching: { label: 'Searching', icon: '🔍', color: '#22d3ee' },
  graph: { label: 'Graph', icon: '🕸️', color: '#c084fc' },
  dp: { label: 'Dynamic Programming', icon: '🧩', color: '#fb923c' }
};

const DIFFICULTY_META = {
  easy: { label: 'Easy', color: '#22c55e' },
  medium: { label: 'Medium', color: '#eab308' },
  hard: { label: 'Hard', color: '#ef4444' }
};

// Quiz questions per algorithm
const QUIZ_QUESTIONS = {
  'bubble-sort': [
    { q: 'What is the worst-case time complexity of Bubble Sort?', opts: ['O(n)', 'O(n log n)', 'O(n²)', 'O(1)'], ans: 2, exp: 'Bubble Sort has O(n²) comparisons in the worst case when the array is reverse sorted.' },
    { q: 'Is Bubble Sort a stable sorting algorithm?', opts: ['Yes', 'No', 'Depends on implementation', 'Only for integers'], ans: 0, exp: 'Bubble Sort is stable because equal elements are never swapped past each other.' },
    { q: 'What is the best-case time complexity of Bubble Sort with optimization?', opts: ['O(n²)', 'O(n log n)', 'O(n)', 'O(log n)'], ans: 2, exp: 'With the "swapped" flag optimization, Bubble Sort achieves O(n) on an already sorted array.' },
    { q: 'What data structure is used as auxiliary space?', opts: ['Queue', 'Stack', 'None (in-place)', 'Hash Map'], ans: 2, exp: 'Bubble Sort is an in-place algorithm, requiring only O(1) auxiliary space.' }
  ],
  'merge-sort': [
    { q: 'What technique does Merge Sort use?', opts: ['Greedy', 'Dynamic Programming', 'Divide and Conquer', 'Backtracking'], ans: 2, exp: 'Merge Sort uses divide and conquer — split, sort, merge.' },
    { q: 'What is the space complexity of Merge Sort?', opts: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'], ans: 2, exp: 'Merge Sort requires O(n) extra space for the temporary arrays during merging.' },
    { q: 'Which sorting algorithm does NOT have a worst case of O(n log n)?', opts: ['Merge Sort', 'Heap Sort', 'Quick Sort', 'All have O(n log n) worst case'], ans: 2, exp: 'Quick Sort has O(n²) worst case (when pivot is always min or max).' },
    { q: 'Merge Sort is most suitable for:', opts: ['Small arrays', 'Linked lists', 'Random access arrays', 'Hash maps'], ans: 1, exp: 'Merge Sort is excellent for linked lists since it does not require random access.' }
  ],
  'binary-search': [
    { q: 'Binary Search requires the array to be:', opts: ['Unsorted', 'Sorted', 'Partially sorted', 'Any order'], ans: 1, exp: 'Binary Search only works on sorted arrays.' },
    { q: 'What is the time complexity of Binary Search?', opts: ['O(n)', 'O(log n)', 'O(n log n)', 'O(1)'], ans: 1, exp: 'Binary Search divides the search space in half each time, giving O(log n) complexity.' },
    { q: 'How many comparisons does Binary Search need for 1024 elements?', opts: ['512', '64', '10', '1024'], ans: 2, exp: 'Binary Search needs at most log₂(1024) = 10 comparisons.' },
    { q: 'Binary Search on an unsorted array:', opts: ['Works correctly', 'Is faster', 'May give wrong results', 'Is the same as linear search'], ans: 2, exp: 'Binary Search requires a sorted array; applying it to unsorted data gives incorrect results.' }
  ],
  'bfs': [
    { q: 'BFS uses which data structure?', opts: ['Stack', 'Queue', 'Heap', 'Array'], ans: 1, exp: 'BFS uses a queue to track vertices to visit (FIFO order).' },
    { q: 'BFS guarantees shortest path in:', opts: ['Weighted graphs', 'Directed graphs', 'Unweighted graphs', 'All graphs'], ans: 2, exp: 'BFS finds the shortest path (in terms of edges) in unweighted graphs.' },
    { q: 'The time complexity of BFS is:', opts: ['O(V)', 'O(E)', 'O(V+E)', 'O(V²)'], ans: 2, exp: 'BFS visits every vertex and edge once, giving O(V+E) complexity.' },
    { q: 'BFS explores vertices in which order?', opts: ['Depth first', 'Level by level', 'Randomly', 'Alphabetically'], ans: 1, exp: 'BFS explores all vertices at the current depth level before moving to the next.' }
  ],
  'quick-sort': [
    { q: 'What is the average time complexity of Quick Sort?', opts: ['O(n)', 'O(n²)', 'O(n log n)', 'O(log n)'], ans: 2, exp: 'Quick Sort has O(n log n) average case time complexity.' },
    { q: 'Quick Sort performs worst when:', opts: ['Array is random', 'Pivot is always median', 'Array is already sorted', 'Array has duplicates'], ans: 2, exp: 'When array is already sorted and pivot is always first/last, Quick Sort degrades to O(n²).' },
    { q: 'Is Quick Sort a stable algorithm?', opts: ['Yes', 'No', 'Sometimes', 'Depends on pivot'], ans: 1, exp: 'Quick Sort is not stable by default — equal elements may change relative order.' },
    { q: 'Quick Sort space complexity is:', opts: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'], ans: 2, exp: 'Quick Sort uses O(log n) stack space for recursion.' }
  ]
};
