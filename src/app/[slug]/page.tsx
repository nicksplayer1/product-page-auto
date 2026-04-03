import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { formatPrice } from "@/lib/format-price";

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

  if (error || !data) {
    notFound();
  }

  const whatsapp = onlyDigits(data.whatsapp_number || "");
  const message = encodeURIComponent(`Olá! Tenho interesse em ${data.title}.`);
  const whatsappUrl = `https://wa.me/${whatsapp}?text=${message}`;
  const hasValidImage =
    !!data.image_url && /^https?:\/\//i.test(String(data.image_url));

  return (
    <main className="min-h-screen bg-white px-6 py-10 text-zinc-900">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-2">
        <div>
          {hasValidImage ? (
            <img
              src={data.image_url}
              alt={data.title}
              className="w-full rounded-2xl border border-zinc-200 object-cover"
            />
          ) : (
            <div className="flex h-[320px] w-full items-center justify-center rounded-2xl border border-zinc-200 bg-zinc-100 text-zinc-500">
              Imagem não disponível
            </div>
          )}
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
            Página de produto
          </p>

          <h1 className="mt-3 text-4xl font-bold">{data.title}</h1>

          <p className="mt-4 text-3xl font-semibold">
            {formatPrice(data.price)}
          </p>

          {data.description && (
            <p className="mt-6 whitespace-pre-line text-zinc-700">
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
    </main>
  );
}
