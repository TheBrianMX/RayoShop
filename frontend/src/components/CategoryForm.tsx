import { useState, useEffect } from "react";
import API from "../services/api";

interface Category {
  id: number;
  name: string;
  description?: string | null;
}

interface Props {
  onCreated?: () => void;
  categoryToEdit?: Category | null;
  onFinishEdit?: () => void;
}

export default function CategoryForm({ onCreated, categoryToEdit, onFinishEdit }: Props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (categoryToEdit) {
      setName(categoryToEdit.name);
      setDescription(categoryToEdit.description || "");
    } else {
      setName("");
      setDescription("");
    }
  }, [categoryToEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (categoryToEdit) {
        await API.put(`/categories/${categoryToEdit.id}`, {
          name,
          description,
        });
      } else {
        await API.post("/categories", {
          name,
          description,
        });
      }

      setName("");
      setDescription("");
      onCreated?.();
      onFinishEdit?.();
    } catch (err) {
      console.error("Error al guardar categoría:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-6">
      <h2 className="text-lg font-semibold mb-2">
        {categoryToEdit ? "Editar Categoría" : "Nueva Categoría"}
      </h2>
      <input
        type="text"
        placeholder="Nombre"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="block w-full mb-2 p-2 border rounded"
        required
      />
      <textarea
        placeholder="Descripción (opcional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="block w-full mb-2 p-2 border rounded"
      />
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {categoryToEdit ? "Guardar Cambios" : "Crear Categoría"}
      </button>
    </form>
  );
}
