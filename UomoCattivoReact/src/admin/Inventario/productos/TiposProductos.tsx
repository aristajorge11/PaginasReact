export type GeneroProducto = string;

export type TallaProducto = string;

export interface Producto {
    id:number;
    slug:string;
    nombre:string;
    descripcion:string;
    categoria:string;
    subcategoria:string;
    genero:GeneroProducto;
    precio:number;
    precioAnterior:number;
    imagen:string;
    miniImagenes:string[];
    stock:number;
    tallas:TallaProducto[];
    tallasStock: Partial<Record<TallaProducto, number>>;
    destacado:boolean;
    relacionados:number[];
    extras:string[];
    activo:boolean;
    fechaCreacion:string;
    fechaActualizacion:string;
}