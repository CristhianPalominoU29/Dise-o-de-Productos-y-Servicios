/* site-config.js - Aplica la configuracion guardada desde el panel admin */

const UTP_DEFAULT_CONFIG = {
  nombre: 'Portal de Eventos - UTP Sede Ica',
  ano: '2026',
  email: 'eventos.ica@utp.edu.pe',
  tel: '(0801) 19610',
  wa: '960 252 970',
  dir: 'Av. Ayabaca s/n, Ica',
  fb: 'https://www.facebook.com/UTP.Peru',
  ig: 'https://www.instagram.com/universidadutp',
};

function getUtpConfig() {
  try {
    const stored = JSON.parse(localStorage.getItem('utp_config') || '{}');
    return { ...UTP_DEFAULT_CONFIG, ...(stored && typeof stored === 'object' ? stored : {}) };
  } catch (error) {
    return { ...UTP_DEFAULT_CONFIG };
  }
}

function setText(selector, value) {
  document.querySelectorAll(selector).forEach(el => {
    el.textContent = value;
  });
}

function setHref(selector, value) {
  document.querySelectorAll(selector).forEach(el => {
    el.setAttribute('href', value);
  });
}

function applyUtpConfig() {
  const cfg = getUtpConfig();
  const brandLine = `${cfg.nombre} · ${cfg.ano}`;

  document.title = document.title.replace(/2026/g, cfg.ano);
  setText('.brand-sub', brandLine);
  setText('[data-config="portal-name"]', cfg.nombre);
  setText('[data-config="year"]', cfg.ano);
  setText('[data-config="brand-line"]', brandLine);
  setText('[data-config="address"]', cfg.dir);
  setText('[data-config="phone"]', cfg.tel);
  setText('[data-config="whatsapp"]', cfg.wa);
  setText('[data-config="email"]', cfg.email);
  setText('[data-config="phone-whatsapp"]', `${cfg.tel} WhatsApp: ${cfg.wa}`);
  setText('[data-config="footer-copy"]', `© ${cfg.ano} Universidad Tecnológica del Perú — Sede Ica`);

  setHref('[data-config-link="email"]', `mailto:${cfg.email}`);
  setHref('[data-config-link="phone"]', `tel:${cfg.tel.replace(/\D/g, '')}`);
  setHref('[data-config-link="facebook"]', cfg.fb);
  setHref('[data-config-link="instagram"]', cfg.ig);

  document.querySelectorAll('.section-tag').forEach(tag => {
    if (tag.textContent.toLowerCase().includes('portal')) tag.textContent = brandLine;
  });
  document.querySelectorAll('.hero-eyebrow').forEach(el => {
    el.textContent = `Comunidad UTP Ica — ${cfg.ano}`;
  });
}

document.addEventListener('DOMContentLoaded', applyUtpConfig);
