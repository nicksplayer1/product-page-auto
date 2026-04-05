"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Catalog = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
};

export default function CatalogEditForm({ catalog }: { catalog: Catalog }) {
  const router = useRouter();
  const [name, setName] = useState(catalog.name || "");
  const [slug, setSlug] = useState(catalog.slug || "");
  const [description, setDescription] = useState(catalog.description || "");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSave() {
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(`/api/catalogs/${catalog.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, slug, description }),
      });

      const json = await res.json();

      if (!res.ok || !json.ok) {
        throw new Error(json.error || "Erro ao salvar catálogo.");
      }

      setMessage("Catálogo salvo com sucesso.");
      router.refresh();
    } catch (err: unknown) {
      setMessage(err instanceof Error ? err.message : "Erro ao salvar catálogo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-5">
      <Field label="Nome do catálogo">
        <input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-2xl border border-[#e4d8c7] bg-white px-4 py-3 outline-none transition focus:border-zinc-900" />
      </Field>

      <Field label="Slug público">
        <input value={slug} onChange={(e) => setSlug(e.target.value)} className="w-full rounded-2xl border border-[#e4d8c7] bg-white px-4 py-3 outline-none transition focus:border-zinc-900" />
      </Field>

      <Field label="Descrição">
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={5} className="min-h-[160px] w-full rounded-2xl border border-[#e4d8c7] bg-white px-4 py-3 outline-none transition focus:border-zinc-900" />
      </Field>

      <div className="rounded-2xl border border-[#ece4d8] bg-white p-4 text-sm text-zinc-600">
        Link público: <span className="break-all font-medium text-zinc-900">/c/{slug || "slug-do-catalogo"}</span>
      </div>

      {message && <div className="rounded-2xl border border-[#ece4d8] bg-white px-4 py-3 text-sm text-zinc-700">{message}</div>}

      <button type="button" onClick={handleSave} disabled={loading} className="rounded-2xl bg-zinc-900 px-5 py-3 font-medium text-white transition hover:bg-zinc-700 disabled:opacity-60">
        {loading ? "Salvando..." : "Salvar catálogo"}
      </button>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-zinc-700">{label}</label>
      {children}
    </div>
  );
}
