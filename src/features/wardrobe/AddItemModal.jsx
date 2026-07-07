import { useState, useEffect, useRef } from "react";
import { Camera, X, RefreshCw, Check } from "lucide-react";
import { T, fontDisplay } from "../../theme/tokens";
import { Chip, Button } from "../../components/ui";
import { CATEGORIES, STYLE_TAGS, MATERIALS, PATTERNS, COLORS_POOL } from "../../data/reference";
import { simulateAIRecognition } from "../../lib/recognition";
import { genId } from "../../lib/utils";

/* ============ ADD ITEM MODAL (Wardrobe Scan) ============ */
export function AddItemModal({ onClose, onSave }) {
  const [step, setStep] = useState(1); // 1 upload, 2 scanning, 3 confirm
  const [preview, setPreview] = useState(null);
  const [category, setCategory] = useState("Atasan");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [detected, setDetected] = useState(null);
  const [error, setError] = useState("");
  const fileRef = useRef(null);

  const handleFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("File harus berupa foto (JPG/PNG). Coba lagi ya.");
      return;
    }
    setError("");
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target.result);
      setStep(2);
      setTimeout(() => {
        const result = simulateAIRecognition(category);
        setDetected(result);
        setStep(3);
      }, 1900);
    };
    reader.readAsDataURL(file);
  };

  const retry = () => { setPreview(null); setDetected(null); setStep(1); setError(""); };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" style={{ background: "rgba(27,31,59,0.55)" }}>
      <div className="w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl p-5 max-h-[92vh] overflow-y-auto" style={{ background: T.bg }}>
        <div className="flex items-center justify-between mb-4">
          <p className="font-bold text-lg" style={{ ...fontDisplay, color: T.navy }}>Scan Baju Baru</p>
          <button onClick={onClose} className="p-2 rounded-full" style={{ background: T.white }}><X size={18} color={T.navy} /></button>
        </div>

        {step === 1 && (
          <div className="flex flex-col gap-4">
            <p className="text-sm" style={{ color: T.navySoft }}>Pilih kategori dulu, terus foto atau upload baju kamu.</p>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((c) => (
                <Chip key={c} active={category === c} onClick={() => setCategory(c)}>{c}</Chip>
              ))}
            </div>
            <div
              onClick={() => fileRef.current?.click()}
              className="rounded-2xl border-2 border-dashed flex flex-col items-center justify-center py-12 cursor-pointer"
              style={{ borderColor: T.lavender, background: T.mintLight }}
            >
              <Camera size={30} color={T.lavenderDeep} />
              <p className="mt-2 font-medium text-sm" style={{ color: T.navy }}>Ketuk untuk ambil / upload foto</p>
              <p className="text-xs mt-1" style={{ color: T.navySoft }}>JPG atau PNG, pencahayaan terang lebih akurat</p>
            </div>
            <input ref={fileRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => handleFile(e.target.files[0])} />
            {error && <p className="text-sm font-medium" style={{ color: T.coral }}>{error}</p>}
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col items-center py-8">
            <div className="relative w-40 h-40 rounded-2xl overflow-hidden mb-5">
              <img src={preview} alt="preview" className="w-full h-full object-cover" />
              <div className="absolute inset-0 animate-pulse" style={{ background: "rgba(143,217,196,0.35)" }} />
            </div>
            <ScanningText />
          </div>
        )}

        {step === 3 && detected && (
          <div className="flex flex-col gap-4">
            <div className="flex gap-3 items-center">
              <img src={preview} alt="preview" className="w-20 h-20 rounded-xl object-cover" />
              <div>
                <p className="text-xs font-semibold" style={{ color: T.sage }}>✓ Berhasil dikenali AI</p>
                <p className="text-sm" style={{ color: T.navySoft }}>Cek & lengkapi detail di bawah sebelum simpan</p>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold" style={{ color: T.navySoft }}>Nama item</label>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder={`${category} ${detected.color.name.toLowerCase()}`}
                className="w-full mt-1 px-3 py-2.5 rounded-xl outline-none" style={{ background: T.white, border: "1px solid #E3E6F0" }} />
            </div>

            <FieldRow label="Kategori" value={category} onChange={setCategory} options={CATEGORIES} />
            <FieldRow label="Gaya" value={detected.style} onChange={(v) => setDetected({ ...detected, style: v })} options={STYLE_TAGS} />
            <FieldRow label="Bahan" value={detected.material} onChange={(v) => setDetected({ ...detected, material: v })} options={MATERIALS} />
            <FieldRow label="Motif" value={detected.pattern} onChange={(v) => setDetected({ ...detected, pattern: v })} options={PATTERNS} />

            <div>
              <label className="text-xs font-semibold" style={{ color: T.navySoft }}>Warna</label>
              <div className="flex gap-2 mt-1.5 flex-wrap">
                {COLORS_POOL.map((c) => (
                  <button key={c.name} onClick={() => setDetected({ ...detected, color: c })}
                    className="w-8 h-8 rounded-full border-2" style={{ background: c.hex, borderColor: detected.color.name === c.name ? T.lavenderDeep : "transparent" }} title={c.name} />
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold" style={{ color: T.navySoft }}>Harga beli (untuk hitung cost-per-wear)</label>
              <input value={price} onChange={(e) => setPrice(e.target.value.replace(/\D/g, ""))} placeholder="mis. 150000" inputMode="numeric"
                className="w-full mt-1 px-3 py-2.5 rounded-xl outline-none" style={{ background: T.white, border: "1px solid #E3E6F0" }} />
            </div>

            <div className="flex gap-2 mt-1">
              <Button variant="outline" onClick={retry} icon={RefreshCw}>Foto ulang</Button>
              <Button variant="primary" full onClick={() => onSave({
                id: genId(), name: name || `${category} ${detected.color.name.toLowerCase()}`,
                category, style: detected.style, material: detected.material, pattern: detected.pattern,
                color: detected.color, price: Number(price) || 50000, image: preview, wearCount: 0, lastWorn: null, wearHistory: [],
              })} icon={Check}>Simpan ke Lemari</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ScanningText() {
  const steps = ["Mendeteksi jenis pakaian…", "Menganalisis warna & motif…", "Mengklasifikasikan kategori…"];
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % steps.length), 650);
    return () => clearInterval(t);
  }, []);
  return <p className="text-sm font-medium animate-pulse" style={{ color: T.lavenderDeep }}>{steps[i]}</p>;
}

function FieldRow({ label, value, onChange, options }) {
  return (
    <div>
      <label className="text-xs font-semibold" style={{ color: T.navySoft }}>{label}</label>
      <div className="flex gap-2 mt-1.5 flex-wrap">
        {options.map((o) => <Chip key={o} active={value === o} onClick={() => onChange(o)}>{o}</Chip>)}
      </div>
    </div>
  );
}
