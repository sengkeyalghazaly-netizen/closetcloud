import { Canvas } from "@react-three/fiber";
import { OrbitControls, ContactShadows } from "@react-three/drei";

/* ============ 3D INTERACTIVE AVATAR ============
 * Avatar manusia 3D (Three.js) yang bisa diputar (orbit drag / auto-rotate).
 * Outfit dari lemari diproyeksikan ke tubuh: atasan/outerwear di torso & lengan,
 * bawahan di pinggul & kaki, sepatu di kaki, aksesori sebagai aksen. Dibangun
 * dari primitif (tanpa aset eksternal) supaya ringan & anti-gagal (offline-safe). */

const SKIN = "#E7CBA9";
const BASE = "#D9DEEA";

function Mat({ color, rough = 0.75 }) {
  return <meshStandardMaterial color={color} roughness={rough} metalness={0.04} />;
}

function Figure({ outfit }) {
  const top = outfit?.top?.color?.hex || BASE;
  const outer = outfit?.outer?.color?.hex || null;
  const bottom = outfit?.bottom?.color?.hex || "#3A3F63";
  const shoe = outfit?.shoe?.color?.hex || "#232323";
  const acc = outfit?.acc?.color?.hex || null;
  const upper = outer || top; // lapisan luar menutupi torso & lengan

  return (
    <group position={[0, -0.9, 0]}>
      {/* kepala + leher */}
      <mesh position={[0, 1.62, 0]} castShadow><sphereGeometry args={[0.17, 32, 32]} /><Mat color={SKIN} rough={0.6} /></mesh>
      <mesh position={[0, 1.44, 0]}><cylinderGeometry args={[0.06, 0.07, 0.12, 20]} /><Mat color={SKIN} rough={0.6} /></mesh>

      {/* torso (atasan / outer) */}
      <mesh position={[0, 1.08, 0]} castShadow><capsuleGeometry args={[0.24, 0.42, 10, 20]} /><Mat color={upper} /></mesh>
      {/* bahu */}
      <mesh position={[0, 1.30, 0]} rotation={[0, 0, Math.PI / 2]} castShadow><capsuleGeometry args={[0.12, 0.34, 8, 16]} /><Mat color={upper} /></mesh>
      {/* panel dalam (kaos di balik jaket terbuka) */}
      {outer && <mesh position={[0, 1.06, 0.19]}><boxGeometry args={[0.17, 0.4, 0.04]} /><Mat color={top} /></mesh>}

      {/* lengan */}
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * 0.30, 1.02, 0]} rotation={[0, 0, s * 0.16]} castShadow>
          <capsuleGeometry args={[0.072, 0.5, 8, 16]} /><Mat color={upper} />
        </mesh>
      ))}
      {/* tangan */}
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * 0.34, 0.74, 0]}><sphereGeometry args={[0.06, 16, 16]} /><Mat color={SKIN} rough={0.6} /></mesh>
      ))}

      {/* pinggul + kaki (bawahan) */}
      <mesh position={[0, 0.78, 0]} castShadow><capsuleGeometry args={[0.2, 0.1, 8, 18]} /><Mat color={bottom} /></mesh>
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * 0.11, 0.42, 0]} castShadow><capsuleGeometry args={[0.093, 0.5, 8, 16]} /><Mat color={bottom} /></mesh>
      ))}

      {/* sepatu */}
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * 0.11, 0.06, 0.05]} castShadow><boxGeometry args={[0.14, 0.1, 0.27]} /><Mat color={shoe} rough={0.5} /></mesh>
      ))}

      {/* aksesori (aksen di dada/leher) */}
      {acc && <mesh position={[0, 1.28, 0.05]}><torusGeometry args={[0.11, 0.022, 12, 32]} /><Mat color={acc} rough={0.4} /></mesh>}
    </group>
  );
}

export function Avatar3D({ outfit, height = 240 }) {
  return (
    <div style={{ width: "100%", height, touchAction: "none" }}>
      <Canvas shadows dpr={[1, 1.5]} camera={{ position: [0, 0.15, 3.15], fov: 34 }} gl={{ antialias: true, alpha: true }}>
        <hemisphereLight args={["#ffffff", "#cfd4e6", 0.85]} />
        <ambientLight intensity={0.35} />
        <directionalLight position={[3, 6, 4]} intensity={1.15} castShadow shadow-mapSize={[1024, 1024]} />
        <directionalLight position={[-4, 2, -3]} intensity={0.35} color="#C9B8E8" />
        <Figure outfit={outfit} />
        <ContactShadows position={[0, -0.86, 0]} opacity={0.42} scale={4} blur={2.6} far={2} color="#1B1F3B" />
        <OrbitControls makeDefault enablePan={false} enableZoom={false} autoRotate autoRotateSpeed={1.6}
          minPolarAngle={Math.PI * 0.42} maxPolarAngle={Math.PI * 0.58} target={[0, 0.05, 0]} />
      </Canvas>
    </div>
  );
}
