import { getPlanById } from "../../../plans";
import { obtenerPedidos } from "../../Ventas/pedidos/DatosPedidos";
import type { Pedido } from "../../Ventas/pedidos/TiposPedidos";
import { AuthService } from "../../../services/authService";
import { storageManager, StorageKeys } from "../../../storage";
import type { AuthSession } from "../../../types/auth";
import type { PurchaseOrder, WholesaleUser } from "../../../types/auth";
import type { CheckoutDraft } from "../../../storage/checkout/checkoutDraftStorage";
import type { Cliente, ClientePago, ClientePedido, StorageCartItem } from "../TiposClientes";

const formatDate = (value?: string): string => {
    if (!value) {
        return "-";
    }

    return value.split("T")[0] ?? value;
};

const hasText = (value: unknown): value is string => typeof value === "string" && value.trim().length > 0;

const normalizar = (value: string): string => value.trim().toLowerCase();

const checkoutConDatos = (checkout: CheckoutDraft | null): checkout is CheckoutDraft =>
    Boolean(checkout && Object.keys(checkout).length > 0);

const obtenerPedidosUsuario = (pedidos: Pedido[], user: WholesaleUser): Pedido[] => {
    const email = normalizar(user.email);
    const phone = normalizar(user.phone || "");

    return pedidos.filter((pedido) => {
        const correoPedido = normalizar(pedido.cliente.correo || "");
        const telefonoPedido = normalizar(pedido.cliente.telefono || "");

        return correoPedido === email || (phone.length > 0 && telefonoPedido === phone);
    });
};

const buildNames = (username: string): { nombres: string; apellidos: string } => {
    const cleaned = username.replace(/[._-]+/g, " ").trim();
    const parts = cleaned.split(/\s+/).filter(Boolean);

    if (parts.length === 0) {
        return { nombres: "Cliente", apellidos: "" };
    }

    if (parts.length === 1) {
        return { nombres: parts[0], apellidos: "" };
    }

    return {
        nombres: parts.slice(0, -1).join(" "),
        apellidos: parts.slice(-1).join(" "),
    };
};

const mapPedidos = (clienteId: number, purchases: PurchaseOrder[]): ClientePedido[] =>
    purchases.map((purchase, index) => ({
        id: clienteId * 1000 + index + 1,
        clienteId,
        fecha: purchase.date ?? formatDate(purchase.createdAt),
        estado: "Entregado",
        total: Number(purchase.total ?? 0),
        items: Array.isArray(purchase.items)
            ? purchase.items.reduce((acc, item) => acc + Number(item.quantity ?? 0), 0)
            : 0,
        pedidoId: purchase.id,
    }));

const mapPedidosVentas = (clienteId: number, pedidos: Pedido[]): ClientePedido[] =>
    pedidos.map((pedido) => ({
        id: pedido.id,
        clienteId,
        fecha: formatDate(pedido.fechaPedido),
        estado: pedido.estado,
        total: Number(pedido.total ?? 0),
        items: pedido.productos.reduce((acumulado, producto) => acumulado + Number(producto.cantidad ?? 0), 0),
        pedidoId: pedido.numeroPedido,
    }));

const mapPagos = (clienteId: number, purchases: PurchaseOrder[]): ClientePago[] =>
    purchases.map((purchase, index) => ({
        id: clienteId * 1000 + index + 1,
        clienteId,
        fecha: purchase.date ?? formatDate(purchase.createdAt),
        metodo: purchase.paymentMethod || "No especificado",
        monto: Number(purchase.total ?? 0),
        estado: "pagado",
        referencia: `PAY-${purchase.id.slice(0, 8).toUpperCase()}`,
    }));

const mapPagosVentas = (clienteId: number, pedidos: Pedido[]): ClientePago[] =>
    pedidos.map((pedido) => ({
        id: pedido.id,
        clienteId,
        fecha: formatDate(pedido.fechaPedido),
        metodo: pedido.metodoPago,
        monto: Number(pedido.total ?? 0),
        estado: pedido.estado === "cancelado" ? "fallido" : pedido.estado === "pendiente" ? "pendiente" : "pagado",
        referencia: `PAY-${pedido.numeroPedido}`,
    }));

const obtenerWishlistPorUsuario = (userId: string): number[] => {
    const userKey = `${StorageKeys.WISHLIST}.${userId}`;
    const userWishlist = storageManager.get<number[]>(userKey) || [];
    if (userWishlist.length > 0) {
        return userWishlist;
    }

    const syncKey = `${StorageKeys.SYNC}.wishlistByUser`;
    const current = storageManager.get<Record<string, any>>(syncKey) || {};
    return Array.isArray(current[userId]?.wishlist) ? current[userId].wishlist : [];
};

const obtenerCarritoPorUsuario = (userId: string): StorageCartItem[] => {
    const userKey = `${StorageKeys.CART}.${userId}`;
    const userCart = storageManager.get<StorageCartItem[]>(userKey) || [];
    if (userCart.length > 0) {
        return userCart;
    }

    const syncKey = `${StorageKeys.SYNC}.cartByUser`;
    const current = storageManager.get<Record<string, any>>(syncKey) || {};
    return Array.isArray(current[userId]?.cart) ? current[userId].cart : [];
};

const mapUserToCliente = (
    user: WholesaleUser,
    index: number,
    pedidosVentas: Pedido[]
): Cliente => {
    const id = 1000 + index;
    const purchases = Array.isArray(user.purchases) ? user.purchases : [];
    const pedidos = pedidosVentas.length > 0 ? mapPedidosVentas(id, pedidosVentas) : mapPedidos(id, purchases);
    const pagos = pedidosVentas.length > 0 ? mapPagosVentas(id, pedidosVentas) : mapPagos(id, purchases);
    const names = buildNames(user.username);
    const plan = getPlanById(user.plan);
    const totalGastado = pedidos.reduce((acumulado, pedido) => acumulado + Number(pedido.total ?? 0), 0);

    const explicitEstado = (user as any).estado as 'activo' | 'inactivo' | 'suspendido' | undefined;
    const suspendUntilRaw = (user as any).suspendUntil as string | undefined | null;
    let estado: import('../TiposClientes').EstadoCliente;
    const planFin = formatDate(user.planEnd);

    if (explicitEstado === 'suspendido') {
        if (suspendUntilRaw) {
            const until = new Date(suspendUntilRaw);
            estado = until.getTime() <= Date.now() ? 'activo' : 'suspendido';
        } else {
            estado = 'suspendido';
        }
    } else if (explicitEstado === 'inactivo') {
        estado = 'inactivo';
    } else {
        estado = planFin !== "-" && planFin < formatDate(new Date().toISOString()) ? "inactivo" : "activo";
    }

    return {
        id,
        origenUsuarioId: user.id,
        tipoRegistro: "registrado",
        guestId: undefined,
        nombres: names.nombres,
        apellidos: names.apellidos,
        usuario: user.username,
        correo: user.email,
        telefono: user.phone || "No registrado",
        documento: user.ruc ? `RUC ${user.ruc}` : undefined,
        genero: "prefiero_no_decir",
        fechaRegistro: formatDate(user.createdAt),
        estado,
        ultimoPedido: pedidos[0]?.fecha ?? formatDate(user.lastPurchaseAt),
        totalGastado,
        pedidosCompletados: pedidos.length,
        pedidosTotales: pedidos.length,
        actividadReciente: pedidos.length > 0 ? "Compra registrada" : "Sin compras",
        ciudad: "No especificada",
        direccion: "No especificada",
        pedidos,
        pagos,
        carrito: [],
        carritoStorage: obtenerCarritoPorUsuario(user.id),
        wishlist: [],
        wishlistStorageIds: obtenerWishlistPorUsuario(user.id),
        planActual: plan.id,
        planNombre: plan.nombre,
        planInicio: formatDate(user.planStart),
        planFin,
        suspendUntil: suspendUntilRaw ?? null,
    };
};

const construirGuestCliente = (
    guestId: string,
    checkout: CheckoutDraft | null,
    pedidosGuest: Pedido[],
    wishlistIds: number[],
    carrito: StorageCartItem[],
    recentlyViewedProducts: string[],
    searchHistory: string[]
): Cliente => {
    const pedidos = mapPedidosVentas(999999, pedidosGuest);
    const pagos = mapPagosVentas(999999, pedidosGuest);
    const totalGastado = pedidos.reduce((acumulado, pedido) => acumulado + pedido.total, 0);

    const nombreCompleto = checkout?.name?.trim() || "Guest";
    const partesNombre = nombreCompleto.split(/\s+/).filter(Boolean);
    const nombres = partesNombre.length > 1 ? partesNombre.slice(0, -1).join(" ") : nombreCompleto;
    const apellidos = partesNombre.length > 1 ? partesNombre.slice(-1).join(" ") : "";

    return {
        id: 999999,
        tipoRegistro: "guest",
        guestId,
        nombres,
        apellidos,
        correo: checkout?.email?.trim() || "guest@temporal.local",
        telefono: checkout?.phone?.trim() || "No registrado",
        genero: "prefiero_no_decir",
        fechaRegistro: formatDate(new Date().toISOString()),
        estado: "activo",
        ultimoPedido: pedidos[0]?.fecha ?? "-",
        totalGastado,
        pedidosCompletados: pedidos.length,
        pedidosTotales: pedidos.length,
        actividadReciente: "Actividad guest en sesión",
        ciudad: checkout?.provincia?.trim() || "No especificada",
        direccion: checkout?.address?.trim() || "No especificada",
        planActual: undefined,
        planInicio: undefined,
        planFin: undefined,
        pedidos,
        pagos,
        carritoStorage: carrito,
        wishlistStorageIds: wishlistIds,
        checkoutDraft: checkout ?? undefined,
        recentlyViewedProducts,
        searchHistory,
        checkoutTotalGenerado: totalGastado,
    };
};

export const obtenerClientesParaCrud = async (): Promise<Cliente[]> => {
    const users = await AuthService.getStoredUsers();
    const currentSession = storageManager.auth.get() as AuthSession | null;
    const pedidos = obtenerPedidos();
    const checkout = storageManager.checkout.get() as CheckoutDraft | null;
    const wishlistIds = storageManager.wishlist.get() || [];
    const carrito = (storageManager.cart.get() as StorageCartItem[]) || [];
    const recentlyViewedProducts = storageManager.recentlyViewed.get() || [];
    const searchHistory = storageManager.searchHistory.get() || [];
    const guestRecord = storageManager.guest.get() as { id?: string; createdAt?: string } | null;

    const usersReales = users.filter((user) => !user.id.startsWith("dashboard-user-"));
    const clientesRegistrados = usersReales.map((user, index) => {
        const pedidosUsuario = obtenerPedidosUsuario(pedidos, user);
        const cliente = mapUserToCliente(user, index, pedidosUsuario);

        if (currentSession?.user?.id === user.id) {
            cliente.checkoutDraft = checkout || undefined;
            cliente.recentlyViewedProducts = recentlyViewedProducts;
            cliente.searchHistory = searchHistory;
        }

        return cliente;
    });

    const correoRegistradoSet = new Set(
        clientesRegistrados
            .map((cliente) => cliente.correo)
            .filter(hasText)
            .map(normalizar)
    );

    const correoCheckout = checkout?.email?.trim();
    const pedidosGuest = pedidos.filter((pedido) => {
        const correoPedido = normalizar(pedido.cliente.correo || "");
        return correoPedido.length > 0 && !correoRegistradoSet.has(correoPedido);
    });

    const hayActividadGuest =
        Boolean(guestRecord?.id)
        || checkoutConDatos(checkout)
        || pedidosGuest.length > 0
        || wishlistIds.length > 0
        || carrito.length > 0
        || recentlyViewedProducts.length > 0
        || searchHistory.length > 0;

    const clientesGuest: Cliente[] = [];
    if (hayActividadGuest) {
        clientesGuest.push(
            construirGuestCliente(
                guestRecord?.id || `guest-${Date.now()}`,
                checkout,
                correoCheckout ? pedidosGuest : [],
                wishlistIds,
                carrito,
                recentlyViewedProducts,
                searchHistory
            )
        );
    }

    return [...clientesRegistrados, ...clientesGuest];
};