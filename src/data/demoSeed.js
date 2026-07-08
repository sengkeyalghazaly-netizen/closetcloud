import { seedOnce } from "../store/persist";
import { garmentPhoto } from "./photos";
import { MOCK_SWAP_ITEMS } from "./mock";
import { THRIFT_LISTINGS } from "./thrift";
import { toKey } from "../lib/utils";

/* ============ DEMO SEED ============
 * Mengisi aplikasi dengan data realistis satu kali di first-run supaya semua
 * fitur langsung tergambarkan (tidak kosong). Isi lemari memakai FOTO ASLI dari
 * internet (Unsplash) — bukan ikon. Kalau user "Keluar", state jadi bersih &
 * masuk onboarding (seed tidak diulang). */

const DAY = 86400000;
const now = Date.now();
const daysAgo = (d) => new Date(now - d * DAY).toISOString();
const inDays = (d) => toKey(new Date(now + d * DAY));

/* item demo: image = foto asli sesuai kategori; wearHistory = daftar "hari lalu" */
function item(id, name, category, style, cn, ch, price, material, worn, extra = {}) {
  return {
    id, name, category, style,
    color: { name: cn, hex: ch }, material, pattern: "Polos",
    price, image: garmentPhoto(category, id),
    wearCount: worn.length,
    lastWorn: worn.length ? daysAgo(Math.min(...worn)) : null,
    wearHistory: worn.map(daysAgo),
    ...extra,
  };
}

const ITEMS = [
  item("d-1", "Kaos Putih Basic", "Atasan", "Kasual", "Putih", "#F4F4F4", 120000, "Katun", [0, 1, 3, 4, 6, 8, 10, 12]),
  item("d-2", "Kemeja Linen Sage", "Atasan", "Kasual", "Sage", "#5FA88F", 210000, "Linen", [2, 5, 9], { isSwappable: true, photoVerified: true }),
  item("d-3", "Blouse Satin Hitam", "Atasan", "Formal", "Hitam", "#232323", 260000, "Rayon", [11], { flag: "donate" }),
  item("d-4", "Chino Krem", "Bawahan", "Kasual", "Krem", "#E7DCC8", 245000, "Chino", [0, 2, 4, 6, 7, 9]),
  item("d-5", "Jeans Denim Biru", "Bawahan", "Kasual", "Denim", "#5B7A9D", 320000, "Denim", [1, 3, 5, 8, 11]),
  item("d-6", "Rok Plisket Navy", "Bawahan", "Formal", "Navy", "#22304A", 190000, "Polyester", [], { saleActive: true, salePrice: 90000, saleCondition: "Sangat baik", flag: "sell" }),
  item("d-7", "Sneakers Putih Klasik", "Sepatu", "Kasual", "Putih", "#F4F4F4", 480000, "Kanvas", [0, 1, 2, 4, 6, 8, 10]),
  item("d-8", "Loafers Cokelat", "Sepatu", "Formal", "Cokelat", "#8B5E3C", 550000, "Kulit", [5, 10]),
  item("d-9", "Blazer Wol Krem", "Outerwear", "Formal", "Krem", "#E7DCC8", 620000, "Wol", [7], { isSwappable: true, photoVerified: true }),
  item("d-10", "Jaket Denim Vintage", "Outerwear", "Kasual", "Denim", "#5B7A9D", 400000, "Denim", [2, 6, 9, 12]),
  item("d-11", "Tote Bag Kanvas Krem", "Aksesori", "Kasual", "Krem", "#CBB79B", 150000, "Kanvas", [1, 4, 8]),
  item("d-12", "Topi Baseball Hitam", "Aksesori", "Kasual", "Hitam", "#232323", 120000, "Katun", [3, 7]),
];

const SETTINGS = { notifOutfit: true, notifSwap: true, notifEvent: true, appearance: "light", allowSwap: true, pubWardrobe: true, pubCity: true, pubStats: true };

export function seedDemo() {
  seedOnce({
    onboarded: true,
    profile: {
      name: "Kirana", email: "kirana@closetcloud.id", provider: "email",
      gender: "Wanita", age: "23–27",
      styles: ["Minimalist", "Korean Style", "Smart Casual"],
      colors: [{ name: "Putih", hex: "#F4F4F6" }, { name: "Krem", hex: "#E7DCC8" }, { name: "Navy", hex: "#22304A" }, { name: "Sage", hex: "#5FA88F" }],
      budget: "Rp 300–500rb",
    },
    items: ITEMS,
    schedule: [
      { date: inDays(2), itemIds: ["d-4", "d-1", "d-7"], label: "Kuliah / kerja santai", special: false, reminder: false },
      { date: inDays(5), itemIds: ["d-9", "d-6", "d-8"], label: "Interview kerja", special: true, reminder: true },
    ],
    swapRequests: [
      { id: "req-demo-1", item: MOCK_SWAP_ITEMS[1], status: "selesai", myRating: 5, myComment: "Mulus, sesuai foto!", theirRating: "4.8", requestedAt: daysAgo(6) },
      { id: "req-demo-2", item: MOCK_SWAP_ITEMS[0], status: "disetujui", requestedAt: daysAgo(1) },
    ],
    deposit: 150000,
    thriftOrders: [
      { id: "to-demo-1", listing: THRIFT_LISTINGS[2], status: "disepakati", location: "Manado", at: daysAgo(3) },
    ],
    chat: [
      { role: "user", content: "Outfit buat kuliah besok?" },
      { role: "assistant", content: "Coba kaos putih + chino krem + sneakers putih — clean, effortless, dan pas buat kampus. Mau versi lebih formal? Sebut aja!", action_cards: [{ type: "outfit", item_ids: ["d-1", "d-4", "d-7"], title: "Padu-padan kampus", reason: "Putih × krem, netral & gampang dipakai." }] },
    ],
    likes: ["d-1+d-4+d-7|Santai|Semua"],
    follows: ["@bellaana", "@nadiaputri"],
    rankOptIn: true,
    plan: "free",
    usage: {},
    adUsage: {},
    settings: SETTINGS,
  });
}
