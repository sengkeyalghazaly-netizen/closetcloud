import { T } from "../theme/tokens";

/* ============ BRAND ILLUSTRATIONS (no emoji, custom-drawn) ============
 * Clean geometric SVGs in the ClosetCloud palette. One place to swap the
 * official logo in later (see <Logo/>). Everything scales via `size`. */

const M = T.mint, L = T.lavender, LD = T.lavenderDeep, N = T.navy, S = T.sage, C = T.coral, W = "#FFFFFF";

/* Refined brand mark: cloud meeting an open wardrobe. Swap this component's
 * innards when the official logo arrives — every screen uses <Logo/>. */
export function Logo({ size = 44, rounded = 14, glow = false }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" style={glow ? { filter: "drop-shadow(0 6px 16px rgba(139,111,206,0.45))" } : undefined}>
      <defs>
        <linearGradient id="lg-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={M} /><stop offset="1" stopColor={L} />
        </linearGradient>
      </defs>
      <rect width="100" height="100" rx={rounded * 100 / size} fill="url(#lg-bg)" />
      <path d="M30 46c-6 0-11-5-11-11s5-11 11-11c1 0 2 0 3 .4C35.5 19 40.5 16 46 16c7 0 13 5.4 14 12.4 5 .5 9 4.8 9 10 0 5.6-4.6 10.2-10.2 10.2H30z" fill={N} transform="translate(2 -1)" />
      <g stroke={N} strokeWidth="4.5" strokeLinejoin="round" strokeLinecap="round" fill="none">
        <rect x="30" y="52" width="40" height="30" rx="5" />
        <line x1="50" y1="52" x2="50" y2="82" />
        <line x1="42" y1="61" x2="42" y2="67" /><line x1="58" y1="61" x2="58" y2="67" />
      </g>
    </svg>
  );
}

/* Wordmark lockup */
export function Wordmark({ size = 26 }) {
  return (
    <div className="flex items-center gap-2">
      <Logo size={size * 1.35} rounded={11} />
      <span style={{ fontFamily: "'Clash Display', sans-serif", fontWeight: 700, fontSize: size, color: N, letterSpacing: "-0.02em" }}>
        Closet<span style={{ color: LD }}>Cloud</span>
      </span>
    </div>
  );
}

/* --- Intro hero scenes (onboarding carousel) --- */
export function IntroWardrobe({ size = 240 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 240 240" fill="none">
      <defs>
        <linearGradient id="iw-g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor={M} /><stop offset="1" stopColor={L} /></linearGradient>
      </defs>
      <circle cx="120" cy="120" r="104" fill={T.mintLight} />
      <rect x="52" y="46" width="136" height="150" rx="16" fill={W} stroke={N} strokeWidth="4" />
      <line x1="120" y1="46" x2="120" y2="196" stroke={N} strokeWidth="3.5" />
      {/* rail */}
      <line x1="66" y1="70" x2="106" y2="70" stroke={N} strokeWidth="3" strokeLinecap="round" />
      <line x1="134" y1="70" x2="174" y2="70" stroke={N} strokeWidth="3" strokeLinecap="round" />
      {/* garments */}
      <path d="M86 70l-14 22h28z" fill={M} /><rect x="74" y="90" width="24" height="40" rx="6" fill={M} />
      <path d="M154 70l-14 22h28z" fill={L} /><rect x="142" y="90" width="24" height="46" rx="6" fill={L} />
      <rect x="72" y="150" width="28" height="34" rx="6" fill={S} />
      <rect x="140" y="150" width="28" height="34" rx="6" fill={C} />
      {/* floating cloud tag */}
      <g className="cc-float" style={{ transformOrigin: "180px 40px" }}>
        <circle cx="186" cy="40" r="20" fill="url(#iw-g)" />
        <path d="M176 42c-3 0-5-2-5-5s2-5 5-5c1-3 4-5 7-5 4 0 7 3 7 7 2 0 4 2 4 4 0 3-2 5-5 5h-13z" fill={N} transform="translate(0 -2)" />
      </g>
    </svg>
  );
}
export function IntroStylist({ size = 240 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 240 240" fill="none">
      <defs><linearGradient id="is-g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor={M} /><stop offset="1" stopColor={L} /></linearGradient></defs>
      <circle cx="120" cy="120" r="104" fill="#F3EEFB" />
      {/* mirror */}
      <rect x="74" y="44" width="92" height="150" rx="46" fill={W} stroke={N} strokeWidth="4" />
      {/* outfit on figure */}
      <circle cx="120" cy="86" r="15" fill={N} />
      <path d="M99 120c0-14 9-22 21-22s21 8 21 22l-6 40h-30z" fill="url(#is-g)" />
      <rect x="106" y="158" width="10" height="30" rx="4" fill={N} /><rect x="124" y="158" width="10" height="30" rx="4" fill={N} />
      {/* sparkles */}
      <Spark x={168} y={64} s={16} c={LD} />
      <Spark x={58} y={108} s={12} c={M} />
      <Spark x={172} y={150} s={10} c={C} />
    </svg>
  );
}
export function IntroCommunity({ size = 240 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 240 240" fill="none">
      <circle cx="120" cy="120" r="104" fill={T.mintLight} />
      <g>
        <circle cx="80" cy="96" r="18" fill={N} /><path d="M56 168c0-16 11-26 24-26s24 10 24 26z" fill={M} />
        <circle cx="162" cy="96" r="18" fill={N} /><path d="M138 168c0-16 11-26 24-26s24 10 24 26z" fill={L} />
      </g>
      {/* swap arrows */}
      <g stroke={LD} strokeWidth="5" strokeLinecap="round" fill="none">
        <path d="M104 112c12-8 22-8 32 0" /><path d="M136 106l6 6-6 6" />
        <path d="M136 138c-12 8-22 8-32 0" /><path d="M104 144l-6-6 6-6" />
      </g>
      <Heart x={120} y={54} s={22} c={C} />
    </svg>
  );
}

/* Success / celebration burst */
export function Celebrate({ size = 120 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
      <circle cx="60" cy="60" r="40" fill={T.mintLight} />
      <path d="M44 60l11 11 22-24" stroke={S} strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <Spark x={96} y={30} s={14} c={LD} /><Spark x={20} y={40} s={11} c={M} /><Spark x={90} y={92} s={10} c={C} /><Spark x={26} y={90} s={9} c={L} />
    </svg>
  );
}

/* --- Small primitives --- */
export function Spark({ x = 0, y = 0, s = 14, c = LD }) {
  return <path d={`M${x} ${y - s}c1 ${s * 0.55} ${s * 0.45} ${s} ${s} ${s}c-${s * 0.55} 1-${s} ${s * 0.45}-${s} ${s}c-1-${s * 0.55}-${s * 0.45}-${s}-${s}-${s}c${s * 0.55}-1 ${s}-${s * 0.45} ${s}-${s}z`} fill={c} />;
}
export function Heart({ x = 0, y = 0, s = 20, c = C }) {
  return <path d={`M${x} ${y + s * 0.7}c-${s}-${s * 0.6}-${s}-${s * 1.1}-${s * 0.5}-${s * 1.1}c${s * 0.28} 0 ${s * 0.5} ${s * 0.22} ${s * 0.5} ${s * 0.22}s${s * 0.22}-${s * 0.22} ${s * 0.5}-${s * 0.22}c${s * 0.5} 0 ${s * 0.5} ${s * 0.5} ${s * 0.5} ${s * 1.1}c0 ${s * 0.5}-${s} ${s}-${s} ${s}z`} fill={c} />;
}

/* --- Per-style garment silhouettes (quiz cards). Each style gets a distinct
 * shape + palette so options read visually, not as text. --- */
const STYLE_ART = {
  Kasual:      { bg: T.mintLight, a: M,  shape: "tee" },
  Streetwear:  { bg: "#EBEEF5",   a: N,  shape: "hoodie" },
  Minimalist:  { bg: "#F2F3F7",   a: "#C9CCD8", shape: "coat" },
  "Old Money": { bg: "#F4EFE6",   a: "#C9A46B", shape: "blazer" },
  Y2K:         { bg: "#F6ECFA",   a: L,  shape: "crop" },
  "Korean Style": { bg: "#FCEEF1", a: "#E7A9BE", shape: "layer" },
  Formal:      { bg: "#EAF0F6",   a: "#4C6EA0", shape: "suit" },
  Sporty:      { bg: T.mintLight, a: S,  shape: "jersey" },
  Edgy:        { bg: "#ECECEF",   a: "#3A3A40", shape: "jacket" },
  Bohemian:    { bg: "#F3EFE4",   a: "#B98A4B", shape: "dress" },
};
export const STYLE_KEYS = Object.keys(STYLE_ART);

export function StyleThumb({ styleKey, size = 96 }) {
  const cfg = STYLE_ART[styleKey] || STYLE_ART.Kasual;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <rect width="100" height="100" rx="16" fill={cfg.bg} />
      <GarmentSilhouette shape={cfg.shape} c={cfg.a} />
    </svg>
  );
}

/* Product-style garment depiction by category + colour — jauh lebih
 * "tergambarkan" daripada ikon polos. Dipakai di Swap & listing komunitas. */
export function GarmentImage({ category, color, size = "w-full h-36" }) {
  const c = color?.hex || "#9AA0B4";
  const bg = "#F1F2F7";
  return (
    <div className={`${size} rounded-2xl overflow-hidden relative`} style={{ background: `linear-gradient(160deg, ${bg}, #E7E9F1)` }}>
      <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="gm-shade" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="rgba(255,255,255,0.35)" /><stop offset="0.5" stopColor="rgba(255,255,255,0)" /><stop offset="1" stopColor="rgba(0,0,0,0.14)" />
          </linearGradient>
        </defs>
        <CategoryGarment category={category} c={c} />
      </svg>
    </div>
  );
}

function CategoryGarment({ category, c }) {
  const shade = "url(#gm-shade)";
  if (category === "Bawahan") return (
    <g>
      <path d="M34 24h32l4 52-14 2-6-38-6 38-14-2z" fill={c} />
      <path d="M34 24h32l4 52-14 2-6-38-6 38-14-2z" fill={shade} />
      <rect x="34" y="22" width="32" height="7" rx="2" fill="rgba(0,0,0,0.18)" />
    </g>
  );
  if (category === "Sepatu") return (
    <g>
      <path d="M20 58c0-8 6-12 14-14l8 6 22 2c6 1 12 3 14 8v6H20z" fill={c} />
      <path d="M20 58c0-8 6-12 14-14l8 6 22 2c6 1 12 3 14 8v6H20z" fill={shade} />
      <rect x="18" y="66" width="64" height="6" rx="3" fill="rgba(0,0,0,0.28)" />
      <path d="M40 50l4 3 6-2" stroke="rgba(255,255,255,0.5)" strokeWidth="2" fill="none" />
    </g>
  );
  if (category === "Outerwear") return (
    <g>
      <path d="M32 24l-12 8 5 12 6-3v34h38V41l6 3 5-12-12-8-9 6-6-6-6 6z" fill={c} />
      <path d="M32 24l-12 8 5 12 6-3v34h38V41l6 3 5-12-12-8-9 6-6-6-6 6z" fill={shade} />
      <line x1="50" y1="28" x2="50" y2="75" stroke="rgba(0,0,0,0.28)" strokeWidth="2.5" />
      <path d="M44 26l6 6 6-6" fill="rgba(255,255,255,0.35)" />
    </g>
  );
  if (category === "Aksesori") return (
    <g>
      <path d="M36 40c0-8 6-12 14-12s14 4 14 12" fill="none" stroke={c} strokeWidth="4" />
      <rect x="30" y="40" width="40" height="34" rx="8" fill={c} />
      <rect x="30" y="40" width="40" height="34" rx="8" fill={shade} />
      <rect x="44" y="52" width="12" height="6" rx="3" fill="rgba(0,0,0,0.2)" />
    </g>
  );
  // Atasan (default)
  return (
    <g>
      <path d="M36 26l-14 9 6 13 7-4v30h30V44l7 4 6-13-14-9-11 7z" fill={c} />
      <path d="M36 26l-14 9 6 13 7-4v30h30V44l7 4 6-13-14-9-11 7z" fill={shade} />
      <path d="M39 27l11 8 11-8" fill="none" stroke="rgba(0,0,0,0.18)" strokeWidth="2" />
    </g>
  );
}

function GarmentSilhouette({ shape, c }) {
  switch (shape) {
    case "hoodie":
      return <g fill={c}><path d="M34 30c0-6 6-10 16-10s16 4 16 10l10 8-7 12-5-3v25H36V47l-5 3-7-12z" /><rect x="46" y="30" width="8" height="14" rx="4" fill="#fff" opacity=".4" /></g>;
    case "coat":
      return <g fill={c}><path d="M35 30l-9 8 4 12 6-3v27h28V47l6 3 4-12-9-8-8 5-6-5-6 5z" /><line x1="50" y1="35" x2="50" y2="70" stroke="#fff" strokeWidth="2" opacity=".5" /></g>;
    case "blazer":
      return <g fill={c}><path d="M34 30l-8 8 5 12 5-3v27h28V47l5 3 5-12-8-8-16 8z" /><path d="M50 34l-8 40h16z" fill="#fff" opacity=".25" /></g>;
    case "crop":
      return <g fill={c}><path d="M36 32c0-6 6-10 14-10s14 4 14 10l8 6-6 10-4-2v14H38V46l-4 2-6-10z" /></g>;
    case "layer":
      return <g fill={c}><path d="M34 32l-8 8 5 11 5-3v28h28V48l5 3 5-11-8-8-16 7z" /><rect x="42" y="40" width="16" height="30" rx="4" fill="#fff" opacity=".3" /></g>;
    case "suit":
      return <g fill={c}><path d="M35 30l-8 8 5 12 5-3v27h28V47l5 3 5-12-8-8-16 7z" /><path d="M50 33v34" stroke="#fff" strokeWidth="3" /><path d="M50 33l-7 6 7 6 7-6z" fill="#fff" opacity=".5" /></g>;
    case "jersey":
      return <g fill={c}><path d="M34 32l-10 8 6 11 4-3v26h32V48l4 3 6-11-10-8-12 4-8-4-2 4z" /><circle cx="50" cy="52" r="7" fill="#fff" opacity=".4" /></g>;
    case "jacket":
      return <g fill={c}><path d="M34 30l-8 8 5 12 5-3v27h28V47l5 3 5-12-8-8-8 5-6-5-6 5-6-2z" /><line x1="50" y1="34" x2="50" y2="71" stroke="#fff" strokeWidth="2" opacity=".6" /></g>;
    case "dress":
      return <g fill={c}><path d="M40 28c0-4 4-7 10-7s10 3 10 7l6 6-4 8-4-2 8 32H34l8-32-4 2-4-8z" /></g>;
    default: // tee
      return <g fill={c}><path d="M36 30l-12 8 6 12 6-4v26h28V46l6 4 6-12-12-8-10 6z" /></g>;
  }
}
