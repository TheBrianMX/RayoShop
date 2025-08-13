import Navbar from "./Navbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative isolate min-h-screen">
      {/* Fondo gradiente animado estilo dark mode elegante */}
      <div aria-hidden className="fixed inset-0 -z-10 animate-gradient">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-800 to-gray-200 bg-[length:200%_200%]" />
        <div className="absolute inset-0 bg-[radial-gradient(500px_at_50%_200px,rgba(255,255,255,0.15)_0,transparent_70%)]" />
      </div>

      <Navbar />

      {/* Padding para que el contenido no se encime con el navbar */}
      <main className="px-6 pt-28 pb-6">{children}</main>
    </div>
  );
}
