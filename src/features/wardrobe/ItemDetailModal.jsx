import { X, Trash2 } from "lucide-react";
import { T, fontDisplay } from "../../theme/tokens";
import { Chip, Button, Card } from "../../components/ui";

/* ============ ITEM DETAIL MODAL ============ */
export function ItemDetailModal({ item, onClose, onDelete }) {
  const cpw = item.wearCount > 0 ? Math.round(item.price / item.wearCount) : null;
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" style={{ background: "rgba(27,31,59,0.55)" }}>
      <div className="w-full sm:max-w-sm rounded-t-3xl sm:rounded-3xl p-5" style={{ background: T.bg }}>
        <div className="flex justify-end"><button onClick={onClose} className="p-2 rounded-full" style={{ background: T.white }}><X size={18} /></button></div>
        <img src={item.image} className="w-full h-56 object-cover rounded-2xl mb-4" />
        <p className="font-bold text-lg" style={{ ...fontDisplay, color: T.navy }}>{item.name}</p>
        <div className="flex gap-2 flex-wrap mt-2 mb-4">
          <Chip active color={T.mint}>{item.category}</Chip>
          <Chip active color={T.lavender}>{item.style}</Chip>
          <Chip active color="#EAE0F5">{item.material}</Chip>
        </div>
        <div className="grid grid-cols-2 gap-3 mb-4">
          <Card style={{ background: T.mintLight }}>
            <p className="text-xs" style={{ color: T.navySoft }}>Dipakai</p>
            <p className="font-bold text-xl" style={{ ...fontDisplay, color: T.navy }}>{item.wearCount}×</p>
          </Card>
          <Card style={{ background: "#F3EEFB" }}>
            <p className="text-xs" style={{ color: T.navySoft }}>Cost-per-wear</p>
            <p className="font-bold text-xl" style={{ ...fontDisplay, color: T.navy }}>{cpw ? `Rp ${cpw.toLocaleString("id-ID")}` : "Belum dipakai"}</p>
          </Card>
        </div>
        <p className="text-xs mb-4" style={{ color: T.navySoft }}>
          {item.wearCount === 0 ? "Yuk mulai pakai biar makin 'balik modal'." :
            cpw < 20000 ? "Item ini sudah sangat worth it — sering dipakai!" : "Coba lebih sering dipakai lagi minggu ini."}
        </p>
        <Button variant="outline" full icon={Trash2} onClick={() => onDelete(item.id)} style={{ color: T.coral, borderColor: T.coral }}>Hapus dari lemari</Button>
      </div>
    </div>
  );
}
