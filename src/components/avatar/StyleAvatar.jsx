import { Component, Suspense, useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, ContactShadows } from "@react-three/drei";
import { BaseBody } from "./BaseBody";
import { Garment } from "./Garment";
import { RPMFigure } from "./RPMFigure";
import { outfitToProfiles } from "../../lib/avatar/renderProfile";
import { useQualityTier } from "../../hooks/useQualityTier";

/* Napas + sway halus (idle) untuk figur prosedural. */
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

function LookGroup({ profiles, skin, hair, quality }) {
  const ref = useRef();
  const s = useRef(0.9);
  useFrame(() => { if (ref.current) { s.current += (1 - s.current) * 0.16; ref.current.scale.setScalar(s.current); } });
  const covered = useMemo(() => { const c = {}; profiles.forEach((p) => { c[p.slot] = true; }); return c; }, [profiles]);
  return (
    <group ref={ref}>
      <BaseBody skin={skin} hair={hair} covered={covered} />
      {profiles.map((p, i) => <Garment key={p.slot + "-" + i} profile={p} quality={quality} />)}
    </group>
  );
}

/* Figur prosedural (dipakai langsung, atau sebagai fallback avatar RPM). */
function ProceduralFigure({ outfit, skin, hair, quality }) {
  const profiles = useMemo(() => outfitToProfiles(outfit), [outfit]);
  const lookKey = useMemo(() => profiles.map((p) => p.key).join("|"), [profiles]);
  return <IdleGroup><LookGroup key={lookKey} profiles={profiles} skin={skin} hair={hair} quality={quality} /></IdleGroup>;
}

/* Boundary khusus kegagalan load GLB RPM → render fallback (figur prosedural). */
class GltfBoundary extends Component {
  constructor(p) { super(p); this.state = { failed: false }; }
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(e) { /* eslint-disable-next-line no-console */ console.warn("RPM avatar gagal, pakai fallback prosedural:", e?.message); }
  render() { return this.state.failed ? this.props.fallback : this.props.children; }
}

function Scene({ outfit, skin, hair, tier, avatarUrl, controlsRef }) {
  const procedural = <ProceduralFigure outfit={outfit} skin={skin} hair={hair} quality={tier} />;
  return (
    <>
      {/* studio 3-point (bukan ambient datar) untuk kesan premium */}
      <hemisphereLight args={["#ffffff", "#d7dcec", 0.55]} />
      <ambientLight intensity={0.22} />
      <directionalLight position={[3, 6, 4]} intensity={1.35} castShadow={tier !== "low"} shadow-mapSize={[1024, 1024]} shadow-bias={-0.0004} />
      <directionalLight position={[-4, 2, 2]} intensity={0.5} color="#E7EAF6" />
      <directionalLight position={[0, 3, -5]} intensity={0.75} color="#C9B8E8" />
      {avatarUrl ? (
        <GltfBoundary fallback={procedural}>
          <Suspense fallback={null}><RPMFigure url={avatarUrl} /></Suspense>
        </GltfBoundary>
      ) : procedural}
      {tier !== "low" && <ContactShadows position={[0, 0.01, 0]} opacity={0.42} scale={4} blur={2.6} far={2} color="#1B1F3B" />}
      <OrbitControls ref={controlsRef} makeDefault enablePan={false} enableZoom minDistance={2.0} maxDistance={4.4}
        autoRotate autoRotateSpeed={1.3} enableDamping dampingFactor={0.08}
        minPolarAngle={Math.PI * 0.36} maxPolarAngle={Math.PI * 0.58} target={[0, 0.95, 0]} />
    </>
  );
}

/* Boundary katastrofik: WebGL gagal total → panel fallback (bukan kanvas kosong). */
class AvatarBoundary extends Component {
  constructor(p) { super(p); this.state = { failed: false }; }
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(e) { /* eslint-disable-next-line no-console */ console.warn("Avatar 3D fallback:", e?.message); }
  render() { return this.state.failed ? this.props.fallback : this.props.children; }
}

export function StyleAvatar({ outfit, avatarUrl, bodyConfig, quality = "auto", height = 320 }) {
  const tier = useQualityTier(quality);
  const controlsRef = useRef();
  const skin = bodyConfig?.skin || "#E8C6A2";
  const hair = bodyConfig?.hair || "#3B2A24";

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
          <Scene outfit={outfit} skin={skin} hair={hair} tier={tier} avatarUrl={avatarUrl} controlsRef={controlsRef} />
        </Canvas>
      </AvatarBoundary>
    </div>
  );
}
