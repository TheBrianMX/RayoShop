import { api } from "./api";
import type { Category } from "./categories";

export type Product = {
  id: number;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  category?: Category | null;   // relación del backend
  categoryId?: number;          // por conveniencia en el front
};

export async function listProducts(): Promise<Product[]> {
  const { data } = await api.get<Product[]>("/products");
  return data;
}

export type ProductFormValues = {
  name: string;
  description: string;
  price: number;
  stock: number;
  categoryId: number;           // del select
};

export async function createProduct(payload: ProductFormValues): Promise<Product> {
  // 👇 enviar categoría como objeto para que JPA mapee la relación
  const body = {
    name: payload.name,
    description: payload.description,
    price: payload.price,
    stock: payload.stock,
    category: { id: payload.categoryId },
  };
  const { data } = await api.post<Product>("/products", body);
  return data;
}

export async function updateProduct(id: number, payload: ProductFormValues): Promise<Product> {
  const body = {
    id,
    name: payload.name,
    description: payload.description,
    price: payload.price,
    stock: payload.stock,
    category: { id: payload.categoryId },
  };
  const { data } = await api.put<Product>(`/products/${id}`, body);
  return data;
}

export async function deleteProduct(id: number): Promise<void> {
  await api.delete(`/products/${id}`);
}
