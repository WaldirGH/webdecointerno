export interface Inventario {
    id: number;
    productoId: number;
    nombreProducto: string;
    stock: number;
    fechaActualizacion: string;
}

export interface Movimiento {
    id: number;
    nombreProducto: string;
    tipo: 'ENTRADA' | 'SALIDA' | 'AJUSTE';
    cantidad: number;
    motivo: string;
    stockAnterior: number;
    stockNuevo: number;
    fecha: string;
    pedidoId: number;
}

export interface InventarioRequest {
    codigoBarra: string;
    cantidad: number;
    motivo: string;
    tipo: 'ENTRADA' | 'SALIDA' | 'AJUSTE';
}