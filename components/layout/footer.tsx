import Link from "next/link";
import { APP_NAME, FOOTER_LINKS } from "@/lib/constants";
import { Zap } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-white pt-24 pb-8 overflow-hidden border-t border-gray-100">
      <div className="mx-auto w-full px-4 sm:px-6 lg:px-8">
        
        {/* Massive Text Logo */}
        <div className="flex justify-center w-full select-none mb-16">
          <h1 className="font-bold text-[#111111] leading-none tracking-[-0.06em]" style={{ fontSize: "clamp(60px, 15vw, 300px)" }}>
            CountsAI
          </h1>
        </div>

        {/* Footer Links Bottom Bar */}
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row border-t border-gray-100 pt-8">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-primary text-primary-foreground">
              <Zap size={14} fill="currentColor" />
            </div>
            <span className="text-sm font-bold tracking-tight text-gray-800">{APP_NAME}</span>
          </div>

          <nav className="flex flex-wrap justify-center gap-x-8 gap-y-4">
            {FOOTER_LINKS.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-xs font-medium text-gray-500 hover:text-gray-900 transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <p className="text-xs font-medium text-gray-400">
            &copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
