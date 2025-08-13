import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import ProductForm from "@/components/ProductForm";
import {
  listProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  type Product,
  type ProductFormValues,
} from "@/services/products";
import { listCategories, type Category } from "@/services/categories";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      setError(null);
      setLoading(true);
      const [prod, cats] = await Promise.all([listProducts(), listCategories()]);
      setProducts(prod);
      setCategories(cats);
    } catch (e: any) {
      setError(e?.message ?? "Error cargando productos");
    } finally {
      setLoading(false);
    }
  }

  function categoryNameById(id?: number) {
    return id ? (categories.find((c) => c.id === id)?.name ?? "—") : "—";
  }

  async function onSubmit(values: ProductFormValues) {
    try {
      if (editing) {
        await updateProduct(editing.id, values);
      } else {
        await createProduct(values);
      }
      setOpen(false);
      setEditing(null);
      await load();
    } catch (e: any) {
      alert(e?.response?.data?.message ?? e?.message ?? "Error al guardar");
    }
  }

  async function onDelete(id: number) {
    if (!confirm("¿Eliminar producto?")) return;
    try {
      await deleteProduct(id);
      await load();
    } catch (e: any) {
      alert(e?.message ?? "No se pudo eliminar");
    }
  }

  return (
    <section className="space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Productos</h1>
        <Button onClick={() => { setEditing(null); setOpen(true); }}>
          Nuevo producto
        </Button>
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
              <th className="px-4 py-3 text-left">Precio</th>
              <th className="px-4 py-3 text-left">Stock</th>
              <th className="px-4 py-3 text-left">Categoría</th>
              <th className="px-4 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                  Cargando...
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                  No hay productos
                </td>
              </tr>
            ) : (
              products.map((p) => (
                <tr key={p.id} className="border-t border-slate-100">
                  <td className="px-4 py-3">{p.id}</td>
                  <td className="px-4 py-3">{p.name}</td>
                  <td className="px-4 py-3">{p.description ?? "—"}</td>
                  <td className="px-4 py-3">
                    {Number.isFinite(p.price) ? `$${p.price.toFixed(2)}` : "—"}
                  </td>
                  <td className="px-4 py-3">{p.stock}</td>
                  <td className="px-4 py-3">
                    {p.category?.name ?? categoryNameById(p.category?.id)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex gap-2">
                      <Button variant="ghost" onClick={() => { setEditing(p); setOpen(true); }}>
                        Editar
                      </Button>
                      <Button variant="danger" onClick={() => onDelete(p.id)}>
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
                {editing ? "Editar producto" : "Nuevo producto"}
              </h2>
              <button
                className="rounded-full px-2 py-1 text-slate-500 hover:bg-slate-100"
                onClick={() => { setOpen(false); setEditing(null); }}
                aria-label="Cerrar"
              >
                ✕
              </button>
            </header>

            <ProductForm
              initialData={
                editing
                  ? {
                      name: editing.name,
                      description: editing.description ?? "",
                      price: editing.price,
                      stock: editing.stock,
                      categoryId: editing.category?.id ?? 0,
                    }
                  : undefined
              }
              onSubmit={onSubmit}
              onCancel={() => { setOpen(false); setEditing(null); }}
            />
          </div>
        </div>
      )}
    </section>
  );
}
