// ── COMPONENT: HEADER ─────────────────────────────────────────
'use strict';

const Header = (() => {

  function _getGreeting() {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  }

  function _getTitleText(done, total) {
    if (total === 0)        return 'Start Tracking';
    if (done === total)     return 'All Done Today!';
    if (done === 0)         return "Let's Begin";
    return `${done} of ${total} done`;
  }

  function _getSubText(done, total) {
    if (total === 0) return 'Add your first habit below';
    if (done === total) {
      return '<span class="all-done">Perfect day! Keep the streak alive!</span>';
    }
    const left = total - done;
    return `${left} habit${left > 1 ? 's' : ''} left for today`;
  }

  function render(habits, logs) {
    const el = document.getElementById('app-header');
    if (!el) return;

    const today  = Helpers.todayKey();
    const now    = new Date();
    const done   = Helpers.todayDoneCount(logs, habits);
    const total  = habits.length;
    const pct    = total > 0 ? Math.round((done / total) * 100) : 0;

    const dateStr = `${DAY_NAMES[now.getDay()]} \u00B7 ${now.getDate()} ${MONTH_NAMES[now.getMonth()]} ${now.getFullYear()}`;

    el.innerHTML = `
      <div class="header-date">${dateStr}</div>
      <div class="header-greeting" style="font-size:13px;color:var(--text2);margin-bottom:4px">
        ${_getGreeting()}
      </div>
      <h1 class="header-title">
        ${_getTitleText(done, total)}
      </h1>
      <p class="header-sub">${_getSubText(done, total)}</p>
      <div class="progress-wrap">
        <div class="progress-fill" id="progress-fill" style="width:${pct}%"></div>
      </div>
    `;
  }

  return { render };

})();