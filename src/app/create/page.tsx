"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { slugify } from "@/lib/slugify";

export default function CreatePage() {
  const router = useRouter();

  const [sourceUrl, setSourceUrl] = useState("");
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!title.trim()) {
        throw new Error("Digite o nome do produto.");
      }

      if (!whatsappNumber.trim()) {
        throw new Error("Digite o WhatsApp.");
      }

      const baseSlug = slugify(title);
      const slug = `${baseSlug}-${Date.now()}`;

      const { data, error } = await supabase
        .from("product_pages")
        .insert([
          {
            source_url: sourceUrl || null,
            title: title.trim(),
            price: price.trim() || null,
            description: description.trim() || null,
            image_url: imageUrl.trim() || null,
            whatsapp_number: whatsappNumber.trim(),
            slug,
            status: "draft",
            mode: sourceUrl.trim() ? "auto" : "manual",
          },
        ])
        .select()
        .single();

      if (error) throw error;

      router.push(`/editor/${data.id}`);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Erro ao criar página.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-white px-6 py-10 text-zinc-900">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-bold">Criar página de produto</h1>
        <p className="mt-2 text-zinc-600">
          Cole um link do produto ou preencha os dados manualmente.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium">
              URL do produto
            </label>
            <input
              type="text"
              value={sourceUrl}
              onChange={(e) => setSourceUrl(e.target.value)}
              placeholder="https://..."
              className="w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none focus:border-zinc-900"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Nome do produto
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Organizador Multiuso Premium"
              className="w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none focus:border-zinc-900"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Preço</label>
            <input
              type="text"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Ex: R$ 79,90"
              className="w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none focus:border-zinc-900"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Descrição</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva o produto..."
              rows={5}
              className="w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none focus:border-zinc-900"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Imagem URL</label>
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://imagem-do-produto.jpg"
              className="w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none focus:border-zinc-900"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">WhatsApp</label>
            <input
              type="text"
              value={whatsappNumber}
              onChange={(e) => setWhatsappNumber(e.target.value)}
              placeholder="5564999999999"
              className="w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none focus:border-zinc-900"
            />
          </div>

          {error && (
            <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-zinc-900 px-5 py-3 font-medium text-white transition hover:bg-zinc-700 disabled:opacity-60"
          >
            {loading ? "Criando..." : "Criar e continuar"}
          </button>
        </form>
      </div>
    </main>
  );
}
