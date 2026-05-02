// ── HABITFLOW — HELPER FUNCTIONS ──────────────────────────────
// Pure functions only — no DOM, no storage, no side effects

const Helpers = (() => {

  // ── Date utilities ───────────────────────────────────────────
  function todayKey() {
    return new Date().toISOString().split('T')[0];
  }

  function dateKey(date) {
    return date.toISOString().split('T')[0];
  }

  function getWeekDays() {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return dateKey(d);
    });
  }

  function getMonthDays(year, month) {
    // Returns array of date keys for a full month (padded to start on Sunday)
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = [];
    // Pad start
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let d = 1; d <= daysInMonth; d++) {
      days.push(dateKey(new Date(year, month, d)));
    }
    return days;
  }

  function formatDate(dateStr) {
    const d = new Date(dateStr + 'T12:00:00');
    return `${DAY_NAMES[d.getDay()]}, ${d.getDate()} ${MONTH_NAMES[d.getMonth()]}`;
  }

  function getDayLabel(dateStr) {
    return DAY_LABELS[new Date(dateStr + 'T12:00:00').getDay()];
  }

  function isToday(dateStr) {
    return dateStr === todayKey();
  }

  // ── Streak calculation ───────────────────────────────────────
  // Counts consecutive days up to and including today
  function calcStreak(logs, habitId) {
    let streak = 0;
    const d = new Date();
    // If not done today, streak starts from yesterday
    if (!logs[todayKey()]?.[habitId]) {
      d.setDate(d.getDate() - 1);
    }
    while (true) {
      const key = dateKey(d);
      if (logs[key]?.[habitId]) {
        streak++;
        d.setDate(d.getDate() - 1);
      } else {
        break;
      }
    }
    return streak;
  }

  function calcLongestStreak(logs, habitId) {
    const allDays = Object.keys(logs).sort();
    let longest = 0, current = 0, prev = null;
    for (const day of allDays) {
      if (!logs[day]?.[habitId]) { current = 0; prev = null; continue; }
      if (!prev) { current = 1; }
      else {
        const diff = (new Date(day) - new Date(prev)) / 86400000;
        current = diff === 1 ? current + 1 : 1;
      }
      if (current > longest) longest = current;
      prev = day;
    }
    return longest;
  }

  // ── Completion rates ─────────────────────────────────────────
  function weekCompletionRate(logs, habits) {
    const week = getWeekDays();
    const total = habits.length * 7;
    if (total === 0) return 0;
    const done = week.reduce((acc, d) =>
      acc + habits.filter(h => logs[d]?.[h.id]).length, 0);
    return Math.round((done / total) * 100);
  }

  function todayDoneCount(logs, habits) {
    return habits.filter(h => logs[todayKey()]?.[h.id]).length;
  }

  function bestStreakAcrossHabits(logs, habits) {
    if (habits.length === 0) return 0;
    return Math.max(...habits.map(h => calcStreak(logs, h.id)));
  }

  // ── ID generator ─────────────────────────────────────────────
  function uid() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
  }

  // ── Color helpers ────────────────────────────────────────────
  function hexToRgba(hex, alpha) {
    const r = parseInt(hex.slice(1,3), 16);
    const g = parseInt(hex.slice(3,5), 16);
    const b = parseInt(hex.slice(5,7), 16);
    return `rgba(${r},${g},${b},${alpha})`;
  }

  function getCategoryById(id) {
    return CATEGORIES.find(c => c.id === id) || CATEGORIES[CATEGORIES.length - 1];
  }

  return {
    todayKey, dateKey, getWeekDays, getMonthDays,
    formatDate, getDayLabel, isToday,
    calcStreak, calcLongestStreak,
    weekCompletionRate, todayDoneCount, bestStreakAcrossHabits,
    uid, hexToRgba, getCategoryById,
  };

})();