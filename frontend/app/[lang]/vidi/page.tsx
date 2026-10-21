import { t, type Lang } from "@/lib/i18n";

export default async function VidiPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const langTyped = lang as Lang;

  return (
    <div>
      <h1>{t(langTyped, "shop")}</h1>
      <p>{t(langTyped, "onlyNLeft", { n: 2 })}</p>
      <p>{t(langTyped, "priceFrom", { price: "45 000 DT" })}</p>
    </div>
  );
}