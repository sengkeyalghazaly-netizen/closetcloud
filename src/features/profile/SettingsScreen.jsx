import { useState } from "react";
import { Bell, Moon, Sun, Settings as Cog, ShieldCheck, Download, Trash2, Crown, HelpCircle, ChevronDown, Mail, LogOut, ChevronRight, User, ExternalLink } from "lucide-react";
import { T, fontDisplay } from "../../theme/tokens";
import { Header, Button, Toggle } from "../../components/ui";
import { FAQ_ITEMS } from "../../data/mock";

/* Semua pengaturan terpusat di sini — dilepas dari Profil agar Profil fokus &
 * tidak membingungkan. */
export function SettingsScreen({ profile, setProfile, settings, setSettings, plan, rankOptIn, setRankOptIn, onUpgrade, onManageSub, onExport, onSignOut, onDeleteAccount, onBack }) {
  const [faqOpen, setFaqOpen] = useState(null);
  const [confirmSignOut, setConfirmSignOut] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(0);
  const dark = settings.appearance === "dark";
  const set = (k, v) => setSettings({ ...settings, [k]: v });

  const bg = dark ? "#1B1F3B" : T.bg;
  const cardBg = dark ? "#252A4D" : T.white;
  const textMain = dark ? "#fff" : T.navy;
  const textSub = dark ? "rgba(255,255,255,0.6)" : T.navySoft;

  return (
    <div className="pb-28" style={{ background: bg, minHeight: "100vh" }}>
      <Header title="Pengaturan" subtitle="Atur akun, tampilan & privasi" onBack={onBack} />
      <div className="px-4 flex flex-col gap-2.5">
        {/* Notifikasi */}
        <div className="rounded-2xl p-4" style={{ background: cardBg, border: dark ? "none" : "1px solid #E3E6F0" }}>
          <div className="flex items-center gap-2 mb-3"><Bell size={16} color={T.lavenderDeep} /><p className="text-sm font-semibold" style={{ color: textMain }}>Notifikasi</p></div>
          {[["notifOutfit", "Outfit harian"], ["notifSwap", "Aktivitas swap"], ["notifEvent", "Pengingat acara"]].map(([k, l]) => (
            <div key={k} className="flex items-center justify-between py-1.5">
              <span className="text-sm" style={{ color: textSub }}>{l}</span>
              <Toggle on={settings[k]} onChange={() => set(k, !settings[k])} />
            </div>
          ))}
        </div>

        {/* Tampilan */}
        <div className="rounded-2xl p-4" style={{ background: cardBg, border: dark ? "none" : "1px solid #E3E6F0" }}>
          <div className="flex items-center gap-2 mb-3"><Moon size={16} color={T.lavenderDeep} /><p className="text-sm font-semibold" style={{ color: textMain }}>Tampilan</p></div>
          <div className="flex gap-2">
            {[["light", "Terang", Sun], ["dark", "Gelap", Moon], ["system", "Sistem", Cog]].map(([k, l, Ic]) => (
              <button key={k} onClick={() => set("appearance", k)} className="cc-press flex-1 rounded-xl py-2.5 flex flex-col items-center gap-1"
                style={{ background: settings.appearance === k ? T.mintLight : (dark ? "#1B1F3B" : "#F7F8FC"), border: settings.appearance === k ? `1.5px solid ${T.mint}` : "1px solid transparent" }}>
                <Ic size={15} color={settings.appearance === k ? T.lavenderDeep : textSub} />
                <span className="text-xs font-medium" style={{ color: settings.appearance === k ? T.navy : textSub }}>{l}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Avatar Realistis (Ready Player Me) */}
        <div className="rounded-2xl p-4" style={{ background: cardBg, border: dark ? "none" : "1px solid #E3E6F0" }}>
          <div className="flex items-center gap-2 mb-2"><User size={16} color={T.lavenderDeep} /><p className="text-sm font-semibold" style={{ color: textMain }}>Avatar Realistis 3D</p></div>
          <p className="text-xs mb-2.5" style={{ color: textSub }}>Tempel URL avatar Ready Player Me (.glb) — bikin gratis dari selfie di readyplayer.me. Dipakai di layar Outfit. Kosongkan = avatar bawaan (offline-safe).</p>
          <input
            value={profile?.avatarUrl || ""}
            onChange={(e) => setProfile({ ...(profile || {}), avatarUrl: e.target.value.trim() || undefined })}
            placeholder="https://models.readyplayer.me/xxxxxxxx.glb"
            className="w-full px-3.5 py-2.5 rounded-xl outline-none text-[13px]" style={{ background: dark ? "#1B1F3B" : "#F7F8FC", border: "1px solid #E3E6F0", color: textMain }} />
          <div className="flex items-center gap-2 mt-2.5">
            <a href="https://readyplayer.me/avatar" target="_blank" rel="noopener noreferrer" className="cc-press flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold" style={{ background: T.navy, color: "#fff" }}>
              Buat avatar <ExternalLink size={12} />
            </a>
            {profile?.avatarUrl && (
              <button onClick={() => setProfile({ ...(profile || {}), avatarUrl: undefined })} className="cc-press text-xs font-semibold px-3 py-1.5 rounded-xl" style={{ color: T.coral }}>Pakai bawaan</button>
            )}
          </div>
          {profile?.avatarUrl
            ? <p className="text-[11px] mt-2 flex items-center gap-1" style={{ color: T.sage }}><ShieldCheck size={12} />Avatar RPM aktif (butuh internet; otomatis fallback bila gagal load).</p>
            : <p className="text-[11px] mt-2" style={{ color: textSub }}>Sedang pakai avatar bawaan yang menggambarkan outfit dari atribut lemarimu.</p>}
        </div>

        {/* Privasi */}
        <div className="rounded-2xl p-4" style={{ background: cardBg, border: dark ? "none" : "1px solid #E3E6F0" }}>
          <div className="flex items-center gap-2 mb-3"><ShieldCheck size={16} color={T.lavenderDeep} /><p className="text-sm font-semibold" style={{ color: textMain }}>Privasi</p></div>
          <div className="flex items-center justify-between py-1.5">
            <span className="text-sm" style={{ color: textSub }}>Tampil di leaderboard</span>
            <Toggle on={rankOptIn === true} onChange={() => setRankOptIn(rankOptIn === true ? false : true)} />
          </div>
          <div className="flex items-center justify-between py-1.5">
            <span className="text-sm" style={{ color: textSub }}>Terima permintaan swap</span>
            <Toggle on={settings.allowSwap} onChange={() => set("allowSwap", !settings.allowSwap)} />
          </div>
          <p className="text-[11px] font-semibold mt-2 mb-1" style={{ color: textSub }}>Data yang dipublikasikan</p>
          {[["pubWardrobe", "Lemari bisa dilihat publik"], ["pubCity", "Tampilkan kota"], ["pubStats", "Tampilkan statistik gaya"]].map(([k, l]) => (
            <div key={k} className="flex items-center justify-between py-1.5">
              <span className="text-sm" style={{ color: textSub }}>{l}</span>
              <Toggle on={settings[k] !== false} onChange={() => set(k, settings[k] === false ? true : false)} />
            </div>
          ))}
          <button onClick={onExport} className="cc-press w-full flex items-center gap-2 py-2 mt-1"><Download size={15} color={textSub} /><span className="text-sm" style={{ color: textSub }}>Unduh data saya (JSON)</span></button>
          <button onClick={() => setConfirmDelete(1)} className="cc-press w-full flex items-center gap-2 py-2"><Trash2 size={15} color={T.coral} /><span className="text-sm font-medium" style={{ color: T.coral }}>Hapus akun</span></button>
        </div>

        {/* Subscription */}
        <button onClick={plan === "premium" ? onManageSub : onUpgrade} className="cc-press w-full rounded-2xl p-4 flex items-center gap-2" style={{ background: cardBg, border: dark ? "none" : "1px solid #E3E6F0" }}>
          <Crown size={16} color={T.lavenderDeep} />
          <div className="flex-1 text-left">
            <p className="text-sm font-semibold" style={{ color: textMain }}>{plan === "premium" ? "Kelola Langganan" : "Upgrade ke ClosetCloud+"}</p>
            <p className="text-xs" style={{ color: textSub }}>{plan === "premium" ? "Aktif · perpanjang otomatis" : "Buka semua fitur Rp 30.000/bulan"}</p>
          </div>
          <ChevronRight size={16} color={textSub} />
        </button>

        {/* Help Center */}
        <div className="rounded-2xl p-4" style={{ background: cardBg, border: dark ? "none" : "1px solid #E3E6F0" }}>
          <div className="flex items-center gap-2 mb-2"><HelpCircle size={16} color={T.lavenderDeep} /><p className="text-sm font-semibold" style={{ color: textMain }}>Pusat Bantuan</p></div>
          {FAQ_ITEMS.map((f, i) => (
            <div key={i} className="border-t" style={{ borderColor: dark ? "#333858" : "#EEF0F6" }}>
              <button onClick={() => setFaqOpen(faqOpen === i ? null : i)} className="w-full flex items-center justify-between py-2.5 text-left gap-2">
                <span className="text-sm" style={{ color: textMain }}>{f.q}</span>
                <ChevronDown size={15} color={textSub} style={{ transform: faqOpen === i ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
              </button>
              {faqOpen === i && <p className="text-xs pb-3" style={{ color: textSub }}>{f.a}</p>}
            </div>
          ))}
          <a href="mailto:support@closetcloud.id" className="flex items-center gap-2 pt-2 border-t" style={{ borderColor: dark ? "#333858" : "#EEF0F6" }}>
            <Mail size={15} color={T.lavenderDeep} /><span className="text-sm font-medium" style={{ color: T.lavenderDeep }}>Hubungi support</span>
          </a>
        </div>

        {/* Sign out */}
        <button onClick={() => setConfirmSignOut(true)} className="cc-press w-full rounded-2xl p-4 flex items-center justify-center gap-2" style={{ background: dark ? "#3A2530" : "#FCEEE9" }}>
          <LogOut size={16} color={T.coral} /><span className="text-sm font-bold" style={{ color: T.coral }}>Keluar</span>
        </button>
      </div>

      {confirmSignOut && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-6" style={{ background: "rgba(27,31,59,0.6)" }}>
          <div className="w-full max-w-xs rounded-3xl p-5" style={{ background: T.bg }}>
            <p className="font-bold text-base mb-1" style={{ ...fontDisplay, color: T.navy }}>Keluar dari akun?</p>
            <p className="text-sm mb-4" style={{ color: T.navySoft }}>Kamu perlu masuk lagi untuk mengakses lemarimu.</p>
            <div className="flex gap-2">
              <Button variant="outline" full onClick={() => setConfirmSignOut(false)}>Batal</Button>
              <Button full onClick={onSignOut} style={{ background: T.coral, color: "#fff" }}>Keluar</Button>
            </div>
          </div>
        </div>
      )}
      {confirmDelete > 0 && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-6" style={{ background: "rgba(27,31,59,0.6)" }}>
          <div className="w-full max-w-xs rounded-3xl p-5" style={{ background: T.bg }}>
            <p className="font-bold text-base mb-1" style={{ ...fontDisplay, color: T.navy }}>{confirmDelete === 1 ? "Hapus akun?" : "Yakin? Ini permanen"}</p>
            <p className="text-sm mb-4" style={{ color: T.navySoft }}>{confirmDelete === 1 ? "Semua data lemari, swap, dan skormu akan dihapus." : "Tindakan ini tidak bisa dibatalkan. Ketuk sekali lagi untuk konfirmasi."}</p>
            <div className="flex gap-2">
              <Button variant="outline" full onClick={() => setConfirmDelete(0)}>Batal</Button>
              <Button full onClick={() => confirmDelete === 1 ? setConfirmDelete(2) : onDeleteAccount()} style={{ background: T.coral, color: "#fff" }}>{confirmDelete === 1 ? "Lanjut" : "Hapus permanen"}</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
