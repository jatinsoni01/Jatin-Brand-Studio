// ============================================
// JATIN BRAND STUDIO — ADMIN PANEL JS
// ============================================

const WA = '919256990806';

// ===== AUTH CHECK =====
function checkAuth() {
  if (window.location.pathname.includes('index.html') || window.location.pathname.endsWith('admin/') || window.location.pathname.endsWith('admin')) return;
  const logged = sessionStorage.getItem('jbs_admin') || localStorage.getItem('jbs_admin');
  if (!logged) window.location.href = 'index.html';
}
checkAuth();

// ===== SIDEBAR TOGGLE =====
const sidebar = document.querySelector('.sidebar');
const hamMob = document.querySelector('.ham-mob');
const overlay = document.getElementById('sidebar-overlay');
if (hamMob) {
  hamMob.addEventListener('click', () => {
    sidebar?.classList.toggle('open');
    if (overlay) overlay.style.display = sidebar?.classList.contains('open') ? 'block' : 'none';
  });
}
if (overlay) overlay.addEventListener('click', () => { sidebar?.classList.remove('open'); overlay.style.display = 'none'; });

// ===== ACTIVE NAV =====
document.querySelectorAll('.nav-item[href]').forEach(item => {
  if (item.getAttribute('href') === window.location.pathname.split('/').pop()) item.classList.add('active');
});

// ===== LOGOUT =====
window.logout = function() {
  if (confirm('Logout karna chahte ho?')) {
    sessionStorage.removeItem('jbs_admin');
    localStorage.removeItem('jbs_admin');
    window.location.href = 'index.html';
  }
};

// ===== MODALS =====
window.openModal = function(id) { document.getElementById(id)?.classList.add('open'); };
window.closeModal = function(id) { document.getElementById(id)?.classList.remove('open'); };
document.querySelectorAll('.modal-overlay').forEach(m => {
  m.addEventListener('click', e => { if (e.target === m) m.classList.remove('open'); });
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') document.querySelectorAll('.modal-overlay.open').forEach(m => m.classList.remove('open'));
});

// ===== SETTINGS TABS =====
window.switchTab = function(tabId) {
  document.querySelectorAll('.settings-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.settings-panel').forEach(p => p.classList.remove('active'));
  document.querySelector(`[onclick="switchTab('${tabId}')"]`)?.classList.add('active');
  document.getElementById(tabId)?.classList.add('active');
};

// ===== FAQ ACCORDION =====
document.querySelectorAll('.faq-q').forEach(q => {
  q.addEventListener('click', () => {
    const item = q.parentElement;
    document.querySelectorAll('.faq-item.open').forEach(o => { if (o !== item) o.classList.remove('open'); });
    item.classList.toggle('open');
  });
});

// ===== STAR RATING =====
window.setRating = function(n) {
  document.querySelectorAll('.star-btn').forEach((s, i) => s.classList.toggle('active', i < n));
  document.getElementById('rating-val') && (document.getElementById('rating-val').value = n);
};

// ===== FILTER TABS =====
window.filterTable = function(status, tabEl) {
  document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
  tabEl.classList.add('active');
  const rows = document.querySelectorAll('tbody tr[data-status]');
  rows.forEach(r => r.style.display = (status === 'all' || r.dataset.status === status) ? '' : 'none');
};

// ===== SEARCH =====
window.searchTable = function(val) {
  const rows = document.querySelectorAll('tbody tr');
  rows.forEach(r => r.style.display = r.textContent.toLowerCase().includes(val.toLowerCase()) ? '' : 'none');
};

// ===== STATUS CHANGE =====
window.changeStatus = function(id, newStatus) {
  const row = document.querySelector(`tr[data-id="${id}"]`);
  if (!row) return;
  const badge = row.querySelector('.badge');
  if (badge) {
    badge.className = 'badge';
    const map = { new: 'badge-new', 'in-progress': 'badge-wip', completed: 'badge-done', cancelled: 'badge-cancel' };
    badge.classList.add(map[newStatus] || 'badge-new');
    badge.textContent = { new: '🔵 New', 'in-progress': '🟡 In Progress', completed: '🟢 Done', cancelled: '🔴 Cancelled' }[newStatus] || newStatus;
  }
  row.dataset.status = newStatus;
  // Update in Firebase when configured
  showToast('Status updated! ✅');
};

// ===== WHATSAPP CLIENT =====
window.waClient = function(phone, name, service) {
  const msg = `Hi ${name}! I'm Jatin from Jatin Brand Studio. Regarding your ${service} inquiry — `;
  window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
};

// ===== DELETE CONFIRM =====
window.confirmDelete = function(type, id) {
  if (confirm(`Are you sure you want to delete this ${type}? This cannot be undone.`)) {
    document.querySelector(`[data-id="${id}"]`)?.remove();
    showToast(`${type} deleted! 🗑️`);
    // Firebase delete when configured
  }
};

// ===== TOAST NOTIFICATIONS =====
window.showToast = function(msg, type = 'success') {
  const t = document.createElement('div');
  t.style.cssText = `position:fixed;bottom:24px;right:24px;background:${type === 'success' ? '#22c55e' : '#ef4444'};color:#fff;padding:14px 24px;font-family:'Barlow Condensed',sans-serif;font-size:.9rem;font-weight:700;letter-spacing:1.5px;z-index:9999;animation:slide-in .3s ease;clip-path:polygon(8px 0%,100% 0%,calc(100% - 8px) 100%,0% 100%)`;
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 3000);
};

// ===== IMAGE PREVIEW =====
window.previewImage = function(input, previewId) {
  const file = input.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    const prev = document.getElementById(previewId);
    if (prev) { prev.src = e.target.result; prev.style.display = 'block'; }
  };
  reader.readAsDataURL(file);
};

// ===== UPLOAD ZONE DRAG =====
document.querySelectorAll('.upload-zone').forEach(zone => {
  zone.addEventListener('dragover', e => { e.preventDefault(); zone.style.borderColor = 'var(--orange)'; });
  zone.addEventListener('dragleave', () => zone.style.borderColor = '');
  zone.addEventListener('drop', e => { e.preventDefault(); zone.style.borderColor = ''; showToast('File uploaded! ✅'); });
  zone.addEventListener('click', () => zone.querySelector('input[type="file"]')?.click());
});

// ===== MESSAGES =====
window.selectMessage = function(el, id) {
  document.querySelectorAll('.msg-item').forEach(m => m.classList.remove('active'));
  el.classList.add('active');
  el.classList.remove('unread');
  const detail = document.getElementById('msg-detail-content');
  if (detail) detail.style.display = 'block';
  document.getElementById('msg-empty')?.style && (document.getElementById('msg-empty').style.display = 'none');
};

// ===== COUNTDOWN TIMER (Dashboard) =====
function updateClock() {
  const el = document.getElementById('live-time');
  if (el) el.textContent = new Date().toLocaleTimeString('en-IN');
}
setInterval(updateClock, 1000);
updateClock();

// ===== PORTFOLIO FILTER (Admin) =====
window.filterPortfolio = function(cat, btn) {
  document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.port-admin-card').forEach(c => {
    c.style.display = (cat === 'all' || c.dataset.cat === cat) ? '' : 'none';
  });
};

// ===== FORM SAVE =====
window.saveForm = function(formId, collection) {
  const form = document.getElementById(formId);
  if (!form) return;
  if (!form.checkValidity()) { form.reportValidity(); return; }
  showToast(`${collection} saved successfully! ✅`);
  // Firebase save when configured
};

// ===== BLOG EDITOR TOOLBAR =====
window.execEdit = function(cmd, val) {
  document.getElementById('blog-editor')?.focus();
  document.execCommand(cmd, false, val || null);
};

// ===== ADD FEATURE (Pricing/Services) =====
window.addFeature = function(listId) {
  const input = document.getElementById('new-feature-' + listId);
  if (!input?.value.trim()) return;
  const li = document.createElement('li');
  li.style.cssText = 'display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid rgba(255,255,255,.04);font-size:.88rem;color:var(--gray-light)';
  li.innerHTML = `<span style="color:var(--orange)">✓</span> ${input.value} <button onclick="this.parentElement.remove()" style="margin-left:auto;background:none;border:none;color:var(--gray);cursor:pointer;font-size:1rem">✕</button>`;
  document.getElementById(listId)?.appendChild(li);
  input.value = '';
};

// ===== SIDEBAR OVERLAY =====
const sidebarStyle = document.createElement('style');
sidebarStyle.textContent = `
#sidebar-overlay{display:none;position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:199}
@keyframes slide-in{from{transform:translateY(20px);opacity:0}to{transform:translateY(0);opacity:1}}
`;
document.head.appendChild(sidebarStyle);
const sov = document.createElement('div');
sov.id = 'sidebar-overlay';
document.body.appendChild(sov);

// ============================================
// FIREBASE CONFIG — LIVE (Admin Panel)
// ============================================
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyAFVqoM9SDu_YkjWLo6O1MBM0pIv-GTrp0",
  authDomain: "jatinbrandstudio-fecc8.firebaseapp.com",
  projectId: "jatinbrandstudio-fecc8",
  storageBucket: "jatinbrandstudio-fecc8.firebasestorage.app",
  messagingSenderId: "895387928657",
  appId: "1:895387928657:web:9454f887b2e2259c379070"
};

const CLOUDINARY_CONFIG = {
  cloudName: "dxi4bsikl",
  apiKey: "844265352226548",
  uploadPreset: "JBS_default"
};

// CallMeBot WhatsApp — add your API key in Settings > Notifications
window.CALLMEBOT_KEY = localStorage.getItem('jbs_callmebot_key') || '';

// Save CallMeBot key
window.saveCallmebotKey = function(key) {
  localStorage.setItem('jbs_callmebot_key', key);
  window.CALLMEBOT_KEY = key;
  showToast('WhatsApp key saved! ✅');
};
