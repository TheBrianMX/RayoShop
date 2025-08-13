// frontend/src/services/categories.ts
import { api } from "./api";

// Definición del tipo Category
// que representa una categoría en el sistema
export type Category = {
  id: number;
  name: string;
  description: string;
};
// CRUD de categorías con tabla, modal y formulario
export async function listCategories(): Promise<Category[]> {
  const { data } = await api.get<Category[]>("/categories");
  return data;
}
// Crear una nueva categoría
// No se envía el ID porque es autogenerado por el backend
export async function createCategory(payload: Omit<Category, "id">): Promise<Category> {
  const { data } = await api.post<Category>("/categories", payload);
  return data;
}

// Enviar id como parte del payload
// para que el backend pueda actualizar correctamente
export async function updateCategory(id: number, payload: Omit<Category, "id">): Promise<Category> {
  const body: Category = { id, ...payload } as Category;
  const { data } = await api.put<Category>(`/categories/${id}`, body);
  return data;
}
// Eliminar una categoría por su ID
// No se espera respuesta, solo confirmar que se eliminó
export async function deleteCategory(id: number): Promise<void> {
  await api.delete(`/categories/${id}`);
}
