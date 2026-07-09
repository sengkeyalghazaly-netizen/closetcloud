/* ============ AJAX — AI CHAT STYLIST ============
 * Two-tier design so the same UI works in prototype and production:
 *   1. If VITE_KAI_ENDPOINT is set, POST the conversation to that proxy
 *      (a server-side Edge Function that holds the Claude API key and enforces
 *      quota). This is the production seam — no component change needed.
 *   2. Otherwise fall back to a wardrobe-aware rule engine so Ajax always
 *      answers, even on a static host with no backend. The engine parses intent
 *      (acara/cuaca/warna), builds REAL outfits from the user's items via
 *      generateOutfitsV2, and varies its phrasing — bukan sekadar template.
 *
 * A browser can never call api.anthropic.com directly (no key may ship to the
 * client, and CORS blocks it), so we deliberately do NOT attempt it — that
 * only produced a guaranteed-failed request. Configure a proxy instead. */

import { adForCategory } from "../data/thrift";
import { suggestedPrice } from "../data/thrift";
import { generateOutfitsV2 } from "./outfits";
import { COLORS_POOL } from "../data/reference";

const KAI_ENDPOINT = import.meta.env.VITE_KAI_ENDPOINT || "";
const KAI_MODEL = import.meta.env.VITE_KAI_MODEL || "claude-sonnet-4-5";

export function buildKaiSystemPrompt(items) {
  const wardrobe = items.map((i) => ({
    id: i.id, nama: i.name, kategori: i.category, gaya: i.style,
    warna: i.color.name, bahan: i.material, motif: i.pattern,
    harga: i.price, dipakai: i.wearCount,
    terakhir_dipakai: i.lastWorn ? i.lastWorn.slice(0, 10) : null,
    ditandai: i.flag || null,
  }));
  return `Kamu adalah Ajax — AI Stylist dari aplikasi ClosetCloud. Persona: ramah, Gen Z Indonesia, paham iklim tropis, anti-overconsumption (selalu utamakan pakai ulang/swap/thrift sebelum menyarankan beli baru). Balas dalam Bahasa Indonesia santai tapi tidak norak.

ISI LEMARI USER (data nyata, JANGAN mengarang item di luar daftar ini):
${JSON.stringify(wardrobe)}

ATURAN KETAT:
1. Balas HANYA dengan JSON valid, tanpa markdown, tanpa teks lain, format: {"content": string, "action_cards": ActionCard[]}
2. ActionCard bertipe salah satu:
   {"type":"outfit","item_ids":[id dari lemari],"title":string,"reason":string}
   {"type":"rewear","item_id":id,"suggestion":string}
   {"type":"donate","item_id":id,"reason":string}
   {"type":"sell","item_id":id,"reason":string,"est_price":number}
   {"type":"diy","item_id":id,"idea":string,"steps":[string,string,string]}
   {"type":"suggest_add","category":string,"reason":string,"thrift_first":true}
3. item_ids/item_id WAJIB dari daftar lemari di atas. Kalau lemari kosong/kurang, jelaskan jujur di content dan gunakan suggest_add.
4. content maksimal 3 kalimat. action_cards maksimal 3 kartu, boleh kosong [].
5. Topik di luar fashion/lemari: tolak sopan di content, arahkan kembali ke fashion, action_cards [].`;
}

const rand = (a) => a[Math.floor(Math.random() * a.length)];

/* Kamus intent acara → parameter generator (place & mood), dipakai untuk
 * meracik outfit nyata dari lemari user sesuai konteks pertanyaannya. */
const OCCASIONS = [
  { re: /kuliah|kampus|kelas|ngampus/, place: "Kampus", mood: "Santai", label: "ke kampus" },
  { re: /kerja|kantor|wfo|ngantor|meeting|rapat/, place: "Kantor", mood: "Profesional", label: "kerja" },
  { re: /interview|wawancara|magang/, place: "Interview", mood: "Profesional", label: "interview" },
  { re: /kencan|nge-?date|\bdate\b|gebetan|pdkt|pacar|jadian|apel/, place: "Date", mood: "Romantis", label: "kencan" },
  { re: /kondangan|nikah|wedding|resepsi|kawinan/, place: "Kondangan", mood: "Percaya Diri", label: "kondangan" },
  { re: /ibadah|gereja|masjid|misa|sholat|kebaktian/, place: "Ibadah", mood: "Santai", label: "ibadah" },
  { re: /gym|olahraga|lari|workout|fitness|jogging|futsal/, place: "Gym", mood: "Playful", label: "olahraga" },
  { re: /nongkrong|hangout|\bmain\b|jalan|cafe|kafe|ngopi|nongki|nobar/, place: "Hangout/Café", mood: "Santai", label: "nongkrong" },
  { re: /pantai|beach|liburan|healing|snorkel/, place: "Pantai", mood: "Playful", label: "ke pantai" },
  { re: /konser|festival|\bgig\b|clubbing|dugem/, place: "Konser", mood: "Edgy", label: "konser" },
  { re: /travel|trip|jalan-?jalan|mudik/, place: "Travel", mood: "Santai", label: "travel" },
  { re: /formal|resmi|gala|sidang|wisuda/, place: "Acara Formal", mood: "Profesional", label: "acara formal" },
];
const WEATHERS = [
  { re: /panas|gerah|terik|kepanasan|siang bolong/, key: "panas" },
  { re: /hujan|mendung|gerimis|basah/, key: "hujan" },
  { re: /dingin|sejuk|adem/, key: "sejuk" },
];
const detectColor = (msg) => (COLORS_POOL.find((c) => msg.includes(c.name.toLowerCase())) || {}).name || null;

/* Stylist lokal — dipakai bila proxy tidak dikonfigurasi. Bukan template statis:
 * mendeteksi maksud pertanyaan, meracik outfit nyata dari lemari lewat
 * generateOutfitsV2, dan mengacak diksi supaya terasa hidup & tak berulang. */
export function localKaiReply(items, userMessage) {
  const msg = (userMessage || "").toLowerCase();
  const byCat = (c) => items.filter((i) => i.category === c);
  const cards = [];

  // --- sapaan singkat ---
  if (/^(hai|halo|hi|hello|hey|pagi|siang|sore|malam|assalam|permisi|help|tolong|bantu|makasih|thanks|thx)\b/.test(msg) && msg.length < 26) {
    return { content: rand([
      "Halo! Aku Ajax, stylist pribadimu. Mau outfit buat acara apa hari ini?",
      "Hai! Sebut aja acaranya — kampus, kerja, kencan — nanti aku racikin dari lemarimu.",
      "Yo! Bingung mau pakai apa? Kasih tau tujuanmu, aku bantu mix & match.",
      "Sama-sama! Ada acara lain yang mau aku bantu racikin outfitnya?",
    ]), action_cards: [] };
  }

  // --- donasi ---
  if (/donasi|sumbang|kasih orang|berhenti pakai/.test(msg)) {
    const cand = [...items].filter((i) => i.wearCount <= 1).sort((a, b) => a.wearCount - b.wearCount);
    if (cand.length) {
      cand.slice(0, 3).forEach((i) => cards.push({ type: "donate", item_id: i.id, reason: rand([`Baru dipakai ${i.wearCount}×`, "Jarang tersentuh belakangan", "Bisa lebih berguna buat orang lain"]) + " — cocok didonasikan." }));
      return { content: rand([`Ada ${cand.length} item yang jarang kamu sentuh — bisa banget didonasikan biar bermanfaat.`, "Ini beberapa yang paling jarang dipakai, sayang kalau nganggur di lemari:"]), action_cards: cards };
    }
    return { content: "Semua bajumu masih aktif dipakai — belum ada yang mendesak buat didonasikan. Keren!", action_cards: [] };
  }

  // --- jual / thrift ---
  if (/jual|thrift|duit|cuan|balik modal|preloved/.test(msg)) {
    const cand = [...items].filter((i) => i.wearCount <= 1).sort((a, b) => b.price - a.price);
    if (cand.length) {
      cand.slice(0, 3).forEach((i) => cards.push({ type: "sell", item_id: i.id, reason: "Bernilai tapi jarang dipakai — laku bagus di Thrift.", est_price: suggestedPrice(i.price) }));
      return { content: rand(["Item bernilai yang jarang kepakai ini enak dijual di Thrift — kasih 'hidup kedua' sekaligus balik modal.", "Beberapa ini sayang nganggur; jual di Thrift ClosetCloud yuk:"]), action_cards: cards };
    }
    return { content: "Belum ada item mahal yang menganggur buat dijual. Koleksimu terpakai maksimal!", action_cards: [] };
  }

  // --- DIY / upcycle ---
  if (/diy|upcycle|permak|sulap|daur ulang|kreasi|modif/.test(msg)) {
    const i = byCat("Atasan")[0] || items[0];
    if (i) { cards.push({ type: "diy", item_id: i.id, idea: `Refresh ${i.name}`, steps: ["Tentukan bagian yang mau diubah (kerah/lengan/panjang).", "Potong rapi atau tambah patch/sablon/bordir sesuai selera.", "Finishing jahit tepi & cuci sebelum dipakai."] }); return { content: rand([`Coba upcycle ${i.name} biar berasa baru lagi!`, `${i.name} bisa disulap jadi look segar — ini idenya:`]), action_cards: cards }; }
    return { content: "Scan dulu beberapa baju, nanti aku kasih ide DIY yang pas sama bahannya.", action_cards: [] };
  }

  // --- gap lemari / kurang ---
  if (/kurang|lengkap|tambah|belum punya|butuh|gap|melengkapi/.test(msg)) {
    const cats = new Set(items.map((i) => i.category));
    const missing = ["Bawahan", "Sepatu", "Outerwear", "Atasan"].filter((c) => !cats.has(c));
    if (missing.length) {
      missing.forEach((c) => cards.push({ type: "suggest_add", category: c, reason: `${c} bakal nambah variasi outfitmu.`, thrift_first: true }));
      const ad = adForCategory(missing[0]);
      cards.push({ type: "shop", brand: ad.brand, item: ad.item, price: ad.price, category: missing[0], url: ad.url });
      return { content: `Lemarimu belum punya ${missing.join(", ").toLowerCase()}. Cari lewat Thrift/Swap dulu ya — kalau mau baru, ini opsi partner.`, action_cards: cards };
    }
    return { content: "Kategori dasarmu sudah lengkap. Fokus optimalkan & padu-padan yang ada dulu!", action_cards: [] };
  }

  // --- barang nganggur / hemat ---
  if (/jarang|gak pernah|belum pernah|nganggur|hemat|cost.?per.?wear|mubazir|sayang/.test(msg)) {
    const cand = [...items].filter((i) => i.wearCount <= 2).sort((a, b) => a.wearCount - b.wearCount).slice(0, 3);
    if (cand.length) { cand.forEach((i) => cards.push({ type: "rewear", item_id: i.id, suggestion: rand(["Pasangkan dengan atasan netral biar gampang dipakai.", "Coba jadi statement piece minggu ini.", "Layering tipis bikin ini lebih sering kepakai."]) })); return { content: "Ini yang paling jarang kamu pakai — sayang kalau nganggur. Yuk hidupkan lagi:", action_cards: cards }; }
  }

  // --- default: RACIK OUTFIT NYATA sesuai konteks (acara/cuaca/warna) ---
  const occ = OCCASIONS.find((o) => o.re.test(msg));
  const weather = (WEATHERS.find((w) => w.re.test(msg)) || {}).key || "sejuk";
  const color = detectColor(msg);
  const { combos } = generateOutfitsV2(items, weather, occ?.place || "Kampus", occ?.mood || "Santai", "Semua", color);
  if (combos.length) {
    const combo = rand(combos); // acak → tiap tanya bisa beda, mendukung "kasih yang lain"
    const names = [combo.top, combo.bottom, combo.shoe, combo.outer].filter(Boolean).map((i) => i.name);
    const opener = rand(["Nih aku racikin:", "Coba yang ini —", "Aku pilihin ini:", "Gimana kalau:", "Ini cakep buat kamu:"]);
    const closer = rand(["Mau versi lain? Sebut mood-nya.", "Kurang sreg? Bilang 'lain', nanti aku ganti.", "Ketuk 'Pakai hari ini' kalau suka!", "Bisa aku sesuaikan warna atau vibe, tinggal bilang."]);
    const ctx = occ ? ` buat ${occ.label}` : color ? ` dengan aksen ${color.toLowerCase()}` : "";
    cards.push({ type: "outfit", item_ids: [combo.top, combo.bottom, combo.shoe, combo.outer, combo.acc].filter(Boolean).map((i) => i.id), title: occ ? `Look ${occ.label}` : "Padu-padan buatmu", reason: combo.reason });
    return { content: `${opener} ${names.join(" + ")}${ctx}. ${closer}`, action_cards: cards };
  }

  return { content: rand(["Lemarimu belum cukup buat aku racik — scan minimal 1 atasan & 1 bawahan dulu ya, nanti aku bikinin!", "Aku butuh minimal 1 atasan + 1 bawahan buat mulai. Yuk scan bajumu dulu!"]), action_cards: [] };
}

/* Parse either a plain {content, action_cards} payload or an Anthropic-style
 * messages response into our canonical reply shape. */
function parseReply(data) {
  if (data && typeof data.content === "string") {
    return { content: data.content, action_cards: Array.isArray(data.action_cards) ? data.action_cards : [] };
  }
  const text = (data?.content || []).filter((b) => b.type === "text").map((b) => b.text).join("\n");
  const parsed = JSON.parse(text.replace(/```json|```/g, "").trim());
  if (typeof parsed.content !== "string") throw new Error("format");
  return { content: parsed.content, action_cards: Array.isArray(parsed.action_cards) ? parsed.action_cards : [] };
}

export async function askKai(items, history, userMessage) {
  const messages = [
    ...history.slice(-8).map((m) => ({ role: m.role, content: m.content })),
    { role: "user", content: userMessage },
  ];

  if (!KAI_ENDPOINT) return localKaiReply(items, userMessage);

  try {
    const response = await fetch(KAI_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: KAI_MODEL,
        max_tokens: 1000,
        system: buildKaiSystemPrompt(items),
        messages,
      }),
    });
    if (!response.ok) throw new Error("api");
    return parseReply(await response.json());
  } catch {
    // Fallback lokal supaya Ajax tetap berfungsi bila proxy gagal/tidak ada.
    return localKaiReply(items, userMessage);
  }
}
