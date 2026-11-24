/* calendar.js — Lee eventos del localStorage */

let currentDate = new Date();

function renderCalendar() {
  const grid  = document.getElementById('cal-grid');
  const title = document.getElementById('cal-title');
  if (!grid || !title) return;

  const events = getEvents();
  const year   = currentDate.getFullYear();
  const month  = currentDate.getMonth();
  title.textContent = MONTHS_ES[month] + ' ' + year;

  const firstDay    = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrev  = new Date(year, month, 0).getDate();
  const today       = new Date();

  const eventDays = events
    .filter(e => { const d = new Date(e.fecha + 'T00:00:00'); return d.getFullYear()===year && d.getMonth()===month; })
    .map(e => new Date(e.fecha + 'T00:00:00').getDate());

  let html = '';
  for (let i = firstDay - 1; i >= 0; i--)
    html += '<div class="cal-cell other"><div class="cal-num">' + (daysInPrev - i) + '</div></div>';

  for (let d = 1; d <= daysInMonth; d++) {
    const isToday  = d===today.getDate() && month===today.getMonth() && year===today.getFullYear();
    const hasEvent = eventDays.includes(d);
    const cls = ['cal-cell', isToday?'today':'', hasEvent?'has-event':''].filter(Boolean).join(' ');
    html += '<div class="' + cls + '" onclick="showEvent(' + year + ',' + month + ',' + d + ')" onkeydown="if(event.key===\'Enter\'||event.key===\' \'){event.preventDefault();showEvent(' + year + ',' + month + ',' + d + ')}" role="button" tabindex="0"><div class="cal-num">' + d + '</div></div>';
  }
  const total = Math.ceil((firstDay + daysInMonth) / 7) * 7;
  for (let d = 1; d <= total - firstDay - daysInMonth; d++)
    html += '<div class="cal-cell other"><div class="cal-num">' + d + '</div></div>';

  grid.innerHTML = html;
}

function showEvent(year, month, day) {
  const dateStr = year + '-' + String(month+1).padStart(2,'0') + '-' + String(day).padStart(2,'0');
  const ev    = getEvents().find(e => e.fecha === dateStr);
  const panel = document.getElementById('event-detail');
  if (!panel) return;
  if (!ev) { panel.style.display='none'; return; }

  const img = resolveImg(ev.img, 1);
  document.getElementById('detail-img').src           = img;
  document.getElementById('detail-img').alt           = ev.titulo;
  document.getElementById('detail-cat').className     = 'event-cat ' + (CAT_CLASS[ev.cat] || 'event-cat--other');
  document.getElementById('detail-cat').textContent   = CAT_LABEL[ev.cat] || ev.cat;
  document.getElementById('detail-title').textContent = ev.titulo;
  document.getElementById('detail-desc').textContent  = ev.desc;
  document.getElementById('detail-loc').textContent   = '📍 ' + ev.lugar;
  const action = document.getElementById('detail-action');
  const status = getEffectiveEventStatus(ev);
  if (action) {
    if (status === 'ended' || status === 'closed') {
      action.removeAttribute('href');
      action.textContent = status === 'ended' ? 'Evento culminado' : 'No disponible';
      action.classList.add('disabled');
      action.style.pointerEvents = 'none';
      action.style.opacity = '0.7';
    } else {
      action.href = 'inscripciones.html?evento=' + encodeURIComponent(ev.titulo);
      action.textContent = 'Inscribirse';
      action.classList.remove('disabled');
      action.style.pointerEvents = '';
      action.style.opacity = '';
    }
  }
  panel.style.display = 'block';
  panel.scrollIntoView({ behavior:'smooth', block:'nearest' });
}

document.getElementById('prev-month')?.addEventListener('click', () => { currentDate.setMonth(currentDate.getMonth()-1); renderCalendar(); });
document.getElementById('next-month')?.addEventListener('click', () => { currentDate.setMonth(currentDate.getMonth()+1); renderCalendar(); });

renderCalendar();
