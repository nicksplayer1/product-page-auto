import Link from "next/link";
import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { formatPrice } from "@/lib/format-price";
import ProductGallery from "@/components/product-gallery";
import PublicProductActions from "@/components/public-product-actions";

type Props = {
  params: Promise<{ slug: string }>;
};

type ProductPage = {
  id: string;
  title: string;
  slug: string;
  price: string | null;
  description: string | null;
  image_url: string | null;
  whatsapp_number: string | null;
  status: string | null;
};

export default async function PublicProductPage({ params }: Props) {
  const { slug } = await params;

  const { data, error } = await supabaseAdmin
    .from("product_pages")
    .select("id, title, slug, price, description, image_url, whatsapp_number, status")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (error || !data) notFound();

  const product = data as ProductPage;

  const { data: galleryRows } = await supabaseAdmin
    .from("product_page_images")
    .select("image_url, sort_order")
    .eq("product_page_id", product.id)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  const images = [product.image_url, ...((galleryRows || []).map((row) => row.image_url))].filter(Boolean) as string[];

  return (
    <main className="min-h-screen bg-[#fcfaf7] px-6 py-10 text-zinc-900">
      <div className="mx-auto max-w-7xl rounded-[28px] border border-[#ece4d8] bg-white/80 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.04)] backdrop-blur md:p-10">
        <div className="mb-6 flex flex-wrap justify-end gap-3">
          <Link href="/" className="rounded-2xl border border-[#e4d8c7] bg-white px-5 py-3 text-sm font-medium transition hover:bg-[#faf6ef]">
            Início
          </Link>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[24px] border border-[#ece4d8] bg-[#fbf8f3] p-4">
            <ProductGallery images={images} title={product.title} />
          </div>

          <div className="rounded-[24px] border border-[#ece4d8] bg-[#fbf8f3] p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">Página de produto</p>
            <h1 className="mt-4 text-3xl font-bold leading-tight md:text-5xl">{product.title}</h1>
            <p className="mt-5 text-4xl font-semibold">{formatPrice(product.price)}</p>
            <p className="mt-6 whitespace-pre-line text-base leading-8 text-zinc-700">{product.description || "Sem descrição disponível."}</p>
            <PublicProductActions title={product.title} whatsappNumber={product.whatsapp_number} />
          </div>
        </div>
      </div>
    </main>
  );
}
