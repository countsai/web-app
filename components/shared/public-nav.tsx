import { HomeNav } from "@/components/home/home-nav";
import { serif, mono, display } from "@/components/home/fonts";
import "@/components/home/home.css";

/**
 * The site-wide navigation. This is the homepage navigation (components/home/home-nav.tsx),
 * wrapped in the homepage style scope so it renders identically on every page that uses <PublicNavbar />.
 * `display: contents` keeps the nav's sticky positioning relative to the page, not this wrapper.
 */
export function PublicNavbar({ active }: { active?: string }) {
  void active;
  return (
    <div className={`ch ${serif.variable} ${mono.variable} ${display.variable}`} style={{ display: "contents" }}>
      <HomeNav />
    </div>
  );
}
