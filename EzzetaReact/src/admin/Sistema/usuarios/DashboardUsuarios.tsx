import type { Usuario, Rol } from "./TiposUsuarios";
import { ResumenUsuarios } from "./usuarios/ResumenUsuarios";

type Props = {
    usuarios: Usuario[];
    roles: Rol[];
};

export const DashboardUsuarios = ({
    usuarios,
    roles
}: Props) => {

    const ultimosAccesos = [...usuarios]
        .filter(usuario => usuario.ultimoAcceso)
        .sort(
            (a, b) =>
                new Date(b.ultimoAcceso).getTime() -
                new Date(a.ultimoAcceso).getTime()
        )
        .slice(0, 5);

    const usuariosPorRol = roles.map(rol => ({
        nombre: rol.nombre,
        cantidad:
            usuarios.filter(
                usuario =>
                    usuario.rolId === rol.id
            ).length
    }));

    return (
        <div className="space-y-6">
            <ResumenUsuarios
                usuarios={usuarios}
            />
            <div className="grid gap-6 lg:grid-cols-2">
                {/* Últimos accesos */}
                <section className="rounded-none border border-zinc-200 bg-white p-6">
                    <h3 className="mb-4 text-lg font-semibold">Últimos accesos</h3>
                    <div className="space-y-3">
                        {
                            ultimosAccesos.length === 0 && (
                                <p className="text-sm text-zinc-500">Sin registros.</p>
                            )
                        }
                        {
                            ultimosAccesos.map(usuario => (
                                <div
                                    key={usuario.id}
                                    className="flex items-center justify-between border-b pb-2 last:border-none"
                                >
                                    <div>
                                        <p className="font-medium">{usuario.nombres} {usuario.apellidos}</p>
                                        <p className="text-sm text-zinc-500">@{usuario.usuario}</p>
                                    </div>
                                    <span className="text-sm text-zinc-500">
                                        {new Date(usuario.ultimoAcceso).toLocaleString()}
                                    </span>
                                </div>
                            ))
                        }
                    </div>
                </section>
                {/* Usuarios por rol */}
                <section className="rounded-none border border-zinc-200 bg-white p-6">
                    <h3 className="mb-4 text-lg font-semibold">Usuarios por rol</h3>
                    <div className="space-y-3">
                        {
                            usuariosPorRol.map(rol => (
                                <div
                                    key={rol.nombre}
                                    className="flex items-center justify-between border-b pb-2 last:border-none"
                                >
                                    <span>{rol.nombre}</span>
                                    <span className="rounded-full bg-zinc-100 px-3 py-1 text-sm font-medium">
                                        {rol.cantidad}</span>
                                </div>
                            ))
                        }
                    </div>
                </section>
            </div>
        </div>
    );
};