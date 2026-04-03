import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white text-zinc-900">
      <section className="mx-auto flex max-w-4xl flex-col items-center px-6 py-20 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Crie páginas de produto prontas em minutos
        </h1>

        <p className="mt-4 max-w-2xl text-lg text-zinc-600">
          Cole o link do produto ou preencha os dados manualmente, revise a página
          e publique seu link pronto para vender.
        </p>

        <div className="mt-8 flex gap-4">
          <Link
            href="/create"
            className="rounded-2xl bg-zinc-900 px-6 py-3 text-white transition hover:bg-zinc-700"
          >
            Criar página automática
          </Link>

          <Link
            href="/admin"
            className="rounded-2xl border border-zinc-300 px-6 py-3 transition hover:bg-zinc-100"
          >
            Minhas páginas
          </Link>
        </div>
      </section>
    </main>
  );
}
