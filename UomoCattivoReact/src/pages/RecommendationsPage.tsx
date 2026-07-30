import { useState } from 'react';

export const RecommendationsPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    orderNumber: '',
    issue: '',
    details: '',
  });

  return (
    <section className="space-y-10 rounded-[2rem] border border-black/10 bg-white p-8 shadow-sm">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-black/60">Libro de reclamos</p>
        <h1 className="mt-4 text-2xl sm:text-3xl font-semibold uppercase tracking-[0.15em] sm:tracking-[0.2em] text-black">Reclamos y atención</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.9fr_0.8fr]">
        <div className="space-y-4 rounded-[1.5rem] bg-[#F7F3EC] p-6">
          <p className="text-sm uppercase tracking-[0.2em] text-black/70">Datos de la empresa</p>
          <div className="space-y-3 text-sm text-black/80">
            <p className="font-semibold text-black">EZZETA COMPANY E.I.R.L</p>
            <p>RUC 20604863342</p>
            <p>Teléfono: +51 929370461</p>
            <p>Correo: contacto@uomocattivo.com</p>
            <p>Sitio Web: uomocattivo.com</p>
          </div>
        </div>

        <div className="rounded-[1.5rem] border border-black/10 bg-white p-6 shadow-sm">
          <p className="text-sm uppercase tracking-[0.2em] text-black/70">Envía tu reclamo</p>
          <form className="mt-6 space-y-4">
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
              <label className="block">
                <span className="text-center text-sm text-black/70 sm:text-left">Nombre</span>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(event) => setFormData({ ...formData, name: event.target.value })}
                  className="mt-2 w-full rounded-full border border-black/10 bg-[#F7F3EC] px-4 py-3 text-sm text-black outline-none"
                />
              </label>
              <label className="block">
                <span className="text-center text-sm text-black/70 sm:text-left">Correo</span>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(event) => setFormData({ ...formData, email: event.target.value })}
                  className="mt-2 w-full rounded-full border border-black/10 bg-[#F7F3EC] px-4 py-3 text-sm text-black outline-none"
                />
              </label>
            </div>
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
              <label className="block">
                <span className="text-center text-sm text-black/70 sm:text-left">Teléfono</span>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(event) => setFormData({ ...formData, phone: event.target.value })}
                  className="mt-2 w-full rounded-full border border-black/10 bg-[#F7F3EC] px-4 py-3 text-sm text-black outline-none"
                />
              </label>
              <label className="block">
                <span className="text-center text-sm text-black/70 sm:text-left">N° de pedido (opcional)</span>
                <input
                  type="text"
                  value={formData.orderNumber}
                  onChange={(event) => setFormData({ ...formData, orderNumber: event.target.value })}
                  className="mt-2 w-full rounded-full border border-black/10 bg-[#F7F3EC] px-4 py-3 text-sm text-black outline-none"
                />
              </label>
            </div>
            <label className="block">
              <span className="text-center text-sm text-black/70 sm:text-left">Tipo de reclamo</span>
              <select
                value={formData.issue}
                onChange={(event) => setFormData({ ...formData, issue: event.target.value })}
                className="mt-2 w-full rounded-full border border-black/10 bg-[#F7F3EC] px-4 py-3 text-sm text-black outline-none"
              >
                <option value="">Selecciona un motivo</option>
                <option value="producto">Producto recibido</option>
                <option value="envio">Problema con envío</option>
                <option value="pago">Cobro / pago</option>
                <option value="otros">Otro</option>
              </select>
            </label>
            <label className="block">
              <span className="text-center text-sm text-black/70 sm:text-left">Detalles</span>
              <textarea
                value={formData.details}
                onChange={(event) => setFormData({ ...formData, details: event.target.value })}
                rows={5}
                className="mt-2 w-full rounded-[1rem] border border-black/10 bg-[#F7F3EC] px-4 py-3 text-sm text-black outline-none resize-none"
              />
            </label>
            <button
              type="button"
              onClick={() => alert('Reclamo enviado')}
              className="inline-flex items-center justify-center rounded-full bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-red-600"
            >
              Enviar reclamo
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};
