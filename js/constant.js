// ── HABITFLOW — CONSTANTS ──────────────────────────────────────
'use strict';

const STORAGE_KEYS = {
  HABITS:   'hf_habits_v2',
  LOGS:     'hf_logs_v2',
  SETTINGS: 'hf_settings_v2',
};

// Unicode escapes used instead of raw emoji to avoid editor encoding errors
const ICONS = [
  '\u{1F4A7}', '\u{1F4DA}', '\u{1F3C3}', '\u{1F9D8}',
  '\u{1F957}', '\u{1F634}', '\u{1F4AA}', '\u270D\uFE0F',
  '\u{1F3AF}', '\u{1F3A8}', '\u{1F33F}', '\u{1F9F9}',
  '\u{1F3BB}', '\u{1F31E}', '\u{1F6B4}', '\u{1F9C3}',
  '\u{1F4F1}', '\u{1F3AE}', '\u{1F30D}', '\u{1F52C}',
  '\u{1F48A}', '\u{1F9E0}', '\u{1F34E}', '\u2615',
];

const COLORS = [
  '#7c6af7', '#f76c6c', '#ffd166', '#4ecca3',
  '#74b9ff', '#fd79a8', '#ff9f43', '#55efc4',
  '#a29bfe', '#e17055', '#81ecec', '#dda0dd',
];

const CATEGORIES = [
  { id: 'health',      label: 'Health',      icon: '\u2764\uFE0F', color: '#f76c6c' },
  { id: 'fitness',     label: 'Fitness',     icon: '\u{1F4AA}',    color: '#ff9f43' },
  { id: 'study',       label: 'Study',       icon: '\u{1F4DA}',    color: '#74b9ff' },
  { id: 'mindfulness', label: 'Mindfulness', icon: '\u{1F9D8}',    color: '#4ecca3' },
  { id: 'work',        label: 'Work',        icon: '\u{1F4BC}',    color: '#a29bfe' },
  { id: 'social',      label: 'Social',      icon: '\u{1F465}',    color: '#fd79a8' },
  { id: 'hobby',       label: 'Hobby',       icon: '\u{1F3A8}',    color: '#ffd166' },
  { id: 'other',       label: 'Other',       icon: '\u2728',       color: '#7c6af7' },
];

const DAY_LABELS  = ['S','M','T','W','T','F','S'];
const DAY_NAMES   = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const CONFETTI_COLORS = [
  '#7c6af7', '#4ecca3', '#ffd166',
  '#f76c6c', '#74b9ff', '#fd79a8',
];

const DEFAULT_SETTINGS = {
  showWeekDots: true,
  showStreak:   true,
};