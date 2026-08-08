import { useMemo, useState } from 'react';
import { storageManager } from '../../storage';
import { useAuth } from '../../context/AuthContext';
import type { PermissionAccess } from '../hooks/usePermissions';

type GenericCrudPanelProps = {
  access: PermissionAccess;
};

type CrudItem = {
  id: string;
  name: string;
  description: string;
  status: 'activo' | 'inactivo';
  updatedAt: string;
};

type CrudFormState = {
  name: string;
  description: string;
  status: 'activo' | 'inactivo';
};

const STORAGE_PREFIX = 'ezzeta.dynamic-crud';

const nowIso = (): string => new Date().toISOString();

const buildDefaultRows = (accessLabel: string): CrudItem[] => {
  const base = accessLabel.trim() || 'Registro';

  return [
    {
      id: crypto.randomUUID(),
      name: `${base} A`,
      description: `Registro inicial de ${base.toLowerCase()}.`,
      status: 'activo',
      updatedAt: nowIso(),
    },
    {
      id: crypto.randomUUID(),
      name: `${base} B`,
      description: `Segundo registro de ${base.toLowerCase()}.`,
      status: 'inactivo',
      updatedAt: nowIso(),
    },
  ];
};

const readCrudData = (storageKey: string, accessLabel: string): CrudItem[] => {
  const raw = storageManager.get<string>(storageKey) as string | null;

  if (!raw) {
    const defaults = buildDefaultRows(accessLabel);
    storageManager.set(storageKey, JSON.stringify(defaults));
    return defaults;
  }

  try {
    const parsed = JSON.parse(String(raw)) as unknown;

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .filter((item): item is Record<string, unknown> => Boolean(item) && typeof item === 'object' && !Array.isArray(item))
      .map((item) => ({
        id: typeof item.id === 'string' ? item.id : crypto.randomUUID(),
        name: typeof item.name === 'string' ? item.name : 'Sin nombre',
        description: typeof item.description === 'string' ? item.description : '',
        status: item.status === 'inactivo' ? 'inactivo' : 'activo',
        updatedAt: typeof item.updatedAt === 'string' ? item.updatedAt : nowIso(),
      }));
  } catch {
    return [];
  }
};

const writeCrudData = (storageKey: string, items: CrudItem[]) => {
  storageManager.set(storageKey, JSON.stringify(items));
};

export const GenericCrudPanel = ({ access }: GenericCrudPanelProps) => {
  const { hasPermission } = useAuth();
  const storageKey = `${STORAGE_PREFIX}.${access.id}`;

  const canView = access.actions.view ? hasPermission(access.actions.view) : true;
  const canCreate = access.actions.create ? hasPermission(access.actions.create) : false;
  const canUpdate = access.actions.update ? hasPermission(access.actions.update) : false;
  const canDelete = access.actions.delete ? hasPermission(access.actions.delete) : false;

  const [items, setItems] = useState<CrudItem[]>(() => readCrudData(storageKey, access.label));
  const [query, setQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [form, setForm] = useState<CrudFormState>({
    name: '',
    description: '',
    status: 'activo',
  });

  const visibleItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return items;
    }

    return items.filter((item) => [item.name, item.description, item.status].join(' ').toLowerCase().includes(normalizedQuery));
  }, [items, query]);

  const resetForm = () => {
    setEditingId(null);
    setForm({ name: '', description: '', status: 'activo' });
    setIsFormOpen(false);
  };

  const openCreate = () => {
    setEditingId(null);
    setForm({ name: '', description: '', status: 'activo' });
    setIsFormOpen(true);
  };

  const openEdit = (item: CrudItem) => {
    setEditingId(item.id);
    setForm({
      name: item.name,
      description: item.description,
      status: item.status,
    });
    setIsFormOpen(true);
  };

  const saveItems = (nextItems: CrudItem[]) => {
    setItems(nextItems);
    writeCrudData(storageKey, nextItems);
  };

  const handleSave = () => {
    const nextName = form.name.trim();

    if (!nextName) {
      return;
    }

    if (editingId) {
      if (!canUpdate) {
        return;
      }

      const nextItems = items.map((item) =>
        item.id === editingId
          ? {
              ...item,
              name: nextName,
              description: form.description.trim(),
              status: form.status,
              updatedAt: nowIso(),
            }
          : item,
      );

      saveItems(nextItems);
      resetForm();
      return;
    }

    if (!canCreate) {
      return;
    }

    const nextItem: CrudItem = {
      id: crypto.randomUUID(),
      name: nextName,
      description: form.description.trim(),
      status: form.status,
      updatedAt: nowIso(),
    };

    saveItems([nextItem, ...items]);
    resetForm();
  };

  const handleDelete = (id: string) => {
    if (!canDelete) {
      return;
    }

    const nextItems = items.filter((item) => item.id !== id);
    saveItems(nextItems);
  };

  if (!canView) {
    return (
      <div className="rounded-none border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        No tienes permiso para visualizar este modulo.
      </div>
    );
  }

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-xl font-semibold text-zinc-900">CRUD: {access.label}</h3>
          <p className="text-sm text-zinc-600">Alta, edicion y baja controladas por permission codes del backend.</p>
        </div>

        {canCreate ? (
          <button
            type="button"
            onClick={openCreate}
            className="rounded-none bg-zinc-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-600"
          >
            Nuevo registro
          </button>
        ) : null}
      </div>

      <div className="rounded-none border border-zinc-200 bg-zinc-50 p-4">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Buscar por nombre, estado o descripcion"
          className="w-full rounded-none border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 outline-none focus:border-zinc-800"
        />
      </div>

      {isFormOpen ? (
        <div className="rounded-none border border-zinc-200 bg-white p-4">
          <h4 className="text-base font-semibold text-zinc-900">{editingId ? 'Editar registro' : 'Crear registro'}</h4>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            <label className="text-sm text-zinc-700">
              <span className="mb-1 block">Nombre</span>
              <input
                value={form.name}
                onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                className="w-full rounded-none border border-zinc-300 px-3 py-2.5 text-sm text-zinc-900 outline-none focus:border-zinc-800"
              />
            </label>

            <label className="text-sm text-zinc-700">
              <span className="mb-1 block">Estado</span>
              <select
                value={form.status}
                onChange={(event) => setForm((prev) => ({ ...prev, status: event.target.value === 'inactivo' ? 'inactivo' : 'activo' }))}
                className="w-full rounded-none border border-zinc-300 px-3 py-2.5 text-sm text-zinc-900 outline-none focus:border-zinc-800"
              >
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
              </select>
            </label>

            <label className="text-sm text-zinc-700 md:col-span-2">
              <span className="mb-1 block">Descripcion</span>
              <textarea
                value={form.description}
                onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
                rows={3}
                className="w-full rounded-none border border-zinc-300 px-3 py-2.5 text-sm text-zinc-900 outline-none focus:border-zinc-800"
              />
            </label>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleSave}
              className="rounded-none bg-zinc-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-600"
            >
              {editingId ? 'Guardar cambios' : 'Crear'}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="rounded-none border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition hover:border-zinc-500"
            >
              Cancelar
            </button>
          </div>
        </div>
      ) : null}

      <div className="overflow-hidden rounded-none border border-zinc-200">
        <table className="min-w-full divide-y divide-zinc-200 bg-white text-sm">
          <thead className="bg-zinc-50 text-left text-xs uppercase tracking-[0.16em] text-zinc-500">
            <tr>
              <th className="px-3 py-2">Nombre</th>
              <th className="px-3 py-2">Descripcion</th>
              <th className="px-3 py-2">Estado</th>
              <th className="px-3 py-2">Actualizado</th>
              <th className="px-3 py-2 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {visibleItems.map((item) => (
              <tr key={item.id}>
                <td className="px-3 py-2 font-medium text-zinc-900">{item.name}</td>
                <td className="px-3 py-2 text-zinc-700">{item.description || '-'}</td>
                <td className="px-3 py-2">
                  <span
                    className={`rounded-none px-2.5 py-1 text-xs font-semibold ${item.status === 'activo' ? 'bg-emerald-100 text-emerald-700' : 'bg-zinc-200 text-zinc-700'}`}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="px-3 py-2 text-zinc-600">{new Date(item.updatedAt).toLocaleString()}</td>
                <td className="px-3 py-2">
                  <div className="flex justify-end gap-2">
                    {canUpdate ? (
                      <button
                        type="button"
                        onClick={() => openEdit(item)}
                        className="rounded-none border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-700 transition hover:border-zinc-600"
                      >
                        Editar
                      </button>
                    ) : null}
                    {canDelete ? (
                      <button
                        type="button"
                        onClick={() => handleDelete(item.id)}
                        className="rounded-none border border-red-300 px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-50"
                      >
                        Eliminar
                      </button>
                    ) : null}
                  </div>
                </td>
              </tr>
            ))}
            {visibleItems.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-sm text-zinc-500">
                  No hay registros para mostrar.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </section>
  );
};