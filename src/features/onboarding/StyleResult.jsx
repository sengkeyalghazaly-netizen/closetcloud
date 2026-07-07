import { ArrowRight } from "lucide-react";
import { T, fontDisplay } from "../../theme/tokens";
import { Button } from "../../components/ui";
import { Celebrate, StyleThumb } from "../../components/illustrations";

/* Ubah hasil quiz jadi "Style DNA" yang terasa personal — bukan sekadar
 * ringkasan jawaban. Persona diturunkan dari gaya utama + aktivitas. */
const PERSONA = {
  Kasual: "Effortless Icon", Streetwear: "Street Curator", Minimalist: "Clean Aesthete",
  "Old Money": "Timeless Classic", Y2K: "Retro Star", "Korean Style": "Soft Trendsetter",
  Formal: "Power Dresser", Sporty: "Active Mover", Edgy: "Bold Rebel", Bohemian: "Free Spirit",
};

export function StyleResult({ profile, onContinue }) {
  const primary = profile.styles?.[0] || "Kasual";
  const persona = PERSONA[primary] || "Style Explorer";
  const colors = (profile.colors || []).slice(0, 8);

  return (
    <div className="min-h-screen flex flex-col items-center px-6 pt-10 pb-9" style={{ background: T.bg }}>
      <div className="cc-pop-in"><Celebrate size={104} /></div>
      <p className="cc-fade-up text-sm font-semibold mt-2" style={{ color: T.lavenderDeep, animationDelay: ".05s" }}>STYLE DNA KAMU</p>
      <p className="cc-fade-up font-extrabold text-[30px] text-center leading-tight mt-1 mb-1" style={{ ...fontDisplay, color: T.navy, animationDelay: ".1s" }}>
        {profile.name ? `${profile.name}, ` : ""}si <span style={{ color: T.lavenderDeep }}>{persona}</span>
      </p>
      <p className="cc-fade-up text-sm text-center max-w-xs mb-6" style={{ color: T.navySoft, animationDelay: ".15s" }}>
        Kai sudah paham seleramu. Sekarang isi lemarimu biar rekomendasinya makin akurat.
      </p>

      <div className="cc-fade-up w-full rounded-3xl p-5" style={{ background: T.white, boxShadow: "0 18px 44px -22px rgba(27,31,59,.28)", animationDelay: ".2s" }}>
        {/* styles */}
        <p className="text-xs font-bold mb-2" style={{ color: T.navySoft }}>VIBE UTAMA</p>
        <div className="flex gap-2.5 mb-4 cc-stagger">
          {(profile.styles || []).map((s) => (
            <div key={s} className="flex flex-col items-center gap-1" style={{ width: 66 }}>
              <StyleThumb styleKey={s} size={66} />
              <span className="text-[11px] font-semibold text-center leading-tight" style={{ color: T.navy }}>{s}</span>
            </div>
          ))}
        </div>
        {/* palette */}
        <p className="text-xs font-bold mb-2" style={{ color: T.navySoft }}>PALET WARNAMU</p>
        <div className="flex gap-1.5 mb-4">
          {colors.map((c) => <span key={c.name} className="flex-1 h-8 rounded-lg" style={{ background: c.hex, boxShadow: "inset 0 0 0 1px rgba(0,0,0,.06)" }} title={c.name} />)}
        </div>
        {/* meta */}
        <div className="flex flex-wrap gap-2">
          {[profile.gender, profile.age && `${profile.age} th`, profile.budget].filter(Boolean).map((m) => (
            <span key={m} className="px-3 py-1 rounded-full text-xs font-semibold" style={{ background: T.mintLight, color: T.navy }}>{m}</span>
          ))}
        </div>
      </div>

      <div className="flex-1" />
      <Button full icon={ArrowRight} onClick={onContinue} style={{ paddingTop: 15, paddingBottom: 15, fontSize: 16, marginTop: 20 }}>
        Lanjut: isi lemariku
      </Button>
    </div>
  );
}
