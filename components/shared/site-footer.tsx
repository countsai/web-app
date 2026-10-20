import { HomeFooter } from "@/components/home/home-footer";
import { serif, mono, display } from "@/components/home/fonts";
import "@/components/home/home.css";

/**
 * The site-wide footer. This is the homepage footer (components/home/home-footer.tsx) wrapped in the
 * homepage's scoped style root (.ch) so it renders identically on every page that uses <SiteFooter />.
 */
export function SiteFooter() {
  return (
    <div className={`ch ${serif.variable} ${mono.variable} ${display.variable}`}>
      <HomeFooter />
    </div>
  );
}
