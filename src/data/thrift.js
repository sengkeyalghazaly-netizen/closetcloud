import { MOCK_USERS } from "./mock";

/* ============ THRIFT MARKETPLACE DATA ============
 * Preloved listings dari pengguna lain (mock) + kartu iklan B2B partner brand.
 * Harga jual disarankan otomatis dari harga beli asli. */

export const CONDITIONS = ["Seperti baru", "Sangat baik", "Baik", "Layak pakai"];

/* Saran harga jual preloved ≈ 45% harga beli, dibulatkan ribuan, min 15rb. */
export function suggestedPrice(purchasePrice) {
  return Math.max(15000, Math.round((purchasePrice || 50000) * 0.45 / 1000) * 1000);
}

export const THRIFT_LISTINGS = [
  { id: "th-1", name: "Cardigan Rajut Krem", category: "Atasan", size: "M", color: { name: "Krem", hex: "#E7DCC8" }, price: 95000, orig: 220000, condition: "Sangat baik", owner: MOCK_USERS[0] },
  { id: "th-2", name: "Celana Kargo Olive", category: "Bawahan", size: "31", color: { name: "Hijau botol", hex: "#4B5A3A" }, price: 120000, orig: 280000, condition: "Baik", owner: MOCK_USERS[3] },
  { id: "th-3", name: "Dr. Martens 1460", category: "Sepatu", size: "42", color: { name: "Hitam", hex: "#232323" }, price: 650000, orig: 1900000, condition: "Sangat baik", owner: MOCK_USERS[1] },
  { id: "th-4", name: "Blouse Satin Sage", category: "Atasan", size: "S", color: { name: "Sage", hex: "#5FA88F" }, price: 75000, orig: 180000, condition: "Seperti baru", owner: MOCK_USERS[2] },
  { id: "th-5", name: "Jeans Mom-fit Vintage", category: "Bawahan", size: "29", color: { name: "Denim", hex: "#5B7A9D" }, price: 130000, orig: 300000, condition: "Baik", owner: MOCK_USERS[4] },
  { id: "th-6", name: "Kemeja Flanel Kotak", category: "Atasan", size: "L", color: { name: "Merah Bata", hex: "#B5533C" }, price: 85000, orig: 210000, condition: "Layak pakai", owner: MOCK_USERS[0] },
];

/* Partner B2B — kartu sponsored yang muncul selang-seling di feed & saran Kai.
 * Ditandai jelas "Sponsored" supaya tidak menyaru sebagai listing pengguna. */
export const B2B_ADS = [
  { brand: "UNIQLO", accent: "#E60012", tagline: "LifeWear · basic berkualitas", item: "Kaos AIRism Cotton Oversized", price: 199000, category: "Atasan", url: "https://www.uniqlo.com/id" },
  { brand: "ZARA", accent: "#111111", tagline: "New in · tailored", item: "Blazer Structured Wool-blend", price: 899000, category: "Outerwear", url: "https://www.zara.com/id" },
  { brand: "H&M", accent: "#E50010", tagline: "Conscious · denim", item: "Regular Jeans Mid Blue", price: 499000, category: "Bawahan", url: "https://www2.hm.com/id_id" },
  { brand: "Erigo", accent: "#1B1F3B", tagline: "Local pride · everyday", item: "Sneakers Canvas Low", price: 289000, category: "Sepatu", url: "https://erigostore.co.id" },
];

export function adForCategory(cat) {
  return B2B_ADS.find((a) => a.category === cat) || B2B_ADS[0];
}
