"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { t, type Lang } from "@/lib/i18n";
import { LangSwitch } from "./LangSwitch";

export function Header({ lang }: { lang: Lang }) {
  const pathname = usePathname();
  const isHome = pathname === `/${lang}`;
  const isVici = pathname === `/${lang}/vici`;
  const isDarkPage = isHome || isVici;

  return (
    <header className={`site-header ${isDarkPage ? "site-header--transparent" : ""}`}>
      <Link href={`/${lang}`} className="logo">
        <span className="logo-text">
          VINIVIDIVICI<span className="logo-tunisia">.Tunisia</span>
        </span>
      </Link>

      <nav className="site-nav">
        <Link href={`/${lang}/vini`}>{t(lang, "vini")}</Link>
        <Link href={`/${lang}/vidi`}>{t(lang, "vidi")}</Link>
        <Link href={`/${lang}/vici`}>{t(lang, "vici")}</Link>
      </nav>

      <div className="site-actions">
        <LangSwitch lang={lang} />
        {/* The Cart Icon stays exactly as it is */}
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
      </div>
    </header>
  );
}