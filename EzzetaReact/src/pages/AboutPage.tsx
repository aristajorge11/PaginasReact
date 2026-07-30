import { getAboutContent } from '../services/contentService';

export const AboutPage = () => {
  const content = getAboutContent();

  return (
    <section className="space-y-8">
      <div className="relative overflow-hidden rounded-[1.5rem] sm:rounded-[2rem] border border-black/10 bg-black text-white shadow-sm">
        <img
          src="https://ezzetacompany.com/wp-content/uploads/2025/10/Pablo-Ezzeta-almacen.png"
          alt="Banner Nosotros"
          className="h-full w-full object-cover sm:h-80 lg:h-[28rem]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/35" />
        <div className="absolute inset-0 flex items-end p-5 sm:p-8 lg:p-10">
          <div className="max-w-3xl">
            <p className="text-xs sm:text-sm uppercase tracking-[0.2em] sm:tracking-[0.3em] text-white/75">Nosotros</p>
            <h1 className="mt-3 text-2xl sm:text-3xl font-semibold uppercase tracking-[0.12em] sm:tracking-[0.2em] leading-tight">{content.title}</h1>
            <p className="mt-4 text-sm sm:text-base leading-relaxed text-white/85">{content.description}</p>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-[1.25rem] sm:rounded-[1.5rem] border border-black/10 bg-white py-3 shadow-sm">
        <div className="marquee-track flex w-max gap-6 px-2 text-xs uppercase tracking-[0.2em] text-black/70 sm:text-sm sm:tracking-[0.25em]">
          {Array.from({ length: 12 }).map((_, index) => (
            <span key={index} className="rounded-full border border-black/10 px-4 py-2">
              EZZETA STYLE · CALIDAD · IDENTIDAD · LOGISTICA · INNOVACION
            </span>
          ))}
        </div>
      </div>

      <div className="grid gap-5 lg:gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="overflow-hidden rounded-[1.5rem] sm:rounded-[2rem] border border-black/10 bg-white p-3 sm:p-4 shadow-sm">
          <iframe width="560" height="315" src="https://www.youtube.com/embed/A-hXHl8iGF0?si=YbLiNpZ0OWvCgbvu" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
        </div>
        <div className="rounded-[1.5rem] sm:rounded-[2rem] border border-black/10 bg-white p-5 sm:p-8 shadow-sm">
          <p className="text-xs uppercase tracking-[0.2em] text-black/60">Ezzeta</p>
          <h2 className="mt-3 text-xl sm:text-2xl font-semibold uppercase tracking-[0.15em] sm:tracking-[0.2em] text-black">Identidad de Marca</h2>
          <p className="mt-3 text-sm leading-relaxed text-black/70">
            Diseñamos cada colección para ofrecer siluetas atemporales con energía urbana, materiales resistentes y acabados que elevan el uso diario.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-black/70">
            Nuestra operación conecta diseño, abastecimiento y distribución para responder con velocidad sin perder precisión en detalle.
          </p>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:gap-6 lg:grid-cols-3">
        <article className="rounded-[1.25rem] sm:rounded-[1.5rem] border border-black/10 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md">
          <h3 className="text-lg font-semibold uppercase tracking-[0.12em] text-black">Calidad Garantizada</h3>
          <p className="mt-3 text-sm text-black/70">Control de acabados y materiales en cada etapa para mantener estándares consistentes en toda la colección.</p>
        </article>
        <article className="rounded-[1.25rem] sm:rounded-[1.5rem] border border-black/10 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md">
          <h3 className="text-lg font-semibold uppercase tracking-[0.12em] text-black">Eficiencia Logística</h3>
          <p className="mt-3 text-sm text-black/70">Procesos coordinados para reducir tiempos de preparación, despacho y respuesta postventa.</p>
        </article>
        <article className="rounded-[1.25rem] sm:rounded-[1.5rem] border border-black/10 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md">
          <h3 className="text-lg font-semibold uppercase tracking-[0.12em] text-black">Innovación Continua</h3>
          <p className="mt-3 text-sm text-black/70">Evolucionamos diseños, rutas operativas y experiencia de compra con mejoras constantes.</p>
        </article>
      </div>

      <div className="rounded-[1.5rem] sm:rounded-[2rem] border border-black/10 bg-white p-5 sm:p-8 shadow-sm">
        <h2 className="text-xl sm:text-2xl font-semibold uppercase tracking-[0.15em] sm:tracking-[0.2em] text-black">Stock Permanente</h2>
        <p className="mt-3 text-sm leading-relaxed text-black/70">
          Mantenemos disponibilidad continua en líneas clave para responder de forma inmediata a campañas, reposiciones y picos de demanda.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <article className="rounded-[1.25rem] border border-black/10 bg-white p-4 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md">
            <h3 className="text-base font-semibold uppercase tracking-[0.12em] text-black">Almacén de prendas</h3>
            <p className="mt-2 text-sm text-black/70">Inventario organizado por categorías y tallas para preparación rápida y sin quiebres.</p>
          </article>
          <article className="rounded-[1.25rem] border border-black/10 bg-white p-4 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md">
            <h3 className="text-base font-semibold uppercase tracking-[0.12em] text-black">Despacho de pedidos</h3>
            <p className="mt-2 text-sm text-black/70">Flujo de picking y packing optimizado para asegurar entregas constantes y verificadas.</p>
          </article>
        </div>
      </div>

      <div className="rounded-[1.5rem] sm:rounded-[2rem] border border-black/10 bg-white p-5 sm:p-8 shadow-sm">
        <h2 className="text-xl sm:text-2xl font-semibold uppercase tracking-[0.15em] sm:tracking-[0.2em] text-black">Logística de Alto Rendimiento</h2>
        <p className="mt-3 text-sm leading-relaxed text-black/70">
          Integración de infraestructura, operación continua y monitoreo digital para sostener velocidad y trazabilidad en cada pedido.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <article className="rounded-[1.25rem] border border-black/10 bg-white p-4 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md">
            <h3 className="text-base font-semibold uppercase tracking-[0.12em] text-black">Centro de Distribución</h3>
            <p className="mt-2 text-sm text-black/70">Consolidación de inventario para salidas eficientes hacia múltiples zonas.</p>
          </article>
          <article className="rounded-[1.25rem] border border-black/10 bg-white p-4 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md">
            <h3 className="text-base font-semibold uppercase tracking-[0.12em] text-black">Servicio 24/7</h3>
            <p className="mt-2 text-sm text-black/70">Canales operativos activos para coordinación constante y respuesta oportuna.</p>
          </article>
          <article className="rounded-[1.25rem] border border-black/10 bg-white p-4 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md">
            <h3 className="text-base font-semibold uppercase tracking-[0.12em] text-black">Tecnología Integrada</h3>
            <p className="mt-2 text-sm text-black/70">Herramientas de seguimiento en tiempo real para mejorar control y exactitud.</p>
          </article>
        </div>
      </div>

      <div className="rounded-[1.5rem] sm:rounded-[2rem] border border-black/10 bg-white p-5 sm:p-8 shadow-sm">
        <h2 className="text-xl sm:text-2xl font-semibold uppercase tracking-[0.15em] sm:tracking-[0.2em] text-black">Nuestras instalaciones</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <img
            src="https://ezzetacompany.com/wp-content/uploads/2025/10/despacho.png"
            alt="Instalaciones 1"
            className="h-72 w-full rounded-[1.2rem] object-cover transition duration-500 hover:scale-[1.02]"
          />
          <img
            src="https://ezzetacompany.com/wp-content/uploads/2025/10/Almacen-Ezzeta.jpg"
            alt="Instalaciones 2"
            className="h-72 w-full rounded-[1.2rem] object-cover transition duration-500 hover:scale-[1.02]"
          />
          <img
            src="https://ezzetacompany.com/wp-content/uploads/2025/10/Envios-ezzeta.png"
            alt="Instalaciones 3"
            className="h-72 w-full rounded-[1.2rem] object-cover transition duration-500 hover:scale-[1.02]"
          />
        </div>
      </div>

      <div className="rounded-[1.5rem] sm:rounded-[2rem] border border-black/10 bg-white p-5 sm:p-8 shadow-sm">
        <div className="flex flex-col items-center text-center gap-5 sm:flex-row sm:items-center sm:text-left">
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRM3ygVIBF88SV9OENA5YjyOpGUnbqDqqrPZ3TRANXXEdR1l-vtlFUJRXto&s=10" alt="Pablo Ezzeta" className="h-24 w-24 sm:h-28 sm:w-28 shrink-0 rounded-full object-cover border-4 border-white shadow-md" />
          <div>
            <p className="text-xs sm:text-sm uppercase tracking-[0.2em] sm:tracking-[0.3em] text-black/60">Conoce a Pablo Ezzeta</p>
            <h2 className="mt-2 text-xl sm:text-2xl font-semibold uppercase tracking-[0.15em] sm:tracking-[0.2em] text-black">Pablo Ezzeta</h2>
            <p className="mt-2 text-sm text-black/70">
              Un referente de estilo que impulsa una visión clara y cercana del dressing masculino.
            </p>
          </div>
        </div>
        <div className="mt-6 overflow-hidden rounded-[1.25rem] sm:rounded-[1.5rem] border border-black/10 bg-white p-3 sm:p-4 shadow-sm">
          <div className="w-full aspect-video overflow-hidden rounded-[1rem] sm:rounded-[1.2rem] bg-white">
            <iframe
              src="https://www.youtube.com/embed/rzjMb3FN0Xs?rel=0&modestbranding=1"
              title="¿Cómo Convertir 30 polos en un Imperio Textil?"
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
          <p className="mt-4 text-center sm:text-left text-xs sm:text-sm uppercase tracking-[0.15em] sm:tracking-[0.2em] text-black/60">Fuente: YouTube</p>
        </div>
      </div>

      <style>
        {`@keyframes marqueeLeft { from { transform: translateX(0); } to { transform: translateX(-50%); } } .marquee-track { animation: marqueeLeft 26s linear infinite; }`}
      </style>
    </section>
  );
};
