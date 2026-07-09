import { Camera, Sparkles, MessageCircle, Shirt, Repeat, BarChart3 } from "lucide-react";

/* ============ FREEMIUM / PREMIUM CONFIG ============
 * Free-tier daily limits and the premium offer. In production these limits
 * are enforced server-side (usage_counters + Edge Function); here they gate
 * the client for demo purposes. Tweak pricing/limits in one place. */

export const FREE_LIMITS = { ai_chat: 10, outfit_generate: 3, wardrobe_scan: 30, swap_listing: 2 };
export const PREMIUM_PRICE = 30000;

export const PREMIUM_BENEFITS = [
  { icon: Camera, title: "Scan tanpa batas", desc: "Free dibatasi 30 item" },
  { icon: Sparkles, title: "Outfit Generate unlimited", desc: "Free 3×/hari" },
  { icon: MessageCircle, title: "Chat Ajax unlimited + prioritas", desc: "Free 10 pesan/hari" },
  { icon: Shirt, title: "Semua style Mood×Tempat×Style", desc: "Free 3 style dasar" },
  { icon: Repeat, title: "10 listing swap aktif + boost", desc: "Free 2 listing" },
  { icon: BarChart3, title: "Insight lengkap + ekspor data", desc: "Free versi ringkas" },
];
