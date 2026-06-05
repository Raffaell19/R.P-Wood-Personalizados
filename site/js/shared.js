/* ============================================
   R.P WOOD — Shared Utilities
   ============================================ */

import { renderNavbar, renderFooter, renderWhatsAppFAB } from './components.js';
import { updateCartBadge } from './cart.js';

// Initialize all shared components
export function initPage() {
  renderNavbar();
  renderFooter();
  renderWhatsAppFAB();
  initNavbar();
  initScrollReveal();
  initWhatsAppFloat();
  initCustomCursor();
  updateCartBadge();
}

// ===== NAVBAR =====
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const mobileBtn = document.getElementById('mobile-menu-btn');
  const navLinks = document.getElementById('navbar-links');

  if (!navbar || !mobileBtn || !navLinks) return;

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  });

  mobileBtn.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    mobileBtn.classList.toggle('active');
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileBtn.classList.remove('active');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

// ===== SCROLL REVEAL =====
export function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.getAttribute('data-delay') || 0;
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, parseInt(delay));
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  reveals.forEach(el => observer.observe(el));
}

// ===== CUSTOM CURSOR =====
function initCustomCursor() {
  if (window.innerWidth < 768 || 'ontouchstart' in window) return;

  const dot = document.createElement('div');
  dot.className = 'cursor-dot';
  const ring = document.createElement('div');
  ring.className = 'cursor-ring';
  document.body.appendChild(dot);
  document.body.appendChild(ring);

  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX - 4 + 'px';
    dot.style.top = mouseY - 4 + 'px';
  });

  function animateCursor() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    ring.style.left = ringX - 18 + 'px';
    ring.style.top = ringY - 18 + 'px';
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  const interactives = document.querySelectorAll('a, button, .service-card, .product-card, .gallery-item');
  interactives.forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hover'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
  });

  document.body.style.cursor = 'none';
  interactives.forEach(el => el.style.cursor = 'none');
}

// ===== WHATSAPP FLOAT =====
function initWhatsAppFloat() {
  const fab = document.getElementById('whatsapp-float');
  if (!fab) return;

  fab.style.opacity = '0';
  fab.style.transform = 'scale(0.5)';

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      fab.style.opacity = '1';
      fab.style.transform = 'scale(1)';
    } else {
      fab.style.opacity = '0';
      fab.style.transform = 'scale(0.5)';
    }
  });
}

// ===== COUNTER ANIMATION =====
export function initCounters() {
  const counters = document.querySelectorAll('.stat-number');
  const speed = 80;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const target = +counter.getAttribute('data-target');
        const increment = target / speed;
        let current = 0;

        const updateCounter = () => {
          current += increment;
          if (current < target) {
            counter.textContent = Math.ceil(current);
            requestAnimationFrame(updateCounter);
          } else {
            counter.textContent = target;
          }
        };
        updateCounter();
        observer.unobserve(counter);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => observer.observe(counter));
}
