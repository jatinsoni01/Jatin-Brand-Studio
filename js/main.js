// ============================================
// JATIN BRAND STUDIO — MAIN JS
// WhatsApp + Firebase — EK BUTTON SE DONO
// ============================================

import { saveOrder, saveMessage, getReviews, getPortfolio, WA } from './firebase.js';

// ============================================
// PRELOADER
// ============================================
window.addEventListener('load', () => {
  setTimeout(() => {
    const pre = document.getElementById('preloader');
    if (pre) { pre.classList.add('hide'); setTimeout(() => pre.remove(), 500); }
    initScrollAnimations();
    initCounters();
    loadDynamicContent();
  }, 2400);
});

// ============================================
// NAVBAR
// ============================================
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
    document.querySelector('.scroll-top')?.classList.toggle('visible', window.scrollY > 300);
  });
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(s => { if (window.scrollY >= s.offsetTop - 120) current = s.id; });
    navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + current || a.getAttribute('href') === current + '.html'));
  });
}

// Mobile menu
const hamburger = document.querySelector('.hamburger');
const mobileMenu = document.querySelector('.mobile-menu');
const mobClose = document.querySelector('.mob-close');
if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => mobileMenu.classList.add('open'));
  mobClose?.addEventListener('click', () => mobileMenu.classList.remove('open'));
  mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mobileMenu.classList.remove('open')));
}

// Scroll to top
document.querySelector('.scroll-top')?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
  });
});

// ============================================
// PARTICLES
// ============================================
function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
  resize(); window.addEventListener('resize', resize);
  const pts = Array.from({ length: 60 }, () => ({
    x: Math.random() * canvas.width, y: Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 0.5, vy: (Math.random() - 0.5) * 0.5,
    r: Math.random() * 2 + 1
  }));
  (function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pts.forEach((p, i) => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,102,0,0.6)'; ctx.fill();
      pts.slice(i + 1).forEach(p2 => {
        const d = Math.hypot(p.x - p2.x, p.y - p2.y);
        if (d < 120) {
          ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(255,102,0,${0.15 * (1 - d / 120)})`; ctx.lineWidth = 0.5; ctx.stroke();
        }
      });
    });
    requestAnimationFrame(draw);
  })();
}
initParticles();

// ============================================
// TYPING EFFECT
// ============================================
const typedEl = document.getElementById('typed-text');
if (typedEl) {
  const words = ['Jatin', 'Design', 'Creative', 'Brand'];
  let wi = 0, ci = 0, del = false;
  (function type() {
    if (!del) { typedEl.textContent = words[wi].slice(0, ++ci); if (ci === words[wi].length) { del = true; setTimeout(type, 1500); return; } }
    else { typedEl.textContent = words[wi].slice(0, --ci); if (ci === 0) { del = false; wi = (wi + 1) % words.length; } }
    setTimeout(type, del ? 60 : 120);
  })();
}

// ============================================
// SCROLL ANIMATIONS
// ============================================
function initScrollAnimations() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('visible'), (parseInt(e.target.dataset.delay) || 0) * 100);
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.fade-up,.fade-left,.fade-right,.ab-check').forEach((el, i) => {
    if (!el.dataset.delay) el.dataset.delay = i % 6;
    obs.observe(el);
  });
  document.querySelectorAll('.srv-grid,.why-grid,.port-grid,.stats-grid,.price-grid,.pricing-grid,.blog-grid').forEach(grid => {
    Array.from(grid.children).forEach((child, i) => { child.classList.add('fade-up'); child.dataset.delay = i; obs.observe(child); });
  });
}

// ============================================
// COUNTERS
// ============================================
function initCounters() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const el = e.target;
        const target = parseInt(el.dataset.count || el.textContent);
        const suffix = el.textContent.replace(/[0-9]/g, '');
        let count = 0; const step = target / 60;
        const t = setInterval(() => { count = Math.min(count + step, target); el.textContent = Math.floor(count) + suffix; if (count >= target) clearInterval(t); }, 30);
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('.stat-num,[data-count]').forEach(c => obs.observe(c));
}

// ============================================
// TESTIMONIALS SLIDER
// ============================================
function initSlider() {
  const track = document.querySelector('.t-track');
  if (!track) return;
  const dots = document.querySelectorAll('.t-dot');
  let current = 0, autoPlay;
  function goTo(n) {
    const cards = track.querySelectorAll('.t-card');
    if (!cards.length) return;
    current = (n + cards.length) % cards.length;
    const perSlide = window.innerWidth < 768 ? 1 : 3;
    const cardW = (track.parentElement.offsetWidth / perSlide) + 24;
    track.style.transform = `translateX(-${current * cardW}px)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  }
  document.querySelector('.t-prev')?.addEventListener('click', () => { goTo(current - 1); reset(); });
  document.querySelector('.t-next')?.addEventListener('click', () => { goTo(current + 1); reset(); });
  dots.forEach((d, i) => d.addEventListener('click', () => { goTo(i); reset(); }));
  track.addEventListener('mouseenter', () => clearInterval(autoPlay));
  track.addEventListener('mouseleave', () => start());
  function start() { autoPlay = setInterval(() => goTo(current + 1), 4000); }
  function reset() { clearInterval(autoPlay); start(); }
  start();
}
initSlider();

// ============================================
// FAQ
// ============================================
document.querySelectorAll('.faq-q').forEach(q => {
  q.addEventListener('click', () => {
    const item = q.parentElement;
    document.querySelectorAll('.faq-item.open').forEach(o => { if (o !== item) o.classList.remove('open'); });
    item.classList.toggle('open');
  });
});

// ============================================
// PORTFOLIO FILTER
// ============================================
document.querySelectorAll('[data-filter]').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('[data-filter]').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const f = btn.dataset.filter;
    document.querySelectorAll('[data-cat]').forEach(item => {
      item.style.display = (f === 'all' || item.dataset.cat === f) ? '' : 'none';
    });
  });
});

// ============================================
// LOAD FROM FIREBASE (Reviews + Portfolio)
// ============================================
async function loadDynamicContent() {
  // Load Reviews
  try {
    const reviews = await getReviews();
    const track = document.querySelector('.t-track');
    if (reviews.length > 0 && track) {
      track.innerHTML = reviews.map(r => `
        <div class="t-card">
          <div class="q-mark">"</div>
          <div class="stars">${'★'.repeat(r.rating || 5)}</div>
          <p class="rev-txt">"${r.text || ''}"</p>
          <div class="reviewer">
            <div class="rev-av">👤</div>
            <div><div class="rev-name">${r.name || ''}</div><div class="rev-ttl">${r.role || ''}</div></div>
          </div>
        </div>`).join('');
      initSlider();
    }
  } catch(e) {}

  // Load Portfolio
  try {
    const items = await getPortfolio();
    const grid = document.querySelector('.port-grid');
    if (items.length > 0 && grid) {
      const catIcons = { website:'🌐', logo:'🎨', banner:'🖼️', social:'📱', print:'🖨️' };
      grid.innerHTML = items.filter(i => i.featured).slice(0, 6).map(item => `
        <div class="port-item fade-up" data-cat="${item.category || ''}">
          ${item.imageUrl
            ? `<img src="${item.imageUrl}" alt="${item.title}" style="width:100%;height:100%;object-fit:cover">`
            : `<div class="port-ph">${catIcons[item.category] || '🎨'}<small>${item.category || 'Design'}</small></div>`}
          <div class="port-ov">
            <div class="port-title">${item.title || ''}</div>
            <div class="port-cat">${item.category || ''}</div>
          </div>
        </div>`).join('');
      initScrollAnimations();
    }
  } catch(e) {}
}

// ============================================
// MAIN FORM SUBMIT
// EK BUTTON = FIREBASE SAVE + WHATSAPP OPEN
// ============================================
window.submitToWhatsApp = async function(e) {
  e.preventDefault();
  const form = e.target;
  const btn = form.querySelector('button[type="submit"]');
  const data = Object.fromEntries(new FormData(form));

  // Validation
  if (!data.name?.trim() || !data.service || !data.message?.trim()) {
    showError('Please fill all required fields! ⚠️'); return;
  }

  // Button loading
  const originalText = btn.textContent;
  btn.textContent = '⏳ Saving...';
  btn.disabled = true;

  // ============================================
  // STEP 1: FIREBASE SAVE (background mein)
  // ============================================
  try {
    await saveOrder(data);   // → admin orders mein
    await saveMessage(data); // → admin messages mein
  } catch(err) {
    console.log('Firebase save error:', err);
    // Firebase fail ho toh bhi WhatsApp open karo
  }

  // ============================================
  // STEP 2: WHATSAPP OPEN
  // ============================================
  const waMsg =
`🔔 *NEW INQUIRY — Jatin Brand Studio*
━━━━━━━━━━━━━━━━━━━━
👤 *Name:* ${data.name}
📱 *Phone:* ${data.phone || 'Not provided'}
📧 *Email:* ${data.email || 'Not provided'}
🎨 *Service:* ${data.service}
💰 *Budget:* ${data.budget || 'Not specified'}
💬 *Message:* ${data.message}
⏰ *Time:* ${new Date().toLocaleString('en-IN')}
━━━━━━━━━━━━━━━━━━━━`;

  window.open(`https://wa.me/${WA}?text=${encodeURIComponent(waMsg)}`, '_blank');

  // ============================================
  // STEP 3: REDIRECT TO THANK YOU
  // ============================================
  setTimeout(() => { window.location.href = 'thank-you.html'; }, 600);
};

// ============================================
// ORDER NOW — PRICING BUTTON
// EK CLICK = FIREBASE + WHATSAPP
// ============================================
window.orderPlan = async function(planName) {
  // Firebase save
  try {
    await saveOrder({
      name: 'Website Visitor',
      service: planName,
      message: `Interested in ${planName}`,
      source: 'pricing',
      status: 'new'
    });
  } catch(e) {}

  // WhatsApp open
  const msg =
`🎨 *ORDER — Jatin Brand Studio*
━━━━━━━━━━━━━━━━━━━━
📦 *Plan:* ${planName}
⏰ *Time:* ${new Date().toLocaleString('en-IN')}
━━━━━━━━━━━━━━━━━━━━
Hi Jatin! I want to order *${planName}*. Please share details.`;

  window.open(`https://wa.me/${WA}?text=${encodeURIComponent(msg)}`, '_blank');
};

// ============================================
// ORDER NOW — SERVICE BUTTON
// EK CLICK = FIREBASE + WHATSAPP
// ============================================
window.orderService = async function(serviceName) {
  // Firebase save
  try {
    await saveOrder({
      name: 'Website Visitor',
      service: serviceName,
      message: `Interested in ${serviceName}`,
      source: 'services',
      status: 'new'
    });
  } catch(e) {}

  // WhatsApp open
  const msg =
`🎨 *SERVICE INQUIRY — Jatin Brand Studio*
━━━━━━━━━━━━━━━━━━━━
🎯 *Service:* ${serviceName}
⏰ *Time:* ${new Date().toLocaleString('en-IN')}
━━━━━━━━━━━━━━━━━━━━
Hi Jatin! I need *${serviceName}*. Please tell me more.`;

  window.open(`https://wa.me/${WA}?text=${encodeURIComponent(msg)}`, '_blank');
};

// ============================================
// ERROR MESSAGE
// ============================================
function showError(msg) {
  let el = document.querySelector('.form-error-msg');
  if (!el) {
    el = document.createElement('div');
    el.className = 'form-error-msg';
    el.style.cssText = 'color:#fca5a5;font-family:"Barlow Condensed",sans-serif;font-size:.9rem;letter-spacing:1px;padding:10px 0;text-align:center';
    document.querySelector('.con-form')?.prepend(el);
  }
  el.textContent = msg;
  setTimeout(() => el.remove(), 3000);
}
