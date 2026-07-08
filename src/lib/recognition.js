import { COLORS_POOL, STYLE_TAGS, CATEGORY_FIELDS } from "../data/reference";
import { randomFrom } from "./utils";

/* Simulasi hasil AI recognition — atribut yang dideteksi berbeda tiap kategori
 * (mengikuti CATEGORY_FIELDS). In production this is a real vision model call;
 * bentuk hasilnya tetap sama sehingga UI tidak berubah. */
export function simulateAIRecognition(category) {
  const fields = CATEGORY_FIELDS[category] || CATEGORY_FIELDS.Atasan;
  const detected = { color: randomFrom(COLORS_POOL) };
  fields.forEach((f) => { detected[f.key] = randomFrom(f.options); });
  // pastikan atribut inti yang dipakai logika outfit selalu ada
  if (!detected.style) detected.style = randomFrom(STYLE_TAGS);
  if (!detected.material) detected.material = "Katun";
  if (!detected.pattern) detected.pattern = "Polos";
  return detected;
}
