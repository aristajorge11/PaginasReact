import { useState } from 'react';
import { MembershipModal } from '../components/MembershipModal';
import { getContactContent } from '../services/contentService';

export const ContactPage = () => {
  const content = getContactContent();
  const [isMembershipModalOpen, setIsMembershipModalOpen] = useState(false);

  return (
    <section className="space-y-8">
      <div className="rounded-[1.5rem] sm:rounded-[2rem] border border-black/10 bg-white p-5 sm:p-8 shadow-sm lg:p-10">
        <p className="text-sm uppercase tracking-[0.3em] text-black/60">Contacto</p>
        <h1 className="mt-2 text-2xl sm:text-3xl font-semibold uppercase tracking-[0.12em] sm:tracking-[0.2em] text-black leading-tight">{content.title}</h1>
        <p className="mt-4 max-w-2xl text-sm sm:text-base leading-relaxed text-black/70">{content.description}</p>
      </div>

      <div className="grid gap-5 lg:gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[1.5rem] sm:rounded-[2rem] border border-black/10 bg-[#F7F3EC] p-5 sm:p-8 shadow-sm">
          <h2 className="text-xl sm:text-2xl font-semibold uppercase tracking-[0.15em] sm:tracking-[0.2em] text-black">FAQ</h2>
          <div className="mt-5 space-y-4 text-sm text-black/70">
            <div className="rounded-[1rem] border border-black/10 bg-white p-4 transition hover:-translate-y-1 hover:shadow-md">
              <p className="font-semibold text-black">¿Cuánto tarda el envío?</p>
              <p className="mt-2">El tiempo estimado suele ser de 2 a 5 días hábiles.</p>
            </div>
            <div className="rounded-[1rem] border border-black/10 bg-white p-4 transition hover:-translate-y-1 hover:shadow-md">
              <p className="font-semibold text-black">¿Puedo devolver una prenda?</p>
              <p className="mt-2">Sí, puedes solicitar devolución dentro de los 14 días posteriores a la entrega.</p>
            </div>
            <div className="rounded-[1rem] border border-black/10 bg-white p-4 transition hover:-translate-y-1 hover:shadow-md">
              <p className="font-semibold text-black">¿Ofrecen asesoría personalizada?</p>
              <p className="mt-2">Claro, nuestro equipo puede ayudarte con recomendaciones de estilo.</p>
            </div>
          </div>
        </div>

        <div className="rounded-[1.5rem] sm:rounded-[2rem] border border-black/10 bg-white p-5 sm:p-8 shadow-sm">
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTU1agQ0JWH1FRSXAzg8c0EJ0q-w1lNc4P3IQQRrLw5lj_lD3Zl020i5S7A&s=10" alt="Asistencia" className="h-52 sm:h-64 w-full rounded-[1.2rem] object-cover" />
          <h2 className="mt-6 text-xl sm:text-2xl font-semibold uppercase tracking-[0.15em] sm:tracking-[0.2em] text-black">Asistencia</h2>
          <p className="mt-4 text-sm text-black/70">Estamos aquí para ayudarte con tu pedido, seguimiento y cualquier consulta relacionada con compras.</p>

          <div className="mt-6 sm:mt-8 space-y-5">
            <div className="rounded-[1.25rem] sm:rounded-[1.5rem] border border-black/10 bg-[#F7F3EC] p-4 sm:p-5">
              <p className="text-center sm:text-left text-sm leading-relaxed text-black/70">Telf: +51 929370461 | Correo: contacto@uomocattivo.com</p>
            </div>

            <div className="rounded-[1.25rem] sm:rounded-[1.5rem] border border-black/10 bg-white p-4 sm:p-5">
              <h3 className="text-lg font-semibold text-black">¿Necesitas ayuda con un pedido?</h3>
              <p className="mt-2 text-sm text-black/70">Cuéntanos tu caso y te responderemos lo antes posible.</p>
              <form className="mt-4 space-y-3 sm:space-y-4">
                <input className="w-full rounded-full border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-red-600" placeholder="Nombre" />
                <input className="w-full rounded-full border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-red-600" placeholder="Correo electrónico" />
                <textarea className="min-h-28 w-full rounded-[1.2rem] border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-red-600 resize-none" placeholder="Describe tu pedido o consulta" />
                <button type="button" className="w-full sm:w-auto rounded-full bg-black px-5 py-3 text-sm font-medium text-white transition duration-300 hover:bg-red-600 hover:scale-105">
                  Enviar
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-5 lg:gap-6 lg:grid-cols-[1fr_1fr]">
        <div className="overflow-hidden rounded-[1.5rem] sm:rounded-[2rem] border border-black/10 bg-white shadow-sm">
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTU1agQ0JWH1FRSXAzg8c0EJ0q-w1lNc4P3IQQRrLw5lj_lD3Zl020i5S7A&s=10" alt="Emprende con nosotros" className="h-64 sm:h-80 lg:h-full w-full object-cover transition duration-500 hover:scale-105" />
        </div>

        <div className="rounded-[1.5rem] sm:rounded-[2rem] border border-black/10 bg-[#F7F3EC] p-5 sm:p-8 shadow-sm">
          <h2 className="text-xl sm:text-2xl font-semibold uppercase tracking-[0.15em] sm:tracking-[0.2em] text-black">Emprende con Nosotros</h2>
          <p className="mt-3 text-sm text-black/70">Únete a nuestra comunidad de aliados, distribuidores y creadores de contenido.</p>
          <div className="mt-6 rounded-[1.25rem] sm:rounded-[1.5rem] border border-black/10 bg-white p-4 sm:p-5">
            <h3 className="text-lg font-semibold text-black">Formulario para Afiliados</h3>
            <div className="mt-4 space-y-3">
              <input className="w-full rounded-full border border-black/10 bg-[#F7F3EC] px-4 py-3 text-sm outline-none transition focus:border-red-600" placeholder="Tu nombre" />
              <input className="w-full rounded-full border border-black/10 bg-[#F7F3EC] px-4 py-3 text-sm outline-none transition focus:border-red-600" placeholder="Tu negocio o marca" />
              <button type="button" className="w-full rounded-full bg-black px-5 py-3 text-sm font-medium text-white transition duration-300 hover:bg-red-600 hover:scale-[1.02]">
                Solicitar afiliación
              </button>
              <button
                type="button"
                onClick={() => setIsMembershipModalOpen(true)}
                className="w-full rounded-full bg-black px-5 py-3 text-sm font-medium text-white transition duration-300 hover:bg-red-600 hover:scale-[1.02]"
              >
                Benefíciate
              </button>
            </div>
          </div>
        </div>
      </div>

      <MembershipModal
        isOpen={isMembershipModalOpen}
        onClose={() => setIsMembershipModalOpen(false)}
      />
    </section>
  );
};
