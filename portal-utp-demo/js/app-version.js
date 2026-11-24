const UTP_APP_VERSION = '2026-07-22.4';

(function syncAppVersion() {
  try {
    const current = localStorage.getItem('utp_app_version');
    if (current === UTP_APP_VERSION) return;

    localStorage.setItem('utp_app_version', UTP_APP_VERSION);
  } catch(e) {}
})();
