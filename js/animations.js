 
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('[data-reveal]').forEach(el => revealObserver.observe(el));

 function animateCount(el, target, duration = 1800) {
  let start = 0;
  const step = (timestamp) => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target).toLocaleString('es-PE');
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target.toLocaleString('es-PE');
  };
  requestAnimationFrame(step);
}

const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      document.querySelectorAll('[data-count]').forEach(el => {
        animateCount(el, parseInt(el.dataset.count));
      });
      statObserver.disconnect();
    }
  });
}, { threshold: 0.5 });

const statsSection = document.querySelector('.hero-stats');
if (statsSection) statObserver.observe(statsSection);

 const heroImg = document.getElementById('hero-img');
if (heroImg) {
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    heroImg.style.transform = `translateY(${y * 0.25}px)`;
  }, { passive: true });
}
