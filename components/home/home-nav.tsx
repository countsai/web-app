"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { navFont } from "./fonts";

// Destinations are existing routes only (same ones the site-wide nav already uses).
const LINKS = [
  { label: "Solutions",   href: "/for-businesses#services" },
  { label: "Training",    href: "/training" },
  { label: "Jobs",        href: "/jobs" },
  { label: "Resources",   href: "/help" },
];

export function Wordmark({ className, dark = false }: { className?: string; dark?: boolean }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img className={`brandlogo ${className ?? ""}`} src={dark ? "/logo.png" : "/logo-light.png"} alt="Counts AI" width={150} height={31} />
  );
}

export function HomeNav() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setLoggedIn(!!session));
    const { data: listener } = supabase.auth.onAuthStateChange((_e, s) => setLoggedIn(!!s));
    return () => listener.subscription.unsubscribe();
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    setOpen(false);
    router.push("/");
  };

  return (
    <header className={`nav ${navFont.variable}`}>
      <nav className="wrap nav-in" aria-label="Main navigation">
        <Link href="/" aria-label="Counts AI home">
          <Wordmark />
        </Link>

        <div className="nav-links">
          {LINKS.map((l) => (
            <Link key={l.label} href={l.href}>{l.label}</Link>
          ))}
        </div>

        <div className="nav-actions">
          {loggedIn ? (
            <>
              <Link href="/dashboard" className="nav-signin">Dashboard</Link>
              <button className="nav-signin" onClick={logout}>Log out</button>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="nav-signin">Sign in</Link>
              <Link href="/training/apply" className="btn btn-dark btn-sm hide-m">
                Get started <ArrowUpRight size={13} />
              </Link>
            </>
          )}
          <button
            className="burger"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      <div className={`mobile-menu ${open ? "open" : ""}`}>
        {LINKS.map((l) => (
          <Link key={l.label} href={l.href} onClick={() => setOpen(false)}>{l.label}</Link>
        ))}
        {loggedIn ? (
          <>
            <Link href="/dashboard" onClick={() => setOpen(false)}>Dashboard</Link>
            <button onClick={logout}>Log out</button>
          </>
        ) : (
          <>
            <Link href="/auth/login" onClick={() => setOpen(false)}>Sign in</Link>
            <Link href="/training/apply" onClick={() => setOpen(false)}>Get started</Link>
          </>
        )}
      </div>
    </header>
  );
}
