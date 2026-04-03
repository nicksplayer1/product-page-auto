"use client";

import { FormEvent, ReactNode, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CreatePage() {
  const router = useRouter();

  const [sourceUrl, setSourceUrl] = useState("");
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrlsText, setImageUrlsText] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const parsedImages = useMemo(
    () =>
      imageUrlsText
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean),
    [imageUrlsText]
  );

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/product-pages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          source_url: sourceUrl,
          title,
          price,
          description,
          image_urls: parsedImages,
          whatsapp_number: whatsappNumber,
        }),
      });

      const json = await res.json();

      if (!res.ok || !json.ok) {
        throw new Error(json.error || "Erro ao criar página.");
      }

      router.push(`/editor/${json.id}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro ao criar página.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#fcfaf7] px-6 py-10 text-zinc-900">
      <div className="mx-auto max-w-7xl rounded-[28px] border border-[#ece4d8] bg-white/80 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.04)] backdrop-blur md:p-10">
        <div className="mb-8 flex flex-wrap items-start justify-between gap-4 rounded-2xl border border-[#f0e7db] bg-[#fbf8f3] p-5">
          <div>
            <h1 className="text-3xl font-bold">Criar página de produto</h1>
            <p className="mt-2 text-zinc-600">
              Preencha os dados, revise a prévia e continue para o editor.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/catalogo"
              className="rounded-2xl border border-[#e4d8c7] bg-white px-5 py-3 text-sm font-medium transition hover:bg-[#faf6ef]"
            >
              Ver catálogo
            </Link>

            <Link
              href="/admin"
              className="rounded-2xl bg-zinc-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-zinc-700"
            >
              Ir para admin
            </Link>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[24px] border border-[#ece4d8] bg-[#fbf8f3] p-5">
            <h2 className="mb-4 text-xl font-bold">Prévia rápida</h2>

            <div className="rounded-[24px] border border-[#ece4d8] bg-white p-4">
              <div className="aspect-[4/3] overflow-hidden rounded-[20px] border border-[#ece4d8] bg-[#fcfaf7]">
                {parsedImages[0] ? (
                  <img
                    src={parsedImages[0]}
                    alt={title || "Produto"}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-zinc-500">
                    Primeira imagem do produto
                  </div>
                )}
              </div>

              <div className="mt-5">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                  Prévia da página
                </p>

                <h3 className="mt-3 text-2xl font-bold leading-tight">
                  {title || "Nome do produto"}
                </h3>

                <p className="mt-3 text-2xl font-semibold">
                  {price ? `R$ ${price}` : "Preço do produto"}
                </p>

                <p className="mt-4 line-clamp-4 whitespace-pre-line text-sm leading-7 text-zinc-600">
                  {description || "A descrição do produto aparecerá aqui."}
                </p>

                <div className="mt-5 rounded-2xl border border-[#ece4d8] bg-[#fbf8f3] p-4 text-sm text-zinc-600">
                  <p><strong>Total de imagens:</strong> {parsedImages.length}</p>
                  <p className="mt-2 break-all">
                    <strong>WhatsApp:</strong>{" "}
                    {whatsappNumber || "Ainda não preenchido"}
                  </p>
                </div>

                <button
                  type="button"
                  className="mt-5 w-full rounded-2xl bg-zinc-900 px-5 py-3 font-medium text-white"
                >
                  Comprar pelo WhatsApp
                </button>
              </div>
            </div>
          </div>

          <div className="rounded-[24px] border border-[#ece4d8] bg-[#fbf8f3] p-5">
            <form onSubmit={handleSubmit} className="space-y-5">
              <Field label="URL do produto">
                <input
                  type="text"
                  value={sourceUrl}
                  onChange={(e) => setSourceUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full rounded-2xl border border-[#e4d8c7] bg-white px-4 py-3 outline-none transition focus:border-zinc-900"
                />
              </Field>

              <Field label="Nome do produto">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Organizador Multiuso Premium"
                  className="w-full rounded-2xl border border-[#e4d8c7] bg-white px-4 py-3 outline-none transition focus:border-zinc-900"
                />
              </Field>

              <Field label="Preço">
                <input
                  type="text"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="Ex: 79,90"
                  className="w-full rounded-2xl border border-[#e4d8c7] bg-white px-4 py-3 outline-none transition focus:border-zinc-900"
                />
              </Field>

              <Field label="Descrição">
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Descreva o produto..."
                  rows={6}
                  className="min-h-[180px] w-full rounded-2xl border border-[#e4d8c7] bg-white px-4 py-3 outline-none transition focus:border-zinc-900"
                />
              </Field>

              <Field label="Imagens do produto">
                <textarea
                  value={imageUrlsText}
                  onChange={(e) => setImageUrlsText(e.target.value)}
                  rows={7}
                  placeholder={"Cole uma URL por linha\nhttps://imagem1.jpg\nhttps://imagem2.jpg"}
                  className="min-h-[210px] w-full rounded-2xl border border-[#e4d8c7] bg-white px-4 py-3 font-mono text-sm outline-none transition focus:border-zinc-900"
                />
              </Field>

              <Field label="WhatsApp">
                <input
                  type="text"
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  placeholder="5564999999999"
                  className="w-full rounded-2xl border border-[#e4d8c7] bg-white px-4 py-3 outline-none transition focus:border-zinc-900"
                />
              </Field>

              {error && (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-zinc-900 px-5 py-4 font-medium text-white transition hover:bg-zinc-700 disabled:opacity-60"
              >
                {loading ? "Criando..." : "Criar e continuar"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-zinc-700">{label}</label>
      {children}
    </div>
  );
}
