import { useState, useEffect } from "react";

/* ============ PERSISTENCE ============
 * Thin localStorage-backed state so demo/dev sessions survive a refresh.
 * Every piece of app state uses the same key namespace, so migrating to a
 * real backend later means replacing this hook with a data-layer call —
 * component code stays the same. Safe in private mode / quota errors. */

const PREFIX = "closetcloud:";

export function loadState(key, fallback) {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    return raw == null ? fallback : JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function usePersistentState(key, initial) {
  const [value, setValue] = useState(() => loadState(key, initial));
  useEffect(() => {
    try {
      localStorage.setItem(PREFIX + key, JSON.stringify(value));
    } catch {
      /* storage unavailable (private mode / quota) — keep working in-memory */
    }
  }, [key, value]);
  return [value, setValue];
}

export function clearPersisted() {
  try {
    // biarkan flag "seeded" tetap ada supaya demo tidak ter-seed ulang saat
    // user sengaja reset (Keluar / Hapus akun) → onboarding tetap bersih.
    Object.keys(localStorage)
      .filter((k) => k.startsWith(PREFIX) && k !== PREFIX + "seeded")
      .forEach((k) => localStorage.removeItem(k));
  } catch {
    /* ignore */
  }
}

/* Tulis state demo satu kali saja (first run). Dipanggil sebelum React mount
 * agar usePersistentState langsung membaca nilai yang sudah terisi. */
export function seedOnce(state) {
  try {
    if (localStorage.getItem(PREFIX + "seeded")) return;
    Object.entries(state).forEach(([k, v]) => localStorage.setItem(PREFIX + k, JSON.stringify(v)));
    localStorage.setItem(PREFIX + "seeded", "1");
  } catch {
    /* ignore */
  }
}
