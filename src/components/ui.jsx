import { T, fontDisplay, fontBody } from "../theme/tokens";

/* ============ SHARED UI PRIMITIVES ============
 * Small, presentational building blocks used across every feature. */

export function Chip({ active, onClick, children, color }) {
  return (
    <button
      onClick={onClick}
      className="px-3 py-1.5 rounded-full text-sm font-medium border transition-all whitespace-nowrap"
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

export function Button({ children, onClick, variant = "primary", full, disabled, icon: Icon, style }) {
  const base = "flex items-center justify-center gap-2 rounded-2xl px-5 py-3 font-semibold transition-transform active:scale-95 disabled:opacity-40 disabled:active:scale-100";
  const variants = {
    primary: { background: `linear-gradient(135deg, ${T.mint}, ${T.lavender})`, color: T.navy },
    outline: { background: T.white, color: T.navy, border: `1.5px solid ${T.lavender}` },
    ghost: { background: "transparent", color: T.navySoft },
    dark: { background: T.navy, color: T.white },
  };
  return (
    <button
      onClick={onClick}
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

export function Header({ title, subtitle }) {
  return (
    <div className="px-4 pt-6 pb-4">
      <p className="font-extrabold text-2xl" style={{ ...fontDisplay, color: T.navy }}>{title}</p>
      <p className="text-sm" style={{ color: T.navySoft }}>{subtitle}</p>
    </div>
  );
}

export function Toggle({ on, onChange }) {
  return (
    <button onClick={onChange} className="w-11 h-6 rounded-full p-0.5 shrink-0" style={{ background: on ? T.mint : "#D8DBE8" }}>
      <div className="w-5 h-5 rounded-full bg-white transition-transform" style={{ transform: on ? "translateX(20px)" : "translateX(0)" }} />
    </button>
  );
}
