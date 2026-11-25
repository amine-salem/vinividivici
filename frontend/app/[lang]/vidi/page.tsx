"use client";

import Link from "next/link";
import Image from "next/image";
import { use } from "react";
import { t, type Lang } from "@/lib/i18n";
import { mockProducts } from "@/lib/mock-vidi";

export default function VidiPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const resolvedParams = use(params);
  const lang = resolvedParams.lang as Lang;

  // Helper to format money (e.g., 45000 -> 45,000 DT)
  const formatPrice = (millimes: number) => {
    return new Intl.NumberFormat(lang === "fr" ? "fr-TN" : "ar-TN", {
      style: "currency",
      currency: "TND",
      minimumFractionDigits: 3,
    }).format(millimes / 1000);
  };

  return (
    <div className="vidi-page" style={{ background: "#0a0a0a", color: "#ffffff", minHeight: "100vh", padding: "8rem 5% 4rem" }}>
      
      <div className="shop-header" style={{ marginBottom: "3rem", textAlign: "center" }}>
        <h1 style={{ fontSize: "2.5rem", fontWeight: 800, textTransform: "uppercase", color: "#ffffff" }}>
          {t(lang, "shop")}
        </h1>
        <p style={{ color: "#a3a3a3", marginTop: "0.5rem" }}>
          Cash on delivery available everywhere in Tunisia.
        </p>
      </div>

      <div className="products-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "2rem" }}>
        {mockProducts.map((product) => {
          // Check the first variant's stock to show the badge on the card
          const isOutOfStock = product.variants[0].stock_state === "out_of_stock";
          const name = lang === "fr" ? product.name_fr : product.name_ar;

          return (
            <Link href={`/${lang}/vidi/products/${product.slug}`} key={product.id} className="product-card" style={{ display: "flex", flexDirection: "column", textDecoration: "none", color: "#ffffff" }}>
              
              {/* Image Container */}
              <div style={{ position: "relative", aspectRatio: "4/5", background: "#1a1a1a", borderRadius: "8px", overflow: "hidden", marginBottom: "1rem" }}>
                <Image 
                  src={product.images[0]} 
                  alt={name} 
                  fill 
                  sizes="(max-width: 768px) 100vw, 33vw"
                  style={{ objectFit: "cover", opacity: isOutOfStock ? 0.5 : 1 }} 
                />
                {isOutOfStock && (
                  <div style={{ position: "absolute", top: "1rem", left: "1rem", background: "#d40000", color: "#fff", padding: "0.25rem 0.75rem", fontSize: "0.75rem", fontWeight: "bold", textTransform: "uppercase" }}>
                    {t(lang, "outOfStock")}
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <h3 style={{ fontSize: "1.1rem", fontWeight: 600, margin: 0, color: "#ffffff" }}>{name}</h3>
                  <p style={{ color: "#a3a3a3", marginTop: "0.25rem", fontSize: "0.9rem" }}>
                    Accessories
                  </p>
                </div>
                <div style={{ fontWeight: 700, fontSize: "1.1rem", textAlign: "right", color: "#d40000" }}>
                  {formatPrice(product.variants[0].price)}
                </div>
              </div>
            </Link>
          );
        })}
      </div>

    </div>
  );
}