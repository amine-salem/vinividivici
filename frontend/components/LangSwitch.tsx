"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { type Lang } from "@/lib/i18n";

export function LangSwitch({ lang }: { lang: Lang }) {
  const pathname = usePathname();
  const switchLang: Lang = lang === "fr" ? "ar" : "fr";

  const segments = pathname.split("/");
  segments[1] = switchLang;
  const targetPath = segments.join("/") || `/${switchLang}`;

  return (
    <Link href={targetPath} className="lang-switch">
      {switchLang === "ar" ? "العربية" : "Français"}
    </Link>
  );
}