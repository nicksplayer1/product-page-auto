import Link from "next/link";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { formatPrice } from "@/lib/format-price";

export const dynamic = "force-dynamic";

type ProductPage = {
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

export default async function CatalogPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data, error } = await supabase
    .from("product_pages")
    .select("id, title, slug, price, image_url, whatsapp_number")
    .eq("user_id", user.id)
    .eq("status", "published")
    .order("created_at", { ascending: false });

  const products = (data || []) as ProductPage[];

  return (
    <main className="min-h-screen bg-[#fcfaf7] px-6 py-10 text-zinc-900">
      <div className="mx-auto max-w-7xl rounded-[28px] border border-[#ece4d8] bg-white/80 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.04)] backdrop-blur md:p-10">
        <div className="flex flex-wrap items-start justify-between gap-4 rounded-2xl border border-[#f0e7db] bg-[#fbf8f3] p-5">
          <div>
            <h1 className="text-3xl font-bold">Catálogo</h1>
            <p className="mt-2 text-zinc-600">
              Veja todos os seus produtos publicados em uma única página.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/"
              className="rounded-2xl border border-[#e4d8c7] bg-white px-5 py-3 text-sm font-medium transition hover:bg-[#faf6ef]"
            >
              Início
            </Link>

            <Link
              href="/create"
              className="rounded-2xl bg-zinc-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-zinc-700"
            >
              Nova página
            </Link>
          </div>
        </div>

        {error && <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">Erro ao carregar o catálogo.</div>}

        {!error && products.length === 0 && (
          <div className="mt-8 rounded-2xl border border-[#ece4d8] bg-[#fbf8f3] p-6 text-zinc-600">
            Nenhum produto publicado ainda.
          </div>
        )}

        {!error && products.length > 0 && (
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
                    <p className="mt-2 break-all text-sm text-zinc-500">/{product.slug}</p>

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
