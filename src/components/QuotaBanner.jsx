import { Zap } from "lucide-react";
import { T } from "../theme/tokens";

/* Remaining-quota strip shown atop metered screens (Outfit, Kai). */
export function QuotaBanner({ remaining, limit, label, onUpgrade }) {
  if (remaining === Infinity) return null;
  const low = remaining <= Math.ceil(limit * 0.34);
  return (
    <div className="flex items-center gap-2 mx-4 mb-3 px-3 py-2 rounded-xl" style={{ background: low ? "#FDF3E4" : T.mintLight }}>
      <Zap size={14} color={low ? "#B8862E" : T.sage} />
      <span className="text-xs flex-1" style={{ color: T.navy }}>Sisa {label} hari ini: <b>{remaining}/{limit}</b></span>
      <button onClick={onUpgrade} className="text-xs font-bold" style={{ color: T.lavenderDeep }}>Upgrade</button>
    </div>
  );
}
