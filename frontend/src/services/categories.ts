import { api } from "./api";

export type Category = {
  id: number;
  name: string;
};

export async function listCategories(): Promise<Category[]> {
  const { data } = await api.get<Category[]>("/categories");
  return data;
}

export async function createCategory(payload: Omit<Category, "id">): Promise<Category> {
  const { data } = await api.post<Category>("/categories", payload);
  return data;
}

export async function updateCategory(id: number, payload: Omit<Category, "id">): Promise<Category> {
  const { data } = await api.put<Category>(`/categories/${id}`, payload);
  return data;
}

export async function deleteCategory(id: number): Promise<void> {
  await api.delete(`/categories/${id}`);
}
