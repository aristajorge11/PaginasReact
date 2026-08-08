import { getProducts } from "../../../../services/contentService";
import type { CarritoPerdido } from "../tipos/TiposCarritosPerdidos";

type Props = {
    carrito: CarritoPerdido;
};

export const ResumenCarritoDetalle = ({ carrito }: Props) => {
    const catalogo = getProducts();
    const subtotal = carrito.productos.reduce((sum, item) => {
        const producto = catalogo.find((product) => Number(product.id) === item.productId);
        return sum + (producto?.price ?? 0) * item.quantity;
    }, 0);
    const descuentos = 0;
    const envio = subtotal > 0 ? 15 : 0;
    const total = carrito.total;

    return (
        <section className="rounded-none border border-zinc-200 bg-white p-6">
            <div>
                <h3 className="text-lg font-semibold">Resumen</h3>
                <p className="mt-1 text-sm text-zinc-500">Totales calculados a partir de los productos del carrito.</p>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <div>
                    <p className="text-sm text-zinc-500">Productos</p>
                    <p className="font-medium">{carrito.productos.length}</p>
                </div>
                <div>
                    <p className="text-sm text-zinc-500">Subtotal</p>
                    <p className="font-medium">S/ {subtotal.toFixed(2)}</p>
                </div>
                <div>
                    <p className="text-sm text-zinc-500">Descuentos</p>
                    <p className="font-medium">S/ {descuentos.toFixed(2)}</p>
                </div>
                <div>
                    <p className="text-sm text-zinc-500">Envío</p>
                    <p className="font-medium">S/ {envio.toFixed(2)}</p>
                </div>
                <div className="sm:col-span-2 xl:col-span-4">
                    <p className="text-sm text-zinc-500">Total</p>
                    <p className="text-2xl font-semibold">S/ {total.toFixed(2)}</p>
                </div>
            </div>
        </section>
    );
};
