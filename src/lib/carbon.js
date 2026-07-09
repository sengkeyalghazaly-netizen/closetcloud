/* ============ CARBON ESTIMATES ============
 * Rough CO2e figures used by the Style Insight dashboard. Estimates, not
 * scientific claims — surfaced to the user as such. */
export const CARBON_PER_SWAP = 8;      // kg CO2e — per completed swap (menghindari produksi baju baru)
export const CARBON_PER_REWEAR = 0.4;  // kg CO2e — per pemakaian ulang alih-alih beli baru

/* Padankan angka CO2e ke sesuatu yang gampang dibayangkan orang awam. */
export function carbonEquivalent(kg) {
  if (!kg || kg <= 0) return "Mulai pakai ulang & swap untuk menekan jejak karbonmu.";
  const km = Math.round(kg / 0.12);       // ~0.12 kg CO2e per km motor
  const trees = (kg / 21).toFixed(1);     // ~21 kg CO2e diserap 1 pohon/tahun
  return `Setara ~${km.toLocaleString("id-ID")} km naik motor, atau serapan ${trees} pohon setahun.`;
}

/* Level dampak yang fun — bikin pencapaian terasa nyata & memotivasi. */
export function impactLevel(kg) {
  if (kg >= 120) return { label: "Eco Legend", tone: "sage" };
  if (kg >= 60) return { label: "Eco Hero", tone: "sage" };
  if (kg >= 20) return { label: "Eco Starter", tone: "mint" };
  return { label: "Baru Mulai", tone: "lavender" };
}

/* Save/sell/donate advice for an under-used item, with a supportive tone. */
export function recommendationFor(item) {
  if (item.wearCount === 0) return { label: "Belum pernah dipakai", advice: "Coba masukkan ke Outfit Generator minggu ini, atau tawarkan lewat Swap Network.", tone: "coral" };
  if (item.wearCount <= 2) return { label: "Jarang dipakai", advice: "Pertimbangkan swap atau jual kalau sudah tidak sesuai gaya kamu.", tone: "coral" };
  return { label: "Item andalan", advice: "Sering dipakai dan sudah 'balik modal' — pertahankan!", tone: "sage" };
}
