export default async function ProductPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;

  return (
    <div>
      <h1>Product: {slug}</h1>
      <p>Language: {lang}</p>
    </div>
  );
}