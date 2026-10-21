export default async function ProjectPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;

  return (
    <div>
      <h1>Project: {slug}</h1>
      <p>Language: {lang}</p>
    </div>
  );
}