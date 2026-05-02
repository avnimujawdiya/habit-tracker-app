// ── HABITFLOW — STORAGE LAYER ─────────────────────────────────
// All localStorage operations live here — nowhere else reads/writes directly

const Storage = (() => {

  // ── Generic helpers ──────────────────────────────────────────
  function read(key, fallback = null) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  }

  function write(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      console.error('Storage write failed for key:', key);
      return false;
    }
  }

  // ── Habits ───────────────────────────────────────────────────
  function getHabits() {
    return read(STORAGE_KEYS.HABITS, []);
  }

  function saveHabits(habits) {
    return write(STORAGE_KEYS.HABITS, habits);
  }

  function addHabit(habit) {
    const habits = getHabits();
    habits.push(habit);
    return saveHabits(habits);
  }

  function deleteHabit(id) {
    const habits = getHabits().filter(h => h.id !== id);
    return saveHabits(habits);
  }

  function updateHabit(id, updates) {
    const habits = getHabits().map(h => h.id === id ? { ...h, ...updates } : h);
    return saveHabits(habits);
  }

  // ── Logs ─────────────────────────────────────────────────────
  function getLogs() {
    return read(STORAGE_KEYS.LOGS, {});
  }

  function saveLogs(logs) {
    return write(STORAGE_KEYS.LOGS, logs);
  }

  function toggleLog(habitId, dateKey) {
    const logs = getLogs();
    if (!logs[dateKey]) logs[dateKey] = {};
    logs[dateKey][habitId] = !logs[dateKey][habitId];
    // Clean up false entries to keep storage lean
    if (!logs[dateKey][habitId]) delete logs[dateKey][habitId];
    if (Object.keys(logs[dateKey]).length === 0) delete logs[dateKey];
    saveLogs(logs);
    return logs;
  }

  function isLogged(habitId, dateKey) {
    const logs = getLogs();
    return !!(logs[dateKey]?.[habitId]);
  }

  // ── Settings ─────────────────────────────────────────────────
  function getSettings() {
    return { ...DEFAULT_SETTINGS, ...read(STORAGE_KEYS.SETTINGS, {}) };
  }

  function saveSettings(settings) {
    return write(STORAGE_KEYS.SETTINGS, settings);
  }

  // ── Export (for debugging / backup) ──────────────────────────
  function exportAll() {
    return {
      habits:   getHabits(),
      logs:     getLogs(),
      settings: getSettings(),
      exported: new Date().toISOString(),
    };
  }

  function clearAll() {
    Object.values(STORAGE_KEYS).forEach(k => localStorage.removeItem(k));
  }

  return {
    getHabits, saveHabits, addHabit, deleteHabit, updateHabit,
    getLogs, saveLogs, toggleLog, isLogged,
    getSettings, saveSettings,
    exportAll, clearAll,
  };

})();