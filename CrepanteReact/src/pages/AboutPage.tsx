import { getAboutContent } from '../services/contentService';
import { TypewriterTitle } from '../components/TypewriterTitle';
import {Check} from 'lucide-react';

export const AboutPage = () => {
  const content = getAboutContent();

  return (
    <section className="space-y-8">
      <div className="relative overflow-hidden rounded-[1.5rem] sm:rounded-[2rem] border border-black/10 bg-black text-white shadow-sm">
        <img
          src="https://ezzetacompany.com/wp-content/uploads/2025/10/Pablo-Ezzeta-almacen.png"
          alt="Banner Nosotros"
          className="w-full h-auto object-contain"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/35" />
        <div className="absolute inset-0 flex items-end p-5 sm:p-8 lg:p-10">
          <div className="max-w-3xl">
            <p className="text-xs sm:text-sm uppercase tracking-[0.2em] sm:tracking-[0.3em] text-white/75">Nosotros</p>
            <TypewriterTitle
              as="h1"
              text={content.title}
              className="mt-3 text-2xl sm:text-3xl font-semibold uppercase tracking-[0.12em] sm:tracking-[0.2em] leading-tight"
            />
            <p className="mt-4 text-sm sm:text-base leading-relaxed text-white/85">{content.description}</p>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-[1.25rem] sm:rounded-[1.5rem] border border-black/10 bg-white py-3 shadow-sm">
        <div className="marquee-track flex w-max gap-6 px-2 text-xs uppercase tracking-[0.2em] text-black/70 sm:text-sm sm:tracking-[0.25em]">
          {Array.from({ length: 12 }).map((_, index) => (
            <span key={index} className="rounded-full border border-black/10 px-4 py-2">
              CREPANTE STYLE · CALIDAD · IDENTIDAD · LOGISTICA · INNOVACION
            </span>
          ))}
        </div>
      </div>

      <div className="grid gap-5 lg:gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="overflow-hidden rounded-[1.5rem] sm:rounded-[2rem] border border-black/10 bg-white p-3 sm:p-4 shadow-sm">
          <iframe width="560" height="315" src="https://www.youtube.com/embed/A-hXHl8iGF0?si=YbLiNpZ0OWvCgbvu" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
        </div>
        <div className="rounded-[1.5rem] sm:rounded-[2rem] border border-black/10 bg-white p-5 sm:p-8 shadow-sm">
          <p className="text-xs uppercase tracking-[0.2em] text-black/60">CREPANTE</p>
          <TypewriterTitle as="h2" text="Identidad de Marca" className="mt-3 text-xl sm:text-2xl font-semibold uppercase tracking-[0.15em] sm:tracking-[0.2em] text-black" />
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
      
      //stock permanente
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <article className="group overflow-hidden border border-black/10 bg-white transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
          <div className="aspect-[16/10] overflow-hidden bg-zinc-100">
            <img
              src="https://ezzetacompany.com/wp-content/uploads/2025/10/DSC09794.jpg"
              alt="Almacén de prendas"
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
          </div>
          <div className="p-6">
            <p className="text-xs uppercase tracking-[0.35em] text-red-600">Stock Permanente</p>
            <h3 className="mt-2 text-2xl font-bold uppercase text-black">Almacén de prendas</h3>
            <p className="mt-4 leading-7 text-black/70">
              Inventario organizado por categorías y tallas para mantener disponibilidad inmediata,
              minimizar tiempos de preparación y responder rápidamente a la demanda.
            </p>
          </div>
        </article>

        <article className="group overflow-hidden border border-black/10 bg-white transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
          <div className="aspect-[16/10] overflow-hidden bg-zinc-100">
            <img
              src="https://ezzetacompany.com/wp-content/uploads/2025/10/DSC09799.jpg"
              alt="Despacho de pedidos"
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
          </div>
          <div className="p-6">
            <p className="text-xs uppercase tracking-[0.35em] text-red-600">Stock Permanente</p>
            <h3 className="mt-2 text-2xl font-bold uppercase text-black">Despacho de pedidos</h3>
            <p className="mt-4 leading-7 text-black/70">
              Nuestro proceso de picking, packing y despacho garantiza rapidez,
              control y trazabilidad desde el almacén hasta la entrega final.
            </p>
          </div>
        </article>
      </div>

      <div className="bg-black px-6 py-14 sm:px-10 sm:py-20 text-center text-white">
        <TypewriterTitle
          as="h2"
          text="Logística de Alto Rendimiento"
          className="text-3xl sm:text-4xl font-extrabold"
        />

        <p className="mx-auto mt-8 max-w-5xl text-sm sm:text-base leading-relaxed text-white/80">
          Para ser eficientes en los pedidos, contamos con un sistema de almacenaje y despacho de alto nivel,
          con procesos que permiten el control recurrente para una atención rápida.
        </p>

        <div className="mt-14 grid gap-12 lg:grid-cols-3">

          <article className="group">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 border-white transition-all duration-300 group-hover:border-red-600 group-hover:bg-red-600">
              <Check size={34} strokeWidth={3} />
            </div>
            <h3 className="mt-7 text-2xl font-bold">Centro de Distribución</h3>
            <p className="mx-auto mt-5 max-w-sm text-base leading-8 text-white/75">
              100% de pedidos despachados desde nuestro propio centro de distribución.
              Ubicación estratégica para entregas rápidas en Lima y provincias.
            </p>
          </article>

          <article className="group">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 border-white transition-all duration-300 group-hover:border-red-600 group-hover:bg-red-600">
              <Check size={34} strokeWidth={3} />
            </div>
            <h3 className="mt-7 text-2xl font-bold">Servicio 24/7</h3>
            <p className="mx-auto mt-5 max-w-sm text-base leading-8 text-white/75">
              Operación continua incluyendo domingos y feriados.
              Entregas programadas y cambios inmediatos según necesidad del cliente.
            </p>
          </article>

          <article className="group">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 border-white transition-all duration-300 group-hover:border-red-600 group-hover:bg-red-600">
              <Check size={34} strokeWidth={3} />
            </div>
            <h3 className="mt-7 text-2xl font-bold">Tecnología Integrada</h3>
            <p className="mx-auto mt-5 max-w-sm text-base leading-8 text-white/75">
              Nuestro ecommerce está conectado con plataformas como Bsale,
              WooCommerce y Data Studio, permitiendo gestionar operaciones,
              facturación y logística en tiempo real.
            </p>
          </article>

        </div>
      </div>

      <div className="rounded-[1.5rem] sm:rounded-[2rem] border border-black/10 bg-white p-5 sm:p-8 shadow-sm">
        <TypewriterTitle as="h2" text="Nuestras instalaciones" className="text-xl sm:text-2xl font-semibold uppercase tracking-[0.15em] sm:tracking-[0.2em] text-black" />
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
            <TypewriterTitle as="h2" text="Pablo Ezzeta" className="mt-2 text-xl sm:text-2xl font-semibold uppercase tracking-[0.15em] sm:tracking-[0.2em] text-black" />
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
