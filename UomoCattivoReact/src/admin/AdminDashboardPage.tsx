import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, LogOut, Shield } from 'lucide-react';
import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { ClientesCrudPanel } from './Clientes';
import { InventarioCrudPanel } from './Inventario/InventarioCrudPanel';
import { SistemaCrudPanel } from './Sistema/SistemaCrudPanel';
import { PedidosCrudPanel } from './Ventas/pedidos/PedidosCrudPanel';
import { CarritosPerdidosCrudPanel } from './Ventas/carritos-perdidos';
import { ProductosAnalyticsPanel } from './Ventas/productos/ProductosAnalyticsPanel';
import { usePermissions, type PermissionAccess, type PermissionModule } from './hooks/usePermissions';
import { GenericCrudPanel } from './todos/CrudGenérico';
import { useAuth } from '../context/AuthContext';

const normalizeModuleName = (value: string): string => {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase();
};

const getModulePanel = (module: PermissionModule | null, access: PermissionAccess) => {
  const normalized = normalizeModuleName(module?.label ?? '');
  const accessLabel = normalizeModuleName(access.label);

  if (normalized === 'inventario') {
    return <InventarioCrudPanel access={access} />;
  }

  if (normalized === 'negocio') {
    return <GenericCrudPanel access={access} />;
  }

  if (normalized === 'sistema' || accessLabel === 'logs' || accessLabel === 'auditoria' || normalized === 'logs' || normalized === 'auditoria') {
    return <SistemaCrudPanel access={access} />;
  }

  if (normalized === 'ventas' && accessLabel === 'pedidos') {
    return <PedidosCrudPanel access={access} />;
  }

  if (normalized === 'ventas' && accessLabel === 'carritos perdidos') {
    return <CarritosPerdidosCrudPanel access={access} />;
  }

  if (normalized === 'ventas' && accessLabel === 'productos') {
    return <ProductosAnalyticsPanel />;
  }

  if (normalized === 'clientes') {
    return <ClientesCrudPanel />;
  }

  return <GenericCrudPanel access={access} />;
};

export const AdminDashboardPage = () => {
  const { isAuthenticated, isLoading, login, logout, hasPermission } = useAuth();
  const { modules } = usePermissions();
  const [identifier, setIdentifier] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openModules, setOpenModules] = useState<Record<string, boolean>>({});
  const navigate = useNavigate();
  const location = useLocation();

  const isAdminUser = Boolean(isAuthenticated) && (modules.length > 0 || hasPermission('dashboard.manage') || hasPermission('roles.manage'));

  const isDashboardModule = (module: PermissionModule) => {
    const normalized = normalizeModuleName(module.label);
    if (normalized === 'dashboard') {
      return true;
    }

    return module.accesses.some((access) => normalizeModuleName(access.label) === 'dashboard');
  };

  const visibleModules = useMemo(
    () => modules.filter((module) => !isDashboardModule(module)),
    [modules],
  );

  const currentAccess = useMemo(() => {
    const flatAccesses = modules.flatMap((module) => module.accesses).filter((access) => Boolean(access.path));
    return flatAccesses.find((access) => access.path === location.pathname) ?? null;
  }, [location.pathname, modules]);

  const currentModule = useMemo(() => {
    if (!currentAccess) {
      return null;
    }

    return modules.find((module) => module.accesses.some((access) => access.id === currentAccess.id)) ?? null;
  }, [currentAccess, modules]);

  useEffect(() => {
    if (modules.length === 0) {
      setOpenModules({});
      return;
    }

    setOpenModules((prev) => {
      const next: Record<string, boolean> = {};

      modules.forEach((module, index) => {
        next[module.id] = prev[module.id] ?? index === 0;
      });

      return next;
    });
  }, [modules]);

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await login({ identifier, password });
      navigate('/D-Admin');
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'No se pudo iniciar sesion como administrador.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="flex min-h-screen items-center justify-center bg-zinc-100 text-sm text-zinc-700">Cargando panel...</div>;
  }

  if (!isAuthenticated || !isAdminUser) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-100 px-4 py-8">
        <div className="w-full max-w-lg rounded-none border border-zinc-200 bg-white p-1 shadow-xl">
          <div className="mb-6 text-center">
            <p className="text-xs uppercase tracking-[0.35em] text-zinc-500">Dashboard</p>
            <h1 className="mt-2 text-3xl font-semibold text-zinc-900">Acceso Administrador</h1>
            <p className="mt-3 text-sm text-zinc-600">Ruta protegida: /D-Admin</p>
          </div>

          <form className="space-y-4" onSubmit={handleLogin}>
            <label className="block text-sm text-zinc-700">
              <span className="mb-1 block font-medium">Usuario</span>
              <input
                value={identifier}
                onChange={(event) => setIdentifier(event.target.value)}
                className="w-full rounded-none border border-zinc-300 px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-800"
                placeholder="admin"
                required
              />
            </label>
            <label className="block text-sm text-zinc-700">
              <span className="mb-1 block font-medium">Contraseña</span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-none border border-zinc-300 px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-800"
                placeholder="admin123"
                required
              />
            </label>
            {error ? <p className="text-sm text-red-600">{error}</p> : null}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-none bg-zinc-900 px-3 py-2 text-sm font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:bg-zinc-500"
            >
              {isSubmitting ? 'Ingresando...' : 'Ingresar al dashboard'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-100">
      <div className="grid w-full max-w-[1600px] gap-1 p-4 md:grid-cols-[300px_1fr] md:p-2">
        <aside className="rounded-none border border-zinc-200 bg-white p-2 shadow-sm">
          <div className="mb-4 flex items-center justify-between border-b border-zinc-200 pb-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">D-Admin</p>
              <p className="text-base font-semibold text-zinc-900">Panel</p>
            </div>
            <Shield size={18} className="text-zinc-600" />
          </div>

          <nav className="flex flex-col gap-2">
            {visibleModules.map((module) => {
              const isOpen = openModules[module.id] ?? false;

              return (
                <div key={module.id} className="rounded-none border border-zinc-200 bg-zinc-50 p-1">
                  <button
                    type="button"
                    onClick={() =>
                      setOpenModules((prev) => ({
                        ...prev,
                        [module.id]: !isOpen,
                      }))
                    }
                    className="flex w-full items-center justify-between rounded-none px-3 py-3 text-left text-sm font-semibold uppercase tracking-[0.14em] text-zinc-700 transition hover:bg-red-50 hover:text-red-600"
                  >
                    <span>{module.label}</span>
                    <ChevronDown size={16} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen ? (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="mb-1 flex flex-col gap-1 px-1">
                          {module.accesses.map((access) => (
                            access.path ? (
                              <NavLink
                                key={access.id}
                                to={access.path}
                                className={({ isActive }) =>
                                  `rounded-none px-3 py-2.5 text-sm font-medium transition ${
                                    isActive ? 'bg-zinc-900 text-white' : 'text-zinc-700 hover:bg-red-50 hover:text-red-600'
                                  }`
                                }
                              >
                                {access.label}
                              </NavLink>
                            ) : (
                              <div
                                key={access.id}
                                className="rounded-none border border-dashed border-zinc-300 px-3 py-2.5 text-sm text-zinc-500"
                              >
                                {access.label}
                              </div>
                            )
                          ))}
                        </div>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </div>
              );
            })}

            {modules.length === 0 ? (
              <div className="rounded-none border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-600">
                No tienes modulos visibles con tus permisos actuales.
              </div>
            ) : null}
          </nav>
        </aside>

        <main className="rounded-none border border-zinc-200 bg-white p-3 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-200 pb-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">Modulo activo</p>
              <h2 className="mt-1 text-2xl font-semibold text-zinc-900">{currentAccess?.label ?? 'Dashboard'}</h2>
            </div>

            <button
              type="button"
              onClick={async () => {
                await logout();
                navigate('/D-Admin');
              }}
              className="inline-flex items-center gap-2 rounded-none border border-zinc-300 bg-white px-4 py-2.5 text-sm font-medium text-zinc-800 transition hover:border-red-600 hover:text-red-600"
            >
              <LogOut size={16} /> Cerrar sesión
            </button>
          </div>

          <div className="mt-6 space-y-4">
            {currentAccess ? (
              getModulePanel(currentModule, currentAccess)
            ) : (
              <>
                <p className="text-sm text-zinc-600">
                  Se muestran unicamente los modulos a los que tu usuario tiene acceso. No se renderizan modulos sin permisos ni tarjetas deshabilitadas.
                </p>

                <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(220px,1fr))]">
                  {modules.map((module) => (
                    <article
                      key={module.id}
                      className="rounded-none border border-zinc-300 bg-white p-4 shadow-sm transition hover:border-red-600"
                    >
                      <p className="text-xs uppercase tracking-[0.22em] text-zinc-500">Modulo</p>
                      <h3 className="mt-2 text-base font-semibold text-zinc-900">{module.label}</h3>
                      <p className="mt-2 text-sm text-zinc-600">{module.accesses.length} acceso(s) disponible(s)</p>
                      <ul className="mt-3 space-y-1 text-sm text-zinc-700">
                        {module.accesses.slice(0, 3).map((access) => (
                          <li key={access.id}>- {access.label}</li>
                        ))}
                      </ul>
                    </article>
                  ))}
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};