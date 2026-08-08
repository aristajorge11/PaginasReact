import type {
    Cliente,
    ClientePedido,
    ClientePago,
    CarritoItem,
    WishlistItem,
    DireccionCliente,
    PlanCliente,
    ComparativaRegistro,
    KpiCliente,
    RankingCliente
} from "./TiposClientes";

export const clientesMock: Cliente[] = [
    {
        id: 1,
        tipoRegistro: "registrado",
        nombres: "Ana",
        apellidos: "Pérez",
        usuario: "ana.perez",
        correo: "ana.perez@ezzeta.pe",
        telefono: "+51 912 345 678",
        documento: "DNI 43219876",
        genero: "femenino",
        fechaRegistro: "2025-09-12",
        estado: "activo",
        ultimoPedido: "2026-07-28",
        totalGastado: 2340.75,
        pedidosCompletados: 18,
        pedidosTotales: 22,
        actividadReciente: "Compra reciente",
        ciudad: "Lima",
        direccion: "Av. El Polo 678"
    },
    {
        id: 2,
        tipoRegistro: "registrado",
        nombres: "Carlos",
        apellidos: "González",
        usuario: "carlos.gonzalez",
        correo: "carlos.gonzalez@ezzeta.pe",
        telefono: "+51 987 654 321",
        documento: "DNI 46871290",
        genero: "masculino",
        fechaRegistro: "2025-12-05",
        estado: "activo",
        ultimoPedido: "2026-06-15",
        totalGastado: 1875.0,
        pedidosCompletados: 12,
        pedidosTotales: 14,
        actividadReciente: "Pedido en curso",
        ciudad: "Arequipa",
        direccion: "Jr. Los Incas 412"
    },
    {
        id: 3,
        tipoRegistro: "registrado",
        nombres: "Valeria",
        apellidos: "Salazar",
        usuario: "valeria.salazar",
        correo: "valeria.salazar@ezzeta.pe",
        telefono: "+51 913 222 334",
        documento: "DNI 44110773",
        genero: "femenino",
        fechaRegistro: "2026-01-18",
        estado: "inactivo",
        ultimoPedido: "2026-02-10",
        totalGastado: 940.9,
        pedidosCompletados: 7,
        pedidosTotales: 11,
        actividadReciente: "Sin compras recientes",
        ciudad: "Trujillo",
        direccion: "Calle San Martín 59"
    },
    {
        id: 4,
        tipoRegistro: "registrado",
        nombres: "Jorge",
        apellidos: "Fuentes",
        usuario: "jorge.fuentes",
        correo: "jorge.fuentes@ezzeta.pe",
        telefono: "+51 922 111 223",
        documento: "RUC 20499887761",
        genero: "masculino",
        fechaRegistro: "2026-04-02",
        estado: "activo",
        ultimoPedido: "2026-07-30",
        totalGastado: 3210.5,
        pedidosCompletados: 24,
        pedidosTotales: 32,
        actividadReciente: "Activo en los últimos 7 días",
        ciudad: "Cusco",
        direccion: "Av. El Sol 204"
    },
    {
        id: 5,
        tipoRegistro: "guest",
        guestId: "guest_4fa03f22a",
        nombres: "Marlon",
        apellidos: "Rivas",
        correo: "marlon.rivas@gmail.com",
        telefono: "+51 945 001 221",
        documento: "DNI 72881154",
        genero: "prefiero_no_decir",
        fechaRegistro: "2026-07-31",
        estado: "activo",
        ultimoPedido: "2026-08-01",
        totalGastado: 0,
        pedidosCompletados: 1,
        pedidosTotales: 1,
        actividadReciente: "Checkout reciente",
        ciudad: "Lima",
        direccion: "Jr. Huallaga 928",
        checkoutTotalGenerado: 289.9,
        checkoutDraft: {
            name: "Marlon Rivas",
            email: "marlon.rivas@gmail.com",
            phone: "+51 945 001 221",
            address: "Jr. Huallaga 928",
            departamento: "Lima",
            provincia: "Lima",
            distrito: "Cercado de Lima",
            paymentMethod: "Yape",
            referencia: "Frente al colegio"
        },
        carritoStorage: [
            { productId: 204, quantity: 1, size: "M" },
            { productId: 319, quantity: 2, size: "L" }
        ],
        wishlistStorageIds: [88, 204, 319],
        recentlyViewedProducts: ["Producto 204", "Producto 319", "Producto 88"],
        searchHistory: ["polos oversize", "zapatillas running", "casacas impermeables"]
    }
];

export const kpisClientesMock: KpiCliente[] = [
    {
        titulo: "Clientes activos",
        valor: "3,120",
        descripcion: "Clientes que han iniciado sesión en los últimos 30 días.",
        cambio: "+12% respecto a la semana pasada"
    },
    {
        titulo: "Compras totales",
        valor: "S/ 124.560",
        descripcion: "Valor total de ventas generadas por clientes registrados.",
        cambio: "+8% respecto al mes anterior"
    },
    {
        titulo: "Pedidos completados",
        valor: "5.430",
        descripcion: "Pedidos exitosos procesados en el último mes.",
        cambio: "+4.5%"
    },
    {
        titulo: "Tasa de retención",
        valor: "68%",
        descripcion: "Clientes que han repetido compra en los últimos 90 días.",
        cambio: "+3 puntos"
    }
];

export const comparativaRegistroClientesMock: ComparativaRegistro[] = [
    {
        tipo: "registrado",
        cantidad: 3120,
        porcentaje: 72
    },
    {
        tipo: "guest",
        cantidad: 1210,
        porcentaje: 28
    }
];

export const rankingClientesMock: RankingCliente[] = [
    {
        posicion: 1,
        nombre: "Jorge Fuentes",
        valor: "S/ 3.210,50",
        detalle: "24 pedidos"
    },
    {
        posicion: 2,
        nombre: "Ana Pérez",
        valor: "S/ 2.340,75",
        detalle: "18 pedidos"
    },
    {
        posicion: 3,
        nombre: "Carlos González",
        valor: "S/ 1.875,00",
        detalle: "12 pedidos"
    }
];

export const pedidosClienteMock: ClientePedido[] = [
    {
        id: 101,
        clienteId: 1,
        fecha: "2026-07-28",
        estado: "Entregado",
        total: 245.0,
        items: 3,
        pedidoId: "EZ-1001"
    },
    {
        id: 102,
        clienteId: 1,
        fecha: "2026-07-12",
        estado: "En tránsito",
        total: 180.5,
        items: 2,
        pedidoId: "EZ-0984"
    },
    {
        id: 103,
        clienteId: 2,
        fecha: "2026-06-15",
        estado: "Entregado",
        total: 120.0,
        items: 1,
        pedidoId: "EZ-0932"
    },
    {
        id: 104,
        clienteId: 4,
        fecha: "2026-07-30",
        estado: "Pendiente",
        total: 410.0,
        items: 5,
        pedidoId: "EZ-1014"
    },
    {
        id: 105,
        clienteId: 5,
        fecha: "2026-08-01",
        estado: "Entregado",
        total: 289.9,
        items: 3,
        pedidoId: "CHK-5001"
    }
];

export const pagosClienteMock: ClientePago[] = [
    {
        id: 1,
        clienteId: 1,
        fecha: "2026-07-28",
        metodo: "Tarjeta de crédito",
        monto: 245.0,
        estado: "pagado",
        referencia: "PAY-7782"
    },
    {
        id: 2,
        clienteId: 1,
        fecha: "2026-07-12",
        metodo: "Pago en línea",
        monto: 180.5,
        estado: "pagado",
        referencia: "PAY-7721"
    },
    {
        id: 3,
        clienteId: 2,
        fecha: "2026-06-15",
        metodo: "Tarjeta de débito",
        monto: 120.0,
        estado: "pagado",
        referencia: "PAY-7603"
    },
    {
        id: 4,
        clienteId: 4,
        fecha: "2026-07-30",
        metodo: "Transferencia bancaria",
        monto: 410.0,
        estado: "pendiente",
        referencia: "PAY-7901"
    },
    {
        id: 5,
        clienteId: 5,
        fecha: "2026-08-01",
        metodo: "Yape",
        monto: 289.9,
        estado: "pagado",
        referencia: "PAY-GUEST-5001"
    }
];

export const carritoClienteMock: CarritoItem[] = [
    {
        id: 1,
        clienteId: 1,
        nombre: "Zapatos deportivos Ezzeta",
        cantidad: 1,
        precio: 125.0
    },
    {
        id: 2,
        clienteId: 1,
        nombre: "Camiseta técnica",
        cantidad: 2,
        precio: 60.0
    }
];

export const wishlistClienteMock: WishlistItem[] = [
    {
        id: 1,
        clienteId: 1,
        nombre: "Pantalón cargo premium",
        precio: 120.0,
        enStock: true
    },
    {
        id: 2,
        clienteId: 1,
        nombre: "Sudadera Oversize",
        precio: 95.0,
        enStock: false
    }
];

export const direccionesClienteMock: DireccionCliente[] = [
    {
        id: 1,
        clienteId: 1,
        etiqueta: "Casa",
        direccion: "Av. El Polo 678",
        ciudad: "Lima",
        pais: "Perú",
        esPrincipal: true
    },
    {
        id: 2,
        clienteId: 1,
        etiqueta: "Oficina",
        direccion: "Av. Arequipa 1234",
        ciudad: "Lima",
        pais: "Perú",
        esPrincipal: false
    }
];

export const planesClienteMock: PlanCliente[] = [
    {
        clienteId: 1,
        nombre: "Plan Oro",
        descripcion: "Descuentos exclusivos y atención prioritaria.",
        precioMensual: "S/ 149",
        descuento: "20%",
        fechaInicio: "2026-06-01",
        fechaFin: "2026-08-01",
        beneficios: [
            "Acceso a ofertas exclusivas",
            "Envío prioritario",
            "Soporte premium"
        ]
    },
    {
        clienteId: 2,
        nombre: "Plan Plata",
        descripcion: "Mayor control y descuentos moderados.",
        precioMensual: "S/ 79",
        descuento: "12%",
        fechaInicio: "2026-05-15",
        fechaFin: "2026-07-15",
        beneficios: [
            "Descuentos exclusivos",
            "Soporte estándar"
        ]
    },
    {
        clienteId: 4,
        nombre: "Plan Bronce",
        descripcion: "Beneficios básicos para clientes frecuentes.",
        precioMensual: "S/ 29",
        descuento: "5%",
        fechaInicio: "2026-07-01",
        fechaFin: "2026-08-01",
        beneficios: [
            "Acceso a ofertas especiales",
            "Soporte básico"
        ]
    }
];
