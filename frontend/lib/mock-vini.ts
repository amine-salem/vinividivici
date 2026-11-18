// lib/mock-vini.ts

export const mockServices = [
  {
    id: "s_01",
    title_fr: "Production Vidéo",
    title_ar: "إنتاج فيديو",
    description_fr: "Clips, publicités, et films de marque.",
    description_ar: "مقاطع فيديو، إعلانات، وأفلام العلامات التجارية.",
    icon: "video",
  },
  {
    id: "s_02",
    title_fr: "Podcast & Audio",
    title_ar: "بودكاست وصوتيات",
    description_fr: "Enregistrement, mixage et mastering studio.",
    description_ar: "تسجيل، مزج، وإتقان في الاستوديو.",
    icon: "audio",
  },
  {
    id: "s_03",
    title_fr: "Marketing Digital",
    title_ar: "تسويق رقمي",
    description_fr: "Stratégie, réseaux sociaux et campagnes.",
    description_ar: "استراتيجية، وسائل التواصل الاجتماعي، وحملات.",
    icon: "marketing",
  },
];

export const mockProjects = [
  {
    id: "p_01",
    slug: "good-vibes-session",
    title_fr: "Good Vibes Session",
    title_ar: "جلسة Good Vibes",
    category_fr: "Podcast",
    category_ar: "بودكاست",
    image: "/pillars/vini1.jpeg", // Reusing your pillar image for now
    videoUrl: "https://vimeo.com/123456", // Fake link
  },
  {
    id: "p_02",
    slug: "urban-brand-film",
    title_fr: "Urban Brand Film",
    title_ar: "فيلم العلامة التجارية الحضرية",
    category_fr: "Vidéo",
    category_ar: "فيديو",
    image: "/pillars/vidi.jpeg",
    videoUrl: "https://vimeo.com/123457",
  },
];