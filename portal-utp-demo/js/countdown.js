/* countdown.js — Cuenta regresiva al próximo evento desde localStorage */

(function() {
  const cdDays    = document.getElementById('cd-days');
  const cdHours   = document.getElementById('cd-hours');
  const cdMinutes = document.getElementById('cd-minutes');
  const cdSeconds = document.getElementById('cd-seconds');
  if (!cdSeconds) return;

  // Obtener el próximo evento futuro desde localStorage
  const events = getEvents();
  const now    = new Date();
  const future = events
    .map(e => ({ ...e, _date: new Date(e.fecha + 'T08:00:00') }))
    .filter(e => e._date > now)
    .sort((a, b) => a._date - b._date);

  if (!future.length) {
    [cdDays, cdHours, cdMinutes, cdSeconds].forEach(el => el && (el.textContent = '00'));
    return;
  }

  const next   = future[0];
  const TARGET = next._date;

  // Actualizar título si existe
  const titleEl = document.getElementById('countdown-event-title');
  if (titleEl) titleEl.textContent = next.titulo;

  const pad = n => String(Math.max(0, Math.floor(n))).padStart(2, '0');

  function tick() {
    const diff = TARGET - new Date();
    if (diff <= 0) {
      [cdDays, cdHours, cdMinutes, cdSeconds].forEach(el => el && (el.textContent = '00'));
      clearInterval(timer);
      return;
    }
    cdDays.textContent    = pad(diff / 864e5);
    cdHours.textContent   = pad((diff % 864e5) / 36e5);
    cdMinutes.textContent = pad((diff % 36e5) / 6e4);
    cdSeconds.textContent = pad((diff % 6e4) / 1e3);
  }

  tick();
  const timer = setInterval(tick, 1000);
})();
