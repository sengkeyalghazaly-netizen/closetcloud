import { AGENDA_TO_STYLE, WEATHER_OPTIONS, MOODS, PLACES } from "../data/reference";

/* Derivasi style_tags otomatis dari atribut item — berlaku untuk item lama & baru
 * tanpa migrasi. Pure function of an item; easy to unit-test or move server-side. */
export function deriveStyleTags(item) {
  const tags = [];
  const c = item.color.name, m = item.material, p = item.pattern, s = item.style;
  if (p === "Polos" && ["Putih", "Hitam", "Abu-abu", "Krem", "Navy"].includes(c)) tags.push("Minimalist");
  if (s === "Kasual" && (p === "Print grafis" || ["Sepatu", "Outerwear"].includes(item.category))) tags.push("Streetwear");
  if (["Linen", "Wol"].includes(m) && ["Krem", "Navy", "Putih", "Cokelat"].includes(c)) tags.push("Old Money");
  if (["Mint", "Lavender", "Merah Bata"].includes(c) && s !== "Formal") tags.push("Y2K");
  if (m === "Denim" || p === "Kotak-kotak") tags.push("Vintage/Retro");
  if (s === "Formal" || (s === "Kasual" && p === "Polos")) tags.push("Smart Casual");
  if (["Hitam", "Abu-abu"].includes(c) && m === "Polyester") tags.push("Techwear");
  if (["Cokelat", "Navy", "Hitam"].includes(c) && ["Wol", "Linen"].includes(m)) tags.push("Dark Academia");
  if (["Krem", "Putih"].includes(c) && s === "Kasual") tags.push("Korean Style");
  if (s === "Olahraga") tags.push("Athleisure");
  if (p === "Motif bunga" && ["Rayon", "Linen", "Katun"].includes(m)) tags.push("Bohemian");
  if (p === "Motif bunga" || (item.name || "").toLowerCase().includes("batik")) tags.push("Batik/Tradisional");
  if (tags.length === 0) tags.push("Smart Casual");
  return tags;
}

/* Outfit Generator v2: kombinasi Mood × Tempat × Style × Warna. */
export function generateOutfitsV2(items, weatherKey, place, mood, styleGlobal, colorPref) {
  const baseStyle = PLACES.find((pl) => pl.key === place)?.style || "Kasual";
  const moodDef = MOODS.find((mo) => mo.key === mood) || MOODS[0];

  const pick = (cat) => {
    let list = items.filter((i) => i.category === cat);
    if (list.length === 0) return { list: [], tagMatched: true };
    const byBase = list.filter((i) => i.style === baseStyle);
    if (byBase.length) list = byBase;
    let tagMatched = true;
    if (styleGlobal !== "Semua") {
      const byTag = list.filter((i) => deriveStyleTags(i).includes(styleGlobal));
      if (byTag.length) list = byTag; else tagMatched = false;
    }
    // skor: warna pilihan user diutamakan, lalu warna khas mood
    const score = (i) => (colorPref && i.color.name === colorPref ? 3 : 0) + (moodDef.colors.includes(i.color.name) ? 1 : 0);
    list = [...list].sort((a, b) => score(b) - score(a));
    return { list, tagMatched };
  };

  const tops = pick("Atasan"), bottoms = pick("Bawahan"), shoes = pick("Sepatu");
  const outerwear = items.filter((i) => i.category === "Outerwear");
  const accessory = items.filter((i) => i.category === "Aksesori");
  if (tops.list.length === 0 || bottoms.list.length === 0) return { combos: [], partial: false };

  const partial = styleGlobal !== "Semua" && !(tops.tagMatched && bottoms.tagMatched);
  const temp = WEATHER_OPTIONS.find((w) => w.key === weatherKey).temp;
  const combos = [];
  const n = Math.min(3, tops.list.length * bottoms.list.length);
  for (let i = 0; i < n; i++) {
    const top = tops.list[i % tops.list.length];
    const bottom = bottoms.list[(i + 1) % bottoms.list.length];
    const shoe = shoes.list.length ? shoes.list[i % shoes.list.length] : null;
    const outer = weatherKey !== "panas" && outerwear.length > 0 ? outerwear[i % outerwear.length] : null;
    const acc = accessory.length ? accessory[i % accessory.length] : null;
    combos.push({
      id: `v2-${i}`, top, bottom, shoe, outer, acc,
      reason: `Vibe ${mood.toLowerCase()} untuk ${place}${styleGlobal !== "Semua" ? ` · ${styleGlobal}` : ""}${colorPref ? ` · aksen ${colorPref.toLowerCase()}` : ""} — ${top.color.name.toLowerCase()} × ${bottom.color.name.toLowerCase()}, pas di cuaca ${temp}.`,
    });
  }
  return { combos, partial };
}

/* Outfit Generator v1: berbasis agenda — dipakai Scheduler & Onboarding reward. */
export function generateOutfits(items, weatherKey, agenda) {
  const style = AGENDA_TO_STYLE[agenda];
  const pool = (cat) => {
    let list = items.filter((i) => i.category === cat);
    const styled = list.filter((i) => i.style === style);
    return styled.length ? styled : list;
  };
  const tops = pool("Atasan"), bottoms = pool("Bawahan"), shoes = pool("Sepatu");
  const outerwear = items.filter((i) => i.category === "Outerwear");
  const accessory = items.filter((i) => i.category === "Aksesori");

  if (tops.length === 0 || bottoms.length === 0) return [];

  const combos = [];
  for (let i = 0; i < Math.min(3, tops.length * bottoms.length); i++) {
    const top = tops[i % tops.length];
    const bottom = bottoms[(i + 1) % bottoms.length];
    const shoe = shoes.length ? shoes[i % shoes.length] : null;
    const useOuter = weatherKey !== "panas" && outerwear.length > 0;
    const outer = useOuter ? outerwear[i % outerwear.length] : null;
    const acc = accessory.length ? accessory[i % accessory.length] : null;
    combos.push({
      id: `combo-${i}`, top, bottom, shoe, outer, acc,
      reason: `Cocok untuk agenda "${agenda}" di cuaca ${WEATHER_OPTIONS.find(w => w.key === weatherKey).label.toLowerCase()} — kombinasi warna ${top.color.name.toLowerCase()} & ${bottom.color.name.toLowerCase()} serasi.`,
    });
  }
  return combos;
}
