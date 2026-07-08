import { useState, useRef } from "react";
import { Camera, X, Check, ShieldCheck, Shirt, Clock, ThumbsDown, Star, MapPin, AlertTriangle, Repeat, Users } from "lucide-react";
import { T, fontDisplay } from "../../theme/tokens";
import { Header, Card, Chip, Button, EmptyState } from "../../components/ui";
import { MOCK_USERS, MOCK_SWAP_ITEMS, DEPOSIT_AMOUNT } from "../../data/mock";
import { CATEGORIES } from "../../data/reference";
import { GarmentImage } from "../../components/illustrations";

function VerifyPhotoModal({ item, onClose, onVerified }) {
  const [photos, setPhotos] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const camRef = useRef(null);

  const handleCapture = (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) { setError("Ambil foto lewat kamera ya, bukan file lain."); return; }
    setError("");
    setUploading(true);
    setProgress(0);
    const reader = new FileReader();
    reader.onload = (e) => {
      // simulasi kompresi + upload berprogres
      let p = 0;
      const timer = setInterval(() => {
        p += 20;
        setProgress(p);
        if (p >= 100) {
          clearInterval(timer);
          setPhotos((prev) => [...prev, e.target.result]);
          setUploading(false);
        }
      }, 120);
    };
    reader.onerror = () => { setError("Gagal memuat foto, coba lagi."); setUploading(false); };
    reader.readAsDataURL(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" style={{ background: "rgba(27,31,59,0.55)" }}>
      <div className="w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl p-5 max-h-[92vh] overflow-y-auto" style={{ background: T.bg }}>
        <div className="flex items-center justify-between mb-1">
          <p className="font-bold text-lg" style={{ ...fontDisplay, color: T.navy }}>Verifikasi Foto Asli</p>
          <button onClick={onClose} className="p-2 rounded-full" style={{ background: T.white }}><X size={18} color={T.navy} /></button>
        </div>
        <p className="text-sm mb-4" style={{ color: T.navySoft }}>Foto kondisi terkini "{item.name}" langsung dari kamera (1–4 foto): jahitan, noda, atau label. Ini menjaga keaslian & kepercayaan di jaringan swap.</p>

        <div className="grid grid-cols-4 gap-2 mb-3">
          {photos.map((p, i) => (
            <div key={i} className="relative">
              <img src={p} className="w-full h-16 rounded-xl object-cover" />
              <div className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full flex items-center justify-center" style={{ background: T.sage }}><Check size={10} color="#fff" /></div>
            </div>
          ))}
          {photos.length < 4 && !uploading && (
            <button onClick={() => camRef.current?.click()} className="h-16 rounded-xl border-2 border-dashed flex items-center justify-center" style={{ borderColor: T.lavender, background: T.mintLight }}>
              <Camera size={18} color={T.lavenderDeep} />
            </button>
          )}
          {uploading && (
            <div className="h-16 rounded-xl flex flex-col items-center justify-center gap-1" style={{ background: T.white, border: "1px solid #E3E6F0" }}>
              <span className="text-[10px] font-semibold" style={{ color: T.lavenderDeep }}>{progress}%</span>
              <div className="w-10 h-1 rounded-full" style={{ background: "#EEF0F6" }}><div className="h-full rounded-full" style={{ width: `${progress}%`, background: T.mint }} /></div>
            </div>
          )}
        </div>
        <input ref={camRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => handleCapture(e.target.files[0])} />
        {error && <p className="text-sm font-medium mb-3" style={{ color: T.coral }}>{error}</p>}

        <div className="flex items-start gap-2 px-3 py-2.5 rounded-xl mb-4" style={{ background: T.mintLight }}>
          <ShieldCheck size={16} color={T.sage} className="mt-0.5 shrink-0" />
          <p className="text-xs" style={{ color: T.navy }}>Foto dari kamera in-app otomatis ditandai "Terverifikasi". Listing tanpa foto asli hanya berlabel "Belum diverifikasi".</p>
        </div>

        <Button full disabled={photos.length === 0} icon={Check} onClick={() => onVerified(photos)}>
          {photos.length === 0 ? "Ambil minimal 1 foto" : `Aktifkan Swap (${photos.length} foto terverifikasi)`}
        </Button>
      </div>
    </div>
  );
}

/* thin wrapper: depiksi garmen "foto produk" berdasarkan kategori + warna */
function GarmentPlaceholder({ item, size = "w-full h-32" }) {
  return <GarmentImage category={item?.category} color={item?.color} size={size} />;
}

function StatusBadge({ status }) {
  const map = {
    diajukan: { bg: "#FDF3E4", color: "#B8862E", label: "Diajukan", icon: Clock },
    disetujui: { bg: T.mintLight, color: T.sage, label: "Disetujui", icon: Check },
    ditolak: { bg: "#FCEEE9", color: T.coral, label: "Ditolak", icon: ThumbsDown },
    selesai: { bg: "#F3EEFB", color: T.lavenderDeep, label: "Selesai", icon: Star },
  };
  const m = map[status];
  return (
    <div className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold" style={{ background: m.bg, color: m.color }}>
      <m.icon size={12} /> {m.label}
    </div>
  );
}

function SwapItemDetailModal({ item, allItems, onClose, onRequest, requesting }) {
  const alternatives = allItems.filter((i) => i.id !== item.id && i.category === item.category && !i.locked).slice(0, 2);
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" style={{ background: "rgba(27,31,59,0.55)" }}>
      <div className="w-full sm:max-w-sm rounded-t-3xl sm:rounded-3xl p-5" style={{ background: T.bg }}>
        <div className="flex justify-end"><button onClick={onClose} className="p-2 rounded-full" style={{ background: T.white }}><X size={18} /></button></div>
        <GarmentPlaceholder item={item} size="w-full h-48" />
        <div className="flex items-center gap-2 mt-2">
          <p className="font-bold text-lg" style={{ ...fontDisplay, color: T.navy }}>{item.name}</p>
          {item.verified ? (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-0.5" style={{ background: T.mintLight, color: T.sage }}><ShieldCheck size={11} />Foto diverifikasi kamera</span>
          ) : (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ background: "#FDF3E4", color: "#B8862E" }}>Belum diverifikasi</span>
          )}
        </div>
        <div className="flex gap-2 flex-wrap mt-2 mb-3">
          <Chip active color={T.mint}>{item.category}</Chip>
          <Chip active color={T.lavender}>{item.style}</Chip>
          <Chip active color="#EAE0F5">Ukuran {item.size}</Chip>
        </div>
        {!item.verified && (
          <div className="flex items-start gap-2 px-3 py-2 rounded-xl mb-3" style={{ background: "#FDF3E4" }}>
            <AlertTriangle size={14} color="#B8862E" className="mt-0.5 shrink-0" />
            <p className="text-[11px]" style={{ color: T.navy }}>Listing lama tanpa foto asli. Pemilik didorong memperbarui dengan foto kamera untuk mendapat badge terverifikasi.</p>
          </div>
        )}
        <Card className="flex items-center gap-3 mb-3" style={{ display: "flex" }}>
          <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm" style={{ background: item.owner.color, color: T.navy }}>{item.owner.initials}</div>
          <div className="flex-1">
            <p className="text-sm font-semibold" style={{ color: T.navy }}>{item.owner.name}</p>
            <div className="flex items-center gap-2 text-xs" style={{ color: T.navySoft }}>
              <span className="flex items-center gap-0.5"><MapPin size={11} />{item.owner.city}</span>
              <span className="flex items-center gap-0.5"><Star size={11} fill={T.lavenderDeep} color={T.lavenderDeep} />{item.owner.rating}</span>
            </div>
          </div>
        </Card>
        <div className="flex items-start gap-2 px-3 py-2.5 rounded-xl mb-3" style={{ background: T.mintLight }}>
          <ShieldCheck size={16} color={T.sage} className="mt-0.5 shrink-0" />
          <p className="text-xs" style={{ color: T.navy }}>Deposit digital Rp {DEPOSIT_AMOUNT.toLocaleString("id-ID")} ditahan sementara sebagai jaminan, otomatis dikembalikan penuh setelah transaksi selesai atau jika ditolak.</p>
        </div>

        {item.locked ? (
          <>
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl mb-3" style={{ background: "#FCEEE9" }}>
              <AlertTriangle size={16} color={T.coral} />
              <p className="text-xs font-medium" style={{ color: T.navy }}>Item ini sedang dipinjam pengguna lain.</p>
            </div>
            {alternatives.length > 0 && (
              <div className="mb-2">
                <p className="text-xs font-semibold mb-2" style={{ color: T.navySoft }}>Coba yang mirip:</p>
                <div className="flex gap-2">
                  {alternatives.map((a) => (
                    <div key={a.id} className="flex-1 rounded-xl p-2" style={{ background: T.white, border: "1px solid #E3E6F0" }}>
                      <GarmentPlaceholder item={a} size="w-full h-16" />
                      <p className="text-xs font-medium mt-1 truncate" style={{ color: T.navy }}>{a.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <Button full icon={Repeat} disabled={requesting} onClick={onRequest}>
            {requesting ? "Mengajukan…" : `Ajukan Pinjam (Deposit Rp ${DEPOSIT_AMOUNT.toLocaleString("id-ID")})`}
          </Button>
        )}
      </div>
    </div>
  );
}

function RatingModal({ request, onClose, onSubmit }) {
  const [stars, setStars] = useState(5);
  const [comment, setComment] = useState("");
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" style={{ background: "rgba(27,31,59,0.55)" }}>
      <div className="w-full sm:max-w-sm rounded-t-3xl sm:rounded-3xl p-5" style={{ background: T.bg }}>
        <div className="flex items-center justify-between mb-3">
          <p className="font-bold text-lg" style={{ ...fontDisplay, color: T.navy }}>Beri Rating</p>
          <button onClick={onClose} className="p-2 rounded-full" style={{ background: T.white }}><X size={18} /></button>
        </div>
        <p className="text-sm mb-3" style={{ color: T.navySoft }}>Gimana pengalaman swap "{request.item.name}" dengan {request.item.owner.name}?</p>
        <div className="flex gap-2 justify-center mb-4">
          {[1, 2, 3, 4, 5].map((s) => (
            <button key={s} onClick={() => setStars(s)}><Star size={30} fill={s <= stars ? T.lavenderDeep : "none"} color={T.lavenderDeep} /></button>
          ))}
        </div>
        <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Komentar singkat (opsional)"
          className="w-full px-3 py-2.5 rounded-xl outline-none mb-4 resize-none" rows={3} style={{ background: T.white, border: "1px solid #E3E6F0" }} />
        <Button full icon={Check} onClick={() => onSubmit(stars, comment)}>Kirim Rating & Selesaikan</Button>
      </div>
    </div>
  );
}

/* ============ FASHION SWAP NETWORK ============ */
export function SwapScreen({ items, setItems, swapRequests, setSwapRequests, deposit, setDeposit }) {
  const [subTab, setSubTab] = useState("jelajahi");
  const [categoryFilter, setCategoryFilter] = useState("Semua");
  const [cityFilter, setCityFilter] = useState("Semua");
  const [selectedItem, setSelectedItem] = useState(null);
  const [requesting, setRequesting] = useState(false);
  const [ratingTarget, setRatingTarget] = useState(null);
  const [verifyItem, setVerifyItem] = useState(null);

  const cities = ["Semua", ...new Set(MOCK_USERS.map((u) => u.city))];
  const feed = MOCK_SWAP_ITEMS.filter((i) =>
    (categoryFilter === "Semua" || i.category === categoryFilter) &&
    (cityFilter === "Semua" || i.owner.city === cityFilter)
  );

  const doRequest = () => {
    setRequesting(true);
    setDeposit((d) => d - DEPOSIT_AMOUNT);
    const reqId = `req-${Date.now()}`;
    const newReq = { id: reqId, item: selectedItem, status: "diajukan", requestedAt: new Date().toISOString() };
    setSwapRequests((prev) => [newReq, ...prev]);
    setTimeout(() => {
      setSwapRequests((prev) => prev.map((r) => {
        if (r.id !== reqId) return r;
        if (selectedItem.locked) { setDeposit((d) => d + DEPOSIT_AMOUNT); return { ...r, status: "ditolak" }; }
        return { ...r, status: "disetujui" };
      }));
      setRequesting(false);
      setSelectedItem(null);
    }, 2200);
  };

  const completeSwap = (stars, comment) => {
    setSwapRequests((prev) => prev.map((r) => r.id === ratingTarget.id ? { ...r, status: "selesai", myRating: stars, myComment: comment, theirRating: (4 + Math.random()).toFixed(1) } : r));
    setDeposit((d) => d + DEPOSIT_AMOUNT);
    setRatingTarget(null);
  };

  const mySwapItems = items.filter((i) => i.isSwappable);

  return (
    <div className="pb-24">
      <Header title="Fashion Swap Network" subtitle="Pinjam & tukar baju antar pengguna" />
      <div className="px-4 mb-3 flex items-center justify-between">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{ background: T.mintLight }}>
          <ShieldCheck size={14} color={T.sage} />
          <span className="text-xs font-semibold" style={{ color: T.navy }}>Saldo deposit: Rp {deposit.toLocaleString("id-ID")}</span>
        </div>
      </div>
      <div className="px-4 flex gap-2 mb-3">
        {[["jelajahi", "Jelajahi"], ["milikku", "Punya Saya"], ["transaksi", "Transaksi"]].map(([k, l]) => (
          <button key={k} onClick={() => setSubTab(k)} className="flex-1 py-2 rounded-xl text-sm font-semibold"
            style={{ background: subTab === k ? T.navy : T.white, color: subTab === k ? T.white : T.navySoft, border: subTab === k ? "none" : "1px solid #E3E6F0" }}>
            {l}
          </button>
        ))}
      </div>

      {subTab === "jelajahi" && (
        <div className="px-4">
          <div className="flex gap-2 overflow-x-auto pb-2">
            <Chip active={categoryFilter === "Semua"} onClick={() => setCategoryFilter("Semua")}>Semua kategori</Chip>
            {CATEGORIES.map((c) => <Chip key={c} active={categoryFilter === c} onClick={() => setCategoryFilter(c)}>{c}</Chip>)}
          </div>
          <div className="flex gap-2 overflow-x-auto pb-3">
            {cities.map((c) => <Chip key={c} active={cityFilter === c} color={T.lavender} onClick={() => setCityFilter(c)}>{c}</Chip>)}
          </div>
          {feed.length === 0 ? (
            <EmptyState icon={Users} title="Tidak ada item ditemukan" subtitle="Coba ubah filter kategori atau kota." action={null} />
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {feed.map((item) => (
                <div key={item.id} onClick={() => setSelectedItem(item)} className="rounded-2xl overflow-hidden cursor-pointer relative" style={{ background: T.white, boxShadow: "0 6px 18px -10px rgba(27,31,59,0.2)" }}>
                  <GarmentPlaceholder item={item} />
                  {item.locked && (
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-xs font-semibold" style={{ background: T.coral, color: T.white }}>Dipinjam</div>
                  )}
                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-0.5"
                    style={{ background: item.verified ? T.sage : "#B8862E", color: "#fff" }}>
                    {item.verified ? <><ShieldCheck size={10} />Verified</> : "Belum diverifikasi"}
                  </div>
                  <div className="p-2.5">
                    <p className="text-sm font-semibold truncate" style={{ color: T.navy }}>{item.name}</p>
                    <p className="text-xs flex items-center gap-1" style={{ color: T.navySoft }}><MapPin size={10} />{item.owner.city} · {item.owner.name.split(" ")[0]}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {subTab === "milikku" && (
        <div className="px-4">
          {items.length === 0 ? (
            <EmptyState icon={Repeat} title="Lemari masih kosong" subtitle="Scan baju dulu di tab Lemari sebelum menawarkannya untuk swap." action={null} />
          ) : (
            <div className="flex flex-col gap-2">
              <p className="text-xs mb-1" style={{ color: T.navySoft }}>Aktifkan swap dengan foto asli terverifikasi kamera. {mySwapItems.length} item aktif.</p>
              {items.map((it) => (
                <Card key={it.id} className="flex items-center gap-3" style={{ display: "flex" }}>
                  <img src={it.image} className="w-12 h-12 rounded-xl object-cover" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold" style={{ color: T.navy }}>{it.name}</p>
                    {it.isSwappable ? (
                      <span className="text-xs font-semibold flex items-center gap-1" style={{ color: T.sage }}>
                        <ShieldCheck size={12} />Terverifikasi · {(it.swapPhotos || []).length} foto
                      </span>
                    ) : (
                      <p className="text-xs" style={{ color: T.navySoft }}>{it.category}</p>
                    )}
                  </div>
                  {it.isSwappable ? (
                    <Button variant="outline" onClick={() => setItems(items.map((x) => x.id === it.id ? { ...x, isSwappable: false, swapPhotos: [] } : x))} style={{ padding: "6px 12px", fontSize: 12, color: T.coral, borderColor: T.coral }}>Nonaktifkan</Button>
                  ) : (
                    <Button icon={Camera} onClick={() => setVerifyItem(it)} style={{ padding: "6px 12px", fontSize: 12 }}>Aktifkan</Button>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {subTab === "transaksi" && (
        <div className="px-4">
          {swapRequests.length === 0 ? (
            <EmptyState icon={Clock} title="Belum ada transaksi" subtitle="Ajukan pinjam item dari tab Jelajahi untuk mulai." action={null} />
          ) : (
            <div className="flex flex-col gap-3">
              {swapRequests.map((r) => (
                <Card key={r.id}>
                  <div className="flex gap-3">
                    <GarmentPlaceholder item={r.item} size="w-14 h-14" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold" style={{ color: T.navy }}>{r.item.name}</p>
                      <p className="text-xs mb-1.5" style={{ color: T.navySoft }}>dari {r.item.owner.name} · {r.item.owner.city}</p>
                      <StatusBadge status={r.status} />
                    </div>
                  </div>
                  {r.status === "ditolak" && <p className="text-xs mt-2" style={{ color: T.coral }}>Ditolak — item sedang dipinjam pengguna lain. Deposit dikembalikan penuh.</p>}
                  {r.status === "disetujui" && (
                    <Button full variant="outline" onClick={() => setRatingTarget(r)} icon={Star} style={{ marginTop: 10 }}>Tandai Selesai & Beri Rating</Button>
                  )}
                  {r.status === "selesai" && (
                    <p className="text-xs mt-2" style={{ color: T.sage }}>Selesai · kamu beri {r.myRating} bintang, {r.item.owner.name.split(" ")[0]} beri kamu {r.theirRating} bintang</p>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {selectedItem && (
        <SwapItemDetailModal item={selectedItem} allItems={MOCK_SWAP_ITEMS} onClose={() => !requesting && setSelectedItem(null)} onRequest={doRequest} requesting={requesting} />
      )}
      {ratingTarget && <RatingModal request={ratingTarget} onClose={() => setRatingTarget(null)} onSubmit={completeSwap} />}
      {verifyItem && (
        <VerifyPhotoModal item={verifyItem}
          onClose={() => setVerifyItem(null)}
          onVerified={(photos) => { setItems(items.map((x) => x.id === verifyItem.id ? { ...x, isSwappable: true, swapPhotos: photos, photoVerified: true } : x)); setVerifyItem(null); }} />
      )}
    </div>
  );
}
