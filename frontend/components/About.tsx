"use client";

import { useState } from "react";
import { t, type Lang } from "@/lib/i18n";

export function About({ lang }: { lang: Lang }) {
  const [playing, setPlaying] = useState(false);

  return (
    <section className="about">
      <div className="about-header">
        <span className="about-label">{t(lang, "aboutLabel")}</span>
      </div>

      <div className="about-video">
        {!playing && (
          <button
            type="button"
            className="about-video-poster"
            onClick={() => setPlaying(true)}
            aria-label="Play video"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/about-poster.jpg"
              alt="Studio VINIVIDIVICI"
              className="about-video-poster-img"
            />
            <span className="about-video-play" aria-hidden="true">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
          </button>
        )}

        {playing && (
          <div className="about-video-player">
            <video
              src="/about-video.mp4"
              controls
              autoPlay
              playsInline
              className="about-video-el"
            >
              Your browser does not support the video tag.
            </video>
          </div>
        )}
      </div>

      <div className="about-body">
        <h2 className="about-heading">{t(lang, "aboutHeading")}</h2>
        <p className="about-paragraph">{t(lang, "aboutParagraph")}</p>
      </div>
    </section>
  );
}