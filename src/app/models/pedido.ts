export interface DetallePedido {
    id: number;
    nombreProducto: string;
    imgUrl: string;
    cantidad: number;
    precioUnitario: number;
    subtotal: number;
}

export interface Pedido {
    id: number;
    nombreCliente: string;
    email: string;
    telefono: string;
    tipoEntrega: 'DELIVERY' | 'RECOJO_TIENDA';
    direccion: string;
    quienRecoge: string;
    observacion: string;
    estado: 'PENDIENTE' | 'EN_PROCESO' | 'ENVIADO' | 'ENTREGADO';
    tipoComprobante: 'BOLETA' | 'FACTURA';
    ruc: string;
    razonSocial: string;
    total: number;
    fechaCreacion: string;
    cliente: any;
    detalles: DetallePedido[];
}
