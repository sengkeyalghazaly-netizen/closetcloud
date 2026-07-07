import { useState, useMemo } from "react";
import { ChevronRight, ChevronLeft, Cloud, Camera, Sparkles } from "lucide-react";
import { T, fontDisplay } from "../../theme/tokens";
import { Button, EmptyState, Card } from "../../components/ui";
import { QUIZ_QUESTIONS } from "../../data/reference";
import { generateOutfits } from "../../lib/outfits";
import { AddItemModal } from "../wardrobe/AddItemModal";

/* ============ ONBOARDING ============ */
export function Onboarding({ onFinish }) {
  const [stage, setStage] = useState("intro"); // intro, quiz, scan, reward
  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [items, setItems] = useState([]);
  const [showAdd, setShowAdd] = useState(false);

  const progressPct = stage === "intro" ? 0 : stage === "quiz" ? 10 + (qIndex / QUIZ_QUESTIONS.length) * 30 : stage === "scan" ? 45 + Math.min(items.length, 3) * 15 : 100;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: T.bg }}>
      <div className="h-1.5 w-full" style={{ background: "#E3E6F0" }}>
        <div className="h-full transition-all duration-500" style={{ width: `${progressPct}%`, background: `linear-gradient(90deg, ${T.mint}, ${T.lavender})` }} />
      </div>

      {stage === "intro" && (
        <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
          <div className="w-24 h-24 rounded-3xl flex items-center justify-center mb-6" style={{ background: `linear-gradient(135deg, ${T.mint}, ${T.lavender})` }}>
            <Cloud size={38} color={T.navy} />
          </div>
          <p className="font-extrabold text-3xl mb-2" style={{ ...fontDisplay, color: T.navy }}>ClosetCloud</p>
          <p className="text-base mb-1" style={{ color: T.navySoft }}>Your Personal AI Stylist</p>
          <p className="text-sm mb-8 max-w-xs" style={{ color: T.navySoft }}>Optimize what you already own — bukan aplikasi belanja, tapi asisten AI yang bantu kamu tampil maksimal dari isi lemari sendiri.</p>
          <Button onClick={() => setStage("quiz")} icon={ChevronRight} style={{ width: "100%" }}>Mulai (± 10 menit)</Button>
        </div>
      )}

      {stage === "quiz" && (
        <div className="flex-1 flex flex-col px-6 pt-6">
          <p className="text-xs font-semibold mb-1" style={{ color: T.lavenderDeep }}>STYLE QUIZ · {qIndex + 1}/{QUIZ_QUESTIONS.length}</p>
          <p className="font-bold text-xl mb-6" style={{ ...fontDisplay, color: T.navy }}>{QUIZ_QUESTIONS[qIndex].q}</p>
          <div className="flex flex-col gap-3">
            {QUIZ_QUESTIONS[qIndex].opts.map((o) => (
              <button key={o} onClick={() => {
                const next = [...answers, o];
                setAnswers(next);
                if (qIndex + 1 < QUIZ_QUESTIONS.length) setQIndex(qIndex + 1);
                else setStage("scan");
              }} className="text-left px-4 py-3.5 rounded-2xl font-medium" style={{ background: T.white, border: "1px solid #E3E6F0", color: T.navy }}>
                {o}
              </button>
            ))}
          </div>
          {qIndex > 0 && (
            <button onClick={() => { setQIndex(qIndex - 1); setAnswers(answers.slice(0, -1)); }} className="flex items-center gap-1 text-sm mt-5 font-medium" style={{ color: T.navySoft }}>
              <ChevronLeft size={14} /> Kembali
            </button>
          )}
        </div>
      )}

      {stage === "scan" && (
        <div className="flex-1 flex flex-col px-6 pt-6">
          <p className="text-xs font-semibold mb-1" style={{ color: T.lavenderDeep }}>SCAN BAJU PERTAMA</p>
          <p className="font-bold text-xl mb-2" style={{ ...fontDisplay, color: T.navy }}>Yuk isi lemari digitalmu</p>
          <p className="text-sm mb-5" style={{ color: T.navySoft }}>Scan minimal 3 item (atasan, bawahan, sepatu) supaya AI bisa langsung bikin rekomendasi outfit pertamamu.</p>

          {items.length === 0 ? (
            <EmptyState icon={Camera} title="Belum ada item" subtitle="Ketuk tombol di bawah untuk mulai scan." action={<Button icon={Camera} onClick={() => setShowAdd(true)}>Scan Baju</Button>} />
          ) : (
            <>
              <div className="grid grid-cols-3 gap-2 mb-4">
                {items.map((it) => (
                  <img key={it.id} src={it.image} className="w-full h-24 object-cover rounded-xl" />
                ))}
              </div>
              <Button icon={Camera} variant="outline" onClick={() => setShowAdd(true)}>Scan item lagi</Button>
            </>
          )}

          <div className="flex-1" />
          <Button full disabled={items.length < 3} onClick={() => setStage("reward")} icon={ChevronRight} style={{ marginTop: 16 }}>
            {items.length < 3 ? `Scan ${3 - items.length} item lagi untuk lanjut` : "Lihat rekomendasi outfit pertamaku"}
          </Button>

          {showAdd && <AddItemModal onClose={() => setShowAdd(false)} onSave={(item) => { setItems([item, ...items]); setShowAdd(false); }} />}
        </div>
      )}

      {stage === "reward" && (
        <RewardScreen items={items} onContinue={() => onFinish(items)} />
      )}
    </div>
  );
}

function RewardScreen({ items, onContinue }) {
  const outfits = useMemo(() => generateOutfits(items, "sejuk", "Kuliah / kerja santai"), [items]);
  const combo = outfits[0];
  return (
    <div className="flex-1 flex flex-col px-6 pt-8 pb-6 items-center text-center">
      <div className="w-16 h-16 rounded-full flex items-center justify-center mb-3" style={{ background: T.mintLight }}>
        <Sparkles size={26} color={T.lavenderDeep} />
      </div>
      <p className="font-bold text-xl mb-1" style={{ ...fontDisplay, color: T.navy }}>Outfit pertamamu siap!</p>
      <p className="text-sm mb-5" style={{ color: T.navySoft }}>AI sudah menganalisis lemarimu. Ini rekomendasi hari ini:</p>
      {combo && (
        <Card style={{ width: "100%" }}>
          <div className="flex gap-2 justify-center mb-2">
            {[combo.top, combo.outer, combo.bottom, combo.shoe, combo.acc].filter(Boolean).map((it) => (
              <img key={it.id} src={it.image} className="w-20 h-20 rounded-xl object-cover" />
            ))}
          </div>
          <p className="text-xs" style={{ color: T.navySoft }}>{combo.reason}</p>
        </Card>
      )}
      <div className="flex-1" />
      <Button full onClick={onContinue} icon={ChevronRight} style={{ marginTop: 20 }}>Masuk ke ClosetCloud</Button>
    </div>
  );
}
