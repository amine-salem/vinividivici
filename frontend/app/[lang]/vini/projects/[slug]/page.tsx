"use client";

import Link from "next/link";
import { use } from "react";
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

  // Find the project that matches the URL slug
  const project = mockProjects.find((p) => p.slug === slug);

  // If the project doesn't exist, show a 404-style message
  if (!project) {
    return (
      <div className="project-not-found">
        <h1>Project not found</h1>
        <Link href={`/${lang}/vini`} className="btn-primary">
          Back to Studio
        </Link>
      </div>
    );
  }

  const title = lang === "fr" ? project.title_fr : project.title_ar;
  const category = lang === "fr" ? project.category_fr : project.category_ar;

  return (
    <div className="project-detail-page">
      {/* Hero Section */}
      <div className="project-hero" style={{ backgroundImage: `url(${project.image})` }}>
        <div className="project-hero-overlay">
          <span className="vini-kicker">{category}</span>
          <h1 className="project-title">{title}</h1>
        </div>
      </div>

      {/* Content Section */}
      <div className="project-content">
        <div className="project-video-wrapper">
          <iframe
            src={`https://player.vimeo.com/video/${project.videoUrl.split('/').pop()}`}
            title={title}
            frameBorder="0"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>

        <div className="project-info">
          <h2>About this project</h2>
          <p>
            We worked closely with the client to capture the essence of their brand. 
            This project focused on high-quality visuals and a compelling narrative that 
            resonates with their target audience.
          </p>
          <Link href={`/${lang}/vini`} className="btn-outline">
            ← Back to Portfolio
          </Link>
        </div>
      </div>
    </div>
  );
}