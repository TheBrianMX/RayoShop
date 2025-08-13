import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // ej. http://localhost:8080/api
  headers: { "Content-Type": "application/json" },
});

// Tipos compartidos
export type User = {
  id: number;
  name: string;
  lastname: string;
  role: "ADMIN" | "USER";
};
