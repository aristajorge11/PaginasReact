import { getProducts } from "../../../../services/contentService";
import type { StorageCartItem } from "../tipos/TiposCarritosPerdidos";

type Props = {
    productos: StorageCartItem[];
};

export const ProductosCarrito = ({ productos }: Props) => {
    const catalogo = getProducts();

    return (
        <section className="rounded-none border border-zinc-200 bg-white p-6">
            <div>
                <h3 className="text-lg font-semibold text-zinc-900">Productos del carrito</h3>
                <p className="mt-1 text-sm text-zinc-500">Revisa los items almacenados en el carrito.</p>
            </div>
            <div className="mt-6 space-y-4">
                {productos.length === 0 ? (
                    <p className="text-sm text-zinc-500">No hay productos registrados en este carrito.</p>
                ) : (
                    productos.map((item, index) => {
                        const producto = catalogo.find((product) => Number(product.id) === Number(item.productId));
                        return (
                            <div key={`${item.productId}-${item.size}-${index}`} className="rounded-none border border-zinc-200 bg-zinc-50 p-4">
                                <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
                                    <div>
                                        <p className="text-sm text-zinc-500">Producto</p>
                                        <p className="font-medium">{producto?.name ?? `#${item.productId}`}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-zinc-500">Talla</p>
                                        <p className="font-medium">{item.size}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-zinc-500">Cantidad</p>
                                        <p className="font-medium">{item.quantity}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-zinc-500">Precio unitario</p>
                                        <p className="font-medium">S/ {producto?.price?.toFixed(2) ?? "0.00"}</p>
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
