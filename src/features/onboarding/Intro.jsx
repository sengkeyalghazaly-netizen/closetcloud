import { useState } from "react";
import { ChevronLeft, ArrowRight } from "lucide-react";
import { T, fontDisplay } from "../../theme/tokens";
import { Button } from "../../components/ui";
import { Wordmark, IntroWardrobe, IntroStylist, IntroCommunity } from "../../components/illustrations";
import { sound } from "../../lib/sound";

const SLIDES = [
  { Art: IntroWardrobe, tint: "#7FD8BE", title: "Lemari kamu, jadi digital", body: "Foto bajumu sekali, ClosetCloud mengingat semuanya — warna, bahan, kapan terakhir dipakai." },
  { Art: IntroStylist, tint: "#8B6FCE", title: "Punya stylist pribadi 24/7", body: "Bingung mau pakai apa? Ajax meracik outfit dari isi lemarimu sesuai mood, acara, & cuaca hari ini." },
  { Art: IntroCommunity, tint: "#E8917A", title: "Swap, thrift, & terhubung", body: "Pinjam, tukar, atau jual baju yang jarang dipakai. Tampil beda tanpa harus beli baru." },
];

export function Intro({ onDone }) {
  const [i, setI] = useState(0);
  const last = i === SLIDES.length - 1;
  const S = SLIDES[i];

  const next = () => { sound.tap(); last ? onDone() : setI(i + 1); };
  const back = () => { sound.tap(); setI(Math.max(0, i - 1)); };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: T.bg }}>
      <div className="flex items-center justify-between px-5 pt-6">
        {i > 0 ? (
          <button onClick={back} className="cc-press w-9 h-9 rounded-full flex items-center justify-center" style={{ background: T.white }}>
            <ChevronLeft size={18} color={T.navy} />
          </button>
        ) : <Wordmark size={20} />}
        {!last && <button onClick={() => { sound.tap(); onDone(); }} className="cc-press text-sm font-semibold px-3 py-1.5" style={{ color: T.navySoft }}>Lewati</button>}
        {last && <div style={{ width: 40 }} />}
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
        <div key={i} className="cc-pop-in mb-8" style={{ filter: `drop-shadow(0 18px 40px ${S.tint}55)` }}>
          <S.Art size={248} />
        </div>
        <p key={`t${i}`} className="cc-fade-up font-extrabold text-[27px] leading-tight mb-3 max-w-xs" style={{ ...fontDisplay, color: T.navy }}>{S.title}</p>
        <p key={`b${i}`} className="cc-fade-up text-[15px] max-w-sm" style={{ color: T.navySoft, animationDelay: ".06s" }}>{S.body}</p>
      </div>

      <div className="px-8 pb-10">
        <div className="flex items-center justify-center gap-2 mb-6">
          {SLIDES.map((_, idx) => (
            <div key={idx} className="h-2 rounded-full transition-all duration-300" style={{ width: idx === i ? 26 : 8, background: idx === i ? T.lavenderDeep : "#D8DBE8" }} />
          ))}
        </div>
        <Button full icon={last ? undefined : ArrowRight} onClick={next} style={{ paddingTop: 15, paddingBottom: 15, fontSize: 16 }}>
          {last ? "Mulai sekarang" : "Lanjut"}
        </Button>
      </div>
    </div>
  );
}
