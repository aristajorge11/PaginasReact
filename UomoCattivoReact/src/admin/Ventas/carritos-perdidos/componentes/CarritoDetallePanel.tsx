import { User, Check, Trash2 } from "lucide-react";
import { getProducts } from "../../../../services/contentService";
import type { CarritoPerdido } from "../tipos/TiposCarritosPerdidos";
import { InformacionGeneralCarrito } from "../detalle/InformacionGeneralCarrito";
import { ResumenCarritoDetalle } from "../detalle/ResumenCarritoDetalle";
import { obtenerDetalleProductoCarrito } from "../utils/obtenerDetalleProductoCarrito";
type Props = {
    carrito: CarritoPerdido;
    abierto: boolean;
    cerrar: () => void;
    onVerCliente: (carrito: CarritoPerdido) => void;
    onMarcarRecuperado: (carrito: CarritoPerdido) => void;
    onEliminar: (carrito: CarritoPerdido) => void;
};

export const CarritoDetallePanel = ({ carrito, abierto, cerrar, onVerCliente, onMarcarRecuperado, onEliminar }: Props) => {
    const catalogo = getProducts();

    if (!abierto) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-stretch bg-black/40 p-6">
            <div className="relative ml-auto flex h-full w-full max-w-5xl flex-col overflow-hidden rounded-none bg-white shadow-xl">
                <div className="flex items-center justify-between border-b px-6 py-4">
                    <div>
                        <h2 className="text-2xl font-semibold">Detalle del carrito perdido</h2>
                        <p className="mt-1 text-sm text-zinc-500">Información completa del carrito y resumen de productos.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => onVerCliente(carrito)}
                            className="inline-flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm text-zinc-700 transition hover:bg-zinc-100"
                        >
                            <User size={16} /> Ver cliente
                        </button>
                        <button
                            type="button"
                            onClick={() => onMarcarRecuperado(carrito)}
                            className="inline-flex items-center gap-2 rounded-lg border border-emerald-300 bg-white px-4 py-2 text-sm text-emerald-700 transition hover:bg-emerald-50"
                        >
                            <Check size={16} /> Marcar recuperado
                        </button>
                        <button
                            type="button"
                            onClick={() => onEliminar(carrito)}
                            className="inline-flex items-center gap-2 rounded-lg border border-red-300 bg-white px-4 py-2 text-sm text-red-600 transition hover:bg-red-50"
                        >
                            <Trash2 size={16} /> Eliminar
                        </button>
                        <button
                            type="button"
                            onClick={cerrar}
                            className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm text-zinc-700 transition hover:bg-zinc-100"
                        >Cerrar</button>
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    <InformacionGeneralCarrito carrito={carrito} />
                    <ResumenCarritoDetalle carrito={carrito} />
                    <section className="rounded-none border border-zinc-200 bg-white p-6">
                        <div>
                            <h3 className="text-lg font-semibold">Productos</h3>
                            <p className="mt-1 text-sm text-zinc-500">Detalle de los artículos en el carrito.</p>
                        </div>
                        <div className="mt-6 overflow-x-auto">
                            <table className="min-w-full table-auto text-sm">
                                <thead className="bg-zinc-100 text-left text-sm font-semibold text-zinc-700">
                                    <tr>
                                        <th className="px-4 py-3">Imagen</th>
                                        <th className="px-4 py-3">Nombre</th>
                                        <th className="px-4 py-3">Categoría</th>
                                        <th className="px-4 py-3">Subcategoría</th>
                                        <th className="px-4 py-3">Talla</th>
                                        <th className="px-4 py-3">Cantidad</th>
                                        <th className="px-4 py-3">Precio</th>
                                        <th className="px-4 py-3">Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {carrito.productos.length === 0 ? (
                                        <tr>
                                            <td colSpan={8} className="px-6 py-8 text-center text-zinc-500">
                                                No hay productos en este carrito.
                                            </td>
                                        </tr>
                                    ) : (
                                        carrito.productos.map((item, index) => {
                                            const detalle = obtenerDetalleProductoCarrito(item, catalogo);
                                            return (
                                                <tr key={`${item.productId}-${item.size}-${index}`} className="border-t border-zinc-200 hover:bg-zinc-50">
                                                    <td className="px-4 py-4">
                                                        <div className="h-14 w-14 overflow-hidden rounded-lg bg-zinc-100" />
                                                    </td>
                                                    <td className="px-4 py-4">{detalle.nombre}</td>
                                                    <td className="px-4 py-4">{detalle.categoria}</td>
                                                    <td className="px-4 py-4">{detalle.subcategoria}</td>
                                                    <td className="px-4 py-4">{detalle.talla}</td>
                                                    <td className="px-4 py-4">{item.quantity}</td>
                                                    <td className="px-4 py-4">S/ {detalle.precioUnitario.toFixed(2)}</td>
                                                    <td className="px-4 py-4">S/ {detalle.subtotal.toFixed(2)}</td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};
