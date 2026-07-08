import { useState, useMemo } from "react";
import { MapPin, Globe, EyeOff, ChevronRight, Trophy, Lock } from "lucide-react";
import { T, fontDisplay } from "../../theme/tokens";
import { Card, Button, Header } from "../../components/ui";
import { TierBadge } from "../../components/TierBadge";
import { computeStyleScore } from "../../lib/scoring";
import { TIERS, MOCK_LEADERBOARD, MOCK_AVATAR_COLORS } from "../../data/mock";

function ScoreBar({ label, value }) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span style={{ color: T.navySoft }}>{label}</span>
        <span className="font-semibold" style={{ color: T.navy }}>{Math.round(value)}</span>
      </div>
      <div className="h-2 rounded-full" style={{ background: "#EEF0F6" }}>
        <div className="h-full rounded-full" style={{ width: `${Math.min(100, value)}%`, background: `linear-gradient(90deg, ${T.mint}, ${T.lavender})` }} />
      </div>
    </div>
  );
}

/* ============ STYLE RANK & LEADERBOARD ============ */
export function RankScreen({ items, optIn, setOptIn, userCity, userProvince, onBack }) {
  const [showSheet, setShowSheet] = useState(optIn === null);
  const [board, setBoard] = useState("overall"); // overall | stylish | collection | region
  const score = useMemo(() => computeStyleScore(items), [items]);
  const nextTier = score.tier > 1 ? TIERS[score.tier - 1] : null;
  const progressToNext = nextTier ? Math.min(100, Math.max(0, (score.overall - TIERS[score.tier].min) / (nextTier.min - TIERS[score.tier].min) * 100)) : 100;

  // Gabungkan user ke leaderboard bila opt-in
  const me = { name: "Kamu", city: userCity || "Manado", province: userProvince || "Sulawesi Utara", initials: "K", overall: Math.round(score.overall), stylish: Math.round(score.stylishScore), items: score.itemCount, tier: score.tier, isMe: true };
  let rows = [...MOCK_LEADERBOARD];
  if (optIn) rows.push(me);
  if (board === "region") rows = rows.filter((r) => r.province === me.province);
  rows.sort((a, b) => board === "stylish" ? b.stylish - a.stylish : board === "collection" ? b.items - a.items : b.overall - a.overall);

  const boards = [["overall", "Top Overall"], ["stylish", "Paling Stylish"], ["collection", "Koleksi"], ["region", "Top Wilayah"]];

  return (
    <div className="pb-24">
      <Header title="Style Rank" subtitle="Peringkat gaya komunitas ClosetCloud" onBack={onBack} />

      {/* Kartu tier user */}
      <div className="px-4">
        <Card style={{ background: score.tier === 1 ? TIERS[1].bg : `linear-gradient(135deg, ${T.mintLight}, #F3EEFB)` }}>
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs font-semibold mb-1" style={{ color: score.tier === 1 ? "rgba(255,255,255,0.85)" : T.navySoft }}>Tier kamu saat ini</p>
              <TierBadge tier={score.tier} size="lg" />
            </div>
            <div className="text-right">
              <p className="text-3xl font-extrabold" style={{ ...fontDisplay, color: score.tier === 1 ? "#fff" : T.navy }}>{Math.round(score.overall)}</p>
              <p className="text-xs" style={{ color: score.tier === 1 ? "rgba(255,255,255,0.85)" : T.navySoft }}>skor overall</p>
            </div>
          </div>
          {nextTier && (
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span style={{ color: score.tier === 1 ? "rgba(255,255,255,0.85)" : T.navySoft }}>Menuju {nextTier.name}</span>
                <span className="font-semibold" style={{ color: score.tier === 1 ? "#fff" : T.navy }}>{Math.round(progressToNext)}%</span>
              </div>
              <div className="h-2 rounded-full" style={{ background: score.tier === 1 ? "rgba(255,255,255,0.3)" : "#EEF0F6" }}>
                <div className="h-full rounded-full" style={{ width: `${progressToNext}%`, background: score.tier === 1 ? "#fff" : `linear-gradient(90deg, ${T.mint}, ${T.lavender})` }} />
              </div>
            </div>
          )}
        </Card>

        {/* Breakdown 5 komponen */}
        <Card className="mt-3">
          <p className="text-sm font-semibold mb-3" style={{ color: T.navy }}>Rincian skor kamu</p>
          <div className="flex flex-col gap-2.5">
            <ScoreBar label="Jumlah item" value={score.itemScore} />
            <ScoreBar label="Nilai koleksi" value={score.valueScore} />
            <ScoreBar label="Bobot brand" value={score.brandScore} />
            <ScoreBar label="Kelangkaan" value={score.rarityScore} />
            <ScoreBar label="Stylish (AI)" value={score.stylishScore} />
          </div>
        </Card>

        {/* Status privasi */}
        <button onClick={() => setShowSheet(true)} className="w-full mt-3 flex items-center gap-2 px-4 py-3 rounded-2xl" style={{ background: T.white, border: "1px solid #E3E6F0" }}>
          {optIn ? <Globe size={16} color={T.sage} /> : <EyeOff size={16} color={T.navySoft} />}
          <span className="text-sm font-medium flex-1 text-left" style={{ color: T.navy }}>{optIn ? "Kamu tampil di leaderboard publik" : "Kamu privat — skor tetap dihitung"}</span>
          <ChevronRight size={16} color={T.navySoft} />
        </button>

        {/* Tab papan peringkat */}
        <div className="flex gap-2 mt-4 overflow-x-auto pb-1">
          {boards.map(([k, l]) => (
            <button key={k} onClick={() => setBoard(k)} className="px-3.5 py-2 rounded-xl text-sm font-semibold whitespace-nowrap"
              style={{ background: board === k ? T.navy : T.white, color: board === k ? "#fff" : T.navySoft, border: board === k ? "none" : "1px solid #E3E6F0" }}>{l}</button>
          ))}
        </div>

        {board === "region" && (
          <p className="text-xs mt-2 mb-1" style={{ color: T.navySoft }}>Wilayah: {me.province}</p>
        )}

        <div className="flex flex-col gap-2 mt-3">
          {rows.map((r, idx) => {
            const val = board === "stylish" ? r.stylish : board === "collection" ? r.items : r.overall;
            const suffix = board === "collection" ? " item" : "";
            return (
              <Card key={idx} className="flex items-center gap-3" style={{ display: "flex", border: r.isMe ? `1.5px solid ${T.mint}` : "none", background: r.isMe ? T.mintLight : T.white }}>
                <span className="font-extrabold w-6 text-center" style={{ ...fontDisplay, color: idx < 3 ? T.lavenderDeep : T.navySoft }}>{idx + 1}</span>
                <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm" style={{ background: r.isMe ? T.navy : MOCK_AVATAR_COLORS[idx % 5], color: r.isMe ? "#fff" : T.navy }}>{r.initials}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate" style={{ color: T.navy }}>{r.name}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs flex items-center gap-0.5" style={{ color: T.navySoft }}><MapPin size={10} />{r.city}</span>
                    <TierBadge tier={r.tier} />
                  </div>
                </div>
                <span className="font-bold text-sm" style={{ color: T.navy }}>{val}{suffix}</span>
              </Card>
            );
          })}
        </div>
        <p className="text-xs text-center mt-3 px-4" style={{ color: T.navySoft }}>Yang tampil publik hanya nama, kota, tier & skor. Foto lemari, merek, dan harga per item tidak pernah dibagikan.</p>
      </div>

      {/* Opt-in sheet */}
      {showSheet && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" style={{ background: "rgba(27,31,59,0.55)" }}>
          <div className="w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl p-6" style={{ background: T.bg }}>
            <div className="w-14 h-14 rounded-full flex items-center justify-center mb-3 mx-auto" style={{ background: T.mintLight }}>
              <Trophy size={26} color={T.lavenderDeep} />
            </div>
            <p className="font-bold text-lg text-center mb-1" style={{ ...fontDisplay, color: T.navy }}>Ikut Leaderboard Publik?</p>
            <p className="text-sm text-center mb-5" style={{ color: T.navySoft }}>Skor gaya kamu selalu dihitung. Kamu bisa memilih tampil di peringkat komunitas atau tetap privat. Yang publik hanya nama, kota, tier & skor — isi lemarimu tetap rahasia.</p>
            <div className="flex flex-col gap-2">
              <Button full icon={Globe} onClick={() => { setOptIn(true); setShowSheet(false); }}>Ya, tampilkan aku</Button>
              <Button full variant="outline" icon={Lock} onClick={() => { setOptIn(false); setShowSheet(false); }}>Tetap privat</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
