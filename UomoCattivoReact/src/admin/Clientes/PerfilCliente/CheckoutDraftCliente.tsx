import type { CheckoutDraft } from "../../../storage/checkout/checkoutDraftStorage";

type Props = {
    checkoutDraft?: CheckoutDraft;
};

export const CheckoutDraftCliente = ({ checkoutDraft }: Props) => {
    if (!checkoutDraft || Object.keys(checkoutDraft).length === 0) {
        return null;
    }

    return (
        <section className="rounded-none border border-zinc-200 bg-white p-6">
            <div>
                <h3 className="text-lg font-semibold text-zinc-900">Checkout pendiente</h3>
                <p className="mt-1 text-sm text-zinc-500">Borrador de pago guardado temporalmente.</p>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {checkoutDraft.name && (
                    <div>
                        <p className="text-sm text-zinc-500">Nombre</p>
                        <p className="font-medium">{checkoutDraft.name}</p>
                    </div>
                )}
                {checkoutDraft.email && (
                    <div>
                        <p className="text-sm text-zinc-500">Correo</p>
                        <p className="font-medium">{checkoutDraft.email}</p>
                    </div>
                )}
                {checkoutDraft.phone && (
                    <div>
                        <p className="text-sm text-zinc-500">Teléfono</p>
                        <p className="font-medium">{checkoutDraft.phone}</p>
                    </div>
                )}
                {checkoutDraft.address && (
                    <div className="sm:col-span-2">
                        <p className="text-sm text-zinc-500">Dirección</p>
                        <p className="font-medium">{checkoutDraft.address}</p>
                    </div>
                )}
                {checkoutDraft.departamento && (
                    <div>
                        <p className="text-sm text-zinc-500">Departamento</p>
                        <p className="font-medium">{checkoutDraft.departamento}</p>
                    </div>
                )}
                {checkoutDraft.provincia && (
                    <div>
                        <p className="text-sm text-zinc-500">Provincia</p>
                        <p className="font-medium">{checkoutDraft.provincia}</p>
                    </div>
                )}
                {checkoutDraft.distrito && (
                    <div>
                        <p className="text-sm text-zinc-500">Distrito</p>
                        <p className="font-medium">{checkoutDraft.distrito}</p>
                    </div>
                )}
                {checkoutDraft.paymentMethod && (
                    <div className="sm:col-span-2 lg:col-span-1">
                        <p className="text-sm text-zinc-500">Método de pago</p>
                        <p className="font-medium">{checkoutDraft.paymentMethod}</p>
                    </div>
                )}
                {checkoutDraft.referencia && (
                    <div className="sm:col-span-2 lg:col-span-1">
                        <p className="text-sm text-zinc-500">Referencia</p>
                        <p className="font-medium">{checkoutDraft.referencia}</p>
                    </div>
                )}
            </div>
        </section>
    );
};
