import { getProducts } from "../../../../services/contentService";
import type { Pedido } from "../TiposPedidos";
import { calcularTotales } from "../utils/calcularTotales";

type Props = {
    pedido: Pedido;
    establecerPedido: React.Dispatch<
        React.SetStateAction<Pedido>
    >;
};

export const ProductosPedido = ({
    pedido,
    establecerPedido
}: Props) => {
    const productosCatalogo = getProducts();

    function actualizarProducto(
        index: number,
        campo: string,
        valor: unknown
    ) {
        establecerPedido(prev => {
            const productos = [...prev.productos];
            productos[index] = {
                ...productos[index],
                [campo]: valor
            };
            return calcularTotales({
                ...prev,
                productos
            });
        });
    }

    function aplicarProductoCatalogo(
        index: number,
        productoId: number
    ) {
        const producto = productosCatalogo.find(
            item => item.id === productoId
        );

        if (!producto) {
            return;
        }

        establecerPedido(prev => {
            const productos = [...prev.productos];
            const talla = producto.sizes[0] ?? "";

            productos[index] = {
                ...productos[index],
                productoId: producto.id,
                slug: producto.slug,
                nombre: producto.name,
                imagen: producto.image,
                categoria: producto.category,
                subcategoria: producto.subcategory,
                talla,
                precioUnitario: producto.price,
                subtotal: Number((producto.price * productos[index].cantidad).toFixed(2))
            };

            return calcularTotales({
                ...prev,
                productos
            });
        });
    }

    function agregarProducto() {
        establecerPedido(prev =>
            calcularTotales({
                ...prev,
                productos: [
                    ...prev.productos,
                    {
                        productoId: 0,
                        slug: "",
                        nombre: "",
                        imagen: "",
                        categoria: "",
                        subcategoria: "",
                        talla: "",
                        cantidad: 1,
                        precioUnitario: 0,
                        subtotal: 0
                    }
                ]
            })
        );
    }

    function eliminarProducto(
        index: number
    ) {
        establecerPedido(prev =>
            calcularTotales({
                ...prev,
                productos: prev.productos.filter(
                    (_, i) => i !== index
                )
            })
        );
    }

    return (
        <section className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold">Productos</h3>
                    <p className="text-sm text-zinc-500">Resumen compacto del pedido.</p>
                </div>
                <button
                    type="button"
                    onClick={agregarProducto}
                    className="rounded-lg bg-black px-3 py-2 text-sm text-white"
                >Agregar producto
                </button>
            </div>
            {
                pedido.productos.length === 0 && (
                    <div className="rounded-none border border-dashed border-zinc-300 p-8 text-center text-zinc-500">
                        No existen productos agregados.</div>
                )
            }
            {
                pedido.productos.map((producto, index) => (
                    <div
                        key={index}
                        className="rounded-none border border-zinc-200 p-4 space-y-4"
                    >
                        <div className="grid gap-3 lg:grid-cols-[0.7fr_1.4fr_0.7fr_0.6fr_0.6fr_0.7fr_0.4fr]">
                            <div>
                                <label className="mb-1 block text-sm font-medium">Imagen</label>
                                <div className="flex h-20 items-center justify-center rounded-lg border border-zinc-300 bg-zinc-50">
                                    {
                                        producto.imagen
                                            ? (
                                                <img
                                                    src={producto.imagen}
                                                    alt={producto.nombre}
                                                    className="h-full w-full object-contain"
                                                />
                                            ) : (
                                                <span className="text-xs text-zinc-500">Sin imagen</span>
                                            )
                                    }
                                </div>
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium">Nombre</label>
                                {
                                    producto.productoId && producto.nombre ? (
                                        <div className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm font-medium text-zinc-700">
                                            {producto.nombre}
                                        </div>
                                    ) : (
                                        <div className="flex flex-col gap-2">
                                            <select
                                                value={producto.productoId || ""}
                                                onChange={(e) =>
                                                    aplicarProductoCatalogo(
                                                        index,
                                                        Number(e.target.value)
                                                    )
                                                }
                                                className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
                                            >
                                                <option value="">Selecciona un producto</option>
                                                {
                                                    productosCatalogo.map(
                                                        item => (
                                                            <option
                                                                key={item.id}
                                                                value={item.id}
                                                            >
                                                                {item.name}
                                                            </option>
                                                        )
                                                    )
                                                }
                                            </select>
                                            <span className="text-xs text-zinc-500">Se muestra al elegir un producto.</span>
                                        </div>
                                    )
                                }
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium">Talla</label>
                                {
                                    productosCatalogo.find(
                                        item => item.id === producto.productoId
                                    )?.sizes.length ? (
                                        <select
                                            value={producto.talla}
                                            onChange={(e)=>
                                                actualizarProducto(
                                                    index,
                                                    "talla",
                                                    e.target.value
                                                )
                                            }
                                            className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
                                        >
                                            {
                                                productosCatalogo.find(
                                                    item => item.id === producto.productoId
                                                )?.sizes.map(
                                                    talla => (
                                                        <option
                                                            key={talla}
                                                            value={talla}
                                                        >
                                                            {talla}
                                                        </option>
                                                    )
                                                )
                                            }
                                        </select>
                                    ) : (
                                        <input
                                            value={producto.talla}
                                            onChange={(e)=>
                                                actualizarProducto(
                                                    index,
                                                    "talla",
                                                    e.target.value
                                                )
                                            }
                                            className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
                                        />
                                    )
                                }
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium">Cant.</label>
                                <input
                                    type="number"
                                    min={1}
                                    value={producto.cantidad}
                                    onChange={(e)=>{
                                        const cantidad =
                                            Number(e.target.value);
                                        establecerPedido(prev => {
                                            const productos = [...prev.productos];
                                            productos[index] = {
                                                ...productos[index],
                                                cantidad,
                                                subtotal: cantidad * producto.precioUnitario
                                            };
                                            return calcularTotales({
                                                ...prev,
                                                productos
                                            });
                                        });
                                    }}className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium">Precio unit.</label>
                                <input
                                    type="number"
                                    value={producto.precioUnitario}
                                    onChange={(e)=>{
                                        const precio =
                                            Number(e.target.value);
                                        establecerPedido(prev => {
                                            const productos = [...prev.productos];
                                            productos[index] = {
                                                ...productos[index],
                                                precioUnitario: precio,
                                                subtotal: precio * producto.cantidad
                                            };
                                            return calcularTotales({
                                                ...prev,
                                                productos
                                            });
                                        });
                                    }}className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium">Subtotal</label>
                                <div className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm font-medium text-zinc-700">
                                    S/ {producto.subtotal.toFixed(2)}
                                </div>
                            </div>
                            <div className="flex items-end">
                                <button
                                    onClick={() => eliminarProducto(index)}
                                    className="w-full rounded-lg border border-red-300 px-3 py-2 text-sm text-red-600"
                                >Eliminar</button>
                            </div>
                        </div>
                    </div>
                ))
            }
        </section>
    );
};