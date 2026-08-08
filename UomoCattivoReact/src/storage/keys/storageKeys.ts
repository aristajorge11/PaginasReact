export const StorageKeys = {
	AUTH: 'ezzeta.wholesale.auth',
	USERS: 'ezzeta.wholesale.users',
	ORDERS: 'ezzeta.wholesale.orders',
	CART: 'ezzeta.wholesale.cart',
	APPLIED_COUPON: 'ezzeta.cart.appliedCoupon',
	WISHLIST: 'ezzeta.wholesale.wishlist',
	WISHLIST_FAVORITES_LEGACY: 'ezzeta.wishlist.favorites',
	WISHLIST_CART_LEGACY: 'ezzeta.wishlist.cart',
	PRODUCTOS: 'maxeta.productos',
	PRODUCTOS_CLASIFICACIONES: 'maxeta.productos.clasificaciones',
	CLASIFICACIONES_EXPANDIDO: 'maxeta.productos.clasificaciones.expandido',
	CLASIFICACIONES_CATEGORIAS_EXPANDIDO: 'maxeta.productos.clasificaciones.categorias.expandido',
	CLASIFICACIONES_SUBCATEGORIAS_EXPANDIDO: 'maxeta.productos.clasificaciones.subcategorias.expandido',
	CLASIFICACIONES_GENEROS_EXPANDIDO: 'maxeta.productos.clasificaciones.generos.expandido',
	CLASIFICACIONES_TALLAS_EXPANDIDO: 'maxeta.productos.clasificaciones.tallas.expandido',
	REGLAS_PRECIOS: 'maxeta.reglas-precios',
	ROLES: 'roles',
	USUARIOS: 'usuarios',
	PEDIDOS: 'pedidos',
	PROMO_CODES: 'promoCodes',
	ROLES_UPDATED: 'ezzeta.roles.updated',
	CHECKOUT: 'ezzeta.wholesale.checkout',
	RECENTLY_VIEWED: 'ezzeta.wholesale.recentlyViewed',
	SEARCH_HISTORY: 'ezzeta.wholesale.searchHistory',
	GUEST: 'ezzeta.wholesale.guest',
	SYNC: 'ezzeta.wholesale.sync',
} as const;

export type StorageKey = typeof StorageKeys[keyof typeof StorageKeys];

export default StorageKeys;
