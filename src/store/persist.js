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
    Object.keys(localStorage)
      .filter((k) => k.startsWith(PREFIX))
      .forEach((k) => localStorage.removeItem(k));
  } catch {
    /* ignore */
  }
}
