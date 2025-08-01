import { useEffect, useState } from "react";
import API from "../services/api";
import ProductForm from "../components/ProductForm";

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

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);

  const loadProducts = () => {
    API.get("/products")
      .then((res) => setProducts(res.data))
      .catch((err) => console.error("Error al cargar productos:", err));
  };

  useEffect(() => {
    loadProducts();
  }, []);

const handleDelete = async (id: number) => {
  if (confirm("¿Eliminar este producto?")) {
    try {
      await API.delete(`/products/${id}`);
      loadProducts();
    } catch (err) {
      console.error("Error al eliminar producto:", err);
    }
  }
};


  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-green-600">Productos</h1>

      <ProductForm onCreated={loadProducts} />

      <ul className="space-y-4">
        {products.map((prod) => (
          <li key={prod.id} className="bg-green-100 p-4 rounded shadow flex justify-between items-center">
  <div>
    <p className="font-semibold">{prod.name}</p>
    <p className="text-sm">{prod.description}</p>
    <p className="text-sm text-gray-600">Precio: ${prod.price}</p>
    <p className="text-sm text-blue-700">Categoría: {prod.category.name}</p>
  </div>
  <button
    onClick={() => handleDelete(prod.id)}
    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
  >
    Eliminar
  </button>
</li>

        ))}
      </ul>
    </div>
  );
}
