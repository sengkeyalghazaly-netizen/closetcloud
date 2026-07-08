/* ============ ATTRIBUTE → RENDER PROFILE (kontrak data avatar) ============
 * Mengubah item lemari (hasil AI Scan) menjadi RenderProfile murni yang dipakai
 * renderer 3D. SETIAP field punya default → tidak pernah ada garment gagal
 * render. Foto asli item TIDAK dikirim ke renderer (privasi + performa). */

const MATERIAL_MAP = {
  Katun: "cotton", Linen: "linen", Denim: "denim", Wol: "wool",
  "Kulit sintetis": "leather", Kulit: "leather", Suede: "wool",
  Rayon: "satin", Satin: "satin", Polyester: "default",
  Chino: "cotton", Kanvas: "cotton", Karet: "default", Mesh: "default",
};
const PATTERN_MAP = {
  Polos: "solid", Garis: "stripe", "Kotak-kotak": "plaid",
  "Motif bunga": "floral", "Print grafis": "graphic", Polkadot: "polka",
};

function slotForCategory(category, item) {
  switch (category) {
    case "Atasan": return "top";
    case "Outerwear": return "outerwear";
    case "Bawahan": return "bottom";
    case "Sepatu": return "feet";
    case "Aksesori": {
      const t = `${item.type || ""} ${item.name || ""}`.toLowerCase();
      return /topi|beanie|hat|cap|kupluk|kacamata|headband/.test(t) ? "head" : "carry";
    }
    default: return "top";
  }
}

function templateForItem(slot, item) {
  const name = (item.name || "").toLowerCase();
  const type = (item.type || "").toLowerCase();
  if (slot === "top") {
    if (/hoodie/.test(name + type)) return "hoodie";
    if (/kemeja|shirt|blouse|blus|flanel/.test(name)) return "shirt";
    if (item.sleeve === "Tanpa lengan" || /tank|kamisol/.test(name)) return "tank";
    return "tshirt";
  }
  if (slot === "outerwear") {
    if (/blazer|jas/.test(name + type)) return "blazer";
    if (/cardigan|kardigan/.test(name + type)) return "cardigan";
    if (/coat|mantel|trench/.test(name + type)) return "coat";
    if (/hoodie/.test(name + type)) return "hoodie";
    return "jacket";
  }
  if (slot === "bottom") {
    if (/rok|skirt/.test(name)) return "skirt";
    if (/shorts|celana pendek|hotpants/.test(name) || item.length === "Pendek") return "shorts";
    if (/jeans|denim/.test(name) || item.material === "Denim") return "jeans";
    return "pants";
  }
  if (slot === "feet") {
    if (/boots|boot/.test(name + type)) return "boots";
    if (/loafer|pantofel|formal|oxford|derby/.test(name + type)) return "loafers";
    if (/sandal|slide/.test(name + type)) return "sandals";
    if (/heels|hak tinggi/.test(name + type)) return "heels";
    if (/flat/.test(name + type)) return "flats";
    return "sneakers";
  }
  if (slot === "head") return /beanie|kupluk/.test(name) ? "beanie" : "cap";
  if (slot === "carry") return /backpack|ransel|tas punggung/.test(name) ? "backpack" : "tote";
  return "generic";
}

function fitForItem(item) {
  if (item.fit) {
    const f = item.fit.toLowerCase();
    if (f.includes("slim")) return "slim";
    if (f.includes("loose") || f.includes("wide") || f.includes("oversized")) return "oversized";
    return "regular";
  }
  switch (item.style) {
    case "Formal": return "tailored";
    case "Olahraga": return "athletic";
    case "Pesta": return "slim";
    default: return "regular";
  }
}

/* Aksen warna: turunan gelap dari base (untuk motif) bila tak ada aksen eksplisit. */
function shade(hex, amt) {
  const h = (hex || "#9AA0B4").replace("#", "");
  const n = parseInt(h.length === 3 ? h.split("").map((c) => c + c).join("") : h, 16);
  let r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  r = Math.max(0, Math.min(255, Math.round(r + amt))); g = Math.max(0, Math.min(255, Math.round(g + amt))); b = Math.max(0, Math.min(255, Math.round(b + amt)));
  return "#" + [r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("");
}

export function mapItemToRenderProfile(item) {
  if (!item) return null;
  const category = item.category || "Atasan";
  const slot = slotForCategory(category, item);
  const baseColorHex = item.color?.hex || "#9AA0B4";
  return {
    slot,
    template: templateForItem(slot, item),
    baseColorHex,
    accentColorHex: shade(baseColorHex, -46),
    pattern: PATTERN_MAP[item.pattern] || "solid",
    material: MATERIAL_MAP[item.material] || "default",
    fit: fitForItem(item),
    confidence: typeof item.confidence === "number" ? item.confidence : 0.9,
    key: `${item.id || item.name || slot}-${item.color?.name || ""}-${item.pattern || ""}-${item.material || ""}`,
  };
}

/* Outfit (dari Generator: top/outer/bottom/shoe/acc) → daftar RenderProfile. */
export function outfitToProfiles(outfit) {
  if (!outfit) return [];
  return [outfit.top, outfit.outer, outfit.bottom, outfit.shoe, outfit.acc]
    .filter(Boolean).map(mapItemToRenderProfile).filter(Boolean);
}
