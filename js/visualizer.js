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
  }
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
