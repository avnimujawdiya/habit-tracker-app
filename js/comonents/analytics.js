// ── COMPONENT: ANALYTICS ──────────────────────────────────────
'use strict';

const Analytics = (() => {

  // ── Heatmap ──────────────────────────────────────────────────
  function _buildHeatmap(habits, logs) {
    const now   = new Date();
    const days  = Helpers.getMonthDays(now.getFullYear(), now.getMonth());
    const today = Helpers.todayKey();

    const cells = days.map(day => {
      if (!day) return `<div class="heatmap-cell" style="background:transparent"></div>`;

      const total = habits.length;
      const done  = total > 0
        ? habits.filter(h => logs[day]?.[h.id]).length
        : 0;
      const ratio = total > 0 ? done / total : 0;

      let bg = 'var(--surface2)';
      if (ratio > 0)   bg = 'rgba(124,106,247,0.25)';
      if (ratio >= 0.5) bg = 'rgba(124,106,247,0.5)';
      if (ratio >= 0.8) bg = 'rgba(124,106,247,0.8)';
      if (ratio === 1)  bg = '#7c6af7';

      const isToday = day === today;
      const border  = isToday ? '2px solid var(--accent)' : 'none';
      const title   = `${day}: ${done}/${total}`;

      return `
        <div class="heatmap-cell" title="${title}"
             style="background:${bg};border:${border};border-radius:4px"></div>
      `;
    }).join('');

    const dayLetters = DAY_LABELS.map(l =>
      `<div style="font-size:9px;color:var(--text3);text-align:center;font-family:var(--font-mono)">${l}</div>`
    ).join('');

    return `
      <div class="analytics-section">
        <div class="analytics-title">\u{1F4C5} ${MONTH_NAMES[now.getMonth()]} ${now.getFullYear()}</div>
        <div class="heatmap-grid" style="margin-bottom:6px">${dayLetters}</div>
        <div class="heatmap-grid">${cells}</div>
        <div style="display:flex;gap:6px;align-items:center;margin-top:10px;font-size:11px;color:var(--text3)">
          <div style="width:12px;height:12px;border-radius:2px;background:var(--surface2)"></div> None
          <div style="width:12px;height:12px;border-radius:2px;background:rgba(124,106,247,0.4)"></div> Partial
          <div style="width:12px;height:12px;border-radius:2px;background:#7c6af7"></div> All done
        </div>
      </div>
    `;
  }

  // ── Bar chart ────────────────────────────────────────────────
  function _buildBarChart(habits, logs) {
    if (habits.length === 0) return '';

    const week = Helpers.getWeekDays();
    const bars = week.map(day => {
      const total  = habits.length;
      const done   = habits.filter(h => logs[day]?.[h.id]).length;
      const pct    = total > 0 ? Math.round((done / total) * 100) : 0;
      const isToday = Helpers.isToday(day);
      const lbl    = Helpers.getDayLabel(day);
      const color  = isToday ? '#7c6af7' : 'var(--surface3)';
      const fill   = pct > 0
        ? (isToday ? '#7c6af7' : 'rgba(124,106,247,0.45)')
        : 'var(--surface2)';

      return `
        <div class="bar-wrap">
          <div style="font-size:10px;color:var(--text3);font-family:var(--font-mono);margin-bottom:3px">
            ${pct > 0 ? pct + '%' : ''}
          </div>
          <div class="bar" style="height:${Math.max(pct, 4)}%;background:${fill};
               border:${isToday ? '1.5px solid var(--accent)' : 'none'};border-radius:4px 4px 0 0">
          </div>
          <div class="bar-lbl" style="${isToday ? 'color:var(--text)' : ''}">${lbl}</div>
        </div>
      `;
    }).join('');

    return `
      <div class="analytics-section">
        <div class="analytics-title">\u{1F4CA} This Week</div>
        <div class="bar-chart" style="height:120px;align-items:flex-end">${bars}</div>
      </div>
    `;
  }

  // ── Per-habit breakdown ───────────────────────────────────────
  function _buildHabitBreakdown(habits, logs) {
    if (habits.length === 0) return '';

    const week = Helpers.getWeekDays();
    const rows = habits.map(h => {
      const done    = week.filter(d => logs[d]?.[h.id]).length;
      const streak  = Helpers.calcStreak(logs, h.id);
      const longest = Helpers.calcLongestStreak(logs, h.id);
      const pct     = Math.round((done / 7) * 100);
      const barFill = Helpers.hexToRgba(h.color, 0.7);

      return `
        <div style="display:flex;align-items:center;gap:10px;padding:10px 0;
                    border-bottom:1px solid var(--border)">
          <span style="font-size:20px">${h.icon}</span>
          <div style="flex:1;min-width:0">
            <div style="font-size:13px;font-weight:700;margin-bottom:4px;
                        white-space:nowrap;overflow:hidden;text-overflow:ellipsis">
              ${h.name}
            </div>
            <div style="height:4px;background:var(--surface2);border-radius:99px;overflow:hidden">
              <div style="height:100%;width:${pct}%;background:${barFill};
                          border-radius:99px;transition:width 0.5s ease"></div>
            </div>
          </div>
          <div style="text-align:right;flex-shrink:0">
            <div style="font-size:13px;font-weight:700;color:${h.color}">${done}/7</div>
            <div style="font-size:10px;color:var(--text3)">${streak}d streak</div>
          </div>
        </div>
      `;
    }).join('');

    return `
      <div class="analytics-section">
        <div class="analytics-title">\u{1F3AF} Per Habit</div>
        ${rows}
      </div>
    `;
  }

  // ── Public render ─────────────────────────────────────────────
  function render(habits, logs) {
    const el = document.getElementById('analytics-panel');
    if (!el) return;

    if (habits.length === 0) {
      el.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">\u{1F4CA}</div>
          <h3>No data yet</h3>
          <p>Add habits and start tracking to see your analytics!</p>
        </div>
      `;
      return;
    }

    el.innerHTML =
      _buildBarChart(habits, logs) +
      _buildHeatmap(habits, logs) +
      _buildHabitBreakdown(habits, logs);
  }

  return { render };

})();