import { getPolicies } from '../services/contentService';

export const PoliciesPage = () => {
  const policies = getPolicies();

  return (
    <section className="space-y-6 rounded-[2rem] border border-black/10 bg-white p-8 shadow-sm">
      <p className="text-sm uppercase tracking-[0.3em] text-black/60">Políticas</p>
      <h1 className="text-3xl font-semibold uppercase tracking-[0.2em] text-black">Políticas de compra</h1>
      <div className="grid gap-6 md:grid-cols-3">
        {policies.map((policy) => (
          <article key={policy.title} className="rounded-[1.5rem] bg-[#F7F3EC] p-6">
            <h2 className="text-lg font-semibold text-black">{policy.title}</h2>
            <p className="mt-3 text-sm text-black/70">{policy.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
};
