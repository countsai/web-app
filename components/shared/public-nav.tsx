"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  LogOut, User, ChevronDown, Menu, X,
  GraduationCap, Briefcase, Building2, Brain, Code2,
  Rocket, Globe, BookOpen, ArrowUpRight, Zap,
  LayoutDashboard, Users, Shield,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

// ─── Mega menu definitions ────────────────────────────────────────────────────

const NAV_ITEMS = [
  {
    label: "Platform",
    href: "/",
    mega: {
      heading: "The Counts AI Platform",
      subheading: "Everything you need to build an AI career",
      cols: [
        {
          title: "For Individuals",
          items: [
            { icon: GraduationCap, label: "AI Programs",          href: "/training",        desc: "3-month structured AI engineering track" },
            { icon: Shield,         label: "Certifications",       href: "/training#certs",  desc: "Verified credentials from UK AI company" },
            { icon: Users,          label: "AI Jobs",              href: "/jobs",            desc: "Roles from companies hiring AI talent" },
            { icon: LayoutDashboard,label: "Career Dashboard",     href: "/dashboard",       desc: "Track progress, certs & job matches" },
          ],
        },
        {
          title: "For Businesses",
          items: [
            { icon: Brain,   label: "AI Engineering Teams",  href: "/for-businesses#workforce",  desc: "Remote AI engineers on demand" },
            { icon: Zap,     label: "AI Agent Development",  href: "/for-businesses#services",   desc: "Intelligent automation systems" },
            { icon: Rocket,  label: "AI SaaS Development",   href: "/for-businesses#services",   desc: "Production-ready AI platforms" },
            { icon: Globe,   label: "AI Consulting",         href: "/for-businesses#consulting", desc: "Strategy, roadmap & implementation" },
          ],
        },
      ],
    },
  },
  {
    label: "AI Programs",
    href: "/training",
    mega: {
      heading: "AI Engineering Programs",
      subheading: "A structured path from beginner to AI engineer",
      cols: [
        {
          title: "Curriculum",
          items: [
            { icon: BookOpen, label: "GenAI & Agentic AI",          href: "/training#month1", desc: "Month 1 — LLMs, agents, RAG, tool calling" },
            { icon: Code2,    label: "Forward Deployed Engineering", href: "/training#month2", desc: "Month 2 — Deploy AI into real businesses" },
            { icon: Rocket,   label: "Counts AI Internship",        href: "/training#month3", desc: "Month 3 — Remote experience, real projects" },
          ],
        },
        {
          title: "Get Started",
          items: [
            { icon: GraduationCap, label: "Program Overview",  href: "/training",        desc: "Full curriculum, outcomes & structure" },
            { icon: Shield,        label: "Certification",     href: "/training#certs",  desc: "GenAI, FDE & Internship certificates" },
            { icon: ArrowUpRight,  label: "Apply Now →",       href: "/training/apply",  desc: "Start your AI engineering journey" },
          ],
        },
      ],
    },
  },
  {
    label: "AI Jobs",
    href: "/jobs",
    simple: [
      { icon: Briefcase, label: "Browse AI Jobs",       href: "/jobs",             desc: "AI & engineering roles worldwide" },
      { icon: Users,     label: "Talent Pool",          href: "/jobs#talent-pool", desc: "Be discovered by hiring companies" },
      { icon: BookOpen,  label: "Resume Builder",       href: "/profile/edit",     desc: "AI-optimised career profile" },
      { icon: Brain,     label: "AI Resume Analyser",   href: "/career-scan",      desc: "Score & improve your CV" },
    ],
  },
  {
    label: "For Business",
    href: "/for-businesses",
    simple: [
      { icon: Users,   label: "Remote AI Workforce",         href: "/for-businesses#workforce",   desc: "Skilled AI engineers, no overhead" },
      { icon: Brain,   label: "AI Application Development",  href: "/for-businesses#services",    desc: "Build AI-powered products" },
      { icon: Zap,     label: "AI Agents",                   href: "/for-businesses#services",    desc: "Intelligent automation at scale" },
      { icon: Rocket,  label: "AI SaaS Development",         href: "/for-businesses#services",    desc: "Production-ready AI platforms" },
      { icon: Code2,   label: "AI Automation",               href: "/for-businesses#services",    desc: "Automate complex business workflows" },
      { icon: Globe,   label: "Talk to Counts AI →",         href: "/for-businesses#contact",     desc: "Start a conversation today" },
    ],
  },
] as const;

type NavItem = typeof NAV_ITEMS[number];

// ─── Component ────────────────────────────────────────────────────────────────

export function PublicNavbar({ active }: { active?: string }) {
  const router = useRouter();
  const [menuOpen, setMenuOpen]         = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const [loggedIn, setLoggedIn]         = useState(false);
  const [openKey, setOpenKey]           = useState<string | null>(null);
  const [scrolled, setScrolled]         = useState(false);
  const closeTimer                       = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setLoggedIn(!!session));
    const { data: listener } = supabase.auth.onAuthStateChange((_e, s) => setLoggedIn(!!s));
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      listener.subscription.unsubscribe();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setMenuOpen(false);
    router.push("/");
  };

  const openMenu  = (label: string) => { if (closeTimer.current) clearTimeout(closeTimer.current); setOpenKey(label); };
  const scheduleClose = () => { closeTimer.current = setTimeout(() => setOpenKey(null), 160); };

  const navBg = scrolled
    ? "bg-white/95 backdrop-blur-md shadow-sm"
    : "bg-white";

  return (
    <nav
      className={`sticky top-0 z-50 w-full transition-all duration-200 ${navBg}`}
      style={{ borderBottom: "1px solid #dbe9eb" }}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="cai-container flex items-center justify-between h-[68px]">

        {/* Logo */}
        <Link href="/" className="flex items-center shrink-0 mr-8" aria-label="Counts AI home">
          <Image src="/logo-light.png" alt="Counts AI" width={136} height={37} priority className="object-contain" />
        </Link>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center flex-1 gap-0.5">
          {NAV_ITEMS.map((item) => (
            <div
              key={item.label}
              className="relative"
              onMouseEnter={() => openMenu(item.label)}
              onMouseLeave={scheduleClose}
            >
              <Link
                href={item.href}
                className="flex items-center gap-1 px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors hover:bg-[#f4fafb]"
                style={{ color: active === item.label ? "var(--teal)" : "#2a4a52" }}
                aria-expanded={openKey === item.label}
                aria-haspopup={("mega" in item || "simple" in item) ? "true" : undefined}
              >
                {item.label}
                {("mega" in item || "simple" in item) && (
                  <ChevronDown
                    size={12}
                    strokeWidth={2.5}
                    className={`transition-transform duration-200 ${openKey === item.label ? "rotate-180" : ""}`}
                    style={{ color: "#85a0a4" }}
                  />
                )}
              </Link>

              {/* Mega dropdown */}
              {"mega" in item && openKey === item.label && (
                <MegaMenu item={item as NavItem & { mega: NonNullable<(typeof NAV_ITEMS[0])["mega"]> }} onClose={() => setOpenKey(null)} onMouseEnter={() => openMenu(item.label)} onMouseLeave={scheduleClose} />
              )}

              {/* Simple dropdown */}
              {"simple" in item && openKey === item.label && (
                <SimpleMenu items={[...item.simple]} onClose={() => setOpenKey(null)} onMouseEnter={() => openMenu(item.label)} onMouseLeave={scheduleClose} />
              )}
            </div>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden lg:flex items-center gap-2 ml-4">
          {loggedIn ? (
            <>
              <Link
                href="/dashboard"
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors hover:bg-[#f4fafb]"
                style={{ color: "#2a4a52" }}
              >
                <User size={14} />
                <span>Dashboard</span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors hover:bg-[#f4fafb]"
                style={{ color: "#2a4a52" }}
              >
                <LogOut size={13} />
                <span>Log out</span>
              </button>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors hover:bg-[#f4fafb]"
                style={{ color: "#2a4a52" }}
              >
                Sign in
              </Link>
              <Link
                href="/training/apply"
                className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold text-white transition-all hover:opacity-90 active:scale-95"
                style={{ background: "var(--teal)" }}
              >
                Get started
                <ArrowUpRight size={13} strokeWidth={2.5} />
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="lg:hidden flex items-center justify-center h-9 w-9 rounded-lg hover:bg-[#f4fafb] transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          {menuOpen
            ? <X size={20} style={{ color: "#2a4a52" }} />
            : <Menu size={20} style={{ color: "#2a4a52" }} />
          }
        </button>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <div
          className="lg:hidden border-t overflow-y-auto"
          style={{ borderColor: "#dbe9eb", background: "white", maxHeight: "calc(100vh - 68px)" }}
        >
          <div className="px-4 py-4 space-y-1">
            {NAV_ITEMS.map((item) => (
              <div key={item.label}>
                <button
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-colors hover:bg-[#f4fafb]"
                  style={{ color: "#0a2030" }}
                  onClick={() => setMobileExpanded(mobileExpanded === item.label ? null : item.label)}
                  aria-expanded={mobileExpanded === item.label}
                >
                  <span>{item.label}</span>
                  <ChevronDown
                    size={13}
                    className={`transition-transform duration-200 ${mobileExpanded === item.label ? "rotate-180" : ""}`}
                    style={{ color: "#85a0a4" }}
                  />
                </button>

                {mobileExpanded === item.label && (
                  <div className="ml-3 mt-1 mb-2 space-y-0.5">
                    {(("mega" in item
                      ? item.mega.cols.flatMap(c => [...c.items])
                      : "simple" in item ? [...item.simple] : []
                    ) as { icon: React.ComponentType<{size?: number; className?: string; style?: React.CSSProperties}>; label: string; href: string; desc: string }[]).map((sub) => (
                      <Link
                        key={sub.label}
                        href={sub.href}
                        onClick={() => setMenuOpen(false)}
                        className="flex items-start gap-3 px-4 py-3 rounded-xl hover:bg-[#f4fafb] transition-colors"
                      >
                        <sub.icon size={15} className="mt-0.5 shrink-0" style={{ color: "var(--teal)" }} />
                        <div>
                          <div className="text-sm font-semibold" style={{ color: "#0a2030" }}>{sub.label}</div>
                          <div className="text-xs mt-0.5" style={{ color: "#85a0a4" }}>{sub.desc}</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Mobile auth */}
            <div className="pt-3 mt-2 border-t space-y-2" style={{ borderColor: "#dbe9eb" }}>
              {loggedIn ? (
                <>
                  <Link
                    href="/dashboard"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 w-full px-4 py-3 rounded-xl text-sm font-semibold hover:bg-[#f4fafb]"
                    style={{ color: "#0a2030" }}
                  >
                    <LayoutDashboard size={15} /> Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-full text-sm font-bold text-white"
                    style={{ background: "var(--teal)" }}
                  >
                    <LogOut size={14} /> Log out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-center w-full px-4 py-3 rounded-xl text-sm font-semibold border hover:bg-[#f4fafb]"
                    style={{ color: "#0a2030", borderColor: "#dbe9eb" }}
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/training/apply"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-center gap-1.5 w-full px-4 py-3 rounded-full text-sm font-bold text-white"
                    style={{ background: "var(--teal)" }}
                  >
                    Get started <ArrowUpRight size={13} />
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

// ─── Mega menu panel ──────────────────────────────────────────────────────────

function MegaMenu({
  item,
  onClose,
  onMouseEnter,
  onMouseLeave,
}: {
  item: NavItem & { mega: NonNullable<(typeof NAV_ITEMS[0])["mega"]> };
  onClose: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}) {
  return (
    <div
      className="absolute top-full left-1/2 -translate-x-1/2 pt-2"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div
        className="rounded-2xl shadow-xl overflow-hidden"
        style={{
          background: "white",
          border: "1px solid #dbe9eb",
          width: "560px",
          boxShadow: "0 20px 60px rgba(10,32,48,0.12), 0 4px 16px rgba(10,32,48,0.06)",
        }}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b" style={{ borderColor: "#f0f7f9", background: "#f9fcfd" }}>
          <div className="text-xs font-bold uppercase tracking-widest mb-0.5" style={{ color: "var(--teal)" }}>
            {item.mega.heading}
          </div>
          <div className="text-sm" style={{ color: "#486870" }}>{item.mega.subheading}</div>
        </div>

        {/* Columns */}
        <div className="grid grid-cols-2 gap-0 p-4">
          {item.mega.cols.map((col) => (
            <div key={col.title} className="p-2">
              <div
                className="text-[10px] font-bold uppercase tracking-wider mb-2 px-2"
                style={{ color: "#85a0a4" }}
              >
                {col.title}
              </div>
              {col.items.map((sub) => (
                <Link
                  key={sub.label}
                  href={sub.href}
                  onClick={onClose}
                  className="flex items-start gap-3 px-3 py-2.5 rounded-xl hover:bg-[#f4fafb] transition-colors group"
                >
                  <div
                    className="flex items-center justify-center h-7 w-7 rounded-lg shrink-0 mt-0.5 transition-colors group-hover:bg-[var(--teal-surface)]"
                    style={{ background: "#eef6f7" }}
                  >
                    <sub.icon size={13} style={{ color: "var(--teal)" }} />
                  </div>
                  <div>
                    <div className="text-sm font-semibold leading-tight" style={{ color: "#0a2030" }}>{sub.label}</div>
                    <div className="text-xs mt-0.5 leading-snug" style={{ color: "#85a0a4" }}>{sub.desc}</div>
                  </div>
                </Link>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Simple dropdown ──────────────────────────────────────────────────────────

function SimpleMenu({
  items,
  onClose,
  onMouseEnter,
  onMouseLeave,
}: {
  items: { icon: React.ElementType; label: string; href: string; desc: string }[];
  onClose: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}) {
  return (
    <div
      className="absolute top-full left-0 pt-2"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div
        className="rounded-2xl overflow-hidden py-2"
        style={{
          background: "white",
          border: "1px solid #dbe9eb",
          width: "272px",
          boxShadow: "0 20px 60px rgba(10,32,48,0.12), 0 4px 16px rgba(10,32,48,0.06)",
        }}
      >
        {items.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            onClick={onClose}
            className="flex items-start gap-3 px-4 py-2.5 hover:bg-[#f4fafb] transition-colors group"
          >
            <div
              className="flex items-center justify-center h-7 w-7 rounded-lg shrink-0 mt-0.5 transition-colors group-hover:bg-[var(--teal-surface)]"
              style={{ background: "#eef6f7" }}
            >
              <item.icon size={13} style={{ color: "var(--teal)" }} />
            </div>
            <div>
              <div className="text-sm font-semibold leading-tight" style={{ color: "#0a2030" }}>{item.label}</div>
              <div className="text-xs mt-0.5" style={{ color: "#85a0a4" }}>{item.desc}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
