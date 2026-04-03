"use client";

import { ReactNode, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type Product = {
  id: string;
  source_url: string | null;
  title: string;
  price: string | null;
  description: string | null;
  whatsapp_number: string;
  slug: string;
  status: string | null;
};

export default function EditorForm({
  product,
  imageUrls,
}: {
  product: Product;
  imageUrls: string[];
}) {
  const router = useRouter();

  const [sourceUrl, setSourceUrl] = useState(product.source_url || "");
  const [title, setTitle] = useState(product.title || "");
  const [price, setPrice] = useState(product.price || "");
  const [description, setDescription] = useState(product.description || "");
  const [imageUrlsText, setImageUrlsText] = useState(imageUrls.join("\n"));
  const [whatsappNumber, setWhatsappNumber] = useState(product.whatsapp_number || "");
  const [slug, setSlug] = useState(product.slug || "");
  const [status, setStatus] = useState(product.status || "draft");
  const [loadingSave, setLoadingSave] = useState(false);
  const [loadingPublish, setLoadingPublish] = useState(false);
  const [message, setMessage] = useState("");

  const parsedImages = useMemo(
    () =>
      imageUrlsText
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean),
    [imageUrlsText]
  );

  async function saveOnly() {
    setMessage("");
    setLoadingSave(true);

    try {
      const res = await fetch(`/api/product-pages/${product.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source_url: sourceUrl,
          title,
          price,
          description,
          image_urls: parsedImages,
          whatsapp_number: whatsappNumber,
          slug,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error || "Erro ao salvar.");

      setMessage("Alterações salvas com sucesso.");
      router.refresh();
    } catch (err: unknown) {
      setMessage(err instanceof Error ? err.message : "Erro ao salvar.");
    } finally {
      setLoadingSave(false);
    }
  }

  async function saveAndPublish() {
    setMessage("");
    setLoadingPublish(true);

    try {
      const saveRes = await fetch(`/api/product-pages/${product.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source_url: sourceUrl,
          title,
          price,
          description,
          image_urls: parsedImages,
          whatsapp_number: whatsappNumber,
          slug,
        }),
      });

      const saveJson = await saveRes.json();
      if (!saveRes.ok || !saveJson.ok) {
        throw new Error(saveJson.error || "Erro ao salvar.");
      }

      const publishRes = await fetch(`/api/product-pages/${product.id}/publish`, {
        method: "POST",
      });

      const publishJson = await publishRes.json();
      if (!publishRes.ok || !publishJson.ok) {
        throw new Error(publishJson.error || "Erro ao publicar.");
      }

      setStatus("published");
      setMessage("Página publicada com sucesso.");
      router.refresh();
    } catch (err: unknown) {
      setMessage(err instanceof Error ? err.message : "Erro ao publicar.");
    } finally {
      setLoadingPublish(false);
    }
  }

  return (
    <div className="space-y-5">
      <Field label="URL do produto">
        <input value={sourceUrl} onChange={(e) => setSourceUrl(e.target.value)} className="w-full rounded-2xl border border-[#e4d8c7] bg-white px-4 py-3 outline-none transition focus:border-zinc-900" />
      </Field>

      <Field label="Nome do produto">
        <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded-2xl border border-[#e4d8c7] bg-white px-4 py-3 outline-none transition focus:border-zinc-900" />
      </Field>

      <Field label="Preço">
        <input value={price} onChange={(e) => setPrice(e.target.value)} className="w-full rounded-2xl border border-[#e4d8c7] bg-white px-4 py-3 outline-none transition focus:border-zinc-900" />
      </Field>

      <Field label="Descrição">
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
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
        <input value={whatsappNumber} onChange={(e) => setWhatsappNumber(e.target.value)} className="w-full rounded-2xl border border-[#e4d8c7] bg-white px-4 py-3 outline-none transition focus:border-zinc-900" />
      </Field>

      <Field label="Slug">
        <input value={slug} onChange={(e) => setSlug(e.target.value)} className="w-full rounded-2xl border border-[#e4d8c7] bg-white px-4 py-3 outline-none transition focus:border-zinc-900" />
      </Field>

      <div className="rounded-2xl border border-[#ece4d8] bg-white p-5">
        <p><strong>Status:</strong> {status}</p>
        <p className="mt-2 break-all"><strong>Preview:</strong> /{slug}</p>
        <p className="mt-2 text-sm text-zinc-600">
          Total de imagens: {parsedImages.length}
        </p>
      </div>

      {message && (
        <div className="rounded-2xl border border-[#ece4d8] bg-white px-4 py-3 text-sm text-zinc-700">
          {message}
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={saveOnly}
          disabled={loadingSave}
          className="rounded-2xl border border-[#e4d8c7] bg-white px-5 py-3 font-medium transition hover:bg-[#faf6ef] disabled:opacity-60"
        >
          {loadingSave ? "Salvando..." : "Salvar alterações"}
        </button>

        <button
          type="button"
          onClick={saveAndPublish}
          disabled={loadingPublish}
          className="rounded-2xl bg-zinc-900 px-5 py-3 font-medium text-white transition hover:bg-zinc-700 disabled:opacity-60"
        >
          {loadingPublish ? "Publicando..." : "Salvar e publicar"}
        </button>
      </div>
    </div>
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
