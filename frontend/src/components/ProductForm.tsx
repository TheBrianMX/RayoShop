import { useEffect, useState } from "react";
import Button from "./ui/Button";
import type { ProductFormValues } from "@/services/products";
import { listCategories, type Category } from "@/services/categories";

export default function ProductForm({
  initialData,
  onSubmit,
  onCancel,
}: {
  initialData?: ProductFormValues;
  onSubmit: (values: ProductFormValues) => Promise<void> | void;
  onCancel?: () => void;
}) {
  const [name, setName] = useState(initialData?.name ?? "");
  const [description, setDescription] = useState(initialData?.description ?? "");
  const [price, setPrice] = useState<number>(initialData?.price ?? 0);
  const [stock, setStock] = useState<number>(initialData?.stock ?? 0);
  const [categoryId, setCategoryId] = useState<number>(initialData?.categoryId ?? 0);

  const [cats, setCats] = useState<Category[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await listCategories();
        setCats(data);
        if (!initialData && data.length > 0) setCategoryId(data[0].id);
      } catch (e: any) {
        setError(e?.message ?? "No se pudieron cargar categorías");
      }
    })();
  }, [initialData]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!name.trim()) return setError("El nombre es obligatorio");
    if (!description.trim()) return setError("La descripción es obligatoria");
    if (!categoryId) return setError("Selecciona una categoría");
    if (price < 0 || !Number.isFinite(price)) return setError("Precio inválido");
    if (!Number.isInteger(stock) || stock < 0) return setError("Stock inválido");

    try {
      setSaving(true);
      await onSubmit({
        name: name.trim(),
        description: description.trim(),
        price,
        stock,
        categoryId,
      });
    } catch (e: any) {
      setError(e?.response?.data?.message ?? e?.message ?? "Error al guardar");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm text-rose-700">
          {error}
        </div>
      )}

      <div className="grid gap-2">
        <label className="text-sm font-medium text-slate-700" htmlFor="name">Nombre</label>
        <input
          id="name" value={name} onChange={(e) => setName(e.target.value)}
          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/40"
          placeholder="Ej. Mouse inalámbrico"
        />
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-medium text-slate-700" htmlFor="description">Descripción</label>
        <textarea
          id="description" value={description} onChange={(e) => setDescription(e.target.value)}
          className="min-h-[96px] w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/40"
          placeholder="Describe el producto"
        />
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-medium text-slate-700" htmlFor="price">Precio</label>
        <input
          id="price" type="number" step="0.01" min={0}
          value={price} onChange={(e) => setPrice(Number(e.target.value))}
          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/40"
          placeholder="0.00"
        />
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-medium text-slate-700" htmlFor="stock">Stock</label>
        <input
          id="stock" type="number" step="1" min={0}
          value={stock} onChange={(e) => setStock(Number(e.target.value))}
          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/40"
          placeholder="0"
        />
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-medium text-slate-700" htmlFor="category">Categoría</label>
        <select
          id="category" value={categoryId} onChange={(e) => setCategoryId(Number(e.target.value))}
          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/40"
        >
          {cats.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      <div className="mt-6 flex justify-end gap-2">
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel} disabled={saving}>
            Cancelar
          </Button>
        )}
        <Button type="submit" disabled={saving}>
          {saving ? "Guardando..." : "Guardar"}
        </Button>
      </div>
    </form>
  );
}
