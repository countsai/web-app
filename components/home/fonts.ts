import { Newsreader, JetBrains_Mono, Fraunces, Plus_Jakarta_Sans } from "next/font/google";

export const serif = Newsreader({
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  variable: "--ch-serif",
  display: "swap",
});

export const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--ch-mono",
  display: "swap",
});

export const display = Fraunces({
  subsets: ["latin"],
  weight: ["500", "600"],
  style: ["normal", "italic"],
  variable: "--ch-display",
  display: "swap",
});

export const navFont = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--ch-nav",
  display: "swap",
});
