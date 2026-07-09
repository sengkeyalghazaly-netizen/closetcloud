/* ============ SOUND SYSTEM ============
 * Tiny synthesized UI sounds via Web Audio — no audio files to ship, no
 * network. Deliberately soft and short so it feels like polish, not noise.
 * Respects a global mute flag (persisted) and the OS "reduce motion" is not
 * relevant here; users can toggle in Profile. Safe if AudioContext missing. */

const KEY = "closetcloud:sound";
let ctx = null;
let enabled = readEnabled();

function readEnabled() {
  try {
    const v = localStorage.getItem(KEY);
    return v == null ? true : v === "1";
  } catch {
    return true;
  }
}

export function isSoundEnabled() {
  return enabled;
}

export function setSoundEnabled(on) {
  enabled = !!on;
  try {
    localStorage.setItem(KEY, enabled ? "1" : "0");
  } catch {
    /* ignore */
  }
}

function getCtx() {
  if (typeof window === "undefined") return null;
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return null;
  if (!ctx) ctx = new AC();
  if (ctx.state === "suspended") ctx.resume().catch(() => {});
  return ctx;
}

/* Mobile (terutama iOS Safari) mengunci Web Audio sampai ada gesture nyata &
 * AudioContext mulai "suspended". Buka kunci di interaksi pertama: buat + resume
 * ctx lalu mainkan buffer senyap, agar blip berikutnya berbunyi. Listener dilepas
 * begitu ctx running supaya tak menambah beban. */
function unlockAudio() {
  const ac = getCtx();
  if (!ac) return;
  if (ac.state === "suspended") ac.resume().catch(() => {});
  try {
    const src = ac.createBufferSource();
    src.buffer = ac.createBuffer(1, 1, 22050);
    src.connect(ac.destination);
    src.start(0);
  } catch {
    /* ignore */
  }
}

if (typeof window !== "undefined") {
  const events = ["pointerdown", "touchstart", "touchend", "mousedown", "keydown"];
  const onGesture = () => {
    unlockAudio();
    if (ctx && ctx.state === "running") events.forEach((ev) => window.removeEventListener(ev, onGesture));
  };
  events.forEach((ev) => window.addEventListener(ev, onGesture, { passive: true }));
}

// Sedikit lebih keras dari sebelumnya supaya terdengar di speaker HP (tetap halus).
const MASTER = 1.5;

/* one soft sine "blip" */
function blip(freq, { dur = 0.09, type = "sine", gain = 0.05, when = 0 } = {}) {
  const ac = getCtx();
  if (!ac) return;
  const t = ac.currentTime + when;
  const osc = ac.createOscillator();
  const g = ac.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t);
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(gain * MASTER, t + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  osc.connect(g).connect(ac.destination);
  osc.start(t);
  osc.stop(t + dur + 0.02);
}

export const sound = {
  tap() {
    if (!enabled) return;
    blip(430, { dur: 0.06, gain: 0.035 });
  },
  select() {
    if (!enabled) return;
    blip(560, { dur: 0.07, gain: 0.04 });
    blip(760, { dur: 0.08, gain: 0.03, when: 0.045 });
  },
  success() {
    if (!enabled) return;
    blip(660, { dur: 0.1, gain: 0.045 });
    blip(880, { dur: 0.12, gain: 0.04, when: 0.09 });
    blip(1174, { dur: 0.16, gain: 0.035, when: 0.18 });
  },
  whoosh() {
    if (!enabled) return;
    blip(300, { dur: 0.18, type: "triangle", gain: 0.03 });
    blip(520, { dur: 0.14, type: "triangle", gain: 0.025, when: 0.05 });
  },
  coin() {
    if (!enabled) return;
    blip(988, { dur: 0.07, type: "square", gain: 0.03 });
    blip(1319, { dur: 0.12, type: "square", gain: 0.028, when: 0.06 });
  },
};
