import type { ReactNode } from "react";

import { useAuth } from "../../context/AuthContext";

type Props = {
    permiso: string | null;
    children: ReactNode;
    fallback?: ReactNode;
};

export const Permiso = ({
    permiso,
    children,
    fallback = null
}: Props) => {

    const { hasPermission } = useAuth();

    if (!permiso) {
        return <>{children}</>;
    }

    if (!hasPermission(permiso)) {
        return <>{fallback}</>;
    }

    return <>{children}</>;
};