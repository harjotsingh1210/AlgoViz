/**
 * AlgoViz API Client
 * Centralized fetch wrapper for all backend API calls.
 * Automatically injects JWT token and handles errors.
 *
 * Backend: Node.js / Express on Render.com
 * In development: http://localhost:5000
 * In production: set window.API_BASE_URL before loading this script
 */

const API_BASE_URL =
  window.API_BASE_URL ||               // Set by deployment (vercel env var injection)
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'          // Local dev
    : 'https://algoviz-api.onrender.com'); // ← CHANGE THIS to your Render URL after deploy

// ─────────────────────────────────────────
// Core fetch wrapper
// ─────────────────────────────────────────
async function apiFetch(endpoint, options = {}) {
  const token = localStorage.getItem('algoviz_token');

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {})
    },
    ...options
  };

  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();

    // Handle token expiry
    if (response.status === 401 && data.message?.includes('expired')) {
      localStorage.removeItem('algoviz_token');
      localStorage.removeItem('algoviz_user');
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login.html?expired=1';
      }
    }

    return { ok: response.ok, status: response.status, ...data };
  } catch (err) {
    // Network error / server down — fall back to localStorage
    console.warn('API unavailable, falling back to localStorage:', err.message);
    return { ok: false, offline: true, message: 'Server unavailable. Working in offline mode.' };
  }
}

// ─────────────────────────────────────────
// Auth API
// ─────────────────────────────────────────
const AuthAPI = {
  async signup(name, email, password) {
    const res = await apiFetch('/api/auth/signup', {
      method: 'POST',
      body: { name, email, password }
    });
    if (res.ok) {
      localStorage.setItem('algoviz_token', res.token);
      localStorage.setItem('algoviz_user', JSON.stringify(res.user));
      // Also write old key so auth.js-powered pages (dashboard etc.) work
      localStorage.setItem('algoviz-session', JSON.stringify({
        id: res.user.id || res.user._id,
        name: res.user.name,
        email: res.user.email,
        avatar: res.user.avatar,
        isAdmin: res.user.isAdmin || false
      }));
    }
    return res;
  },

  async login(email, password) {
    const res = await apiFetch('/api/auth/login', {
      method: 'POST',
      body: { email, password }
    });
    if (res.ok) {
      localStorage.setItem('algoviz_token', res.token);
      localStorage.setItem('algoviz_user', JSON.stringify(res.user));
      // Also write old key so auth.js-powered pages (dashboard etc.) work
      localStorage.setItem('algoviz-session', JSON.stringify({
        id: res.user.id || res.user._id,
        name: res.user.name,
        email: res.user.email,
        avatar: res.user.avatar,
        isAdmin: res.user.isAdmin || false
      }));
    }
    return res;
  },

  logout() {
    localStorage.removeItem('algoviz_token');
    localStorage.removeItem('algoviz_user');
    localStorage.removeItem('algoviz-session');  // Clear old key too
    localStorage.removeItem('algoviz_progress');
    window.location.href = '/index.html';
  },

  async getMe() {
    if (!this.isLoggedIn()) return null;
    const res = await apiFetch('/api/auth/me');
    if (res.ok && res.user) {
      localStorage.setItem('algoviz_user', JSON.stringify(res.user));
    }
    return res;
  },

  async updateProfile(updates) {
    const res = await apiFetch('/api/auth/profile', {
      method: 'PUT',
      body: updates
    });
    if (res.ok && res.token) {
      localStorage.setItem('algoviz_token', res.token);
      localStorage.setItem('algoviz_user', JSON.stringify(res.user));
    }
    return res;
  },

  isLoggedIn() {
    return !!localStorage.getItem('algoviz_token');
  },

  getUser() {
    const u = localStorage.getItem('algoviz_user');
    return u ? JSON.parse(u) : null;
  },

  isAdmin() {
    return this.getUser()?.isAdmin === true;
  }
};

// ─────────────────────────────────────────
// Progress API
// ─────────────────────────────────────────
const ProgressAPI = {
  async get() {
    return apiFetch('/api/progress');
  },

  async markExplored(algoId) {
    // Optimistic local update
    const cached = localStorage.getItem('algoviz_progress');
    try {
      const prog = cached ? JSON.parse(cached) : { explored: [], quizScores: {} };
      if (!prog.explored.includes(algoId)) prog.explored.push(algoId);
      localStorage.setItem('algoviz_progress', JSON.stringify(prog));
    } catch {}

    return apiFetch(`/api/progress/explore/${algoId}`, { method: 'PUT' });
  },

  async saveQuizScore(algoId, score) {
    return apiFetch(`/api/progress/quiz/${algoId}`, {
      method: 'PUT',
      body: { score }
    });
  },

  async reset() {
    localStorage.removeItem('algoviz_progress');
    return apiFetch('/api/progress/reset', { method: 'DELETE' });
  },

  // Cache progress locally to avoid refetching on every page
  getCached() {
    const p = localStorage.getItem('algoviz_progress');
    return p ? JSON.parse(p) : { explored: [], quizScores: {} };
  },

  async fetchAndCache() {
    const res = await this.get();
    if (res.ok && res.data) {
      const data = res.data;
      // Normalize Map from server to plain object
      const scores = data.quizScores || {};
      const normalized = {
        explored: data.explored || [],
        quizScores: Array.isArray(scores) ? Object.fromEntries(scores) : scores,
        totalPoints: data.totalPoints || 0,
        streak: data.streak || { count: 0 }
      };
      localStorage.setItem('algoviz_progress', JSON.stringify(normalized));
      return normalized;
    }
    return this.getCached();
  }
};

// ─────────────────────────────────────────
// Admin API
// ─────────────────────────────────────────
const AdminAPI = {
  async getUsers(search = '', page = 1) {
    return apiFetch(`/api/users?search=${encodeURIComponent(search)}&page=${page}`);
  },

  async getStats() {
    return apiFetch('/api/users/stats');
  },

  async blockUser(id) {
    return apiFetch(`/api/users/${id}/block`, { method: 'PUT' });
  },

  async deleteUser(id) {
    return apiFetch(`/api/users/${id}`, { method: 'DELETE' });
  }
};

// ─────────────────────────────────────────
// Navbar: auto-populate user area on all pages
// ─────────────────────────────────────────
function initNavUserArea() {
  const area = document.getElementById('navUserArea');
  if (!area) return;

  const user = AuthAPI.getUser();
  if (user) {
    area.innerHTML = `
      <a href="profile.html" style="display:flex;align-items:center;gap:8px;font-size:0.85rem;color:var(--text-secondary);font-weight:600;">
        <img src="${user.avatar || ''}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex';"
          style="width:28px;height:28px;border-radius:50%;object-fit:cover;">
        <span style="display:none;width:28px;height:28px;border-radius:50%;background:var(--gradient-brand);align-items:center;justify-content:center;font-size:0.75rem;font-weight:800;color:#fff;">${user.name?.[0] || '?'}</span>
        ${user.name.split(' ')[0]}
      </a>
      <button onclick="AuthAPI.logout()" class="btn btn-outline btn-sm">Logout</button>
    `;
  } else {
    area.innerHTML = `
      <a href="login.html" class="btn btn-secondary btn-sm">Login</a>
      <a href="signup.html" class="btn btn-primary btn-sm">Sign Up</a>
    `;
  }
}

// Auto-init navbar on every page that loads this script
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initNavUserArea);
} else {
  initNavUserArea();
}
