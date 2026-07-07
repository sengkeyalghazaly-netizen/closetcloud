import { COLORS_POOL, MATERIALS, PATTERNS, STYLE_TAGS } from "../data/reference";
import { randomFrom } from "./utils";

/* Simulasi hasil AI recognition. In production this is replaced by a real
 * vision model call (see roadmap) — the shape it returns stays identical, so
 * the Wardrobe Scan UI does not change. */
export function simulateAIRecognition(/* category */) {
  return {
    color: randomFrom(COLORS_POOL),
    material: randomFrom(MATERIALS),
    pattern: randomFrom(PATTERNS),
    style: randomFrom(STYLE_TAGS),
  };
}
