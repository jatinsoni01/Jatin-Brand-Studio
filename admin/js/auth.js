// ============================================
// ADMIN AUTH — JATIN BRAND STUDIO
// ============================================

// CREDENTIALS (Change these!)
const ADMIN_EMAIL = 'admin@jatinbrandstudio.com';
const ADMIN_PASS = 'JBS@2026';
let failCount = 0;

document.getElementById('login-form')?.addEventListener('submit', function(e) {
  e.preventDefault();
  const email = document.getElementById('email').value.trim();
  const pass = document.getElementById('password').value;
  const remember = document.getElementById('remember')?.checked;
  const errEl = document.getElementById('login-error');
  const btn = document.getElementById('login-btn');

  // Check lockout
  const lockUntil = localStorage.getItem('jbs_lock');
  if (lockUntil && Date.now() < parseInt(lockUntil)) {
    const mins = Math.ceil((parseInt(lockUntil) - Date.now()) / 60000);
    showError(`Too many attempts. Try again in ${mins} minute(s).`); return;
  }

  btn.textContent = 'Logging in...';
  btn.disabled = true;

  setTimeout(() => {
    if (email === ADMIN_EMAIL && pass === ADMIN_PASS) {
      failCount = 0;
      localStorage.removeItem('jbs_lock');
      if (remember) localStorage.setItem('jbs_admin', 'true');
      else sessionStorage.setItem('jbs_admin', 'true');
      window.location.href = 'dashboard.html';
    } else {
      failCount++;
      if (failCount >= 3) {
        localStorage.setItem('jbs_lock', Date.now() + 5 * 60 * 1000);
        showError('3 wrong attempts! Locked for 5 minutes.');
      } else {
        showError(`Wrong email or password. (${3 - failCount} attempts left)`);
      }
      btn.textContent = 'Login to Admin';
      btn.disabled = false;
    }
  }, 800);

  function showError(msg) {
    if (errEl) { errEl.textContent = msg; errEl.classList.add('show'); }
    btn.textContent = 'Login to Admin';
    btn.disabled = false;
  }
});
