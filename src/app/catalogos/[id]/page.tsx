import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import CatalogItemsForm from "@/components/catalog-items-form";

type Props = {
  params: Promise<{ id: string }>;
};

type Product = {
  id: string;
  title: string;
  slug: string;
  price: string | null;
  image_url: string | null;
};

type CatalogItem = {
  product_page_id: string;
  sort_order: number;
};

export default async function CatalogManagePage({ params }: Props) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: catalog, error: catalogError } = await supabase
    .from("catalogs")
    .select("id, name, slug, description")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (catalogError || !catalog) notFound();

  const { data: productsData } = await supabase
    .from("product_pages")
    .select("id, title, slug, price, image_url")
    .eq("user_id", user.id)
    .eq("status", "published")
    .order("created_at", { ascending: false });

  const { data: itemsData } = await supabase
    .from("catalog_items")
    .select("product_page_id, sort_order")
    .eq("catalog_id", catalog.id)
    .order("sort_order", { ascending: true });

  const products = (productsData || []) as Product[];
  const selectedItems = (itemsData || []) as CatalogItem[];

  return (
    <main className="min-h-screen bg-[#fcfaf7] px-6 py-10 text-zinc-900">
      <div className="mx-auto max-w-6xl rounded-[28px] border border-[#ece4d8] bg-white/80 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.04)] backdrop-blur md:p-10">
        <div className="mb-8 flex flex-wrap items-start justify-between gap-4 rounded-2xl border border-[#f0e7db] bg-[#fbf8f3] p-5">
          <div>
            <h1 className="text-3xl font-bold">{catalog.name}</h1>
            <p className="mt-2 text-zinc-600">{catalog.description || "Sem descrição."}</p>
            <p className="mt-2 text-sm text-zinc-500">Link público: /c/{catalog.slug}</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link href="/" className="rounded-2xl border border-[#e4d8c7] bg-white px-5 py-3 text-sm font-medium transition hover:bg-[#faf6ef]">
              Início
            </Link>

            <Link href="/catalogos" className="rounded-2xl border border-[#e4d8c7] bg-white px-5 py-3 text-sm font-medium transition hover:bg-[#faf6ef]">
              Meus catálogos
            </Link>

            <Link href="/admin" className="rounded-2xl border border-[#e4d8c7] bg-white px-5 py-3 text-sm font-medium transition hover:bg-[#faf6ef]">
              Minhas páginas
            </Link>

            <Link href={`/c/${catalog.slug}`} className="rounded-2xl bg-zinc-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-zinc-700">
              Abrir catálogo
            </Link>
          </div>
        </div>

        {products.length === 0 ? (
          <div className="rounded-2xl border border-[#ece4d8] bg-[#fbf8f3] p-6 text-zinc-600">
            Você precisa publicar produtos antes de colocá-los em um catálogo.
          </div>
        ) : (
          <CatalogItemsForm catalogId={catalog.id} products={products} selectedItems={selectedItems} />
        )}
      </div>
    </main>
  );
}
