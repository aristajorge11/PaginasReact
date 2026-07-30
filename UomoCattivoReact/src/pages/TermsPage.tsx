import { getTermsContent } from '../services/contentService';

export const TermsPage = () => {
  const terms = getTermsContent();

  return (
    <section className="space-y-6 rounded-[2rem] border border-black/10 bg-white p-8 shadow-sm">
      <p className="text-sm uppercase tracking-[0.3em] text-black/60">Términos</p>
      <h1 className="text-3xl font-semibold uppercase tracking-[0.2em] text-black">{terms.title}</h1>
      <p className="max-w-2xl text-black/70">{terms.description}</p>
      <div className="space-y-3 sm:space-y-4">
        {terms.sections.map((section) => (
          <article key={section.title} className="rounded-[1.25rem] border border-black/10 p-5">
            <h2 className="text-lg font-semibold text-black">{section.title}</h2>
            <p className="mt-2 text-sm text-black/70">{section.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
};
