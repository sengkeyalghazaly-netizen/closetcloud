/* ============ REAL PHOTOS ============
 * Foto garmen & orang asli (Unsplash, boleh hotlink) untuk contoh listing swap/
 * thrift/komunitas dan kartu tren — supaya "tergambarkan", bukan ikon. Semua
 * dipakai lewat <GarmentPhoto>/<PersonPhoto> yang punya fallback SVG bila gagal. */

const U = (id) => `https://images.unsplash.com/photo-${id}?w=500&q=75&auto=format&fit=crop`;

export const GARMENT_PHOTOS = {
  Atasan: ["1521572163474-6864f9cf17ab", "1596755094514-f87e34085b2c", "1618354691373-d851c5c3a990", "1620799140408-edc6dcb6d633"].map(U),
  Bawahan: ["1542272604-787c3835535d", "1584370848010-d7fe6bc767ec", "1594633312681-425c7b97ccd1", "1541099649105-f69ad21f3246"].map(U),
  Sepatu: ["1542291026-7eec264c27ff", "1600185365483-26d7a4cc7519", "1608231387042-66d1773070a5", "1595950653106-6c9ebd614d3a"].map(U),
  Outerwear: ["1551028719-00167b16eac5", "1591047139829-d91aecb6caea", "1544022613-e87ca75a784a"].map(U),
  Aksesori: ["1584917865442-de89df76afd3", "1553062407-98eeb64c6a62", "1546938576-6e6a64f317cc", "1523206489230-c012c64b2b48"].map(U),
};

const P = (id) => `https://images.unsplash.com/photo-${id}?w=500&q=75&auto=format&fit=crop&crop=faces`;
export const PEOPLE_PHOTOS = ["1483985988355-763728e1935b", "1490481651871-ab68de25d43d", "1519085360753-af0119f7cbe7", "1524504388940-b1c1722653e1", "1503342217505-b0a15ec3261c", "1492447166138-50c3889fccb1"].map(P);

function hash(key) {
  let h = 0; const s = String(key || "");
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

export function garmentPhoto(category, key) {
  const arr = GARMENT_PHOTOS[category] || GARMENT_PHOTOS.Atasan;
  return arr[hash(key || category) % arr.length];
}
export function personPhoto(key) {
  return PEOPLE_PHOTOS[hash(key) % PEOPLE_PHOTOS.length];
}
