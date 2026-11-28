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
    coverImage: "/pillars/vini1.jpeg", 
    description_fr: "Une session de podcast immersive capturée avec un éclairage cinématographique. Nous avons utilisé des micros de studio haut de gamme et un décor chaleureux pour créer une atmosphère intime.",
    description_ar: "جلسة بودكاست غامرة تم تصويرها بإضاءة سينمائية. استخدمنا ميكروفونات استوديو عالية الجودة وديكوراً دافئاً لخلق جو حميمي.",
    
    // 1. Video Data (from Amine's API)
    video: { 
      provider: "youtube", 
      embed_url: "https://www.youtube.com/embed/dQw4w9WgXcQ" // A real video for testing
    },
    
    // 2. Photos Data (from Amine's API)
    photos: [
      { url: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=1200&auto=format&fit=crop", alt: "Studio 1", width: 1200, height: 800 },
      { url: "https://images.unsplash.com/photo-1516280440502-863d590b338a?q=80&w=1200&auto=format&fit=crop", alt: "Studio 2", width: 1200, height: 800 },
      { url: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=1200&auto=format&fit=crop", alt: "Studio 3", width: 1200, height: 800 },
    ],
  },
  {
    id: "p_02",
    slug: "urban-brand-film",
    title_fr: "Urban Brand Film",
    title_ar: "فيلم العلامة التجارية الحضرية",
    category_fr: "Vidéo",
    category_ar: "فيديو",
    coverImage: "/pillars/vidi.jpeg",
    description_fr: "Un film de marque dynamique tourné dans les rues de Tunis.",
    description_ar: "فيلم علامة تجارية ديناميكي تم تصويره في شوارع تونس.",
    
    video: { 
      provider: "youtube", 
      embed_url: "https://www.youtube.com/embed/dQw4w9WgXcQ" 
    },
    photos: [
      { url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1200&auto=format&fit=crop", alt: "Urban 1", width: 1200, height: 800 },
      { url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&auto=format&fit=crop", alt: "Urban 2", width: 1200, height: 800 },
    ],
  },
];