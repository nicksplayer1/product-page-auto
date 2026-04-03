import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";

type ProductPage = {
  id: string;
  title: string;
  slug: string;
  status: string | null;
  created_at: string | null;
};

function formatDate(value: string | null) {
  if (!value) return "-";
  return new Date(value).toLocaleString("pt-BR");
}

function statusLabel(status: string | null) {
  if (status === "published") return "Publicado";
  if (status === "draft") return "Rascunho";
  return status || "-";
}

export default async function AdminPage() {
  const { data, error } = await supabaseAdmin
    .from("product_pages")
    .select("id, title, slug, status, created_at")
    .order("created_at", { ascending: false });

  const pages = (data || []) as ProductPage[];

  return (
    <main className="min-h-screen bg-[#f6f1e8] px-6 py-10 text-zinc-900">
      <div className="mx-auto max-w-6xl rounded-[28px] border border-[#e7ddcf] bg-white/75 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.05)] backdrop-blur md:p-10">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Minhas páginas</h1>
            <p className="mt-2 text-zinc-600">Gerencie, edite e abra suas páginas.</p>
          </div>

          <Link
            href="/create"
            className="rounded-2xl bg-zinc-900 px-5 py-3 font-medium text-white transition hover:bg-zinc-700"
          >
            Nova página
          </Link>
        </div>

        {error && (
          <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
            Erro ao carregar páginas.
          </div>
        )}

        {!error && pages.length === 0 && (
          <div className="mt-8 rounded-2xl border border-[#e7ddcf] bg-[#fbf8f3] p-6 text-zinc-600">
            Nenhuma página criada ainda.
          </div>
        )}

        {!error && pages.length > 0 && (
          <div className="mt-8 overflow-hidden rounded-[24px] border border-[#e7ddcf] bg-[#fbf8f3]">
            <div className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-4 border-b border-[#e7ddcf] px-5 py-4 text-sm font-semibold">
              <div>Página</div>
              <div>Status</div>
              <div>Criada em</div>
              <div>Ações</div>
            </div>

            {pages.map((page) => (
              <div
                key={page.id}
                className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-4 border-b border-[#e7ddcf] px-5 py-4 last:border-b-0"
              >
                <div>
                  <div className="font-semibold">{page.title}</div>
                  <div className="mt-1 break-all text-sm text-zinc-500">/{page.slug}</div>
                </div>

                <div className="text-sm">{statusLabel(page.status)}</div>
                <div className="text-sm text-zinc-600">{formatDate(page.created_at)}</div>

                <div className="flex flex-wrap gap-2">
                  <Link
                    href={`/editor/${page.id}`}
                    className="rounded-xl border border-[#ddd1c0] bg-white px-3 py-2 text-sm transition hover:bg-[#faf6ef]"
                  >
                    Editar
                  </Link>

                  <Link
                    href={`/${page.slug}`}
                    className="rounded-xl bg-zinc-900 px-3 py-2 text-sm text-white transition hover:bg-zinc-700"
                  >
                    Abrir
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
