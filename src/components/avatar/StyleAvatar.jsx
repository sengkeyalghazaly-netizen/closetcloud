import { Component, useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, ContactShadows } from "@react-three/drei";
import { BaseBody } from "./BaseBody";
import { Garment } from "./Garment";
import { outfitToProfiles } from "../../lib/avatar/renderProfile";
import { useQualityTier } from "../../hooks/useQualityTier";

/* Napas + sway halus pada seluruh figur (idle). */
function IdleGroup({ children }) {
  const ref = useRef();
  const t = useRef(0);
  useFrame((_, dt) => {
    t.current += dt;
    if (ref.current) {
      ref.current.position.y = Math.sin(t.current * 1.4) * 0.006;
      ref.current.rotation.z = Math.sin(t.current * 0.8) * 0.01;
    }
  });
  return <group ref={ref}>{children}</group>;
}

/* Kelompok garment untuk satu look; animasi "pop-in" saat look berganti. */
function LookGroup({ profiles, skin, quality }) {
  const ref = useRef();
  const s = useRef(0.9);
  useFrame(() => { if (ref.current) { s.current += (1 - s.current) * 0.16; ref.current.scale.setScalar(s.current); } });
  const covered = useMemo(() => { const c = {}; profiles.forEach((p) => { c[p.slot] = true; }); return c; }, [profiles]);
  return (
    <group ref={ref}>
      <BaseBody skin={skin} covered={covered} />
      {profiles.map((p, i) => <Garment key={p.slot + "-" + i} profile={p} quality={quality} />)}
    </group>
  );
}

function Scene({ outfit, skin, tier, controlsRef }) {
  const profiles = useMemo(() => outfitToProfiles(outfit), [outfit]);
  const lookKey = useMemo(() => profiles.map((p) => p.key).join("|"), [profiles]);
  return (
    <>
      <hemisphereLight args={["#ffffff", "#dfe3f0", 0.9]} />
      <ambientLight intensity={0.3} />
      <directionalLight position={[3, 6, 4]} intensity={1.15} castShadow={tier !== "low"} shadow-mapSize={[1024, 1024]} />
      <directionalLight position={[-4, 2, -3]} intensity={0.4} color="#C9B8E8" />
      <IdleGroup>
        <LookGroup key={lookKey} profiles={profiles} skin={skin} quality={tier} />
      </IdleGroup>
      {tier !== "low" && <ContactShadows position={[0, 0.01, 0]} opacity={0.4} scale={4} blur={2.6} far={2} color="#1B1F3B" />}
      <OrbitControls ref={controlsRef} makeDefault enablePan={false} enableZoom minDistance={2.2} maxDistance={4.2}
        autoRotate autoRotateSpeed={1.4} enableDamping dampingFactor={0.08}
        minPolarAngle={Math.PI * 0.4} maxPolarAngle={Math.PI * 0.58} target={[0, 0.95, 0]} />
    </>
  );
}

/* Error boundary: kalau WebGL gagal / konteks hilang → fallback rapi, tidak crash. */
class AvatarBoundary extends Component {
  constructor(p) { super(p); this.state = { failed: false }; }
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(e) { /* eslint-disable-next-line no-console */ console.warn("Avatar 3D fallback:", e?.message); }
  render() {
    if (this.state.failed) return this.props.fallback;
    return this.props.children;
  }
}

export function StyleAvatar({ outfit, bodyConfig, quality = "auto", height = 320 }) {
  const tier = useQualityTier(quality);
  const controlsRef = useRef();
  const skin = bodyConfig?.skin || "#E8C6A2";

  const fallback = (
    <div className="w-full h-full flex flex-col items-center justify-center" style={{ background: "linear-gradient(160deg,#EAFBF5,#F3EEFB)" }}>
      <div className="w-16 h-24 rounded-2xl" style={{ background: "linear-gradient(180deg,#7FD8BE,#C9B8E8)", opacity: 0.6 }} />
      <p className="text-xs mt-2" style={{ color: "#3A3F63" }}>Pratinjau 3D tidak tersedia di perangkat ini</p>
    </div>
  );

  return (
    <div style={{ width: "100%", height, touchAction: "none" }} onDoubleClick={() => controlsRef.current?.reset?.()}>
      <AvatarBoundary fallback={fallback}>
        <Canvas shadows={tier !== "low"} dpr={tier === "low" ? [1, 1] : [1, 1.8]} camera={{ position: [0, 1.15, 3.0], fov: 33 }} gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}>
          <Scene outfit={outfit} skin={skin} tier={tier} controlsRef={controlsRef} />
        </Canvas>
      </AvatarBoundary>
    </div>
  );
}
