// ============================================
// ADMIN AUTH — PIN BASED
// JATIN BRAND STUDIO
// ============================================

// Check if logged in on every admin page
function checkAuth() {
  const page = window.location.pathname.split('/').pop();
  if (page === 'index.html' || page === '' || page === 'admin') return;
  const logged = sessionStorage.getItem('jbs_admin') || localStorage.getItem('jbs_admin');
  if (!logged) window.location.href = 'index.html';
}
checkAuth();

// Logout function
window.logout = function() {
  if (confirm('Logout karna chahte ho?')) {
    sessionStorage.removeItem('jbs_admin');
    localStorage.removeItem('jbs_admin');
    window.location.href = 'index.html';
  }
};

// Change PIN function (call from settings)
window.changePin = function(oldPin, newPin, confirmPin) {
  const CURRENT_PIN = localStorage.getItem('jbs_custom_pin') || '260326';
  if (oldPin !== CURRENT_PIN) { alert('Current PIN is wrong!'); return false; }
  if (newPin !== confirmPin) { alert('New PINs do not match!'); return false; }
  if (newPin.length !== 6 || !/^\d+$/.test(newPin)) { alert('PIN must be exactly 6 digits!'); return false; }
  localStorage.setItem('jbs_custom_pin', newPin);
  alert('PIN changed successfully! ✅');
  return true;
};