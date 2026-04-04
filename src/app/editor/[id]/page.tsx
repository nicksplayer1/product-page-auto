import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import EditorForm from "@/components/editor-form";
import ProductGallery from "@/components/product-gallery";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditorPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data, error } = await supabase
    .from("product_pages")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error || !data) notFound();

  const { data: galleryRows } = await supabase
    .from("product_page_images")
    .select("image_url, sort_order")
    .eq("product_page_id", id)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  const imageUrls = [data.image_url, ...((galleryRows || []).map((row) => row.image_url))].filter(Boolean) as string[];

  return (
    <main className="min-h-screen bg-[#fcfaf7] px-6 py-10 text-zinc-900">
      <div className="mx-auto max-w-7xl rounded-[28px] border border-[#ece4d8] bg-white/80 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.04)] backdrop-blur md:p-10">
        <div className="mb-8 flex flex-wrap items-start justify-between gap-4 rounded-2xl border border-[#f0e7db] bg-[#fbf8f3] p-5">
          <div>
            <h1 className="text-3xl font-bold">Editor da página</h1>
            <p className="mt-2 text-zinc-600">Revise, salve e publique sua página de produto.</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link href="/" className="rounded-2xl border border-[#e4d8c7] bg-white px-5 py-3 text-sm font-medium transition hover:bg-[#faf6ef]">
              Voltar ao início
            </Link>

            <Link href="/catalogo" className="rounded-2xl bg-zinc-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-zinc-700">
              Ver catálogo
            </Link>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[24px] border border-[#ece4d8] bg-[#fbf8f3] p-5">
            <h2 className="mb-4 text-xl font-bold">Prévia da galeria</h2>
            <ProductGallery images={imageUrls} title={data.title} />
          </div>

          <div className="rounded-[24px] border border-[#ece4d8] bg-[#fbf8f3] p-5">
            <EditorForm product={data} imageUrls={imageUrls} />
          </div>
        </div>
      </div>
    </main>
  );
}
