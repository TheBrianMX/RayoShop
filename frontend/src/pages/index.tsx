export default function Home() {
  return (
    <section className="flex min-h-[calc(100vh-80px)] flex-col items-center justify-center text-center text-white">
      <h1 className="text-4xl font-extrabold leading-tight tracking-tight drop-shadow sm:text-5xl">
        Bienvenido a RayoShop
      </h1>
      <a
        href="/products"
        className="mt-6 rounded-full bg-white px-6 py-3 font-semibold text-purple-600 shadow-lg hover:scale-105 transition-transform duration-300"
      >
        Ver productos
      </a>
    </section>
  );
}
