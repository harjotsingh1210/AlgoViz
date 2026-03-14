// ===== Core Visualization Engine =====
class AlgorithmVisualizer {
  constructor(canvasId, options = {}) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
    this.steps = [];
    this.currentStep = 0;
    this.isPlaying = false;
    this.speed = 500; // ms per step
    this.timer = null;
    this.onStepChange = options.onStepChange || null;
    this.onComplete = options.onComplete || null;
    this.type = options.type || 'bar'; // bar | graph | search
    this.isDark = () => document.documentElement.getAttribute('data-theme') !== 'light';
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    if (!this.canvas) return;
    const parent = this.canvas.parentElement;
    this.canvas.width = parent.offsetWidth;
    this.canvas.height = Math.min(parent.offsetHeight || 280, 300);
    if (this.steps.length > 0) this.drawStep(this.currentStep);
  }

  // Load steps from algorithm generator
  loadSteps(steps) {
    this.steps = steps;
    this.currentStep = 0;
    this.isPlaying = false;
    clearInterval(this.timer);
    if (steps.length > 0) this.drawStep(0);
  }

  // Draw a specific step
  drawStep(index) {
    if (!this.ctx || index >= this.steps.length) return;
    const step = this.steps[index];
    if (this.type === 'bar') this.drawBarStep(step);
    else if (this.type === 'graph') this.drawGraphStep(step);
    else if (this.type === 'search') this.drawSearchStep(step);
    if (this.onStepChange) this.onStepChange(step, index, this.steps.length);
  }

  // === BAR CHART VISUALIZATION (Sorting/Searching) ===
  drawBarStep(step) {
    const ctx = this.ctx;
    const W = this.canvas.width, H = this.canvas.height;
    const arr = step.array;
    const isDark = this.isDark();

    // Background
    ctx.fillStyle = isDark ? '#111118' : '#f4f4f8';
    ctx.fillRect(0, 0, W, H);

    const barCount = arr.length;
    const padding = 20;
    const maxVal = Math.max(...arr, 1);
    const availW = W - padding * 2;
    const barW = Math.max(4, Math.floor(availW / barCount) - 2);
    const gap = Math.max(2, Math.floor((availW - barW * barCount) / barCount));
    const maxBarH = H - padding * 2;

    arr.forEach((val, i) => {
      const barH = Math.max(4, (val / maxVal) * maxBarH);
      const x = padding + i * (barW + gap);
      const y = H - padding - barH;

      // Determine color
      let color = isDark ? '#3d3d5c' : '#d1d5db';
      if (step.sorted && step.sorted.includes(i)) color = '#22c55e';
      else if (step.comparing && step.comparing.includes(i)) color = '#f97316';
      else if (step.swapping && step.swapping.includes(i)) color = '#ef4444';
      else if (step.pivot === i) color = '#eab308';
      else if (step.found === i) color = '#22c55e';
      else if (step.active && step.active.includes(i)) color = '#3b82f6';
      else if (step.left === i || step.right === i) color = '#8b5cf6';
      else if (step.mid === i) color = '#f97316';

      // Draw bar with rounded top
      ctx.fillStyle = color;
      const radius = Math.min(4, barW / 3);
      ctx.beginPath();
      ctx.moveTo(x + radius, y);
      ctx.lineTo(x + barW - radius, y);
      ctx.quadraticCurveTo(x + barW, y, x + barW, y + radius);
      ctx.lineTo(x + barW, y + barH);
      ctx.lineTo(x, y + barH);
      ctx.lineTo(x, y + radius);
      ctx.quadraticCurveTo(x, y, x + radius, y);
      ctx.closePath();
      ctx.fill();

      // Glow effect for highlighted bars
      if (step.comparing?.includes(i) || step.swapping?.includes(i) || step.found === i) {
        ctx.shadowColor = color;
        ctx.shadowBlur = 12;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // Value label (only if bars are wide enough)
      if (barW >= 18) {
        ctx.fillStyle = isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.5)';
        ctx.font = `bold ${Math.min(11, barW - 2)}px Inter, sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText(val, x + barW / 2, y - 4);
      }
    });

    // Draw pointer labels
    if (step.left !== undefined) this.drawPointer(ctx, step.left, arr, barW, gap, padding, H, 'L', '#8b5cf6');
    if (step.right !== undefined) this.drawPointer(ctx, step.right, arr, barW, gap, padding, H, 'R', '#8b5cf6');
    if (step.mid !== undefined) this.drawPointer(ctx, step.mid, arr, barW, gap, padding, H, 'M', '#f97316');
  }

  drawPointer(ctx, idx, arr, barW, gap, padding, H, label, color) {
    const x = padding + idx * (barW + gap) + barW / 2;
    const y = H - 8;
    ctx.fillStyle = color;
    ctx.font = 'bold 10px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(label, x, y);
    // Arrow
    ctx.beginPath();
    ctx.moveTo(x, y - 16);
    ctx.lineTo(x - 4, y - 10);
    ctx.lineTo(x + 4, y - 10);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
  }

  // === GRAPH VISUALIZATION ===
  drawGraphStep(step) {
    const ctx = this.ctx;
    const W = this.canvas.width, H = this.canvas.height;
    const isDark = this.isDark();
    const { nodes, edges, visited, current, queue, path } = step;

    ctx.fillStyle = isDark ? '#111118' : '#f4f4f8';
    ctx.fillRect(0, 0, W, H);

    if (!nodes) return;

    // Draw edges
    edges?.forEach(([a, b]) => {
      const na = nodes[a], nb = nodes[b];
      if (!na || !nb) return;
      const ax = na.x * W, ay = na.y * H;
      const bx = nb.x * W, by = nb.y * H;

      const isPathEdge = path && path.includes(a) && path.includes(b) &&
        Math.abs(path.indexOf(a) - path.indexOf(b)) === 1;

      ctx.beginPath();
      ctx.moveTo(ax, ay);
      ctx.lineTo(bx, by);
      ctx.strokeStyle = isPathEdge ? '#f97316' : (isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)');
      ctx.lineWidth = isPathEdge ? 3 : 1.5;
      ctx.stroke();

      // Edge weight
      if (step.weights) {
        const key = `${a}-${b}`;
        const w = step.weights[key] || step.weights[`${b}-${a}`];
        if (w !== undefined) {
          ctx.fillStyle = isDark ? '#666' : '#999';
          ctx.font = '10px Inter';
          ctx.textAlign = 'center';
          ctx.fillText(w, (ax + bx) / 2, (ay + by) / 2 - 6);
        }
      }
    });

    // Draw nodes
    Object.entries(nodes).forEach(([id, node]) => {
      const x = node.x * W, y = node.y * H;
      const r = 22;
      let fill = isDark ? '#1e1e2a' : '#fff';
      let stroke = isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)';
      let textColor = isDark ? '#aaa' : '#555';

      if (visited?.includes(id)) { fill = 'rgba(99,102,241,0.25)'; stroke = '#818cf8'; }
      if (queue?.includes(id)) { fill = 'rgba(59,130,246,0.25)'; stroke = '#3b82f6'; }
      if (path?.includes(id)) { fill = 'rgba(249,115,22,0.25)'; stroke = '#f97316'; }
      if (current === id) { fill = '#f97316'; stroke = '#fb923c'; textColor = '#fff'; }

      // Glow
      if (current === id) { ctx.shadowColor = '#f97316'; ctx.shadowBlur = 20; }
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = fill;
      ctx.fill();
      ctx.strokeStyle = stroke;
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Distance label (Dijkstra)
      if (step.dist && step.dist[id] !== undefined) {
        const d = step.dist[id] === Infinity ? '∞' : step.dist[id];
        ctx.fillStyle = '#f97316';
        ctx.font = 'bold 9px Inter';
        ctx.textAlign = 'center';
        ctx.fillText(d, x, y - r - 4);
      }

      // Node label
      ctx.fillStyle = textColor;
      ctx.font = `bold 13px Inter, sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText(id, x, y + 5);
    });
  }

  // === SEARCH VISUALIZATION (Binary Search) ===
  drawSearchStep(step) {
    this.drawBarStep(step); // Reuse bar visualization
  }

  // === PLAYBACK CONTROLS ===
  play() {
    if (this.currentStep >= this.steps.length - 1) this.currentStep = 0;
    this.isPlaying = true;
    this.timer = setInterval(() => {
      if (this.currentStep >= this.steps.length - 1) {
        this.pause();
        if (this.onComplete) this.onComplete();
        return;
      }
      this.currentStep++;
      this.drawStep(this.currentStep);
    }, this.speed);
  }

  pause() {
    this.isPlaying = false;
    clearInterval(this.timer);
  }

  reset() {
    this.pause();
    this.currentStep = 0;
    if (this.steps.length > 0) this.drawStep(0);
  }

  stepForward() {
    if (this.currentStep < this.steps.length - 1) {
      this.currentStep++;
      this.drawStep(this.currentStep);
    }
  }

  stepBack() {
    if (this.currentStep > 0) {
      this.currentStep--;
      this.drawStep(this.currentStep);
    }
  }

  setSpeed(ms) {
    this.speed = ms;
    if (this.isPlaying) { this.pause(); this.play(); }
  }
}

// ===== Sorting Step Generators =====
const SortingGenerators = {
  bubbleSort(arr) {
    const steps = [];
    const a = [...arr];
    const n = a.length;
    const sorted = [];

    steps.push({ array: [...a], comparing: [], swapping: [], sorted: [], desc: 'Starting Bubble Sort. We will compare adjacent elements and swap if needed.' });

    for (let i = 0; i < n - 1; i++) {
      let swapped = false;
      for (let j = 0; j < n - i - 1; j++) {
        steps.push({ array: [...a], comparing: [j, j+1], swapping: [], sorted: [...sorted], desc: `Comparing elements at index ${j} (value: ${a[j]}) and index ${j+1} (value: ${a[j+1]}).` });
        if (a[j] > a[j+1]) {
          steps.push({ array: [...a], comparing: [], swapping: [j, j+1], sorted: [...sorted], desc: `${a[j]} > ${a[j+1]}, so we SWAP them!` });
          [a[j], a[j+1]] = [a[j+1], a[j]];
          swapped = true;
          steps.push({ array: [...a], comparing: [], swapping: [], sorted: [...sorted], desc: `Swapped! Array is now: [${a.join(', ')}]` });
        } else {
          steps.push({ array: [...a], comparing: [], swapping: [], sorted: [...sorted], desc: `${a[j]} ≤ ${a[j+1]}, no swap needed. Moving forward.` });
        }
      }
      sorted.push(n - 1 - i);
      steps.push({ array: [...a], comparing: [], swapping: [], sorted: [...sorted], desc: `Pass ${i+1} complete! Element ${a[n-1-i]} is now in its correct position (highlighted green).` });
      if (!swapped) {
        for (let k = 0; k < n; k++) if (!sorted.includes(k)) sorted.push(k);
        steps.push({ array: [...a], comparing: [], swapping: [], sorted: [...sorted], desc: 'No swaps in this pass! Array is fully sorted. Algorithm complete! 🎉' });
        break;
      }
    }
    if (sorted.length < n) {
      for (let k = 0; k < n; k++) if (!sorted.includes(k)) sorted.push(k);
      steps.push({ array: [...a], comparing: [], swapping: [], sorted: [...sorted], desc: 'Bubble Sort Complete! All elements are in sorted order. 🎉' });
    }
    return steps;
  },

  insertionSort(arr) {
    const steps = [];
    const a = [...arr];
    const n = a.length;
    steps.push({ array: [...a], active: [0], sorted: [], desc: 'Starting Insertion Sort. The first element is already considered sorted.' });

    for (let i = 1; i < n; i++) {
      const key = a[i];
      steps.push({ array: [...a], active: [i], comparing: [], sorted: Array.from({length: i}, (_, k) => k), desc: `Picking element ${key} at index ${i} as the key to insert into sorted portion.` });
      let j = i - 1;
      while (j >= 0 && a[j] > key) {
        steps.push({ array: [...a], comparing: [j, j+1], swapping: [], sorted: [], desc: `${a[j]} > ${key}, shifting ${a[j]} one position right.` });
        a[j + 1] = a[j];
        j--;
        steps.push({ array: [...a], comparing: [], swapping: [j+1, j+2], sorted: [], desc: `Shifted! Array: [${a.join(', ')}]` });
      }
      a[j + 1] = key;
      steps.push({ array: [...a], active: [j+1], sorted: Array.from({length: i+1}, (_, k) => k), desc: `Inserted ${key} at index ${j+1}. Sorted portion: [${a.slice(0,i+1).join(', ')}]` });
    }
    steps.push({ array: [...a], sorted: Array.from({length: n}, (_, k) => k), desc: 'Insertion Sort Complete! All elements inserted in sorted order. 🎉' });
    return steps;
  },

  quickSort(arr) {
    const steps = [];
    const a = [...arr];
    const sorted = [];

    function partition(low, high) {
      const pivot = a[high];
      steps.push({ array: [...a], pivot: high, comparing: [low, high], sorted: [...sorted], desc: `Partitioning from index ${low} to ${high}. Pivot = ${pivot} (orange).` });
      let i = low - 1;

      for (let j = low; j < high; j++) {
        steps.push({ array: [...a], pivot: high, comparing: [j, high], sorted: [...sorted], desc: `Comparing ${a[j]} with pivot ${pivot}.` });
        if (a[j] <= pivot) {
          i++;
          if (i !== j) {
            steps.push({ array: [...a], pivot: high, swapping: [i, j], sorted: [...sorted], desc: `${a[j]} ≤ ${pivot}, swapping index ${i} and ${j}.` });
            [a[i], a[j]] = [a[j], a[i]];
            steps.push({ array: [...a], pivot: high, sorted: [...sorted], desc: `Swapped! Array: [${a.join(', ')}]` });
          } else {
            steps.push({ array: [...a], pivot: high, active: [j], sorted: [...sorted], desc: `${a[j]} ≤ ${pivot}, no swap needed.` });
          }
        }
      }
      if (i + 1 !== high) {
        steps.push({ array: [...a], swapping: [i+1, high], sorted: [...sorted], desc: `Placing pivot ${a[high]} at its correct position (index ${i+1}).` });
        [a[i+1], a[high]] = [a[high], a[i+1]];
      }
      sorted.push(i+1);
      steps.push({ array: [...a], sorted: [...sorted], desc: `Pivot ${a[i+1]} is now at its correct position (index ${i+1}). ✓` });
      return i + 1;
    }

    function qSort(low, high) {
      if (low < high) {
        const pi = partition(low, high);
        qSort(low, pi - 1);
        qSort(pi + 1, high);
      } else if (low === high) { sorted.push(low); }
    }

    steps.push({ array: [...a], sorted: [], desc: 'Starting Quick Sort. We select a pivot and partition around it.' });
    qSort(0, a.length - 1);
    const allSorted = Array.from({length: a.length}, (_, k) => k);
    steps.push({ array: [...a], sorted: allSorted, desc: 'Quick Sort Complete! All partitions sorted. 🎉' });
    return steps;
  },

  mergeSort(arr) {
    const steps = [];
    const a = [...arr];

    function merge(arr, left, mid, right) {
      const L = arr.slice(left, mid + 1);
      const R = arr.slice(mid + 1, right + 1);
      let i = 0, j = 0, k = left;
      steps.push({ array: [...arr], active: Array.from({length: right-left+1}, (_,x) => left+x), desc: `Merging subarrays [${L.join(',')}] and [${R.join(',')}]` });

      while (i < L.length && j < R.length) {
        steps.push({ array: [...arr], comparing: [left+i, mid+1+j], desc: `Comparing ${L[i]} and ${R[j]}` });
        if (L[i] <= R[j]) { arr[k++] = L[i++]; }
        else { arr[k++] = R[j++]; }
        steps.push({ array: [...arr], active: [k-1], desc: `Placed ${arr[k-1]} at position ${k-1}` });
      }
      while (i < L.length) { arr[k++] = L[i++]; }
      while (j < R.length) { arr[k++] = R[j++]; }
      steps.push({ array: [...arr], sorted: Array.from({length: right-left+1}, (_,x) => left+x), desc: `Merged! Subarray [${arr.slice(left, right+1).join(', ')}]` });
    }

    function mSort(arr, left, right) {
      if (left >= right) return;
      const mid = Math.floor((left + right) / 2);
      steps.push({ array: [...arr], active: [left, mid, right], desc: `Dividing: indices ${left} to ${right}, mid = ${mid}` });
      mSort(arr, left, mid);
      mSort(arr, mid + 1, right);
      merge(arr, left, mid, right);
    }

    steps.push({ array: [...a], desc: 'Starting Merge Sort. We divide the array in half recursively.' });
    mSort(a, 0, a.length - 1);
    steps.push({ array: [...a], sorted: Array.from({length: a.length}, (_, k) => k), desc: 'Merge Sort Complete! 🎉' });
    return steps;
  }
};

// ===== Searching Step Generators =====
const SearchingGenerators = {
  linearSearch(arr, target) {
    const steps = [];
    steps.push({ array: [...arr], active: [], desc: `Starting Linear Search for target: ${target}` });
    for (let i = 0; i < arr.length; i++) {
      steps.push({ array: [...arr], comparing: [i], desc: `Checking index ${i}: is ${arr[i]} === ${target}?` });
      if (arr[i] === target) {
        steps.push({ array: [...arr], found: i, sorted: [i], desc: `Found ${target} at index ${i}! 🎉` });
        return steps;
      }
      steps.push({ array: [...arr], active: Array.from({length: i+1}, (_,k) => k), desc: `${arr[i]} ≠ ${target}. Moving to next element.` });
    }
    steps.push({ array: [...arr], desc: `${target} not found in the array. Search complete.` });
    return steps;
  },

  binarySearch(arr, target) {
    const sorted = [...arr].sort((a,b) => a-b);
    const steps = [];
    steps.push({ array: [...sorted], left: 0, right: sorted.length-1, desc: `Binary Search on sorted array for target: ${target}. Left=0, Right=${sorted.length-1}` });

    let left = 0, right = sorted.length - 1;
    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      steps.push({ array: [...sorted], left, right, mid, comparing: [mid], desc: `Mid = ${mid}, value = ${sorted[mid]}. Comparing with target ${target}.` });
      if (sorted[mid] === target) {
        steps.push({ array: [...sorted], found: mid, sorted: [mid], desc: `Found ${target} at index ${mid}! 🎉 Only ${Math.ceil(Math.log2(sorted.length))} comparisons needed!` });
        return steps;
      } else if (sorted[mid] < target) {
        steps.push({ array: [...sorted], left: mid+1, right, desc: `${sorted[mid]} < ${target}, search the RIGHT half. New left = ${mid+1}` });
        left = mid + 1;
      } else {
        steps.push({ array: [...sorted], left, right: mid-1, desc: `${sorted[mid]} > ${target}, search the LEFT half. New right = ${mid-1}` });
        right = mid - 1;
      }
    }
    steps.push({ array: [...sorted], desc: `${target} not found in the array.` });
    return steps;
  }
};

// ===== Graph Step Generators =====
const GraphGenerators = {
  // Predefined graph for visualization
  sampleGraph: {
    nodes: {
      'A': { x: 0.5, y: 0.15 },
      'B': { x: 0.2, y: 0.4 },
      'C': { x: 0.8, y: 0.4 },
      'D': { x: 0.1, y: 0.75 },
      'E': { x: 0.4, y: 0.75 },
      'F': { x: 0.7, y: 0.75 },
      'G': { x: 0.9, y: 0.75 }
    },
    edges: [['A','B'],['A','C'],['B','D'],['B','E'],['C','F'],['C','G'],['E','F']],
    adj: { 'A': ['B','C'], 'B': ['A','D','E'], 'C': ['A','F','G'], 'D': ['B'], 'E': ['B','F'], 'F': ['C','E'], 'G': ['C'] }
  },

  bfs(start = 'A') {
    const g = this.sampleGraph;
    const steps = [];
    const visited = [];
    const queue = [start];
    visited.push(start);
    steps.push({ nodes: g.nodes, edges: g.edges, visited: [...visited], queue: [...queue], current: null, desc: `Starting BFS from node ${start}. Adding to queue.` });

    while (queue.length > 0) {
      const curr = queue.shift();
      steps.push({ nodes: g.nodes, edges: g.edges, visited: [...visited], queue: [...queue], current: curr, desc: `Dequeue ${curr}. Exploring its neighbors.` });
      for (const nb of g.adj[curr] || []) {
        if (!visited.includes(nb)) {
          visited.push(nb);
          queue.push(nb);
          steps.push({ nodes: g.nodes, edges: g.edges, visited: [...visited], queue: [...queue], current: curr, desc: `Found unvisited neighbor ${nb}. Adding to queue.` });
        } else {
          steps.push({ nodes: g.nodes, edges: g.edges, visited: [...visited], queue: [...queue], current: curr, desc: `Neighbor ${nb} already visited. Skipping.` });
        }
      }
    }
    steps.push({ nodes: g.nodes, edges: g.edges, visited: [...visited], queue: [], current: null, path: visited, desc: `BFS Complete! Visited order: ${visited.join(' → ')} 🎉` });
    return steps;
  },

  dfs(start = 'A') {
    const g = this.sampleGraph;
    const steps = [];
    const visited = [];
    const order = [];

    function dfsHelper(v) {
      visited.push(v);
      order.push(v);
      steps.push({ nodes: g.nodes, edges: g.edges, visited: [...visited], current: v, path: [...order], desc: `Visiting ${v}. DFS goes as deep as possible.` });
      for (const nb of g.adj[v] || []) {
        if (!visited.includes(nb)) {
          steps.push({ nodes: g.nodes, edges: g.edges, visited: [...visited], current: v, path: [...order], desc: `Exploring neighbor ${nb} of ${v}.` });
          dfsHelper(nb);
          steps.push({ nodes: g.nodes, edges: g.edges, visited: [...visited], current: v, path: [...order], desc: `Backtracking to ${v}.` });
        }
      }
    }

    steps.push({ nodes: g.nodes, edges: g.edges, visited: [], current: null, desc: `Starting DFS from node ${start}.` });
    dfsHelper(start);
    steps.push({ nodes: g.nodes, edges: g.edges, visited: [...visited], path: order, current: null, desc: `DFS Complete! Visited: ${order.join(' → ')} 🎉` });
    return steps;
  },

  dijkstra(start = 'A') {
    const g = this.sampleGraph;
    const weights = {'A-B':4,'A-C':2,'B-D':5,'B-E':1,'C-F':8,'C-G':10,'E-F':3};
    const steps = [];
    const dist = {}; const visited = [];
    Object.keys(g.nodes).forEach(n => dist[n] = Infinity);
    dist[start] = 0;
    steps.push({ nodes: g.nodes, edges: g.edges, weights, visited: [], dist: {...dist}, current: null, desc: `Starting Dijkstra from ${start}. All distances set to ∞ except source (0).` });

    for (let i = 0; i < Object.keys(g.nodes).length; i++) {
      let u = null;
      for (const v of Object.keys(dist)) {
        if (!visited.includes(v) && (u === null || dist[v] < dist[u])) u = v;
      }
      if (u === null || dist[u] === Infinity) break;
      visited.push(u);
      steps.push({ nodes: g.nodes, edges: g.edges, weights, visited: [...visited], dist: {...dist}, current: u, desc: `Visit node ${u} (distance=${dist[u]}). Relaxing neighbors.` });
      for (const nb of g.adj[u] || []) {
        const w = weights[`${u}-${nb}`] || weights[`${nb}-${u}`] || 1;
        if (dist[u] + w < dist[nb]) {
          dist[nb] = dist[u] + w;
          steps.push({ nodes: g.nodes, edges: g.edges, weights, visited: [...visited], dist: {...dist}, current: u, queue: [nb], desc: `Relax ${u}→${nb}: ${dist[u]}+${w}=${dist[nb]}. Updated distance of ${nb}.` });
        }
      }
    }
    steps.push({ nodes: g.nodes, edges: g.edges, weights, visited: [...visited], dist: {...dist}, path: visited, current: null, desc: `Dijkstra Complete! Shortest distances: ${Object.entries(dist).map(([k,v])=>`${k}:${v}`).join(', ')} 🎉` });
    return steps;
  }
};

// ===== Selection Sort & Heap Sort Generators =====
SortingGenerators.selectionSort = function(arr) {
  const steps = [];
  const a = [...arr]; const n = a.length; const sorted = [];
  steps.push({ array: [...a], sorted: [], desc: 'Starting Selection Sort. Find the minimum element and place it at the beginning.' });
  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      steps.push({ array: [...a], comparing: [minIdx, j], sorted: [...sorted], desc: `Comparing ${a[minIdx]} (min) with ${a[j]}.` });
      if (a[j] < a[minIdx]) minIdx = j;
    }
    if (minIdx !== i) {
      steps.push({ array: [...a], swapping: [i, minIdx], sorted: [...sorted], desc: `Swapping ${a[i]} and ${a[minIdx]}.` });
      [a[i], a[minIdx]] = [a[minIdx], a[i]];
    }
    sorted.push(i);
    steps.push({ array: [...a], sorted: [...sorted], desc: `${a[i]} placed at position ${i}. ✓` });
  }
  sorted.push(n - 1);
  steps.push({ array: [...a], sorted: [...sorted], desc: 'Selection Sort Complete! 🎉' });
  return steps;
};

SortingGenerators.heapSort = function(arr) {
  const steps = [];
  const a = [...arr]; const n = a.length; const sorted = [];

  function heapify(size, i) {
    let largest = i, l = 2*i+1, r = 2*i+2;
    if (l < size && a[l] > a[largest]) largest = l;
    if (r < size && a[r] > a[largest]) largest = r;
    if (largest !== i) {
      steps.push({ array: [...a], swapping: [i, largest], sorted: [...sorted], desc: `Heapify: swapping ${a[i]} and ${a[largest]}.` });
      [a[i], a[largest]] = [a[largest], a[i]];
      steps.push({ array: [...a], sorted: [...sorted], desc: `Array: [${a.join(', ')}]` });
      heapify(size, largest);
    }
  }

  steps.push({ array: [...a], desc: 'Starting Heap Sort. Building max-heap first.' });
  for (let i = Math.floor(n/2)-1; i >= 0; i--) heapify(n, i);
  steps.push({ array: [...a], desc: `Max-heap built: [${a.join(', ')}]` });
  for (let i = n-1; i > 0; i--) {
    steps.push({ array: [...a], swapping: [0, i], sorted: [...sorted], desc: `Moving max ${a[0]} to end.` });
    [a[0], a[i]] = [a[i], a[0]];
    sorted.push(i);
    steps.push({ array: [...a], sorted: [...sorted], desc: `${a[i]} in final position.` });
    heapify(i, 0);
  }
  sorted.push(0);
  steps.push({ array: [...a], sorted: Array.from({length:n},(_,k)=>k), desc: 'Heap Sort Complete! 🎉' });
  return steps;
};

// ===== DP Step Generators =====
const DPGenerators = {
  fibonacci(n) {
    const steps = [];
    const dp = [0, 1];
    steps.push({ array: [0, 1], active: [0, 1], desc: `Computing Fibonacci(${n}). Base cases: F(0)=0, F(1)=1.` });
    for (let i = 2; i <= n; i++) {
      dp[i] = dp[i-1] + dp[i-2];
      steps.push({ array: [...dp], comparing: [i-1, i-2], desc: `F(${i}) = F(${i-1}) + F(${i-2}) = ${dp[i-1]} + ${dp[i-2]} = ${dp[i]}` });
      steps.push({ array: [...dp], active: [i], sorted: Array.from({length:i+1},(_,k)=>k), desc: `Computed F(${i}) = ${dp[i]}. DP table: [${dp.join(', ')}]` });
    }
    steps.push({ array: [...dp], sorted: Array.from({length:dp.length},(_,k)=>k), desc: `Fibonacci(${n}) = ${dp[n]}. Complete! 🎉` });
    return steps;
  },

  knapsack() {
    const weights = [2, 3, 4, 5];
    const values = [3, 4, 5, 6];
    const W = 8;
    const n = weights.length;
    const steps = [];
    const dp = Array(n+1).fill(null).map(()=>Array(W+1).fill(0));
    steps.push({ array: [0,0,0,0,0,0,0,0,0], desc: `0/1 Knapsack: ${n} items, capacity=${W}. Weights=[${weights}], Values=[${values}]` });
    for (let i = 1; i <= n; i++) {
      for (let w = 0; w <= W; w++) {
        dp[i][w] = dp[i-1][w];
        if (weights[i-1] <= w) {
          const include = values[i-1] + dp[i-1][w-weights[i-1]];
          if (include > dp[i][w]) dp[i][w] = include;
        }
      }
      steps.push({ array: dp[i].slice(), comparing: [weights[i-1]], active: dp[i].map((_,k)=>k).filter(k=>dp[i][k]>dp[i-1][k]), desc: `Item ${i} (w=${weights[i-1]}, v=${values[i-1]}): row=[${dp[i].join(',')}]. Max so far: ${dp[i][W]}` });
    }
    steps.push({ array: dp[n].slice(), sorted: Array.from({length:W+1},(_,k)=>k), desc: `Knapsack Complete! Maximum value = ${dp[n][W]} 🎉` });
    return steps;
  },

  coinChange(coins = [1, 3, 4], amount = 12) {
    const steps = [];
    const dp = Array(amount + 1).fill(Infinity); dp[0] = 0;
    steps.push({ array: dp.map(v=>v===Infinity?0:v).slice(0,13), desc: `Coin Change: coins=[${coins}], amount=${amount}. dp[0]=0, rest=∞` });
    for (let i = 1; i <= amount; i++) {
      for (const c of coins) {
        if (c <= i && dp[i-c] + 1 < dp[i]) {
          dp[i] = dp[i-c] + 1;
        }
      }
      const disp = dp.slice(0, 13).map(v=>v===Infinity?0:v);
      steps.push({ array: disp, active: [i], sorted: disp.map((_,k)=>k).filter(k=>disp[k]>0), desc: `Amount ${i}: min coins = ${dp[i]===Infinity?'∞':dp[i]}. dp=[${dp.slice(0,i+1).map(v=>v===Infinity?'∞':v).join(',')}]` });
    }
    steps.push({ array: dp.slice(0,13).map(v=>v===Infinity?0:v), sorted: Array.from({length:13},(_,k)=>k), desc: `Coin Change Complete! Minimum coins for ${amount} = ${dp[amount]} 🎉` });
    return steps;
  }
};

// ===== Shell Sort Step Generator =====
SortingGenerators.shellSort = function(arr) {
  const steps = [];
  const a = [...arr]; const sorted = [];
  let gap = Math.floor(a.length / 2);
  steps.push({ array: [...a], desc: `Starting Shell Sort. Initial gap = ${gap}` });
  while (gap > 0) {
    for (let i = gap; i < a.length; i++) {
      const temp = a[i]; let j = i;
      steps.push({ array: [...a], comparing: [j, j-gap], desc: `gap=${gap}: Comparing a[${j}]=${a[j]} with a[${j-gap}]=${a[j-gap]}` });
      while (j >= gap && a[j-gap] > temp) {
        a[j] = a[j-gap];
        steps.push({ array: [...a], swapping: [j, j-gap], desc: `Shifting ${a[j]} right. gap=${gap}` });
        j -= gap;
      }
      a[j] = temp;
    }
    gap = Math.floor(gap / 2);
    if (gap === 0) { for(let k=0;k<a.length;k++) sorted.push(k); }
    steps.push({ array: [...a], sorted: gap===0?[...sorted]:[], desc: gap>0 ? `Pass complete. New gap = ${gap}` : `Final pass (gap=1) complete! Sorted! 🎉` });
  }
  return steps;
};

// ===== Counting Sort Step Generator =====
SortingGenerators.countingSort = function(arr) {
  const steps = [];
  const a = arr.map(v => Math.min(v, 20)); // cap at 20 for display
  const max = Math.max(...a);
  const count = new Array(max + 1).fill(0);
  steps.push({ array: [...a], desc: `Counting Sort: Count occurrences of each value (0 to ${max}).` });
  a.forEach((v, i) => {
    count[v]++;
    steps.push({ array: [...a], active: [i], desc: `count[${v}] = ${count[v]}. Counted element ${v} at index ${i}.` });
  });
  // Prefix sum
  for (let i = 1; i <= max; i++) count[i] += count[i-1];
  steps.push({ array: [...count.slice(0, Math.min(max+1, a.length))], desc: `Prefix sums computed. Output positions determined.` });
  const out = new Array(a.length).fill(0);
  for (let i = a.length-1; i >= 0; i--) {
    out[--count[a[i]]] = a[i];
    steps.push({ array: [...out], active: [count[a[i]]], desc: `Placed ${a[i]} at position ${count[a[i]]}. Output: [${out.join(',')}]` });
  }
  steps.push({ array: out, sorted: Array.from({length:out.length},(_,k)=>k), desc: 'Counting Sort Complete! 🎉' });
  return steps;
};

// ===== Jump Search Step Generator =====
SearchingGenerators.jumpSearch = function(arr, target) {
  const sorted = [...arr].sort((a,b)=>a-b);
  const steps = [];
  const n = sorted.length;
  const step = Math.floor(Math.sqrt(n));
  steps.push({ array: sorted, desc: `Jump Search for ${target}. Step size = √${n} ≈ ${step}` });
  let prev = 0, curr = step;
  while (curr < n && sorted[curr] < target) {
    steps.push({ array: sorted, active: [prev, Math.min(curr,n-1)], comparing: [curr], desc: `Jump! a[${curr}]=${sorted[curr]} < ${target}. Move to block [${curr}, ${Math.min(curr+step,n-1)}]` });
    prev = curr; curr += step;
  }
  steps.push({ array: sorted, active: Array.from({length:Math.min(curr,n)-prev},(_,k)=>prev+k), desc: `Found block [${prev}..${Math.min(curr,n)-1}]. Linear search in this block.` });
  for (let i = prev; i < Math.min(curr, n); i++) {
    steps.push({ array: sorted, comparing: [i], desc: `Linear check: a[${i}] = ${sorted[i]}` });
    if (sorted[i] === target) {
      steps.push({ array: sorted, found: i, sorted: [i], desc: `Found ${target} at index ${i}! 🎉` });
      return steps;
    }
  }
  steps.push({ array: sorted, desc: `${target} not found.` });
  return steps;
};

// ===== Bellman-Ford Step Generator =====
GraphGenerators.bellmanFord = function(start = 'A') {
  const g = this.sampleGraph;
  const weights = {'A-B':4,'A-C':2,'B-D':5,'B-E':1,'C-F':8,'C-G':10,'E-F':3};
  const edges = Object.keys(weights).map(k => { const [u,v]=k.split('-'); return [u,v,weights[k]]; });
  const steps = [];
  const dist = {}; Object.keys(g.nodes).forEach(n => dist[n] = Infinity);
  dist[start] = 0;
  const V = Object.keys(g.nodes).length;
  steps.push({ nodes: g.nodes, edges: g.edges, weights, dist: {...dist}, visited: [], desc: `Bellman-Ford from ${start}. Init all distances to ∞ except source (0).` });
  for (let i = 0; i < V - 1; i++) {
    let changed = false;
    for (const [u, v, w] of edges) {
      if (dist[u] !== Infinity && dist[u] + w < dist[v]) {
        dist[v] = dist[u] + w; changed = true;
        steps.push({ nodes: g.nodes, edges: g.edges, weights, dist: {...dist}, current: u, queue: [v], desc: `Iteration ${i+1}: Relax ${u}→${v}. ${dist[u]}+${w}=${dist[v]}. Updated!` });
      }
    }
    if (!changed) { steps.push({ nodes: g.nodes, edges: g.edges, weights, dist: {...dist}, desc: `Iteration ${i+1}: No updates. Converged early!` }); break; }
  }
  steps.push({ nodes: g.nodes, edges: g.edges, weights, dist: {...dist}, path: Object.keys(g.nodes), desc: `Bellman-Ford Complete! Shortest distances: ${Object.entries(dist).map(([k,v])=>`${k}:${v}`).join(', ')} 🎉` });
  return steps;
};

// ===== Radix Sort Step Generator =====
SortingGenerators.radixSort = function(arr) {
  const steps = [];
  let a = [...arr];
  let sorted = [];
  const max = Math.max(...a);
  steps.push({ array: [...a], desc: `Starting Radix Sort. Max value is ${max}` });
  
  for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
    steps.push({ array: [...a], desc: `Sorting by digit: ${exp}s place` });
    const count = Array(10).fill(0);
    const out = Array(a.length).fill(0);
    
    // Count occurrences
    for (let i = 0; i < a.length; i++) {
      const digit = Math.floor(a[i] / exp) % 10;
      count[digit]++;
      steps.push({ array: [...a], comparing: [i], desc: `Count occurrences of digit ${digit} at index ${i}` });
    }
    
    // Cumulative count
    for (let i = 1; i < 10; i++) count[i] += count[i-1];
    
    // Build output array
    for (let i = a.length - 1; i >= 0; i--) {
      const digit = Math.floor(a[i] / exp) % 10;
      count[digit]--;
      out[count[digit]] = a[i];
      steps.push({ array: [...a], swapping: [i], desc: `Placing ${a[i]} into its sorted position for digit ${exp}s place` });
    }
    
    a = [...out];
    steps.push({ array: [...a], desc: `Array after sorting by ${exp}s place` });
  }
  
  // Final sorted list
  for (let k = 0; k < a.length; k++) sorted.push(k);
  steps.push({ array: [...a], sorted: sorted, desc: `Radix Sort Complete! 🎉` });
  return steps;
};

// ===== Exponential Search Step Generator =====
SearchingGenerators.exponentialSearch = function(arr, target) {
  const steps = [];
  steps.push({ array: arr.slice(), desc: `Searching for ${target} in array of length ${arr.length}` });
  if (arr[0] === target) {
    steps.push({ array: arr.slice(), comparing: [0], found: 0, desc: `Found ${target} at index 0! 🎉` });
    return steps;
  }
  steps.push({ array: arr.slice(), comparing: [0], desc: `${arr[0]} is not ${target}, beginning bound expansion.` });
  let i = 1, n = arr.length;
  while (i < n && arr[i] <= target) {
    steps.push({ array: arr.slice(), comparing: [i], desc: `Index ${i}: ${arr[i]} <= ${target}. Doubling window...` });
    i *= 2;
  }
  
  let left = Math.floor(i / 2);
  let right = Math.min(i, n - 1);
  steps.push({ array: arr.slice(), left, right, desc: `Bounds found. Doing Binary Search between index ${left} and ${right}` });
  
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    steps.push({ array: arr.slice(), left, right, mid, desc: `Binary Search: checking mid index ${mid} (${arr[mid]})` });
    if (arr[mid] === target) {
      steps.push({ array: arr.slice(), left, right, mid, found: mid, desc: `Found ${target} at index ${mid}! 🎉` });
      return steps;
    }
    if (arr[mid] < target) {
      left = mid + 1;
      steps.push({ array: arr.slice(), left, right, desc: `${arr[mid]} < ${target}, moving left bound to ${left}` });
    } else {
      right = mid - 1;
      steps.push({ array: arr.slice(), left, right, desc: `${arr[mid]} > ${target}, moving right bound to ${right}` });
    }
  }
  steps.push({ array: arr.slice(), desc: `Value ${target} not found in array.` });
  return steps;
};

// ===== Prim's MST Step Generator =====
GraphGenerators.prims = function(start = 'A') {
  const g = this.sampleGraph;
  const weights = {'A-B':4,'A-C':2,'B-D':5,'B-E':1,'C-F':8,'C-G':10,'E-F':3};
  const edgesData = Object.keys(weights).map(k => { const [u,v]=k.split('-'); return [u,v,weights[k]]; });
  const adj = {};
  for(let n in g.nodes) adj[n] = [];
  for(const [u,v,w] of edgesData) {
    adj[u].push([v,w]); adj[v].push([u,w]);
  }
  
  const steps = [];
  const V = Object.keys(g.nodes).length;
  const key = {}; Object.keys(g.nodes).forEach(n => key[n] = Infinity);
  key[start] = 0;
  
  const inMST = new Set();
  const parent = {};
  
  steps.push({ nodes: g.nodes, edges: g.edges, weights, dist: {...key}, visited: [], desc: `Prim's MST from ${start}. Init keys to ∞ except source.` });
  
  for (let count = 0; count < V; count++) {
    let u = null, min = Infinity;
    for (const v in key) {
      if (!inMST.has(v) && key[v] < min) { min = key[v]; u = v; }
    }
    if (!u) break;
    inMST.add(u);
    steps.push({ nodes: g.nodes, edges: g.edges, weights, dist: {...key}, current: u, visited: [...inMST], desc: `Adding ${u} to MST. Min edge weight ${min}` });
    
    for (const [v, w] of adj[u] || []) {
      if (!inMST.has(v) && w < key[v]) {
        key[v] = w; parent[v] = u;
        steps.push({ nodes: g.nodes, edges: g.edges, weights, dist: {...key}, current: u, queue: [v], visited: [...inMST], desc: `Update key for ${v} to ${w} (parent becomes ${u})` });
      }
    }
  }
  steps.push({ nodes: g.nodes, edges: g.edges, weights, dist: {...key}, path: Object.keys(parent).map(n => parent[n] ? n : '').filter(Boolean), visited: [...inMST], desc: `Prim's MST Complete! 🎉` });
  return steps;
};

// ===== LIS Step Generator =====
DPGenerators.lis = function(arr = [10, 9, 2, 5, 3, 7, 101, 18]) {
  const steps = [];
  const dp = Array(arr.length).fill(1);
  steps.push({ array: arr.slice(), active: [], comparing: [], sorted: [], desc: `Starting LIS. dp array initialized to 1s. array=[${arr.join(',')}]` });
  
  let maxLIS = 1;
  for (let i = 1; i < arr.length; i++) {
    steps.push({ array: arr.slice(), active: [i], desc: `Checking element i=${i} (${arr[i]}). dp=[${dp.join(',')}]` });
    for (let j = 0; j < i; j++) {
      steps.push({ array: arr.slice(), active: [i], comparing: [j], desc: `Comparing arr[${i}]=${arr[i]} with arr[${j}]=${arr[j]}` });
      if (arr[i] > arr[j]) {
        if (dp[j] + 1 > dp[i]) {
          dp[i] = dp[j] + 1;
          steps.push({ array: arr.slice(), active: [i], comparing: [j], desc: `${arr[i]} > ${arr[j]}, updating dp[${i}]=${dp[i]}` });
        }
      } else {
         steps.push({ array: arr.slice(), active: [i], comparing: [j], desc: `${arr[i]} is not > ${arr[j]}, skipping...` });
      }
    }
    maxLIS = Math.max(maxLIS, dp[i]);
  }
  steps.push({ array: arr.slice(), sorted: Array.from({length:arr.length},(_,k)=>k).filter(k=>dp[k]===maxLIS), desc: `LIS Complete! Longest increasing subsequence length = ${maxLIS} 🎉. dp=[${dp.join(',')}]` });
  return steps;
};

// ===== Viz Controls Setup =====
function setupVizControls(viz, btnPlayId, btnPauseId, btnResetId, btnPrevId, btnNextId, speedId) {
  const playBtn = document.getElementById(btnPlayId);
  const pauseBtn = document.getElementById(btnPauseId);
  const resetBtn = document.getElementById(btnResetId);
  const prevBtn = document.getElementById(btnPrevId);
  const nextBtn = document.getElementById(btnNextId);
  const speedSlider = document.getElementById(speedId);

  const updateButtons = () => {
    if (!playBtn || !pauseBtn) return;
    playBtn.style.display = viz.isPlaying ? 'none' : 'inline-flex';
    pauseBtn.style.display = viz.isPlaying ? 'inline-flex' : 'none';
  };

  playBtn?.addEventListener('click', () => { viz.play(); updateButtons(); });
  pauseBtn?.addEventListener('click', () => { viz.pause(); updateButtons(); });
  resetBtn?.addEventListener('click', () => { viz.reset(); updateButtons(); });
  prevBtn?.addEventListener('click', () => { viz.pause(); viz.stepBack(); updateButtons(); });
  nextBtn?.addEventListener('click', () => { viz.pause(); viz.stepForward(); updateButtons(); });
  speedSlider?.addEventListener('input', () => {
    const speeds = [800, 600, 400, 200, 80];
    viz.setSpeed(speeds[parseInt(speedSlider.value) - 1] || 400);
  });

  viz.onComplete = () => updateButtons();
  updateButtons();
}
