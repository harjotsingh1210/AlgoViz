// ===== Comparison Tool with Chart.js =====
const ComparisonTool = {
  chartInstance: null,
  barChartInstance: null,

  // Generate operation counts for a given algorithm at size n
  getComplexity(algoId, n) {
    const map = {
      'bubble-sort': n * n,
      'insertion-sort': n * n / 2,
      'quick-sort': n * Math.log2(n) * 1.2,
      'merge-sort': n * Math.log2(n),
      'linear-search': n,
      'binary-search': Math.log2(n),
      'bfs': n + n * 1.5,
      'dfs': n + n * 1.5,
      'dijkstra': (n + n * 1.5) * Math.log2(n),
      'fibonacci-dp': n,
      'knapsack': n * Math.sqrt(n)
    };
    return Math.round(map[algoId] || n) || 1;
  },

  getColors() {
    return [
      { border: '#f97316', bg: 'rgba(249,115,22,0.15)' },
      { border: '#3b82f6', bg: 'rgba(59,130,246,0.15)' },
      { border: '#22c55e', bg: 'rgba(34,197,94,0.15)' },
      { border: '#a855f7', bg: 'rgba(168,85,247,0.15)' },
      { border: '#eab308', bg: 'rgba(234,179,8,0.15)' },
      { border: '#ec4899', bg: 'rgba(236,72,153,0.15)' },
    ];
  },

  renderLineChart(canvasId, selectedAlgos, sizes) {
    const ctx = document.getElementById(canvasId)?.getContext('2d');
    if (!ctx) return;
    if (this.chartInstance) this.chartInstance.destroy();

    const colors = this.getColors();
    const datasets = selectedAlgos.map((id, i) => {
      const algo = getAlgorithmById(id);
      const c = colors[i % colors.length];
      return {
        label: algo?.name || id,
        data: sizes.map(n => this.getComplexity(id, n)),
        borderColor: c.border,
        backgroundColor: c.bg,
        borderWidth: 2.5,
        pointBackgroundColor: c.border,
        pointRadius: 4,
        tension: 0.4,
        fill: true
      };
    });

    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
    const gridColor = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.06)';
    const textColor = isDark ? '#666' : '#999';

    this.chartInstance = new Chart(ctx, {
      type: 'line',
      data: { labels: sizes, datasets },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'top', labels: { color: isDark ? '#aaa' : '#555', padding: 16, font: { family: 'Inter', size: 12 } } },
          tooltip: {
            backgroundColor: isDark ? '#1e1e2a' : '#fff',
            borderColor: 'rgba(249,115,22,0.3)',
            borderWidth: 1,
            titleColor: isDark ? '#f1f1f5' : '#0d0d14',
            bodyColor: isDark ? '#9494a8' : '#4a4a6a',
            padding: 12
          }
        },
        scales: {
          x: { grid: { color: gridColor }, ticks: { color: textColor, font: { family: 'Inter' } }, title: { display: true, text: 'Input Size (n)', color: textColor } },
          y: { grid: { color: gridColor }, ticks: { color: textColor, font: { family: 'Inter' } }, title: { display: true, text: 'Operations', color: textColor }, beginAtZero: true }
        }
      }
    });
  },

  renderBarChart(canvasId, selectedAlgos, n) {
    const ctx = document.getElementById(canvasId)?.getContext('2d');
    if (!ctx) return;
    if (this.barChartInstance) this.barChartInstance.destroy();

    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
    const colors = this.getColors();

    this.barChartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: selectedAlgos.map(id => getAlgorithmById(id)?.name || id),
        datasets: [{
          label: `Operations at n=${n}`,
          data: selectedAlgos.map(id => this.getComplexity(id, n)),
          backgroundColor: selectedAlgos.map((_, i) => colors[i % colors.length].bg),
          borderColor: selectedAlgos.map((_, i) => colors[i % colors.length].border),
          borderWidth: 2,
          borderRadius: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: isDark ? '#1e1e2a' : '#fff',
            borderColor: 'rgba(249,115,22,0.3)',
            borderWidth: 1,
            titleColor: isDark ? '#f1f1f5' : '#0d0d14',
            bodyColor: isDark ? '#9494a8' : '#4a4a6a',
            padding: 12
          }
        },
        scales: {
          x: { grid: { display: false }, ticks: { color: isDark ? '#666' : '#999', font: { family: 'Inter', size: 11 } } },
          y: { grid: { color: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.06)' }, ticks: { color: isDark ? '#666' : '#999', font: { family: 'Inter' } }, beginAtZero: true }
        }
      }
    });
  }
};

// ===== Quiz Engine =====
const QuizEngine = {
  questions: [],
  current: 0,
  score: 0,
  answered: false,
  algoId: null,

  load(algoId) {
    this.algoId = algoId;
    this.questions = (QUIZ_QUESTIONS[algoId] || []).sort(() => Math.random() - 0.5).slice(0, 4);
    this.current = 0;
    this.score = 0;
    this.answered = false;
    this.render();
  },

  render() {
    const container = document.getElementById('quizContainer');
    if (!container || this.questions.length === 0) return;
    if (this.current >= this.questions.length) {
      this.showResult(container);
      return;
    }

    const q = this.questions[this.current];
    container.innerHTML = `
      <div class="flex justify-between items-center mb-4">
        <span class="badge badge-orange">Question ${this.current + 1} / ${this.questions.length}</span>
        <span class="text-muted" style="font-size:0.82rem;font-weight:600;">Score: ${this.score}</span>
      </div>
      <p style="font-size:1rem;font-weight:600;line-height:1.5;margin-bottom:20px;">${q.q}</p>
      <div style="display:flex;flex-direction:column;gap:10px;">
        ${q.opts.map((opt, i) => `
          <div class="quiz-option" id="opt-${i}" onclick="QuizEngine.selectAnswer(${i})">
            <span class="option-letter">${'ABCD'[i]}</span>
            <span>${opt}</span>
          </div>
        `).join('')}
      </div>
      <div id="quizExplan" style="display:none;margin-top:16px;padding:14px;background:rgba(249,115,22,0.1);border:1px solid rgba(249,115,22,0.2);border-radius:var(--radius-md);font-size:0.875rem;color:var(--text-secondary);"></div>
      <div style="margin-top:16px;display:flex;justify-content:flex-end;">
        <button class="btn btn-primary btn-sm" id="nextQuizBtn" style="display:none;" onclick="QuizEngine.next()">Next Question →</button>
      </div>
    `;
  },

  selectAnswer(idx) {
    if (this.answered) return;
    this.answered = true;
    const q = this.questions[this.current];
    const isCorrect = idx === q.ans;
    if (isCorrect) this.score++;

    document.querySelectorAll('.quiz-option').forEach((el, i) => {
      el.classList.remove('selected');
      if (i === idx) el.classList.add(isCorrect ? 'correct' : 'wrong');
      if (i === q.ans && !isCorrect) el.classList.add('correct');
    });

    const explan = document.getElementById('quizExplan');
    explan.style.display = 'block';
    explan.innerHTML = `<strong>${isCorrect ? '✅ Correct!' : '❌ Incorrect.'}</strong> ${q.exp}`;
    document.getElementById('nextQuizBtn').style.display = 'inline-flex';
  },

  next() {
    this.current++;
    this.answered = false;
    this.render();
  },

  showResult(container) {
    const pct = Math.round((this.score / this.questions.length) * 100);
    const emoji = pct === 100 ? '🏆' : pct >= 75 ? '🌟' : pct >= 50 ? '👍' : '📚';
    container.innerHTML = `
      <div class="text-center" style="padding:32px 0;">
        <div style="font-size:4rem;margin-bottom:16px;">${emoji}</div>
        <h3 style="font-size:1.5rem;font-weight:800;margin-bottom:8px;">Quiz Complete!</h3>
        <p style="color:var(--text-muted);margin-bottom:24px;">You scored <strong style="color:var(--accent)">${this.score}/${this.questions.length}</strong> (${pct}%)</p>
        <div class="progress-bar" style="max-width:300px;margin:0 auto 24px;height:10px;">
          <div class="progress-fill" style="width:${pct}%"></div>
        </div>
        <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;">
          <button class="btn btn-primary" onclick="QuizEngine.load('${this.algoId}')">Try Again</button>
          <a href="library.html" class="btn btn-secondary">More Algorithms</a>
        </div>
      </div>
    `;
    if (this.algoId && typeof ProgressAPI !== 'undefined' && typeof AuthAPI !== 'undefined' && AuthAPI.isLoggedIn()) {
      ProgressAPI.saveQuizScore(this.algoId, this.score);
    } else if (this.algoId && Auth.isLoggedIn()) {
      Auth.saveQuizScore(this.algoId, this.score);
    }
  }
};
