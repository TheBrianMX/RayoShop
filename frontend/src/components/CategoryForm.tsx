import { useState } from "react";
import Button from "./ui/Button";
import type { Category } from "@/services/categories";

type FormValues = Omit<Category, "id">;

export default function CategoryForm({
  initialData,
  onSubmit,
  onCancel,
}: {
  initialData?: FormValues;
  onSubmit: (values: FormValues) => Promise<void> | void;
  onCancel?: () => void;
}) {
  const [name, setName] = useState(initialData?.name ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!name.trim()) return setError("El nombre es obligatorio");

    try {
      setSaving(true);
      await onSubmit({ name: name.trim() });
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

      <div className="grid gap-3">
        <label className="text-sm font-medium text-slate-700" htmlFor="name">
          Nombre de la categoría
        </label>
        <input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/40"
          placeholder="Ej. Electrónica"
        />
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
