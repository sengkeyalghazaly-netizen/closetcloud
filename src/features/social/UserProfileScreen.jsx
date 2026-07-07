import { MapPin, UserPlus, UserCheck, Grid3x3, Lock } from "lucide-react";
import { T, fontDisplay } from "../../theme/tokens";
import { Header } from "../../components/ui";
import { TierBadge } from "../../components/TierBadge";
import { GarmentImage } from "../../components/illustrations";
import { sound } from "../../lib/sound";

/* Lihat profil + isi lemari pengguna lain (yang di-publish). */
export function UserProfileScreen({ user, follows, setFollows, onBack }) {
  if (!user) return <div className="pb-28"><Header title="Profil" subtitle="" onBack={onBack} /></div>;
  const following = follows.includes(user.handle);
  const toggleFollow = () => { sound.select(); setFollows(following ? follows.filter((h) => h !== user.handle) : [...follows, user.handle]); };

  return (
    <div className="pb-28">
      <Header title={user.name} subtitle={user.handle} onBack={onBack} />
      <div className="px-4">
        <div className="rounded-3xl p-5" style={{ background: `linear-gradient(135deg, ${T.mintLight}, #F3EEFB)` }}>
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full flex items-center justify-center font-extrabold text-2xl shrink-0" style={{ ...fontDisplay, background: user.color, color: T.navy }}>{user.initials}</div>
            <div className="flex-1">
              <div className="flex gap-4">
                <Stat n={user.wardrobe.length} label="item" />
                <Stat n={user.followers} label="pengikut" />
                <Stat n={user.following} label="mengikuti" />
              </div>
            </div>
          </div>
          <p className="text-sm mt-3" style={{ color: T.navy }}>{user.bio}</p>
          <div className="flex items-center gap-2 mt-2">
            <TierBadge tier={user.tier} size="lg" />
            <span className="text-xs flex items-center gap-1" style={{ color: T.navySoft }}><MapPin size={11} />{user.city}</span>
          </div>
          <button onClick={toggleFollow} className="cc-press cc-sheen w-full mt-4 py-2.5 rounded-2xl font-bold flex items-center justify-center gap-2"
            style={{ background: following ? T.white : T.navy, color: following ? T.navy : "#fff", border: following ? "1.5px solid #E3E6F0" : "none" }}>
            {following ? <><UserCheck size={16} />Mengikuti</> : <><UserPlus size={16} />Ikuti</>}
          </button>
        </div>

        <div className="flex items-center gap-1.5 mt-5 mb-3">
          <Grid3x3 size={16} color={T.navy} />
          <p className="font-bold text-sm" style={{ ...fontDisplay, color: T.navy }}>Lemari {user.name.split(" ")[0]}</p>
          <span className="text-xs" style={{ color: T.navySoft }}>· publik</span>
        </div>
        <div className="grid grid-cols-3 gap-2.5 cc-stagger">
          {user.wardrobe.map((it) => (
            <div key={it.id} className="cc-pop-in rounded-2xl overflow-hidden" style={{ boxShadow: "0 8px 18px -14px rgba(27,31,59,.3)" }}>
              <GarmentImage category={it.category} color={it.color} size="w-full h-28" />
              <div className="px-2 py-1.5" style={{ background: T.white }}>
                <p className="text-[11px] font-semibold truncate" style={{ color: T.navy }}>{it.name}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 mt-5 px-3 py-2.5 rounded-xl" style={{ background: T.mintLight }}>
          <Lock size={14} color={T.sage} />
          <span className="text-[11px]" style={{ color: T.navy }}>Hanya item yang dipublikasikan {user.name.split(" ")[0]} yang tampil. Harga & item privat tidak dibagikan.</span>
        </div>
      </div>
    </div>
  );
}

function Stat({ n, label }) {
  return (
    <div className="text-center">
      <p className="font-extrabold text-lg leading-none" style={{ ...fontDisplay, color: T.navy }}>{n >= 1000 ? `${(n / 1000).toFixed(1)}rb` : n}</p>
      <p className="text-[11px]" style={{ color: T.navySoft }}>{label}</p>
    </div>
  );
}
