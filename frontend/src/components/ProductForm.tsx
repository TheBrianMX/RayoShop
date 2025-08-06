import { useState, useEffect } from "react";
import API from "../services/api";

interface Category {
  id: number;
  name: string;
}

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: Category;
}

interface Props {
  onCreated?: () => void;
  productToEdit?: Product | null;
  onFinishEdit?: () => void;
}

export default function ProductForm({ onCreated, productToEdit, onFinishEdit }: Props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    API.get("/categories")
      .then((res) => setCategories(res.data))
      .catch((err) => console.error("Error al cargar categorías:", err));
  }, []);

  useEffect(() => {
    if (productToEdit) {
      setName(productToEdit.name);
      setDescription(productToEdit.description);
      setPrice(productToEdit.price.toString());
      setCategoryId(productToEdit.category.id.toString());
    } else {
      setName("");
      setDescription("");
      setPrice("");
      setCategoryId("");
    }
  }, [productToEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      name,
      description,
      price: parseFloat(price),
      category: {
        id: parseInt(categoryId),
      },
    };

    try {
      if (productToEdit) {
        await API.put(`/products/${productToEdit.id}`, data);
      } else {
        await API.post("/products", data);
      }

      setName("");
      setDescription("");
      setPrice("");
      setCategoryId("");
      onCreated?.();
      onFinishEdit?.();
    } catch (err) {
      console.error("Error al guardar producto:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-6">
      <h2 className="text-lg font-semibold mb-2">
        {productToEdit ? "Editar Producto" : "Nuevo Producto"}
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
        placeholder="Descripción"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="block w-full mb-2 p-2 border rounded"
        required
      />
      <input
        type="number"
        placeholder="Precio"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        className="block w-full mb-2 p-2 border rounded"
        step="0.01"
        required
      />
      <select
        value={categoryId}
        onChange={(e) => setCategoryId(e.target.value)}
        className="block w-full mb-2 p-2 border rounded"
        required
      >
        <option value="">Seleccionar Categoría</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </select>

      <button
        type="submit"
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        {productToEdit ? "Guardar Cambios" : "Crear Producto"}
      </button>
    </form>
  );
}
