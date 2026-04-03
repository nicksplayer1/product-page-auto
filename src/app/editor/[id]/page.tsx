import Link from "next/link";
import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase-admin";
import EditorForm from "@/components/editor-form";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditorPage({ params }: Props) {
  const { id } = await params;

  const { data, error } = await supabaseAdmin
    .from("product_pages")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#f6f1e8] px-6 py-10 text-zinc-900">
      <div className="mx-auto max-w-5xl rounded-[28px] border border-[#e7ddcf] bg-white/75 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.05)] backdrop-blur md:p-10">
        <div className="mb-8 flex flex-wrap items-start justify-between gap-4 rounded-2xl border border-[#eee4d7] bg-[#fbf8f3] p-5">
          <div>
            <h1 className="text-3xl font-bold">Editor da página</h1>
            <p className="mt-2 text-zinc-600">
              Revise, salve e publique sua página de produto.
            </p>
          </div>

          <Link
            href="/admin"
            className="rounded-2xl border border-[#ddd1c0] bg-white px-5 py-3 text-sm font-medium transition hover:bg-[#faf6ef]"
          >
            Ir para admin
          </Link>
        </div>

        <EditorForm product={data} />
      </div>
    </main>
  );
}
