import { useState } from 'react';
import { Mail, Phone } from 'lucide-react';
import { MembershipModal } from '../components/MembershipModal';

export const ContactPage = () => {
  const [isMembershipModalOpen, setIsMembershipModalOpen] = useState(false);

  return (
    <section className="space-y-10 sm:space-y-12">
      <div className="rounded-[2rem] border border-black/10 bg-white p-5 shadow-[0_14px_42px_rgba(0,0,0,0.05)] sm:p-8 lg:p-10">
        <p className="text-xs uppercase tracking-[0.28em] text-black/55">Atencion personalizada</p>
        <h1 className="mt-3 text-3xl font-semibold uppercase tracking-[0.14em] text-black sm:text-4xl">
          Contacto y soporte
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-black/70 sm:text-base">
          Respondemos consultas de pedidos, envios, devoluciones y oportunidades de alianza comercial con una atencion rapida y directa.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.08fr_0.92fr] lg:gap-6">
        <div className="rounded-[1.8rem] border border-black/10 bg-white p-5 shadow-[0_12px_34px_rgba(0,0,0,0.05)] sm:p-7">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl font-semibold uppercase tracking-[0.16em] text-black sm:text-2xl">FAQ</h2>
            <span className="text-xs uppercase tracking-[0.22em] text-black/45">Respuestas rapidas</span>
          </div>

          <div className="mt-6 space-y-3 text-sm text-black/70">
            <div className="rounded-[1.1rem] border border-black/10 bg-white p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-red-600/40 hover:shadow-[0_8px_20px_rgba(0,0,0,0.06)]">
              <p className="font-semibold text-black">¿Cuánto tarda el envío?</p>
              <p className="mt-2">El tiempo estimado suele ser de 2 a 5 días hábiles.</p>
            </div>
            <div className="rounded-[1.1rem] border border-black/10 bg-white p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-red-600/40 hover:shadow-[0_8px_20px_rgba(0,0,0,0.06)]">
              <p className="font-semibold text-black">¿Puedo devolver una prenda?</p>
              <p className="mt-2">Sí, puedes solicitar devolución dentro de los 14 días posteriores a la entrega.</p>
            </div>
            <div className="rounded-[1.1rem] border border-black/10 bg-white p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-red-600/40 hover:shadow-[0_8px_20px_rgba(0,0,0,0.06)]">
              <p className="font-semibold text-black">¿Ofrecen asesoría personalizada?</p>
              <p className="mt-2">Claro, nuestro equipo puede ayudarte con recomendaciones de estilo.</p>
            </div>
          </div>
        </div>

        <div className="rounded-[1.8rem] border border-black/10 bg-white p-5 shadow-[0_12px_34px_rgba(0,0,0,0.05)] sm:p-7">
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTU1agQ0JWH1FRSXAzg8c0EJ0q-w1lNc4P3IQQRrLw5lj_lD3Zl020i5S7A&s=10" alt="Asistencia" className="h-56 w-full rounded-[1.25rem] object-cover sm:h-64" />
          <h2 className="mt-6 text-xl font-semibold uppercase tracking-[0.16em] text-black sm:text-2xl">Asistencia</h2>
          <p className="mt-4 text-sm leading-relaxed text-black/70">Estamos aquí para ayudarte con tu pedido, seguimiento y cualquier consulta relacionada con compras.</p>

          <div className="mt-6 space-y-3 rounded-[1.25rem] border border-black/10 bg-white p-4 sm:p-5">
            <a href="tel:+51929370461" className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-black/15 bg-white px-4 py-3 text-sm font-medium text-black transition-colors hover:border-red-600 hover:text-red-600 sm:justify-start">
              <Phone size={16} /> +51 929370461
            </a>
            <a href="mailto:contacto@uomocattivo.com" className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-black/15 bg-white px-4 py-3 text-sm font-medium text-black transition-colors hover:border-red-600 hover:text-red-600 sm:justify-start">
              <Mail size={16} /> contacto@uomocattivo.com
            </a>
            <p className="text-sm text-black/65">Atendemos consultas de pedidos, cambios, entregas y soporte general.</p>
          </div>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_1fr] lg:gap-6">
        <div className="relative overflow-hidden rounded-[1.8rem] border border-black/10 bg-white shadow-[0_12px_34px_rgba(0,0,0,0.05)]">
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTU1agQ0JWH1FRSXAzg8c0EJ0q-w1lNc4P3IQQRrLw5lj_lD3Zl020i5S7A&s=10" alt="Emprende con nosotros" className="h-64 w-full object-cover transition-transform duration-500 hover:scale-[1.03] sm:h-80 lg:h-full" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-black/10 to-transparent" />
        </div>

        <div className="rounded-[1.8rem] border border-black/10 bg-white p-5 shadow-[0_12px_34px_rgba(0,0,0,0.05)] sm:p-7">
          <h2 className="text-xl font-semibold uppercase tracking-[0.16em] text-black sm:text-2xl">Emprende con Nosotros</h2>
          <p className="mt-3 text-sm leading-relaxed text-black/70">Únete a nuestra comunidad de aliados, distribuidores y creadores de contenido.</p>

          <div className="mt-6 rounded-[1.3rem] border border-black/10 bg-white p-4 sm:p-5">
            <h3 className="text-lg font-semibold text-black">Formulario para Afiliados</h3>
            <div className="mt-4 space-y-3">
              <input className="w-full rounded-xl border border-black/15 bg-white px-4 py-3 text-sm text-black outline-none transition-colors focus:border-red-600" placeholder="Tu nombre" />
              <input className="w-full rounded-xl border border-black/15 bg-white px-4 py-3 text-sm text-black outline-none transition-colors focus:border-red-600" placeholder="Tu negocio o marca" />
              <button type="button" className="w-full rounded-xl border border-black bg-black px-5 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-white transition-colors duration-200 hover:border-red-600 hover:bg-red-600">
                Solicitar afiliación
              </button>
              <button
                type="button"
                onClick={() => setIsMembershipModalOpen(true)}
                className="w-full rounded-xl border border-black/20 bg-white px-5 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-black transition-colors duration-200 hover:border-red-600 hover:text-red-600"
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
