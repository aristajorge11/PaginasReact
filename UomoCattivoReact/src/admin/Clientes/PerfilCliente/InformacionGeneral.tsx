import type { Cliente } from "../TiposClientes";

type Props = {
    cliente: Cliente;
};

export const InformacionGeneral = ({ cliente }: Props) => {
    return (
        <section className="rounded-none border border-zinc-200 bg-white p-6">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h3 className="text-lg font-semibold text-zinc-900">Información general</h3>
                    <p className="mt-1 text-sm text-zinc-500">Datos de contacto y estado del cliente.</p>
                </div>
            </div>
            <div className="mt-2 grid gap-4 sm:grid-cols-4">
                <div>
                    <p className="text-sm text-zinc-500">Nombre</p>
                    <p className="font-medium">{cliente.nombres}</p>
                </div>
                <div>
                    <p className="text-sm text-zinc-500">Apellidos</p>
                    <p className="font-medium">{cliente.apellidos}</p>
                </div>
                <div>
                    <p className="text-sm text-zinc-500">Usuario</p>
                    <p className="font-medium">{cliente.usuario ?? "No aplica"}</p>
                </div>
                <div>
                    <p className="text-sm text-zinc-500">Correo</p>
                    <p className="font-medium">{cliente.correo}</p>
                </div>
                <div>
                    <p className="text-sm text-zinc-500">Teléfono</p>
                    <p className="font-medium">{cliente.telefono}</p>
                </div>
                <div>
                    <p className="text-sm text-zinc-500">Dirección</p>
                    <p className="font-medium">{cliente.direccion}</p>
                </div>
                <div>
                    <p className="text-sm text-zinc-500">DNI / RUC</p>
                    <p className="font-medium">{cliente.documento ?? "No registrado"}</p>
                </div>
                <div>
                    <p className="text-sm text-zinc-500">Género</p>
                    <p className="font-medium">{cliente.genero}</p>
                </div>
                <div>
                    <p className="text-sm text-zinc-500">Tipo de cliente</p>
                    <p className="font-medium capitalize">{cliente.tipoRegistro}</p>
                </div>
                <div>
                    <p className="text-sm text-zinc-500">Estado</p>
                    <p className="font-medium">{cliente.estado}</p>
                </div>
                <div>
                    <p className="text-sm text-zinc-500">Fecha de registro</p>
                    <p className="font-medium">{cliente.fechaRegistro}</p>
                </div>
            </div>
        </section>
    );
};
