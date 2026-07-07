import { STYLE_KEYS } from "../components/illustrations";

/* ============ STYLE QUIZ CONFIG ============
 * Drives the onboarding quiz. Kept declarative so questions can be added,
 * reordered, or A/B-tested without touching the quiz UI. */

export const GENDERS = [
  { key: "wanita", label: "Wanita" },
  { key: "pria", label: "Pria" },
  { key: "nonbiner", label: "Non-biner" },
  { key: "rahasia", label: "Rahasia aja" },
];

export const AGE_RANGES = ["13–17", "18–22", "23–27", "28–34", "35+"];

export const ACTIVITIES = [
  { key: "kuliah", label: "Kuliah / WFH" },
  { key: "kantor", label: "Kerja kantoran" },
  { key: "kreator", label: "Content creator" },
  { key: "aktif", label: "Olahraga / aktif" },
  { key: "sosial", label: "Sering hangout" },
  { key: "acara", label: "Sering ke acara" },
];

/* Lebih banyak opsi harga (Rp) */
export const BUDGETS = [
  "< Rp 150rb", "Rp 150–300rb", "Rp 300–500rb",
  "Rp 500rb–1jt", "Rp 1–2jt", "> Rp 2jt",
];

export const STYLE_OPTIONS = STYLE_KEYS; // dari illustrations (punya thumbnail)

/* Palet warna besar untuk dipilih (multi-select) — bukan sekadar teks */
export const PALETTE = [
  { name: "Hitam", hex: "#1E1E22" }, { name: "Putih", hex: "#F4F4F6" },
  { name: "Abu", hex: "#9A9DAA" }, { name: "Navy", hex: "#22304A" },
  { name: "Denim", hex: "#5B7A9D" }, { name: "Biru langit", hex: "#8FB8DE" },
  { name: "Mint", hex: "#7FD8BE" }, { name: "Sage", hex: "#5FA88F" },
  { name: "Hijau botol", hex: "#2F5D50" }, { name: "Lavender", hex: "#C9B8E8" },
  { name: "Ungu", hex: "#8B6FCE" }, { name: "Plum", hex: "#6C3A5C" },
  { name: "Pink", hex: "#F3B6C7" }, { name: "Fuchsia", hex: "#D9488F" },
  { name: "Merah bata", hex: "#B5533C" }, { name: "Merah", hex: "#D23F34" },
  { name: "Coral", hex: "#E8917A" }, { name: "Oranye", hex: "#E8873A" },
  { name: "Mustard", hex: "#D9A441" }, { name: "Kuning", hex: "#F2CE5B" },
  { name: "Krem", hex: "#E7DCC8" }, { name: "Beige", hex: "#CBB79B" },
  { name: "Cokelat", hex: "#8B5E3C" }, { name: "Choco", hex: "#5A3A28" },
];

export const STYLE_BLURB = {
  Kasual: "Nyaman, effortless, gampang dipadupadan.",
  Streetwear: "Berani, urban, statement.",
  Minimalist: "Bersih, netral, less is more.",
  "Old Money": "Klasik, rapi, timeless.",
  Y2K: "Playful, retro 2000-an, colorful.",
  "Korean Style": "Soft, layering, clean-cut.",
  Formal: "Tegas, profesional, tailored.",
  Sporty: "Aktif, athleisure, dynamic.",
  Edgy: "Monokrom, tegas, cool.",
  Bohemian: "Earthy, flowy, free-spirit.",
};
