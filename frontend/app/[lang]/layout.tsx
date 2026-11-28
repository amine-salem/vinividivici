import { notFound } from "next/navigation";
import { SUPPORTED_LANGS, type Lang } from "@/lib/i18n";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const RTL_LANGS = new Set(["ar", "fa", "he", "ur"]);

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  if (!SUPPORTED_LANGS.includes(lang as Lang)) {
    notFound();
  }

  const typedLang = lang as Lang;
  const dir = RTL_LANGS.has(typedLang) ? "rtl" : "ltr";

  return (
    <html lang={typedLang} dir={dir} suppressHydrationWarning>
      <body>
        <div  className="site-wrapper">
          <Header lang={typedLang} />
          <main className="site-main">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}