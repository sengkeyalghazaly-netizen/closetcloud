import { useState, useMemo } from "react";
import { RefreshCw, Sparkles, Heart, Shirt, Check, Lightbulb } from "lucide-react";
import { T, fontDisplay } from "../../theme/tokens";
import { Header, Card, Chip, Button, EmptyState } from "../../components/ui";
import { QuotaBanner } from "../../components/QuotaBanner";
import { WEATHER_OPTIONS, PLACES, MOODS, GLOBAL_STYLES } from "../../data/reference";
import { generateOutfitsV2 } from "../../lib/outfits";
import { remaining } from "../../lib/utils";
import { FREE_LIMITS } from "../../config/plans";

/* ============ OUTFIT GENERATOR SCREEN (v2: Mood × Tempat × Style) ============ */
export function OutfitScreen({ items, setItems, likes, setLikes, plan, usage, useQuota, onUpgrade }) {
  const [weatherKey, setWeatherKey] = useState("sejuk");
  const [place, setPlace] = useState(PLACES[0].key);
  const [mood, setMood] = useState(MOODS[0].key);
  const [styleGlobal, setStyleGlobal] = useState("Semua");
  const [shuffleSeed, setShuffleSeed] = useState(0);
  const [worn, setWorn] = useState(null);
  const left = remaining(usage, "outfit_generate", plan);

  const regenerate = () => {
    if (!useQuota("outfit_generate", "Outfit Generate tanpa batas")) return;
    setShuffleSeed((s) => s + 1);
  };

  const { combos: outfits, partial } = useMemo(
    () => generateOutfitsV2(items, weatherKey, place, mood, styleGlobal),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [items, weatherKey, place, mood, styleGlobal, shuffleSeed]
  );

  const likeKey = (combo) => [combo.top, combo.bottom, combo.shoe].filter(Boolean).map((i) => i.id).join("+") + `|${mood}|${styleGlobal}`;
  const toggleLike = (combo) => {
    const k = likeKey(combo);
    setLikes(likes.includes(k) ? likes.filter((x) => x !== k) : [...likes, k]);
  };

  const markWorn = (combo) => {
    const wornIds = [combo.top, combo.bottom, combo.shoe, combo.outer, combo.acc].filter(Boolean).map((i) => i.id);
    setItems(items.map((i) => wornIds.includes(i.id) ? { ...i, wearCount: i.wearCount + 1, lastWorn: new Date().toISOString(), wearHistory: [...(i.wearHistory || []), new Date().toISOString()] } : i));
    setWorn(combo.id);
  };

  return (
    <div className="pb-24">
      <Header title="Outfit Hari Ini" subtitle="Rekomendasi dari isi lemarimu" />
      <QuotaBanner remaining={left} limit={FREE_LIMITS.outfit_generate} label="generate" onUpgrade={onUpgrade} />
      <div className="px-4 flex flex-col gap-3">
        <Card>
          <p className="text-xs font-semibold mb-2" style={{ color: T.navySoft }}>Cuaca</p>
          <div className="flex gap-2">
            {WEATHER_OPTIONS.map((w) => (
              <button key={w.key} onClick={() => setWeatherKey(w.key)} className="flex-1 rounded-xl py-2.5 flex flex-col items-center gap-1"
                style={{ background: weatherKey === w.key ? T.mintLight : "#F7F8FC", border: weatherKey === w.key ? `1.5px solid ${T.mint}` : "1px solid #E3E6F0" }}>
                <w.icon size={18} color={T.navy} />
                <span className="text-xs font-medium" style={{ color: T.navy }}>{w.temp}</span>
              </button>
            ))}
          </div>
        </Card>
        <Card>
          <p className="text-xs font-semibold mb-2" style={{ color: T.navySoft }}>Tempat / Acara</p>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {PLACES.map((p) => <Chip key={p.key} active={place === p.key} onClick={() => setPlace(p.key)}>{p.key}</Chip>)}
          </div>
        </Card>
        <Card>
          <p className="text-xs font-semibold mb-2" style={{ color: T.navySoft }}>Mood</p>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {MOODS.map((m) => <Chip key={m.key} active={mood === m.key} color={T.lavender} onClick={() => setMood(m.key)}>{m.emoji} {m.key}</Chip>)}
          </div>
        </Card>
        <Card>
          <p className="text-xs font-semibold mb-2" style={{ color: T.navySoft }}>Style</p>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {GLOBAL_STYLES.map((s) => <Chip key={s} active={styleGlobal === s} color="#EAE0F5" onClick={() => setStyleGlobal(s)}>{s}</Chip>)}
          </div>
        </Card>
      </div>

      <div className="px-4 mt-4">
        {items.filter(i => i.category === "Atasan").length === 0 || items.filter(i => i.category === "Bawahan").length === 0 ? (
          <EmptyState icon={Sparkles} title="Lemari belum cukup lengkap"
            subtitle="Scan minimal 1 atasan dan 1 bawahan dulu supaya AI bisa bikin rekomendasi outfit."
            action={null} />
        ) : (
          <>
            <div className="flex items-center justify-between mb-3">
              <p className="font-bold" style={{ ...fontDisplay, color: T.navy }}>Pilihan Outfit</p>
              <button onClick={regenerate} className="flex items-center gap-1 text-sm font-semibold" style={{ color: T.lavenderDeep }}>
                <RefreshCw size={14} /> Generate ulang
              </button>
            </div>
            {partial && (
              <div className="flex items-start gap-2 px-3 py-2.5 rounded-xl mb-3" style={{ background: "#F3EEFB" }}>
                <Lightbulb size={15} color={T.lavenderDeep} className="mt-0.5 shrink-0" />
                <p className="text-xs" style={{ color: T.navy }}>Kamu belum punya item bergaya {styleGlobal} yang lengkap — ini versi paling mendekati dari lemarimu. Tanya Kai untuk saran melengkapinya (thrift/swap dulu ya!).</p>
              </div>
            )}
            <div className="flex flex-col gap-3">
              {outfits.map((combo) => (
                <Card key={combo.id}>
                  <div className="flex gap-2 mb-2 items-start">
                    <div className="flex gap-2 flex-1">
                      {[combo.top, combo.outer, combo.bottom, combo.shoe, combo.acc].filter(Boolean).map((it) => (
                        <img key={it.id} src={it.image} className="w-16 h-16 rounded-xl object-cover" />
                      ))}
                    </div>
                    <button onClick={() => toggleLike(combo)} className="p-1.5">
                      <Heart size={18} color={T.coral} fill={likes.includes(likeKey(combo)) ? T.coral : "none"} />
                    </button>
                  </div>
                  <p className="text-xs mb-3" style={{ color: T.navySoft }}>{combo.reason}</p>
                  <Button full variant={worn === combo.id ? "dark" : "primary"} icon={worn === combo.id ? Check : Shirt} onClick={() => markWorn(combo)}>
                    {worn === combo.id ? "Sudah ditandai dipakai hari ini" : "Pakai outfit ini hari ini"}
                  </Button>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
