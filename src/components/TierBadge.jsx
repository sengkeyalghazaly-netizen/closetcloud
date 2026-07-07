import { T } from "../theme/tokens";
import { TIERS } from "../data/mock";

/* Style-Rank tier pill. Shared by Rank and Profile. */
export function TierBadge({ tier, size = "sm" }) {
  const t = TIERS[tier];
  const Icon = t.icon;
  const pad = size === "lg" ? "px-3 py-1.5" : "px-2 py-0.5";
  const isGradient = t.bg.startsWith("linear");
  const fg = isGradient || tier === 2 ? "#fff" : t.color;
  return (
    <div className={`inline-flex items-center gap-1.5 rounded-full ${pad}`} style={{ background: t.bg }}>
      <Icon size={size === "lg" ? 15 : 12} color={fg} />
      <span className={`font-bold ${size === "lg" ? "text-sm" : "text-xs"}`} style={{ color: fg }}>{t.name}</span>
    </div>
  );
}
