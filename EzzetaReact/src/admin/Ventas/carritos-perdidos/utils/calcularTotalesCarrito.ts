import { getProducts } from "../../../../services/contentService";
import type { StorageCartItem } from "../tipos/TiposCarritosPerdidos";

export function calcularTotalesCarrito(items: StorageCartItem[]) {
    const catalogo = getProducts();

    const total = items.reduce((acumulado, item) => {
        const producto = catalogo.find((product) => Number(product.id) === Number(item.productId));
        const precioUnitario = producto?.price ?? 0;
        return acumulado + precioUnitario * item.quantity;
    }, 0);

    const cantidadItems = items.reduce((acumulado, item) => acumulado + item.quantity, 0);

    return {
        total: Number(total.toFixed(2)),
        cantidadItems
    };
}
