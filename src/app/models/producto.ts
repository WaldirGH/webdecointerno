import { Categoria } from "./categoria";
import { Imagen } from "./imagen";
import { Proveedor } from "./proveedor";

export interface Producto {
    id: number;
    nombre: string;
    precio: number;
    descripcion: string;
    codigoBarra: string;
    categoria: Categoria;
    proveedor: Proveedor;
    imagenes: Imagen[];
}
