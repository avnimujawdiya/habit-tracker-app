// ── COMPONENT: MODAL ──────────────────────────────────────────
'use strict';

const Modal = (() => {

  let _onConfirm = null;
  let _selIcon   = ICONS[0];
  let _selColor  = COLORS[0];
  let _selCat    = 'health';

  // ── Build inner HTML ─────────────────────────────────────────
  function _buildHTML() {
    const iconBtns = ICONS.map(ic => `
      <button class="icon-btn ${ic === _selIcon ? 'sel' : ''}"
              data-icon="${ic}" type="button">${ic}</button>
    `).join('');

    const colorBtns = COLORS.map(c => `
      <button class="color-btn ${c === _selColor ? 'sel' : ''}"
              data-color="${c}" style="background:${c}" type="button"></button>
    `).join('');

    const catOptions = CATEGORIES.map(c => `
      <option value="${c.id}" ${c.id === _selCat ? 'selected' : ''}>
        ${c.icon} ${c.label}
      </option>
    `).join('');

    return `
      <div class="modal-title">\u2728 New Habit</div>

      <input class="form-input" id="modal-name-inp"
             placeholder="e.g. Drink 8 glasses of water"
             maxlength="40" autocomplete="off"/>

      <div>
        <div class="picker-label">Category</div>
        <select class="form-select" id="modal-cat-sel">${catOptions}</select>
      </div>

      <div>
        <div class="picker-label">Icon</div>
        <div class="icon-grid" id="modal-icon-grid">${iconBtns}</div>
      </div>

      <div>
        <div class="picker-label">Color</div>
        <div class="color-grid" id="modal-color-grid">${colorBtns}</div>
      </div>

      <div class="modal-actions">
        <button class="btn-cancel" id="modal-cancel" type="button">Cancel</button>
        <button class="btn-confirm" id="modal-confirm" type="button"
                style="background:${_selColor}">
          Add Habit \u2713
        </button>
      </div>
    `;
  }

  // ── Event listeners inside modal ────────────────────────────
  function _bindEvents() {
    // Icon picker
    document.getElementById('modal-icon-grid')?.addEventListener('click', e => {
      const btn = e.target.closest('.icon-btn');
      if (!btn) return;
      _selIcon = btn.dataset.icon;
      document.querySelectorAll('.icon-btn').forEach(b => b.classList.remove('sel'));
      btn.classList.add('sel');
    });

    // Color picker
    document.getElementById('modal-color-grid')?.addEventListener('click', e => {
      const btn = e.target.closest('.color-btn');
      if (!btn) return;
      _selColor = btn.dataset.color;
      document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('sel'));
      btn.classList.add('sel');
      const confirmBtn = document.getElementById('modal-confirm');
      if (confirmBtn) confirmBtn.style.background = _selColor;
    });

    // Category
    document.getElementById('modal-cat-sel')?.addEventListener('change', e => {
      _selCat = e.target.value;
    });

    // Cancel
    document.getElementById('modal-cancel')?.addEventListener('click', close);

    // Confirm
    document.getElementById('modal-confirm')?.addEventListener('click', _handleConfirm);

    // Enter key
    document.getElementById('modal-name-inp')?.addEventListener('keydown', e => {
      if (e.key === 'Enter') _handleConfirm();
    });

    // Focus input
    setTimeout(() => document.getElementById('modal-name-inp')?.focus(), 60);
  }

  function _handleConfirm() {
    const name = document.getElementById('modal-name-inp')?.value.trim();
    if (!name) {
      const inp = document.getElementById('modal-name-inp');
      if (inp) { inp.style.borderColor = 'var(--red)'; inp.focus(); }
      setTimeout(() => { if (inp) inp.style.borderColor = ''; }, 1200);
      return;
    }
    if (_onConfirm) _onConfirm({ name, icon: _selIcon, color: _selColor, category: _selCat });
    close();
  }

  // ── Public API ───────────────────────────────────────────────
  function open(onConfirmCb) {
    _onConfirm = onConfirmCb;
    _selIcon   = ICONS[0];
    _selColor  = COLORS[0];
    _selCat    = 'health';

    const content = document.getElementById('modal-content');
    const overlay = document.getElementById('modal-overlay');
    if (!content || !overlay) return;

    content.innerHTML = _buildHTML();
    overlay.classList.add('open');
    _bindEvents();
  }

  function close() {
    const overlay = document.getElementById('modal-overlay');
    if (overlay) overlay.classList.remove('open');
    _onConfirm = null;
  }

  // Close on backdrop click — called from App.init()
  function bindGlobalEvents() {
    document.getElementById('modal-overlay')?.addEventListener('click', e => {
      if (e.target.id === 'modal-overlay') close();
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') close();
    });
  }

  return { open, close, bindGlobalEvents };

})();