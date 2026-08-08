import { Plus } from 'lucide-react';
import type { PermissionAccess } from '../../hooks/usePermissions';
import { useEffect, useMemo, useState } from 'react';
import { obtenerPromoCodes, guardarPromoCodes, type PromoCode } from '../../../data/promoCodes';

const tipos = {
  percentage: 'Porcentaje',
  fixed: 'Monto fijo',
  shipping: 'Envío gratis',
} as const;

const inicializarCodigo = (): PromoCode => ({
  id: Date.now(),
  code: '',
  type: 'percentage',
  value: 0,
  minPurchase: 0,
  active: true,
});

type Props = {
  access: PermissionAccess;
};

export const CuponesCrudPanel = (_props: Props) => {
  const [cupones, setCupones] = useState<PromoCode[]>(() => obtenerPromoCodes());
  const [busqueda, setBusqueda] = useState('');
  const [cuponActivo, setCuponActivo] = useState<PromoCode | null>(null);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [cuponEditando, setCuponEditando] = useState<PromoCode>(inicializarCodigo());
  const [modoEdicion, setModoEdicion] = useState(false);

  useEffect(() => {
    const listener = () => setCupones(obtenerPromoCodes());
    window.addEventListener('maxeta:promo-codes-changed', listener);
    return () => window.removeEventListener('maxeta:promo-codes-changed', listener);
  }, []);

  const cuponesFiltrados = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();
    if (!texto) return cupones;
    return cupones.filter((cupon) =>
      cupon.code.toLowerCase().includes(texto) ||
      String(cupon.type).toLowerCase().includes(texto),
    );
  }, [cupones, busqueda]);

  const abrirNuevo = () => {
    setCuponActivo(null);
    setCuponEditando(inicializarCodigo());
    setModoEdicion(false);
    setModalAbierto(true);
  };

  const abrirEdicion = (cupon: PromoCode) => {
    setCuponActivo(cupon);
    setCuponEditando(cupon);
    setModoEdicion(true);
    setModalAbierto(true);
  };

  const cerrarModal = () => setModalAbierto(false);

  const guardar = () => {
    if (!cuponEditando.code.trim()) {
      alert('Ingresa el código del cupón.');
      return;
    }

    const siguientes = [...obtenerPromoCodes()];
    if (modoEdicion) {
      const indice = siguientes.findIndex((item) => item.id === cuponEditando.id);
      if (indice !== -1) {
        siguientes[indice] = cuponEditando;
      }
    } else {
      siguientes.unshift(cuponEditando);
    }

    guardarPromoCodes(siguientes);
    setCupones(siguientes);
    cerrarModal();
  };

  const eliminar = (id: number) => {
    if (!window.confirm('¿Eliminar este cupón?')) return;
    const siguientes = obtenerPromoCodes().filter((item) => item.id !== id);
    guardarPromoCodes(siguientes);
    setCupones(siguientes);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1.4fr_0.9fr]">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Cupones</h1>
            <p className="text-zinc-500">Administra cupones que el cliente puede aplicar en el carrito.</p>
          </div>
          <button
            type="button"
            onClick={abrirNuevo}
            className="inline-flex items-center gap-2 rounded-lg bg-black px-5 py-3 text-white transition hover:bg-zinc-900"
          >
            <Plus size={18} /> Nuevo cupón
          </button>
        </div>

        <input
          type="search"
          value={busqueda}
          onChange={(event) => setBusqueda(event.target.value)}
          placeholder="Buscar cupón..."
          className="w-full rounded-lg border border-zinc-300 px-4 py-3"
        />

        <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-zinc-100">
                <tr>
                  <th className="px-4 py-3">Código</th>
                  <th className="px-4 py-3">Tipo</th>
                  <th className="px-4 py-3">Valor</th>
                  <th className="px-4 py-3">Compra mínima</th>
                  <th className="px-4 py-3">Activo</th>
                  <th className="px-4 py-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {cuponesFiltrados.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-zinc-500">No hay cupones registrados.</td>
                  </tr>
                ) : (
                  cuponesFiltrados.map((cupon) => (
                    <tr key={cupon.id} className="border-t border-zinc-200 hover:bg-zinc-50">
                      <td className="px-4 py-3 font-semibold uppercase tracking-[0.08em]">{cupon.code}</td>
                      <td className="px-4 py-3">{tipos[cupon.type]}</td>
                      <td className="px-4 py-3">{cupon.type === 'percentage' ? `${cupon.value}%` : cupon.type === 'fixed' ? `S/${cupon.value.toFixed(2)}` : 'Envío gratis'}</td>
                      <td className="px-4 py-3">S/{cupon.minPurchase.toFixed(2)}</td>
                      <td className="px-4 py-3">{cupon.active ? 'Sí' : 'No'}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => abrirEdicion(cupon)} className="rounded-lg border border-blue-500 px-3 py-2 text-xs font-semibold text-blue-600 transition hover:bg-blue-500 hover:text-white">Editar</button>
                          <button onClick={() => eliminar(cupon.id)} className="rounded-lg border border-red-500 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-500 hover:text-white">Eliminar</button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <aside className="space-y-4 rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
        <div>
          <h2 className="text-xl font-semibold">Detalle del cupón</h2>
          <p className="mt-2 text-sm text-zinc-500">Selecciona un cupón para editar sus parámetros desde el panel.</p>
        </div>

        {cuponActivo ? (
          <div className="space-y-3 rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
            <p className="text-sm text-zinc-500">Cupón activo</p>
            <div className="space-y-2">
              <p className="font-semibold">{cuponActivo.code}</p>
              <p className="text-sm text-zinc-700">Tipo: {tipos[cuponActivo.type]}</p>
              <p className="text-sm text-zinc-700">Valor: {cuponActivo.type === 'percentage' ? `${cuponActivo.value}%` : cuponActivo.type === 'fixed' ? `S/${cuponActivo.value.toFixed(2)}` : 'Envío gratis'}</p>
              <p className="text-sm text-zinc-700">Compra mínima: S/{cuponActivo.minPurchase.toFixed(2)}</p>
              <p className="text-sm text-zinc-700">Estado: {cuponActivo.active ? 'Activo' : 'Inactivo'}</p>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-600">
            Selecciona un cupón para ver sus detalles.
          </div>
        )}
      </aside>

      {modalAbierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6">
          <div className="w-full max-w-3xl rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold">{modoEdicion ? 'Editar cupón' : 'Nuevo cupón'}</h3>
                <p className="text-sm text-zinc-500">Define el código y los requisitos para su aplicación.</p>
              </div>
              <button onClick={cerrarModal} className="rounded-full border border-black/10 px-3 py-2 text-black/60 hover:bg-zinc-100">Cerrar</button>
            </div>
            <div className="grid gap-4">
              <label className="block">
                <span className="mb-2 block text-sm font-medium">Código</span>
                <input
                  type="text"
                  value={cuponEditando.code}
                  onChange={(event) => setCuponEditando((prev) => ({ ...prev, code: event.target.value.toUpperCase() }))}
                  className="w-full rounded-lg border border-zinc-300 px-4 py-3"
                />
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-sm font-medium">Tipo</span>
                  <select
                    value={cuponEditando.type}
                    onChange={(event) => setCuponEditando((prev) => ({ ...prev, type: event.target.value as PromoCode['type'] }))}
                    className="w-full rounded-lg border border-zinc-300 px-4 py-3"
                  >
                    {Object.entries(tipos).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-medium">Valor</span>
                  <input
                    type="number"
                    min={0}
                    value={cuponEditando.value}
                    onChange={(event) => setCuponEditando((prev) => ({ ...prev, value: Number(event.target.value) }))}
                    className="w-full rounded-lg border border-zinc-300 px-4 py-3"
                  />
                </label>
              </div>
              <label className="block">
                <span className="mb-2 block text-sm font-medium">Compra mínima</span>
                <input
                  type="number"
                  min={0}
                  value={cuponEditando.minPurchase}
                  onChange={(event) => setCuponEditando((prev) => ({ ...prev, minPurchase: Number(event.target.value) }))}
                  className="w-full rounded-lg border border-zinc-300 px-4 py-3"
                />
              </label>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={cuponEditando.active}
                  onChange={(event) => setCuponEditando((prev) => ({ ...prev, active: event.target.checked }))}
                  className="h-4 w-4 accent-black"
                />
                Activar cupón
              </label>
              <div className="flex justify-end gap-3 pt-4">
                <button onClick={cerrarModal} className="rounded-lg border border-zinc-300 px-5 py-3">Cancelar</button>
                <button onClick={guardar} className="rounded-lg bg-black px-5 py-3 text-white">Guardar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};