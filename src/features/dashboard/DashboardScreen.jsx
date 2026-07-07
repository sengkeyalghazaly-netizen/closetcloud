import { useState } from "react";
import { BarChart3, Leaf, Award, Tag, Share2 } from "lucide-react";
import { T, fontDisplay } from "../../theme/tokens";
import { Header, Card, Button, EmptyState } from "../../components/ui";
import { CARBON_PER_SWAP, CARBON_PER_REWEAR, recommendationFor } from "../../lib/carbon";
import { getLast7Days, toKey, WEEKDAY_LABELS } from "../../lib/utils";

/* ============ STYLE INSIGHT DASHBOARD ============ */
function MiniBarChart({ items }) {
  const days = getLast7Days();
  const counts = days.map((d) => {
    const key = toKey(d);
    return items.reduce((sum, it) => sum + (it.wearHistory || []).filter((w) => toKey(new Date(w)) === key).length, 0);
  });
  const max = Math.max(1, ...counts);
  return (
    <div className="flex items-end justify-between gap-2 h-28 mt-2">
      {days.map((d, idx) => (
        <div key={idx} className="flex flex-col items-center gap-1.5 flex-1">
          <div className="w-full rounded-lg" style={{ height: `${(counts[idx] / max) * 80 + (counts[idx] > 0 ? 8 : 2)}px`, background: counts[idx] > 0 ? `linear-gradient(180deg, ${T.mint}, ${T.lavender})` : "#E3E6F0" }} />
          <span className="text-[10px] font-medium" style={{ color: T.navySoft }}>{WEEKDAY_LABELS[d.getDay()]}</span>
        </div>
      ))}
    </div>
  );
}

export function DashboardScreen({ items, swapRequests, onBack }) {
  const [copied, setCopied] = useState(false);
  const completedSwaps = swapRequests.filter((r) => r.status === "selesai").length;
  const totalWears = items.reduce((s, i) => s + i.wearCount, 0);
  const carbonAvoided = Math.round(completedSwaps * CARBON_PER_SWAP + totalWears * CARBON_PER_REWEAR);

  const sorted = [...items].sort((a, b) => b.wearCount - a.wearCount);
  const topFavorit = sorted.filter((i) => i.wearCount > 0).slice(0, 5);
  const jarangDipakai = [...items].sort((a, b) => a.wearCount - b.wearCount).slice(0, 5);

  const shareSummary = () => {
    const text = `Ringkasan ClosetCloud bulan ini:\n- ${items.length} item di lemari digital\n- ${totalWears} kali pemakaian tercatat\n- ~${carbonAvoided} kg CO2e jejak karbon dihindari\n- ${completedSwaps} transaksi swap selesai\n#OptimizeWhatYouAlreadyOwn`;
    if (navigator.share) {
      navigator.share({ title: "Style Insight — ClosetCloud", text }).catch(() => {});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
    }
  };

  if (items.length === 0) {
    return (
      <div className="pb-24">
        <Header title="Style Insight" subtitle="Statistik & jejak karbon lemarimu" onBack={onBack} />
        <EmptyState icon={BarChart3} title="Belum ada data" subtitle="Scan baju dan mulai pakai outfit dulu supaya insight-nya muncul di sini." action={null} />
      </div>
    );
  }

  return (
    <div className="pb-24">
      <Header title="Style Insight" subtitle="Statistik & jejak karbon lemarimu" />
      <div className="px-4 flex flex-col gap-3">
        <Card style={{ background: `linear-gradient(135deg, ${T.mintLight}, #F3EEFB)` }}>
          <div className="flex items-center gap-2 mb-1">
            <Leaf size={18} color={T.sage} />
            <p className="text-xs font-semibold" style={{ color: T.navySoft }}>Jejak karbon dihindari</p>
          </div>
          <p className="font-extrabold text-3xl" style={{ ...fontDisplay, color: T.navy }}>{carbonAvoided} <span className="text-lg font-semibold">kg CO2e</span></p>
          <p className="text-xs mt-1" style={{ color: T.navySoft }}>Estimasi dari {completedSwaps} transaksi swap & {totalWears} pemakaian ulang — bukan angka ilmiah presisi, tapi gambaran nyata dampakmu.</p>
        </Card>

        <Card>
          <p className="text-sm font-semibold mb-1" style={{ color: T.navy }}>Pemakaian 7 hari terakhir</p>
          <MiniBarChart items={items} />
        </Card>

        {topFavorit.length > 0 && (
          <Card>
            <div className="flex items-center gap-2 mb-3"><Award size={16} color={T.lavenderDeep} /><p className="text-sm font-semibold" style={{ color: T.navy }}>Item Andalan</p></div>
            <div className="flex gap-3 overflow-x-auto pb-1">
              {topFavorit.map((it) => (
                <div key={it.id} className="flex flex-col items-center gap-1 shrink-0" style={{ width: 72 }}>
                  <img src={it.image} className="w-16 h-16 rounded-xl object-cover" />
                  <p className="text-[11px] font-medium text-center truncate w-full" style={{ color: T.navy }}>{it.name}</p>
                  <p className="text-[10px]" style={{ color: T.sage }}>{it.wearCount}× dipakai</p>
                </div>
              ))}
            </div>
          </Card>
        )}

        <Card>
          <div className="flex items-center gap-2 mb-3"><Tag size={16} color={T.coral} /><p className="text-sm font-semibold" style={{ color: T.navy }}>Rekomendasi Simpan / Jual / Donasi</p></div>
          <div className="flex flex-col gap-2.5">
            {jarangDipakai.map((it) => {
              const rec = recommendationFor(it);
              return (
                <div key={it.id} className="flex items-center gap-3">
                  <img src={it.image} className="w-12 h-12 rounded-xl object-cover" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold" style={{ color: T.navy }}>{it.name}</p>
                    <p className="text-xs font-medium" style={{ color: rec.tone === "sage" ? T.sage : T.coral }}>{rec.label}</p>
                    <p className="text-[11px]" style={{ color: T.navySoft }}>{rec.advice}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Button full icon={Share2} variant="outline" onClick={shareSummary}>{copied ? "Ringkasan disalin!" : "Bagikan Ringkasan Bulanan"}</Button>
      </div>
    </div>
  );
}
