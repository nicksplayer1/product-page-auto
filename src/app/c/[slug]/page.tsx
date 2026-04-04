import Link from "next/link";
import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { formatPrice } from "@/lib/format-price";
import PublicCatalogActions from "@/components/public-catalog-actions";

type Props = {
  params: Promise<{ slug: string }>;
};

type Catalog = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
};

type CatalogItem = {
  product_page_id: string;
  sort_order: number;
};

type Product = {
  id: string;
  title: string;
  slug: string;
  price: string | null;
  image_url: string | null;
  whatsapp_number: string | null;
};

function onlyDigits(value: string | null) {
  return String(value || "").replace(/\D/g, "");
}

export default async function PublicCatalogPage({ params }: Props) {
  const { slug } = await params;

  const { data: catalog, error } = await supabaseAdmin
    .from("catalogs")
    .select("id, name, slug, description")
    .eq("slug", slug)
    .single();

  if (error || !catalog) notFound();

  const typedCatalog = catalog as Catalog;

  const { data: itemsData } = await supabaseAdmin
    .from("catalog_items")
    .select("product_page_id, sort_order")
    .eq("catalog_id", typedCatalog.id)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  const items = (itemsData || []) as CatalogItem[];
  const productIds = items.map((item) => item.product_page_id);

  let products: Product[] = [];

  if (productIds.length > 0) {
    const { data: productsData } = await supabaseAdmin
      .from("product_pages")
      .select("id, title, slug, price, image_url, whatsapp_number")
      .in("id", productIds)
      .eq("status", "published");

    const productMap = new Map((productsData || []).map((product) => [product.id, product as Product]));
    products = productIds.map((id) => productMap.get(id)).filter(Boolean) as Product[];
  }

  return (
    <main className="min-h-screen bg-[#fcfaf7] px-6 py-10 text-zinc-900">
      <div className="mx-auto max-w-7xl rounded-[28px] border border-[#ece4d8] bg-white/80 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.04)] backdrop-blur md:p-10">
        <div className="rounded-2xl border border-[#f0e7db] bg-[#fbf8f3] p-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">{typedCatalog.name}</h1>
              <p className="mt-2 text-zinc-600">{typedCatalog.description || "Catálogo público."}</p>
            </div>

            <Link href="/" className="rounded-2xl border border-[#e4d8c7] bg-white px-5 py-3 text-sm font-medium transition hover:bg-[#faf6ef]">
              Início
            </Link>
          </div>

          <PublicCatalogActions title={typedCatalog.name} />
        </div>

        {products.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-[#ece4d8] bg-[#fbf8f3] p-6 text-zinc-600">
            Nenhum produto disponível neste catálogo.
          </div>
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => {
              const whatsapp = onlyDigits(product.whatsapp_number);
              const whatsappUrl = `https://wa.me/${whatsapp}?text=${encodeURIComponent(`Olá! Tenho interesse em ${product.title}.`)}`;

              return (
                <div key={product.id} className="overflow-hidden rounded-[24px] border border-[#ece4d8] bg-[#fbf8f3]">
                  <div className="aspect-[4/3] border-b border-[#ece4d8] bg-white">
                    {product.image_url ? (
                      <img src={product.image_url} alt={product.title} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-zinc-500">Imagem não disponível</div>
                    )}
                  </div>

                  <div className="p-5">
                    <h2 className="line-clamp-2 text-2xl font-bold leading-tight">{product.title}</h2>
                    <p className="mt-3 text-2xl font-semibold">{formatPrice(product.price)}</p>

                    <div className="mt-6 flex flex-wrap gap-3">
                      <Link href={`/${product.slug}`} className="rounded-2xl bg-zinc-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-zinc-700">
                        Ver produto
                      </Link>

                      <a href={whatsappUrl} target="_blank" rel="noreferrer" className="rounded-2xl border border-[#e4d8c7] bg-white px-4 py-3 text-sm font-medium transition hover:bg-[#faf6ef]">
                        WhatsApp
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
