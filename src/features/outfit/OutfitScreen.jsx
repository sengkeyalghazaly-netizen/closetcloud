import { useState, useMemo, useEffect } from "react";
import { RefreshCw, Sparkles, Heart, Shirt, Check, Lightbulb, Sun, Cloud, CloudRain, TrendingUp, MapPin, Wand2, Dices, GraduationCap, Briefcase, Coffee, Heart as HeartIcon, PartyPopper, Dumbbell } from "lucide-react";
import { T, fontDisplay } from "../../theme/tokens";
import { Header, Card, Chip, Button, EmptyState } from "../../components/ui";
import { QuotaBanner } from "../../components/QuotaBanner";
import { RewardedAdModal } from "../premium/RewardedAdModal";
import { OutfitBoard } from "../../components/outfit/OutfitBoard";
import { PersonPhoto } from "../../components/illustrations";
import { WEATHER_OPTIONS, PLACES, MOODS, GLOBAL_STYLES, COLORS_POOL, STYLE_THEME } from "../../data/reference";
import { TRENDS } from "../../data/trends";
import { generateOutfitsV2 } from "../../lib/outfits";
import { fetchWeather } from "../../lib/weather";
import { remaining } from "../../lib/utils";
import { FREE_LIMITS } from "../../config/plans";
import { sound } from "../../lib/sound";

const WEATHER_ICON = { panas: Sun, sejuk: Cloud, hujan: CloudRain };

const rand = (a) => a[Math.floor(Math.random() * a.length)];

/* Pilih cepat: satu ketuk set tempat+mood, tanpa perlu atur banyak opsi (quiz). */
const QUICK_PICKS = [
  { label: "Ke Kampus", icon: GraduationCap, place: "Kampus", mood: "Santai" },
  { label: "Kerja", icon: Briefcase, place: "Kantor", mood: "Profesional" },
  { label: "Nongkrong", icon: Coffee, place: "Hangout/Café", mood: "Santai" },
  { label: "Kencan", icon: HeartIcon, place: "Date", mood: "Romantis" },
  { label: "Formal", icon: PartyPopper, place: "Acara Formal", mood: "Profesional" },
  { label: "Olahraga", icon: Dumbbell, place: "Gym", mood: "Playful" },
];

const HYPE = ["Clean dan effortless.", "Berani beda, tetap kamu.", "Look ini bakal dilirik.", "Simpel tapi standout.", "Cocok banget sama vibe-mu.", "Mix andalan yang gak pernah salah.", "Fresh, tinggal gas.", "Ini kamu banget."];
const SHUFFLE_MSGS = ["Ngubek lemari…", "Mixing & matching…", "Nyari yang paling kamu…", "Meracik look baru…", "Nge-remix isi lemarimu…"];

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
  const [look, setLook] = useState(0);
  const [shuffling, setShuffling] = useState(false);
  const [hype, setHype] = useState(HYPE[0]);
  const left = remaining(usage, "outfit_generate", plan);

  // cuaca real lokasi user → set default weatherKey (tetap bisa dioverride)
  useEffect(() => {
    let alive = true;
    fetchWeather().then((w) => { if (alive) { setWeatherInfo(w); setWeatherKey(w.key); } });
    return () => { alive = false; };
  }, []);

  // Generate ulang yang "fun": animasi shuffle singkat + pesan meracik acak,
  // lalu reveal look baru dengan hype line yang berganti-ganti + suara.
  const doGenerate = () => {
    if (shuffling) return;
    sound.whoosh();
    setShuffling(true);
    setTimeout(() => {
      setShuffleSeed((s) => s + 1);
      setWorn(null); setLook(0);
      setHype(rand(HYPE));
      setShuffling(false);
      sound.coin();
    }, 780);
  };
  const regenerate = () => {
    if (plan === "premium") { doGenerate(); return; }
    if (left > 0) { if (useQuota("outfit_generate", "Outfit Generate tanpa batas")) doGenerate(); return; }
    setShowAds(true); // kuota habis → tawarkan nonton iklan untuk generate gratis
  };

  // Pilih cepat: set tempat+mood sekali ketuk (combos otomatis recompute).
  const quickPick = (q) => {
    sound.select();
    setPlace(q.place); setMood(q.mood); setStyleGlobal("Semua"); setColorPref(null);
    setLook(0); setHype(rand(HYPE));
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
        {/* Pilih cepat — satu ketuk, tanpa perlu atur banyak opsi */}
        <Card>
          <div className="flex items-center gap-1.5 mb-2">
            <Wand2 size={14} color={T.lavenderDeep} />
            <p className="text-xs font-bold" style={{ color: T.navy }}>Pilih cepat <span style={{ fontWeight: 400, color: T.navySoft }}>· atau atur manual di bawah</span></p>
          </div>
          <div className="flex gap-2 overflow-x-auto cc-noscroll pb-1">
            {QUICK_PICKS.map((q) => {
              const on = place === q.place && mood === q.mood;
              return (
                <button key={q.label} onClick={() => quickPick(q)} className="cc-press shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-2xl text-sm font-semibold whitespace-nowrap border"
                  style={{ background: on ? T.navy : T.white, borderColor: on ? T.navy : "#E3E6F0", color: on ? "#fff" : T.navy }}>
                  <q.icon size={15} color={on ? T.mint : T.lavenderDeep} /> {q.label}
                </button>
              );
            })}
          </div>
        </Card>

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
            subtitle="Scan minimal 1 atasan dan 1 bawahan dulu supaya Ajax bisa meracik outfit." action={null} />
        ) : (
          <>
            <div className="flex items-center justify-between mb-3 gap-2">
              <p className="font-bold text-lg truncate" style={{ fontFamily: theme?.font || fontDisplay.fontFamily, color: theme?.accent || T.navy, textTransform: theme?.upper ? "uppercase" : "none", letterSpacing: theme?.tracking || "normal", fontStyle: theme?.italic ? "italic" : "normal" }}>
                {theme ? styleGlobal : "Diproyeksikan buatmu"}
              </p>
              <button onClick={regenerate} disabled={shuffling} className="cc-press flex items-center gap-1.5 text-sm font-bold shrink-0 px-3.5 py-2 rounded-full disabled:opacity-80" style={{ color: "#fff", background: `linear-gradient(120deg, ${T.lavenderDeep}, ${T.coral})`, boxShadow: "0 8px 18px -10px rgba(139,111,206,.7)" }}>
                <Dices size={15} className={shuffling ? "animate-spin" : ""} /> {shuffling ? "Meracik…" : "Acak lagi"}
              </button>
            </div>
            {partial && (
              <div className="flex items-start gap-2 px-3 py-2.5 rounded-xl mb-3" style={{ background: "#F3EEFB" }}>
                <Lightbulb size={15} color={T.lavenderDeep} className="mt-0.5 shrink-0" />
                <p className="text-xs" style={{ color: T.navy }}>Item bergaya {styleGlobal} belum lengkap — ini versi terdekat dari lemarimu. Tanya Ajax untuk melengkapi (thrift/swap dulu ya!).</p>
              </div>
            )}
            {(() => {
              const sel = Math.min(look, outfits.length - 1);
              const combo = outfits[sel];
              if (!combo) return null;
              return (
                <div className="cc-pop-in rounded-3xl overflow-hidden" style={{ background: T.white, boxShadow: "0 14px 34px -22px rgba(27,31,59,.4)" }}>
                  <div className="flex gap-2 p-3 pb-0">
                    {outfits.map((_, i) => (
                      <button key={i} onClick={() => { sound.tap(); setLook(i); }} className="cc-press flex-1 py-1.5 rounded-xl text-xs font-bold"
                        style={{ background: i === sel ? (theme?.accent || T.navy) : "#EEF0F6", color: i === sel ? "#fff" : T.navySoft, fontFamily: i === sel ? (theme?.font || undefined) : undefined }}>Look {i + 1}</button>
                    ))}
                  </div>
                  <div className="relative" style={{ background: `linear-gradient(160deg, ${T.mintLight}, #F3EEFB)` }}>
                    <button onClick={() => toggleLike(combo)} className="cc-press absolute top-3 right-3 z-10 w-9 h-9 rounded-full flex items-center justify-center" style={{ background: "rgba(255,255,255,.85)" }}>
                      <Heart size={18} color={T.coral} fill={likes.includes(likeKey(combo)) ? T.coral : "none"} />
                    </button>
                    <OutfitBoard items={[combo.top, combo.outer, combo.bottom, combo.shoe, combo.acc]} />
                    {shuffling && (
                      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center" style={{ background: "rgba(255,255,255,.72)", backdropFilter: "blur(2px)" }}>
                        <Dices size={42} color={T.lavenderDeep} className="animate-spin" />
                        <ShuffleText />
                      </div>
                    )}
                  </div>
                  <div className="px-4 pb-4 pt-3">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full mb-2 cc-pop-in" style={{ background: T.mintLight }}>
                      <Sparkles size={12} color={T.lavenderDeep} /><span className="text-[11px] font-bold" style={{ color: T.navy }}>{hype}</span>
                    </div>
                    <p className="text-xs mb-3" style={{ color: T.navySoft }}>{combo.reason}</p>
                    <Button full variant={worn === combo.id ? "dark" : "primary"} icon={worn === combo.id ? Check : Shirt} onClick={() => markWorn(combo)}>
                      {worn === combo.id ? "Sudah dipakai hari ini" : "Pakai outfit ini"}
                    </Button>
                  </div>
                </div>
              );
            })()}
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

/* Pesan "meracik" yang berganti-ganti selama animasi generate ulang. */
function ShuffleText() {
  const [i, setI] = useState(0);
  useEffect(() => { const t = setInterval(() => setI((v) => (v + 1) % SHUFFLE_MSGS.length), 260); return () => clearInterval(t); }, []);
  return <p className="text-sm font-bold mt-3" style={{ ...fontDisplay, color: T.navy }}>{SHUFFLE_MSGS[i]}</p>;
}
