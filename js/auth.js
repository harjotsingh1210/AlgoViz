// ===== Auth Manager =====
// Bridges the old localStorage format (algoviz-session) with
// the new API format (algoviz_user / algoviz_token) from api.js
// so all existing HTML pages work without modification.
const Auth = {
  USERS_KEY: 'algoviz-users',
  SESSION_KEY: 'algoviz-session',

  // ── Read session from EITHER old key OR new api.js key ──
  getSession() {
    // Try old key first
    const old = localStorage.getItem(this.SESSION_KEY);
    if (old) return JSON.parse(old);

    // Fall back to new api.js format
    const newUser = localStorage.getItem('algoviz_user');
    if (newUser) {
      const u = JSON.parse(newUser);
      // Normalise so old code works (id, name, email, avatar, isAdmin)
      return {
        id: u.id || u._id,
        name: u.name,
        email: u.email,
        avatar: u.avatar,
        isAdmin: u.isAdmin || false
      };
    }
    return null;
  },

  setSession(user) {
    localStorage.setItem(this.SESSION_KEY, JSON.stringify(user));
  },

  clearSession() {
    localStorage.removeItem(this.SESSION_KEY);
    localStorage.removeItem('algoviz_user');
    localStorage.removeItem('algoviz_token');
    localStorage.removeItem('algoviz_progress');
  },

  isLoggedIn() {
    return !!this.getSession();
  },

  // ── Progress: read from api.js cache OR old users array ──
  getProgress(id) {
    // Prefer api.js cached progress
    const cached = localStorage.getItem('algoviz_progress');
    if (cached) {
      try { return JSON.parse(cached); } catch {}
    }
    // Fall back to old embedded progress
    const users = this.getUsers();
    const user = users.find(u => u.id === id);
    return user?.progress || { explored: [], quizScores: {}, totalPoints: 0 };
  },

  markExplored(algoId) {
    // Update local cache (api.js will sync to backend next time)
    const cached = localStorage.getItem('algoviz_progress');
    const prog = cached ? JSON.parse(cached) : { explored: [], quizScores: {} };
    if (!prog.explored.includes(algoId)) prog.explored.push(algoId);
    localStorage.setItem('algoviz_progress', JSON.stringify(prog));

    // Also fire API call if token exists
    if (localStorage.getItem('algoviz_token') && typeof ProgressAPI !== 'undefined') {
      ProgressAPI.markExplored(algoId).catch(() => {});
    }
  },

  saveQuizScore(quizId, score) {
    const cached = localStorage.getItem('algoviz_progress');
    const prog = cached ? JSON.parse(cached) : { explored: [], quizScores: {} };
    if (!prog.quizScores) prog.quizScores = {};
    prog.quizScores[quizId] = score;
    localStorage.setItem('algoviz_progress', JSON.stringify(prog));

    if (localStorage.getItem('algoviz_token') && typeof ProgressAPI !== 'undefined') {
      ProgressAPI.saveQuizScore(quizId, score).catch(() => {});
    }
  },

  // ── Old localStorage user management (kept for offline fallback) ──
  getUsers() {
    return JSON.parse(localStorage.getItem(this.USERS_KEY) || '[]');
  },
  saveUsers(users) {
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
  },
  getAllUsers() {
    return this.getUsers();
  },
  signup(name, email, password) {
    const users = this.getUsers();
    if (users.find(u => u.email === email)) return { ok: false, msg: 'Email already registered.' };
    const user = {
      id: Date.now().toString(), name, email, password,
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
      joinedAt: new Date().toISOString(),
      progress: { explored: [], quizScores: {}, totalPoints: 0 }
    };
    users.push(user);
    this.saveUsers(users);
    this.setSession({ id: user.id, name, email, avatar: user.avatar });
    return { ok: true };
  },
  login(email, password) {
    const users = this.getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) return { ok: false, msg: 'Invalid email or password.' };
    if (user.blocked || user.isBlocked) return { ok: false, msg: 'Account suspended.' };
    this.setSession({ id: user.id, name: user.name, email: user.email, avatar: user.avatar, isAdmin: user.isAdmin });
    return { ok: true };
  },
  logout() {
    this.clearSession();
    window.location.href = '/index.html';
  },
  updateProfile(id, updates) {
    const users = this.getUsers();
    const idx = users.findIndex(u => u.id === id);
    if (idx === -1) return { ok: false, msg: 'User not found.' };
    users[idx] = { ...users[idx], ...updates };
    this.saveUsers(users);
    this.setSession({ ...this.getSession(), ...updates });
    return { ok: true };
  },
  blockUser(id) {
    const users = this.getUsers();
    const u = users.find(u => u.id === id);
    if (u) { u.isBlocked = !u.isBlocked; this.saveUsers(users); }
  },
  deleteUser(id) {
    this.saveUsers(this.getUsers().filter(u => u.id !== id));
  }
};

// ── Auth Guards ──
function requireAuth(redirectTo = '/login.html') {
  if (!Auth.isLoggedIn()) { window.location.href = redirectTo; return false; }
  return true;
}
function requireAdmin() {
  const s = Auth.getSession();
  if (!s || !s.isAdmin) { window.location.href = '/login.html'; return false; }
  return true;
}

// ── Navbar ──
function renderUserNav() {
  const session = Auth.getSession();
  const navEl = document.getElementById('navUserArea');
  if (!navEl) return;
  if (session) {
    navEl.innerHTML = `
      <a href="dashboard.html" class="btn btn-secondary btn-sm">📊 Dashboard</a>
      <a href="profile.html" style="display:flex;align-items:center;gap:6px;color:var(--text-secondary);font-size:0.85rem;font-weight:600;">
        <img src="${session.avatar || ''}" onerror="this.style.display='none'"
          style="width:28px;height:28px;border-radius:50%;border:2px solid var(--border-color);">
        ${session.name?.split(' ')[0] || 'User'}
      </a>
    `;
  } else {
    navEl.innerHTML = `
      <a href="login.html" class="btn btn-secondary btn-sm">Login</a>
      <a href="signup.html" class="btn btn-primary btn-sm">Sign Up</a>
    `;
  }
}

document.addEventListener('DOMContentLoaded', renderUserNav);
