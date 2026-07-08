/* Proporsi tubuh avatar (satuan meter, origin di lantai, kepala ~1.68).
 * Dipakai bersama BaseBody & garment meshes agar pakaian pas menempel. */
export const B = {
  headR: 0.135, headY: 1.6,
  neckR: 0.05, neckY: 1.46, neckH: 0.1,
  shoulderY: 1.36, shoulderX: 0.2,
  torsoR: 0.185, torsoY: 1.12, torsoLen: 0.34, // capsule: span ~0.76..1.48
  hipY: 0.9, hipR: 0.175,
  armX: 0.25, armY: 1.1, armR: 0.055, armLen: 0.46,
  handY: 0.84,
  legX: 0.093, legY: 0.48, legR: 0.084, legLen: 0.74,
  footY: 0.05, footZ: 0.05,
};
