# ClosetCloud — Prototype Interaktif

> **"Your Personal AI Stylist — Optimize What You Already Own"**
> AI digital wardrobe & personal stylist untuk Gen Z Indonesia. Bukan aplikasi belanja — asisten yang membantu tampil maksimal dari baju yang sudah dimiliki (anti-overconsumption).
>
> Dibuat oleh **Monster Group** (Al-Ghazali Sengkey, Esther Liani Tamengkel, Valentina Febrianti Damima) — Politeknik Negeri Manado, untuk IBAC XI 2026.

Aplikasi web fungsional penuh (bukan mockup) dengan **12 fitur** yang semuanya bisa langsung dipakai. Sudah **installable (PWA)** — bisa dipasang di HP seperti app native & jalan offline dasar — dan **data tersimpan otomatis** (localStorage) sehingga tidak hilang saat refresh. Arsitekturnya sengaja modular supaya **tetap mudah dikembangkan** dan bisa dilanjutkan ke produksi (React Native / Supabase) tanpa bongkar ulang.

---

## 1. Fitur (semua berfungsi, tanpa placeholder)

**6 Fitur Inti**
1. **AI Wardrobe Scan** — foto/upload baju, simulasi AI recognition bertahap, edit manual atribut, grid + filter kategori.
2. **AI Outfit Generator v2** — rekomendasi dari isi lemari nyata dengan selektor **Mood × Tempat/Acara × Style global** (Streetwear, Old Money, Y2K, Dark Academia, Korean Style, Batik, dll), cuaca, dan color reasoning. Tombol ❤️ menyimpan preferensi.
3. **Outfit Scheduler** — kalender bulanan, peringatan anti-repetisi (±3 hari), acara khusus + pengingat.
4. **Cost-Per-Wear Analytics** — harga ÷ jumlah pemakaian, update real-time saat outfit ditandai dipakai.
5. **Fashion Swap Network v2** — feed user Indonesia, deposit digital, rating dua arah, **verifikasi foto asli via kamera** + badge terverifikasi.
6. **Style Insight Dashboard** — grafik pemakaian 7 hari, item andalan, rekomendasi simpan/jual/donasi, jejak karbon dihindari, share ringkasan.

**6 Fitur Expansion**
7. **AI Chat Stylist "Kai"** — chat sadar-lemari (Claude API bila tersedia, fallback stylist lokal saat hosting mandiri). Action cards fungsional: outfit, re-wear, donasi, jual, DIY, gap lemari.
8. **Style Rank & Leaderboard** — 5 tier (Amateur → Trendsetter), formula skor 5 komponen, 4 papan peringkat, opt-in privasi.
9. **Premium / Freemium Gating** — Free vs ClosetCloud+ (Rp 30.000/bln), kuota AI chat 10/hari & outfit 3/hari, paywall sheet konsisten.
10. **Profile & Settings** — header akun, 3 kartu statistik nyata, quick actions, notifikasi, dark mode, privasi, subscription, Help Center (10 FAQ), sign out.
11. **Onboarding** — quiz → scan → rekomendasi pertama, alur < 10 menit.
12. **Dark mode** — pada shell & Profile (rollout penuh ke semua layar = item roadmap).

---

## 2. Cara menjalankan (lokal)

Prasyarat: Node.js 18+.

```bash
npm install
npm run dev
```

Buka `http://localhost:5173`. Untuk build produksi:

```bash
npm run build      # output ke folder dist/
npm run preview    # uji hasil build lokal
```

---

## 3. Cara online-kan supaya bisa dipakai siapa saja (link publik + installable)

Sekali di-online-kan, aplikasi bisa dibuka **siapa saja lewat 1 link** di HP/laptop **tanpa install apa pun**. Aplikasi ini juga sudah **PWA (installable)** — bisa "Tambahkan ke Layar Utama" sehingga muncul ikon & terasa seperti app native, plus tetap bisa dibuka walau sinyal jelek (offline dasar). Tidak ada backend wajib, jadi **paling minim error**.

### ⭐ Cara paling gampang — tanpa terminal (~2 menit): Netlify Drop
1. Siapkan folder hasil build: jalankan `npm run build` **sekali** (atau minta developer) → muncul folder **`dist/`**.
2. Buka **https://app.netlify.com/drop** di browser.
3. **Seret (drag) folder `dist/`** ke halaman itu.
4. Langsung dapat link publik, mis. `https://closetcloud-xyz.netlify.app` → **bagikan ke siapa saja**. (Bikin akun gratis kalau mau link permanen + ganti nama.)

### Cara auto-update (Vercel + GitHub) — sekali set, seterusnya otomatis
1. Push folder proyek ini ke GitHub.
2. Buka **vercel.com** → **Add New → Project** → pilih repo. Preset "Vite" terdeteksi otomatis. Klik **Deploy**.
3. Dapat link `https://namamu.vercel.app`. Setiap kali kode diubah & di-push, situs **online ulang otomatis**.

### Pasang seperti app di HP (untuk pengguna akhir)
Buka link → menu browser (⋮ di Chrome / kotak-panah di Safari) → **"Tambahkan ke Layar Utama"** → muncul ikon ClosetCloud, buka fullscreen tanpa address bar.

### Catatan
- File `vercel.json` sudah ada untuk SPA routing. Tidak ada environment variable wajib untuk versi demo.
- **Domain sendiri** (mis. `closetcloud.id`) bisa disambungkan gratis di menu Domains Netlify/Vercel.
- Data tiap pengguna tersimpan di perangkat masing-masing (localStorage). Untuk akun login + data tersinkron antar perangkat, ikuti roadmap Supabase di §7 — arsitekturnya sudah disiapkan.

> **Catatan tentang Kai (AI Chat):** API key tidak boleh dikirim ke browser, jadi Kai punya dua mode. Kalau `VITE_KAI_ENDPOINT` **kosong** (default), Kai memakai **rule-engine lokal** yang tetap menjawab kontekstual dari lemari nyata — tanpa backend, tanpa request gagal. Untuk Kai berbasis LLM di produksi, buat Edge Function proxy yang memegang Claude API key + enforce kuota, lalu set `VITE_KAI_ENDPOINT` ke URL-nya (lihat `.env.example` & roadmap). Tidak ada perubahan komponen yang diperlukan.

### Persistensi
State demo (lemari, jadwal, swap, chat, langganan, pengaturan) otomatis disimpan ke **localStorage** (namespace `closetcloud:`), jadi refresh browser tidak menghapus progres. "Keluar" / "Hapus akun" membersihkan storage ini. Lihat [`src/store/persist.js`](src/store/persist.js) — satu-satunya titik yang perlu diganti saat pindah ke Supabase.

---

## 4. Arsitektur & struktur folder

Kode disusun modular supaya **tetap mudah dikembangkan** — menambah fitur = buat folder di `src/features/` lalu daftarkan tab-nya di `App.jsx`. Tidak ada file monolit.

```
src/
├── theme/tokens.js          # design tokens (warna/font) — sumber kebenaran brand
├── config/plans.js          # limit freemium & benefit premium (satu tempat)
├── data/
│   ├── reference.js         # vokabulari domain (kategori, warna, mood, style…)
│   └── mock.js              # data komunitas mock (swap, leaderboard, FAQ)
├── lib/                     # logika murni, gampang di-test / dipindah ke server
│   ├── utils.js             # id, tanggal, kuota
│   ├── outfits.js           # generator outfit v1 & v2
│   ├── recognition.js       # simulasi AI scan (seam ke model vision nyata)
│   ├── scoring.js           # perhitungan Style Score
│   ├── carbon.js            # estimasi jejak karbon
│   └── kai.js               # AI stylist (proxy Claude API ↔ fallback lokal)
├── store/persist.js         # persistensi localStorage (seam ke Supabase)
├── components/              # UI primitif bersama (Button, Card, Chip, badge…)
├── features/                # satu folder per fitur, self-contained
│   ├── onboarding/ wardrobe/ outfit/ scheduler/ swap/
│   ├── analytics/ dashboard/ kai/ rank/ premium/ profile/
└── App.jsx                  # shell tipis: state global + routing tab + gating
```

**Seam untuk backend produksi** (diganti tanpa refactor komponen):
- `store/persist.js` → data layer Supabase (Postgres + RLS)
- `lib/recognition.js` → model vision nyata (Google Vision / custom)
- `lib/kai.js` + `VITE_KAI_ENDPOINT` → Edge Function proxy Claude API
- `config/plans.js` + `lib/utils.js` (`remaining`) → kuota server-side

## 5. Struktur data (state model prototype)

Setiap item lemari:
```js
{
  id, name, category,        // Atasan/Bawahan/Outerwear/Sepatu/Aksesori
  style,                     // Kasual/Formal/Olahraga/Pesta
  color: { name, hex }, material, pattern,
  price,                     // untuk cost-per-wear & skor
  image,                     // data URL foto
  wearCount, lastWorn, wearHistory: [],   // untuk analytics & grafik
  flag,                      // 'donate' | 'sell' | null (dari Kai)
  isSwappable, swapPhotos, photoVerified, // Swap v2
}
```
State global lain: `schedule`, `swapRequests`, `deposit`, `chat`, `likes`, `rankOptIn`, `plan`, `usage`, `settings`.

---

## 6. Cara menguji tiap fitur (checklist manual)

- **Onboarding:** jalankan dari awal → quiz → scan 3 baju → lihat reward outfit.
- **Wardrobe Scan:** tab Lemari → tombol kamera → upload → lihat proses AI → edit atribut → simpan.
- **Outfit v2:** tab Outfit → ganti Tempat/Mood/Style → "Generate ulang" → ❤️ favorit → "Pakai hari ini".
- **Kai:** tab Kai → "Baju mana yang layak didonasikan?" → tandai donasi → cek badge di Lemari.
- **Scheduler:** tab Lainnya → Jadwal → ketuk tanggal → generate/acara → buat outfit mirip berdekatan untuk lihat warning.
- **Swap v2:** Swap → Punya Saya → "Aktifkan" → foto verifikasi. Jelajahi → ajukan pinjam → Transaksi → rating.
- **Rank:** Rank → opt-in → lihat skor & 4 papan peringkat.
- **Premium:** kirim 10 pesan Kai / generate 4× → paywall → upgrade.
- **Profile:** Profil → statistik nyata → dark mode → FAQ → unduh data → keluar.

---

## 7. Roadmap ke aplikasi produksi

Prototype ini adalah **Fase 1**. Untuk jadi aplikasi produksi sesuai business plan:

**Tech stack target:** React Native + Expo + TypeScript (iOS & Android satu basis kode), NativeWind, Supabase (Postgres + Auth + Storage + Realtime + Edge Functions dengan RLS), Claude API via Edge Function, OpenWeatherMap, Midtrans/Xendit + RevenueCat, Next.js web dashboard.

**Langkah migrasi:**
1. **Backend Supabase** — buat tabel (`wardrobe_items`, `chat_conversations/messages`, `style_scores`, `user_stats`, `user_settings`, `subscriptions`, `usage_counters`, `swap_listings`) dengan RLS aktif; Storage untuk foto lemari (signed URL, privat per user).
2. **Auth nyata** — Supabase Auth gantikan mock sign-up.
3. **AI Wardrobe Scan asli** — model vision (Google Vision / custom) + background removal via Edge Function.
4. **Kai berbasis LLM** — Edge Function `ai-stylist-chat` memanggil Claude API (API key server-side), kuota di-enforce di `usage_counters`.
5. **Skor & leaderboard** — Edge Function `compute-style-score` (cron 6 jam) + `leaderboard` (hanya data opt-in, tanpa bocor foto/harga).
6. **Pembayaran** — RevenueCat + webhook `billing-webhook` untuk sinkron status langganan.
7. **Kuota server-side** — semua increment kuota pindah ke Edge Function agar tak bisa diakali dari client.
8. **Dark mode penuh** — ThemeProvider + NativeWind `darkMode`, audit tiap layar.

Master prompt lengkap untuk tahap ini ada di dokumen **ClosetCloud Expansion Pack v2.0** (Fase A–H) yang bisa dipakai di Claude Code / Cursor pada repo React Native.

---

## 8. Lisensi & kredit

Prototype untuk keperluan kompetisi IBAC XI 2026 — Monster Group, Politeknik Negeri Manado. Palet mint–lavender–navy. Font: Sora + Plus Jakarta Sans (Google Fonts).
