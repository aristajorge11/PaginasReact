import type { ReglaPrecio } from "../TiposReglas";
import { ReglaProducto } from "./tipos/ReglaProducto";
import { ReglaBOGOGratis } from "./tipos/ReglaBOGOGratis";
import { ReglaBOGODescuento } from "./tipos/ReglaBOGODescuento";
import { ReglaVolumen } from "./tipos/ReglaVolumen";
import { ReglaPerfil } from "./tipos/ReglaPerfil";
import { ReglaCarrito } from "./tipos/ReglaCarrito";

type Props = {
    regla: ReglaPrecio;

    establecerRegla: React.Dispatch<
        React.SetStateAction<ReglaPrecio>
    >;
};

export const RenderizadorTipoRegla = ({
    regla,
    establecerRegla
}: Props) => {
        switch (regla.tipo) {

        case "producto":

            return (
                <ReglaProducto
                    regla={regla}
                    establecerRegla={establecerRegla}
                />
            );

        case "bogo_gratis":

            return (
                <ReglaBOGOGratis
                    regla={regla}
                    establecerRegla={establecerRegla}
                />
            );

        case "bogo_descuento":

            return (
                <ReglaBOGODescuento
                    regla={regla}
                    establecerRegla={establecerRegla}
                />
            );

        case "volumen":

            return (
                <ReglaVolumen
                    regla={regla}
                    establecerRegla={establecerRegla}
                />
            );

        case "perfil":

            return (
                <ReglaPerfil
                    regla={regla}
                    establecerRegla={establecerRegla}
                />
            );

        case "carrito":

            return (
                <ReglaCarrito
                    regla={regla}
                    establecerRegla={establecerRegla}
                />
            );

        default:

            return null;

    }

};