import { useState, useEffect } from "react";
import API from "../services/api";

interface User {
  id: number;
  name: string;
  lastname: string;
  role: string;
}

interface Props {
  onCreated?: () => void;
  userToEdit?: User | null;
  onFinishEdit?: () => void;
}

export default function UserForm({ onCreated, userToEdit, onFinishEdit }: Props) {
  const [name, setName] = useState("");
  const [lastname, setLastname] = useState("");
  const [role, setRole] = useState("USER");

  useEffect(() => {
    if (userToEdit) {
      setName(userToEdit.name);
      setLastname(userToEdit.lastname);
      setRole(userToEdit.role);
    } else {
      setName("");
      setLastname("");
      setRole("USER");
    }
  }, [userToEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (userToEdit) {
        // PUT (editar)
        await API.put(`/users/${userToEdit.id}`, {
          name,
          lastname,
          role,
        });
      } else {
        // POST (crear)
        await API.post("/users", {
          name,
          lastname,
          role,
        });
      }

      setName("");
      setLastname("");
      setRole("USER");
      onCreated?.();
      onFinishEdit?.();
    } catch (err) {
      console.error("Error al guardar usuario:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-6">
      <h2 className="text-lg font-semibold mb-2">
        {userToEdit ? "Editar Usuario" : "Nuevo Usuario"}
      </h2>
      <input
        type="text"
        placeholder="Nombre"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="block w-full mb-2 p-2 border rounded"
        required
      />
      <input
        type="text"
        placeholder="Apellido"
        value={lastname}
        onChange={(e) => setLastname(e.target.value)}
        className="block w-full mb-2 p-2 border rounded"
        required
      />
      <select
        value={role}
        onChange={(e) => setRole(e.target.value)}
        className="block w-full mb-2 p-2 border rounded"
      >
        <option value="USER">Usuario</option>
        <option value="ADMIN">Administrador</option>
      </select>
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {userToEdit ? "Guardar Cambios" : "Crear Usuario"}
      </button>
    </form>
  );
}
