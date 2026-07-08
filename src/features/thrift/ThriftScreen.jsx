import { useState } from "react";
import { X, Check, MapPin, Star, Tag, Store, Navigation, ExternalLink, ShoppingBag, Banknote, Clock } from "lucide-react";
import { T, fontDisplay } from "../../theme/tokens";
import { Header, Card, Chip, Button, EmptyState } from "../../components/ui";
import { GarmentPhoto } from "../../components/illustrations";
import { CATEGORIES } from "../../data/reference";
import { THRIFT_LISTINGS, B2B_ADS, CONDITIONS, suggestedPrice, adForCategory } from "../../data/thrift";
import { MOCK_USERS } from "../../data/mock";
import { sound } from "../../lib/sound";

const rp = (n) => `Rp ${Number(n).toLocaleString("id-ID")}`;

function Garment({ item, size = "w-full h-36" }) {
  return <GarmentPhoto category={item?.category} color={item?.color} photoKey={item?.id} size={size} />;
}

/* ---- Sponsored B2B ad card (inline, jelas ditandai, tidak popup) ---- */
function AdCard({ ad }) {
  return (
    <div className="rounded-3xl overflow-hidden" style={{ border: `1.5px solid ${ad.accent}22`, background: T.white, boxShadow: "0 10px 24px -18px rgba(27,31,59,.35)" }}>
      <div className="flex items-center justify-between px-4 py-2" style={{ background: ad.accent }}>
        <span className="font-extrabold tracking-wide text-sm" style={{ ...fontDisplay, color: "#fff" }}>{ad.brand}</span>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: "rgba(255,255,255,.22)", color: "#fff" }}>Sponsored</span>
      </div>
      <div className="p-4 flex items-center gap-3">
        <GarmentPhoto category={ad.category} photoKey={ad.brand} size="w-16 h-16" />
        <div className="flex-1">
          <p className="text-[11px] font-semibold" style={{ color: T.navySoft }}>{ad.tagline}</p>
          <p className="font-bold text-sm" style={{ color: T.navy }}>{ad.item}</p>
          <p className="text-sm font-extrabold" style={{ color: ad.accent }}>{rp(ad.price)}</p>
        </div>
        <a href={ad.url} target="_blank" rel="noopener noreferrer" onClick={() => sound.tap()} className="cc-press flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold" style={{ background: T.navy, color: "#fff" }}>
          Lihat <ExternalLink size={13} />
        </a>
      </div>
      <p className="text-[10px] px-4 pb-3" style={{ color: T.navySoft }}>Partner B2B ClosetCloud · dari lemarimu, sebelum beli baru pertimbangkan preloved dulu.</p>
    </div>
  );
}

/* ---- Buy modal with location share ---- */
function BuyModal({ listing, onClose, onBuy }) {
  const [loc, setLoc] = useState(null);
  const [locBusy, setLocBusy] = useState(false);
  const cities = ["Manado", "Jakarta", "Surabaya", "Bandung", "Bekasi"];

  const shareGPS = () => {
    setLocBusy(true);
    if (!navigator.geolocation) { setLoc(listing.owner.city); setLocBusy(false); return; }
    navigator.geolocation.getCurrentPosition(
      (p) => { setLoc(`Lokasimu (${p.coords.latitude.toFixed(2)}, ${p.coords.longitude.toFixed(2)})`); setLocBusy(false); sound.select(); },
      () => { setLocBusy(false); },
      { timeout: 6000 }
    );
  };

  return (
    <div className="fixed inset-0 z-[55] flex items-end sm:items-center justify-center" style={{ background: "rgba(27,31,59,0.55)" }}>
      <div className="w-full sm:max-w-sm rounded-t-3xl sm:rounded-3xl p-5 max-h-[92vh] overflow-y-auto" style={{ background: T.bg }}>
        <div className="flex justify-end"><button onClick={onClose} className="cc-press p-2 rounded-full" style={{ background: T.white }}><X size={18} /></button></div>
        <Garment item={listing} size="w-full h-44" />
        <p className="font-bold text-lg mt-3" style={{ ...fontDisplay, color: T.navy }}>{listing.name}</p>
        <div className="flex items-center gap-2 mt-1 mb-3">
          <span className="font-extrabold text-xl" style={{ color: T.navy }}>{rp(listing.price)}</span>
          <span className="text-sm line-through" style={{ color: T.navySoft }}>{rp(listing.orig)}</span>
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full" style={{ background: T.mintLight, color: T.sage }}>-{Math.round((1 - listing.price / listing.orig) * 100)}%</span>
        </div>
        <div className="flex gap-2 flex-wrap mb-3">
          <Chip active color={T.mint}>{listing.category}</Chip>
          <Chip active color="#EAE0F5">Ukuran {listing.size}</Chip>
          <Chip active color={T.lavender}>{listing.condition}</Chip>
        </div>
        <Card className="flex items-center gap-3 mb-3" style={{ display: "flex" }}>
          <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm" style={{ background: listing.owner.color, color: T.navy }}>{listing.owner.initials}</div>
          <div className="flex-1">
            <p className="text-sm font-semibold" style={{ color: T.navy }}>{listing.owner.name}</p>
            <div className="flex items-center gap-2 text-xs" style={{ color: T.navySoft }}>
              <span className="flex items-center gap-0.5"><MapPin size={11} />{listing.owner.city}</span>
              <span className="flex items-center gap-0.5"><Star size={11} fill={T.lavenderDeep} color={T.lavenderDeep} />{listing.owner.rating}</span>
            </div>
          </div>
        </Card>

        {/* share location */}
        <div className="rounded-2xl p-3 mb-3" style={{ background: T.white, border: "1px solid #E3E6F0" }}>
          <p className="text-xs font-bold mb-2" style={{ color: T.navy }}>Lokasi ketemuan (COD)</p>
          {loc ? (
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: T.mintLight }}>
              <Navigation size={14} color={T.sage} /><span className="text-xs font-semibold flex-1" style={{ color: T.navy }}>{loc}</span>
              <button onClick={() => setLoc(null)} className="text-xs font-bold" style={{ color: T.coral }}>Ubah</button>
            </div>
          ) : (
            <>
              <button onClick={shareGPS} className="cc-press w-full flex items-center justify-center gap-2 rounded-xl py-2.5 mb-2 text-sm font-semibold" style={{ background: T.navy, color: "#fff" }}>
                <Navigation size={15} />{locBusy ? "Mengambil lokasi…" : "Bagikan lokasi GPS"}
              </button>
              <div className="flex gap-1.5 flex-wrap">
                {cities.map((c) => <button key={c} onClick={() => { sound.tap(); setLoc(c); }} className="cc-press px-3 py-1.5 rounded-full text-xs font-medium" style={{ background: T.mintLight, color: T.navy }}>{c}</button>)}
              </div>
            </>
          )}
        </div>

        <Button full disabled={!loc} icon={Banknote} onClick={() => { sound.success(); onBuy(loc); }}>{loc ? `Beli — ${rp(listing.price)}` : "Pilih lokasi ketemuan dulu"}</Button>
        <p className="text-[11px] text-center mt-2" style={{ color: T.navySoft }}>Pembayaran ditahan ClosetCloud sampai barang diterima (mock).</p>
      </div>
    </div>
  );
}

/* ---- Sell setup modal ---- */
function SellModal({ item, onClose, onList }) {
  const [price, setPrice] = useState(String(suggestedPrice(item.price)));
  const [condition, setCondition] = useState(CONDITIONS[1]);
  return (
    <div className="fixed inset-0 z-[55] flex items-end sm:items-center justify-center" style={{ background: "rgba(27,31,59,0.55)" }}>
      <div className="w-full sm:max-w-sm rounded-t-3xl sm:rounded-3xl p-5" style={{ background: T.bg }}>
        <div className="flex items-center justify-between mb-3">
          <p className="font-bold text-lg" style={{ ...fontDisplay, color: T.navy }}>Jual "{item.name}"</p>
          <button onClick={onClose} className="cc-press p-2 rounded-full" style={{ background: T.white }}><X size={18} /></button>
        </div>
        <img src={item.image} className="w-full h-40 object-cover rounded-2xl mb-3" />
        <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl mb-3" style={{ background: T.mintLight }}>
          <Tag size={15} color={T.sage} />
          <span className="text-xs" style={{ color: T.navy }}>Saran harga preloved: <b>{rp(suggestedPrice(item.price))}</b> (dari harga beli {rp(item.price)})</span>
        </div>
        <label className="text-xs font-bold" style={{ color: T.navySoft }}>Harga jual</label>
        <input value={price} onChange={(e) => setPrice(e.target.value.replace(/\D/g, ""))} inputMode="numeric"
          className="w-full mt-1.5 mb-3 px-4 py-3 rounded-2xl outline-none text-[15px]" style={{ background: T.white, border: "1.5px solid #E3E6F0", color: T.navy }} />
        <label className="text-xs font-bold" style={{ color: T.navySoft }}>Kondisi</label>
        <div className="flex gap-2 flex-wrap mt-1.5 mb-4">
          {CONDITIONS.map((c) => <Chip key={c} active={condition === c} onClick={() => setCondition(c)}>{c}</Chip>)}
        </div>
        <Button full icon={Check} onClick={() => { sound.success(); onList(Number(price) || suggestedPrice(item.price), condition); }}>Pasang di Thrift</Button>
      </div>
    </div>
  );
}

/* ============ THRIFT SCREEN ============ */
export function ThriftScreen({ items, setItems, thriftOrders, setThriftOrders, onBack }) {
  const [subTab, setSubTab] = useState("jelajahi");
  const [categoryFilter, setCategoryFilter] = useState("Semua");
  const [cityFilter, setCityFilter] = useState("Semua");
  const [buyItem, setBuyItem] = useState(null);
  const [sellItem, setSellItem] = useState(null);

  const cities = ["Semua", ...new Set(MOCK_USERS.map((u) => u.city))];
  const feed = THRIFT_LISTINGS.filter((i) =>
    (categoryFilter === "Semua" || i.category === categoryFilter) &&
    (cityFilter === "Semua" || i.owner.city === cityFilter));

  const myListings = items.filter((i) => i.saleActive);

  const buy = (location) => {
    setThriftOrders((prev) => [{ id: `to-${Date.now()}`, listing: buyItem, status: "disepakati", location, at: new Date().toISOString() }, ...prev]);
    setBuyItem(null);
    setSubTab("transaksi");
  };
  const listForSale = (price, condition) => {
    setItems(items.map((x) => x.id === sellItem.id ? { ...x, saleActive: true, salePrice: price, saleCondition: condition } : x));
    setSellItem(null);
  };

  return (
    <div className="pb-28">
      <Header title="Thrift" subtitle="Jual & beli preloved, hemat + berkelanjutan" onBack={onBack} />
      <div className="px-4 flex gap-2 mb-3">
        {[["jelajahi", "Beli"], ["jual", "Jual Barang"], ["transaksi", "Transaksi"]].map(([k, l]) => (
          <button key={k} onClick={() => { sound.tap(); setSubTab(k); }} className="cc-press flex-1 py-2 rounded-xl text-sm font-semibold"
            style={{ background: subTab === k ? T.navy : T.white, color: subTab === k ? "#fff" : T.navySoft, border: subTab === k ? "none" : "1px solid #E3E6F0" }}>{l}</button>
        ))}
      </div>

      {subTab === "jelajahi" && (
        <div className="px-4">
          <div className="flex gap-2 overflow-x-auto cc-noscroll pb-2">
            <Chip active={categoryFilter === "Semua"} onClick={() => setCategoryFilter("Semua")}>Semua</Chip>
            {CATEGORIES.map((c) => <Chip key={c} active={categoryFilter === c} onClick={() => setCategoryFilter(c)}>{c}</Chip>)}
          </div>
          <div className="flex gap-2 overflow-x-auto cc-noscroll pb-3">
            {cities.map((c) => <Chip key={c} active={cityFilter === c} color={T.lavender} onClick={() => setCityFilter(c)}>{c}</Chip>)}
          </div>

          {feed.length === 0 ? (
            <EmptyState icon={Store} title="Belum ada barang" subtitle="Coba ubah filter kategori atau kota." action={null} />
          ) : (
            <div className="flex flex-col gap-3 cc-stagger">
              {feed.map((it, idx) => (
                <div key={it.id}>
                  <button onClick={() => { sound.tap(); setBuyItem(it); }} className="cc-press w-full text-left rounded-3xl overflow-hidden flex gap-3 p-3" style={{ background: T.white, boxShadow: "0 10px 24px -18px rgba(27,31,59,.35)" }}>
                    <Garment item={it} size="w-24 h-24 shrink-0" />
                    <div className="flex-1 min-w-0 py-0.5">
                      <p className="font-bold text-sm truncate" style={{ color: T.navy }}>{it.name}</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="font-extrabold text-[15px]" style={{ color: T.navy }}>{rp(it.price)}</span>
                        <span className="text-xs line-through" style={{ color: T.navySoft }}>{rp(it.orig)}</span>
                      </div>
                      <p className="text-[11px] mt-1" style={{ color: T.navySoft }}>{it.condition} · Ukuran {it.size}</p>
                      <p className="text-[11px] flex items-center gap-1 mt-0.5" style={{ color: T.navySoft }}><MapPin size={10} />{it.owner.city} · {it.owner.name.split(" ")[0]}</p>
                    </div>
                  </button>
                  {idx % 3 === 2 && <div className="mt-3"><AdCard ad={adForCategory(feed[idx].category)} /></div>}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {subTab === "jual" && (
        <div className="px-4">
          {items.length === 0 ? (
            <EmptyState icon={ShoppingBag} title="Lemari masih kosong" subtitle="Scan baju dulu di tab Lemari sebelum menjualnya." action={null} />
          ) : (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl mb-1" style={{ background: T.mintLight }}>
                <Tag size={15} color={T.sage} />
                <span className="text-xs" style={{ color: T.navy }}>ClosetCloud menyarankan harga otomatis dari harga belimu. {myListings.length} barang aktif dijual.</span>
              </div>
              {items.map((it) => (
                <Card key={it.id} className="flex items-center gap-3" style={{ display: "flex" }}>
                  <img src={it.image} className="w-12 h-12 rounded-xl object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate" style={{ color: T.navy }}>{it.name}</p>
                    {it.saleActive ? (
                      <span className="text-xs font-semibold flex items-center gap-1" style={{ color: T.sage }}><Tag size={12} />Dijual {rp(it.salePrice)} · {it.saleCondition}</span>
                    ) : (
                      <span className="text-xs" style={{ color: T.navySoft }}>Saran: {rp(suggestedPrice(it.price))}</span>
                    )}
                  </div>
                  {it.saleActive ? (
                    <Button variant="outline" onClick={() => setItems(items.map((x) => x.id === it.id ? { ...x, saleActive: false } : x))} style={{ padding: "6px 12px", fontSize: 12, color: T.coral, borderColor: T.coral }}>Tarik</Button>
                  ) : (
                    <Button icon={Tag} onClick={() => { sound.tap(); setSellItem(it); }} style={{ padding: "6px 12px", fontSize: 12 }}>Jual</Button>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {subTab === "transaksi" && (
        <div className="px-4">
          {thriftOrders.length === 0 ? (
            <EmptyState icon={Clock} title="Belum ada transaksi" subtitle="Beli barang preloved dari tab Beli untuk mulai." action={null} />
          ) : (
            <div className="flex flex-col gap-3">
              {thriftOrders.map((o) => (
                <Card key={o.id} className="flex gap-3" style={{ display: "flex" }}>
                  <Garment item={o.listing} size="w-14 h-14 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate" style={{ color: T.navy }}>{o.listing.name}</p>
                    <p className="text-xs" style={{ color: T.navySoft }}>{rp(o.listing.price)} · dari {o.listing.owner.name.split(" ")[0]}</p>
                    <div className="flex items-center gap-1 mt-1"><MapPin size={11} color={T.sage} /><span className="text-[11px]" style={{ color: T.navySoft }}>{o.location}</span></div>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold mt-1.5" style={{ background: T.mintLight, color: T.sage }}><Check size={12} />Deal disepakati</span>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {buyItem && <BuyModal listing={buyItem} onClose={() => setBuyItem(null)} onBuy={buy} />}
      {sellItem && <SellModal item={sellItem} onClose={() => setSellItem(null)} onList={listForSale} />}
    </div>
  );
}
