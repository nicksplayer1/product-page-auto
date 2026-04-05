import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import CatalogEditForm from "@/components/catalog-edit-form";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditCatalogPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data, error } = await supabase
    .from("catalogs")
    .select("id, name, slug, description")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error || !data) notFound();

  return (
    <main className="min-h-screen bg-[#fcfaf7] px-6 py-10 text-zinc-900">
      <div className="mx-auto max-w-4xl rounded-[28px] border border-[#ece4d8] bg-white/80 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.04)] backdrop-blur md:p-10">
        <div className="mb-8 flex flex-wrap items-start justify-between gap-4 rounded-2xl border border-[#f0e7db] bg-[#fbf8f3] p-5">
          <div>
            <h1 className="text-3xl font-bold">Editar catálogo</h1>
            <p className="mt-2 text-zinc-600">Altere nome, slug e descrição do catálogo.</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link href="/" className="rounded-2xl border border-[#e4d8c7] bg-white px-5 py-3 text-sm font-medium transition hover:bg-[#faf6ef]">Início</Link>
            <Link href="/catalogos" className="rounded-2xl border border-[#e4d8c7] bg-white px-5 py-3 text-sm font-medium transition hover:bg-[#faf6ef]">Meus catálogos</Link>
            <Link href={`/catalogos/${data.id}`} className="rounded-2xl bg-zinc-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-zinc-700">Gerenciar produtos</Link>
          </div>
        </div>

        <div className="rounded-[24px] border border-[#ece4d8] bg-[#fbf8f3] p-5">
          <CatalogEditForm catalog={data} />
        </div>
      </div>
    </main>
  );
}
