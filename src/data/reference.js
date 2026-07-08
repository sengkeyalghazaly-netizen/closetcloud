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

/* --- Tipografi & aksen per style: bikin bagian Outfit terasa "sesuai gaya" --- */
const SERIF = "'Playfair Display', Georgia, serif";
const MONO = "'Space Mono', 'Courier New', monospace";
const DISPLAY = "'Clash Display', sans-serif";
const BODY = "'Plus Jakarta Sans', sans-serif";
export const STYLE_THEME = {
  Streetwear: { font: DISPLAY, accent: "#4C6EA0", upper: true, tracking: "0.03em" },
  Minimalist: { font: BODY, accent: "#8A8FA8", tracking: "0.01em" },
  "Old Money": { font: SERIF, accent: "#B78A3F" },
  Y2K: { font: DISPLAY, accent: "#D9488F" },
  "Vintage/Retro": { font: SERIF, accent: "#B5533C" },
  "Smart Casual": { font: BODY, accent: "#5B7A9D" },
  Techwear: { font: MONO, accent: "#3A3A40", upper: true, tracking: "0.05em" },
  "Dark Academia": { font: SERIF, accent: "#6B4A32", italic: true },
  "Korean Style": { font: BODY, accent: "#D98BA6" },
  Athleisure: { font: DISPLAY, accent: "#5FA88F", upper: true },
  Bohemian: { font: SERIF, accent: "#B98A4B", italic: true },
  "Batik/Tradisional": { font: SERIF, accent: "#8B5E3C" },
};

/* --- Atribut scan per kategori (opsi berbeda tiap jenis, bukan default sama) --- */
export const CATEGORY_FIELDS = {
  Atasan: [
    { key: "style", label: "Gaya", options: STYLE_TAGS },
    { key: "material", label: "Bahan", options: ["Katun", "Linen", "Rayon", "Polyester", "Rajut", "Denim"] },
    { key: "pattern", label: "Motif", options: PATTERNS },
    { key: "sleeve", label: "Lengan", options: ["Lengan pendek", "Lengan panjang", "Tanpa lengan"] },
  ],
  Bawahan: [
    { key: "style", label: "Gaya", options: STYLE_TAGS },
    { key: "material", label: "Bahan", options: ["Denim", "Katun", "Chino", "Linen", "Polyester", "Kulit sintetis"] },
    { key: "fit", label: "Potongan", options: ["Slim", "Regular", "Loose", "Wide-leg"] },
    { key: "length", label: "Panjang", options: ["Pendek", "Selutut", "Panjang"] },
  ],
  Outerwear: [
    { key: "style", label: "Gaya", options: STYLE_TAGS },
    { key: "type", label: "Jenis", options: ["Jaket", "Blazer", "Cardigan", "Hoodie", "Coat"] },
    { key: "material", label: "Bahan", options: ["Denim", "Kulit sintetis", "Wol", "Fleece", "Parasut"] },
    { key: "pattern", label: "Motif", options: PATTERNS },
  ],
  Sepatu: [
    { key: "style", label: "Gaya", options: STYLE_TAGS },
    { key: "type", label: "Jenis", options: ["Sneakers", "Formal", "Boots", "Sandal", "Flat", "Heels"] },
    { key: "material", label: "Bahan", options: ["Kanvas", "Kulit", "Suede", "Mesh", "Karet"] },
  ],
  Aksesori: [
    { key: "type", label: "Jenis", options: ["Tas", "Topi", "Ikat pinggang", "Kacamata", "Jam", "Syal", "Kalung"] },
    { key: "style", label: "Gaya", options: STYLE_TAGS },
    { key: "material", label: "Bahan", options: ["Kulit", "Kanvas", "Logam", "Kain", "Plastik"] },
  ],
};
