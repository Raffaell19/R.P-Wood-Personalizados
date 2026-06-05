/* ============================================
   R.P WOOD PERSONALIZADOS — Main JavaScript
   ============================================ */

import { initPage, initCounters } from './js/shared.js';

// ===== INTRO ANIMATION =====
function initIntro() {
  const overlay = document.getElementById('intro-overlay');
  const canvas = document.getElementById('intro-canvas');
  if (!overlay || !canvas) return;

  const ctx = canvas.getContext('2d');
  const skipBtn = document.getElementById('skip-intro');

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // Wood shaving particles for intro
  const particles = [];
  const particleCount = 60;

  class IntroParticle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = canvas.width / 2 + (Math.random() - 0.5) * 200;
      this.y = canvas.height / 2 + (Math.random() - 0.5) * 100;
      this.size = Math.random() * 3 + 1;
      this.speedX = (Math.random() - 0.5) * 4;
      this.speedY = (Math.random() - 0.5) * 3 - 1;
      this.life = 1;
      this.decay = Math.random() * 0.015 + 0.005;
      this.color = Math.random() > 0.5 ? '#C68A3A' : '#B77A3C';
      this.rotation = Math.random() * Math.PI * 2;
      this.rotSpeed = (Math.random() - 0.5) * 0.1;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.speedY += 0.02; // gravity
      this.life -= this.decay;
      this.rotation += this.rotSpeed;
      if (this.life <= 0) this.reset();
    }
    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.globalAlpha = this.life;
      ctx.fillStyle = this.color;
      ctx.fillRect(-this.size / 2, -this.size, this.size, this.size * 2);
      ctx.restore();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new IntroParticle());
  }

  // CNC spark effect at center
  function drawSpark() {
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const sparkCount = 8;
    for (let i = 0; i < sparkCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const length = Math.random() * 30 + 10;
      const x2 = cx + Math.cos(angle) * length;
      const y2 = cy + Math.sin(angle) * length;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = `rgba(198, 138, 58, ${Math.random() * 0.6 + 0.2})`;
      ctx.lineWidth = Math.random() * 1.5;
      ctx.stroke();
    }
    // Glow at center
    const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, 40);
    gradient.addColorStop(0, 'rgba(242, 111, 34, 0.3)');
    gradient.addColorStop(1, 'rgba(198, 138, 58, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(cx - 40, cy - 40, 80, 80);
  }

  let animFrame;
  function animateIntro() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawSpark();
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    animFrame = requestAnimationFrame(animateIntro);
  }

  animateIntro();

  function dismissIntro() {
    overlay.classList.add('fade-out');
    cancelAnimationFrame(animFrame);
    document.body.style.overflow = '';
    setTimeout(() => {
      overlay.style.display = 'none';
    }, 800);
  }

  // Auto-dismiss after 3.5 seconds
  const autoTimer = setTimeout(dismissIntro, 3500);

  if (skipBtn) {
    skipBtn.addEventListener('click', () => {
      clearTimeout(autoTimer);
      dismissIntro();
    });
  }

  // Prevent scroll during intro
  document.body.style.overflow = 'hidden';

  // Resize handler
  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
}

// ===== HERO PARTICLES =====
function initHeroParticles() {
  const container = document.getElementById('hero-particles');
  if (!container) return;
  const particleCount = 30;

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.style.cssText = `
      position: absolute;
      width: ${Math.random() * 4 + 1}px;
      height: ${Math.random() * 4 + 1}px;
      background: rgba(198, 138, 58, ${Math.random() * 0.4 + 0.1});
      border-radius: ${Math.random() > 0.5 ? '50%' : '1px'};
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      animation: floatParticle ${Math.random() * 8 + 6}s ease-in-out infinite;
      animation-delay: ${Math.random() * 5}s;
    `;
    container.appendChild(particle);
  }

  // Add keyframes dynamically
  if (!document.getElementById('float-particle-style')) {
    const style = document.createElement('style');
    style.id = 'float-particle-style';
    style.textContent = `
      @keyframes floatParticle {
        0%, 100% { transform: translate(0, 0) rotate(0deg); opacity: 0; }
        10% { opacity: 1; }
        90% { opacity: 1; }
        50% { transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * -200 - 50}px) rotate(180deg); }
      }
    `;
    document.head.appendChild(style);
  }
}

// ===== SMOOTH SCROLL =====
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const offset = 80; // navbar height
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
}

// ===== PARALLAX EFFECT =====
function initParallax() {
  const hero = document.querySelector('.hero-bg img');
  if (!hero) return;
  
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    if (scrolled < window.innerHeight) {
      hero.style.transform = `translateY(${scrolled * 0.3}px) scale(1.05)`;
    }
  });
}

// ===== NAVBAR ACTIVE LINK HIGHLIGHT FOR ANCHORS =====
function initActiveLink() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.navbar-links a');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href.startsWith('#') || href.startsWith('/#')) {
        const anchor = href.split('#')[1];
        if (anchor === current) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      }
    });
  });
}

// ===== INITIALIZE ALL =====
document.addEventListener('DOMContentLoaded', () => {
  initPage();
  initIntro();
  initHeroParticles();
  initSmoothScroll();
  initParallax();
  initActiveLink();
  initCounters();
});
