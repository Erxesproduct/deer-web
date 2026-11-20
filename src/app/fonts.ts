import { Forum, Great_Vibes, Manrope } from "next/font/google";

/** Forum: art-deco capitals like the «WINTER DREAM» banner lettering, with Ө/Ү (checked in the font's cmap). */
export const forum = Forum({ subsets: ["latin", "cyrillic", "cyrillic-ext"], weight: "400", variable: "--font-forum", display: "swap" });
/** Manrope: clear text, with Ө/Ү. */
export const manrope = Manrope({ subsets: ["latin", "cyrillic", "cyrillic-ext"], weight: ["400", "500", "600", "700", "800"], variable: "--font-manrope", display: "swap" });
/** Great Vibes: Latin only (no Ө/Ү), for the logo's «Mongolia» and Latin collection names only. */
export const vibes = Great_Vibes({ subsets: ["latin"], weight: "400", variable: "--font-vibes", display: "swap" });
