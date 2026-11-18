"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { t, type Lang } from "@/lib/i18n";
import { LangSwitch } from "./LangSwitch";

export function Header({ lang }: { lang: Lang }) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Check if we are on a dark page
  const isHome = pathname === `/${lang}`;
  const isVici = pathname?.includes(`/${lang}/vici`);
  const isVini = pathname?.includes(`/${lang}/vini`); 
  const isDarkPage = isHome || isVici || isVini;

  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <header className={`site-header ${isDarkPage ? "site-header--transparent" : ""}`}>
      <Link href={`/${lang}`} className="logo" onClick={closeMenu}>
        <span className="logo-text" suppressHydrationWarning>
          VINIVIDIVICI<span className="logo-tunisia">.Tunisia</span>
        </span>
      </Link>

      {/* Desktop Nav */}
      <nav className={`site-nav ${isMobileMenuOpen ? "is-open" : ""}`}>
        <Link href={`/${lang}/vini`} onClick={closeMenu}>{t(lang, "vini")}</Link>
        <Link href={`/${lang}/vidi`} onClick={closeMenu}>{t(lang, "vidi")}</Link>
        <Link href={`/${lang}/vici`} onClick={closeMenu}>{t(lang, "vici")}</Link>
      </nav>

      <div className="site-actions">
        <LangSwitch lang={lang} />
        
        <Link
          href={`/${lang}/vidi/cart`}
          className="cart-link"
          aria-label={t(lang, "cart")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 0 1-8 0" />
          </svg>
        </Link>

        {/* Mobile Hamburger Button */}
        <button 
          className="mobile-menu-btn" 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <div className={`hamburger ${isMobileMenuOpen ? "is-active" : ""}`}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>
      </div>
    </header>
  );
}