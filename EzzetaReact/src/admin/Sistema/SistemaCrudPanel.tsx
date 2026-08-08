import type { PermissionAccess } from '../hooks/usePermissions';

import { ReglasCrudPanel } from './reglas-precios';
import { UsuariosCrudPanel } from './usuarios';
import { RolesCrudPanel } from './usuarios/roles/RolesCrudPanel';
import { CuponesCrudPanel } from './cupones/CuponesCrudPanel';
import { LogsCrudPanel } from './logs';

type SistemaCrudPanelProps = {
  access: PermissionAccess;
};

export const SistemaCrudPanel = ({ access }: SistemaCrudPanelProps) => {

  const correspondeAReglas =
    access.name === 'reglas-precios' ||
    access.name === 'reglas' ||
    access.permissionCodes.some((codigo) =>
      codigo.startsWith('pricing_rules.')
    );

  switch (access.name) {

    case 'reglas-precios':
      return <ReglasCrudPanel />;

    case 'usuarios':
      return <UsuariosCrudPanel access={access} />;

    case 'roles':
      return <RolesCrudPanel access={access} />;

    case 'cupones':
      return <CuponesCrudPanel access={access} />;

    case 'logs':
    case 'auditoria':
      return <LogsCrudPanel access={access} />;

    default:

      if (correspondeAReglas) {
        return <ReglasCrudPanel />;
      }

      return (
        <div className="rounded-none border border-red-300 bg-red-50 p-4 text-red-600">
          No se encontró el módulo solicitado.
        </div>
      );

  }

};