export type Client = {
  slug: string;
  name: string;
  category: { fr: string; ar: string };
  logo: string;
  url: string;
};

export const clients: Client[] = [
  {
    slug: "ecossais",
    name: "L'Écossais",
    category: { fr: "Salon de thé", ar: "صالون شاي" },
    logo: "/clients/ecossais.jpg",
    url: "https://www.instagram.com/ecossais_megrine",
  },
  {
    slug: "baklouti-hijema",
    name: "Baklouti Hijema",
    category: { fr: "Bien-être", ar: "عافية" },
    logo: "/clients/baklouti-hijema.jpg",
    url: "https://www.instagram.com/baklouti.hijema",
  },
  {
    slug: "megrine-textile",
    name: "Megrine Textile",
    category: { fr: "Textile", ar: "نسيج" },
    logo: "/clients/megrine-textile.png",
    url: "https://www.instagram.com/megrine_textile",
  },
];