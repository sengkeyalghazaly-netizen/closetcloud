import { useState } from "react";
import { X, Crown, Check, RefreshCw } from "lucide-react";
import { T, fontDisplay } from "../../theme/tokens";
import { Button } from "../../components/ui";
import { PREMIUM_PRICE, PREMIUM_BENEFITS } from "../../config/plans";

/* ============ PREMIUM PAYWALL ============
 * Mock upgrade flow (no real payment). Production wires this to
 * Midtrans/Xendit + RevenueCat; the sheet UI stays the same. */
export function PaywallSheet({ reason, onClose, onUpgrade }) {
  const [purchasing, setPurchasing] = useState(false);
  const [done, setDone] = useState(false);

  const buy = () => {
    setPurchasing(true);
    setTimeout(() => { setPurchasing(false); setDone(true); setTimeout(() => { onUpgrade(); onClose(); }, 900); }, 1600);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center" style={{ background: "rgba(27,31,59,0.6)" }}>
      <div className="w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl p-6 max-h-[92vh] overflow-y-auto" style={{ background: T.bg }}>
        <div className="flex justify-between items-start mb-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full" style={{ background: `linear-gradient(135deg, ${T.mint}, ${T.lavender})` }}>
            <Crown size={14} color={T.navy} /><span className="font-bold text-xs" style={{ color: T.navy }}>ClosetCloud+</span>
          </div>
          <button onClick={onClose} className="p-2 rounded-full" style={{ background: T.white }}><X size={18} color={T.navy} /></button>
        </div>

        {done ? (
          <div className="flex flex-col items-center py-10">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mb-3" style={{ background: T.mintLight }}><Check size={30} color={T.sage} /></div>
            <p className="font-bold text-lg" style={{ ...fontDisplay, color: T.navy }}>Selamat, kamu ClosetCloud+!</p>
            <p className="text-sm" style={{ color: T.navySoft }}>Semua fitur kini terbuka penuh.</p>
          </div>
        ) : (
          <>
            <p className="font-extrabold text-xl mt-3 mb-1" style={{ ...fontDisplay, color: T.navy }}>{reason || "Buka semua fitur premium"}</p>
            <p className="text-sm mb-4" style={{ color: T.navySoft }}>Upgrade sekali, pakai tanpa batas. Batalkan kapan saja.</p>

            <div className="flex flex-col gap-2.5 mb-5">
              {PREMIUM_BENEFITS.map((b, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: T.mintLight }}><b.icon size={17} color={T.lavenderDeep} /></div>
                  <div><p className="text-sm font-semibold" style={{ color: T.navy }}>{b.title}</p><p className="text-xs" style={{ color: T.navySoft }}>{b.desc}</p></div>
                </div>
              ))}
            </div>

            <div className="rounded-2xl p-4 mb-4 text-center" style={{ background: T.navy }}>
              <p className="text-3xl font-extrabold" style={{ ...fontDisplay, color: "#fff" }}>Rp {PREMIUM_PRICE.toLocaleString("id-ID")}<span className="text-sm font-medium" style={{ color: "rgba(255,255,255,0.7)" }}>/bulan</span></p>
              <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.7)" }}>via Midtrans / Xendit · kelola kapan saja</p>
            </div>

            <Button full icon={purchasing ? RefreshCw : Crown} disabled={purchasing} onClick={buy}>
              {purchasing ? "Memproses pembayaran…" : "Upgrade ke ClosetCloud+"}
            </Button>
            <button onClick={onClose} className="w-full text-center text-sm font-medium mt-3" style={{ color: T.navySoft }}>Nanti saja</button>
          </>
        )}
      </div>
    </div>
  );
}
