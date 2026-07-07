import { useState, useEffect, useRef, useCallback } from "react";
import { Camera, X, RefreshCw, Check, Image as ImageIcon, Zap, Sparkles } from "lucide-react";
import { T, fontDisplay } from "../../theme/tokens";
import { Chip, Button } from "../../components/ui";
import { CATEGORIES, STYLE_TAGS, MATERIALS, PATTERNS, COLORS_POOL } from "../../data/reference";
import { simulateAIRecognition } from "../../lib/recognition";
import { genId } from "../../lib/utils";
import { sound } from "../../lib/sound";

const PRICE_PRESETS = [100000, 150000, 250000, 500000];

/* ============ ADD ITEM — REAL CAMERA SCAN ============
 * Live camera via getUserMedia (mundur ke upload bila kamera tak tersedia /
 * ditolak, mis. di desktop tanpa webcam). Konfirmasi hasil dibuat interaktif,
 * bukan form biasa. */
export function AddItemModal({ onClose, onSave }) {
  const [step, setStep] = useState("capture"); // capture | scanning | confirm
  const [preview, setPreview] = useState(null);
  const [category, setCategory] = useState("Atasan");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [detected, setDetected] = useState(null);
  const [confidence, setConfidence] = useState(93);
  const [error, setError] = useState("");
  const [camState, setCamState] = useState("idle"); // idle | on | denied
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileRef = useRef(null);
  const streamRef = useRef(null);

  const stopCamera = useCallback(() => {
    if (streamRef.current) { streamRef.current.getTracks().forEach((t) => t.stop()); streamRef.current = null; }
  }, []);

  const startCamera = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia) { setCamState("denied"); return; }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" }, audio: false });
      streamRef.current = stream;
      if (videoRef.current) { videoRef.current.srcObject = stream; await videoRef.current.play().catch(() => {}); }
      setCamState("on");
    } catch { setCamState("denied"); }
  }, []);

  useEffect(() => {
    if (step === "capture") startCamera();
    return () => stopCamera();
  }, [step, startCamera, stopCamera]);

  const runScan = (data) => {
    stopCamera();
    setPreview(data);
    setStep("scanning");
    setError("");
    setTimeout(() => {
      setDetected(simulateAIRecognition(category));
      setConfidence(87 + Math.floor(Math.random() * 11));
      setName("");
      sound.success();
      setStep("confirm");
    }, 2000);
  };

  const capture = () => {
    const v = videoRef.current, c = canvasRef.current;
    if (!v || !c || camState !== "on" || !v.videoWidth) return;
    c.width = v.videoWidth; c.height = v.videoHeight;
    c.getContext("2d").drawImage(v, 0, 0, c.width, c.height);
    sound.whoosh();
    runScan(c.toDataURL("image/jpeg", 0.85));
  };

  const handleFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) { setError("File harus berupa foto (JPG/PNG)."); return; }
    const reader = new FileReader();
    reader.onload = (e) => runScan(e.target.result);
    reader.readAsDataURL(file);
  };

  const retry = () => { setPreview(null); setDetected(null); setStep("capture"); setError(""); };

  return (
    <div className="fixed inset-0 z-50 flex flex-col" style={{ background: step === "capture" ? "#0B0D1A" : T.bg }}>
      <input ref={fileRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => handleFile(e.target.files[0])} />
      <canvas ref={canvasRef} className="hidden" />

      {/* ---------- CAPTURE ---------- */}
      {step === "capture" && (
        <>
          <div className="relative flex-1 overflow-hidden">
            {camState === "on" && <video ref={videoRef} autoPlay playsInline muted className="absolute inset-0 w-full h-full object-cover" />}
            {camState !== "on" && (
              <div className="absolute inset-0 flex flex-col items-center justify-center px-8 text-center" style={{ background: "#0B0D1A" }}>
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4" style={{ background: "rgba(255,255,255,.08)" }}>
                  <Camera size={28} color="#fff" />
                </div>
                <p className="font-bold text-lg mb-1" style={{ ...fontDisplay, color: "#fff" }}>
                  {camState === "denied" ? "Kamera belum aktif" : "Menyalakan kamera…"}
                </p>
                <p className="text-sm mb-5" style={{ color: "rgba(255,255,255,.6)" }}>
                  {camState === "denied" ? "Izinkan kamera di browser, atau upload dari galeri." : "Sebentar ya."}
                </p>
                {camState === "denied" && <Button icon={ImageIcon} onClick={() => fileRef.current?.click()}>Upload dari galeri</Button>}
              </div>
            )}

            {/* frame guide + top bar overlay */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute left-8 right-8 top-[16%] bottom-[24%] rounded-3xl" style={{ border: "2px dashed rgba(255,255,255,.55)" }} />
              <p className="absolute left-0 right-0 top-[9%] text-center text-sm font-semibold" style={{ color: "rgba(255,255,255,.85)" }}>Posisikan baju di dalam bingkai</p>
            </div>
            <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-5 pt-6">
              <button onClick={() => { stopCamera(); onClose(); }} className="cc-press w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "rgba(0,0,0,.4)" }}><X size={20} color="#fff" /></button>
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold" style={{ background: "rgba(0,0,0,.4)", color: "#fff" }}><Zap size={12} color={T.mint} /> AI Scan</span>
            </div>
          </div>

          {/* controls */}
          <div className="px-5 pt-4 pb-8" style={{ background: "#0B0D1A" }}>
            <div className="flex gap-2 overflow-x-auto cc-noscroll pb-3">
              {CATEGORIES.map((c) => (
                <button key={c} onClick={() => { sound.tap(); setCategory(c); }} className="cc-press px-3.5 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap"
                  style={{ background: category === c ? T.mint : "rgba(255,255,255,.1)", color: category === c ? T.navy : "#fff" }}>{c}</button>
              ))}
            </div>
            {error && <p className="text-sm font-medium mb-2 text-center" style={{ color: T.coral }}>{error}</p>}
            <div className="flex items-center justify-between px-4">
              <button onClick={() => fileRef.current?.click()} className="cc-press w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: "rgba(255,255,255,.12)" }}>
                <ImageIcon size={22} color="#fff" />
              </button>
              <button onClick={capture} disabled={camState !== "on"} className="cc-press w-[74px] h-[74px] rounded-full flex items-center justify-center disabled:opacity-40" style={{ background: "#fff", boxShadow: "0 0 0 5px rgba(255,255,255,.25)" }}>
                <span className="w-[58px] h-[58px] rounded-full" style={{ background: `linear-gradient(135deg, ${T.mint}, ${T.lavender})` }} />
              </button>
              <div className="w-12 h-12" />
            </div>
            <p className="text-center text-xs mt-3" style={{ color: "rgba(255,255,255,.5)" }}>Ketuk lingkaran untuk memindai · pencahayaan terang lebih akurat</p>
          </div>
        </>
      )}

      {/* ---------- SCANNING ---------- */}
      {step === "scanning" && (
        <div className="flex-1 flex flex-col items-center justify-center px-8">
          <div className="relative w-60 h-72 rounded-3xl overflow-hidden mb-6" style={{ boxShadow: "0 24px 60px -24px rgba(27,31,59,.5)" }}>
            <img src={preview} alt="preview" className="w-full h-full object-cover" />
            <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(127,216,190,.12), rgba(201,184,232,.12))" }} />
            <div className="cc-scanline absolute left-0 right-0 h-1" style={{ background: `linear-gradient(90deg, transparent, ${T.mint}, transparent)`, boxShadow: `0 0 16px ${T.mint}` }} />
            <div className="absolute inset-3 rounded-2xl" style={{ border: `1.5px solid ${T.mint}` }} />
          </div>
          <ScanningText />
          <div className="flex gap-1.5 mt-4">
            {[0, 1, 2].map((i) => <span key={i} className="w-2 h-2 rounded-full animate-bounce" style={{ background: T.lavenderDeep, animationDelay: `${i * 0.15}s` }} />)}
          </div>
        </div>
      )}

      {/* ---------- CONFIRM (interactive) ---------- */}
      {step === "confirm" && detected && (
        <div className="flex-1 overflow-y-auto">
          <div className="relative">
            <img src={preview} alt="preview" className="w-full h-64 object-cover" />
            <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(11,13,26,.35), transparent 40%, rgba(247,248,252,1))" }} />
            <button onClick={() => { retry(); }} className="cc-press absolute top-6 left-5 w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "rgba(0,0,0,.4)" }}><RefreshCw size={18} color="#fff" /></button>
            <button onClick={onClose} className="cc-press absolute top-6 right-5 w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "rgba(0,0,0,.4)" }}><X size={18} color="#fff" /></button>
            <div className="absolute left-5 bottom-3 flex items-center gap-2 cc-pop-in">
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold" style={{ background: T.sage, color: "#fff" }}><Sparkles size={12} /> AI yakin {confidence}%</span>
            </div>
          </div>

          <div className="px-5 -mt-1 pb-8">
            <p className="font-extrabold text-[22px] leading-tight cc-fade-up" style={{ ...fontDisplay, color: T.navy }}>Ketemu! Ini {category.toLowerCase()}mu</p>
            <p className="text-sm mb-4 cc-fade-up" style={{ color: T.navySoft }}>Cek & sesuaikan kalau ada yang meleset — tinggal ketuk.</p>

            <div className="cc-stagger flex flex-col gap-4">
              <EditRow label="Kategori" value={category} onChange={setCategory} options={CATEGORIES} />
              <EditRow label="Gaya" value={detected.style} onChange={(v) => setDetected({ ...detected, style: v })} options={STYLE_TAGS} />
              <EditRow label="Bahan" value={detected.material} onChange={(v) => setDetected({ ...detected, material: v })} options={MATERIALS} />
              <EditRow label="Motif" value={detected.pattern} onChange={(v) => setDetected({ ...detected, pattern: v })} options={PATTERNS} />

              <div>
                <label className="text-xs font-bold" style={{ color: T.navySoft }}>Warna dominan</label>
                <div className="flex gap-2.5 mt-2 flex-wrap">
                  {COLORS_POOL.map((c) => {
                    const on = detected.color.name === c.name;
                    return (
                      <button key={c.name} onClick={() => { sound.tap(); setDetected({ ...detected, color: c }); }} className="cc-press relative w-10 h-10 rounded-2xl" style={{ background: c.hex, border: on ? `3px solid ${T.navy}` : "3px solid transparent", boxShadow: "inset 0 0 0 1px rgba(0,0,0,.06)" }} title={c.name}>
                        {on && <span className="absolute inset-0 flex items-center justify-center"><Check size={16} color={c.name === "Hitam" || c.name === "Navy" ? "#fff" : T.navy} /></span>}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold" style={{ color: T.navySoft }}>Nama item</label>
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder={`${category} ${detected.color.name.toLowerCase()}`}
                  className="w-full mt-1.5 px-4 py-3 rounded-2xl outline-none text-[15px]" style={{ background: T.white, border: "1.5px solid #E3E6F0", color: T.navy }} />
              </div>

              <div>
                <label className="text-xs font-bold" style={{ color: T.navySoft }}>Harga beli <span style={{ fontWeight: 400 }}>(untuk cost-per-wear)</span></label>
                <input value={price} onChange={(e) => setPrice(e.target.value.replace(/\D/g, ""))} placeholder="mis. 150000" inputMode="numeric"
                  className="w-full mt-1.5 px-4 py-3 rounded-2xl outline-none text-[15px]" style={{ background: T.white, border: "1.5px solid #E3E6F0", color: T.navy }} />
                <div className="flex gap-2 mt-2 flex-wrap">
                  {PRICE_PRESETS.map((p) => (
                    <button key={p} onClick={() => { sound.tap(); setPrice(String(p)); }} className="cc-press px-3 py-1.5 rounded-full text-xs font-semibold" style={{ background: Number(price) === p ? T.lavenderDeep : T.mintLight, color: Number(price) === p ? "#fff" : T.navy }}>
                      Rp {(p / 1000).toFixed(0)}rb
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-2 mt-5">
              <Button variant="outline" icon={RefreshCw} onClick={retry}>Scan ulang</Button>
              <Button full icon={Check} onClick={() => { sound.success(); onSave({
                id: genId(), name: name || `${category} ${detected.color.name.toLowerCase()}`,
                category, style: detected.style, material: detected.material, pattern: detected.pattern,
                color: detected.color, price: Number(price) || 50000, image: preview, wearCount: 0, lastWorn: null, wearHistory: [],
              }); }}>Simpan ke Lemari</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ScanningText() {
  const steps = ["Mendeteksi jenis pakaian…", "Menganalisis warna & motif…", "Mengklasifikasikan kategori…"];
  const [i, setI] = useState(0);
  useEffect(() => { const t = setInterval(() => setI((v) => (v + 1) % steps.length), 650); return () => clearInterval(t); }, []);
  return <p className="text-[15px] font-bold" style={{ ...fontDisplay, color: T.navy }}>{steps[i]}</p>;
}

function EditRow({ label, value, onChange, options }) {
  return (
    <div>
      <label className="text-xs font-bold" style={{ color: T.navySoft }}>{label}</label>
      <div className="flex gap-2 mt-1.5 overflow-x-auto cc-noscroll pb-1">
        {options.map((o) => <Chip key={o} active={value === o} onClick={() => onChange(o)}>{o}</Chip>)}
      </div>
    </div>
  );
}
