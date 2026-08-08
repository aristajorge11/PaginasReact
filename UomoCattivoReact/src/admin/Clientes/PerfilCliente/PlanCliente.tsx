import type { PlanCliente as PlanClienteType } from "../TiposClientes";

type Props = {
    plan?: PlanClienteType;
};

export const PlanClienteSection = ({ plan }: Props) => {
    return (
        <section className="rounded-none border border-zinc-200 bg-white p-6">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h3 className="text-lg font-semibold text-zinc-900">Plan</h3>
                    <p className="mt-1 text-sm text-zinc-500">Información del plan contratado.</p>
                </div>
            </div>
            <div className="mt-6">
                {!plan ? (
                    <p className="text-sm text-zinc-500">El cliente no tiene plan activo.</p>
                ) : (
                    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                        <div>
                            <p className="text-sm text-zinc-500">Nombre del plan</p>
                            <p className="font-medium">{plan.nombre}</p>
                        </div>
                        <div>
                            <p className="text-sm text-zinc-500">Precio mensual</p>
                            <p className="font-medium">{plan.precioMensual}</p>
                        </div>
                        <div>
                            <p className="text-sm text-zinc-500">Descuento</p>
                            <p className="font-medium">{plan.descuento}</p>
                        </div>
                        <div className="sm:col-span-2 lg:col-span-1">
                            <p className="text-sm text-zinc-500">Periodo</p>
                            <p className="font-medium">{plan.fechaInicio} → {plan.fechaFin}</p>
                        </div>
                        <div className="sm:col-span-2 lg:col-span-3">
                            <p className="text-sm text-zinc-500">Beneficios</p>
                            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-zinc-700">
                                {plan.beneficios.map((beneficio, index) => (
                                    <li key={index}>{beneficio}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};
