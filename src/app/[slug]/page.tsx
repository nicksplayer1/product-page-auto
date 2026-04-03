import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase-admin";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function PublicProductPage({ params }: PageProps) {
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

  const message = encodeURIComponent(`Olá! Tenho interesse em ${data.title}`);
  const whatsappLink = `https://wa.me/${data.whatsapp_number}?text=${message}`;

  return (
    <main className="min-h-screen bg-white px-6 py-10 text-zinc-900">
      <div className="mx-auto max-w-4xl">
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            {data.image_url ? (
              <img
                src={data.image_url}
                alt={data.title}
                className="h-auto w-full rounded-3xl border border-zinc-200 object-cover"
              />
            ) : (
              <div className="flex min-h-[320px] items-center justify-center rounded-3xl border border-dashed border-zinc-300 bg-zinc-50 text-zinc-500">
                Sem imagem
              </div>
            )}
          </div>

          <div className="flex flex-col justify-center">
            <p className="text-sm font-medium uppercase tracking-wide text-zinc-500">
              Página de produto
            </p>

            <h1 className="mt-3 text-4xl font-bold tracking-tight">
              {data.title}
            </h1>

            {data.price && (
              <p className="mt-4 text-3xl font-semibold">{data.price}</p>
            )}

            {data.description && (
              <p className="mt-6 whitespace-pre-line text-zinc-700">
                {data.description}
              </p>
            )}

            <a
              href={whatsappLink}
              target="_blank"
              rel="noreferrer"
              className="mt-8 inline-flex w-full items-center justify-center rounded-2xl bg-zinc-900 px-6 py-4 font-medium text-white transition hover:bg-zinc-700 sm:w-auto"
            >
              Comprar pelo WhatsApp
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
