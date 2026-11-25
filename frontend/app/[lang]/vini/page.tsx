"use client";

import Link from "next/link";
import { use, useState } from "react";
import { t, type Lang } from "@/lib/i18n";
import { mockProjects, mockServices } from "@/lib/mock-vini";

// Fake services for now. Later, this will come from Amine's API.
  

export default function ViniPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const resolvedParams = use(params);
  const lang = resolvedParams.lang as Lang;
  
  const FAKE_SERVICES = [
    { value: "video", label: lang === "fr" ? "Production Vidéo" : "إنتاج فيديو" },
    { value: "photo", label: lang === "fr" ? "Photographie" : "تصوير" },
    { value: "marketing", label: lang === "fr" ? "Marketing & Stratégie" : "تسويق واستراتيجية" },
    { value: "social", label: lang === "fr" ? "Gestion des réseaux sociaux" : "إدارة وسائل التواصل" },
    { value: "branding", label: lang === "fr" ? "Branding & Identité visuelle" : "العلامة التجارية والهوية البصرية" },
  ];
  // State to hold the form data
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    service: "",
    message: "",
  });

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="vini-page">
      
      {/* ===== VINI HERO ===== */}
      <section className="vini-hero">
        <div className="vini-hero-content">
          <span className="vini-kicker">{t(lang, "viniHeroKicker")}</span>
          <h1 className="vini-title">{t(lang, "viniHeroTitle")}</h1>
          <p className="vini-subtitle">{t(lang, "viniHeroSubtitle")}</p>
          
          <div className="vini-actions">
            <Link href="#inquiry" className="btn-primary">
              {t(lang, "viniHeroCta")} →
            </Link>
          </div>
        </div>
      </section>

            {/* ===== VINI SERVICES ===== */}
      <section className="vini-services">
        <div className="section-header">
          <span className="vini-kicker">{t(lang, "services")}</span>
          <h2 className="portfolio-title">{t(lang, "whatWeDo")}</h2>
        </div>
        
        <div className="services-grid">
          {mockServices.map((service) => (
            <div key={service.id} className="service-card-vini">
              <h3>{lang === "fr" ? service.title_fr : service.title_ar}</h3>
              <p>{lang === "fr" ? service.description_fr : service.description_ar}</p>
            </div>
          ))}
        </div>
      </section>

            {/* ===== VINI PORTFOLIO ===== */}
      <section className="vini-portfolio">
        <div className="portfolio-header">
          <span className="vini-kicker">{t(lang, "portfolio")}</span>
          <h2 className="portfolio-title">{t(lang, "selectedWork")}</h2>
        </div>

        <div className="portfolio-grid">
          {mockProjects.map((project) => (
            <Link 
              href={`/${lang}/vini/projects/${project.slug}`} 
              key={project.id} 
              className="portfolio-card"
            >
              <div className="portfolio-image-wrapper">
                <img 
                  src={project.coverImage} // <--- CHANGED FROM project.image
                  alt={lang === "fr" ? project.title_fr : project.title_ar} 
                  className="portfolio-image" 
                />
                <div className="portfolio-overlay">
                  <span className="portfolio-type">
                    {lang === "fr" ? project.category_fr : project.category_ar}
                  </span>
                  <h3 className="portfolio-item-title">
                    {lang === "fr" ? project.title_fr : project.title_ar}
                  </h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      

      {/* ===== VINI INQUIRY FORM ===== */}
      <section id="inquiry" style={{ padding: "80px 5%", background: "#111", color: "#fff" }}>
        <div style={{ maxWidth: "600px", margin: "0 auto" }}>
          <h2 className="text-4xl font-bold text-center">
            {t(lang, "sendInquiry")}
          </h2>
          <p className="text-center text-gray-400 mt-4 mb-8">
            {t(lang, "formSubtitle")}
          </p>
          
          <form className="vini-form" onSubmit={(e) => e.preventDefault()}>
            {/* Name & Phone Row */}
            <div className="vini-form-row">
              <div className="vini-field">
                <label>{t(lang, "fullName")}</label>
                <input 
                  type="text" 
                  name="name" 
                  placeholder="John Doe" 
                  value={formData.name}
                  onChange={handleChange}
                  required 
                />
              </div>
              <div className="vini-field">
                <label>{t(lang, "phone")}</label>
                <input 
                  type="tel" 
                  name="phone" 
                  placeholder="+216 12 345 678" 
                  value={formData.phone}
                  onChange={handleChange}
                  required 
                />
              </div>
            </div>

            {/* Email & Service Row */}
            <div className="vini-form-row">
              <div className="vini-field">
                <label>{t(lang, "emailOptional")}</label>
                <input 
                  type="email" 
                  name="email" 
                  placeholder="john@example.com" 
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div className="vini-field">
                <label>{t(lang, "serviceInterest")}</label>
                <select 
                  name="service" 
                  value={formData.service} 
                  onChange={handleChange} 
                  required
                >
                  <option value="" disabled>{t(lang, "selectService")}</option>
                  {FAKE_SERVICES.map((service) => (
                    <option key={service.value} value={service.value}>
                      {service.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Message */}
            <div className="vini-field vini-field-full">
              <label>{t(lang, "message")}</label>
              <textarea 
                name="message" 
                rows={4} 
                placeholder={t(lang, "messagePlaceholder")} 
                value={formData.message}
                onChange={handleChange}
                required 
              />
            </div>

            <button type="submit" className="btn-primary" style={{ width: "100%", marginTop: "1rem" }}>
              {t(lang, "sendInquiry")} →
            </button>
          </form>
        </div>
      </section>

    </div>
  );
}