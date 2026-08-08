import type { WishlistItem } from "../TiposClientes";
import { getProducts } from '../../../services/contentService';

type Props = {
    wishlist: WishlistItem[];
    wishlistIds?: number[];
};

export const WishlistCliente = ({ wishlist, wishlistIds }: Props) => {
    const tieneWishlistStorage = Boolean(wishlistIds && wishlistIds.length > 0);

    return (
        <section className="rounded-none border border-zinc-200 bg-white p-6">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h3 className="text-lg font-semibold text-zinc-900">Wishlist</h3>
                    <p className="mt-1 text-sm text-zinc-500">Productos favoritos guardados por el cliente.</p>
                </div>
            </div>
            <div className="mt-6 space-y-4">
                {wishlist.length === 0 && !tieneWishlistStorage ? (
                    <p className="text-sm text-zinc-500">No hay productos en la wishlist.</p>
                ) : wishlist.length > 0 ? (
                    wishlist.map((item) => (
                        <div key={item.id} className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
                            <div className="grid gap-3 sm:grid-cols-3">
                                <div>
                                    <p className="text-sm text-zinc-500">Producto</p>
                                    <p className="font-medium">{item.nombre}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-zinc-500">Precio</p>
                                    <p className="font-medium">S/ {item.precio.toFixed(2)}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-zinc-500">Estado</p>
                                    <p className="font-medium">{item.enStock ? "En stock" : "Agotado"}</p>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    wishlistIds?.map((productId) => {
                        const product = getProducts().find((p) => Number(p.id) === Number(productId));
                        const name = product?.name || `Producto #${productId}`;

                        return (
                            <div key={productId} className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
                                <p className="text-sm text-zinc-500">Producto</p>
                                <p className="font-medium">{name}</p>
                            </div>
                        );
                    })
                )}
            </div>
        </section>
    );
};
