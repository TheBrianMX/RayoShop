import { useEffect, useState } from "react";
import Button from "../components/ui/Button";
import { listUsers, deleteUser, createUser, updateUser } from "../services/users";
import type { User } from "../services/api";

type FormValues = Omit<User, "id">;

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);

  async function load() {
    try {
      setError(null);
      setLoading(true);
      const data = await listUsers();
      setUsers(data);
    } catch (e: any) {
      setError(e?.message ?? "Error cargando usuarios");
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

  function openEdit(u: User) {
    setEditing(u);
    setOpen(true);
  }

  async function onDelete(id: number) {
    if (!confirm(`¿Eliminar usuario ${id}?`)) return;
    try {
      await deleteUser(id);
      await load();
    } catch (e: any) {
      alert(e?.message ?? "No se pudo eliminar");
    }
  }

  async function handleSubmit(values: FormValues) {
    try {
      if (editing) {
        await updateUser(editing.id, values);
      } else {
        await createUser(values);
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
        <h1 className="text-2xl font-bold text-white">Usuarios</h1>
        <Button onClick={openCreate}>Nuevo usuario</Button>
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
              <th className="px-4 py-3 text-left">Apellido</th>
              <th className="px-4 py-3 text-left">Rol</th>
              <th className="px-4 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                  Cargando...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                  No hay usuarios
                </td>
              </tr>
            ) : (
              users.map((u) => (
                <tr key={u.id} className="border-t border-slate-100">
                  <td className="px-4 py-3">{u.id}</td>
                  <td className="px-4 py-3">{u.name}</td>
                  <td className="px-4 py-3">{u.lastname}</td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        "rounded-lg px-2 py-1 text-xs " +
                        (u.role === "ADMIN"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-sky-100 text-sky-700")
                      }
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex gap-2">
                      <Button variant="ghost" onClick={() => openEdit(u)}>
                        Editar
                      </Button>
                      <Button variant="danger" onClick={() => onDelete(u.id)}>
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
                {editing ? "Editar usuario" : "Nuevo usuario"}
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

            <UserForm
              initialData={
                editing
                  ? { name: editing.name, lastname: editing.lastname, role: editing.role }
                  : undefined
              }
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

/** Form embebido para poder importar solo desde esta página si prefieres
 *  pero vamos a usar el de src/components/UserForm.tsx para mantener orden.
 */
import UserForm from "../components/UserForm";
