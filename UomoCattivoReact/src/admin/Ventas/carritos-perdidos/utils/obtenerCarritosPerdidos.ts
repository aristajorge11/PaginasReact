import { storageManager, StorageKeys } from "../../../../storage";
import { calcularTotalesCarrito } from "./calcularTotalesCarrito";
import type { CarritoPerdido, StorageCartItem } from "../tipos/TiposCarritosPerdidos";

type PossibleCartValue = StorageCartItem[] | null;

type AuthSessionLike = {
    user?: {
        id?: string;
    } | null;
} | null;

export const determinarOrigenCarrito = (context: {
    userId?: string;
    authSession?: AuthSessionLike;
    guestId?: string;
    registeredUserIds?: string[];
} = {}): CarritoPerdido["origen"] => {
    if (context.authSession?.user?.id) {
        return "usuario";
    }

    const registeredUserIds = new Set(
        (context.registeredUserIds ?? []).filter((value): value is string => Boolean(value))
    );

    if (context.userId && registeredUserIds.has(context.userId)) {
        return "usuario";
    }

    if (context.guestId || !context.userId) {
        return "guest";
    }

    return "guest";
};

const parseCartValue = (value: string | null): StorageCartItem[] => {
    if (!value) {
        return [];
    }
    try {
        const parsed = JSON.parse(value) as PossibleCartValue;
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
};

const obtenerFechaCreacionCarrito = (key: string, fallback?: string) => {
    const metaKey = `${key}.meta`;
    const meta = storageManager.get<{ createdAt?: string }>(metaKey);
    return meta?.createdAt || fallback || new Date().toISOString();
};

const buildCarritoPerdido = (
    items: StorageCartItem[],
    id: string,
    origen: CarritoPerdido["origen"],
    metadata: Partial<Pick<CarritoPerdido, "userId" | "guestId" | "checkoutEmail" | "checkoutPhone" | "couponCode">> = {},
    fechaCreacion?: string
): CarritoPerdido => {
    const { total, cantidadItems } = calcularTotalesCarrito(items);
    const fechaBase = fechaCreacion || new Date().toISOString();
    return {
        id,
        origen,
        ...metadata,
        cantidadItems,
        total,
        fecha: fechaBase,
        ultimaActividad: fechaBase,
        productos: items
    };
};

export const obtenerCarritosPerdidos = (): CarritoPerdido[] => {
    if (typeof window === "undefined") {
        return [];
    }

    const carritos: CarritoPerdido[] = [];

    const currentCart = storageManager.cart.get() as StorageCartItem[] | null;
    const guestRecord = storageManager.guest.get() as { id?: string; createdAt?: string } | null;
    const checkoutDraft = storageManager.checkout.get() as { email?: string; phone?: string } | null;
    const appliedCoupon = storageManager.cart.appliedCoupon.get() as { code?: string } | null;
    const authSession = storageManager.auth.get() as AuthSessionLike;
    const registeredUsers = storageManager.get<Array<Record<string, unknown>>>(StorageKeys.USERS) || [];
    const registeredUserIds = registeredUsers
        .map((user) => (typeof user?.id === "string" ? user.id : null))
        .filter((value): value is string => Boolean(value));

    if (currentCart && currentCart.length > 0) {
        const origen = determinarOrigenCarrito({
            authSession,
            guestId: guestRecord?.id,
            registeredUserIds
        });
        carritos.push(
            buildCarritoPerdido(currentCart, StorageKeys.CART, origen, {
                guestId: guestRecord?.id,
                checkoutEmail: checkoutDraft?.email,
                checkoutPhone: checkoutDraft?.phone,
                couponCode: appliedCoupon?.code
            }, obtenerFechaCreacionCarrito(StorageKeys.CART, guestRecord?.createdAt))
        );
    }

    const localKeys = Object.keys(window.localStorage);
    const cartUserKeys = localKeys.filter((key) =>
        key.startsWith(`${StorageKeys.CART}.`) && key !== StorageKeys.CART
    );

    cartUserKeys.forEach((key) => {
        const items = parseCartValue(window.localStorage.getItem(key));
        if (items.length === 0) {
            return;
        }
        const userId = key.replace(`${StorageKeys.CART}.`, "");
        const origen = determinarOrigenCarrito({ userId, registeredUserIds });
        carritos.push(
            buildCarritoPerdido(items, key, origen, {
                userId
            }, obtenerFechaCreacionCarrito(key))
        );
    });

    const syncKey = `${StorageKeys.SYNC}.cartByUser`;
    const syncValue = storageManager.get<Record<string, any>>(syncKey) || {};

    Object.keys(syncValue).forEach((userId) => {
        const synced = syncValue[userId]?.cart as StorageCartItem[] | undefined;
        if (!Array.isArray(synced) || synced.length === 0) {
            return;
        }

        const existing = carritos.some((carrito) => carrito.userId === userId);
        if (!existing) {
            const origen = determinarOrigenCarrito({ userId, registeredUserIds });
            carritos.push(
                buildCarritoPerdido(synced, `${syncKey}.${userId}`, origen, {
                    userId
                }, obtenerFechaCreacionCarrito(`${syncKey}.${userId}`))
            );
        }
    });

    return carritos;
};
