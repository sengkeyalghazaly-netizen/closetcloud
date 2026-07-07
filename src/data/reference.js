import { Sun, Cloud, CloudRain } from "lucide-react";

/* ============ REFERENCE DATA ============
 * Static domain vocabulary. When wiring a real backend these become
 * lookup tables / enums; screens import from here so nothing is hardcoded twice. */

export const CATEGORIES = ["Atasan", "Bawahan", "Outerwear", "Sepatu", "Aksesori"];
export const STYLE_TAGS = ["Kasual", "Formal", "Olahraga", "Pesta"];

export const COLORS_POOL = [
  { name: "Putih", hex: "#F4F4F4" }, { name: "Hitam", hex: "#232323" },
  { name: "Navy", hex: "#22304A" }, { name: "Mint", hex: "#8FD9C4" },
  { name: "Krem", hex: "#E7DCC8" }, { name: "Denim", hex: "#5B7A9D" },
  { name: "Cokelat", hex: "#8B5E3C" }, { name: "Lavender", hex: "#B9A7DA" },
  { name: "Merah Bata", hex: "#B5533C" }, { name: "Abu-abu", hex: "#9A9A9A" },
];

export const MATERIALS = ["Katun", "Denim", "Linen", "Polyester", "Wol", "Kulit sintetis", "Rayon"];
export const PATTERNS = ["Polos", "Garis", "Kotak-kotak", "Motif bunga", "Print grafis"];

export const WEATHER_OPTIONS = [
  { key: "panas", label: "Panas & cerah", icon: Sun, temp: "31°C" },
  { key: "sejuk", label: "Sejuk berawan", icon: Cloud, temp: "26°C" },
  { key: "hujan", label: "Hujan", icon: CloudRain, temp: "24°C" },
];

export const AGENDA_OPTIONS = ["Kuliah / kerja santai", "Meeting formal", "Olahraga", "Hangout / nongkrong", "Acara / pesta"];
export const AGENDA_TO_STYLE = {
  "Kuliah / kerja santai": "Kasual",
  "Meeting formal": "Formal",
  "Olahraga": "Olahraga",
  "Hangout / nongkrong": "Kasual",
  "Acara / pesta": "Pesta",
};

export const QUIZ_QUESTIONS = [
  { q: "Gaya harian kamu lebih ke arah mana?", opts: ["Kasual & santai", "Formal & rapi", "Streetwear & berani", "Simpel & minimalis"] },
  { q: "Warna yang paling sering kamu pakai?", opts: ["Netral (hitam/putih/abu)", "Earth tone (cokelat/krem)", "Warna cerah & berani", "Pastel lembut"] },
  { q: "Aktivitas hari-harimu paling banyak apa?", opts: ["Kuliah / WFH", "Kerja kantoran", "Olahraga aktif", "Sosialisasi / hangout"] },
  { q: "Berapa kira-kira budget fashion kamu per bulan?", opts: ["< Rp 300rb", "Rp 300rb–700rb", "Rp 700rb–1,5jt", "> Rp 1,5jt"] },
];

/* --- Outfit Generator v2: Mood × Tempat × Style. `dot` = warna representasi
 * mood (dipakai jadi indikator kecil, bukan emoji). --- */
export const MOODS = [
  { key: "Percaya Diri", dot: "#B5533C", colors: ["Merah Bata", "Hitam", "Navy"] },
  { key: "Santai", dot: "#E7DCC8", colors: ["Putih", "Krem", "Abu-abu"] },
  { key: "Profesional", dot: "#22304A", colors: ["Navy", "Hitam", "Putih"] },
  { key: "Playful", dot: "#7FD8BE", colors: ["Mint", "Lavender"] },
  { key: "Romantis", dot: "#C9B8E8", colors: ["Lavender", "Krem", "Putih"] },
  { key: "Edgy", dot: "#232323", colors: ["Hitam", "Abu-abu"] },
  { key: "Cozy", dot: "#8B5E3C", colors: ["Krem", "Cokelat", "Abu-abu"] },
];
export const PLACES = [
  { key: "Kampus", style: "Kasual" }, { key: "Kantor", style: "Formal" },
  { key: "Interview", style: "Formal" }, { key: "Date", style: "Kasual" },
  { key: "Kondangan", style: "Pesta" }, { key: "Ibadah", style: "Formal" },
  { key: "Gym", style: "Olahraga" }, { key: "Hangout/Café", style: "Kasual" },
  { key: "Pantai", style: "Kasual" }, { key: "Konser", style: "Pesta" },
  { key: "Travel", style: "Kasual" }, { key: "Acara Formal", style: "Formal" },
];
export const GLOBAL_STYLES = ["Semua", "Streetwear", "Minimalist", "Old Money", "Y2K", "Vintage/Retro", "Smart Casual", "Techwear", "Dark Academia", "Korean Style", "Athleisure", "Bohemian", "Batik/Tradisional"];
