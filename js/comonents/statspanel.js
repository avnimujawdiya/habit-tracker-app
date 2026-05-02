// ── COMPONENT: STATS PANEL ────────────────────────────────────
'use strict';

const StatsPanel = (() => {

  function render(habits, logs) {
    const el = document.getElementById('stats-panel');
    if (!el) return;

    if (habits.length === 0) { el.innerHTML = ''; return; }

    const done    = Helpers.todayDoneCount(logs, habits);
    const total   = habits.length;
    const weekPct = Helpers.weekCompletionRate(logs, habits);
    const best    = Helpers.bestStreakAcrossHabits(logs, habits);

    const stats = [
      {
        val:   `${done}/${total}`,
        lbl:   'Today',
        color: done === total && total > 0 ? 'var(--green)' : 'var(--text)',
      },
      {
        val:   `${weekPct}%`,
        lbl:   'This Week',
        color: weekPct >= 80 ? 'var(--green)' : weekPct >= 50 ? 'var(--gold)' : 'var(--text)',
      },
      {
        val:   `${best}`,
        lbl:   'Best Streak',
        color: best >= 7 ? 'var(--gold)' : 'var(--text)',
        suffix: best > 0 ? ' \u{1F525}' : '',
      },
    ];

    el.innerHTML = `
      <div class="stats-grid">
        ${stats.map(s => `
          <div class="stat-card">
            <div class="val" style="color:${s.color}">
              ${s.val}${s.suffix || ''}
            </div>
            <div class="lbl">${s.lbl}</div>
          </div>
        `).join('')}
      </div>
    `;
  }

  return { render };

})();