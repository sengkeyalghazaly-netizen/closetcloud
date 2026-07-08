import { useState, useEffect } from "react";
import { X, Play, Gift, Crown, Check } from "lucide-react";
import { T, fontDisplay } from "../../theme/tokens";
import { Button } from "../../components/ui";
import { GarmentImage } from "../../components/illustrations";
import { B2B_ADS } from "../../data/thrift";
import { sound } from "../../lib/sound";

const NEED = 2; // 2 iklan = 1 generate

/* Rewarded ads: saat kuota generate habis, user bisa nonton 2 iklan untuk 1
 * generate gratis. Dibatasi jatah iklan harian (dari App: adsLeft, max 4/hari). */
export function RewardedAdModal({ adsLeft, watchAd, onReward, onClose, onUpgrade }) {
  const enough = adsLeft >= NEED;
  const [phase, setPhase] = useState("intro"); // intro | ad
  const [idx, setIdx] = useState(0);
  const [count, setCount] = useState(5);
  const ad = B2B_ADS[idx % B2B_ADS.length];

  useEffect(() => {
    if (phase !== "ad") return;
    setCount(5);
    const t = setInterval(() => setCount((c) => (c > 0 ? c - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, [phase, idx]);

  const start = () => { sound.tap(); setIdx(0); setPhase("ad"); };
  const nextAd = () => {
    watchAd();
    sound.coin();
    if (idx + 1 >= NEED) onReward();      // grants 1 generate + parent closes
    else setIdx(idx + 1);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center" style={{ background: "rgba(11,13,26,0.72)" }}>
      <div className="w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl overflow-hidden cc-pop-in" style={{ background: T.bg }}>
        {phase === "intro" && (
          <div className="p-6">
            <div className="flex justify-between items-start mb-3">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${T.mint}, ${T.lavender})` }}><Gift size={22} color={T.navy} /></div>
              <button onClick={onClose} className="cc-press p-2 rounded-full" style={{ background: T.white }}><X size={18} color={T.navy} /></button>
            </div>
            <p className="font-extrabold text-xl mb-1" style={{ ...fontDisplay, color: T.navy }}>Kuota generate habis</p>
            {enough ? (
              <>
                <p className="text-sm mb-5" style={{ color: T.navySoft }}>Tonton <b>2 iklan singkat</b> untuk dapat <b>1× generate gratis</b>. Sisa jatah iklan hari ini: <b>{adsLeft}/4</b>.</p>
                <Button full icon={Play} onClick={start}>Tonton 2 iklan → 1 generate</Button>
                <button onClick={onUpgrade} className="cc-press w-full text-center text-sm font-semibold mt-3" style={{ color: T.lavenderDeep }}>Atau upgrade — tanpa batas & tanpa iklan</button>
              </>
            ) : (
              <>
                <p className="text-sm mb-5" style={{ color: T.navySoft }}>Jatah nonton iklan hari ini sudah habis ({4 - adsLeft}/4 terpakai). Balik lagi besok, atau upgrade untuk generate tanpa batas & bebas iklan.</p>
                <Button full icon={Crown} onClick={onUpgrade}>Upgrade ClosetCloud+</Button>
                <button onClick={onClose} className="cc-press w-full text-center text-sm font-medium mt-3" style={{ color: T.navySoft }}>Nanti saja</button>
              </>
            )}
          </div>
        )}

        {phase === "ad" && (
          <div>
            <div className="flex items-center justify-between px-4 py-2.5" style={{ background: T.navy }}>
              <span className="text-xs font-bold" style={{ color: "rgba(255,255,255,.7)" }}>Iklan {idx + 1} dari {NEED}</span>
              <span className="text-xs font-bold" style={{ color: "#fff" }}>{count > 0 ? `Lewati dalam ${count}s` : "Selesai"}</span>
            </div>
            <div className="px-6 py-8 flex flex-col items-center text-center" style={{ background: `linear-gradient(160deg, ${ad.accent}, ${ad.accent}cc)` }}>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full mb-3" style={{ background: "rgba(255,255,255,.22)", color: "#fff" }}>Sponsored · Partner ClosetCloud</span>
              <p className="font-extrabold text-3xl mb-1 tracking-wide" style={{ ...fontDisplay, color: "#fff" }}>{ad.brand}</p>
              <p className="text-sm mb-4" style={{ color: "rgba(255,255,255,.9)" }}>{ad.tagline}</p>
              <div className="w-32 h-32 mb-3"><GarmentImage category={ad.category} color={{ hex: "#FFFFFF" }} size="w-full h-full" /></div>
              <p className="font-bold text-white text-base">{ad.item}</p>
              <p className="text-white/85 text-sm">Rp {ad.price.toLocaleString("id-ID")}</p>
            </div>
            <div className="p-4">
              <Button full disabled={count > 0} icon={count > 0 ? undefined : Check} onClick={nextAd}>
                {count > 0 ? `Tunggu ${count}s…` : (idx + 1 >= NEED ? "Klaim 1× generate" : "Iklan berikutnya")}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
