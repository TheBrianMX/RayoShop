import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-blue-600 text-white px-6 py-4 shadow">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-bold">RayoShop ⚡</h1>
        <ul className="flex space-x-6">
          <li>
            <Link href="/" className="hover:underline">
              Inicio
            </Link>
          </li>
          <li>
            <Link href="/users" className="hover:underline">
              Usuarios
            </Link>
          </li>
          <li>
            <Link href="/categories" className="hover:underline">
              Categorías
            </Link>
          </li>
          <li>
            <Link href="/products" className="hover:underline">
              Productos
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
