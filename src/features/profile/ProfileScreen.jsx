import { useMemo, useRef } from "react";
import { Settings as Cog, Camera, Crown, ChevronRight, Users, MessageCircle, Store, CalendarDays, Wallet, BarChart3, Sparkles, ShoppingBag } from "lucide-react";
import { T, fontDisplay } from "../../theme/tokens";
import { TierBadge } from "../../components/TierBadge";
import { computeStyleScore } from "../../lib/scoring";
import { sound } from "../../lib/sound";

/* Profil difokuskan ke identitas + sosial + preview lemari + akses fitur.
 * Semua pengaturan pindah ke layar Settings (ikon gerigi). */
export function ProfileScreen({ profile, setProfile, follows = [], items, swapRequests = [], plan, settings, onNavigate }) {
  const avatarRef = useRef(null);
  const dark = settings?.appearance === "dark";
  const name = profile?.name || "Kamu";
  const email = profile?.email || "kamu@closetcloud.id";
  const initials = name.trim().split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase() || "K";
  const followers = 128 + follows.length * 3;

  const score = useMemo(() => computeStyleScore(items), [items]);
  const outfitsGenerated = items.reduce((s, i) => s + i.wearCount, 0);
  const completedSwaps = swapRequests.filter((r) => r.status === "selesai").length;
  const moneySaved = Math.round(outfitsGenerated * 15000 + completedSwaps * 75000);

  const changeAvatar = (file) => {
    if (!file || !file.type.startsWith("image/") || !setProfile) return;
    const reader = new FileReader();
    reader.onload = (e) => setProfile({ ...(profile || {}), avatar: e.target.result });
    reader.readAsDataURL(file);
  };

  const bg = dark ? "#1B1F3B" : T.bg;
  const cardBg = dark ? "#252A4D" : T.white;
  const textMain = dark ? "#fff" : T.navy;
  const textSub = dark ? "rgba(255,255,255,0.6)" : T.navySoft;

  const features = [
    { key: "community", label: "Komunitas", icon: Users, tint: "#8FB8DE" },
    { key: "kai", label: "Ajax", icon: MessageCircle, tint: T.lavenderDeep },
    { key: "thrift", label: "Thrift", icon: Store, tint: T.coral },
    { key: "scheduler", label: "Jadwal", icon: CalendarDays, tint: T.sage },
    { key: "analytics", label: "Cost/Wear", icon: Wallet, tint: T.lavender },
    { key: "dashboard", label: "Insight", icon: BarChart3, tint: T.mint },
  ];
  const preview = items.slice(0, 6);
  const go = (r) => { sound.tap(); onNavigate(r); };

  return (
    <div className="pb-28" style={{ background: bg, minHeight: "100vh" }}>
      <div className="px-4 pt-6 pb-3 flex items-center justify-between">
        <p className="font-extrabold text-2xl" style={{ ...fontDisplay, color: textMain }}>Profil</p>
        <button onClick={() => go("settings")} className="cc-press w-10 h-10 rounded-full flex items-center justify-center" style={{ background: cardBg, boxShadow: "0 6px 16px -8px rgba(27,31,59,.25)" }} aria-label="Pengaturan">
          <Cog size={19} color={textMain} />
        </button>
      </div>

      {/* Identitas + sosial */}
      <div className="px-4">
        <div className="rounded-3xl p-5" style={{ background: dark ? "#252A4D" : `linear-gradient(135deg, ${T.mintLight}, #F3EEFB)` }}>
          <input ref={avatarRef} type="file" accept="image/*" className="hidden" onChange={(e) => changeAvatar(e.target.files[0])} />
          <div className="flex items-center gap-4 mb-3">
            <button onClick={() => avatarRef.current?.click()} className="cc-press relative w-[68px] h-[68px] rounded-full overflow-hidden flex items-center justify-center font-extrabold text-xl shrink-0" style={{ ...fontDisplay, background: profile?.avatar ? "transparent" : `linear-gradient(135deg, ${T.mint}, ${T.lavender})`, color: T.navy }}>
              {profile?.avatar ? <img src={profile.avatar} className="w-full h-full object-cover" /> : initials}
              <span className="absolute bottom-0 right-0 w-6 h-6 rounded-full flex items-center justify-center" style={{ background: T.navy, border: "2px solid #fff" }}><Camera size={11} color="#fff" /></span>
            </button>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-lg truncate" style={{ ...fontDisplay, color: textMain }}>{name}</p>
              <p className="text-sm truncate" style={{ color: textSub }}>{email}</p>
            </div>
          </div>
          <button onClick={() => go("community")} className="cc-press w-full flex items-center justify-around rounded-2xl py-2.5 mb-3" style={{ background: dark ? "#1B1F3B" : "rgba(255,255,255,.55)" }}>
            <Stat n={items.length} label="item" dark={dark} />
            <div className="w-px h-7" style={{ background: dark ? "#333858" : "#E3E6F0" }} />
            <Stat n={followers} label="pengikut" dark={dark} />
            <div className="w-px h-7" style={{ background: dark ? "#333858" : "#E3E6F0" }} />
            <Stat n={follows.length} label="mengikuti" dark={dark} />
          </button>
          <div className="flex gap-2 flex-wrap">
            {plan === "premium" ? (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full" style={{ background: `linear-gradient(135deg, ${T.mint}, ${T.lavender})` }}>
                <Crown size={13} color={T.navy} /><span className="font-bold text-xs" style={{ color: T.navy }}>ClosetCloud+</span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full" style={{ background: dark ? "#1B1F3B" : T.white }}>
                <span className="font-bold text-xs" style={{ color: textSub }}>Paket Free</span>
              </div>
            )}
            <TierBadge tier={score.tier} size="lg" />
          </div>
        </div>
      </div>

      {/* Dampak (highlight ringkas) */}
      <div className="px-4 mt-3 flex gap-2.5">
        <Highlight icon={Sparkles} value={outfitsGenerated} label="outfit dipakai" dark={dark} cardBg={cardBg} textMain={textMain} textSub={textSub} />
        <Highlight icon={Wallet} value={`Rp${(moneySaved / 1000).toFixed(0)}rb`} label="hemat" dark={dark} cardBg={cardBg} textMain={textMain} textSub={textSub} />
      </div>

      {/* Preview lemari */}
      <div className="px-4 mt-5">
        <div className="flex items-center justify-between mb-2.5">
          <p className="font-bold text-sm" style={{ ...fontDisplay, color: textMain }}>Lemarimu</p>
          <button onClick={() => go("wardrobe")} className="cc-press flex items-center gap-0.5 text-xs font-semibold" style={{ color: T.lavenderDeep }}>Lihat semua <ChevronRight size={13} /></button>
        </div>
        {preview.length === 0 ? (
          <button onClick={() => go("wardrobe")} className="cc-press w-full rounded-2xl py-8 flex flex-col items-center gap-2" style={{ background: cardBg, border: dark ? "none" : "1px dashed #C9CCD8" }}>
            <ShoppingBag size={22} color={T.lavenderDeep} />
            <span className="text-sm font-semibold" style={{ color: textMain }}>Belum ada item — yuk scan baju</span>
          </button>
        ) : (
          <div className="grid grid-cols-3 gap-2.5">
            {preview.map((it) => (
              <button key={it.id} onClick={() => go("wardrobe")} className="cc-press rounded-2xl overflow-hidden" style={{ boxShadow: "0 8px 18px -14px rgba(27,31,59,.3)" }}>
                <img src={it.image} className="w-full h-24 object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Akses fitur */}
      <div className="px-4 mt-5">
        <p className="font-bold text-sm mb-2.5" style={{ ...fontDisplay, color: textMain }}>Fitur kamu</p>
        <div className="grid grid-cols-3 gap-2.5">
          {features.map((f) => (
            <button key={f.key} onClick={() => go(f.key)} className="cc-press rounded-2xl py-4 flex flex-col items-center gap-2" style={{ background: cardBg, boxShadow: dark ? "none" : "0 8px 20px -16px rgba(27,31,59,.3)", border: dark ? "1px solid #333858" : "none" }}>
              <span className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ background: `${f.tint}2e` }}><f.icon size={20} color={dark ? "#fff" : T.navy} /></span>
              <span className="text-xs font-semibold text-center" style={{ color: textMain }}>{f.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function Stat({ n, label, dark }) {
  return (
    <div className="text-center px-2">
      <p className="font-extrabold text-base leading-none" style={{ ...fontDisplay, color: dark ? "#fff" : T.navy }}>{n >= 1000 ? `${(n / 1000).toFixed(1)}rb` : n}</p>
      <p className="text-[11px] mt-0.5" style={{ color: dark ? "rgba(255,255,255,0.6)" : T.navySoft }}>{label}</p>
    </div>
  );
}

function Highlight({ icon: Icon, value, label, cardBg, textMain, textSub, dark }) {
  return (
    <div className="flex-1 rounded-2xl p-3.5" style={{ background: cardBg, boxShadow: dark ? "none" : "0 8px 20px -16px rgba(27,31,59,.3)" }}>
      <Icon size={17} color={T.lavenderDeep} />
      <p className="font-extrabold text-lg mt-1.5" style={{ ...fontDisplay, color: textMain }}>{value}</p>
      <p className="text-[11px]" style={{ color: textSub }}>{label}</p>
    </div>
  );
}
