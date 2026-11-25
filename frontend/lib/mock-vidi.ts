// lib/mock-vidi.ts

export const mockProducts = [
  {
    id: "prod_01",
    slug: "sac-camera-urban",
    name_fr: "Sac Camera Urban",
    name_ar: "حقيبة كاميرا حضرية",
    description_fr: "Un sac élégant et résistant pour vos déplacements quotidiens. Conçu avec des matériaux imperméables.",
    description_ar: "حقيبة أنيقة ومتينة لتنقلاتك اليومية. مصممة بمواد مقاومة للماء.",
    images: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=800&auto=format&fit=crop"
    ],
    option_types: [{ name: "color", label_fr: "Couleur", label_ar: "اللون" }],
    variants: [
      { id: "v_01_blk", options: { color: "Noir" }, price: 45000, stock_state: "in_stock", remaining: 10 },
      { id: "v_01_snd", options: { color: "Sable" }, price: 45000, stock_state: "low", remaining: 2 }
    ],
  },
  {
    id: "prod_02",
    slug: "casquette-vintage",
    name_fr: "Casquette Vintage",
    name_ar: "قبعة عتيقة",
    description_fr: "Une casquette intemporelle pour compléter votre style. Ajustable.",
    description_ar: "قبعة خالدة لتكمل مظهرك. قابلة للتعديل.",
    images: [
      "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=800&auto=format&fit=crop"
    ],
    option_types: [{ name: "size", label_fr: "Taille", label_ar: "الحجم" }],
    variants: [
      { id: "v_02_s", options: { size: "S/M" }, price: 25000, stock_state: "in_stock", remaining: 5 },
      { id: "v_02_l", options: { size: "L/XL" }, price: 27000, stock_state: "out_of_stock", remaining: 0 }
    ],
  },
];