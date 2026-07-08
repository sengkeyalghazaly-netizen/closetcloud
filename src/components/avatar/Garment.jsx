import { useMemo, useEffect } from "react";
import { createGarmentMaterial } from "../../lib/avatar/garmentMaterial";
import { GARMENT, SLOT_FALLBACK } from "./GarmentMeshes";

/* Render satu garment dari RenderProfile: bikin material PBR (+motif), pilih
 * template mesh (fallback generik bila tak dikenal), buang material saat unmount. */
export function Garment({ profile, quality = "high" }) {
  const material = useMemo(() => createGarmentMaterial(profile, quality), [profile.key, profile.baseColorHex, profile.material, profile.pattern, quality]);
  useEffect(() => () => material.dispose(), [material]);
  const Comp = GARMENT[profile.template] || GARMENT[SLOT_FALLBACK[profile.slot]] || GARMENT.tshirt;
  return <Comp material={material} fit={profile.fit} />;
}
