import { Crown, Trophy, Award, Star, Shirt } from "lucide-react";
import { T } from "../theme/tokens";

/* ============ MOCK NETWORK / COMMUNITY DATA ============
 * Stand-ins for what the production backend (Supabase tables) will serve.
 * Kept in one place so swapping to real fetches is a data-source change,
 * not a component rewrite. */

export const DEPOSIT_AMOUNT = 50000;

export const MOCK_USERS = [
  { name: "Nadia Putri", city: "Manado", rating: 4.8, initials: "NP", color: T.mint },
  { name: "Rangga Aditya", city: "Jakarta", rating: 4.6, initials: "RA", color: T.lavender },
  { name: "Bella Anastasia", city: "Surabaya", rating: 4.9, initials: "BA", color: T.sage },
  { name: "Yusuf Maulana", city: "Manado", rating: 4.5, initials: "YM", color: T.coral },
  { name: "Clarissa Wongso", city: "Bandung", rating: 4.7, initials: "CW", color: T.lavenderDeep },
];

export const MOCK_SWAP_ITEMS = [
  { id: "sw-1", name: "Blazer Krem Oversized", category: "Outerwear", style: "Formal", size: "M", color: { name: "Krem", hex: "#E7DCC8" }, owner: MOCK_USERS[0], locked: false, verified: true },
  { id: "sw-2", name: "Dress Pesta Lavender", category: "Atasan", style: "Pesta", size: "S", color: { name: "Lavender", hex: "#B9A7DA" }, owner: MOCK_USERS[2], locked: false, verified: true },
  { id: "sw-3", name: "Sneakers Putih Klasik", category: "Sepatu", style: "Kasual", size: "42", color: { name: "Putih", hex: "#F4F4F4" }, owner: MOCK_USERS[1], locked: true, verified: true },
  { id: "sw-4", name: "Jaket Denim Vintage", category: "Outerwear", style: "Kasual", size: "L", color: { name: "Denim", hex: "#5B7A9D" }, owner: MOCK_USERS[3], locked: false, verified: false },
  { id: "sw-5", name: "Kemeja Batik Formal", category: "Atasan", style: "Formal", size: "M", color: { name: "Cokelat", hex: "#8B5E3C" }, owner: MOCK_USERS[4], locked: false, verified: true },
  { id: "sw-6", name: "Rok Plisket Navy", category: "Bawahan", style: "Formal", size: "S", color: { name: "Navy", hex: "#22304A" }, owner: MOCK_USERS[0], locked: false, verified: true },
];

/* ============ STYLE RANK TIERS & LEADERBOARD ============ */
export const TIERS = {
  1: { name: "Trendsetter", color: "#8B6FCE", bg: "linear-gradient(135deg, #7FD8BE, #C9B8E8)", icon: Crown, min: 85 },
  2: { name: "Style Icon", color: "#1B1F3B", bg: "#1B1F3B", icon: Trophy, min: 70 },
  3: { name: "Style Hunter", color: "#8B6FCE", bg: "#F3EEFB", icon: Award, min: 50 },
  4: { name: "Advance", color: "#5FA88F", bg: "#EAFBF5", icon: Star, min: 30 },
  5: { name: "Amateur", color: "#8A8FA8", bg: "#EEF0F6", icon: Shirt, min: 0 },
};

export const MOCK_LEADERBOARD = [
  { name: "Kirana Dewi", city: "Manado", province: "Sulawesi Utara", initials: "KD", overall: 91, stylish: 94, items: 128, tier: 1 },
  { name: "Alya Ramadhani", city: "Jakarta", province: "DKI Jakarta", initials: "AR", overall: 88, stylish: 90, items: 156, tier: 1 },
  { name: "Bella Anastasia", city: "Surabaya", province: "Jawa Timur", initials: "BA", overall: 82, stylish: 87, items: 98, tier: 2 },
  { name: "Nadia Putri", city: "Manado", province: "Sulawesi Utara", initials: "NP", overall: 76, stylish: 81, items: 72, tier: 2 },
  { name: "Clarissa Wongso", city: "Bandung", province: "Jawa Barat", initials: "CW", overall: 71, stylish: 79, items: 64, tier: 2 },
  { name: "Rangga Aditya", city: "Jakarta", province: "DKI Jakarta", initials: "RA", overall: 63, stylish: 66, items: 89, tier: 3 },
  { name: "Yusuf Maulana", city: "Manado", province: "Sulawesi Utara", initials: "YM", overall: 54, stylish: 58, items: 41, tier: 3 },
  { name: "Sinta Larasati", city: "Semarang", province: "Jawa Tengah", initials: "SL", overall: 47, stylish: 52, items: 38, tier: 4 },
];

export const MOCK_AVATAR_COLORS = [T.mint, T.lavender, T.sage, T.coral, T.lavenderDeep];

/* ============ KAI (AI STYLIST) STARTER PROMPTS ============ */
export const KAI_QUICK_PROMPTS = [
  "Outfit buat kuliah besok?",
  "Baju mana yang layak didonasikan?",
  "Ide DIY dari baju lama?",
  "Apa yang kurang dari lemariku?",
];

/* ============ HELP CENTER FAQ ============ */
export const FAQ_ITEMS = [
  { q: "Apa itu ClosetCloud?", a: "Asisten AI stylist yang membantumu tampil maksimal dari baju yang sudah dimiliki — bukan aplikasi belanja. Fokusnya optimasi lemari, bukan konsumsi baru." },
  { q: "Bagaimana AI Wardrobe Scan bekerja?", a: "Foto bajumu, AI mendeteksi jenis, warna, motif, bahan, dan kategori otomatis, lalu menyimpannya di lemari digital privat kamu." },
  { q: "Apa data lemari saya aman?", a: "Ya. Setiap lemari bersifat privat — hanya kamu yang bisa mengaksesnya. Di versi produksi, ini dijamin Row Level Security di database." },
  { q: "Bagaimana cost-per-wear dihitung?", a: "Harga beli item dibagi jumlah pemakaian. Makin sering dipakai, makin murah nilai per pemakaiannya — mengubah rasa bersalah jadi angka konkret." },
  { q: "Apa itu Fashion Swap Network?", a: "Jaringan pinjam/tukar baju antar pengguna dengan rating dua arah dan deposit digital sebagai jaminan keamanan transaksi." },
  { q: "Kenapa swap butuh foto verifikasi?", a: "Foto asli dari kamera in-app memastikan keaslian item dan membangun kepercayaan antar pengguna. Listing terverifikasi dapat badge khusus." },
  { q: "Bagaimana skor Style Rank dihitung?", a: "Gabungan jumlah item, nilai koleksi, bobot brand, kelangkaan, dan skor stylish dari AI. Skor stylish (40%) paling berpengaruh." },
  { q: "Apakah saya wajib ikut leaderboard?", a: "Tidak. Leaderboard bersifat opt-in. Skormu tetap dihitung meski kamu memilih privat, dan hanya nama/kota/tier/skor yang publik." },
  { q: "Apa beda Free dan ClosetCloud+?", a: "Free membatasi scan (30 item), outfit generate (3×/hari), dan chat Ajax (10 pesan/hari). ClosetCloud+ membuka semuanya tanpa batas seharga Rp 30.000/bulan." },
  { q: "Bagaimana cara membatalkan langganan?", a: "Lewat menu Subscription Management di Profil. Langganan aktif sampai akhir periode berjalan, tanpa penalti." },
];
