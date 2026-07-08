import { useState } from "react";
import { Trophy, Search } from "lucide-react";
import { T } from "../../theme/tokens";
import { Header } from "../../components/ui";
import { RankScreen } from "../rank/RankScreen";
import { DiscoverScreen } from "./DiscoverScreen";
import { sound } from "../../lib/sound";

/* Gabungan Peringkat (Style Rank) + Cari/Ikuti pengguna dalam satu layar
 * bertab, biar mudah diakses & tidak terpisah-pisah. */
export function CommunityScreen({ onBack, initialTab = "peringkat", items, optIn, setOptIn, follows, setFollows, onOpenUser }) {
  const [tab, setTab] = useState(initialTab);
  const tabs = [["peringkat", "Peringkat", Trophy], ["cari", "Cari & Ikuti", Search]];

  return (
    <div className="pb-28">
      <Header title="Komunitas" subtitle="Peringkat gaya & pengguna lain" onBack={onBack} />
      <div className="px-4 flex gap-2 mb-3">
        {tabs.map(([k, l, Icon]) => (
          <button key={k} onClick={() => { sound.tap(); setTab(k); }} className="cc-press flex-1 py-2.5 rounded-2xl text-sm font-bold flex items-center justify-center gap-1.5"
            style={{ background: tab === k ? T.navy : T.white, color: tab === k ? "#fff" : T.navySoft, border: tab === k ? "none" : "1px solid #E3E6F0" }}>
            <Icon size={15} />{l}
          </button>
        ))}
      </div>
      {tab === "peringkat"
        ? <RankScreen embedded items={items} optIn={optIn} setOptIn={setOptIn} />
        : <DiscoverScreen embedded follows={follows} setFollows={setFollows} onOpenUser={onOpenUser} />}
    </div>
  );
}
