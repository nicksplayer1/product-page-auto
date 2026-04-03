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
      if (!title.trim()) throw new Error("Digite o nome do produto.");
      if (!whatsappNumber.trim()) throw new Error("Digite o WhatsApp.");

      const slug = `${slugify(title)}-${Date.now()}`;

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
      setError(err instanceof Error ? err.message : "Erro ao criar página.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f6f1e8] px-6 py-10 text-zinc-900">
      <div className="mx-auto max-w-3xl rounded-[28px] border border-[#e7ddcf] bg-white/75 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.05)] backdrop-blur md:p-10">
        <div className="rounded-2xl border border-[#eee4d7] bg-[#fbf8f3] p-5">
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
              className="w-full rounded-2xl border border-[#ddd1c0] bg-white px-4 py-3 outline-none transition focus:border-zinc-900"
            />
          </Field>

          <Field label="Nome do produto">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Organizador Multiuso Premium"
              className="w-full rounded-2xl border border-[#ddd1c0] bg-white px-4 py-3 outline-none transition focus:border-zinc-900"
            />
          </Field>

          <Field label="Preço">
            <input
              type="text"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Ex: 79,90"
              className="w-full rounded-2xl border border-[#ddd1c0] bg-white px-4 py-3 outline-none transition focus:border-zinc-900"
            />
          </Field>

          <Field label="Descrição">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva o produto..."
              rows={5}
              className="min-h-[160px] w-full rounded-2xl border border-[#ddd1c0] bg-white px-4 py-3 outline-none transition focus:border-zinc-900"
            />
          </Field>

          <Field label="Imagem URL">
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://imagem-do-produto.jpg"
              className="w-full rounded-2xl border border-[#ddd1c0] bg-white px-4 py-3 outline-none transition focus:border-zinc-900"
            />
          </Field>

          <Field label="WhatsApp">
            <input
              type="text"
              value={whatsappNumber}
              onChange={(e) => setWhatsappNumber(e.target.value)}
              placeholder="5564999999999"
              className="w-full rounded-2xl border border-[#ddd1c0] bg-white px-4 py-3 outline-none transition focus:border-zinc-900"
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
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-zinc-700">{label}</label>
      {children}
    </div>
  );
}
