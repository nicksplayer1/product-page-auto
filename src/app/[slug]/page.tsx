import Link from "next/link";
import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { formatPrice } from "@/lib/format-price";
import ProductMediaGallery from "@/components/product-media-gallery";
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
  video_url: string | null;
  whatsapp_number: string | null;
  website_url: string | null;
  shopee_url: string | null;
  mercadolivre_url: string | null;
  instagram_url: string | null;
  custom_button_label: string | null;
  custom_button_url: string | null;
  theme: string | null;
  status: string | null;
};

function themeBox(theme: string | null) {
  if (theme === "oferta") return "border-[#f0c3c3] bg-[#fff7f7]";
  if (theme === "premium") return "border-[#d9ceb9] bg-[#f7f1e7]";
  if (theme === "vitrine") return "border-[#d6dfef] bg-[#f7faff]";
  return "border-[#ece4d8] bg-[#fbf8f3]";
}

export default async function PublicProductPage({ params }: Props) {
  const { slug } = await params;

  const { data, error } = await supabaseAdmin
    .from("product_pages")
    .select("id, title, slug, price, description, image_url, video_url, whatsapp_number, website_url, shopee_url, mercadolivre_url, instagram_url, custom_button_label, custom_button_url, theme, status")
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

  const images = [
    product.image_url,
    ...((galleryRows || []).map((row) => row.image_url)),
  ].filter(Boolean) as string[];

  return (
    <main className="min-h-screen bg-[#fcfaf7] px-4 py-6 text-zinc-900 sm:px-6 sm:py-10">
      <div className={`mx-auto max-w-7xl rounded-[28px] border bg-white/80 p-4 shadow-[0_20px_60px_rgba(0,0,0,0.04)] backdrop-blur sm:p-6 md:p-10 ${themeBox(product.theme)}`}>
        <div className="mb-5 flex justify-end sm:mb-6">
          <Link
            href="/"
            className="rounded-2xl border border-[#e4d8c7] bg-white px-4 py-3 text-sm font-medium transition hover:bg-[#faf6ef] sm:px-5"
          >
            Início
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-8">
          <div className="rounded-[24px] border border-[#ece4d8] bg-white p-3 sm:p-4">
            <ProductMediaGallery
              title={product.title}
              images={images}
              videoUrl={product.video_url}
            />
          </div>

          <div className="rounded-[24px] border border-[#ece4d8] bg-white p-5 sm:p-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-zinc-500">
              Página de produto
            </p>

            <h1 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
              {product.title}
            </h1>

            <p className="mt-5 text-3xl font-semibold sm:text-4xl">
              {formatPrice(product.price)}
            </p>

            <p className="mt-6 whitespace-pre-line text-sm leading-7 text-zinc-700 sm:text-base sm:leading-8">
              {product.description || "Sem descrição disponível."}
            </p>

            <PublicProductActions
              title={product.title}
              whatsappNumber={product.whatsapp_number}
              websiteUrl={product.website_url}
              shopeeUrl={product.shopee_url}
              mercadolivreUrl={product.mercadolivre_url}
              instagramUrl={product.instagram_url}
              customButtonLabel={product.custom_button_label}
              customButtonUrl={product.custom_button_url}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
