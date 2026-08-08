/**
 * En producción esta función debería ser reemplazada
 * por el backend utilizando SHA2
 */

export const encriptarPassword = (
    contraseña: string
): string => {

    return btoa(
        contraseña.trim()
    );

};

export const compararPassword = (
    contraseña: string,
    contraseñaEncriptada: string
): boolean => {

    return (
        encriptarPassword(
            contraseña
        ) === contraseñaEncriptada
    );

};