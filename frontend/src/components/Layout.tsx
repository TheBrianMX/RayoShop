import { ReactNode } from "react";
import Link from "next/link";

interface Props {
    children: ReactNode;
}   

export default function Layout({ children }: Props) {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <nav className="bg-blue-700 text-white px-6 py-4 flex justify-between">
        <h1 className="text-xl font-bold">RayoShop</h1>
        <div className="space-x-4">
          <Link href="/" className="hover:underline">
            Inicio
          </Link>
          <Link href="/users" className="hover:underline">
            Usuarios
          </Link>
          <Link href="/categories" className="hover:underline">
            Categorías
          </Link>
          <Link href="/products" className="hover:underline">
            Productos
          </Link>
        </div>
      </nav>

      <main className="p-6 max-w-5xl mx-auto">{children}</main>
    </div>
  );
}
