import Link from "next/link";
import { notFound } from "next/navigation";
import EditorForm from "@/components/editor-form";
import { supabaseAdmin } from "@/lib/supabase-admin";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditorPage({ params }: PageProps) {
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
    <main className="min-h-screen bg-white px-6 py-10 text-zinc-900">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Editor da página</h1>
            <p className="mt-2 text-zinc-600">
              Revise, salve e publique sua página de produto.
            </p>
          </div>

          <Link
            href="/admin"
            className="rounded-2xl border border-zinc-300 px-4 py-2 text-sm transition hover:bg-zinc-100"
          >
            Ir para admin
          </Link>
        </div>

        <EditorForm initialPage={data} />
      </div>
    </main>
  );
}
