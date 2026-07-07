import { useState, useMemo } from "react";
import { Sparkles, ShoppingBag, Wallet, BarChart3, MessageCircle, Bell, Moon, Sun, Settings, ShieldCheck, Download, Trash2, Crown, ChevronRight, HelpCircle, ChevronDown, Mail, LogOut } from "lucide-react";
import { T, fontDisplay } from "../../theme/tokens";
import { Button, Toggle } from "../../components/ui";
import { TierBadge } from "../../components/TierBadge";
import { computeStyleScore } from "../../lib/scoring";
import { FAQ_ITEMS } from "../../data/mock";

function StatCard({ icon: Icon, label, value, dark }) {
  return (
    <div className="rounded-2xl p-3 flex-1" style={{ background: dark ? "#252A4D" : T.white, boxShadow: "0 6px 18px -12px rgba(27,31,59,0.2)" }}>
      <Icon size={18} color={T.lavenderDeep} />
      <p className="font-extrabold text-lg mt-1.5" style={{ ...fontDisplay, color: dark ? "#fff" : T.navy }}>{value}</p>
      <p className="text-[11px]" style={{ color: dark ? "rgba(255,255,255,0.6)" : T.navySoft }}>{label}</p>
    </div>
  );
}

function QuickAction({ icon: Icon, title, sub, onClick, dark }) {
  return (
    <button onClick={onClick} className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl" style={{ background: dark ? "#252A4D" : T.white, border: dark ? "none" : "1px solid #E3E6F0" }}>
      <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: T.mintLight }}><Icon size={17} color={T.lavenderDeep} /></div>
      <div className="flex-1 text-left">
        <p className="text-sm font-semibold" style={{ color: dark ? "#fff" : T.navy }}>{title}</p>
        <p className="text-xs" style={{ color: dark ? "rgba(255,255,255,0.6)" : T.navySoft }}>{sub}</p>
      </div>
      <ChevronRight size={16} color={dark ? "rgba(255,255,255,0.5)" : T.navySoft} />
    </button>
  );
}

/* ============ PROFILE & SETTINGS ============ */
export function ProfileScreen({ items, swapRequests, plan, settings, setSettings, rankOptIn, setRankOptIn, onNavigate, onUpgrade, onManageSub, onSignOut, onDeleteAccount, onExport }) {
  const [faqOpen, setFaqOpen] = useState(null);
  const [confirmSignOut, setConfirmSignOut] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(0);
  const dark = settings.appearance === "dark";

  const score = useMemo(() => computeStyleScore(items), [items]);
  const outfitsGenerated = items.reduce((s, i) => s + i.wearCount, 0);
  const itemsOrganized = items.length;
  // Money saved = (pemakaian ulang × estimasi hemat/pakai) + (swap selesai × estimasi nilai sewa dihindari)
  const completedSwaps = swapRequests.filter((r) => r.status === "selesai").length;
  const moneySaved = Math.round(outfitsGenerated * 15000 + completedSwaps * 75000);

  const set = (k, v) => setSettings({ ...settings, [k]: v });

  const bg = dark ? "#1B1F3B" : T.bg;
  const cardBg = dark ? "#252A4D" : T.white;
  const textMain = dark ? "#fff" : T.navy;
  const textSub = dark ? "rgba(255,255,255,0.6)" : T.navySoft;

  return (
    <div className="pb-24" style={{ background: bg, minHeight: "100vh" }}>
      <div className="px-4 pt-6 pb-4">
        <p className="font-extrabold text-2xl" style={{ ...fontDisplay, color: textMain }}>Profil</p>
      </div>

      {/* Header akun */}
      <div className="px-4">
        <div className="rounded-3xl p-5" style={{ background: dark ? "#252A4D" : `linear-gradient(135deg, ${T.mintLight}, #F3EEFB)` }}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl" style={{ background: `linear-gradient(135deg, ${T.mint}, ${T.lavender})` }}>😎</div>
            <div className="flex-1">
              <p className="font-bold text-lg" style={{ ...fontDisplay, color: textMain }}>Kamu</p>
              <p className="text-sm" style={{ color: textSub }}>kamu@closetcloud.id</p>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            {plan === "premium" ? (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full" style={{ background: `linear-gradient(135deg, ${T.mint}, ${T.lavender})` }}>
                <Crown size={13} color={T.navy} /><span className="font-bold text-xs" style={{ color: T.navy }}>ClosetCloud+</span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full" style={{ background: dark ? "#1B1F3B" : T.white }}>
                <span className="font-bold text-xs" style={{ color: textSub }}>Paket Free</span>
              </div>
            )}
            <TierBadge tier={score.tier} size="lg" />
          </div>
        </div>
      </div>

      {/* 3 kartu statistik */}
      <div className="px-4 mt-3 flex gap-2.5">
        <StatCard icon={Sparkles} label="Outfits Generated" value={outfitsGenerated} dark={dark} />
        <StatCard icon={ShoppingBag} label="Items Organized" value={itemsOrganized} dark={dark} />
        <StatCard icon={Wallet} label="Money Saved" value={`Rp${(moneySaved / 1000).toFixed(0)}rb`} dark={dark} />
      </div>

      {/* Quick actions */}
      <div className="px-4 mt-4">
        <p className="text-xs font-semibold mb-2" style={{ color: textSub }}>AKSI CEPAT</p>
        <div className="flex flex-col gap-2">
          <QuickAction icon={BarChart3} title="View Analytics" sub="Lihat insight lemarimu" onClick={() => onNavigate("dashboard")} dark={dark} />
          <QuickAction icon={Wallet} title="Cost Per Wear" sub="Lacak penghematanmu" onClick={() => onNavigate("analytics")} dark={dark} />
          <QuickAction icon={MessageCircle} title="AI Chat Stylist" sub="Minta saran gaya ke Kai" onClick={() => onNavigate("kai")} dark={dark} />
        </div>
      </div>

      {/* Settings */}
      <div className="px-4 mt-5">
        <p className="text-xs font-semibold mb-2" style={{ color: textSub }}>PENGATURAN</p>

        {/* Notifikasi */}
        <div className="rounded-2xl p-4 mb-2.5" style={{ background: cardBg, border: dark ? "none" : "1px solid #E3E6F0" }}>
          <div className="flex items-center gap-2 mb-3"><Bell size={16} color={T.lavenderDeep} /><p className="text-sm font-semibold" style={{ color: textMain }}>Notifikasi</p></div>
          {[["notifOutfit", "Outfit harian"], ["notifSwap", "Aktivitas swap"], ["notifEvent", "Pengingat acara"]].map(([k, l]) => (
            <div key={k} className="flex items-center justify-between py-1.5">
              <span className="text-sm" style={{ color: textSub }}>{l}</span>
              <Toggle on={settings[k]} onChange={() => set(k, !settings[k])} />
            </div>
          ))}
        </div>

        {/* Appearance */}
        <div className="rounded-2xl p-4 mb-2.5" style={{ background: cardBg, border: dark ? "none" : "1px solid #E3E6F0" }}>
          <div className="flex items-center gap-2 mb-3"><Moon size={16} color={T.lavenderDeep} /><p className="text-sm font-semibold" style={{ color: textMain }}>Tampilan</p></div>
          <div className="flex gap-2">
            {[["light", "Terang", Sun], ["dark", "Gelap", Moon], ["system", "Sistem", Settings]].map(([k, l, Ic]) => (
              <button key={k} onClick={() => set("appearance", k)} className="flex-1 rounded-xl py-2.5 flex flex-col items-center gap-1"
                style={{ background: settings.appearance === k ? T.mintLight : (dark ? "#1B1F3B" : "#F7F8FC"), border: settings.appearance === k ? `1.5px solid ${T.mint}` : "1px solid transparent" }}>
                <Ic size={15} color={settings.appearance === k ? T.lavenderDeep : textSub} />
                <span className="text-xs font-medium" style={{ color: settings.appearance === k ? T.navy : textSub }}>{l}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Privacy */}
        <div className="rounded-2xl p-4 mb-2.5" style={{ background: cardBg, border: dark ? "none" : "1px solid #E3E6F0" }}>
          <div className="flex items-center gap-2 mb-3"><ShieldCheck size={16} color={T.lavenderDeep} /><p className="text-sm font-semibold" style={{ color: textMain }}>Privasi</p></div>
          <div className="flex items-center justify-between py-1.5">
            <span className="text-sm" style={{ color: textSub }}>Tampil di leaderboard</span>
            <Toggle on={rankOptIn === true} onChange={() => setRankOptIn(rankOptIn === true ? false : true)} />
          </div>
          <div className="flex items-center justify-between py-1.5">
            <span className="text-sm" style={{ color: textSub }}>Terima permintaan swap</span>
            <Toggle on={settings.allowSwap} onChange={() => set("allowSwap", !settings.allowSwap)} />
          </div>
          <button onClick={onExport} className="w-full flex items-center gap-2 py-2 mt-1"><Download size={15} color={textSub} /><span className="text-sm" style={{ color: textSub }}>Unduh data saya (JSON)</span></button>
          <button onClick={() => setConfirmDelete(1)} className="w-full flex items-center gap-2 py-2"><Trash2 size={15} color={T.coral} /><span className="text-sm font-medium" style={{ color: T.coral }}>Hapus akun</span></button>
        </div>

        {/* Subscription */}
        <button onClick={plan === "premium" ? onManageSub : onUpgrade} className="w-full rounded-2xl p-4 mb-2.5 flex items-center gap-2" style={{ background: cardBg, border: dark ? "none" : "1px solid #E3E6F0" }}>
          <Crown size={16} color={T.lavenderDeep} />
          <div className="flex-1 text-left">
            <p className="text-sm font-semibold" style={{ color: textMain }}>{plan === "premium" ? "Kelola Langganan" : "Upgrade ke ClosetCloud+"}</p>
            <p className="text-xs" style={{ color: textSub }}>{plan === "premium" ? "Aktif · perpanjang otomatis" : "Buka semua fitur Rp 30.000/bulan"}</p>
          </div>
          <ChevronRight size={16} color={textSub} />
        </button>

        {/* Help Center */}
        <div className="rounded-2xl p-4 mb-2.5" style={{ background: cardBg, border: dark ? "none" : "1px solid #E3E6F0" }}>
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
        <button onClick={() => setConfirmSignOut(true)} className="w-full rounded-2xl p-4 flex items-center justify-center gap-2" style={{ background: dark ? "#3A2530" : "#FCEEE9" }}>
          <LogOut size={16} color={T.coral} /><span className="text-sm font-bold" style={{ color: T.coral }}>Keluar</span>
        </button>
      </div>

      {/* Konfirmasi sign out */}
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

      {/* Konfirmasi hapus akun (ganda) */}
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
