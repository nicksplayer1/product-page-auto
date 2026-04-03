import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase-admin";

export default async function AdminPage() {
  const { data } = await supabaseAdmin
    .from("product_pages")
    .select("id, title, price, slug, status, created_at")
    .order("created_at", { ascending: false });

  const pages = data || [];

  return (
    <main className="min-h-screen bg-white px-6 py-10 text-zinc-900">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Minhas páginas</h1>
            <p className="mt-2 text-zinc-600">
              Gerencie, edite e abra suas páginas públicas.
            </p>
          </div>

          <Link
            href="/create"
            className="rounded-2xl bg-zinc-900 px-5 py-3 text-white transition hover:bg-zinc-700"
          >
            Nova página
          </Link>
        </div>

        {pages.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-zinc-200 p-6 text-zinc-600">
            Nenhuma página criada ainda.
          </div>
        ) : (
          <div className="mt-8 grid gap-4">
            {pages.map((page) => (
              <div
                key={page.id}
                className="rounded-2xl border border-zinc-200 p-5"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-xl font-semibold">{page.title}</h2>
                    <p className="mt-1 text-sm text-zinc-600">
                      Status: {page.status} • Slug: {page.slug}
                    </p>
                    <p className="mt-1 text-sm text-zinc-600">
                      Preço: {page.price || "-"}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <Link
                      href={`/editor/${page.id}`}
                      className="rounded-xl border border-zinc-300 px-4 py-2 text-sm transition hover:bg-zinc-100"
                    >
                      Editar
                    </Link>

                    <Link
                      href={`/${page.slug}`}
                      className="rounded-xl bg-zinc-900 px-4 py-2 text-sm text-white transition hover:bg-zinc-700"
                    >
                      Abrir página
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
