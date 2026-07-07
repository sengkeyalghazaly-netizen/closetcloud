import { T } from "../theme/tokens";

/* ============ MANNEQUIN PROJECTION ============
 * "Dresses" a stylized figure with a generated outfit so the user can see it
 * worn, not just as thumbnails. Each garment image is clipped into a body
 * region (torso / legs / feet) via SVG clipPaths. Works with real photos or
 * the solid-colour seed images alike. clipPath ids are namespaced per instance. */

let _seq = 0;

const SKIN = "#E4E7F0";
const LINE = "#C7CBDA";
const TORSO_FULL = "M64,74 Q100,60 136,74 L140,120 Q140,130 130,132 L128,178 L72,178 L70,132 Q60,130 60,120 Z";
const TORSO_INNER = "M82,80 L118,80 L116,176 L84,176 Z";
const LEGS = "M72,178 L128,178 L124,330 L106,330 L102,220 Q100,214 98,220 L94,330 L76,330 Z";

export function Mannequin({ outfit, size = 150 }) {
  const uid = `mq-${outfit?.id || (_seq++)}`;
  const { top, bottom, shoe, outer, acc } = outfit || {};
  const w = size, h = Math.round(size * 1.9);

  return (
    <svg width={w} height={h} viewBox="0 0 200 380" fill="none">
      <defs>
        <clipPath id={`${uid}-torso`}><path d={TORSO_FULL} /></clipPath>
        <clipPath id={`${uid}-inner`}><path d={TORSO_INNER} /></clipPath>
        <clipPath id={`${uid}-legs`}><path d={LEGS} /></clipPath>
        <linearGradient id={`${uid}-floor`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="rgba(27,31,59,0.10)" /><stop offset="1" stopColor="rgba(27,31,59,0)" />
        </linearGradient>
      </defs>

      {/* floor shadow */}
      <ellipse cx="100" cy="352" rx="46" ry="8" fill={`url(#${uid}-floor)`} />

      {/* base body */}
      <circle cx="100" cy="40" r="21" fill={SKIN} stroke={LINE} strokeWidth="2" />
      <rect x="92" y="58" width="16" height="16" rx="5" fill={SKIN} />
      <path d={LEGS} fill={SKIN} stroke={LINE} strokeWidth="2" />
      <path d={TORSO_FULL} fill={SKIN} stroke={LINE} strokeWidth="2" />

      {/* bottom garment */}
      {bottom && <image href={bottom.image} x="72" y="178" width="56" height="152" preserveAspectRatio="xMidYMid slice" clipPath={`url(#${uid}-legs)`} />}

      {/* top / outer layering */}
      {outer ? (
        <>
          <image href={outer.image} x="58" y="60" width="84" height="120" preserveAspectRatio="xMidYMid slice" clipPath={`url(#${uid}-torso)`} />
          {top && <image href={top.image} x="82" y="80" width="36" height="96" preserveAspectRatio="xMidYMid slice" clipPath={`url(#${uid}-inner)`} />}
        </>
      ) : (
        top && <image href={top.image} x="58" y="60" width="84" height="120" preserveAspectRatio="xMidYMid slice" clipPath={`url(#${uid}-torso)`} />
      )}

      {/* re-stroke garment outlines for definition */}
      <path d={TORSO_FULL} fill="none" stroke="rgba(27,31,59,0.12)" strokeWidth="1.5" />
      <path d={LEGS} fill="none" stroke="rgba(27,31,59,0.12)" strokeWidth="1.5" />

      {/* shoes */}
      {shoe ? (
        <>
          <ellipse cx="85" cy="336" rx="14" ry="8" fill={shoe.color?.hex || "#333"} stroke={LINE} strokeWidth="1.5" />
          <ellipse cx="115" cy="336" rx="14" ry="8" fill={shoe.color?.hex || "#333"} stroke={LINE} strokeWidth="1.5" />
        </>
      ) : (
        <>
          <ellipse cx="85" cy="335" rx="12" ry="7" fill={SKIN} stroke={LINE} strokeWidth="1.5" />
          <ellipse cx="115" cy="335" rx="12" ry="7" fill={SKIN} stroke={LINE} strokeWidth="1.5" />
        </>
      )}

      {/* accessory accent near shoulder */}
      {acc && <circle cx="132" cy="94" r="8" fill={acc.color?.hex || T.lavenderDeep} stroke="#fff" strokeWidth="2.5" />}
    </svg>
  );
}
