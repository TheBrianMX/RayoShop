import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import CategoryForm from "@/components/CategoryForm";

import {
  listCategories,
  deleteCategory,
  createCategory,
  updateCategory,
  type Category,
} from "@/services/categories";

type FormValues = Omit<Category, "id">;


export default function CategoriesPage() {
  const [items, setItems] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);

  async function load() {
    try {
      setError(null);
      setLoading(true);
      const data = await listCategories();
      setItems(data);
    } catch (e: any) {
      setError(e?.message ?? "Error cargando categorías");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function openCreate() {
    setEditing(null);
    setOpen(true);
  }

  function openEdit(c: Category) {
    setEditing(c);
    setOpen(true);
  }

  async function onDelete(id: number) {
    if (!confirm(`¿Eliminar categoría ${id}?`)) return;
    try {
      await deleteCategory(id);
      await load();
    } catch (e: any) {
      alert(e?.message ?? "No se pudo eliminar");
    }
  }

  async function handleSubmit(values: FormValues) {
    try {
      if (editing) {
        await updateCategory(editing.id, values);
      } else {
        await createCategory(values);
      }
      setOpen(false);
      setEditing(null);
      await load();
    } catch (e: any) {
      alert(e?.response?.data?.message ?? e?.message ?? "Error al guardar");
    }
  }

  return (
    <section className="space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Categorias</h1>
        <Button onClick={openCreate}>Nueva categoría</Button>
      </header>

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-rose-700">
          {error}
        </div>
      )}

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="px-4 py-3 text-left">ID</th>
              <th className="px-4 py-3 text-left">Nombre</th>
              <th className="px-4 py-3 text-left">Descripción</th>
              <th className="px-4 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-slate-500">
                  Cargando...
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-slate-500">
                  No hay categorías
                </td>
              </tr>
            ) : (
              items.map((c) => (
                <tr key={c.id} className="border-t border-slate-100">
                  <td className="px-4 py-3">{c.id}</td>
                  <td className="px-4 py-3">{c.name}</td>
                  <td className="px-4 py-3">{c.description}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex gap-2">
                      <Button variant="ghost" onClick={() => openEdit(c)}>
                        Editar
                      </Button>
                      <Button variant="danger" onClick={() => onDelete(c.id)}>
                        Eliminar
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <header className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">
                {editing ? "Editar categoría" : "Nueva categoría"}
              </h2>
              <button
                className="rounded-full px-2 py-1 text-slate-500 hover:bg-slate-100"
                onClick={() => {
                  setOpen(false);
                  setEditing(null);
                }}
                aria-label="Cerrar"
              >
                ✕
              </button>
            </header>

            <CategoryForm
              initialData={editing ? { name: editing.name, description: editing.description } : undefined}
              onSubmit={handleSubmit}
              onCancel={() => {
                setOpen(false);
                setEditing(null);
              }}
            />
          </div>
        </div>
      )}
    </section>
  );
}
