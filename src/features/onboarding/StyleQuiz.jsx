import { useState } from "react";
import { ChevronLeft, ArrowRight, Check } from "lucide-react";
import { T, fontDisplay } from "../../theme/tokens";
import { Button } from "../../components/ui";
import { StyleThumb } from "../../components/illustrations";
import { GENDERS, AGE_RANGES, ACTIVITIES, BUDGETS, STYLE_OPTIONS, PALETTE, STYLE_BLURB } from "../../data/quiz";
import { sound } from "../../lib/sound";

const STEPS = [
  { id: "gender", kind: "single", opts: GENDERS.map((g) => g.label), title: "Kamu identik dengan?", sub: "Biar rekomendasi outfit lebih pas." },
  { id: "age", kind: "single", opts: AGE_RANGES, title: "Rentang usiamu?", sub: "Gaya tiap generasi beda — kami sesuaikan." },
  { id: "styles", kind: "styles", min: 1, max: 3, title: "Pilih vibe gaya favoritmu", sub: "Boleh pilih sampai 3." },
  { id: "colors", kind: "colors", min: 2, title: "Warna yang kamu suka", sub: "Pilih minimal 2 — tekan kartunya." },
  { id: "activities", kind: "multi", opts: ACTIVITIES.map((a) => a.label), min: 1, title: "Sehari-hari kamu ngapain?", sub: "Pilih yang paling sering." },
  { id: "budget", kind: "single", opts: BUDGETS, title: "Budget fashion per bulan?", sub: "Untuk saran thrift & cost-per-wear." },
];

export function StyleQuiz({ onDone, onBack }) {
  const [step, setStep] = useState(0);
  const [ans, setAns] = useState({ gender: null, age: null, styles: [], colors: [], activities: [], budget: null });
  const cfg = STEPS[step];
  const val = ans[cfg.id];

  const valid = cfg.kind === "single" ? !!val
    : cfg.kind === "styles" ? val.length >= cfg.min
    : cfg.kind === "colors" ? val.length >= cfg.min
    : val.length >= (cfg.min || 1);

  const setSingle = (v) => { sound.select(); setAns({ ...ans, [cfg.id]: v }); };
  const toggleMulti = (v, max) => {
    sound.tap();
    const cur = ans[cfg.id];
    if (cur.includes(v)) setAns({ ...ans, [cfg.id]: cur.filter((x) => x !== v) });
    else if (!max || cur.length < max) setAns({ ...ans, [cfg.id]: [...cur, v] });
    else { setAns({ ...ans, [cfg.id]: [...cur.slice(1), v] }); }
  };

  const back = () => { sound.tap(); step === 0 ? onBack() : setStep(step - 1); };
  const next = () => {
    if (!valid) return;
    if (step === STEPS.length - 1) { sound.success(); onDone(ans); }
    else { sound.tap(); setStep(step + 1); }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: T.bg }}>
      {/* progress */}
      <div className="px-5 pt-6">
        <div className="flex items-center gap-3">
          <button onClick={back} className="cc-press w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ background: T.white }}>
            <ChevronLeft size={18} color={T.navy} />
          </button>
          <div className="flex-1 h-2 rounded-full" style={{ background: "#E3E6F0" }}>
            <div className="h-full rounded-full transition-all duration-500" style={{ width: `${((step + 1) / STEPS.length) * 100}%`, background: `linear-gradient(90deg, ${T.mint}, ${T.lavender})` }} />
          </div>
          <span className="text-xs font-bold shrink-0" style={{ color: T.navySoft }}>{step + 1}/{STEPS.length}</span>
        </div>
      </div>

      {/* question */}
      <div className="px-6 pt-6 flex-1 flex flex-col overflow-y-auto pb-4">
        <p key={`q${step}`} className="cc-fade-up font-extrabold text-[23px] leading-tight" style={{ ...fontDisplay, color: T.navy }}>{cfg.title}</p>
        <p className="cc-fade-up text-sm mb-5" style={{ color: T.navySoft, animationDelay: ".04s" }}>{cfg.sub}</p>

        <div key={`body${step}`} className="cc-fade-up">
          {cfg.kind === "single" && cfg.id === "gender" && (
            <div className="grid grid-cols-2 gap-3">
              {cfg.opts.map((o) => <PickCard key={o} label={o} active={val === o} onClick={() => setSingle(o)} />)}
            </div>
          )}
          {cfg.kind === "single" && cfg.id === "age" && (
            <div className="flex flex-col gap-2.5">
              {cfg.opts.map((o) => <RowPick key={o} label={o} active={val === o} onClick={() => setSingle(o)} />)}
            </div>
          )}
          {cfg.kind === "single" && cfg.id === "budget" && (
            <div className="flex flex-col gap-2.5">
              {cfg.opts.map((o) => <RowPick key={o} label={o} active={val === o} onClick={() => setSingle(o)} />)}
            </div>
          )}
          {cfg.kind === "styles" && (
            <div className="grid grid-cols-2 gap-3">
              {STYLE_OPTIONS.map((s) => {
                const on = val.includes(s);
                return (
                  <button key={s} onClick={() => toggleMulti(s, cfg.max)} className="cc-press rounded-2xl p-2.5 text-left relative overflow-hidden"
                    style={{ background: T.white, border: `2px solid ${on ? T.lavenderDeep : "#E9EBF2"}`, boxShadow: on ? "0 10px 24px -14px rgba(139,111,206,.6)" : "none" }}>
                    {on && <div className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center z-10" style={{ background: T.lavenderDeep }}><Check size={14} color="#fff" /></div>}
                    <StyleThumb styleKey={s} size={124} />
                    <p className="font-bold text-sm mt-1.5" style={{ color: T.navy }}>{s}</p>
                    <p className="text-[11px] leading-snug" style={{ color: T.navySoft }}>{STYLE_BLURB[s]}</p>
                  </button>
                );
              })}
            </div>
          )}
          {cfg.kind === "colors" && (
            <>
              <div className="grid grid-cols-4 gap-2.5">
                {PALETTE.map((c) => {
                  const on = val.some((x) => x.name === c.name);
                  return (
                    <button key={c.name} onClick={() => {
                      sound.tap();
                      setAns({ ...ans, colors: on ? val.filter((x) => x.name !== c.name) : [...val, c] });
                    }} className="cc-press flex flex-col items-center gap-1">
                      <span className="w-full rounded-2xl relative" style={{ aspectRatio: "1", background: c.hex, border: on ? `3px solid ${T.navy}` : "3px solid transparent", boxShadow: "inset 0 0 0 1px rgba(0,0,0,.06)" }}>
                        {on && <span className="absolute inset-0 flex items-center justify-center"><span className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: "rgba(255,255,255,.9)" }}><Check size={14} color={T.navy} /></span></span>}
                      </span>
                      <span className="text-[10px] font-medium text-center leading-none" style={{ color: T.navySoft }}>{c.name}</span>
                    </button>
                  );
                })}
              </div>
              <p className="text-xs mt-3 font-semibold" style={{ color: T.lavenderDeep }}>{val.length} warna dipilih</p>
            </>
          )}
          {cfg.kind === "multi" && (
            <div className="flex flex-wrap gap-2.5">
              {cfg.opts.map((o) => {
                const on = val.includes(o);
                return (
                  <button key={o} onClick={() => toggleMulti(o)} className="cc-press px-4 py-2.5 rounded-2xl text-sm font-semibold flex items-center gap-1.5"
                    style={{ background: on ? T.lavenderDeep : T.white, color: on ? "#fff" : T.navy, border: `1.5px solid ${on ? T.lavenderDeep : "#E3E6F0"}` }}>
                    {on && <Check size={14} />}{o}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="px-6 pb-9 pt-2">
        <Button full disabled={!valid} icon={step === STEPS.length - 1 ? Check : ArrowRight} onClick={next} style={{ paddingTop: 15, paddingBottom: 15, fontSize: 16 }}>
          {step === STEPS.length - 1 ? "Lihat gaya kamu" : "Lanjut"}
        </Button>
      </div>
    </div>
  );
}

function PickCard({ label, active, onClick }) {
  return (
    <button onClick={onClick} className="cc-press rounded-2xl py-6 font-bold text-[15px]"
      style={{ background: active ? `linear-gradient(135deg, ${T.mint}, ${T.lavender})` : T.white, color: T.navy, border: `2px solid ${active ? "transparent" : "#E9EBF2"}` }}>
      {label}
    </button>
  );
}
function RowPick({ label, active, onClick }) {
  return (
    <button onClick={onClick} className="cc-press w-full flex items-center justify-between rounded-2xl px-5 py-4 font-semibold"
      style={{ background: active ? T.mintLight : T.white, color: T.navy, border: `2px solid ${active ? T.mint : "#E9EBF2"}` }}>
      <span>{label}</span>
      {active && <span className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: T.mint }}><Check size={14} color={T.navy} /></span>}
    </button>
  );
}
