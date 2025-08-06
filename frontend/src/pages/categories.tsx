import { useEffect, useState } from "react";
import API from "../services/api";
import CategoryForm from "../components/CategoryForm";

interface Category {
  id: number;
  name: string;
  description?: string | null;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryToEdit, setCategoryToEdit] = useState<Category | null>(null);

  const loadCategories = () => {
    API.get("/categories")
      .then((res) => setCategories(res.data))
      .catch((err) => console.error("Error al cargar categorías:", err));
  };

  const handleDelete = async (id: number) => {
    if (confirm("¿Eliminar esta categoría?")) {
      try {
        await API.delete(`/categories/${id}`);
        loadCategories();
      } catch (err) {
        console.error("Error al eliminar categoría:", err);
      }
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-blue-600">Categorías</h1>

      <CategoryForm
        onCreated={loadCategories}
        categoryToEdit={categoryToEdit}
        onFinishEdit={() => setCategoryToEdit(null)}
      />

      <ul className="space-y-2">
        {categories.map((cat) => (
          <li
            key={cat.id}
            className="bg-blue-100 p-3 rounded flex justify-between items-center"
          >
            <div>
              <p className="font-semibold">{cat.name}</p>
              {cat.description && (
                <p className="text-sm text-gray-700">{cat.description}</p>
              )}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setCategoryToEdit(cat)}
                className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
              >
                Editar
              </button>
              <button
                onClick={() => handleDelete(cat.id)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Eliminar
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
