import { useState, useMemo, useEffect } from "react";
import { RefreshCw, Sparkles, Heart, Shirt, Check, Lightbulb, Sun, Cloud, CloudRain, TrendingUp, MapPin, MoveHorizontal } from "lucide-react";
import { T, fontDisplay } from "../../theme/tokens";
import { Header, Card, Chip, Button, EmptyState } from "../../components/ui";
import { QuotaBanner } from "../../components/QuotaBanner";
import { RewardedAdModal } from "../premium/RewardedAdModal";
import { Avatar3D } from "../../components/Avatar3D";
import { PersonPhoto } from "../../components/illustrations";
import { WEATHER_OPTIONS, PLACES, MOODS, GLOBAL_STYLES, COLORS_POOL, STYLE_THEME } from "../../data/reference";
import { TRENDS } from "../../data/trends";
import { generateOutfitsV2 } from "../../lib/outfits";
import { fetchWeather } from "../../lib/weather";
import { remaining } from "../../lib/utils";
import { FREE_LIMITS } from "../../config/plans";
import { sound } from "../../lib/sound";

const WEATHER_ICON = { panas: Sun, sejuk: Cloud, hujan: CloudRain };

export function OutfitScreen({ items, setItems, likes, setLikes, plan, usage, useQuota, adsLeft, watchAd, onUpgrade }) {
  const [showAds, setShowAds] = useState(false);
  const [weatherKey, setWeatherKey] = useState("sejuk");
  const [weatherInfo, setWeatherInfo] = useState(null);
  const [place, setPlace] = useState(PLACES[0].key);
  const [mood, setMood] = useState(MOODS[0].key);
  const [styleGlobal, setStyleGlobal] = useState("Semua");
  const [colorPref, setColorPref] = useState(null);
  const [shuffleSeed, setShuffleSeed] = useState(0);
  const [worn, setWorn] = useState(null);
  const left = remaining(usage, "outfit_generate", plan);

  // cuaca real lokasi user → set default weatherKey (tetap bisa dioverride)
  useEffect(() => {
    let alive = true;
    fetchWeather().then((w) => { if (alive) { setWeatherInfo(w); setWeatherKey(w.key); } });
    return () => { alive = false; };
  }, []);

  const doGenerate = () => { sound.whoosh(); setShuffleSeed((s) => s + 1); setWorn(null); };
  const regenerate = () => {
    if (plan === "premium") { doGenerate(); return; }
    if (left > 0) { if (useQuota("outfit_generate", "Outfit Generate tanpa batas")) doGenerate(); return; }
    setShowAds(true); // kuota habis → tawarkan nonton iklan untuk generate gratis
  };

  const { combos: outfits, partial } = useMemo(
    () => generateOutfitsV2(items, weatherKey, place, mood, styleGlobal, colorPref),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [items, weatherKey, place, mood, styleGlobal, colorPref, shuffleSeed]
  );

  const likeKey = (combo) => [combo.top, combo.bottom, combo.shoe].filter(Boolean).map((i) => i.id).join("+") + `|${mood}|${styleGlobal}`;
  const toggleLike = (combo) => {
    const k = likeKey(combo);
    sound.tap();
    setLikes(likes.includes(k) ? likes.filter((x) => x !== k) : [...likes, k]);
  };
  const markWorn = (combo) => {
    const wornIds = [combo.top, combo.bottom, combo.shoe, combo.outer, combo.acc].filter(Boolean).map((i) => i.id);
    setItems(items.map((i) => wornIds.includes(i.id) ? { ...i, wearCount: i.wearCount + 1, lastWorn: new Date().toISOString(), wearHistory: [...(i.wearHistory || []), new Date().toISOString()] } : i));
    sound.success();
    setWorn(combo.id);
  };

  const WIcon = WEATHER_ICON[weatherKey] || Sun;
  const theme = styleGlobal !== "Semua" ? STYLE_THEME[styleGlobal] : null;
  const enough = items.filter((i) => i.category === "Atasan").length > 0 && items.filter((i) => i.category === "Bawahan").length > 0;

  return (
    <div className="pb-28">
      <Header title="Outfit Hari Ini" subtitle="Diracik dari isi lemarimu" />
      <QuotaBanner remaining={left} limit={FREE_LIMITS.outfit_generate} label="generate" onUpgrade={onUpgrade} />

      {/* Trending now */}
      <div className="mb-3">
        <div className="flex items-center gap-1.5 px-4 mb-2">
          <TrendingUp size={15} color={T.coral} />
          <p className="text-sm font-bold" style={{ ...fontDisplay, color: T.navy }}>Trending sekarang</p>
        </div>
        <div className="flex gap-2.5 overflow-x-auto cc-noscroll px-4 pb-1">
          {TRENDS.map((tr) => {
            const on = styleGlobal === tr.style;
            return (
              <button key={tr.tag} onClick={() => { sound.tap(); setStyleGlobal(on ? "Semua" : tr.style); }}
                className="cc-press shrink-0 rounded-2xl overflow-hidden text-left w-40" style={{ background: on ? T.navy : T.white, border: on ? "none" : "1px solid #E9EBF2", boxShadow: on ? `0 10px 24px -14px ${tr.hue}` : "0 8px 20px -16px rgba(27,31,59,.4)" }}>
                <div className="relative h-24">
                  <PersonPhoto photoKey={tr.tag} size="w-full h-24" rounded="rounded-none" tint={tr.hue} />
                  <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, transparent 40%, rgba(11,13,26,.7))" }} />
                  <span className="absolute left-2.5 bottom-2 font-bold text-sm text-white leading-tight" style={{ ...fontDisplay }}>{tr.tag}</span>
                  {on && <span className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center" style={{ background: T.mint }}><Check size={12} color={T.navy} /></span>}
                </div>
                <p className="text-[11px] leading-snug px-2.5 py-2" style={{ color: on ? "rgba(255,255,255,.75)" : T.navySoft }}>{tr.desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      <div className="px-4 flex flex-col gap-3">
        {/* weather banner (real) */}
        <div className="rounded-3xl p-4 flex items-center justify-between cc-gradient-move" style={{ background: `linear-gradient(120deg, ${T.mintLight}, #F3EEFB)` }}>
          <div className="flex items-center gap-3">
            <span className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ background: "rgba(255,255,255,.6)" }}><WIcon size={22} color={T.navy} /></span>
            <div>
              <p className="text-xs flex items-center gap-1" style={{ color: T.navySoft }}><MapPin size={11} />{weatherInfo ? weatherInfo.city : "Mendeteksi lokasi…"}</p>
              <p className="font-bold text-sm" style={{ color: T.navy }}>{weatherInfo ? `${weatherInfo.tempC}° · ${weatherInfo.label}` : "Memuat cuaca…"}</p>
            </div>
          </div>
          <div className="flex gap-1">
            {WEATHER_OPTIONS.map((w) => (
              <button key={w.key} onClick={() => { sound.tap(); setWeatherKey(w.key); }} className="cc-press w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: weatherKey === w.key ? T.navy : "rgba(255,255,255,.55)" }}>
                <w.icon size={14} color={weatherKey === w.key ? "#fff" : T.navy} />
              </button>
            ))}
          </div>
        </div>

        <Card>
          <p className="text-xs font-bold mb-2" style={{ color: T.navySoft }}>Tempat / Acara</p>
          <div className="flex gap-2 overflow-x-auto cc-noscroll pb-1">
            {PLACES.map((p) => <Chip key={p.key} active={place === p.key} onClick={() => setPlace(p.key)}>{p.key}</Chip>)}
          </div>
        </Card>
        <Card>
          <p className="text-xs font-bold mb-2" style={{ color: T.navySoft }}>Mood</p>
          <div className="flex gap-2 overflow-x-auto cc-noscroll pb-1">
            {MOODS.map((m) => (
              <button key={m.key} onClick={() => { sound.tap(); setMood(m.key); }} className="cc-press px-3 py-1.5 rounded-full text-sm font-medium border whitespace-nowrap flex items-center gap-1.5"
                style={{ background: mood === m.key ? T.lavender : T.white, borderColor: mood === m.key ? T.lavender : "#E3E6F0", color: mood === m.key ? T.navy : T.navySoft }}>
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: m.dot, boxShadow: "inset 0 0 0 1px rgba(0,0,0,.1)" }} />{m.key}
              </button>
            ))}
          </div>
        </Card>
        <Card>
          <p className="text-xs font-bold mb-2" style={{ color: T.navySoft }}>Warna aksen</p>
          <div className="flex gap-2 overflow-x-auto cc-noscroll pb-1">
            <button onClick={() => { sound.tap(); setColorPref(null); }} className="cc-press px-3 py-1.5 rounded-full text-sm font-medium border whitespace-nowrap" style={{ background: !colorPref ? T.mint : T.white, borderColor: !colorPref ? T.mint : "#E3E6F0", color: T.navy }}>Bebas</button>
            {COLORS_POOL.map((c) => {
              const on = colorPref === c.name;
              return (
                <button key={c.name} onClick={() => { sound.tap(); setColorPref(on ? null : c.name); }} className="cc-press w-9 h-9 rounded-full shrink-0" style={{ background: c.hex, border: on ? `3px solid ${T.navy}` : "2px solid #E9EBF2", boxShadow: "inset 0 0 0 1px rgba(0,0,0,.05)" }} title={c.name} />
              );
            })}
          </div>
        </Card>
        <Card>
          <p className="text-xs font-bold mb-2" style={{ color: T.navySoft }}>Style</p>
          <div className="flex gap-2 overflow-x-auto cc-noscroll pb-1">
            {GLOBAL_STYLES.map((s) => <Chip key={s} active={styleGlobal === s} color="#EAE0F5" onClick={() => setStyleGlobal(s)}>{s}</Chip>)}
          </div>
        </Card>
      </div>

      <div className="px-4 mt-4">
        {!enough ? (
          <EmptyState icon={Sparkles} title="Lemari belum cukup lengkap"
            subtitle="Scan minimal 1 atasan dan 1 bawahan dulu supaya Kai bisa meracik outfit." action={null} />
        ) : (
          <>
            <div className="flex items-center justify-between mb-3 gap-2">
              <p className="font-bold text-lg truncate" style={{ fontFamily: theme?.font || fontDisplay.fontFamily, color: theme?.accent || T.navy, textTransform: theme?.upper ? "uppercase" : "none", letterSpacing: theme?.tracking || "normal", fontStyle: theme?.italic ? "italic" : "normal" }}>
                {theme ? styleGlobal : "Diproyeksikan buatmu"}
              </p>
              <button onClick={regenerate} className="cc-press flex items-center gap-1 text-sm font-semibold shrink-0" style={{ color: T.lavenderDeep }}>
                <RefreshCw size={14} /> Generate ulang
              </button>
            </div>
            {partial && (
              <div className="flex items-start gap-2 px-3 py-2.5 rounded-xl mb-3" style={{ background: "#F3EEFB" }}>
                <Lightbulb size={15} color={T.lavenderDeep} className="mt-0.5 shrink-0" />
                <p className="text-xs" style={{ color: T.navy }}>Item bergaya {styleGlobal} belum lengkap — ini versi terdekat dari lemarimu. Tanya Kai untuk melengkapi (thrift/swap dulu ya!).</p>
              </div>
            )}
            <div className="flex flex-col gap-3.5 cc-stagger">
              {outfits.map((combo, idx) => (
                <div key={combo.id} className="cc-pop-in rounded-3xl overflow-hidden" style={{ background: T.white, boxShadow: "0 14px 34px -22px rgba(27,31,59,.4)" }}>
                  <div className="relative" style={{ background: `linear-gradient(150deg, ${idx % 2 ? "#F3EEFB" : T.mintLight}, #FFFFFF)` }}>
                    <Avatar3D outfit={combo} height={252} />
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[11px] font-bold" style={{ background: theme?.accent || T.navy, color: "#fff", fontFamily: theme?.font || undefined }}>Look {idx + 1}</span>
                    <button onClick={() => toggleLike(combo)} className="cc-press absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center" style={{ background: "rgba(255,255,255,.85)" }}>
                      <Heart size={18} color={T.coral} fill={likes.includes(likeKey(combo)) ? T.coral : "none"} />
                    </button>
                    <span className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex items-center gap-1 px-2.5 py-1 rounded-full" style={{ background: "rgba(255,255,255,.85)" }}>
                      <MoveHorizontal size={11} color={T.lavenderDeep} /><span className="text-[10px] font-bold" style={{ color: T.lavenderDeep }}>geser untuk putar avatar</span>
                    </span>
                  </div>
                  <div className="px-4 pb-4 pt-3">
                    <p className="text-xs mb-3" style={{ color: T.navySoft }}>{combo.reason}</p>
                    <p className="text-[11px] font-bold mb-2" style={{ color: T.navySoft }}>Item dari lemarimu di look ini</p>
                    <div className="flex gap-2.5 overflow-x-auto cc-noscroll mb-3.5 pb-1">
                      {[combo.top, combo.outer, combo.bottom, combo.shoe, combo.acc].filter(Boolean).map((it) => (
                        <div key={it.id} className="shrink-0" style={{ width: 68 }}>
                          <div className="w-[68px] h-[68px] rounded-xl overflow-hidden" style={{ boxShadow: "0 4px 12px -6px rgba(27,31,59,.35)" }}>
                            <img src={it.image} className="w-full h-full object-cover" />
                          </div>
                          <p className="text-[10px] font-semibold mt-1 leading-tight truncate" style={{ color: T.navy }}>{it.name}</p>
                          <p className="text-[9px] leading-tight" style={{ color: T.navySoft }}>{it.category}</p>
                        </div>
                      ))}
                    </div>
                    <Button full variant={worn === combo.id ? "dark" : "primary"} icon={worn === combo.id ? Check : Shirt} onClick={() => markWorn(combo)}>
                      {worn === combo.id ? "Sudah dipakai hari ini" : "Pakai outfit ini"}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {showAds && (
        <RewardedAdModal adsLeft={adsLeft} watchAd={watchAd}
          onReward={() => { setShowAds(false); doGenerate(); sound.success(); }}
          onClose={() => setShowAds(false)}
          onUpgrade={() => { setShowAds(false); onUpgrade(); }} />
      )}
    </div>
  );
}
