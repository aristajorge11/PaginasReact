import { useMemo, useState } from 'react';
import { TarjetaEstadistica } from '../../../componentes/TarjetaEstadistica';
import { usePedidos } from '../../pedidos/hooks/usePedidos';
import { useProductos } from '../../../Inventario/productos/hooks/useProductos';
import { useSalesAnalyticsFilters } from '../hooks/useSalesAnalyticsFilters';
import { buildSalesAnalytics, type SalesView } from '../utils/analytics';

const viewOptions: Array<{ value: SalesView; label: string }> = [
  { value: 'general', label: 'General' },
  { value: 'producto', label: 'Producto único' },
  { value: 'categoria', label: 'Categoría' },
  { value: 'subcategoria', label: 'Subcategoría' },
  { value: 'genero', label: 'Género' },
  { value: 'talla', label: 'Talla' },
];

export const SalesAnalyticsPanel = () => {
  const { pedidos } = usePedidos();
  const { productos } = useProductos();
  const [view, setView] = useState<SalesView>('general');
  const { filters, setFilters, options, initialFilters } = useSalesAnalyticsFilters(pedidos, productos);

  const filteredPedidos = useMemo(() => {
    return pedidos.filter((pedido) => {
      const fecha = new Date(pedido.fechaPedido);
      const inicio = filters.fechaInicio ? new Date(filters.fechaInicio) : null;
      const fin = filters.fechaFin ? new Date(filters.fechaFin) : null;

      if (inicio && fecha < inicio) {
        return false;
      }

      if (fin && fecha > fin) {
        return false;
      }

      const matchesCategoria = !filters.categoria || pedido.productos.some((producto) => producto.categoria === filters.categoria);
      const matchesSubcategoria = !filters.subcategoria || pedido.productos.some((producto) => producto.subcategoria === filters.subcategoria);
      const matchesProducto = (!filters.producto && !filters.productoBusqueda)
        || pedido.productos.some((producto) => producto.nombre === filters.producto)
        || pedido.productos.some((producto) => producto.nombre.toLowerCase().includes(filters.productoBusqueda.toLowerCase()));
      const matchesGenero = !filters.genero || pedido.productos.some((producto) => {
        const catalog = productos.find((item) => item.id === producto.productoId);
        return catalog?.genero === filters.genero;
      });
      const matchesTalla = !filters.talla || pedido.productos.some((producto) => producto.talla === filters.talla);

      return matchesCategoria && matchesSubcategoria && matchesProducto && matchesGenero && matchesTalla;
    });
  }, [filters, pedidos, productos]);

  const analytics = useMemo(() => buildSalesAnalytics({ pedidos: filteredPedidos, productos, view }), [filteredPedidos, productos, view]);

  return (
    <section className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <TarjetaEstadistica titulo="Total vendido" valor={`S/ ${analytics.kpis.totalVendido.toFixed(2)}`} descripcion="Ingresos acumulados de los pedidos válidos" />
        <TarjetaEstadistica titulo="Total de pedidos" valor={analytics.kpis.totalPedidos.toString()} descripcion="Pedidos pagados y en proceso" />
        <TarjetaEstadistica titulo="Productos vendidos" valor={analytics.kpis.productosVendidos.toString()} descripcion="Productos distintos que tuvieron ventas" />
        <TarjetaEstadistica titulo="Unidades vendidas" valor={analytics.kpis.unidadesVendidas.toString()} descripcion="Unidades totales comercializadas" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <TarjetaEstadistica titulo="Ticket promedio" valor={`S/ ${analytics.kpis.ticketPromedio.toFixed(2)}`} descripcion="Promedio por pedido" />
        <TarjetaEstadistica titulo="Producto más vendido" valor={analytics.kpis.productoMasVendido} descripcion="Producto con mayor cantidad vendida" />
        <TarjetaEstadistica titulo="Categoría más vendida" valor={analytics.kpis.categoriaMasVendida} descripcion="Categoría con mayor volumen" />
      </div>

      <div className="rounded-none border border-zinc-200 bg-white p-4 shadow-sm">
        <div className="mb-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <label className="text-sm text-zinc-600">
            <span className="mb-1 block">Desde</span>
            <input type="date" value={filters.fechaInicio} onChange={(event) => setFilters((prev) => ({ ...prev, fechaInicio: event.target.value }))} className="w-full rounded-none border border-zinc-300 px-3 py-2" />
          </label>
          <label className="text-sm text-zinc-600">
            <span className="mb-1 block">Hasta</span>
            <input type="date" value={filters.fechaFin} onChange={(event) => setFilters((prev) => ({ ...prev, fechaFin: event.target.value }))} className="w-full rounded-none border border-zinc-300 px-3 py-2" />
          </label>
          <label className="text-sm text-zinc-600">
            <span className="mb-1 block">Categoría</span>
            <select value={filters.categoria} onChange={(event) => setFilters((prev) => ({ ...prev, categoria: event.target.value }))} className="w-full rounded-none border border-zinc-300 px-3 py-2">
              <option value="">Todas</option>
              {options.categorias.map((categoria) => <option key={categoria} value={categoria}>{categoria}</option>)}
            </select>
          </label>
          {view === 'producto' ? (
            <label className="text-sm text-zinc-600">
              <span className="mb-1 block">Buscar producto</span>
              <input
                type="search"
                value={filters.productoBusqueda}
                onChange={(event) => setFilters((prev) => ({ ...prev, productoBusqueda: event.target.value }))}
                placeholder="Buscar nombre de producto"
                className="w-full rounded-none border border-zinc-300 px-3 py-2"
              />
            </label>
          ) : (
            <label className="text-sm text-zinc-600">
              <span className="mb-1 block">Producto</span>
              <select value={filters.producto} onChange={(event) => setFilters((prev) => ({ ...prev, producto: event.target.value }))} className="w-full rounded-none border border-zinc-300 px-3 py-2">
                <option value="">Todos</option>
                {options.productosDisponibles.map((producto) => <option key={producto} value={producto}>{producto}</option>)}
              </select>
            </label>
          )}
          <label className="text-sm text-zinc-600">
            <span className="mb-1 block">Subcategoría</span>
            <select value={filters.subcategoria} onChange={(event) => setFilters((prev) => ({ ...prev, subcategoria: event.target.value }))} className="w-full rounded-none border border-zinc-300 px-3 py-2">
              <option value="">Todas</option>
              {options.subcategorias.map((subcategoria) => <option key={subcategoria} value={subcategoria}>{subcategoria}</option>)}
            </select>
          </label>
          <label className="text-sm text-zinc-600">
            <span className="mb-1 block">Género</span>
            <select value={filters.genero} onChange={(event) => setFilters((prev) => ({ ...prev, genero: event.target.value }))} className="w-full rounded-none border border-zinc-300 px-3 py-2">
              <option value="">Todos</option>
              {options.generos.map((genero) => <option key={genero} value={genero}>{genero}</option>)}
            </select>
          </label>
          <label className="text-sm text-zinc-600">
            <span className="mb-1 block">Talla</span>
            <select value={filters.talla} onChange={(event) => setFilters((prev) => ({ ...prev, talla: event.target.value }))} className="w-full rounded-none border border-zinc-300 px-3 py-2">
              <option value="">Todas</option>
              {options.tallas.map((talla) => <option key={talla} value={talla}>{talla}</option>)}
            </select>
          </label>
        </div>
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setFilters(initialFilters);
              setView('general');
            }}
            className="rounded-none border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-700 hover:border-zinc-900"
          >
            Quitar filtros
          </button>
          {viewOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setView(option.value)}
              className={`rounded-none border px-3 py-2 text-sm transition ${view === option.value ? 'border-zinc-900 bg-zinc-900 text-white' : 'border-zinc-300 bg-white text-zinc-700 hover:border-zinc-900'}`}
            >
              {option.label}
            </button>
          ))}
        </div>

        <div className="rounded-none border border-zinc-200 bg-zinc-50 p-4">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-zinc-900">{viewOptions.find((option) => option.value === view)?.label}</p>
              <p className="text-sm text-zinc-500">Resumen dinámico a partir de pedidos y productos reales.</p>
            </div>
          </div>

          <div className="mb-4 rounded-none border border-zinc-200 bg-white p-4">
            <p className="mb-2 text-sm font-semibold text-zinc-900">Progreso de ingresos</p>
            <div className="flex h-40 items-end gap-3">
              {analytics.chartSeries.length > 0 ? (
                (() => {
                  const maxValue = Math.max(...analytics.chartSeries.map((entry) => entry.value), 1);
                  return analytics.chartSeries.map((item) => (
                    <div key={item.name} className="flex flex-1 flex-col items-center gap-2">
                      <div className="relative h-28 w-full overflow-hidden rounded-lg bg-zinc-100">
                        <div
                          className="absolute bottom-0 left-0 right-0 rounded-t-lg bg-zinc-900"
                          style={{ height: `${(item.value / maxValue) * 100}%` }}
                        />
                      </div>
                      <span className="truncate text-[11px] text-zinc-500">{item.name}</span>
                    </div>
                  ));
                })()
              ) : (
                <p className="text-sm text-zinc-500">Sin ventas para este filtro.</p>
              )}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-zinc-200 bg-white text-left text-zinc-700">
                  <th className="px-3 py-2">{view === 'producto' ? 'Producto' : view === 'categoria' ? 'Categoría' : view === 'subcategoria' ? 'Subcategoría' : view === 'genero' ? 'Género' : view === 'talla' ? 'Talla' : 'Producto'}</th>
                  {view === 'producto' && <th className="px-3 py-2">Talla</th>}
                  <th className="px-3 py-2">Cantidad</th>
                  <th className="px-3 py-2">Ingresos</th>
                  <th className="px-3 py-2">Pedidos</th>
                  <th className="px-3 py-2">Participación</th>
                </tr>
              </thead>
              <tbody>
                {analytics.rows.map((row) => (
                  <tr key={row.id} className="border-b border-zinc-200 bg-white text-zinc-700">
                    <td className="px-3 py-3 font-medium text-zinc-900">{row.label}</td>
                    {view === 'producto' && <td className="px-3 py-3">{row.talla ?? 'Sin talla'}</td>}
                    <td className="px-3 py-3">{row.cantidadVendida}</td>
                    <td className="px-3 py-3">S/ {row.ingresos.toFixed(2)}</td>
                    <td className="px-3 py-3">{row.pedidos}</td>
                    <td className="px-3 py-3">{row.participacion.toFixed(2)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};
