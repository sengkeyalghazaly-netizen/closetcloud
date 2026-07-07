/* ============ STYLE SCORE ============
 * Prototype scoring model for Style Rank. Deterministic, pure function of the
 * wardrobe. Brand/rarity are proxied from price & colour rarity here; the
 * production version reads real `brand`/`rarity` columns (see roadmap) — the
 * weights below map directly onto those. */
export function computeStyleScore(items) {
  const n = items.length;
  const itemScore = Math.min(n, 300) / 300 * 100;
  const totalValue = items.reduce((s, i) => s + i.price, 0);
  const valueScore = n === 0 ? 0 : Math.min(100, Math.log10(1 + totalValue) / Math.log10(1e9) * 100);

  const brandOf = (i) => i.price >= 500000 ? 4 : i.price >= 250000 ? 3 : i.price >= 100000 ? 2 : 1;
  const rarityOf = (i) => { const rare = ["Lavender", "Merah Bata", "Denim"].includes(i.color.name); return rare ? 3 : 1; };
  const brandScore = n === 0 ? 0 : (items.reduce((s, i) => s + brandOf(i), 0) / n - 1) / 3 * 100;
  const rarityScore = n === 0 ? 0 : (items.reduce((s, i) => s + rarityOf(i), 0) / n - 1) / 4 * 100;

  // stylish: keberagaman kategori & warna + rasio item aktif dipakai
  const cats = new Set(items.map((i) => i.category)).size;
  const colors = new Set(items.map((i) => i.color.name)).size;
  const activeRatio = n === 0 ? 0 : items.filter((i) => i.wearCount > 0).length / n;
  const stylishScore = n === 0 ? 0 : Math.min(100, (cats / 5) * 35 + (Math.min(colors, 8) / 8) * 30 + activeRatio * 35);

  const overall = 0.15 * itemScore + 0.15 * valueScore + 0.15 * brandScore + 0.15 * rarityScore + 0.40 * stylishScore;
  const tier = overall >= 85 ? 1 : overall >= 70 ? 2 : overall >= 50 ? 3 : overall >= 30 ? 4 : 5;
  return { itemScore, valueScore, brandScore, rarityScore, stylishScore, overall, tier, itemCount: n };
}
