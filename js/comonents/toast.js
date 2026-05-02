// ── COMPONENT: TOAST ──────────────────────────────────────────
'use strict';

const Toast = (() => {

  let _timer = null;

  function show(message, type = 'default', duration = 2400) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    // Remove existing toast
    const existing = container.querySelector('.toast');
    if (existing) existing.remove();
    clearTimeout(_timer);

    const el = document.createElement('div');
    el.className = 'toast';

    // Icon per type
    const icons = {
      success: '\u2713',  // checkmark
      error:   '\u2715',  // cross
      streak:  '\u{1F525}', // fire
      default: '\u2728',  // sparkle
    };

    const colors = {
      success: 'var(--green)',
      error:   'var(--red)',
      streak:  '#ff9f43',
      default: 'var(--accent)',
    };

    el.innerHTML = `
      <span style="color:${colors[type] || colors.default};margin-right:6px">
        ${icons[type] || icons.default}
      </span>
      ${message}
    `;

    container.appendChild(el);

    _timer = setTimeout(() => {
      el.style.opacity = '0';
      el.style.transition = 'opacity 0.3s';
      setTimeout(() => el.remove(), 300);
    }, duration);
  }

  function success(msg) { show(msg, 'success'); }
  function error(msg)   { show(msg, 'error', 3000); }
  function streak(msg)  { show(msg, 'streak'); }

  return { show, success, error, streak };

})();