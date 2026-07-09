import { useState, useMemo } from "react";
import { ChevronLeft, Camera, ArrowRight, Sparkles } from "lucide-react";
import { T, fontDisplay } from "../../theme/tokens";
import { Button, EmptyState, Card } from "../../components/ui";
import { Celebrate } from "../../components/illustrations";
import { generateOutfits } from "../../lib/outfits";
import { sound } from "../../lib/sound";
import { AddItemModal } from "../wardrobe/AddItemModal";
import { Intro } from "./Intro";
import { Login } from "./Login";
import { StyleQuiz } from "./StyleQuiz";
import { StyleResult } from "./StyleResult";

/* ============ ONBOARDING FLOW ============
 * intro → login → quiz → style result → scan first items → reward outfit */
export function Onboarding({ onFinish, demoItems = [] }) {
  const [stage, setStage] = useState("intro");
  const [profile, setProfile] = useState({});
  const [items, setItems] = useState([]);
  const [showAdd, setShowAdd] = useState(false);

  if (stage === "intro") return <Intro onDone={() => setStage("login")} />;
  if (stage === "login") return <Login onBack={() => setStage("intro")} onLogin={(u) => { setProfile((p) => ({ ...p, ...u })); setStage("quiz"); }} />;
  if (stage === "quiz") return <StyleQuiz onBack={() => setStage("login")} onDone={(a) => { setProfile((p) => ({ ...p, ...a })); setStage("result"); }} />;
  if (stage === "result") return <StyleResult profile={profile} onContinue={() => setStage("scan")} />;
  if (stage === "reward") return <RewardScreen items={items} demoItems={demoItems} profile={profile} onContinue={() => { sound.success(); onFinish(items, profile); }} />;

  // scan stage
  return (
    <div className="min-h-screen flex flex-col px-6 pt-6" style={{ background: T.bg }}>
      <div className="flex items-center gap-3 mb-2">
        <button onClick={() => { sound.tap(); setStage("result"); }} className="cc-press w-9 h-9 rounded-full flex items-center justify-center" style={{ background: T.white }}>
          <ChevronLeft size={18} color={T.navy} />
        </button>
        <div className="flex-1 h-2 rounded-full" style={{ background: "#E3E6F0" }}>
          <div className="h-full rounded-full transition-all duration-500" style={{ width: `${45 + Math.min(items.length, 3) * 18}%`, background: `linear-gradient(90deg, ${T.mint}, ${T.lavender})` }} />
        </div>
      </div>

      <p className="cc-fade-up text-xs font-bold mt-3" style={{ color: T.lavenderDeep }}>TAMBAH BAJUMU (OPSIONAL)</p>
      <p className="cc-fade-up font-extrabold text-[23px] leading-tight" style={{ ...fontDisplay, color: T.navy }}>Scan baju favoritmu</p>
      <p className="cc-fade-up text-sm mb-5" style={{ color: T.navySoft }}>Lemarimu sudah kami isi contoh biar bisa langsung eksplor. Tambah punyamu sekarang, atau lewati — bisa scan kapan saja lewat menu Lemari.</p>

      {items.length === 0 ? (
        <EmptyState icon={Camera} title="Belum ada item" subtitle="Ketuk tombol di bawah untuk mulai scan baju pertamamu."
          action={<Button icon={Camera} onClick={() => setShowAdd(true)}>Scan Baju</Button>} />
      ) : (
        <>
          <div className="grid grid-cols-3 gap-2.5 mb-4 cc-stagger">
            {items.map((it) => (
              <div key={it.id} className="cc-pop-in relative rounded-2xl overflow-hidden" style={{ boxShadow: "0 8px 20px -12px rgba(27,31,59,.3)" }}>
                <img src={it.image} className="w-full h-24 object-cover" />
              </div>
            ))}
          </div>
          <Button icon={Camera} variant="outline" onClick={() => setShowAdd(true)}>Scan item lagi</Button>
        </>
      )}

      <div className="flex-1" />
      <div className="pb-9 pt-3">
        <Button full icon={ArrowRight} onClick={() => setStage("reward")} style={{ paddingTop: 15, paddingBottom: 15, fontSize: 16 }}>
          {items.length ? "Lihat outfit pertamaku" : "Lewati — lemari sudah terisi"}
        </Button>
      </div>

      {showAdd && <AddItemModal onClose={() => setShowAdd(false)} onSave={(item) => { sound.success(); setItems([item, ...items]); setShowAdd(false); }} />}
    </div>
  );
}

function RewardScreen({ items, demoItems = [], profile, onContinue }) {
  // Kalau user tak scan apa pun, racik outfit pertama dari lemari contoh yang
  // sudah ter-seed — jadi layar reward tetap penuh, bukan kosong.
  const base = items.length ? items : demoItems;
  const outfits = useMemo(() => generateOutfits(base, "sejuk", "Kuliah / kerja santai"), [base]);
  const combo = outfits[0];
  return (
    <div className="min-h-screen flex flex-col px-6 pt-10 pb-9 items-center text-center" style={{ background: T.bg }}>
      <div className="cc-pop-in"><Celebrate size={100} /></div>
      <p className="cc-fade-up font-extrabold text-[26px] leading-tight mt-2 mb-1" style={{ ...fontDisplay, color: T.navy }}>Outfit pertamamu siap!</p>
      <p className="cc-fade-up text-sm mb-6 max-w-xs" style={{ color: T.navySoft }}>Ajax meracik ini dari lemarimu. Selamat datang di ClosetCloud{profile.name ? `, ${profile.name}` : ""}!</p>
      {combo && (
        <Card className="cc-fade-up w-full" style={{ animationDelay: ".1s" }}>
          <div className="flex items-center gap-1.5 mb-3"><Sparkles size={15} color={T.lavenderDeep} /><span className="text-xs font-bold" style={{ color: T.navy }}>Rekomendasi hari ini</span></div>
          <div className="flex gap-2 justify-center mb-3">
            {[combo.top, combo.outer, combo.bottom, combo.shoe, combo.acc].filter(Boolean).map((it) => (
              <img key={it.id} src={it.image} className="w-[70px] h-[70px] rounded-xl object-cover" />
            ))}
          </div>
          <p className="text-xs" style={{ color: T.navySoft }}>{combo.reason}</p>
        </Card>
      )}
      <div className="flex-1" />
      <Button full icon={ArrowRight} onClick={onContinue} style={{ paddingTop: 15, paddingBottom: 15, fontSize: 16, marginTop: 20 }}>Masuk ke ClosetCloud</Button>
    </div>
  );
}
