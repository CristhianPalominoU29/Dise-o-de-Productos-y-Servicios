/* form-validation.js - Guarda inscripciones y genera constancia */

const form = document.getElementById('form');

if (form) {
  const RULES = {
    nombre: value => value.trim().length >= 2,
    apellido: value => value.trim().length >= 2,
    email: value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()),
    codigo: value => /^\d{4}-\d{4}$/.test(value.trim()),
    facultad: value => value !== '',
    ciclo: value => value !== '',
    evento: value => value !== '',
  };

  const mark = id => {
    document.getElementById(id)?.classList.add('error');
    document.getElementById(`${id}-error`)?.classList.add('visible');
  };

  const clear = id => {
    document.getElementById(id)?.classList.remove('error');
    document.getElementById(`${id}-error`)?.classList.remove('visible');
  };

  function makeValidationCode() {
    const random = Math.floor(Math.random() * 900 + 100);
    return `UTP-${Date.now().toString().slice(-6)}${random}`;
  }

  function loadInscripciones() {
    try {
      const data = JSON.parse(localStorage.getItem('utp_inscripciones') || '[]');
      return Array.isArray(data) ? data : [];
    } catch (error) {
      return [];
    }
  }

  function saveInscripciones(items) {
    try {
      localStorage.setItem('utp_inscripciones', JSON.stringify(items));
      return true;
    } catch (error) {
      return false;
    }
  }

  function showAlert(type, message) {
    const ok = document.getElementById('alert-ok');
    const err = document.getElementById('alert-err');
    ok?.classList.remove('visible');
    err?.classList.remove('visible');

    const target = type === 'ok' ? ok : err;
    if (!target) return;
    target.textContent = message;
    target.classList.add('visible');
    target.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function showProof(data) {
    const proof = document.getElementById('registration-proof');
    if (!proof || !data) return;

    document.getElementById('proof-code').textContent = data.validacion || 'UTP-000000';
    document.getElementById('proof-student').textContent = `${data.nombre} ${data.apellido}`;
    document.getElementById('proof-student-code').textContent = data.codigo;
    document.getElementById('proof-event').textContent = data.evento;
    document.getElementById('proof-date').textContent = data.fecha;
    proof.classList.add('visible');
    proof.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  document.getElementById('btn-last-proof')?.addEventListener('click', () => {
    const inscripciones = loadInscripciones();
    const last = inscripciones[inscripciones.length - 1];
    if (last) {
      showProof(last);
    } else {
      showAlert('err', 'Primero realiza una inscripcion para generar la validez.');
    }
  });

  Object.entries(RULES).forEach(([id, validate]) => {
    const el = document.getElementById(id);
    if (!el) return;

    const eventName = el.tagName === 'SELECT' ? 'change' : 'input';
    el.addEventListener(eventName, () => {
      if (validate(el.value)) clear(id);
    });
    el.addEventListener('blur', () => {
      if (!validate(el.value)) mark(id);
    });
  });

  document.getElementById('terminos')?.addEventListener('change', event => {
    const termsErr = document.getElementById('terminos-error');
    if (termsErr) termsErr.style.display = event.target.checked ? 'none' : 'block';
  });

  form.addEventListener('submit', event => {
    event.preventDefault();
    let valid = true;

    Object.entries(RULES).forEach(([id, validate]) => {
      const el = document.getElementById(id);
      if (!el) return;

      if (!validate(el.value)) {
        mark(id);
        valid = false;
      } else {
        clear(id);
      }
    });

    const terms = document.getElementById('terminos');
    const termsErr = document.getElementById('terminos-error');
    if (terms && !terms.checked) {
      if (termsErr) termsErr.style.display = 'block';
      valid = false;
    } else if (termsErr) {
      termsErr.style.display = 'none';
    }

    if (!valid) {
      showAlert('err', 'Corrige los errores antes de continuar.');
      form.querySelector('.error')?.focus();
      return;
    }

    const registro = {
      nombre: document.getElementById('nombre').value.trim(),
      apellido: document.getElementById('apellido').value.trim(),
      email: document.getElementById('email').value.trim(),
      codigo: document.getElementById('codigo').value.trim(),
      facultad: document.getElementById('facultad').value,
      ciclo: document.getElementById('ciclo').value,
      evento: document.getElementById('evento').value,
      comentarios: document.getElementById('comentarios')?.value.trim() || '',
      fecha: new Date().toLocaleString('es-PE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      validacion: makeValidationCode(),
    };

    const inscripciones = loadInscripciones();
    inscripciones.push(registro);

    if (!saveInscripciones(inscripciones)) {
      showAlert('err', 'No se pudo guardar la inscripcion. Verifica que el navegador permita localStorage.');
      return;
    }

    showAlert('ok', `Inscripcion exitosa. Tu registro para "${registro.evento}" fue validado.`);
    showProof(registro);
    form.reset();
    document.getElementById('evento')?.dispatchEvent(new Event('change'));
    setTimeout(() => document.getElementById('alert-ok')?.classList.remove('visible'), 6000);
  });
}
