import { useState } from "react";
import { Search, MapPin, UserPlus, UserCheck } from "lucide-react";
import { T } from "../../theme/tokens";
import { Header } from "../../components/ui";
import { TierBadge } from "../../components/TierBadge";
import { searchUsers } from "../../data/community";
import { sound } from "../../lib/sound";

export function DiscoverScreen({ onOpenUser, onBack, follows, setFollows }) {
  const [q, setQ] = useState("");
  const results = searchUsers(q);
  const isFollowing = (u) => follows.includes(u.handle);
  const toggleFollow = (u) => {
    sound.tap();
    setFollows(isFollowing(u) ? follows.filter((h) => h !== u.handle) : [...follows, u.handle]);
  };

  return (
    <div className="pb-28">
      <Header title="Jelajah Komunitas" subtitle="Cari & ikuti gaya orang lain" onBack={onBack} />
      <div className="px-4">
        <div className="flex items-center gap-2.5 rounded-2xl px-4 mb-4" style={{ background: T.white, border: "1.5px solid #E3E6F0" }}>
          <Search size={18} color={T.navySoft} />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cari nama, @handle, atau kota…"
            className="flex-1 py-3 outline-none text-[15px] bg-transparent" style={{ color: T.navy }} />
        </div>

        {results.length === 0 ? (
          <p className="text-center text-sm mt-10" style={{ color: T.navySoft }}>Tidak ada pengguna cocok dengan "{q}".</p>
        ) : (
          <div className="flex flex-col gap-2.5 cc-stagger">
            {results.map((u) => (
              <div key={u.handle} className="rounded-2xl p-3 flex items-center gap-3" style={{ background: T.white, boxShadow: "0 8px 20px -16px rgba(27,31,59,.35)" }}>
                <button onClick={() => { sound.tap(); onOpenUser(u); }} className="cc-press w-12 h-12 rounded-full flex items-center justify-center font-bold shrink-0" style={{ background: u.color, color: T.navy }}>{u.initials}</button>
                <button onClick={() => { sound.tap(); onOpenUser(u); }} className="flex-1 min-w-0 text-left">
                  <div className="flex items-center gap-1.5">
                    <p className="font-bold text-sm truncate" style={{ color: T.navy }}>{u.name}</p>
                    <TierBadge tier={u.tier} />
                  </div>
                  <p className="text-xs" style={{ color: T.navySoft }}>{u.handle}</p>
                  <p className="text-[11px] flex items-center gap-1" style={{ color: T.navySoft }}><MapPin size={10} />{u.city} · {u.followers.toLocaleString("id-ID")} pengikut</p>
                </button>
                <button onClick={() => toggleFollow(u)} className="cc-press flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold shrink-0"
                  style={{ background: isFollowing(u) ? T.mintLight : T.navy, color: isFollowing(u) ? T.sage : "#fff" }}>
                  {isFollowing(u) ? <><UserCheck size={13} />Diikuti</> : <><UserPlus size={13} />Ikuti</>}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
