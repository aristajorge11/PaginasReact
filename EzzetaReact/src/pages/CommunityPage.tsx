const socialLinks = [
  { name: 'Facebook', href: 'https://www.facebook.com' },
  { name: 'Instagram', href: 'https://www.instagram.com' },
  { name: 'TikTok', href: 'https://www.tiktok.com' },
  { name: 'YouTube', href: 'https://www.youtube.com' }
];

export const CommunityPage = () => {
  return (
    <section className="space-y-8 rounded-[2rem] border border-black/10 bg-white p-6 shadow-sm sm:p-8">
      <header className="space-y-3">
        <p className="text-sm uppercase tracking-[0.3em] text-black/60">Comunidad</p>
        <h1 className="text-3xl font-semibold uppercase tracking-[0.2em] text-black">Forma parte de la comunidad</h1>
        <p className="max-w-2xl text-sm leading-relaxed text-black/70 sm:text-base">
          Sigue nuestras novedades, lanzamientos y contenido en redes sociales oficiales.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        {socialLinks.map((social) => (
          <a
            key={social.name}
            href={social.href}
            target="_blank"
            rel="noreferrer"
            className="rounded-[1.25rem] border border-black/10 bg-white px-5 py-4 text-base font-medium text-black transition hover:-translate-y-1 hover:shadow-md"
          >
            {social.name}
          </a>
        ))}
      </div>

      <article className="rounded-[1.25rem] border border-black/10 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-black">Correo de contacto</h2>
        <p className="mt-3 text-sm text-black/70">
          Escríbenos a
          {' '}
          <a className="font-medium text-black underline decoration-black/30 underline-offset-4" href="mailto:comunidad@ezzeta.com">
            comunidad@ezzeta.com
          </a>
          {' '}
          para colaboraciones, prensa y alianzas.
        </p>
      </article>
    </section>
  );
};
