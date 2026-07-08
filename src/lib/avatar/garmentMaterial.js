import * as THREE from "three";

/* ============ PARAMETRIC GARMENT MATERIAL ============
 * Membuat THREE.Material (PBR) dari RenderProfile. Bahan → roughness/metalness,
 * warna → base color, motif → tekstur prosedural (CanvasTexture) yang di-tint
 * warna dominan + aksen. Tanpa aset eksternal → offline-safe. */

const PBR = {
  cotton: { roughness: 0.9, metalness: 0.0 },
  linen: { roughness: 0.95, metalness: 0.0 },
  denim: { roughness: 0.85, metalness: 0.0 },
  wool: { roughness: 0.82, metalness: 0.0 },
  leather: { roughness: 0.42, metalness: 0.12 },
  satin: { roughness: 0.26, metalness: 0.06 },
  default: { roughness: 0.8, metalness: 0.0 },
};

/* Cache tekstur motif (kecil, dipakai ulang; tidak di-dispose per-mount). */
const texCache = new Map();

function patternTexture(pattern, base, accent, size = 128) {
  const cacheKey = `${pattern}-${base}-${accent}-${size}`;
  if (texCache.has(cacheKey)) return texCache.get(cacheKey);

  const c = document.createElement("canvas");
  c.width = c.height = size;
  const ctx = c.getContext("2d");
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, size, size);
  ctx.strokeStyle = accent;
  ctx.fillStyle = accent;

  if (pattern === "stripe") {
    ctx.lineWidth = size * 0.09;
    for (let x = -size; x < size * 2; x += size * 0.26) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, size); ctx.stroke();
    }
  } else if (pattern === "plaid") {
    ctx.lineWidth = size * 0.07; ctx.globalAlpha = 0.85;
    for (let p = 0; p < size; p += size * 0.28) {
      ctx.beginPath(); ctx.moveTo(p, 0); ctx.lineTo(p, size); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, p); ctx.lineTo(size, p); ctx.stroke();
    }
    ctx.globalAlpha = 1;
  } else if (pattern === "floral") {
    for (let i = 0; i < 5; i++) {
      const gx = (i % 3) * (size / 3) + size / 6;
      const gy = Math.floor(i / 3) * (size / 2) + size / 4;
      for (let a = 0; a < 6; a++) {
        const ang = (a / 6) * Math.PI * 2;
        ctx.beginPath();
        ctx.arc(gx + Math.cos(ang) * size * 0.05, gy + Math.sin(ang) * size * 0.05, size * 0.035, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  } else if (pattern === "polka") {
    for (let y = size * 0.15; y < size; y += size * 0.3) {
      for (let x = size * 0.15; x < size; x += size * 0.3) {
        ctx.beginPath(); ctx.arc(x, y, size * 0.06, 0, Math.PI * 2); ctx.fill();
      }
    }
  } else if (pattern === "graphic") {
    ctx.globalAlpha = 0.9;
    ctx.beginPath();
    const cx = size / 2, cy = size / 2, r = size * 0.28;
    for (let a = 0; a < 10; a++) {
      const ang = (a / 10) * Math.PI * 2 - Math.PI / 2;
      const rr = a % 2 ? r * 0.45 : r;
      ctx[a === 0 ? "moveTo" : "lineTo"](cx + Math.cos(ang) * rr, cy + Math.sin(ang) * rr);
    }
    ctx.closePath(); ctx.fill();
    ctx.globalAlpha = 1;
  }

  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(pattern === "graphic" ? 1 : 2.5, pattern === "graphic" ? 1 : 3);
  tex.anisotropy = 2;
  tex.colorSpace = THREE.SRGBColorSpace;
  texCache.set(cacheKey, tex);
  return tex;
}

/* Buat material untuk satu garment. quality: 'high'|'low' (low = motif dimatikan). */
export function createGarmentMaterial(profile, quality = "high") {
  const pbr = PBR[profile.material] || PBR.default;
  const mat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(profile.baseColorHex),
    roughness: pbr.roughness,
    metalness: pbr.metalness,
  });
  if (quality !== "low" && profile.pattern && profile.pattern !== "solid") {
    mat.map = patternTexture(profile.pattern, profile.baseColorHex, profile.accentColorHex || "#333");
    mat.color.set("#ffffff"); // biar map tampil apa adanya (base sudah jadi bg tekstur)
  }
  // denim & wol sedikit "kain" → naikkan roughness variasi via flatShading off
  mat.flatShading = false;
  return mat;
}
