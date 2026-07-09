import { useState } from "react";
import { BarChart3, Leaf, Award, Tag, Share2, Wallet, ChevronRight, Repeat, Shirt } from "lucide-react";
import { T, fontDisplay } from "../../theme/tokens";
import { Header, Card, Button, EmptyState } from "../../components/ui";
import { CARBON_PER_SWAP, CARBON_PER_REWEAR, recommendationFor, carbonEquivalent, impactLevel } from "../../lib/carbon";
import { getLast7Days, toKey, WEEKDAY_LABELS } from "../../lib/utils";

/* ============ STYLE INSIGHT DASHBOARD ============ */
function MiniBarChart({ items }) {
  const days = getLast7Days();
  const counts = days.map((d) => {
    const key = toKey(d);
    return items.reduce((sum, it) => sum + (it.wearHistory || []).filter((w) => toKey(new Date(w)) === key).length, 0);
  });
  const max = Math.max(1, ...counts);
  const total = counts.reduce((a, b) => a + b, 0);
  return (
    <>
      <div className="flex items-end justify-between gap-2 h-28 mt-1">
        {days.map((d, idx) => (
          <div key={idx} className="flex flex-col items-center gap-1 flex-1">
            <span className="text-[10px] font-bold" style={{ color: counts[idx] > 0 ? T.lavenderDeep : "transparent" }}>{counts[idx] || "0"}</span>
            <div className="w-full rounded-lg transition-all" style={{ height: `${(counts[idx] / max) * 70 + (counts[idx] > 0 ? 8 : 3)}px`, background: counts[idx] > 0 ? `linear-gradient(180deg, ${T.mint}, ${T.lavender})` : "#E9EBF2" }} />
            <span className="text-[10px] font-medium" style={{ color: T.navySoft }}>{WEEKDAY_LABELS[d.getDay()]}</span>
          </div>
        ))}
      </div>
      <p className="text-xs mt-2 text-center" style={{ color: T.navySoft }}>{total > 0 ? `${total}× pakai minggu ini — konsisten, keren!` : "Belum ada pemakaian minggu ini. Yuk pakai outfitmu!"}</p>
    </>
  );
}

/* Kartu angka besar yang gampang dibaca sekilas. */
function BigStat({ icon: Icon, label, value, tint }) {
  return (
    <div className="flex-1 rounded-2xl p-3.5" style={{ background: T.white, boxShadow: "0 8px 20px -14px rgba(27,31,59,.3)" }}>
      <span className="w-8 h-8 rounded-xl flex items-center justify-center mb-1.5" style={{ background: `${tint}2e` }}><Icon size={16} color={T.navy} /></span>
      <p className="font-extrabold text-2xl leading-none" style={{ ...fontDisplay, color: T.navy }}>{value}</p>
      <p className="text-[11px] mt-1" style={{ color: T.navySoft }}>{label}</p>
    </div>
  );
}

export function DashboardScreen({ items, swapRequests, onBack, onOpen }) {
  const [copied, setCopied] = useState(false);
  const completedSwaps = swapRequests.filter((r) => r.status === "selesai").length;
  const totalWears = items.reduce((s, i) => s + i.wearCount, 0);
  const carbonAvoided = Math.round(completedSwaps * CARBON_PER_SWAP + totalWears * CARBON_PER_REWEAR);
  const level = impactLevel(carbonAvoided);

  const sorted = [...items].sort((a, b) => b.wearCount - a.wearCount);
  const topFavorit = sorted.filter((i) => i.wearCount > 0).slice(0, 5);
  const jarangDipakai = [...items].sort((a, b) => a.wearCount - b.wearCount).slice(0, 5);

  // Ringkas cost-per-wear supaya insight nilai ekonomi ada di satu tempat.
  const totalValue = items.reduce((s, i) => s + i.price, 0);
  const worn = items.filter((i) => i.wearCount > 0);
  const avgCpw = worn.length ? Math.round(worn.reduce((s, i) => s + i.price / i.wearCount, 0) / worn.length) : 0;
  const bestValue = worn.length ? [...worn].sort((a, b) => a.price / a.wearCount - b.price / b.wearCount)[0] : null;

  const shareSummary = () => {
    const text = `Ringkasan ClosetCloud bulan ini:\n- ${items.length} item di lemari digital\n- ${totalWears} kali pemakaian tercatat\n- ~${carbonAvoided} kg CO2e jejak karbon dihindari (${level.label})\n- ${completedSwaps} transaksi swap selesai\n#OptimizeWhatYouAlreadyOwn`;
    if (navigator.share) {
      navigator.share({ title: "Style Insight — ClosetCloud", text }).catch(() => {});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
    }
  };

  if (items.length === 0) {
    return (
      <div className="pb-24">
        <Header title="Style Insight" subtitle="Dampak & nilai lemarimu, gampang dibaca" onBack={onBack} />
        <EmptyState icon={BarChart3} title="Belum ada data" subtitle="Scan baju dan mulai pakai outfit dulu supaya insight-nya muncul di sini." action={null} />
      </div>
    );
  }

  return (
    <div className="pb-24">
      <Header title="Style Insight" subtitle="Dampak & nilai lemarimu, gampang dibaca" onBack={onBack} />
      <div className="px-4 flex flex-col gap-3">
        {/* HERO — jejak karbon + level dampak + padanan yang relatable */}
        <Card style={{ background: `linear-gradient(135deg, ${T.mint}, ${T.lavender})` }}>
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2"><Leaf size={18} color={T.navy} /><p className="text-xs font-bold" style={{ color: T.navy }}>Jejak karbon dihindari</p></div>
            <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold" style={{ background: "rgba(255,255,255,.75)", color: T.navy }}>{level.label}</span>
          </div>
          <p className="font-extrabold text-4xl leading-none" style={{ ...fontDisplay, color: T.navy }}>{carbonAvoided}<span className="text-lg font-semibold"> kg CO2e</span></p>
          <p className="text-xs mt-2" style={{ color: "rgba(27,31,59,.78)" }}>{carbonEquivalent(carbonAvoided)}</p>
        </Card>

        {/* angka kunci sekilas */}
        <div className="flex gap-3">
          <BigStat icon={Shirt} label="Total dipakai" value={`${totalWears}×`} tint={T.mint} />
          <BigStat icon={Repeat} label="Swap selesai" value={completedSwaps} tint={T.sage} />
          <BigStat icon={Award} label="Item aktif" value={worn.length} tint={T.lavender} />
        </div>

        {/* nilai & cost-per-wear (satu tempat, dengan tautan ke rincian) */}
        <Card>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2"><Wallet size={16} color={T.lavenderDeep} /><p className="text-sm font-semibold" style={{ color: T.navy }}>Nilai & hemat</p></div>
            {onOpen && <button onClick={() => onOpen("analytics")} className="cc-press flex items-center gap-0.5 text-xs font-bold" style={{ color: T.lavenderDeep }}>Rincian <ChevronRight size={14} /></button>}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl p-3" style={{ background: T.mintLight }}>
              <p className="text-[11px]" style={{ color: T.navySoft }}>Total nilai lemari</p>
              <p className="font-bold text-lg" style={{ ...fontDisplay, color: T.navy }}>Rp {totalValue.toLocaleString("id-ID")}</p>
            </div>
            <div className="rounded-2xl p-3" style={{ background: "#F3EEFB" }}>
              <p className="text-[11px]" style={{ color: T.navySoft }}>Rata-rata cost/pakai</p>
              <p className="font-bold text-lg" style={{ ...fontDisplay, color: T.navy }}>{avgCpw ? `Rp ${avgCpw.toLocaleString("id-ID")}` : "—"}</p>
            </div>
          </div>
          {bestValue && <p className="text-[11px] mt-2 font-medium" style={{ color: T.sage }}>Paling hemat: {bestValue.name} — Rp {Math.round(bestValue.price / bestValue.wearCount).toLocaleString("id-ID")}/pakai. Makin sering dipakai, makin murah!</p>}
        </Card>

        <Card>
          <p className="text-sm font-semibold mb-1" style={{ color: T.navy }}>Pemakaian 7 hari terakhir</p>
          <MiniBarChart items={items} />
        </Card>

        {topFavorit.length > 0 && (
          <Card>
            <div className="flex items-center gap-2 mb-3"><Award size={16} color={T.lavenderDeep} /><p className="text-sm font-semibold" style={{ color: T.navy }}>Item Andalan</p></div>
            <div className="flex gap-3 overflow-x-auto pb-1">
              {topFavorit.map((it, idx) => (
                <div key={it.id} className="flex flex-col items-center gap-1 shrink-0 relative" style={{ width: 72 }}>
                  {idx === 0 && <span className="absolute -top-1 left-1/2 -translate-x-1/2 z-10 px-1.5 py-0.5 rounded-full text-[9px] font-extrabold" style={{ background: T.navy, color: "#fff" }}>#1</span>}
                  <img src={it.image} className="w-16 h-16 rounded-xl object-cover" />
                  <p className="text-[11px] font-medium text-center truncate w-full" style={{ color: T.navy }}>{it.name}</p>
                  <p className="text-[10px]" style={{ color: T.sage }}>{it.wearCount}× dipakai</p>
                </div>
              ))}
            </div>
          </Card>
        )}

        <Card>
          <div className="flex items-center gap-2 mb-3"><Tag size={16} color={T.coral} /><p className="text-sm font-semibold" style={{ color: T.navy }}>Saran: Simpan / Jual / Donasi</p></div>
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

        <Button full icon={Share2} onClick={shareSummary}>{copied ? "Ringkasan disalin!" : "Bagikan Ringkasan Bulanan"}</Button>
      </div>
    </div>
  );
}
