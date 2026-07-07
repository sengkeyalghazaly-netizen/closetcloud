import { useState, useEffect, useMemo } from "react";
import { Camera, Sparkles, Repeat, MessageCircle, Store, BarChart3, Sun, Cloud, CloudRain, ChevronRight, Bell, ArrowRight } from "lucide-react";
import { T, fontDisplay } from "../../theme/tokens";
import { Card, Button } from "../../components/ui";
import { Logo } from "../../components/illustrations";
import { computeStyleScore } from "../../lib/scoring";
import { generateOutfits } from "../../lib/outfits";
import { fetchWeather } from "../../lib/weather";
import { sound } from "../../lib/sound";

const WEATHER_ICON = { panas: Sun, sejuk: Cloud, hujan: CloudRain };

export function HomeScreen({ profile, items, swapRequests, onGo }) {
  const [weather, setWeather] = useState(null);
  useEffect(() => { let alive = true; fetchWeather().then((w) => { if (alive) setWeather(w); }); return () => { alive = false; }; }, []);

  const name = profile?.name || "kamu";
  const score = useMemo(() => computeStyleScore(items), [items]);
  const totalWears = items.reduce((s, i) => s + i.wearCount, 0);
  const todayOutfit = useMemo(() => generateOutfits(items, weather?.key || "sejuk", "Kuliah / kerja santai")[0], [items, weather]);
  const WIcon = WEATHER_ICON[weather?.key] || Sun;
  const hour = new Date().getHours();
  const greet = hour < 11 ? "Selamat pagi" : hour < 15 ? "Selamat siang" : hour < 19 ? "Selamat sore" : "Selamat malam";

  const shortcuts = [
    { key: "wardrobe", label: "Scan", icon: Camera, tint: T.mint },
    { key: "outfit", label: "Outfit", icon: Sparkles, tint: T.lavender },
    { key: "swap", label: "Swap", icon: Repeat, tint: T.sage },
    { key: "kai", label: "Tanya Kai", icon: MessageCircle, tint: T.lavenderDeep },
    { key: "thrift", label: "Thrift", icon: Store, tint: T.coral },
    { key: "dashboard", label: "Insight", icon: BarChart3, tint: "#8FB8DE" },
  ];

  const go = (r) => { sound.tap(); onGo(r); };

  return (
    <div className="pb-28">
      {/* top bar */}
      <div className="px-5 pt-6 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Logo size={38} rounded={12} />
          <div>
            <p className="text-xs" style={{ color: T.navySoft }}>{greet},</p>
            <p className="font-bold text-lg leading-none" style={{ ...fontDisplay, color: T.navy }}>{name}</p>
          </div>
        </div>
        <button onClick={() => go("dashboard")} className="cc-press w-10 h-10 rounded-full flex items-center justify-center" style={{ background: T.white, boxShadow: "0 6px 16px -8px rgba(27,31,59,.25)" }}>
          <Bell size={18} color={T.navy} />
        </button>
      </div>

      <div className="px-4 flex flex-col gap-4 mt-2 cc-stagger">
        {/* weather + outfit hero */}
        <div className="rounded-3xl p-5 cc-gradient-move" style={{ background: `linear-gradient(120deg, ${T.mint}, ${T.lavender}, ${T.mintSoft})` }}>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1.5">
                <WIcon size={16} color={T.navy} />
                <span className="text-xs font-semibold" style={{ color: T.navy }}>{weather ? `${weather.label} · ${weather.city}` : "Memuat cuaca…"}</span>
              </div>
              <p className="font-extrabold text-[34px] leading-tight mt-1" style={{ ...fontDisplay, color: T.navy }}>{weather ? `${weather.tempC}°` : "—"}</p>
              <p className="text-xs" style={{ color: "rgba(27,31,59,.7)" }}>{weather?.desc || "Menyiapkan rekomendasi…"}</p>
            </div>
            <div className="w-24 h-24 rounded-2xl overflow-hidden flex items-center justify-center cc-float" style={{ background: "rgba(255,255,255,.35)" }}>
              {todayOutfit ? (
                <div className="flex flex-wrap gap-0.5 p-1 justify-center">
                  {[todayOutfit.top, todayOutfit.bottom, todayOutfit.shoe].filter(Boolean).slice(0, 3).map((it) => (
                    <img key={it.id} src={it.image} className="w-9 h-9 rounded-md object-cover" />
                  ))}
                </div>
              ) : <Sparkles size={30} color={T.navy} />}
            </div>
          </div>
          <button onClick={() => go("outfit")} className="cc-press cc-sheen mt-4 w-full rounded-2xl py-3 font-bold flex items-center justify-center gap-2" style={{ background: T.navy, color: "#fff" }}>
            {todayOutfit ? "Lihat outfit hari ini" : "Buat outfit pertamaku"} <ArrowRight size={16} />
          </button>
        </div>

        {/* quick stats */}
        <div className="flex gap-2.5">
          <MiniStat label="Item" value={items.length} onClick={() => go("wardrobe")} />
          <MiniStat label="Dipakai" value={totalWears} onClick={() => go("dashboard")} />
          <MiniStat label="Skor gaya" value={Math.round(score.overall)} onClick={() => go("rank")} />
        </div>

        {/* shortcuts */}
        <div>
          <p className="font-bold text-sm mb-2.5 px-1" style={{ ...fontDisplay, color: T.navy }}>Jelajahi</p>
          <div className="grid grid-cols-3 gap-2.5">
            {shortcuts.map((s) => (
              <button key={s.key} onClick={() => go(s.key)} className="cc-press rounded-2xl py-4 flex flex-col items-center gap-2" style={{ background: T.white, boxShadow: "0 8px 20px -14px rgba(27,31,59,.3)" }}>
                <span className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ background: `${s.tint}2e` }}>
                  <s.icon size={20} color={T.navy} />
                </span>
                <span className="text-xs font-semibold" style={{ color: T.navy }}>{s.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Kai teaser */}
        <button onClick={() => go("kai")} className="cc-press rounded-3xl p-4 flex items-center gap-3 text-left" style={{ background: `linear-gradient(120deg, ${T.mintLight}, #F3EEFB)` }}>
          <span className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0" style={{ background: `linear-gradient(135deg, ${T.mint}, ${T.lavender})` }}>
            <MessageCircle size={22} color={T.navy} />
          </span>
          <div className="flex-1">
            <p className="font-bold text-sm" style={{ color: T.navy }}>Bingung mau pakai apa?</p>
            <p className="text-xs" style={{ color: T.navySoft }}>Tanya Kai — stylist pribadimu, siap 24/7.</p>
          </div>
          <ChevronRight size={18} color={T.navySoft} />
        </button>
      </div>
    </div>
  );
}

function MiniStat({ label, value, onClick }) {
  return (
    <button onClick={() => { sound.tap(); onClick(); }} className="cc-press flex-1 rounded-2xl p-3 text-left" style={{ background: T.white, boxShadow: "0 8px 20px -14px rgba(27,31,59,.3)" }}>
      <p className="font-extrabold text-2xl leading-none" style={{ ...fontDisplay, color: T.navy }}>{value}</p>
      <p className="text-[11px] mt-1" style={{ color: T.navySoft }}>{label}</p>
    </button>
  );
}
