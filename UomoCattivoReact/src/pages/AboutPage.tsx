import { getAboutContent } from '../services/contentService';

export const AboutPage = () => {
  const content = getAboutContent();

  return (
    <section className="space-y-8">
      <div className="rounded-[1.5rem] sm:rounded-[2rem] border border-black/10 bg-white p-5 sm:p-8 shadow-sm lg:p-10">
        <p className="text-xs sm:text-sm uppercase tracking-[0.2em] sm:tracking-[0.3em] text-black/60">Nosotros</p>
        <h1 className="mt-3 text-2xl sm:text-3xl font-semibold uppercase tracking-[0.12em] sm:tracking-[0.2em] leading-tight text-black">{content.title}</h1>
        <p className="mt-4 max-w-3xl text-base sm:text-lg leading-relaxed text-black/70">{content.description}</p>
        <p className="mt-3 max-w-3xl text-sm sm:text-base leading-relaxed text-black/70">{content.intro}</p>
      </div>

      <div className="grid gap-5 lg:gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[1.5rem] sm:rounded-[2rem] border border-black/10 bg-[#F7F3EC] p-5 sm:p-8 shadow-sm">
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5Mt_PxjDeEwK5wMGCDVjjXL9dvXU33-WROS1LUneiRCsskkhM_jkTFQU&s=10" alt="Historia" className="h-56 sm:h-72 lg:h-80 w-full rounded-[1.2rem] object-cover transition duration-500 hover:scale-[1.02]" />
          <h2 className="mt-6 text-xl sm:text-2xl font-semibold uppercase tracking-[0.15em] sm:tracking-[0.2em] text-black">Historia</h2>
          <p className="mt-3 text-sm leading-relaxed text-black/70">
            UOMO CATTIVO nació para reunir elegancia, fuerza y una estética masculina que se adapta a la vida urbana con criterio.
          </p>
        </div>
        <div className="rounded-[1.5rem] sm:rounded-[2rem] border border-black/10 bg-white p-5 sm:p-8 shadow-sm">
          <img src="https://www.marketeroslatam.com/wp-content/uploads/2016/06/misionyvison-scaled.jpg" alt="Misión" className="h-56 sm:h-72 lg:h-80 w-full rounded-[1.2rem] object-cover transition duration-500 hover:scale-[1.02]" />
          <h2 className="mt-6 text-xl sm:text-2xl font-semibold uppercase tracking-[0.15em] sm:tracking-[0.2em] text-black">Misión</h2>
          <p className="mt-3 text-sm leading-relaxed text-black/70">
            Crear prendas que transmitan identidad, calidad y presencia con una propuesta moderna y atemporal.
          </p>
        </div>
      </div>

      <div className="grid gap-5 lg:gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[1.5rem] sm:rounded-[2rem] border border-black/10 bg-white p-5 sm:p-8 shadow-sm">
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRfc9Cbzzchu1QA4fvjGV994jcHtocsaQOSIcfHPwRQ6IOOcQTyV9mLBr75&s=10" alt="Visión" className="h-56 sm:h-72 lg:h-80 w-full rounded-[1.2rem] object-cover transition duration-500 hover:scale-[1.02]" />
          <h2 className="mt-6 text-xl sm:text-2xl font-semibold uppercase tracking-[0.15em] sm:tracking-[0.2em] text-black">Visión</h2>
          <p className="mt-3 text-sm leading-relaxed text-black/70">
            Ser una marca de referencia para quienes desean vestir con actitud, distinción y un lenguaje propio.
          </p>
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
            <div className="w-full aspect-video overflow-hidden rounded-[1rem] sm:rounded-[1.2rem] bg-[#F7F3EC]">
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
      </div>
    </section>
  );
};
