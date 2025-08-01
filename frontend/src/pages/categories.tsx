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

  const loadCategories = () => {
    API.get("/categories")
      .then((res) => setCategories(res.data))
      .catch((err) => console.error("Error al cargar categorías:", err));
  };

  useEffect(() => {
    loadCategories();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-blue-600">Categorías</h1>

      <CategoryForm onCreated={loadCategories} />

      <ul className="space-y-2">
        {categories.map((cat) => (
          <li key={cat.id} className="bg-blue-100 p-3 rounded">
            <p className="font-semibold">{cat.name}</p>
            {cat.description && (
              <p className="text-sm text-gray-700">{cat.description}</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
