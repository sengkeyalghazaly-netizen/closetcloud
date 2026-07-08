import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";

/* Figur avatar Ready Player Me (GLB rigged). useGLTF akan suspend saat memuat &
 * MELEMPAR error saat gagal (URL salah / offline / domain diblokir) → ditangkap
 * error boundary di atasnya → jatuh ke avatar prosedural. Idle: bob + sway halus
 * (tanpa aset animasi tambahan agar paling minim error). */
export function RPMFigure({ url }) {
  const { scene } = useGLTF(url);
  const cloned = useMemo(() => {
    const c = scene.clone(true);
    c.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; if (o.material) o.material.envMapIntensity = 0.8; } });
    return c;
  }, [scene]);

  const group = useRef();
  const t = useRef(0);
  useFrame((_, dt) => {
    t.current += dt;
    if (group.current) {
      group.current.position.y = Math.sin(t.current * 1.3) * 0.006;
      group.current.rotation.z = Math.sin(t.current * 0.7) * 0.008;
    }
  });

  // Avatar RPM full-body: tinggi ~1.8m, telapak kaki di y=0 → cocok dengan
  // target kamera (y~0.95). Skala 1.
  return <group ref={group}><primitive object={cloned} /></group>;
}
