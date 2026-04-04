"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function CatalogCreateForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [slugInput, setSlugInput] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const finalSlug = useMemo(() => {
    const source = slugInput.trim() || name.trim();
    return slugify(source);
  }, [name, slugInput]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch("/api/catalogs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          slug: finalSlug,
          description,
        }),
      });

      const json = await res.json();

      if (!res.ok || !json.ok) {
        throw new Error(json.error || "Erro ao criar catálogo.");
      }

      router.push(`/catalogos/${json.id}`);
    } catch (err: unknown) {
      setMessage(err instanceof Error ? err.message : "Erro ao criar catálogo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded-[24px] border border-[#ece4d8] bg-[#fbf8f3] p-6">
      <div>
        <label className="mb-2 block text-sm font-medium text-zinc-700">Nome do catálogo</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ex: Brinquedos"
          className="w-full rounded-2xl border border-[#e4d8c7] bg-white px-4 py-3 outline-none transition focus:border-zinc-900"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-zinc-700">Slug do catálogo</label>
        <input
          value={slugInput}
          onChange={(e) => setSlugInput(e.target.value)}
          placeholder="Ex: brinquedos"
          className="w-full rounded-2xl border border-[#e4d8c7] bg-white px-4 py-3 outline-none transition focus:border-zinc-900"
        />
        <p className="mt-2 text-sm text-zinc-500">Link público: /c/{finalSlug || "seu-catalogo"}</p>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-zinc-700">Descrição</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={5}
          placeholder="Descreva este catálogo..."
          className="min-h-[140px] w-full rounded-2xl border border-[#e4d8c7] bg-white px-4 py-3 outline-none transition focus:border-zinc-900"
        />
      </div>

      {message && (
        <div className="rounded-2xl border border-[#ece4d8] bg-white px-4 py-3 text-sm text-zinc-700">
          {message}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="rounded-2xl bg-zinc-900 px-5 py-3 font-medium text-white transition hover:bg-zinc-700 disabled:opacity-60"
      >
        {loading ? "Criando..." : "Criar catálogo"}
      </button>
    </form>
  );
}
