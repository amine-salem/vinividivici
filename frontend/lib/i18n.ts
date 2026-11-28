export const SUPPORTED_LANGS = ["fr", "ar"] as const;
export type Lang = (typeof SUPPORTED_LANGS)[number];

export const translations = {
  fr: {
    // Navigation
    home: "Accueil",
    vini: "VINI",
    vidi: "VIDI",
    vici: "VICI",
    cart: "Panier",

    // Homepage
    brandStatement: "Un studio. Une boutique. Un chapitre à venir.",
    viniTagline: "Studio audiovisuel et marketing",
    vidiTagline: "Boutique en ligne",
    viciTagline: "Le prochain chapitre",
    enterVini: "Entrer",
    enterVidi: "Entrer",
    enterVici: "Découvrir",

    homeHeroTitle1:"Studio créatif",
    homeHeroTitle2: "UN ESPACE", // FR
    homeHeroTitle3: "POUR LES",   // FR
    homeHeroTitle4: "CRÉATEURS",  // FR
    watchVideo: "REGARDER LA VIDÉO", // FR
    exploreStudio: "EXPLORER LE STUDIO", // FR
    ourServices: "NOS SERVICES", // FR

    // VINI
    services: "Services",
    portfolio: "Portfolio",
    inquiry: "Demande",
    sendInquiry: "Envoyer la demande",
    viniHeroKicker: "VINI — LE STUDIO",
    viniHeroTitle: "AUDIOVISUEL & MARKETING",
    viniHeroSubtitle: "Nous créons du contenu qui capte l'attention et raconte votre histoire.",
    viniHeroCta: "DÉMARRER UN PROJET",

    whatWeDo: "Ce que nous faisons",
    selectedWork: "Travail sélectionné",
    formSubtitle: "Parlez-nous de votre projet et nous vous recontacterons.",
    fullName: "Nom complet",
    phone: "Téléphone",
    emailOptional: "Email (facultatif)",
    serviceInterest: "Service souhaité",
    selectService: "Sélectionnez un service",
    message: "Message",
    messagePlaceholder: "Parlez-nous de votre projet...",

    aboutProject: "À propos de ce projet",
    gallery: "Galerie",
    backToPortfolio: "Retour au portfolio",

    // VIDI
    shop: "Boutique",
    addToCart: "Ajouter au panier",
    outOfStock: "Rupture de stock",
    onlyNLeft: "Plus que {n} en stock",
    priceFrom: "À partir de {price}",
    checkout: "Commander",
    deliveryFee: "Frais de livraison",
    subtotal: "Sous-total",
    total: "Total",
    confirmOrder: "Confirmer la commande — paiement à la livraison",

    // Checkout form
    governorate: "Gouvernorat",
    city: "Ville",
    address: "Adresse",
    note: "Note (facultatif)",

    // Order confirmed
    orderConfirmed: "Commande confirmée",
    orderNumber: "Numéro de commande",
    weWillCallYou: "Nous vous appellerons pour confirmer.",

    // VICI
    comingSoon: "Bientôt.",
    viciKicker: "LE PROCHAIN CHAPITRE",
    viciTitle: "VICI",
    viciTeaser: "Quelque chose se prépare. Nous ne sommes pas encore prêts à vous le montrer.",
    viciPlaceholder: "Entrez votre email pour un accès anticipé",
    viciButton: "Rejoindre la liste",
    viciBack: "Retour au studio",

    // Errors and states
    loading: "Chargement…",
    error: "Une erreur est survenue.",
    pageNotFound: "Page introuvable",
    tooManyAttempts: "Trop de tentatives, veuillez patienter une minute.",
    backToHome: "Retour à l'accueil",
    heroLabel: "Studio créatif — Tunis",

    //clients 
    clientsLabel: "Clients",
    clientsSubtitle: "Ils nous font confiance",

    //video
    aboutLabel: "À propos",
    aboutHeading: "Le studio derrière le son et l'image.",
    aboutParagraph:
      "Nous créons du contenu audiovisuel et accompagnons les marques tunisiennes dans leur communication. Vidéo, photo, stratégie — un studio, une vision.",

  },
  ar: {
    // Navigation
    home: "الرئيسية",
    vini: "VINI",
    vidi: "VIDI",
    vici: "VICI",
    cart: "السلة",
    
    // Homepage
    brandStatement: "استوديو. متجر. فصل قادم.",
    viniTagline: "استوديو سمعي بصري وتسويق",
    vidiTagline: "متجر إلكتروني",
    viciTagline: "الفصل القادم",
    enterVini: "ادخل",
    enterVidi: "ادخل",
    enterVici: "اكتشف",
    heroLabel: "استوديو إبداعي — تونس",

    homeHeroTitle1: "استوديو إبداعي",
    homeHeroTitle2: "مساحة", // AR
    homeHeroTitle3: "", // AR
    homeHeroTitle4: "للمبدعين", // AR
    watchVideo: "شاهد الفيديو", // AR
    exploreStudio: "استكشف الاستوديو", // AR
    ourServices: "خدماتنا", // AR
    

    // VINI
    services: "الخدمات",
    portfolio: "الأعمال",
    inquiry: "طلب",
    sendInquiry: "إرسال الطلب",
    viniHeroKicker: "VINI — الاستوديو",
    viniHeroTitle: "سمعي بصري وتسويق",
    viniHeroSubtitle: "نصنع محتوى يجذب الانتباه ويروي قصتك.",
    viniHeroCta: "ابدأ مشروعاً",

    whatWeDo: "ما نقوم به",
    selectedWork: "أعمال مختارة",
    formSubtitle: "أخبرنا عن مشروعك وسنعاود الاتصال بك.",
    fullName: "الاسم الكامل",
    phone: "الهاتف",
    emailOptional: "البريد الإلكتروني (اختياري)",
    serviceInterest: "الخدمة المطلوبة",
    selectService: "اختر خدمة",
    message: "الرسالة",
    messagePlaceholder: "أخبرنا عن مشروعك...",

    aboutProject: "عن هذا المشروع",
    gallery: "معرض الصور",
    backToPortfolio: "العودة إلى الأعمال",

    // VIDI
    shop: "المتجر",
    addToCart: "أضف إلى السلة",
    outOfStock: "نفد المخزون",
    onlyNLeft: "بقي {n} فقط",
    priceFrom: "ابتداءً من {price}",
    checkout: "اطلب",
    deliveryFee: "رسوم التوصيل",
    subtotal: "المجموع الفرعي",
    total: "المجموع",
    confirmOrder: "تأكيد الطلب — الدفع عند الاستلام",

    // Checkout form
    governorate: "الولاية",
    city: "المدينة",
    address: "العنوان",
    note: "ملاحظة (اختياري)",

    // Order confirmed
    orderConfirmed: "تم تأكيد الطلب",
    orderNumber: "رقم الطلب",
    weWillCallYou: "سنتصل بك للتأكيد.",

    // VICI
    comingSoon: "قريباً.",
    viciKicker: "الفصل القادم",
    viciTitle: "VICI",
    viciTeaser: "شيء ما يُعد. لا نحن لسنا جاهزين لإظهاره لك.",
    viciPlaceholder: "أدخل بريدك الإلكتروني للوصول المبكر",
    viciButton: "انضم إلى القائمة",
    viciBack: " العودة إلى الاستوديو",

    // Errors and states
    loading: "جارٍ التحميل…",
    error: "حدث خطأ.",
    pageNotFound: "الصفحة غير موجودة",
    tooManyAttempts: "محاولات كثيرة، يرجى الانتظار دقيقة.",
    backToHome: "العودة إلى الرئيسية",
    //clients
    clientsLabel: "عملائنا",
    clientsSubtitle: "يثقون بنا",
    //video
    aboutLabel: "من نحن",
    aboutHeading: "الاستوديو خلف الصوت والصورة.",
    aboutParagraph:
      "ننتج محتوى سمعياً بصرياً ونرافق العلامات التجارية التونسية في تواصلها. فيديو، تصوير، استراتيجية — استوديو، رؤية واحدة.",
  },
} as const;

export function t(
  lang: Lang,
  key: keyof (typeof translations)["fr"],
  vars?: Record<string, string | number>
): string {
  let text: string = translations[lang][key];

  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      text = text.replace(`{${k}}`, String(v));
    }
  }

  return text;
}