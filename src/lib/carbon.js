/* ============ CARBON ESTIMATES ============
 * Rough CO2e figures used by the Style Insight dashboard. Estimates, not
 * scientific claims — surfaced to the user as such. */
export const CARBON_PER_SWAP = 8;      // kg CO2e — per completed swap (menghindari produksi baju baru)
export const CARBON_PER_REWEAR = 0.4;  // kg CO2e — per pemakaian ulang alih-alih beli baru

/* Save/sell/donate advice for an under-used item, with a supportive tone. */
export function recommendationFor(item) {
  if (item.wearCount === 0) return { label: "Belum pernah dipakai", advice: "Coba masukkan ke Outfit Generator minggu ini, atau tawarkan lewat Swap Network.", tone: "coral" };
  if (item.wearCount <= 2) return { label: "Jarang dipakai", advice: "Pertimbangkan swap atau jual kalau sudah tidak sesuai gaya kamu.", tone: "coral" };
  return { label: "Item andalan", advice: "Sering dipakai dan sudah 'balik modal' — pertahankan!", tone: "sage" };
}
