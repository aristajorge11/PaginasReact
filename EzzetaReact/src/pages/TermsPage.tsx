const tocItems = [
  { id: 'requisitos-compra', label: '1. Requisitos para comprar' },
  { id: 'compra-comprobantes', label: '2. Compra y comprobantes' },
  { id: 'envios', label: '3. Envios' },
  { id: 'cambios-devoluciones', label: '4. Cambios y devoluciones' },
  { id: 'proteccion-datos', label: '5. Proteccion de datos' },
  { id: 'libro-reclamaciones', label: '6. Libro de reclamaciones' }
];

export const TermsPage = () => {
  return (
    <section className="space-y-8 rounded-[2rem] border border-black/10 bg-white p-6 shadow-sm sm:p-8">
      <header className="space-y-3">
        <p className="text-sm uppercase tracking-[0.3em] text-black/60">Legal</p>
        <h1 className="text-3xl font-semibold uppercase tracking-[0.2em] text-black">Terminos y Condiciones</h1>
        <p className="max-w-3xl text-sm leading-relaxed text-black/70 sm:text-base">
          Estos terminos son aplicables a las marcas EZZETA, MAXETA, CREPANTE y UOMO CATTIVO,
          y regulan la relacion entre el cliente y la tienda en compras, envios y atencion postventa.
        </p>
      </header>

      <nav className="rounded-[1.25rem] border border-black/10 bg-black p-5 shadow-sm" aria-label="Indice de terminos y condiciones">
        <p className="text-xs uppercase tracking-[0.2em] text-white/60">Indice</p>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {tocItems.map((item) => (
            <li key={item.id}>
              <a href={`#${item.id}`} className="block px-4 py-2 text-sm text-white/80 transition hover:border-black hover:text-red-500">
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <article id="requisitos-compra" className="rounded-[1.25rem] border border-black/10 bg-white p-5 shadow-sm scroll-mt-28">
        <h2 className="text-lg font-semibold text-black">1. Requisitos para comprar</h2>
        <p className="mt-3 text-sm leading-relaxed text-black/70">
          Para realizar compras, el cliente debe ser mayor de edad o contar con autorizacion de su representante.
          La informacion registrada en la orden debe ser veraz, completa y actualizada.
        </p>
      </article>

      <article id="compra-comprobantes" className="rounded-[1.25rem] border border-black/10 bg-white p-5 shadow-sm scroll-mt-28">
        <h2 className="text-lg font-semibold text-black">2. Compra y comprobantes</h2>
        <p className="mt-3 text-sm leading-relaxed text-black/70">
          Toda compra esta sujeta a validacion de stock y confirmacion de pago. La emision de boleta o factura se
          realiza con base en los datos declarados por el cliente durante el proceso de checkout.
        </p>
      </article>

      <article id="envios" className="rounded-[1.25rem] border border-black/10 bg-white p-5 shadow-sm scroll-mt-28">
        <h2 className="text-lg font-semibold text-black">3. Envios</h2>
        <p className="mt-3 text-sm leading-relaxed text-black/70">
          Los plazos de entrega son referenciales y pueden variar por zona, temporada o contingencias operativas.
          El cliente es responsable de brindar una direccion de entrega valida y datos de contacto disponibles.
        </p>
      </article>

      <article id="cambios-devoluciones" className="rounded-[1.25rem] border border-black/10 bg-white p-5 shadow-sm scroll-mt-28">
        <h2 className="text-lg font-semibold text-black">4. Cambios y devoluciones</h2>
        <p className="mt-3 text-sm leading-relaxed text-black/70">
          Los cambios o devoluciones aplican segun condiciones de estado del producto, plazos vigentes y
          presentacion de comprobante. No aplican para productos personalizados o en liquidacion final.
        </p>
      </article>

      <article id="proteccion-datos" className="rounded-[1.25rem] border border-black/10 bg-white p-5 shadow-sm scroll-mt-28">
        <h2 className="text-lg font-semibold text-black">5. Proteccion de datos</h2>
        <p className="mt-3 text-sm leading-relaxed text-black/70">
          El tratamiento de datos personales se rige por nuestra Politica de Privacidad y la normativa peruana
          aplicable. Los datos se usan para gestionar pedidos, soporte, mejora de servicio y cumplimiento legal.
        </p>
      </article>

      <article id="libro-reclamaciones" className="rounded-[1.25rem] border border-black/10 bg-white p-5 shadow-sm scroll-mt-28">
        <h2 className="text-lg font-semibold text-black">6. Libro de reclamaciones</h2>
        <p className="mt-3 text-sm leading-relaxed text-black/70">
          El cliente tiene derecho a registrar quejas o reclamos a traves del Libro de Reclamaciones Virtual,
          disponible en este sitio para la atencion y seguimiento correspondiente.
        </p>
      </article>
    </section>
  );
};

