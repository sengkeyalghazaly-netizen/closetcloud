import { T, fontDisplay, fontBody } from "../theme/tokens";
import { sound } from "../lib/sound";

/* ============ SHARED UI PRIMITIVES ============
 * Small, presentational building blocks used across every feature.
 * Tappable primitives play a soft sound + press animation for that
 * "alive, app-like" feel (respects the global sound toggle). */

export function Chip({ active, onClick, children, color }) {
  return (
    <button
      onClick={onClick ? (e) => { sound.tap(); onClick(e); } : undefined}
      className="cc-press px-3 py-1.5 rounded-full text-sm font-medium border transition-all whitespace-nowrap"
      style={{
        background: active ? (color || T.mint) : T.white,
        borderColor: active ? (color || T.mint) : "#E3E6F0",
        color: active ? T.navy : T.navySoft,
      }}
    >
      {children}
    </button>
  );
}

export function Button({ children, onClick, variant = "primary", full, disabled, icon: Icon, style, silent }) {
  const base = "cc-press cc-sheen flex items-center justify-center gap-2 rounded-2xl px-5 py-3 font-semibold disabled:opacity-40";
  const variants = {
    primary: { background: `linear-gradient(135deg, ${T.mint}, ${T.lavender})`, color: T.navy },
    outline: { background: T.white, color: T.navy, border: `1.5px solid ${T.lavender}` },
    ghost: { background: "transparent", color: T.navySoft },
    dark: { background: T.navy, color: T.white },
  };
  const handle = onClick
    ? (e) => { if (!silent) (variant === "primary" || variant === "dark" ? sound.select() : sound.tap()); onClick(e); }
    : undefined;
  return (
    <button
      onClick={handle}
      disabled={disabled}
      className={`${base} ${full ? "w-full" : ""}`}
      style={{ ...variants[variant], ...fontBody, ...style }}
    >
      {Icon && <Icon size={18} />}
      {children}
    </button>
  );
}

export function Card({ children, style, className }) {
  return (
    <div
      className={`rounded-3xl p-4 ${className || ""}`}
      style={{ background: T.white, boxShadow: "0 8px 24px -12px rgba(27,31,59,0.15)", ...style }}
    >
      {children}
    </div>
  );
}

export function EmptyState({ icon: Icon, title, subtitle, action }) {
  return (
    <div className="flex flex-col items-center text-center py-14 px-6">
      <div className="w-20 h-20 rounded-full flex items-center justify-center mb-4" style={{ background: T.mintLight }}>
        <Icon size={32} color={T.lavenderDeep} />
      </div>
      <p className="font-bold text-lg mb-1" style={{ ...fontDisplay, color: T.navy }}>{title}</p>
      <p className="text-sm mb-5 max-w-xs" style={{ color: T.navySoft }}>{subtitle}</p>
      {action}
    </div>
  );
}

export function Header({ title, subtitle, onBack, right }) {
  return (
    <div className="px-4 pt-6 pb-4">
      <div className="flex items-center gap-2.5">
        {onBack && (
          <button onClick={() => { sound.tap(); onBack(); }} className="cc-press w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ background: T.white, boxShadow: "0 4px 12px -6px rgba(27,31,59,.25)" }} aria-label="Kembali">
            <BackChevron />
          </button>
        )}
        <div className="flex-1 min-w-0">
          <p className="font-extrabold text-2xl truncate" style={{ ...fontDisplay, color: T.navy }}>{title}</p>
          <p className="text-sm" style={{ color: T.navySoft }}>{subtitle}</p>
        </div>
        {right}
      </div>
    </div>
  );
}

function BackChevron() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M15 5l-7 7 7 7" stroke={T.navy} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Toggle({ on, onChange }) {
  return (
    <button onClick={onChange} className="w-11 h-6 rounded-full p-0.5 shrink-0" style={{ background: on ? T.mint : "#D8DBE8" }}>
      <div className="w-5 h-5 rounded-full bg-white transition-transform" style={{ transform: on ? "translateX(20px)" : "translateX(0)" }} />
    </button>
  );
}
