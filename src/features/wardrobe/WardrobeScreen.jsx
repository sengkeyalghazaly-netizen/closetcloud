import { useState } from "react";
import { Shirt, Camera } from "lucide-react";
import { T } from "../../theme/tokens";
import { Header, EmptyState, Chip, Button } from "../../components/ui";
import { CATEGORIES } from "../../data/reference";
import { AddItemModal } from "./AddItemModal";
import { ItemDetailModal } from "./ItemDetailModal";

/* ============ WARDROBE SCREEN (AI Wardrobe Scan) ============ */
export function WardrobeScreen({ items, setItems }) {
  const [showAdd, setShowAdd] = useState(false);
  const [filter, setFilter] = useState("Semua");
  const [selected, setSelected] = useState(null);

  const filtered = filter === "Semua" ? items : items.filter((i) => i.category === filter);

  return (
    <div className="pb-24">
      <Header title="Lemari Digital" subtitle={`${items.length} item tersimpan`} />
      <div className="px-4 flex gap-2 overflow-x-auto pb-2">
        <Chip active={filter === "Semua"} onClick={() => setFilter("Semua")}>Semua</Chip>
        {CATEGORIES.map((c) => <Chip key={c} active={filter === c} onClick={() => setFilter(c)}>{c}</Chip>)}
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={Shirt} title={items.length === 0 ? "Lemarimu masih kosong" : "Belum ada item di kategori ini"}
          subtitle={items.length === 0 ? "Yuk scan baju pertamamu — cukup 2 menit, AI langsung kenali detailnya." : "Coba pilih kategori lain atau scan item baru."}
          action={<Button icon={Camera} onClick={() => setShowAdd(true)}>Scan Baju</Button>} />
      ) : (
        <div className="grid grid-cols-2 gap-3 px-4 mt-3">
          {filtered.map((item) => (
            <div key={item.id} onClick={() => setSelected(item)} className="rounded-2xl overflow-hidden cursor-pointer relative" style={{ background: T.white, boxShadow: "0 6px 18px -10px rgba(27,31,59,0.2)" }}>
              <img src={item.image} className="w-full h-32 object-cover" />
              {item.flag && (
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ background: item.flag === "donate" ? T.sage : T.coral, color: T.white }}>
                  {item.flag === "donate" ? "Donasi" : "Dijual"}
                </div>
              )}
              <div className="p-2.5">
                <p className="text-sm font-semibold truncate" style={{ color: T.navy }}>{item.name}</p>
                <p className="text-xs" style={{ color: T.navySoft }}>{item.wearCount}× dipakai</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {items.length > 0 && (
        <button onClick={() => setShowAdd(true)} className="fixed bottom-24 right-5 w-14 h-14 rounded-full flex items-center justify-center shadow-lg"
          style={{ background: `linear-gradient(135deg, ${T.mint}, ${T.lavender})` }}>
          <Camera size={22} color={T.navy} />
        </button>
      )}

      {showAdd && <AddItemModal onClose={() => setShowAdd(false)} onSave={(item) => { setItems([item, ...items]); setShowAdd(false); }} />}
      {selected && <ItemDetailModal item={selected} onClose={() => setSelected(null)} onDelete={(id) => { setItems(items.filter((i) => i.id !== id)); setSelected(null); }} />}
    </div>
  );
}
