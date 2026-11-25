"use client";

import Link from "next/link";
import Image from "next/image";
import { use, useState } from "react";
import { t, type Lang } from "@/lib/i18n";
import { mockProducts } from "@/lib/mock-vidi";

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const resolvedParams = use(params);
  const lang = resolvedParams.lang as Lang;
  const slug = resolvedParams.slug;

  const product = mockProducts.find((p) => p.slug === slug);

  // State to track the currently selected options (e.g., { color: "Noir" })
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(
    product?.variants[0]?.options || {}
  );

  const [activeImage, setActiveImage] = useState(0);

  if (!product) {
    return (
      <div style={{ padding: "10rem 5%", textAlign: "center" }}>
        <h1>Product not found</h1>
        <Link href={`/${lang}/vidi`} className="btn-primary">Back to Shop</Link>
      </div>
    );
  }

  const name = lang === "fr" ? product.name_fr : product.name_ar;
  const description = lang === "fr" ? product.description_fr : product.description_ar;

  // Find the variant that matches the currently selected options
    const currentVariant = product.variants.find((v) =>
    Object.entries(selectedOptions).every(([key, value]) => 
      // Tell TypeScript to treat options as a generic key-value object
      (v.options as Record<string, string>)[key] === value
    )
  );

  const formatPrice = (millimes: number) => {
    return new Intl.NumberFormat(lang === "fr" ? "fr-TN" : "ar-TN", {
      style: "currency", currency: "TND", minimumFractionDigits: 3,
    }).format(millimes / 1000);
  };

  const handleOptionChange = (optionName: string, value: string) => {
    setSelectedOptions((prev) => ({ ...prev, [optionName]: value }));
  };

  return (
    <div style={{ padding: "8rem 5% 4rem", background: "#fff", minHeight: "100vh" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "4rem", maxWidth: "1200px", margin: "0 auto" }}>
        
        {/* Left Side: Images */}
        <div>
          <div style={{ position: "relative", aspectRatio: "4/5", borderRadius: "8px", overflow: "hidden", background: "#f5f5f5", marginBottom: "1rem" }}>
            <Image src={product.images[activeImage]} alt={name} fill style={{ objectFit: "cover" }} />
          </div>
          {/* Thumbnails */}
          <div style={{ display: "flex", gap: "1rem" }}>
            {product.images.map((img, idx) => (
              <button key={idx} onClick={() => setActiveImage(idx)} style={{ position: "relative", width: "80px", height: "80px", borderRadius: "4px", overflow: "hidden", border: activeImage === idx ? "2px solid #000" : "2px solid transparent", cursor: "pointer" }}>
                <Image src={img} alt="thumbnail" fill style={{ objectFit: "cover" }} />
              </button>
            ))}
          </div>
        </div>

        {/* Right Side: Info & Variants */}
        <div>
          <h1 style={{ fontSize: "2.5rem", fontWeight: 800, marginBottom: "0.5rem" }}>{name}</h1>
          <p style={{ fontSize: "1.5rem", fontWeight: 600, color: "#d40000", marginBottom: "2rem" }}>
            {currentVariant ? formatPrice(currentVariant.price) : "N/A"}
          </p>
          
          <p style={{ color: "#666", lineHeight: 1.6, marginBottom: "2rem" }}>{description}</p>

          {/* Variant Selectors */}
          <div style={{ marginBottom: "2rem" }}>
            {product.option_types.map((opt) => (
              <div key={opt.name} style={{ marginBottom: "1.5rem" }}>
                <h3 style={{ fontSize: "0.9rem", fontWeight: 700, textTransform: "uppercase", marginBottom: "0.5rem" }}>
                  {lang === "fr" ? opt.label_fr : opt.label_ar}
                </h3>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  {/* Get all unique values for this option across variants */}
                  {Array.from(new Set(product.variants.map((v) => (v.options as Record<string, string>)[opt.name]))).map((value) => {
                    const isSelected = selectedOptions[opt.name] === value;
                    return (
                      <button
                        key={value}
                        onClick={() => handleOptionChange(opt.name, value)}
                        style={{
                          padding: "0.75rem 1.5rem",
                          border: isSelected ? "2px solid #000" : "1px solid #ccc",
                          background: isSelected ? "#000" : "#fff",
                          color: isSelected ? "#fff" : "#000",
                          cursor: "pointer",
                          fontWeight: 600,
                          borderRadius: "4px",
                          transition: "all 0.2s ease"
                        }}
                      >
                        {value}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Stock Status */}
          {currentVariant && currentVariant.stock_state !== "in_stock" && (
            <p style={{ fontSize: "0.9rem", fontWeight: 700, color: currentVariant.stock_state === "out_of_stock" ? "#d40000" : "#e67e22", marginBottom: "1rem" }}>
              {currentVariant.stock_state === "out_of_stock" 
                ? t(lang, "outOfStock") 
                : t(lang, "onlyNLeft", { n: currentVariant.remaining })}
            </p>
          )}

          <button 
            disabled={!currentVariant || currentVariant.stock_state === "out_of_stock"}
            style={{ 
              width: "100%", padding: "1rem", background: "#000", color: "#fff", 
              fontSize: "1rem", fontWeight: 700, border: "none", borderRadius: "4px", 
              cursor: (!currentVariant || currentVariant.stock_state === "out_of_stock") ? "not-allowed" : "pointer",
              opacity: (!currentVariant || currentVariant.stock_state === "out_of_stock") ? 0.5 : 1
            }}
          >
            {t(lang, "addToCart")}
          </button>
        </div>
      </div>
    </div>
  );
}