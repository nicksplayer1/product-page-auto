import Link from "next/link";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import ProductAdminActions from "@/components/product-admin-actions";

export const dynamic = "force-dynamic";

type Product = {
  id: string;
  title: string;
  slug: string;
  price: string | null;
  status: string | null;
  theme: string | null;
  image_url: string | null;
  video_url: string | null;
  created_at: string | null;
};

function formatDate(value: string | null) {
  if (!value) return "-";
  return new Date(value).toLocaleString("pt-BR");
}

function formatPrice(value: string | null) {
  if (!value) return "Sem preço";
  if (String(value).includes("R$")) return String(value);
  return `R$ ${value}`;
}

function statusLabel(status: string | null) {
  if (status === "published") return "Publicado";
  if (status === "hidden") return "Oculto";
  return "Draft";
}

function statusClasses(status: string | null) {
  if (status === "published") return "border-emerald-200 bg-emerald-50 text-emerald-700";
  if (status === "hidden") return "border-amber-200 bg-amber-50 text-amber-700";
  return "border-zinc-200 bg-zinc-50 text-zinc-700";
}

export default async function AdminPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data, error } = await supabase
    .from("product_pages")
    .select("id, title, slug, price, status, theme, image_url, video_url, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const products = (data || []) as Product[];

  return (
    <main className="min-h-screen bg-[#fcfaf7] px-6 py-10 text-zinc-900">
      <div className="mx-auto max-w-7xl rounded-[28px] border border-[#ece4d8] bg-white/80 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.04)] backdrop-blur md:p-10">
        <div className="mb-8 flex flex-wrap items-start justify-between gap-4 rounded-2xl border border-[#f0e7db] bg-[#fbf8f3] p-5">
          <div>
            <h1 className="text-3xl font-bold">Minhas páginas</h1>
            <p className="mt-2 text-zinc-600">
              Agora com duplicar produto e ocultar sem apagar.
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
              Novo produto
            </Link>

            <Link
              href="/catalogos"
              className="rounded-2xl border border-[#e4d8c7] bg-white px-5 py-3 text-sm font-medium transition hover:bg-[#faf6ef]"
            >
              Meus catálogos
            </Link>
          </div>
        </div>

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
            Erro ao carregar produtos.
          </div>
        )}

        {!error && products.length === 0 && (
          <div className="rounded-2xl border border-[#ece4d8] bg-[#fbf8f3] p-6 text-zinc-600">
            Você ainda não criou nenhum produto.
          </div>
        )}

        {!error && products.length > 0 && (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => (
              <div
                key={product.id}
                className="rounded-[24px] border border-[#ece4d8] bg-[#fbf8f3] p-5"
              >
                <div className="overflow-hidden rounded-[20px] border border-[#ece4d8] bg-white">
                  {product.video_url ? (
                    <div className="flex aspect-[4/3] items-center justify-center bg-[#f6efe4] text-sm font-medium text-zinc-700">
                      Produto com vídeo
                    </div>
                  ) : product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.title}
                      className="aspect-[4/3] w-full object-cover"
                    />
                  ) : (
                    <div className="flex aspect-[4/3] items-center justify-center text-sm text-zinc-500">
                      Sem mídia
                    </div>
                  )}
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <span className={`rounded-full border px-3 py-1 text-xs font-medium ${statusClasses(product.status)}`}>
                    {statusLabel(product.status)}
                  </span>

                  <span className="rounded-full border border-[#e4d8c7] bg-white px-3 py-1 text-xs font-medium text-zinc-700">
                    Tema {product.theme || "clean"}
                  </span>
                </div>

                <h2 className="mt-4 text-2xl font-bold leading-tight">
                  {product.title}
                </h2>

                <p className="mt-2 text-lg font-semibold">
                  {formatPrice(product.price)}
                </p>

                <p className="mt-3 text-sm text-zinc-500">
                  Slug: /{product.slug}
                </p>

                <p className="mt-2 text-sm text-zinc-500">
                  Criado em: {formatDate(product.created_at)}
                </p>

                <div className="mt-5 flex flex-wrap gap-3">
                  <Link
                    href={`/editor/${product.id}`}
                    className="rounded-2xl bg-zinc-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-zinc-700"
                  >
                    Editar
                  </Link>

                  {product.status === "published" && (
                    <Link
                      href={`/${product.slug}`}
                      target="_blank"
                      className="rounded-2xl border border-[#e4d8c7] bg-white px-4 py-3 text-sm font-medium transition hover:bg-[#faf6ef]"
                    >
                      Abrir
                    </Link>
                  )}
                </div>

                <div className="mt-4">
                  <ProductAdminActions id={product.id} status={product.status} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
