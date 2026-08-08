import type { Pedido } from './TiposPedidos';

export function validarPedido(pedido: Pedido): string[] {
    const errores: string[] = [];
    if (!pedido.numeroPedido.trim()) {
        errores.push('Debe existir al menos 1');
    }
    if (!pedido.cliente.nombre.trim()) {
        errores.push('Seleccionar un cliente');
    }
    if(pedido.productos.length === 0) {
        errores.push('Debe existir al menos 1 producto');
    }
    if (pedido.total <= 0) {
        errores.push('El total del pedido debe ser mayor a 0');
    }
    if(!pedido.fechaPedido){
        errores.push('Debe indicar fecha de pedido');
    }
    return errores;
}