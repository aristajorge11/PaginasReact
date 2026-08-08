import type { Rol } from "../TiposUsuarios";

type Props = {
    roles: Rol[];
};

export const ResumenRoles = ({
    roles
}: Props) => {

    const total = roles.length;

    const protegidos =
        roles.filter(rol => rol.protegido).length;

    const tarjetas = [
        {titulo: "Total", valor: total},
        {titulo: "Protegidos", valor: protegidos}
    ];

    return (
        <div className="grid gap-4 md:grid-cols-2">
            {
                tarjetas.map((item) => (
                    <div
                        key={item.titulo}
                        className="rounded-none border border-zinc-200 bg-white p-5"
                    >
                        <p className="text-sm text-zinc-500">{item.titulo}</p>
                        <p className="mt-2 text-3xl font-bold">{item.valor}</p>
                    </div>
                ))
            }
        </div>
    );
};