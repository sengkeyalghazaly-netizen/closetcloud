import { useState } from "react";
import { T } from "../../theme/tokens";
import { mapItemToRenderProfile } from "../../lib/avatar/renderProfile";

/* ============================================================================
 * OutfitBoard — flat-lay pengganti avatar.
 * Menampilkan FOTO ASLI tiap item dari lemari (it.image) dalam grid rapi,
 * dengan fallback siluet SVG berwarna kalau foto gagal/ tidak ada. Web-native
 * (React + Tailwind), memakai data item app (color.hex, pattern, category) dan
 * pemetaan bentuk lewat mapItemToRenderProfile — tanpa dependensi eksternal.
 * ========================================================================== */

// Urutan tampil (atas → bawah tubuh) + label ramah pengguna per kategori.
const SLOT_ORDER = ["Outerwear", "Dress", "Atasan", "Bawahan", "Sepatu", "Aksesori"];
const orderOf = (cat) => { const i = SLOT_ORDER.indexOf(cat); return i === -1 ? 99 : i; };

// Template 3D (dari renderProfile) → keluarga bentuk siluet 2D.
const SHAPE_OF = {
  tshirt: "tshirt", tank: "tshirt", hoodie: "tshirt", shirt: "shirt",
  jacket: "blazer", blazer: "blazer", cardigan: "blazer", coat: "blazer",
  pants: "pants", jeans: "pants", shorts: "pants", skirt: "skirt", dress: "dress",
  sneakers: "sneaker", boots: "sneaker", loafers: "sneaker", flats: "sneaker",
  heels: "sneaker", sandals: "sneaker", cap: "cap", beanie: "cap",
  tote: "tote", backpack: "tote",
};

const SHAPES = {
  tshirt: ["M55 20 L35 30 L20 55 L34 66 L42 58 L42 130 L108 130 L108 58 L116 66 L130 55 L115 30 L95 20 Q75 34 55 20 Z"],
  shirt: ["M55 18 L34 28 L20 56 L33 66 L42 60 L42 132 L108 132 L108 60 L117 66 L130 56 L116 28 L95 18 L75 30 L55 18 Z"],
  blazer: ["M55 16 L32 26 L18 58 L32 70 L44 62 L44 134 L75 134 L75 60 L106 134 L106 62 L118 70 L132 58 L118 26 L95 16 L75 42 L55 16 Z"],
  pants: ["M42 20 L108 20 L106 70 L98 134 L78 134 L75 78 L72 134 L52 134 L44 70 Z"],
  skirt: ["M46 24 L104 24 L120 128 L30 128 Z"],
  dress: ["M55 20 L38 30 L28 54 L40 64 L46 56 L34 132 L116 132 L104 56 L110 64 L122 54 L112 30 L95 20 Q75 34 55 20 Z"],
  sneaker: ["M22 92 Q20 74 40 72 L72 74 Q92 78 110 96 Q124 104 124 112 L20 112 Q18 100 22 92 Z"],
  tote: ["M40 44 L110 44 L118 128 L32 128 Z", "M58 44 Q58 24 75 24 Q92 24 92 44"],
  cap: ["M28 92 Q30 50 75 50 Q120 50 122 92 Q100 78 75 78 Q50 78 28 92 Z"],
};

function shade(hex, amt) {
  const clean = String(hex || "").replace("#", "");
  const safe = clean.length === 3 ? clean.split("").map((c) => c + c).join("") : clean;
  const n = parseInt(safe, 16);
  if (Number.isNaN(n)) return hex || "#c9c9d4";
  let r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  r = Math.max(0, Math.min(255, r + amt));
  g = Math.max(0, Math.min(255, g + amt));
  b = Math.max(0, Math.min(255, b + amt));
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

/* Siluet SVG — hanya dipakai saat foto gagal/ kosong. Bentuk & warna diambil
 * dari profil render item supaya tetap “nyambung” dengan barang aslinya. */
function Silhouette({ item, size = 92 }) {
  const p = mapItemToRenderProfile(item);
  const shape = SHAPE_OF[p.template] || "tshirt";
  const paths = SHAPES[shape] || SHAPES.tshirt;
  const base = p.baseColorHex || "#c9c9d4";
  const uid = (item.id || item.name || "s").toString().replace(/[^a-z0-9]/gi, "");
  const gid = "cbg-" + uid, pid = "cbp-" + uid;
  const striped = p.pattern === "stripe";
  const fill = striped ? `url(#${pid})` : `url(#${gid})`;
  const stroke = shade(base, -35);
  return (
    <svg width={size} height={size} viewBox="0 0 150 150" aria-hidden="true">
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={shade(base, 12)} />
          <stop offset="1" stopColor={shade(base, -10)} />
        </linearGradient>
        {striped && (
          <pattern id={pid} patternUnits="userSpaceOnUse" width="10" height="10">
            <rect width="10" height="10" fill={base} />
            <rect width="3" height="10" fill={p.accentColorHex || shade(base, -40)} />
          </pattern>
        )}
      </defs>
      {paths.map((d, i) => (
        <path key={i} d={d} fill={i === 1 ? "none" : fill} stroke={stroke} strokeWidth="2.5" strokeLinejoin="round" />
      ))}
    </svg>
  );
}

function GarmentCard({ item }) {
  const [failed, setFailed] = useState(false);
  const showPhoto = !!item.image && !failed;
  return (
    <div className="flex flex-col items-center">
      <div className="w-full rounded-2xl overflow-hidden relative flex items-center justify-center"
        style={{ aspectRatio: "1 / 1", background: "#FBFBFE", boxShadow: "0 6px 16px -10px rgba(31,42,74,.35)" }}>
        {showPhoto ? (
          <img src={item.image} alt={item.name} loading="lazy" onError={() => setFailed(true)}
            className="w-full h-full object-cover" draggable={false} />
        ) : (
          <Silhouette item={item} />
        )}
      </div>
      <p className="text-[11px] font-bold mt-1.5 leading-tight truncate w-full text-center" style={{ color: T.navy }}>{item.name}</p>
      <p className="text-[10px] leading-tight" style={{ color: T.navySoft }}>{item.category}</p>
    </div>
  );
}

/* items: array item lemari (mis. [top, outer, bottom, shoe, acc]). Nilai
 * falsy diabaikan. Susun ulang mengikuti urutan tubuh agar terbaca natural. */
export function OutfitBoard({ items = [] }) {
  const list = items.filter(Boolean).slice().sort((a, b) => orderOf(a.category) - orderOf(b.category));
  if (!list.length) return null;
  return (
    <div className="grid grid-cols-2 gap-3 p-3">
      {list.map((it) => <GarmentCard key={it.id} item={it} />)}
    </div>
  );
}

export default OutfitBoard;
