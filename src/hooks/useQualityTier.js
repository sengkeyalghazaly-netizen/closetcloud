import { useMemo } from "react";

/* Deteksi kasar kemampuan device → tier kualitas render avatar.
 * 'high' = motif + shadow + dpr 2; 'low' = solid, tanpa shadow, dpr 1. */
export function useQualityTier(override = "auto") {
  return useMemo(() => {
    if (override !== "auto") return override;
    if (typeof navigator === "undefined") return "high";
    const mem = navigator.deviceMemory || 4;          // GB (Chrome)
    const cores = navigator.hardwareConcurrency || 4;
    const mobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent || "");
    if (mem <= 3 || cores <= 4 && mobile) return "low";
    return "high";
  }, [override]);
}
