/* =============================================
   events-data.js — Fuente de datos central
   Todas las páginas leen de localStorage.
   El admin escribe aquí → todo se actualiza.
   ============================================= */

const DEFAULT_EVENTS = [
  {
    titulo: 'Congreso de Ingeniería y Tecnología 2026',
    cat: 'academic', fecha: '2026-11-05',
    lugar: 'Auditorio UTP Ica', cupos: '250', estado: 'open',
    desc: 'Investigaciones, workshops y paneles con expertos del sector tecnológico nacional e internacional.',
    img: '../img/academico1.png',
    destacado: true,
    prioridad: 1
  },
  {
    titulo: 'Feria de Arte y Expresión Universitaria',
    cat: 'cultural', fecha: '2026-11-12',
    lugar: 'Patio Central UTP', cupos: 'Sin límite', estado: 'open',
    desc: 'Exposiciones, performances y talleres creativos a cargo de estudiantes de todas las carreras UTP.',
    img: '../img/cultural1.png',
    destacado: true,
    prioridad: 2
  },
  {
    titulo: 'Olimpiadas Interfacultades UTP 2026',
    cat: 'sport', fecha: '2026-11-19',
    lugar: 'Cancha UTP Ica', cupos: '120', estado: 'full',
    desc: 'Fútbol, baloncesto y atletismo entre las distintas carreras. ¡Demuestra el espíritu UTP!',
    img: '../img/deportivo1.png',
    destacado: true,
    prioridad: 3
  },
  {
    titulo: 'Semana de Orientación Vocacional UTP',
    cat: 'academic', fecha: '2026-11-26',
    lugar: 'Aulas UTP Ica', cupos: '400', estado: 'open',
    desc: 'Charlas y visitas a laboratorios para ingresantes. Conoce tu carrera de la mano de docentes expertos.',
    img: '../img/academico.png',
    destacado: true,
    prioridad: 4
  },
  {
    titulo: 'Festival de Cine Universitario',
    cat: 'cultural', fecha: '2026-12-02',
    lugar: 'Auditorio UTP Ica', cupos: '180', estado: 'open',
    desc: 'Cortometrajes y proyecciones especiales realizados por estudiantes y cineastas invitados a Ica.',
    img: '../img/cultural.png',
    destacado: true,
    prioridad: 5
  },
  {
    titulo: 'Torneo de Videojuegos UTP 2026',
    cat: 'other', fecha: '2026-12-09',
    lugar: 'Laboratorio de Cómputo UTP Ica', cupos: '120', estado: 'open',
    desc: 'Competencia gamer con retos por equipos, partidas clasificatorias y premiación para la comunidad universitaria.',
    img: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=700&q=80',
    destacado: true,
    prioridad: 6
  },
];

const DEFAULT_CATEGORIES = [
  { id: 'academic', label: 'Académico', icon: '🎓', locked: true },
  { id: 'cultural', label: 'Cultural', icon: '🎨', locked: true },
  { id: 'sport', label: 'Deportivo', icon: '⚽', locked: true },
  { id: 'other', label: 'Otros', icon: '✦', locked: true },
];

function slugCategoryName(name) {
  return name
    .trim()
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'categoria';
}

function getCategories() {
  try {
    const stored = JSON.parse(localStorage.getItem('utp_categories') || '[]');
    const deleted = JSON.parse(localStorage.getItem('utp_deleted_categories') || '[]');
    const deletedSet = new Set(Array.isArray(deleted) ? deleted : []);
    const merged = DEFAULT_CATEGORIES.filter(cat => !deletedSet.has(cat.id));
    stored.forEach(cat => {
      if (cat?.id && cat?.label && !deletedSet.has(cat.id) && !merged.some(base => base.id === cat.id)) merged.push(cat);
    });
    return merged;
  } catch(e) {
    return DEFAULT_CATEGORIES;
  }
}

/* Constantes compartidas */
const CATEGORY_LIST = getCategories();
const CAT_LABEL = Object.fromEntries(CATEGORY_LIST.map(cat => [cat.id, cat.label]));
const CAT_CLASS = Object.fromEntries(CATEGORY_LIST.map(cat => [
  cat.id,
  ['academic','cultural','sport','other'].includes(cat.id) ? `event-cat--${cat.id === 'sport' ? 'sport' : cat.id}` : 'event-cat--other'
]));
const CAT_BADGE = Object.fromEntries(CATEGORY_LIST.map(cat => [
  cat.id,
  cat.id === 'academic' ? 'badge-blue' : cat.id === 'cultural' ? 'badge-purple' : cat.id === 'sport' ? 'badge-green' : 'badge-gray'
]));
const EST_LABEL = { open: 'Abierto', full: 'Casi lleno', closed: 'Cerrado', ended: 'Culminado' };
const EST_CSS   = { open: 'badge--open', full: 'badge--full', closed: 'badge--closed', ended: 'badge--ended' };
const MONTHS_ES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];

function getEffectiveEventStatus(ev) {
  if (!ev?.fecha) return ev?.estado || 'open';
  const eventDate = new Date(ev.fecha + 'T23:59:59');
  const now = new Date();
  if (eventDate < now) return 'ended';
  return ev.estado || 'open';
}

function normalizeDisplayPriorities(events) {
  const normalized = events.map((ev, index) => ({
    ...migrateLegacyEvent(ev),
    destacado: ev.destacado !== false,
    prioridad: Number(ev.prioridad || index + 1)
  }));

  const used = new Set();
  normalized
    .filter(ev => ev.destacado)
    .sort((a, b) => a.prioridad - b.prioridad || new Date(a.fecha) - new Date(b.fecha))
    .forEach(ev => {
      let next = ev.prioridad;
      while (used.has(next)) next += 1;
      ev.prioridad = next;
      used.add(next);
    });

  return normalized;
}

function migrateLegacyEvent(ev) {
  const title = (ev.titulo || '').toLowerCase();
  const desc = (ev.desc || '').toLowerCase();
  const isOldMarathon = title.includes('maratón') || title.includes('maraton') || desc.includes('carrera solidaria');
  if (!isOldMarathon) return ev;

  return {
    ...ev,
    titulo: 'Torneo de Videojuegos UTP 2026',
    cat: 'other',
    lugar: 'Laboratorio de Cómputo UTP Ica',
    cupos: '120',
    estado: ev.estado || 'open',
    desc: 'Competencia gamer con retos por equipos, partidas clasificatorias y premiación para la comunidad universitaria.',
    img: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=700&q=80'
  };
}

/* Lee del localStorage, si no hay usa los defaults */
function getEvents() {
  try {
    const stored = localStorage.getItem('utp_events');
    const events = stored ? JSON.parse(stored) : DEFAULT_EVENTS;
    return normalizeDisplayPriorities(events);
  } catch(e) {
    return normalizeDisplayPriorities(DEFAULT_EVENTS);
  }
}

/* Formatea fecha: '2026-06-10' → '10 Jun 2026' */
function formatDate(str) {
  if (!str) return '—';
  const d = new Date(str + 'T00:00:00');
  return `${d.getDate()} ${MONTHS_ES[d.getMonth()]} ${d.getFullYear()}`;
}

/* Extrae día y mes abreviado para badge */
function badgeDate(str) {
  if (!str) return { day: '—', month: '—' };
  const d = new Date(str + 'T00:00:00');
  return { day: d.getDate(), month: MONTHS_ES[d.getMonth()].substring(0,3) };
}

/* Resuelve ruta de imagen según el nivel del HTML */
function resolveImg(img, depth) {
  // depth=0 → index.html (raíz), depth=1 → pages/
  if (!img) return '';
  // Si es URL externa, no tocar
  if (img.startsWith('http')) return img;
  // Si empieza con ../ (guardado desde admin que está en admin/)
  // necesitamos quitar el ../ para páginas en raíz o pages/
  const clean = img.replace(/^(\.\.\/)+/, '');
  if (depth === 0) return clean;          // raíz → img/...
  if (depth === 1) return '../' + clean;  // pages/ → ../img/...
  return img;
}
