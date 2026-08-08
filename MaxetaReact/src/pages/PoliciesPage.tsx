import { TypewriterTitle } from '../components/TypewriterTitle';

export const PoliciesPage = () => {

  return (
    <section className="space-y-8 rounded-[2rem] border border-black/10 bg-white p-6 shadow-sm sm:p-8">
      <header className="space-y-3">
        <p className="text-sm uppercase tracking-[0.3em] text-black/60">Legal</p>
        <TypewriterTitle as="h1" text="Politicas de Privacidad" className="text-3xl font-semibold uppercase tracking-[0.2em] text-black" />
        <p className="max-w-3xl text-sm leading-relaxed text-black/70 sm:text-base">
          En EZZETA nos comprometemos a proteger la informacion personal de nuestros clientes y visitantes.
          Esta politica describe como recopilamos, usamos, almacenamos y protegemos sus datos personales.
        </p>
      </header>

      <div className="grid gap-5 md:grid-cols-2">
        <article className="rounded-[1.25rem] border border-black/10 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold uppercase tracking-[0.12em] text-black">Tratamiento de datos</h2>
          <p className="mt-3 text-sm leading-relaxed text-black/70">
            Recopilamos datos de identificacion, contacto y compra para gestionar pedidos, coordinar entregas,
            emitir comprobantes, brindar soporte y mejorar la experiencia de compra.
          </p>
        </article>

        <article className="rounded-[1.25rem] border border-black/10 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold uppercase tracking-[0.12em] text-black">Cookies</h2>
          <p className="mt-3 text-sm leading-relaxed text-black/70">
            Utilizamos cookies tecnicas y de analitica para recordar preferencias, mantener sesiones activas y
            medir el rendimiento del sitio. Puede administrar su uso desde la configuracion de su navegador.
          </p>
        </article>

        <article className="rounded-[1.25rem] border border-black/10 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold uppercase tracking-[0.12em] text-black">Seguridad</h2>
          <p className="mt-3 text-sm leading-relaxed text-black/70">
            Aplicamos medidas administrativas, tecnicas y organizativas razonables para prevenir accesos no
            autorizados, alteracion, perdida o divulgacion indebida de informacion personal.
          </p>
        </article>

        <article className="rounded-[1.25rem] border border-black/10 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold uppercase tracking-[0.12em] text-black">Derechos del usuario</h2>
          <p className="mt-3 text-sm leading-relaxed text-black/70">
            El usuario puede solicitar acceso, actualizacion, rectificacion, oposicion o eliminacion de sus datos,
            de acuerdo con la normativa vigente. Tambien puede revocar el consentimiento para usos no esenciales.
          </p>
        </article>
      </div>

      <article className="rounded-[1.25rem] border border-black/10 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold uppercase tracking-[0.12em] text-black">Contacto</h2>
        <p className="mt-3 text-sm leading-relaxed text-black/70">
          Para consultas sobre privacidad y proteccion de datos, escribanos a
          {' '}
          <a className="font-medium text-black underline decoration-black/30 underline-offset-4" href="mailto:privacidad@ezzeta.com">
            privacidad@ezzeta.com
          </a>
          {' '}
          o comuniquese al +51 929 370 461.
        </p>
      </article>

      <p className="text-xs uppercase tracking-[0.15em] text-black/50">
        Ultima actualizacion: 29 de julio de 2026.
      </p>
    </section>
  );
};
