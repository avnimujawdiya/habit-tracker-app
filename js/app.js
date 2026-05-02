// ── HABITFLOW — APP CONTROLLER ────────────────────────────────
'use strict';

const App = (() => {

  // ── State ────────────────────────────────────────────────────
  let state = {
    habits: [],
    logs:   {},
    activeTab: 'today',
  };

  // ── Load from storage ────────────────────────────────────────
  function _loadState() {
    state.habits = Storage.getHabits();
    state.logs   = Storage.getLogs();
  }

  // ── Full re-render ───────────────────────────────────────────
  function _render() {
    const { habits, logs, activeTab } = state;
    Header.render(habits, logs);
    StatsPanel.render(habits, logs);
    HabitCard.render(habits, logs);
    if (activeTab === 'analytics') Analytics.render(habits, logs);
  }

  // ── Confetti burst ───────────────────────────────────────────
  function _confetti() {
    for (let i = 0; i < 16; i++) {
      const el = document.createElement('div');
      el.className = 'confetti-piece';
      el.style.cssText = `
        left:${35 + Math.random() * 30}vw;
        top:40vh;
        background:${CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)]};
        border-radius:${Math.random() > 0.5 ? '50%' : '2px'};
        --tx:${(Math.random() - 0.5) * 200}px;
        --ty:${-80 - Math.random() * 120}px;
        animation-delay:${Math.random() * 0.15}s;
      `;
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 1200);
    }
  }

  // ── Action: toggle habit ─────────────────────────────────────
  function _toggleHabit(id) {
    const today  = Helpers.todayKey();
    const wasDone = !!(state.logs[today]?.[id]);
    state.logs = Storage.toggleLog(id, today);

    const isDone = !!(state.logs[today]?.[id]);
    const habit  = state.habits.find(h => h.id === id);

    if (isDone) {
      const streak = Helpers.calcStreak(state.logs, id);
      if (streak >= 7)      Toast.streak(`${streak} day streak! Amazing!`);
      else if (streak >= 3) Toast.streak(`${streak} day streak! Keep going!`);
      else                  Toast.success(`${habit?.name || 'Habit'} done!`);

      // Check if ALL habits done today
      const allDone = state.habits.every(h => state.logs[today]?.[h.id]);
      if (allDone) {
        setTimeout(() => { Toast.streak('All habits done! Perfect day!'); _confetti(); }, 400);
      } else {
        _confetti();
      }
    }
    _render();
  }

  // ── Action: delete habit ─────────────────────────────────────
  function _deleteHabit(id) {
    const habit = state.habits.find(h => h.id === id);
    if (!confirm(`Delete "${habit?.name}"?`)) return;
    Storage.deleteHabit(id);
    state.habits = Storage.getHabits();
    Toast.show('Habit removed');
    _render();
  }

  // ── Action: add habit ────────────────────────────────────────
  function _addHabit(data) {
    const habit = {
      id:       Helpers.uid(),
      name:     data.name,
      icon:     data.icon,
      color:    data.color,
      category: data.category,
      createdAt: Helpers.todayKey(),
    };
    Storage.addHabit(habit);
    state.habits = Storage.getHabits();
    Toast.success(`"${habit.name}" added!`);
    _render();
  }

  // ── Tab switching ────────────────────────────────────────────
  function _switchTab(tab) {
    state.activeTab = tab;

    document.querySelectorAll('.tab-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.tab === tab);
    });
    document.querySelectorAll('.view').forEach(v => {
      v.classList.toggle('active', v.id === `view-${tab}`);
    });

    if (tab === 'analytics') Analytics.render(state.habits, state.logs);
  }

  // ── Event delegation ─────────────────────────────────────────
  function _bindEvents() {
    // Habit list — toggle & delete via delegation
    document.getElementById('habit-list')?.addEventListener('click', e => {
      const toggleBtn = e.target.closest('[data-action="toggle"]');
      const deleteBtn = e.target.closest('[data-action="delete"]');
      if (toggleBtn) _toggleHabit(toggleBtn.dataset.id);
      if (deleteBtn) _deleteHabit(deleteBtn.dataset.id);
    });

    // Add habit button
    document.getElementById('btn-add-habit')?.addEventListener('click', () => {
      Modal.open(_addHabit);
    });

    // Tab navigation
    document.getElementById('tab-nav')?.addEventListener('click', e => {
      const btn = e.target.closest('.tab-btn');
      if (btn) _switchTab(btn.dataset.tab);
    });
  }

  // ── Init ─────────────────────────────────────────────────────
  function init() {
    _loadState();
    _bindEvents();
    Modal.bindGlobalEvents();
    _render();
  }

  return { init };

})();

// Scripts are at end of <body> so DOM is already ready — call directly
App.init();