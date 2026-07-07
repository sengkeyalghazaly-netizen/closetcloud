import { MOCK_USERS } from "./mock";

/* ============ COMMUNITY ============
 * Pengguna lain (mock) beserta isi lemari yang bisa dilihat publik. Di produksi
 * ini datang dari tabel `profiles` + `wardrobe_items` (yang di-publish) via RLS. */

const g = (name, category, style, cn, ch) => ({ id: `${name}`, name, category, style, color: { name: cn, hex: ch } });

export const COMMUNITY_USERS = [
  {
    ...MOCK_USERS[0], handle: "@nadiaputri", bio: "Minimalist · earth tone lover · Manado",
    followers: 1284, following: 312, tier: 2, score: 76,
    wardrobe: [
      g("Blazer Krem", "Outerwear", "Formal", "Krem", "#E7DCC8"),
      g("Kaos Putih", "Atasan", "Kasual", "Putih", "#F4F4F4"),
      g("Rok Plisket Navy", "Bawahan", "Formal", "Navy", "#22304A"),
      g("Loafers Cokelat", "Sepatu", "Formal", "Cokelat", "#8B5E3C"),
      g("Kemeja Sage", "Atasan", "Kasual", "Sage", "#5FA88F"),
      g("Tote Bag Krem", "Aksesori", "Kasual", "Krem", "#CBB79B"),
    ],
  },
  {
    ...MOCK_USERS[1], handle: "@ranggaadi", bio: "Streetwear head · sneaker collector",
    followers: 3420, following: 190, tier: 1, score: 88,
    wardrobe: [
      g("Hoodie Hitam", "Atasan", "Kasual", "Hitam", "#232323"),
      g("Cargo Olive", "Bawahan", "Kasual", "Hijau botol", "#4B5A3A"),
      g("AF1 Putih", "Sepatu", "Kasual", "Putih", "#F4F4F4"),
      g("Jaket Denim", "Outerwear", "Kasual", "Denim", "#5B7A9D"),
      g("Kaos Grafis", "Atasan", "Kasual", "Merah Bata", "#B5533C"),
    ],
  },
  {
    ...MOCK_USERS[2], handle: "@bellaana", bio: "Soft girl aesthetic · pastel everything",
    followers: 5610, following: 420, tier: 1, score: 91,
    wardrobe: [
      g("Dress Lavender", "Atasan", "Pesta", "Lavender", "#C9B8E8"),
      g("Cardigan Pink", "Atasan", "Kasual", "Pink", "#F3B6C7"),
      g("Rok Midi Krem", "Bawahan", "Kasual", "Krem", "#E7DCC8"),
      g("Flat Shoes Putih", "Sepatu", "Kasual", "Putih", "#F4F4F4"),
      g("Blouse Mint", "Atasan", "Kasual", "Mint", "#8FD9C4"),
    ],
  },
  {
    ...MOCK_USERS[3], handle: "@yusufmln", bio: "Smart casual · kerja & kondangan ready",
    followers: 842, following: 260, tier: 3, score: 63,
    wardrobe: [
      g("Kemeja Navy", "Atasan", "Formal", "Navy", "#22304A"),
      g("Chino Krem", "Bawahan", "Formal", "Krem", "#E7DCC8"),
      g("Sepatu Kulit", "Sepatu", "Formal", "Cokelat", "#5A3A28"),
      g("Batik Cokelat", "Atasan", "Formal", "Cokelat", "#8B5E3C"),
    ],
  },
  {
    ...MOCK_USERS[4], handle: "@clarissaw", bio: "Old money vibes · quiet luxury",
    followers: 2190, following: 150, tier: 2, score: 71,
    wardrobe: [
      g("Blazer Wol Navy", "Outerwear", "Formal", "Navy", "#22304A"),
      g("Turtleneck Krem", "Atasan", "Kasual", "Krem", "#E7DCC8"),
      g("Celana Wol Abu", "Bawahan", "Formal", "Abu-abu", "#9A9DAA"),
      g("Loafers Hitam", "Sepatu", "Formal", "Hitam", "#232323"),
      g("Scarf Beige", "Aksesori", "Kasual", "Beige", "#CBB79B"),
    ],
  },
];

export function searchUsers(query) {
  const q = query.trim().toLowerCase();
  if (!q) return COMMUNITY_USERS;
  return COMMUNITY_USERS.filter((u) => u.name.toLowerCase().includes(q) || u.handle.toLowerCase().includes(q) || u.city.toLowerCase().includes(q));
}
