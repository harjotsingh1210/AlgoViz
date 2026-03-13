// ===== Theme Manager =====
const ThemeManager = {
  init() {
    const saved = localStorage.getItem('algoviz-theme') || 'dark';
    this.apply(saved);
    document.querySelectorAll('.theme-toggle').forEach(btn => {
      btn.addEventListener('click', () => this.toggle());
    });
  },
  apply(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('algoviz-theme', theme);
    document.querySelectorAll('.theme-toggle').forEach(btn => {
      btn.innerHTML = theme === 'dark' ? '☀️' : '🌙';
      btn.setAttribute('title', theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode');
    });
  },
  toggle() {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    this.apply(current === 'dark' ? 'light' : 'dark');
  },
  get current() {
    return document.documentElement.getAttribute('data-theme') || 'dark';
  }
};

// ===== Mobile Nav =====
const MobileNav = {
  init() {
    const toggle = document.getElementById('navToggle');
    const menu = document.getElementById('mobileMenu');
    if (toggle && menu) {
      toggle.addEventListener('click', () => {
        menu.classList.toggle('open');
        toggle.innerHTML = menu.classList.contains('open') ? '✕' : '☰';
      });
      document.addEventListener('click', e => {
        if (!toggle.contains(e.target) && !menu.contains(e.target)) {
          menu.classList.remove('open');
          toggle.innerHTML = '☰';
        }
      });
    }
    // Set active bottom nav item
    const path = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.bottom-nav-item').forEach(item => {
      if (item.getAttribute('href') === path) item.classList.add('active');
    });
    // Set active navbar link
    document.querySelectorAll('.navbar-links a').forEach(a => {
      if (a.getAttribute('href') === path) a.classList.add('active');
    });
  }
};

// ===== Toast Notifications =====
const Toast = {
  show(message, type = 'info', duration = 3000) {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }
    const icons = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' };
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<span>${icons[type] || icons.info}</span><span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.animation = 'slideInRight 0.3s ease reverse';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }
};

// ===== FAQ Accordion =====
const FAQ = {
  init() {
    document.querySelectorAll('.faq-question').forEach(q => {
      q.addEventListener('click', () => {
        const item = q.closest('.faq-item');
        const isOpen = item.classList.contains('open');
        document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
        if (!isOpen) item.classList.add('open');
      });
    });
  }
};

// ===== Scroll Animations =====
const ScrollAnim = {
  init() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(24px)';
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(el);
    });
  }
};

// Init on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  ThemeManager.init();
  MobileNav.init();
  FAQ.init();
  ScrollAnim.init();
});
