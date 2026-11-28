"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, use } from "react"; // <--- Import 'use'
import { t, type Lang } from "@/lib/i18n";
import { Clients } from "@/components/Clients";

export const dynamic = 'force-dynamic';

export default function LangHomePage({
  params,
}: {
  params: Promise<{ lang: string }>; // <--- Put Promise back!
}) {
  // Unwrap it using use()
  const resolvedParams = use(params); 
  const lang = resolvedParams.lang as Lang;
  
  const [videoOpen, setVideoOpen] = useState(false);
  return (
    <div className="home">
      {/* ===== HERO ===== */}
      <section className="home-hero">
        <div className="hero-content">
          <span className="hero-kicker">CREATIVE STUDIO</span>
          <h1 className="hero-title">
            A SPACE <br /> FOR <span className="text-red">CREATORS</span>
          </h1>
          <p className="hero-subtitle">VINI · VIDI · VICI</p>

          <div className="hero-actions">
            {/* Explore leads to Services (VINI) */}
            <Link href={`/${lang}/vini`} className="btn-primary">
              EXPLORE THE STUDIO →
            </Link>
            {/* Watch Video button */}
            <button 
              className="btn-video" 
              onClick={() => setVideoOpen(true)}
            >
              <span className="play-icon">▶</span> WATCH THE VIDEO
            </button>
          </div>
        </div>
      </section>

      {/* Video Modal */}
      {videoOpen && (
        <div className="video-modal" onClick={() => setVideoOpen(false)}>
          <div className="video-content" onClick={(e) => e.stopPropagation()}>
            <video src="/studio.mp4" controls autoPlay className="modal-video" />
            <button className="close-video" onClick={() => setVideoOpen(false)}>✕</button>
          </div>
        </div>
      )}

      {/* ===== PILLARS (Our Services) ===== */}
      <section className="home-pillars">
        <div className="section-header">
          <h2 className="section-title">OUR SERVICES</h2>
        </div>
        
        <div className="pillars-grid">
          <Pillar
            href={`/${lang}/vini`}
            title="VINI"
            tagline={t(lang, "viniTagline")}
            image="/pillars/vini1.jpeg"
          />
          <Pillar
            href={`/${lang}/vidi`}
            title="VIDI"
            tagline={t(lang, "vidiTagline")}
            image="/pillars/vidi.jpeg"
          />
          <Pillar
            href={`/${lang}/vici`}
            title="VICI"
            tagline={t(lang, "viciTagline")}
            image="/pillars/vici.jpeg"
          />
        </div>
      </section>

      <Clients lang={lang} />
    </div>
  );
}

function Pillar({
  href,
  title,
  tagline,
  image,
}: {
  href: string;
  title: string;
  tagline: string;
  image: string;
}) {
  return (
    <Link href={href} className="service-card">
      <div className="service-image">
        <Image src={image} alt={title} fill sizes="(min-width: 768px) 25vw, 100vw" className="service-img" />
      </div>
      <div className="service-body">
        <h3 className="service-title">{title}</h3>
        <p className="service-tagline">{tagline}</p>
        <div className="service-arrow">→</div>
      </div>
    </Link>
  );
}