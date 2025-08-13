import { useState } from "react";
import Button from "./ui/Button";
import type { User } from "../services/api";

type FormValues = Omit<User, "id">;

export default function UserForm({
  initialData,
  onSubmit,
  onCancel,
}: {
  initialData?: FormValues;
  onSubmit: (values: FormValues) => Promise<void> | void;
  onCancel?: () => void;
}) {
  const [name, setName] = useState(initialData?.name ?? "");
  const [lastname, setLastname] = useState(initialData?.lastname ?? "");
  const [role, setRole] = useState<FormValues["role"]>(initialData?.role ?? "USER");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!name.trim()) return setError("El nombre es obligatorio");
    if (!lastname.trim()) return setError("El apellido es obligatorio");

    try {
      setSaving(true);
      await onSubmit({ name: name.trim(), lastname: lastname.trim(), role });
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
          Nombre
        </label>
        <input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/40"
          placeholder="Nombre"
        />
      </div>

      <div className="grid gap-3">
        <label className="text-sm font-medium text-slate-700" htmlFor="lastname">
          Apellido
        </label>
        <input
          id="lastname"
          value={lastname}
          onChange={(e) => setLastname(e.target.value)}
          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/40"
          placeholder="Apellido"
        />
      </div>

      <div className="grid gap-3">
        <label className="text-sm font-medium text-slate-700" htmlFor="role">
          Rol
        </label>
        <select
          id="role"
          value={role}
          onChange={(e) => setRole(e.target.value as FormValues["role"])}
          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/40"
        >
          <option value="ADMIN">ADMIN</option>
          <option value="USER">USER</option>
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
