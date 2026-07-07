import { useEffect } from "react";

/* ============ DESIGN TOKENS (ClosetCloud brand) ============
 * Single source of truth for the mint–lavender–navy palette.
 * Consumed everywhere via `T`; keep hex values here so a rebrand
 * is a one-file change. */
export const T = {
  mint: "#7FD8BE",
  mintSoft: "#A8E6CF",
  mintLight: "#EAFBF5",
  lavender: "#C9B8E8",
  lavenderDeep: "#8B6FCE",
  navy: "#1B1F3B",
  navySoft: "#3A3F63",
  bg: "#F7F8FC",
  sage: "#5FA88F",
  coral: "#E8917A",
  white: "#FFFFFF",
};

/* Display = Clash Display (Fontshare) — geometric, fashion-forward, memorable.
 * Body = Plus Jakarta Sans (humanist, very readable for Indonesian copy). */
export const fontDisplay = { fontFamily: "'Clash Display', 'Sora', sans-serif" };
export const fontBody = { fontFamily: "'Plus Jakarta Sans', sans-serif" };

/* Loads brand webfonts once (idempotent). */
export function useFonts() {
  useEffect(() => {
    const links = [
      { id: "cc-fonts-google", href: "https://fonts.googleapis.com/css2?family=Sora:wght@500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" },
      { id: "cc-fonts-clash", href: "https://api.fontshare.com/v2/css?f[]=clash-display@400,500,600,700&display=swap" },
    ];
    links.forEach(({ id, href }) => {
      if (document.getElementById(id)) return;
      const link = document.createElement("link");
      link.id = id;
      link.rel = "stylesheet";
      link.href = href;
      document.head.appendChild(link);
    });
  }, []);
}
