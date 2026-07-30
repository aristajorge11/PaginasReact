import { useState } from 'react';
import type { FormEvent } from 'react';
import { TypewriterTitle } from '../components/TypewriterTitle';

type ClaimsFormData = {
  fullName: string;
  documentNumber: string;
  phone: string;
  email: string;
  orderNumber: string;
  claimType: 'reclamo' | 'queja';
  detail: string;
};

const initialForm: ClaimsFormData = {
  fullName: '',
  documentNumber: '',
  phone: '',
  email: '',
  orderNumber: '',
  claimType: 'reclamo',
  detail: ''
};

export const RecommendationsPage = () => {
  const [formData, setFormData] = useState<ClaimsFormData>(initialForm);
  const [submissions, setSubmissions] = useState<ClaimsFormData[]>([]);
  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setSubmissions((current) => [...current, formData]);
    setFormData(initialForm);
    setIsSaved(true);
  };

  return (
    <section className="space-y-8 rounded-[2rem] border border-black/10 bg-white p-6 shadow-sm sm:p-8">
      <header className="space-y-3">
        <p className="text-sm uppercase tracking-[0.3em] text-black/60">Legal</p>
        <TypewriterTitle as="h1" text="LIBRO DE RECLAMACIONES VIRTUAL" className="text-2xl font-semibold uppercase tracking-[0.2em] text-black sm:text-3xl" />
      </header>

      <article className="rounded-[1.25rem] border border-black/10 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-black">Informacion de la empresa</h2>
        <ul className="mt-4 space-y-2 text-sm text-black/70">
          <li><span className="font-medium text-black">Razon social:</span> EZZETA S.A.C.</li>
          <li><span className="font-medium text-black">RUC:</span> 20601234567</li>
          <li><span className="font-medium text-black">Telefono:</span> +51 970130675</li>
          <li><span className="font-medium text-black">Correo:</span> atencionalcliente.ezzeta@gmail.com</li>
          <li><span className="font-medium text-black">Sitio web:</span> www.crepante.com</li>
        </ul>
      </article>

      <form onSubmit={handleSubmit} className="space-y-6 rounded-[1.25rem] border border-black/10 bg-white p-5 shadow-sm" noValidate>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="text-sm text-black/80">
            Datos personales: nombres y apellidos
            <input
              value={formData.fullName}
              onChange={(event) => setFormData((current) => ({ ...current, fullName: event.target.value }))}
              required
              className="mt-2 w-full rounded-full border border-black/10 px-4 py-3 text-sm outline-none transition focus:border-black"
              placeholder="Ingrese su nombre completo"
            />
          </label>

          <label className="text-sm text-black/80">
            Datos personales: DNI o CE
            <input
              value={formData.documentNumber}
              onChange={(event) => setFormData((current) => ({ ...current, documentNumber: event.target.value }))}
              required
              className="mt-2 w-full rounded-full border border-black/10 px-4 py-3 text-sm outline-none transition focus:border-black"
              placeholder="Ingrese su documento"
            />
          </label>

          <label className="text-sm text-black/80">
            Datos personales: telefono
            <input
              value={formData.phone}
              onChange={(event) => setFormData((current) => ({ ...current, phone: event.target.value }))}
              required
              className="mt-2 w-full rounded-full border border-black/10 px-4 py-3 text-sm outline-none transition focus:border-black"
              placeholder="Ingrese su telefono"
            />
          </label>

          <label className="text-sm text-black/80">
            Datos personales: correo electronico
            <input
              type="email"
              value={formData.email}
              onChange={(event) => setFormData((current) => ({ ...current, email: event.target.value }))}
              required
              className="mt-2 w-full rounded-full border border-black/10 px-4 py-3 text-sm outline-none transition focus:border-black"
              placeholder="Ingrese su correo"
            />
          </label>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="text-sm text-black/80">
            Pedido: numero de pedido
            <input
              value={formData.orderNumber}
              onChange={(event) => setFormData((current) => ({ ...current, orderNumber: event.target.value }))}
              required
              className="mt-2 w-full rounded-full border border-black/10 px-4 py-3 text-sm outline-none transition focus:border-black"
              placeholder="Ejemplo: EZ-24001"
            />
          </label>

          <label className="text-sm text-black/80">
            Tipo de reclamo
            <select
              value={formData.claimType}
              onChange={(event) =>
                setFormData((current) => ({
                  ...current,
                  claimType: event.target.value as ClaimsFormData['claimType']
                }))
              }
              className="mt-2 w-full rounded-full border border-black/10 px-4 py-3 text-sm outline-none transition focus:border-black"
            >
              <option value="reclamo">Reclamo (disconformidad relacionada al producto o servicio)</option>
              <option value="queja">Queja (malestar o descontento respecto a la atencion)</option>
            </select>
          </label>
        </div>

        <label className="block text-sm text-black/80">
          Detalle
          <textarea
            value={formData.detail}
            onChange={(event) => setFormData((current) => ({ ...current, detail: event.target.value }))}
            required
            rows={5}
            className="mt-2 w-full rounded-[1rem] border border-black/10 px-4 py-3 text-sm outline-none transition focus:border-black"
            placeholder="Describe claramente el motivo de tu reclamo o queja"
          />
        </label>

        <button
          type="submit"
          className="rounded-full bg-black px-6 py-3 text-sm font-medium text-white transition duration-300 hover:bg-red-600"
        >
          Registrar reclamo
        </button>

        {isSaved ? (
          <p className="text-sm text-green-700">
            Reclamo registrado en estado local (mock). Registros guardados en esta sesion: {submissions.length}.
          </p>
        ) : null}
      </form>
    </section>
  );
};
