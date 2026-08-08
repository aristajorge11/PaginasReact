import type { PermissionAccess } from '../hooks/usePermissions';

import { ProductosCrudPanel } from './productos';

type InventarioCrudPanelProps = {
  access: PermissionAccess;
};

export const InventarioCrudPanel = ({ access }: InventarioCrudPanelProps) => {
  const correspondeAProductos = access.name === 'product'
    || access.name === 'productos'
    || access.permissionCodes.some((codigoPermiso) => codigoPermiso.startsWith('product.'));

  switch (access.name) {
    case 'productos':
      return <ProductosCrudPanel access={access} />;

    default:
      if (correspondeAProductos) {
        return <ProductosCrudPanel access={access} />;
      }

      return (
        <div className="rounded-none border border-red-300 bg-red-50 p-4 text-red-600">
          No se encontró el módulo solicitado.
        </div>
      );
  }
};