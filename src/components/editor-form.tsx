"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type ProductPage = {
  id: string;
  source_url: string | null;
  title: string;
  price: string | null;
  description: string | null;
  image_url: string | null;
  whatsapp_number: string;
  slug: string;
  status: string;
};

type Props = {
  initialPage: ProductPage;
};

export default function EditorForm({ initialPage }: Props) {
  const router = useRouter();

  const [form, setForm] = useState({
    source_url: initialPage.source_url || "",
    title: initialPage.title || "",
    price: initialPage.price || "",
    description: initialPage.description || "",
    image_url: initialPage.image_url || "",
    whatsapp_number: initialPage.whatsapp_number || "",
    slug: initialPage.slug || "",
  });

  const [status, setStatus] = useState(initialPage.status || "draft");
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function updateField(name: string, value: string) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSave() {
    setSaving(true);
    setError("");
    setMessage("");

    try {
      const res = await fetch(`/api/product-pages/${initialPage.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || "Erro ao salvar.");
      }

      setMessage("Página salva com sucesso.");
      if (json.page?.status) {
        setStatus(json.page.status);
      }
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro ao salvar.");
    } finally {
      setSaving(false);
    }
  }

  async function handlePublish() {
    setPublishing(true);
    setError("");
    setMessage("");

    try {
      const saveRes = await fetch(`/api/product-pages/${initialPage.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const saveJson = await saveRes.json();

      if (!saveRes.ok) {
        throw new Error(saveJson.error || "Erro ao salvar antes de publicar.");
      }

      const publishRes = await fetch(`/api/product-pages/${initialPage.id}/publish`, {
        method: "POST",
      });

      const publishJson = await publishRes.json();

      if (!publishRes.ok) {
        throw new Error(publishJson.error || "Erro ao publicar.");
      }

      setStatus("published");
      setMessage("Página publicada com sucesso.");
      router.push(`/${form.slug}`);
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro ao publicar.");
    } finally {
      setPublishing(false);
    }
  }

  return (
    <div className="mt-8 space-y-5">
      <div>
        <label className="mb-2 block text-sm font-medium">URL do produto</label>
        <input
          type="text"
          value={form.source_url}
          onChange={(e) => updateField("source_url", e.target.value)}
          className="w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none focus:border-zinc-900"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">Nome do produto</label>
        <input
          type="text"
          value={form.title}
          onChange={(e) => updateField("title", e.target.value)}
          className="w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none focus:border-zinc-900"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">Preço</label>
        <input
          type="text"
          value={form.price}
          onChange={(e) => updateField("price", e.target.value)}
          className="w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none focus:border-zinc-900"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">Descrição</label>
        <textarea
          rows={6}
          value={form.description}
          onChange={(e) => updateField("description", e.target.value)}
          className="w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none focus:border-zinc-900"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">Imagem URL</label>
        <input
          type="text"
          value={form.image_url}
          onChange={(e) => updateField("image_url", e.target.value)}
          className="w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none focus:border-zinc-900"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">WhatsApp</label>
        <input
          type="text"
          value={form.whatsapp_number}
          onChange={(e) => updateField("whatsapp_number", e.target.value)}
          className="w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none focus:border-zinc-900"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">Slug</label>
        <input
          type="text"
          value={form.slug}
          onChange={(e) => updateField("slug", e.target.value)}
          className="w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none focus:border-zinc-900"
        />
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-sm">
        <p><strong>Status:</strong> {status}</p>
        <p className="mt-2 break-all"><strong>Preview:</strong> /{form.slug}</p>
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {message && (
        <div className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700">
          {message}
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving || publishing}
          className="rounded-2xl border border-zinc-300 px-5 py-3 font-medium transition hover:bg-zinc-100 disabled:opacity-60"
        >
          {saving ? "Salvando..." : "Salvar alterações"}
        </button>

        <button
          type="button"
          onClick={handlePublish}
          disabled={saving || publishing}
          className="rounded-2xl bg-zinc-900 px-5 py-3 font-medium text-white transition hover:bg-zinc-700 disabled:opacity-60"
        >
          {publishing ? "Publicando..." : "Salvar e publicar"}
        </button>
      </div>
    </div>
  );
}
