import type { CarritoPerdido } from "../tipos/TiposCarritosPerdidos";

type Props = {
    carrito: CarritoPerdido;
};

export const TotalesCarrito = ({ carrito }: Props) => {
    return (
        <section className="rounded-none border border-zinc-200 bg-white p-6">
            <div>
                <h3 className="text-lg font-semibold text-zinc-900">Totales</h3>
                <p className="mt-1 text-sm text-zinc-500">Resumen del valor del carrito.</p>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div>
                    <p className="text-sm text-zinc-500">Cantidad de items</p>
                    <p className="font-medium">{carrito.cantidadItems}</p>
                </div>
                <div>
                    <p className="text-sm text-zinc-500">Total estimado</p>
                    <p className="font-medium">S/ {carrito.total.toFixed(2)}</p>
                </div>
            </div>
        </section>
    );
};
