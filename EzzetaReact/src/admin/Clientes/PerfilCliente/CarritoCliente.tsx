import type { CarritoItem, StorageCartItem } from "../TiposClientes";
import { getProducts } from '../../../services/contentService';

type Props = {
    carrito: CarritoItem[];
    carritoStorage?: StorageCartItem[];
};

export const CarritoCliente = ({ carrito, carritoStorage }: Props) => {
    const tieneCarritoStorage = Boolean(carritoStorage && carritoStorage.length > 0);

    return (
        <section className="rounded-none border border-zinc-200 bg-white p-6">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h3 className="text-lg font-semibold text-zinc-900">Carrito activo</h3>
                    <p className="mt-1 text-sm text-zinc-500">Productos en el carrito del cliente.</p>
                </div>
            </div>
            <div className="mt-6 space-y-4">
                {carrito.length === 0 && !tieneCarritoStorage ? (
                    <p className="text-sm text-zinc-500">El carrito está vacío.</p>
                ) : carrito.length > 0 ? (
                    carrito.map((item) => (
                        <div key={item.id} className="grid gap-3 rounded-xl border border-zinc-200 bg-zinc-50 p-4 sm:grid-cols-[1fr_auto]">
                            <div>
                                <p className="text-sm text-zinc-500">Producto</p>
                                <p className="font-medium">{item.nombre}</p>
                            </div>
                            <div className="grid gap-2 sm:grid-cols-3">
                                <div>
                                    <p className="text-sm text-zinc-500">Cantidad</p>
                                    <p className="font-medium">{item.cantidad}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-zinc-500">Precio unitario</p>
                                    <p className="font-medium">S/ {item.precio.toFixed(2)}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-zinc-500">Subtotal</p>
                                    <p className="font-medium">S/ {(item.precio * item.cantidad).toFixed(2)}</p>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    carritoStorage?.map((item, index) => {
                        const product = getProducts().find((p) => Number(p.id) === Number(item.productId));
                        const name = product?.name || `Producto #${item.productId}`;

                        return (
                            <div key={`${item.productId}-${item.size}-${index}`} className="grid gap-3 rounded-xl border border-zinc-200 bg-zinc-50 p-4 sm:grid-cols-[1fr_auto]">
                                <div>
                                    <p className="text-sm text-zinc-500">Producto</p>
                                    <p className="font-medium">{name}</p>
                                </div>
                                <div className="grid gap-2 sm:grid-cols-3">
                                    <div>
                                        <p className="text-sm text-zinc-500">Cantidad</p>
                                        <p className="font-medium">{item.quantity}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-zinc-500">Talla</p>
                                        <p className="font-medium">{item.size}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </section>
    );
};
