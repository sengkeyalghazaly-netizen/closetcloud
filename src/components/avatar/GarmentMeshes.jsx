import { B } from "./proportions";

/* ============ PARAMETRIC GARMENT MESHES ============
 * Tiap template = kumpulan mesh berbentuk (bukan blob), menempel di region tubuh
 * yang sesuai, memakai `material` PBR dari atribut. `fit` menyesuaikan siluet. */

const fitR = (fit) => ({ slim: 0.97, regular: 1, oversized: 1.13, athletic: 0.99, tailored: 0.97 }[fit] || 1);

function Sleeves({ material, long }) {
  return [-1, 1].map((d) =>
    long ? (
      <mesh key={d} material={material} position={[d * B.armX, B.armY, 0]} rotation={[0, 0, d * 0.14]} castShadow>
        <capsuleGeometry args={[0.064, B.armLen, 8, 16]} />
      </mesh>
    ) : (
      <mesh key={d} material={material} position={[d * (B.armX - 0.01), B.armY + 0.14, 0]} rotation={[0, 0, d * 0.14]} castShadow>
        <capsuleGeometry args={[0.072, 0.15, 8, 14]} />
      </mesh>
    )
  );
}
function Torso({ material, fit, grow = 0.022, len = B.torsoLen, y = B.torsoY }) {
  return (
    <>
      <mesh material={material} position={[0, y, 0]} castShadow><capsuleGeometry args={[(B.torsoR + grow) * fitR(fit), len, 10, 22]} /></mesh>
      <mesh material={material} position={[0, B.shoulderY, 0]} rotation={[0, 0, Math.PI / 2]} castShadow><capsuleGeometry args={[(0.105 + grow) * fitR(fit), 0.3, 8, 16]} /></mesh>
    </>
  );
}
function Collar({ material, r = 0.066 }) {
  return <mesh material={material} position={[0, B.neckY - 0.04, 0]}><torusGeometry args={[r, 0.02, 10, 24]} /></mesh>;
}

/* ---------- TOP ---------- */
const TShirt = ({ material, fit }) => (<group><Torso material={material} fit={fit} /><Sleeves material={material} /><Collar material={material} /></group>);
const Shirt = ({ material, fit }) => (
  <group>
    <Torso material={material} fit={fit} />
    <Sleeves material={material} long />
    <Collar material={material} r={0.07} />
    <mesh material={material} position={[0, B.torsoY, (B.torsoR + 0.02) * fitR(fit)]}><boxGeometry args={[0.03, B.torsoLen + 0.2, 0.02]} /></mesh>
  </group>
);
const Hoodie = ({ material, fit }) => (
  <group>
    <Torso material={material} fit={fit} grow={0.04} />
    <Sleeves material={material} long />
    <mesh material={material} position={[0, B.neckY + 0.02, -0.05]}><sphereGeometry args={[0.14, 20, 20, 0, Math.PI * 2, 0, Math.PI * 0.62]} /></mesh>
    <mesh material={material} position={[0, B.torsoY - 0.12, (B.torsoR + 0.03) * fitR(fit)]}><boxGeometry args={[0.2, 0.12, 0.03]} /></mesh>
  </group>
);
const Tank = ({ material, fit }) => (
  <group>
    <mesh material={material} position={[0, B.torsoY, 0]} castShadow><capsuleGeometry args={[(B.torsoR + 0.02) * fitR(fit), B.torsoLen - 0.04, 10, 22]} /></mesh>
    {[-1, 1].map((d) => <mesh key={d} material={material} position={[d * 0.09, B.shoulderY, 0]}><boxGeometry args={[0.04, 0.16, 0.05]} /></mesh>)}
  </group>
);

/* ---------- OUTERWEAR ---------- */
const Jacket = ({ material, fit }) => (
  <group>
    <Torso material={material} fit={fit} grow={0.045} />
    <Sleeves material={material} long />
    <Collar material={material} r={0.085} />
    <mesh material={material} position={[0, B.torsoY, (B.torsoR + 0.045) * fitR(fit)]}><boxGeometry args={[0.02, B.torsoLen + 0.24, 0.02]} /></mesh>
  </group>
);
const Blazer = ({ material, fit }) => (
  <group>
    <Torso material={material} fit={fit} grow={0.04} len={B.torsoLen + 0.06} y={B.torsoY - 0.02} />
    <Sleeves material={material} long />
    {[-1, 1].map((d) => (
      <mesh key={d} material={material} position={[d * 0.08, B.torsoY + 0.1, (B.torsoR + 0.045)]} rotation={[0.1, 0, -d * 0.5]}><boxGeometry args={[0.07, 0.2, 0.02]} /></mesh>
    ))}
  </group>
);
const Cardigan = ({ material, fit }) => (
  <group>
    <Torso material={material} fit={fit} grow={0.05} />
    <Sleeves material={material} long />
    {[-1, 1].map((d) => <mesh key={d} material={material} position={[d * 0.06, B.torsoY, (B.torsoR + 0.05) * fitR(fit)]}><boxGeometry args={[0.03, B.torsoLen + 0.2, 0.02]} /></mesh>)}
  </group>
);
const Coat = ({ material, fit }) => (
  <group>
    <mesh material={material} position={[0, B.torsoY - 0.16, 0]} castShadow><capsuleGeometry args={[(B.torsoR + 0.05) * fitR(fit), B.torsoLen + 0.42, 10, 22]} /></mesh>
    <mesh material={material} position={[0, B.shoulderY, 0]} rotation={[0, 0, Math.PI / 2]} castShadow><capsuleGeometry args={[0.155, 0.3, 8, 16]} /></mesh>
    <Sleeves material={material} long />
    <Collar material={material} r={0.09} />
  </group>
);

/* ---------- BOTTOM ---------- */
function Legs({ material, fit, len = B.legLen, y = B.legY }) {
  const r = (B.legR + 0.02) * fitR(fit);
  return [-1, 1].map((d) => <mesh key={d} material={material} position={[d * B.legX, y, 0]} castShadow><capsuleGeometry args={[r, len, 8, 16]} /></mesh>);
}
const Waist = ({ material }) => <mesh material={material} position={[0, B.hipY, 0]} castShadow><capsuleGeometry args={[B.hipR + 0.015, 0.07, 8, 18]} /></mesh>;
const Pants = ({ material, fit }) => (<group><Waist material={material} /><Legs material={material} fit={fit} /></group>);
const Jeans = Pants;
const Shorts = ({ material, fit }) => (<group><Waist material={material} /><Legs material={material} fit={fit} len={0.24} y={B.hipY - 0.18} /></group>);
const Skirt = ({ material }) => (
  <group>
    <Waist material={material} />
    <mesh material={material} position={[0, B.hipY - 0.22, 0]} castShadow><cylinderGeometry args={[B.hipR + 0.02, B.hipR + 0.14, 0.4, 26, 1, true]} /></mesh>
  </group>
);

/* ---------- FEET ---------- */
function Shoe({ material, d, height = 0.1, ankle = false, heel = false }) {
  return (
    <group position={[d * B.legX, 0, 0]}>
      <mesh material={material} position={[0, height / 2, 0.05]} castShadow><boxGeometry args={[0.125, height, 0.25]} /></mesh>
      <mesh material={material} position={[0, height / 2, 0.17]}><sphereGeometry args={[0.062, 16, 16]} /></mesh>
      {ankle && <mesh material={material} position={[0, height + 0.08, 0]}><cylinderGeometry args={[0.08, 0.09, 0.18, 16]} /></mesh>}
      {heel && <mesh material={material} position={[0, height / 2 - 0.02, -0.06]}><boxGeometry args={[0.05, height + 0.04, 0.05]} /></mesh>}
    </group>
  );
}
const Sneakers = ({ material }) => (<group>{[-1, 1].map((d) => <Shoe key={d} material={material} d={d} height={0.11} />)}</group>);
const Boots = ({ material }) => (<group>{[-1, 1].map((d) => <Shoe key={d} material={material} d={d} height={0.1} ankle />)}</group>);
const Loafers = ({ material }) => (<group>{[-1, 1].map((d) => <Shoe key={d} material={material} d={d} height={0.07} />)}</group>);
const Flats = Loafers;
const Heels = ({ material }) => (<group>{[-1, 1].map((d) => <Shoe key={d} material={material} d={d} height={0.06} heel />)}</group>);
const Sandals = ({ material }) => (<group>{[-1, 1].map((d) => (
  <group key={d} position={[d * B.legX, 0, 0]}>
    <mesh material={material} position={[0, 0.03, 0.05]}><boxGeometry args={[0.12, 0.04, 0.24]} /></mesh>
    <mesh material={material} position={[0, 0.08, 0.06]} rotation={[0.3, 0, 0]}><boxGeometry args={[0.11, 0.02, 0.05]} /></mesh>
  </group>
))}</group>);

/* ---------- HEAD ---------- */
const Cap = ({ material }) => (
  <group position={[0, B.headY, 0]}>
    <mesh material={material} position={[0, 0.04, 0]}><sphereGeometry args={[B.headR + 0.02, 24, 24, 0, Math.PI * 2, 0, Math.PI * 0.55]} /></mesh>
    <mesh material={material} position={[0, 0.0, 0.13]} rotation={[-0.15, 0, 0]}><cylinderGeometry args={[0.11, 0.11, 0.02, 20, 1, false, Math.PI * 0.15, Math.PI * 0.7]} /></mesh>
  </group>
);
const Beanie = ({ material }) => (
  <group position={[0, B.headY, 0]}>
    <mesh material={material} position={[0, 0.02, 0]}><sphereGeometry args={[B.headR + 0.03, 24, 24, 0, Math.PI * 2, 0, Math.PI * 0.7]} /></mesh>
    <mesh material={material} position={[0, -0.02, 0]}><torusGeometry args={[B.headR + 0.02, 0.03, 10, 26]} /></mesh>
  </group>
);

/* ---------- CARRY ---------- */
const Tote = ({ material }) => (
  <group position={[0.3, 0.98, 0.04]}>
    <mesh material={material} castShadow><boxGeometry args={[0.15, 0.19, 0.06]} /></mesh>
    <mesh material={material} position={[0, 0.14, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.06, 0.012, 8, 20, Math.PI]} /></mesh>
  </group>
);
const Backpack = ({ material }) => (
  <group>
    <mesh material={material} position={[0, 1.12, -0.2]} castShadow><boxGeometry args={[0.27, 0.34, 0.13]} /></mesh>
    {[-1, 1].map((d) => <mesh key={d} material={material} position={[d * 0.1, 1.16, -0.04]} rotation={[0.22, 0, 0]}><boxGeometry args={[0.04, 0.3, 0.03]} /></mesh>)}
  </group>
);

export const GARMENT = {
  tshirt: TShirt, shirt: Shirt, hoodie: Hoodie, tank: Tank,
  jacket: Jacket, blazer: Blazer, cardigan: Cardigan, coat: Coat,
  pants: Pants, jeans: Jeans, shorts: Shorts, skirt: Skirt,
  sneakers: Sneakers, boots: Boots, loafers: Loafers, flats: Flats, heels: Heels, sandals: Sandals,
  cap: Cap, beanie: Beanie, tote: Tote, backpack: Backpack,
};

/* fallback generik per slot bila template tak dikenal */
export const SLOT_FALLBACK = { top: "tshirt", outerwear: "jacket", bottom: "pants", feet: "sneakers", head: "cap", carry: "tote" };
