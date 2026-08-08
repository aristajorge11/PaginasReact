import type { Usuario } from "../TiposUsuarios";

type Props = {usuarios: Usuario[];};

export const ResumenUsuarios = ({
    usuarios
}: Props) => {

    const total =
        usuarios.length;

    const activos =
        usuarios.filter(
            usuario =>
                usuario.estado === "activo"
        ).length;

    const inactivos =
        usuarios.filter(
            usuario =>
                usuario.estado === "inactivo"
        ).length;

    const bloqueados =
        usuarios.filter(
            usuario =>
                usuario.estado === "bloqueado"
        ).length;

    const tarjetas = [
        {titulo: "Usuarios",
            valor: total,
            color: "border-zinc-300"
        },
        {titulo: "Activos",
            valor: activos,
            color: "border-green-500"
        },
        {titulo: "Inactivos",
            valor: inactivos,
            color: "border-yellow-500"
        },
        {titulo: "Bloqueados",
            valor: bloqueados,
            color: "border-red-500"
        }
    ];

    return (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {
                tarjetas.map(
                    tarjeta => (
                        <article
                            key={tarjeta.titulo}
                            className={`rounded-none border-l-4 ${tarjeta.color} border border-zinc-200 bg-white p-5 shadow-sm`}
                        >
                            <p className="text-sm text-zinc-500">{tarjeta.titulo}</p>
                            <h2 className="mt-2 text-3xl font-bold">{tarjeta.valor}</h2>
                        </article>
                    )
                )
            }
        </div>
    );
};