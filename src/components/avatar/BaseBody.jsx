import { B } from "./proportions";

/* Tubuh dasar stylized-realistis: kepala + rambut + mata, kulit halus, proporsi
 * manusiawi. Bagian yang tertutup garment tetap dirender (aman kalau slot kosong). */
export function BaseBody({ skin = "#E8C6A2", hair = "#3B2A24", covered = {} }) {
  const Skin = (p = {}) => <meshStandardMaterial color={skin} roughness={0.66} metalness={0} {...p} />;
  const Hair = () => <meshStandardMaterial color={hair} roughness={0.85} metalness={0} />;
  const Eye = () => <meshStandardMaterial color="#2B2B33" roughness={0.25} metalness={0} />;

  return (
    <group>
      {/* kepala */}
      <mesh position={[0, B.headY, 0]} castShadow><sphereGeometry args={[B.headR, 32, 32]} />{Skin()}</mesh>
      {/* rambut: cap atas + volume belakang (wajah tetap terbuka) */}
      <mesh position={[0, B.headY + 0.01, -0.006]} castShadow><sphereGeometry args={[B.headR + 0.014, 30, 30, 0, Math.PI * 2, 0, Math.PI * 0.72]} />{Hair()}</mesh>
      <mesh position={[0, B.headY - 0.028, -0.05]}><sphereGeometry args={[B.headR * 0.92, 22, 22]} />{Hair()}</mesh>
      {/* mata */}
      <mesh position={[-0.05, B.headY + 0.004, B.headR * 0.9]}><sphereGeometry args={[0.019, 16, 16]} />{Eye()}</mesh>
      <mesh position={[0.05, B.headY + 0.004, B.headR * 0.9]}><sphereGeometry args={[0.019, 16, 16]} />{Eye()}</mesh>

      {/* leher */}
      <mesh position={[0, B.neckY, 0]}><cylinderGeometry args={[B.neckR, B.neckR + 0.012, B.neckH, 18]} />{Skin()}</mesh>

      {/* torso + bahu (tertutup top/outer bila ada) */}
      <mesh position={[0, B.torsoY, 0]} castShadow><capsuleGeometry args={[B.torsoR, B.torsoLen, 12, 24]} />{Skin()}</mesh>
      <mesh position={[0, B.shoulderY, 0]} rotation={[0, 0, Math.PI / 2]} castShadow><capsuleGeometry args={[0.1, 0.3, 8, 16]} />{Skin()}</mesh>

      {/* lengan */}
      {[-1, 1].map((d) => (
        <mesh key={d} position={[d * B.armX, B.armY, 0]} rotation={[0, 0, d * 0.14]} castShadow>
          <capsuleGeometry args={[B.armR, B.armLen, 8, 16]} />{Skin()}
        </mesh>
      ))}
      {[-1, 1].map((d) => (
        <mesh key={d} position={[d * (B.armX + 0.03), B.handY, 0]}><sphereGeometry args={[0.052, 16, 16]} />{Skin()}</mesh>
      ))}

      {/* pinggul */}
      <mesh position={[0, B.hipY, 0]} castShadow><capsuleGeometry args={[B.hipR, 0.06, 8, 18]} />{Skin()}</mesh>

      {/* kaki */}
      {[-1, 1].map((d) => (
        <mesh key={d} position={[d * B.legX, B.legY, 0]} castShadow>
          <capsuleGeometry args={[B.legR, B.legLen, 8, 16]} />{Skin()}
        </mesh>
      ))}

      {/* telapak kaki telanjang bila tak ada sepatu */}
      {!covered.feet && [-1, 1].map((d) => (
        <mesh key={d} position={[d * B.legX, B.footY, B.footZ]}><boxGeometry args={[0.11, 0.07, 0.2]} />{Skin()}</mesh>
      ))}
    </group>
  );
}
