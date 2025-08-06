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
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);

  const loadProducts = () => {
    API.get("/products")
      .then((res) => setProducts(res.data))
      .catch((err) => console.error("Error al cargar productos:", err));
  };

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

  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-green-600">Productos</h1>

      <ProductForm
        onCreated={loadProducts}
        productToEdit={productToEdit}
        onFinishEdit={() => setProductToEdit(null)}
      />

      <ul className="space-y-2">
        {products.map((prod) => (
          <li
            key={prod.id}
            className="bg-green-100 p-3 rounded flex justify-between items-center"
          >
            <div>
              <p className="font-semibold">{prod.name}</p>
              <p className="text-sm text-gray-700">{prod.description}</p>
              <p className="text-sm text-gray-700">
                ${prod.price.toFixed(2)} - {prod.category.name}
              </p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setProductToEdit(prod)}
                className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
              >
                Editar
              </button>
              <button
                onClick={() => handleDelete(prod.id)}
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
