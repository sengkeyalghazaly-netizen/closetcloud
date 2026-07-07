/* ============ KAI — AI CHAT STYLIST ============
 * Two-tier design so the same UI works in prototype and production:
 *   1. If VITE_KAI_ENDPOINT is set, POST the conversation to that proxy
 *      (a server-side Edge Function that holds the Claude API key and enforces
 *      quota). This is the production seam — no component change needed.
 *   2. Otherwise fall back to a deterministic, wardrobe-aware rule engine so
 *      Kai always answers, even on a static host with no backend.
 *
 * A browser can never call api.anthropic.com directly (no key may ship to the
 * client, and CORS blocks it), so we deliberately do NOT attempt it — that
 * only produced a guaranteed-failed request. Configure a proxy instead. */

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
  return `Kamu adalah Kai — AI Stylist dari aplikasi ClosetCloud. Persona: ramah, Gen Z Indonesia, paham iklim tropis, anti-overconsumption (selalu utamakan pakai ulang/swap/thrift sebelum menyarankan beli baru). Balas dalam Bahasa Indonesia santai tapi tidak norak.

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

/* Stylist lokal berbasis aturan — dipakai bila proxy tidak dikonfigurasi. */
export function localKaiReply(items, userMessage) {
  const msg = userMessage.toLowerCase();
  const byCat = (c) => items.filter((i) => i.category === c);
  const cards = [];
  let content = "";

  const isFashion = /outfit|baju|pakai|lemari|donasi|jual|diy|gaya|style|padu|warna|cocok|kurang|thrift|swap/.test(msg) || items.length > 0;

  if (/donasi/.test(msg)) {
    const cand = [...items].sort((a, b) => a.wearCount - b.wearCount).filter((i) => i.wearCount <= 1);
    if (cand.length) { content = `Ada ${cand.length} item yang jarang kamu pakai dan bisa dipertimbangkan untuk didonasikan biar bermanfaat buat orang lain.`; cand.slice(0, 3).forEach((i) => cards.push({ type: "donate", item_id: i.id, reason: `Baru dipakai ${i.wearCount}× — kalau sudah tidak sreg, donasi bisa jadi pilihan baik.` })); }
    else content = "Semua bajumu masih cukup aktif dipakai — belum ada yang mendesak untuk didonasikan. Mantap!";
  } else if (/jual/.test(msg)) {
    const cand = [...items].sort((a, b) => b.price - a.price).filter((i) => i.wearCount <= 1);
    if (cand.length) { content = "Beberapa item bernilai tapi jarang dipakai ini bisa kamu jual untuk kasih 'hidup kedua'."; cand.slice(0, 3).forEach((i) => cards.push({ type: "sell", item_id: i.id, reason: "Nilainya lumayan tapi jarang dipakai.", est_price: Math.round(i.price * 0.55) })); }
    else content = "Belum ada item mahal yang menganggur untuk dijual. Koleksimu terpakai dengan baik.";
  } else if (/diy|upcycl/.test(msg)) {
    const i = byCat("Atasan")[0] || items[0];
    if (i) { content = `Coba upcycle ${i.name} biar makin fresh!`; cards.push({ type: "diy", item_id: i.id, idea: `Refresh ${i.name}`, steps: ["Tentukan bagian yang mau diubah (kerah/lengan/panjang).", "Potong rapi atau tambahkan patch/sablon sesuai selera.", "Finishing jahit tepi & cuci sebelum dipakai."] }); }
    else content = "Scan dulu beberapa baju, nanti aku kasih ide DIY yang pas dengan bahannya.";
  } else if (/kurang|lengkap|tambah/.test(msg)) {
    const cats = new Set(items.map((i) => i.category));
    const missing = ["Bawahan", "Sepatu", "Outerwear"].filter((c) => !cats.has(c));
    if (missing.length) { content = `Lemarimu belum punya ${missing.join(", ").toLowerCase()}. Sebelum beli baru, coba cari lewat thrift atau Swap Network dulu ya!`; missing.forEach((c) => cards.push({ type: "suggest_add", category: c, reason: `Kategori ${c} bisa melengkapi variasi outfitmu.`, thrift_first: true })); }
    else content = "Lemarimu sudah cukup lengkap di semua kategori dasar. Fokus optimalkan yang ada dulu!";
  } else {
    const tops = byCat("Atasan"), bottoms = byCat("Bawahan");
    if (tops.length && bottoms.length) {
      const shoe = byCat("Sepatu")[0];
      const ids = [tops[0].id, bottoms[0].id, shoe?.id].filter(Boolean);
      content = "Ini satu kombinasi dari lemarimu yang enak dipakai harian. Mau versi lain? Sebut mood atau acaranya ya!";
      cards.push({ type: "outfit", item_ids: ids, title: "Padu-padan harian", reason: `${tops[0].color.name} × ${bottoms[0].color.name}, simpel dan gampang dipakai.` });
    } else {
      content = isFashion ? "Lemarimu belum cukup lengkap untuk kubuatkan outfit. Scan minimal 1 atasan & 1 bawahan dulu ya, nanti aku racik!" : "Aku Kai, stylist khusus lemarimu — aku bantu soal outfit, donasi, jual, DIY, dan isi lemari. Yuk tanya seputar itu!";
    }
  }
  return { content, action_cards: cards };
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
    // Fallback lokal supaya Kai tetap berfungsi bila proxy gagal/tidak ada.
    return localKaiReply(items, userMessage);
  }
}
