// ── COMPONENT: HABIT CARD ─────────────────────────────────────
'use strict';

const HabitCard = (() => {

  function _streakHTML(streak) {
    if (streak === 0) {
      return `<span style="color:var(--text3);font-size:12px">No streak yet</span>`;
    }
    const hot   = streak >= 3;
    const color = streak >= 7 ? 'var(--red)' : streak >= 3 ? '#ff9f43' : 'var(--text2)';
    return `
      <span style="font-size:15px;${hot ? 'animation:flamePulse 0.8s ease-in-out infinite alternate' : ''}">
        \u{1F525}
      </span>
      <span style="font-weight:700;font-size:14px;color:${color}">${streak}</span>
      <span style="color:var(--text3);font-size:12px">day streak</span>
    `;
  }

  function _weekDotsHTML(logs, habitId, habitColor) {
    const week  = Helpers.getWeekDays();
    const today = Helpers.todayKey();

    const dots = week.map(day => {
      const filled  = !!(logs[day]?.[habitId]);
      const isToday = day === today;
      const dayLbl  = Helpers.getDayLabel(day);

      let dotStyle = '';
      if (filled) {
        dotStyle = `background:${habitColor}`;
      } else if (isToday) {
        dotStyle = `border:2px solid ${habitColor}55`;
      }

      return `
        <div class="dot-wrap">
          <div class="dot ${filled ? 'filled' : ''} ${isToday ? 'is-today' : ''}"
               style="${dotStyle}"></div>
          <span class="dot-label" style="${isToday ? 'color:var(--text2)' : ''}">${dayLbl}</span>
        </div>
      `;
    }).join('');

    const weekDone = week.filter(d => logs[d]?.[habitId]).length;

    return `
      <div class="week-row">
        ${dots}
        <span class="week-rate">${weekDone}/7</span>
      </div>
    `;
  }

  function _cardHTML(habit, logs) {
    const today   = Helpers.todayKey();
    const done    = !!(logs[today]?.[habit.id]);
    const streak  = Helpers.calcStreak(logs, habit.id);
    const cat     = Helpers.getCategoryById(habit.category);
    const colorDim = Helpers.hexToRgba(habit.color, 0.12);

    // Apply done-color CSS vars inline via style on the card
    const cardStyle = done
      ? `--done-color:${habit.color};--done-color-dim:${colorDim}`
      : '';

    const iconBg = Helpers.hexToRgba(habit.color, 0.15);

    return `
      <div class="habit-card ${done ? 'done' : ''}" style="${cardStyle}" data-id="${habit.id}">
        <div class="card-top">
          <div class="card-left">
            <div class="habit-icon" style="background:${iconBg};border-color:${Helpers.hexToRgba(habit.color,0.25)}">
              ${habit.icon}
            </div>
            <div>
              <div class="habit-name">${habit.name}</div>
              <div class="habit-streak">${_streakHTML(streak)}</div>
            </div>
          </div>
          <div class="card-actions">
            <button class="btn-del" data-action="delete" data-id="${habit.id}" title="Delete habit">
              \u2715
            </button>
            <button class="btn-done ${done ? 'done' : ''}" data-action="toggle" data-id="${habit.id}"
              style="${done ? `background:${habit.color};border-color:${habit.color}` : ''}">
              ${done ? '\u2713 Done' : 'Mark Done'}
            </button>
          </div>
        </div>
        <div class="habit-category" style="background:${colorDim};color:${habit.color};margin-bottom:10px;display:inline-block">
          ${cat.icon} ${cat.label}
        </div>
        ${_weekDotsHTML(logs, habit.id, habit.color)}
      </div>
    `;
  }

  function render(habits, logs) {
    const el = document.getElementById('habit-list');
    if (!el) return;

    if (habits.length === 0) {
      el.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">\u{1F331}</div>
          <h3>No habits yet</h3>
          <p>Add your first habit and start building better routines!</p>
        </div>
      `;
      return;
    }

    el.innerHTML = habits.map(h => _cardHTML(h, logs)).join('');
  }

  return { render };

})();