let savedTheme = 'light';
try {
  savedTheme = localStorage.getItem('utp_theme') || 'light';
} catch(e) {
  savedTheme = 'light';
}
document.documentElement.dataset.theme = savedTheme;

function addThemeToggle() {
  const headerInner = document.querySelector('.header-inner');
  const navToggleBtn = document.getElementById('nav-toggle');
  if (!headerInner || document.getElementById('theme-toggle')) return;

  const btn = document.createElement('button');
  btn.type = 'button';
  btn.id = 'theme-toggle';
  btn.className = 'theme-toggle';
  btn.setAttribute('aria-label', 'Cambiar tema');
  btn.textContent = savedTheme === 'dark' ? '☀' : '☾';
  btn.addEventListener('click', () => {
    const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem('utp_theme', next); } catch(e) {}
    btn.textContent = next === 'dark' ? '☀' : '☾';
  });

  headerInner.insertBefore(btn, navToggleBtn || null);
}

addThemeToggle();

const navToggle  = document.getElementById('nav-toggle');
const mobileMenu = document.getElementById('mobile-menu');

if (navToggle && mobileMenu) {
  navToggle.addEventListener('click', () => {
    const open = mobileMenu.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', open);
    navToggle.innerHTML = open ? '&#10005;' : '&#9776;';
  });
  mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    navToggle.setAttribute('aria-expanded', false);
    navToggle.innerHTML = '&#9776;';
  }));
  document.addEventListener('click', e => {
    if (!navToggle.contains(e.target) && !mobileMenu.contains(e.target)) {
      mobileMenu.classList.remove('open');
      navToggle.setAttribute('aria-expanded', false);
      navToggle.innerHTML = '&#9776;';
    }
  });
}

 const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-link').forEach(link => {
  const href = (link.getAttribute('href') || '').split('/').pop();
  if (href === currentPage || (currentPage === '' && href === 'index.html')) {
    link.classList.add('active');
  } else if (!href.startsWith('#')) {
    link.classList.remove('active');
  }
});

 const header = document.getElementById('site-header');
if (header) {
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 10);
  }, { passive: true });
}

 document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const href = a.getAttribute('href');
    if (!href || href === '#') return;
    const target = document.querySelector(href);
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
  });
});
