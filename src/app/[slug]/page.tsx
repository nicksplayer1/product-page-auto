import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { formatPrice } from "@/lib/format-price";
import ProductGallery from "@/components/product-gallery";

type Props = {
  params: Promise<{ slug: string }>;
};

function onlyDigits(value: string) {
  return value.replace(/\D/g, "");
}

export default async function PublicProductPage({ params }: Props) {
  const { slug } = await params;

  const { data, error } = await supabaseAdmin
    .from("product_pages")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (error || !data) notFound();

  const { data: galleryRows } = await supabaseAdmin
    .from("product_page_images")
    .select("image_url, sort_order")
    .eq("product_page_id", data.id)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  const images = Array.from(
    new Set(
      [data.image_url, ...((galleryRows || []).map((row) => row.image_url))]
        .filter(Boolean)
        .filter((url) => /^https?:\/\//i.test(String(url)))
    )
  ) as string[];

  const whatsapp = onlyDigits(data.whatsapp_number || "");
  const message = encodeURIComponent(`Olá! Tenho interesse em ${data.title}.`);
  const whatsappUrl = `https://wa.me/${whatsapp}?text=${message}`;

  return (
    <main className="min-h-screen bg-[#fcfaf7] px-6 py-10 text-zinc-900">
      <div className="mx-auto overflow-hidden rounded-[30px] border border-[#ece4d8] bg-white/85 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.04)] backdrop-blur md:p-8">
        <div className="grid gap-8 md:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[28px] border border-[#ece4d8] bg-[#fbf8f3] p-4">
            <ProductGallery images={images} title={data.title} />
          </div>

          <div className="rounded-[28px] border border-[#ece4d8] bg-[#fbf8f3] p-6 md:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
              Página de produto
            </p>

            <h1 className="mt-3 text-3xl font-bold leading-tight md:text-5xl">
              {data.title}
            </h1>

            <p className="mt-5 text-3xl font-semibold md:text-4xl">
              {formatPrice(data.price)}
            </p>

            {data.description && (
              <p className="mt-6 whitespace-pre-line text-base leading-8 text-zinc-700">
                {data.description}
              </p>
            )}

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-8 inline-flex rounded-2xl bg-zinc-900 px-6 py-4 font-medium text-white transition hover:bg-zinc-700"
            >
              Comprar pelo WhatsApp
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
