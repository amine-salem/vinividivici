"use client";

import Link from "next/link";
import { use, useState } from "react";
import { t, type Lang } from "@/lib/i18n";

export default function ViciPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const resolvedParams = use(params);
  const lang = resolvedParams.lang as Lang;
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    // In the future, this sends to the API. For now, it fakes success.
    setSubmitted(true);
  };

  return (
    <div className="vici-page">
      <div className="vici-glow" aria-hidden="true"></div>
      
      <div className="vici-content">
        <span className="vici-kicker">{t(lang, "viciKicker")}</span>
        
        <h1 className="vici-title">{t(lang, "viciTitle")}</h1>
        
        <p className="vici-teaser">{t(lang, "viciTeaser")}</p>

        <div className="vici-form-wrapper">
          {!submitted ? (
            <form onSubmit={handleSubmit} className="vici-form">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t(lang, "viciPlaceholder")}
                className="vici-input"
                required
              />
              <button type="submit" className="vici-button">
                {t(lang, "viciButton")} →
              </button>
            </form>
          ) : (
            <p className="vici-success">You are on the list. We will be in touch.</p>
          )}
        </div>

        <Link href={`/${lang}`} className="vici-back">
          {t(lang, "viciBack")}
        </Link>
      </div>
    </div>
  );
}