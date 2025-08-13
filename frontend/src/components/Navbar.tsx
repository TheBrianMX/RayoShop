import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="fixed inset-x-0 top-0 z-50 px-6 py-4 text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <h1 className="text-lg font-bold drop-shadow">RayoShop</h1>
        <ul className="flex gap-6">
          <li><Link href="/" className="hover:underline drop-shadow">Inicio</Link></li>
          <li><Link href="/users" className="hover:underline drop-shadow">Usuarios</Link></li>
          <li><Link href="/categories" className="hover:underline drop-shadow">Categorías</Link></li>
          <li><Link href="/products" className="hover:underline drop-shadow">Productos</Link></li>
        </ul>
      </div>
    </nav>
  );
}
