import { FREE_LIMITS } from "../config/plans";

/* ============ IDS & RANDOMNESS ============ */
let idCounter = 1;
/* Collision-proof even after restoring persisted items across sessions:
 * time component keeps new ids distinct from any previously stored `item-*`. */
export const genId = () => `item-${Date.now().toString(36)}-${idCounter++}`;

export function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/* ============ DATES ============ */
export const DAY_MS = 24 * 60 * 60 * 1000;
export const toKey = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
export const todayKey = () => toKey(new Date());

export const MONTH_NAMES = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
export const WEEKDAY_LABELS = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

export function buildMonthGrid(viewDate) {
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const startOffset = firstDay.getDay(); // 0 = Minggu
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
  return cells;
}

/* Cari entri jadwal lain dalam rentang ±3 hari yang berbagi item (atasan/bawahan sama). */
export function findConflict(schedule, dateKey, itemIds, excludeKey) {
  const target = new Date(dateKey);
  for (const entry of schedule) {
    if (entry.date === excludeKey) continue;
    const d = new Date(entry.date);
    const diffDays = Math.abs((d - target) / DAY_MS);
    if (diffDays <= 3 && diffDays > 0) {
      const shared = entry.itemIds.filter((id) => itemIds.includes(id));
      if (shared.length >= 2) return entry;
    }
  }
  return null;
}

export function getLast7Days() {
  const arr = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    arr.push(d);
  }
  return arr;
}

/* ============ QUOTA ============
 * Client-side quota check for the freemium demo. Production replaces this
 * with a server-enforced counter (see roadmap). */
export function remaining(usage, feature, plan) {
  if (plan === "premium") return Infinity;
  const used = usage?.[feature]?.date === todayKey() ? usage[feature].count : 0;
  return Math.max(0, FREE_LIMITS[feature] - used);
}
