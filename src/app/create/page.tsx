"use client";

import { FormEvent, ReactNode, useState } from "react";
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

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const image_urls = imageUrlsText
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean);

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
          image_urls,
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
      <div className="mx-auto max-w-3xl rounded-[28px] border border-[#ece4d8] bg-white/80 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.04)] backdrop-blur md:p-10">
        <div className="rounded-2xl border border-[#f0e7db] bg-[#fbf8f3] p-5">
          <h1 className="text-3xl font-bold">Criar página de produto</h1>
          <p className="mt-2 text-zinc-600">
            Cole o link do produto ou preencha os dados manualmente.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <Field label="URL do produto">
            <input
              type="text"
              value={sourceUrl}
              onChange={(e) => setSourceUrl(e.target.value)}
              placeholder="https://..."
              className="input-soft"
            />
          </Field>

          <Field label="Nome do produto">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Organizador Multiuso Premium"
              className="input-soft"
            />
          </Field>

          <Field label="Preço">
            <input
              type="text"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Ex: 79,90"
              className="input-soft"
            />
          </Field>

          <Field label="Descrição">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva o produto..."
              rows={5}
              className="input-soft min-h-[160px]"
            />
          </Field>

          <Field label="Imagens do produto">
            <textarea
              value={imageUrlsText}
              onChange={(e) => setImageUrlsText(e.target.value)}
              placeholder={"Cole uma URL por linha\nhttps://imagem1.jpg\nhttps://imagem2.jpg"}
              rows={5}
              className="input-soft min-h-[160px]"
            />
          </Field>

          <Field label="WhatsApp">
            <input
              type="text"
              value={whatsappNumber}
              onChange={(e) => setWhatsappNumber(e.target.value)}
              placeholder="5564999999999"
              className="input-soft"
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
