/* Admin JBS — Custom "Install App" banner
   Shows a Lovish-Rental-Hub style install prompt when the browser
   fires beforeinstallprompt (Chrome/Edge/Android). */
(function () {
  var APP_NAME = 'Admin JBS';
  var APP_SUB  = 'Install Admin App';
  var APP_ICON = '/admin/assets/icons/icon-192.png';
  var DISMISS_KEY = 'admin-jbs-install-dismissed';
  var DISMISS_DAYS = 7;

  var deferredPrompt = null;

  function isStandalone() {
    return window.matchMedia('(display-mode: standalone)').matches ||
           window.navigator.standalone === true;
  }

  function isDismissed() {
    var t = localStorage.getItem(DISMISS_KEY);
    if (!t) return false;
    var days = (Date.now() - parseInt(t, 10)) / 86400000;
    return days < DISMISS_DAYS;
  }

  function hideBanner() {
    var el = document.getElementById('pwa-install-banner');
    if (!el) return;
    el.classList.remove('show');
    setTimeout(function () { el.remove(); }, 300);
  }

  function showBanner() {
    if (document.getElementById('pwa-install-banner')) return;

    var banner = document.createElement('div');
    banner.id = 'pwa-install-banner';
    banner.innerHTML =
      '<img class="pwa-banner-icon" src="' + APP_ICON + '" alt="' + APP_NAME + '">' +
      '<div class="pwa-banner-text">' +
        '<div class="pwa-banner-title">' + APP_NAME + '</div>' +
        '<div class="pwa-banner-sub">' + APP_SUB + '</div>' +
      '</div>' +
      '<button type="button" class="pwa-banner-install">Download</button>' +
      '<button type="button" class="pwa-banner-close" aria-label="Close">✕</button>';

    document.body.appendChild(banner);
    requestAnimationFrame(function () { banner.classList.add('show'); });

    banner.querySelector('.pwa-banner-install').addEventListener('click', function () {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.finally(function () { deferredPrompt = null; });
      }
      hideBanner();
    });

    banner.querySelector('.pwa-banner-close').addEventListener('click', function () {
      localStorage.setItem(DISMISS_KEY, Date.now().toString());
      hideBanner();
    });
  }

  window.addEventListener('beforeinstallprompt', function (e) {
    e.preventDefault();
    deferredPrompt = e;
    if (!isStandalone() && !isDismissed()) {
      showBanner();
    }
  });

  window.addEventListener('appinstalled', function () {
    hideBanner();
    localStorage.removeItem(DISMISS_KEY);
  });
})();
