"use client";

import Link from "next/link";
import { use, useState, useEffect } from "react";
import { t, type Lang } from "@/lib/i18n";
import { mockProjects } from "@/lib/mock-vini";

export default function ProjectPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const resolvedParams = use(params);
  const lang = resolvedParams.lang as Lang;
  const slug = resolvedParams.slug;

  const project = mockProjects.find((p) => p.slug === slug);

  // State for the Image Lightbox
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (!project) {
    return (
      <div className="project-not-found" style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
        <h1>Project not found</h1>
      </div>
    );
  }

  const title = lang === "fr" ? project.title_fr : project.title_ar;
  const description = lang === "fr" ? project.description_fr : project.description_ar;

  return (
    <div className="project-detail-page">
      
      {/* HERO */}
      <div className="project-hero" style={{ backgroundImage: `url(${project.coverImage})` }}>
        <div className="project-hero-overlay">
          <h1 className="project-title">{title}</h1>
        </div>
      </div>

      <div className="project-content">
        
        {/* VIDEO PLAYER */}
        {project.video && (
          <div className="project-video-wrapper" style={{ width: "100%" }}>
            <iframe
              src={project.video.embed_url}
              title={title}
              frameBorder="0"
              allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
              allowFullScreen
            ></iframe>
          </div>
        )}

        {/* DESCRIPTION */}
        <div className="project-info" style={{ width: "100%" }}>
          <h2>{t(lang, "aboutProject")}</h2>
          <p>{description}</p>
        </div>

        {/* PHOTO GALLERY */}
        {project.photos && project.photos.length > 0 && (
          <div className="project-gallery" style={{ width: "100%" }}>
            <h3 className="gallery-title">{t(lang, "gallery")}</h3>
            <div className="gallery-grid">
              {project.photos.map((photo: any, index: number) => (
                <div 
                  key={index} 
                  className="gallery-item"
                  onClick={() => setSelectedImage(photo.url)} // Opens lightbox on click
                >
                  <img 
                    src={photo.url} 
                    alt={photo.alt || `${title} - image ${index + 1}`} 
                    width={photo.width}
                    height={photo.height}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <Link href={`/${lang}/vini`} className="btn-outline">
            ← {t(lang, "backToPortfolio")}
          </Link>
        </div>
      </div>

      {/* ===== LIGHTBOX MODAL ===== */}
      {selectedImage && (
        <div className="lightbox-overlay" onClick={() => setSelectedImage(null)}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close" onClick={() => setSelectedImage(null)}>✕</button>
            <img src={selectedImage} alt="Enlarged view" />
          </div>
        </div>
      )}

    </div>
  );
}