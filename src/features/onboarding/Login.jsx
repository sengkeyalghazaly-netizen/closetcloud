import { useState } from "react";
import { ChevronLeft, User, Mail, ArrowRight, ShieldCheck } from "lucide-react";
import { T, fontDisplay } from "../../theme/tokens";
import { Button } from "../../components/ui";
import { Logo } from "../../components/illustrations";
import { sound } from "../../lib/sound";

/* Mock auth — cukup nama + email disimpan lokal. Di produksi diganti Supabase
 * Auth tanpa mengubah alur layar ini. */
export function Login({ onLogin, onBack }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const emailOk = /^\S+@\S+\.\S+$/.test(email);
  const ready = name.trim().length >= 2 && emailOk;

  const social = (provider) => {
    sound.select();
    onLogin({ name: name.trim() || provider.user, email: email.trim() || provider.email, provider: provider.key });
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: T.bg }}>
      <div className="flex items-center px-5 pt-6">
        <button onClick={() => { sound.tap(); onBack(); }} className="cc-press w-9 h-9 rounded-full flex items-center justify-center" style={{ background: T.white }}>
          <ChevronLeft size={18} color={T.navy} />
        </button>
      </div>

      <div className="flex-1 flex flex-col px-7 pt-4">
        <div className="cc-pop-in mb-5"><Logo size={56} rounded={16} glow /></div>
        <p className="cc-fade-up font-extrabold text-[26px] leading-tight" style={{ ...fontDisplay, color: T.navy }}>Halo! Kenalan dulu yuk</p>
        <p className="cc-fade-up text-sm mb-7" style={{ color: T.navySoft, animationDelay: ".05s" }}>Biar Ajax bisa manggil kamu & nyimpen lemarimu.</p>

        {/* Social mock */}
        <div className="flex flex-col gap-2.5 mb-5 cc-stagger">
          <button onClick={() => social({ key: "google", user: "Kamu", email: "kamu@gmail.com" })}
            className="cc-press flex items-center justify-center gap-3 rounded-2xl py-3.5 font-semibold" style={{ background: T.white, border: "1.5px solid #E3E6F0", color: T.navy }}>
            <GoogleGlyph /> Lanjut dengan Google
          </button>
          <button onClick={() => social({ key: "apple", user: "Kamu", email: "kamu@icloud.com" })}
            className="cc-press flex items-center justify-center gap-3 rounded-2xl py-3.5 font-semibold" style={{ background: T.navy, color: "#fff" }}>
            <AppleGlyph /> Lanjut dengan Apple
          </button>
        </div>

        <div className="flex items-center gap-3 mb-5">
          <div className="flex-1 h-px" style={{ background: "#E3E6F0" }} />
          <span className="text-xs font-medium" style={{ color: T.navySoft }}>atau pakai email</span>
          <div className="flex-1 h-px" style={{ background: "#E3E6F0" }} />
        </div>

        <div className="flex flex-col gap-3">
          <Field icon={User} placeholder="Nama panggilan" value={name} onChange={setName} />
          <Field icon={Mail} placeholder="Email" value={email} onChange={setEmail} type="email" />
        </div>

        <div className="flex items-center gap-1.5 mt-4">
          <ShieldCheck size={13} color={T.sage} />
          <span className="text-[11px]" style={{ color: T.navySoft }}>Data lemarimu privat & tersimpan di perangkatmu.</span>
        </div>

        <div className="flex-1" />
        <div className="pb-9 pt-4">
          <Button full disabled={!ready} icon={ArrowRight} onClick={() => { sound.select(); onLogin({ name: name.trim(), email: email.trim(), provider: "email" }); }} style={{ paddingTop: 15, paddingBottom: 15, fontSize: 16 }}>
            Buat akun & lanjut
          </Button>
        </div>
      </div>
    </div>
  );
}

function Field({ icon: Icon, placeholder, value, onChange, type = "text" }) {
  return (
    <div className="flex items-center gap-2.5 rounded-2xl px-4" style={{ background: T.white, border: "1.5px solid #E3E6F0" }}>
      <Icon size={18} color={T.lavenderDeep} />
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} type={type}
        className="flex-1 py-3.5 outline-none text-[15px] bg-transparent" style={{ color: T.navy }} />
    </div>
  );
}

function GoogleGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48">
      <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.6l6.7-6.7C35.6 2.4 30.2 0 24 0 14.6 0 6.4 5.4 2.5 13.3l7.9 6.1C12.2 13.3 17.6 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-2.8-.4-4H24v8h12.7c-.3 2.1-1.6 5.2-4.6 7.3l7.1 5.5c4.2-3.9 6.8-9.6 6.8-16.8z" />
      <path fill="#FBBC05" d="M10.4 28.6c-.5-1.5-.8-3-.8-4.6s.3-3.1.8-4.6l-7.9-6.1C.9 16.5 0 20.1 0 24s.9 7.5 2.5 10.7l7.9-6.1z" />
      <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.1-5.5c-2 1.3-4.6 2.3-8.8 2.3-6.4 0-11.8-3.8-13.6-9.9l-7.9 6.1C6.4 42.6 14.6 48 24 48z" />
    </svg>
  );
}
function AppleGlyph() {
  return <svg width="16" height="18" viewBox="0 0 24 24" fill="#fff"><path d="M16.5 12.5c0-2.6 2.1-3.8 2.2-3.9-1.2-1.8-3-2-3.7-2-1.6-.2-3 .9-3.8.9s-2-.9-3.3-.9c-1.7 0-3.3 1-4.1 2.5-1.8 3.1-.5 7.6 1.2 10.1.8 1.2 1.8 2.6 3.1 2.5 1.2-.05 1.7-.8 3.2-.8s1.9.8 3.3.8c1.4 0 2.2-1.2 3-2.5.9-1.4 1.3-2.8 1.3-2.9-.03-.01-2.6-1-2.6-4z M14.7 4.5c.7-.8 1.1-2 1-3.1-1 .04-2.2.7-2.9 1.5-.6.7-1.2 1.9-1 3 1.1.08 2.2-.6 2.9-1.4z" /></svg>;
}
