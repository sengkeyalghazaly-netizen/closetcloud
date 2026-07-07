import { Wallet, TrendingDown, TrendingUp } from "lucide-react";
import { T, fontDisplay } from "../../theme/tokens";
import { Header, Card, EmptyState } from "../../components/ui";

/* ============ ANALYTICS SCREEN (Cost-Per-Wear) ============ */
export function AnalyticsScreen({ items }) {
  const withCpw = items.map((i) => ({ ...i, cpw: i.wearCount > 0 ? i.price / i.wearCount : null }))
    .sort((a, b) => (b.cpw ?? Infinity) - (a.cpw ?? Infinity));

  const totalValue = items.reduce((s, i) => s + i.price, 0);
  const worn = items.filter((i) => i.wearCount > 0);
  const avgCpw = worn.length ? Math.round(worn.reduce((s, i) => s + i.price / i.wearCount, 0) / worn.length) : 0;

  return (
    <div className="pb-24">
      <Header title="Cost-Per-Wear" subtitle="Nilai ekonomi tiap baju, real-time" />
      {items.length === 0 ? (
        <EmptyState icon={Wallet} title="Belum ada data" subtitle="Scan baju & mulai pakai outfit dulu supaya analitik muncul di sini." action={null} />
      ) : (
        <div className="px-4 flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
            <Card style={{ background: T.mintLight }}>
              <p className="text-xs" style={{ color: T.navySoft }}>Total nilai lemari</p>
              <p className="font-bold text-lg" style={{ ...fontDisplay, color: T.navy }}>Rp {totalValue.toLocaleString("id-ID")}</p>
            </Card>
            <Card style={{ background: "#F3EEFB" }}>
              <p className="text-xs" style={{ color: T.navySoft }}>Rata-rata cost/pakai</p>
              <p className="font-bold text-lg" style={{ ...fontDisplay, color: T.navy }}>{avgCpw ? `Rp ${avgCpw.toLocaleString("id-ID")}` : "—"}</p>
            </Card>
          </div>
          <p className="text-sm font-semibold mt-1" style={{ color: T.navy }}>Rincian per item</p>
          {withCpw.map((i) => (
            <Card key={i.id} className="flex items-center gap-3" style={{ display: "flex" }}>
              <img src={i.image} className="w-12 h-12 rounded-xl object-cover" />
              <div className="flex-1">
                <p className="text-sm font-semibold" style={{ color: T.navy }}>{i.name}</p>
                <p className="text-xs" style={{ color: T.navySoft }}>{i.wearCount}× dipakai · Rp {i.price.toLocaleString("id-ID")}</p>
              </div>
              <div className="text-right">
                {i.cpw ? (
                  <div className="flex items-center gap-1 font-bold text-sm" style={{ color: i.cpw < 20000 ? T.sage : T.coral }}>
                    {i.cpw < 20000 ? <TrendingDown size={14} /> : <TrendingUp size={14} />}
                    Rp {Math.round(i.cpw).toLocaleString("id-ID")}
                  </div>
                ) : <span className="text-xs font-medium" style={{ color: T.coral }}>Belum dipakai</span>}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
