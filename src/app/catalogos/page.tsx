import Link from "next/link";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

type Catalog = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  created_at: string | null;
};

function formatDate(value: string | null) {
  if (!value) return "-";
  return new Date(value).toLocaleString("pt-BR");
}

export default async function CatalogsPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data, error } = await supabase
    .from("catalogs")
    .select("id, name, slug, description, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const catalogs = (data || []) as Catalog[];

  return (
    <main className="min-h-screen bg-[#fcfaf7] px-6 py-10 text-zinc-900">
      <div className="mx-auto max-w-6xl rounded-[28px] border border-[#ece4d8] bg-white/80 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.04)] backdrop-blur md:p-10">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Meus catálogos</h1>
            <p className="mt-2 text-zinc-600">Crie links separados para cada nicho ou coleção.</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link href="/" className="rounded-2xl border border-[#e4d8c7] bg-white px-5 py-3 font-medium transition hover:bg-[#faf6ef]">
              Início
            </Link>

            <Link href="/admin" className="rounded-2xl border border-[#e4d8c7] bg-white px-5 py-3 font-medium transition hover:bg-[#faf6ef]">
              Minhas páginas
            </Link>

            <Link href="/catalogo" className="rounded-2xl border border-[#e4d8c7] bg-white px-5 py-3 font-medium transition hover:bg-[#faf6ef]">
              Catálogo geral
            </Link>

            <Link href="/catalogos/create" className="rounded-2xl bg-zinc-900 px-5 py-3 font-medium text-white transition hover:bg-zinc-700">
              Novo catálogo
            </Link>
          </div>
        </div>

        {error && <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">Erro ao carregar catálogos.</div>}

        {!error && catalogs.length === 0 && (
          <div className="mt-8 rounded-2xl border border-[#ece4d8] bg-[#fbf8f3] p-6 text-zinc-600">
            Você ainda não criou nenhum catálogo.
          </div>
        )}

        {!error && catalogs.length > 0 && (
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {catalogs.map((catalog) => (
              <div key={catalog.id} className="rounded-[24px] border border-[#ece4d8] bg-[#fbf8f3] p-6">
                <h2 className="text-2xl font-bold">{catalog.name}</h2>
                <p className="mt-2 text-sm text-zinc-500">/c/{catalog.slug}</p>
                <p className="mt-4 min-h-[48px] text-zinc-600">{catalog.description || "Sem descrição."}</p>
                <p className="mt-4 text-sm text-zinc-500">Criado em: {formatDate(catalog.created_at)}</p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Link href={`/catalogos/${catalog.id}`} className="rounded-2xl bg-zinc-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-zinc-700">
                    Gerenciar produtos
                  </Link>

                  <Link href={`/c/${catalog.slug}`} className="rounded-2xl border border-[#e4d8c7] bg-white px-4 py-3 text-sm font-medium transition hover:bg-[#faf6ef]">
                    Abrir catálogo
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
