import { B } from "./proportions";

/* Tubuh dasar stylized (skin tone dari profil). Bagian yang tertutup garment
 * tetap dirender (aman kalau slot kosong). */
export function BaseBody({ skin = "#E8C6A2", covered = {} }) {
  const s = (extra = {}) => <meshStandardMaterial color={skin} roughness={0.72} metalness={0} {...extra} />;
  return (
    <group>
      {/* kepala + leher */}
      <mesh position={[0, B.headY, 0]} castShadow><sphereGeometry args={[B.headR, 32, 32]} />{s()}</mesh>
      <mesh position={[0, B.neckY, 0]}><cylinderGeometry args={[B.neckR, B.neckR + 0.01, B.neckH, 18]} />{s()}</mesh>

      {/* torso + bahu (tertutup top/outer bila ada) */}
      <mesh position={[0, B.torsoY, 0]} castShadow><capsuleGeometry args={[B.torsoR, B.torsoLen, 10, 22]} />{s()}</mesh>
      <mesh position={[0, B.shoulderY, 0]} rotation={[0, 0, Math.PI / 2]} castShadow><capsuleGeometry args={[0.1, 0.3, 8, 16]} />{s()}</mesh>

      {/* lengan */}
      {[-1, 1].map((d) => (
        <mesh key={d} position={[d * B.armX, B.armY, 0]} rotation={[0, 0, d * 0.14]} castShadow>
          <capsuleGeometry args={[B.armR, B.armLen, 8, 16]} />{s()}
        </mesh>
      ))}
      {/* tangan */}
      {[-1, 1].map((d) => (
        <mesh key={d} position={[d * (B.armX + 0.03), B.handY, 0]}><sphereGeometry args={[0.052, 16, 16]} />{s()}</mesh>
      ))}

      {/* pinggul */}
      <mesh position={[0, B.hipY, 0]} castShadow><capsuleGeometry args={[B.hipR, 0.06, 8, 18]} />{s()}</mesh>

      {/* kaki */}
      {[-1, 1].map((d) => (
        <mesh key={d} position={[d * B.legX, B.legY, 0]} castShadow>
          <capsuleGeometry args={[B.legR, B.legLen, 8, 16]} />{s()}
        </mesh>
      ))}

      {/* kaki telanjang bila tak ada sepatu */}
      {!covered.feet && [-1, 1].map((d) => (
        <mesh key={d} position={[d * B.legX, B.footY, B.footZ]}><boxGeometry args={[0.11, 0.07, 0.2]} />{s()}</mesh>
      ))}
    </group>
  );
}
