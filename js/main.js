// ============================================
// JATIN BRAND STUDIO - MAIN JS
// ============================================

const WA_NUMBER = '919256990806';

// ---- PRELOADER ----
window.addEventListener('load', () => {
  setTimeout(() => {
    const pre = document.getElementById('preloader');
    if (pre) { pre.classList.add('hide'); setTimeout(() => pre.remove(), 500); }
    initScrollAnimations();
    initCounters();
  }, 2400);
});

// ---- NAVBAR ----
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
    document.querySelector('.scroll-top')?.classList.toggle('visible', window.scrollY > 300);
  });
  // Active link
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(s => { if (window.scrollY >= s.offsetTop - 120) current = s.id; });
    navLinks.forEach(a => { a.classList.toggle('active', a.getAttribute('href') === '#' + current || a.getAttribute('href') === current + '.html'); });
  });
}

// ---- MOBILE MENU ----
const hamburger = document.querySelector('.hamburger');
const mobileMenu = document.querySelector('.mobile-menu');
const mobClose = document.querySelector('.mob-close');
if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => mobileMenu.classList.add('open'));
  mobClose?.addEventListener('click', () => mobileMenu.classList.remove('open'));
  mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mobileMenu.classList.remove('open')));
}

// ---- SCROLL TO TOP ----
document.querySelector('.scroll-top')?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// ---- SMOOTH SCROLL ----
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });
});

// ---- PARTICLES ----
function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  window.addEventListener('resize', () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; });

  const particles = Array.from({ length: 60 }, () => ({
    x: Math.random() * canvas.width, y: Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 0.5, vy: (Math.random() - 0.5) * 0.5,
    r: Math.random() * 2 + 1
  }));

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p, i) => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,102,0,0.6)'; ctx.fill();
      particles.slice(i + 1).forEach(p2 => {
        const d = Math.hypot(p.x - p2.x, p.y - p2.y);
        if (d < 120) {
          ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(255,102,0,${0.15 * (1 - d / 120)})`; ctx.lineWidth = 0.5; ctx.stroke();
        }
      });
    });
    requestAnimationFrame(draw);
  }
  draw();
}
initParticles();

// ---- TYPING EFFECT ----
function typeEffect(el, text, speed = 80) {
  if (!el) return;
  el.textContent = '';
  let i = 0;
  const t = setInterval(() => { el.textContent += text[i]; i++; if (i >= text.length) clearInterval(t); }, speed);
}

// ---- SCROLL ANIMATIONS ----
function initScrollAnimations() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('visible'), (e.target.dataset.delay || 0) * 100);
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.fade-up, .fade-left, .fade-right, .ab-check').forEach((el, i) => {
    el.dataset.delay = el.dataset.delay || (i % 6);
    obs.observe(el);
  });

  // Stagger children
  document.querySelectorAll('.srv-grid, .why-grid, .port-grid, .stats-grid, .price-grid, .pricing-grid, .blog-grid').forEach(grid => {
    Array.from(grid.children).forEach((child, i) => {
      child.classList.add('fade-up');
      child.dataset.delay = i;
      obs.observe(child);
    });
  });
}

// ---- COUNTERS ----
function initCounters() {
  const counters = document.querySelectorAll('.stat-num, [data-count]');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const el = e.target;
        const target = parseInt(el.dataset.count || el.textContent);
        const suffix = el.textContent.replace(/[0-9]/g, '');
        let count = 0;
        const step = target / 60;
        const t = setInterval(() => {
          count = Math.min(count + step, target);
          el.textContent = Math.floor(count) + suffix;
          if (count >= target) clearInterval(t);
        }, 30);
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => obs.observe(c));
}

// ---- TESTIMONIAL SLIDER ----
function initSlider() {
  const track = document.querySelector('.t-track');
  if (!track) return;
  const cards = track.querySelectorAll('.t-card');
  const dots = document.querySelectorAll('.t-dot');
  let current = 0;
  let autoPlay;

  function goTo(n) {
    current = (n + cards.length) % cards.length;
    const perSlide = window.innerWidth < 768 ? 1 : 3;
    const cardW = track.parentElement.offsetWidth / perSlide + 24;
    track.style.transform = `translateX(-${current * cardW}px)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  }

  document.querySelector('.t-prev')?.addEventListener('click', () => { goTo(current - 1); resetAuto(); });
  document.querySelector('.t-next')?.addEventListener('click', () => { goTo(current + 1); resetAuto(); });
  dots.forEach((d, i) => d.addEventListener('click', () => { goTo(i); resetAuto(); }));
  track.addEventListener('mouseenter', () => clearInterval(autoPlay));
  track.addEventListener('mouseleave', () => startAuto());

  function startAuto() { autoPlay = setInterval(() => goTo(current + 1), 4000); }
  function resetAuto() { clearInterval(autoPlay); startAuto(); }
  startAuto();
}
initSlider();

// ---- FAQ ----
document.querySelectorAll('.faq-q').forEach(q => {
  q.addEventListener('click', () => {
    const item = q.parentElement;
    document.querySelectorAll('.faq-item.open').forEach(o => { if (o !== item) o.classList.remove('open'); });
    item.classList.toggle('open');
  });
});

// ---- PORTFOLIO FILTER ----
const filterBtns = document.querySelectorAll('[data-filter]');
const portItems = document.querySelectorAll('[data-cat]');
if (filterBtns.length) {
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      portItems.forEach(item => {
        const show = filter === 'all' || item.dataset.cat === filter;
        item.style.display = show ? '' : 'none';
        item.style.animation = show ? 'fade-up .4s ease forwards' : '';
      });
    });
  });
}

// ---- WHATSAPP FORM SUBMIT ----
// This sends form data to WhatsApp AND saves to Firebase (admin panel)
window.submitToWhatsApp = function(e) {
  e.preventDefault();
  const form = e.target;
  const data = Object.fromEntries(new FormData(form));
  if (!data.name || !data.service || !data.message) {
    alert('Please fill all required fields!'); return;
  }

  // Build WhatsApp message
  const msg = `🔔 *NEW INQUIRY - Jatin Brand Studio*
━━━━━━━━━━━━━━━━━━━━
👤 *Name:* ${data.name}
📧 *Email:* ${data.email || 'Not provided'}
📱 *Phone:* ${data.phone || 'Not provided'}
🎨 *Service:* ${data.service}
💰 *Budget:* ${data.budget || 'Not specified'}
💬 *Message:* ${data.message}
⏰ *Time:* ${new Date().toLocaleString('en-IN')}
━━━━━━━━━━━━━━━━━━━━
From: jatinbrandstudio.com`;

  // Save to Firebase (if configured)
  saveOrderToFirebase(data);

  // Open WhatsApp
  window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');

  // Redirect to thank you
  setTimeout(() => window.location.href = 'thank-you.html', 500);
};

// ---- SAVE ORDER TO FIREBASE ----
async function saveOrderToFirebase(data) {
  // Firebase config will be added here
  // For now just log
  console.log('Order data:', data);
  // When Firebase is configured:
  // import { db } from './firebase.js';
  // await addDoc(collection(db, 'orders'), { ...data, timestamp: new Date(), status: 'new' });
}

// ---- ORDER NOW BUTTONS (Pricing/Services) ----
window.orderPlan = function(planName) {
  const msg = `🎨 *ORDER REQUEST - Jatin Brand Studio*
━━━━━━━━━━━━━━━━━━━━
📦 *Plan:* ${planName}
⏰ *Time:* ${new Date().toLocaleString('en-IN')}
━━━━━━━━━━━━━━━━━━━━
Hi Jatin! I'm interested in the *${planName}* plan. Please share more details.`;

  window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
};

window.orderService = function(serviceName) {
  const msg = `🎨 *SERVICE INQUIRY - Jatin Brand Studio*
━━━━━━━━━━━━━━━━━━━━
🎯 *Service:* ${serviceName}
⏰ *Time:* ${new Date().toLocaleString('en-IN')}
━━━━━━━━━━━━━━━━━━━━
Hi Jatin! I need help with *${serviceName}*. Can you share more details?`;

  window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
};
