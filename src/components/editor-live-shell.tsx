"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import ImageFieldsManager from "@/components/image-fields-manager";
import ProductMediaGallery from "@/components/product-media-gallery";
import VideoUploadField from "@/components/video-upload-field";

type Product = {
  id: string;
  source_url: string | null;
  title: string;
  price: string | null;
  description: string | null;
  whatsapp_number: string;
  website_url?: string | null;
  shopee_url?: string | null;
  mercadolivre_url?: string | null;
  instagram_url?: string | null;
  custom_button_label?: string | null;
  custom_button_url?: string | null;
  slug: string;
  status: string | null;
  video_url?: string | null;
};

export default function EditorLiveShell({
  product,
  imageUrls,
}: {
  product: Product;
  imageUrls: string[];
}) {
  const [sourceUrl, setSourceUrl] = useState(product.source_url || "");
  const [title, setTitle] = useState(product.title || "");
  const [price, setPrice] = useState(product.price || "");
  const [description, setDescription] = useState(product.description || "");
  const [imageFields, setImageFields] = useState(
    imageUrls.length > 0 ? imageUrls : [""]
  );
  const [videoUrl, setVideoUrl] = useState(product.video_url || "");
  const [whatsappNumber, setWhatsappNumber] = useState(product.whatsapp_number || "");
  const [websiteUrl, setWebsiteUrl] = useState(product.website_url || "");
  const [shopeeUrl, setShopeeUrl] = useState(product.shopee_url || "");
  const [mercadolivreUrl, setMercadolivreUrl] = useState(product.mercadolivre_url || "");
  const [instagramUrl, setInstagramUrl] = useState(product.instagram_url || "");
  const [customButtonLabel, setCustomButtonLabel] = useState(product.custom_button_label || "");
  const [customButtonUrl, setCustomButtonUrl] = useState(product.custom_button_url || "");
  const [slug, setSlug] = useState(product.slug || "");
  const [status, setStatus] = useState(product.status || "draft");
  const [loadingSave, setLoadingSave] = useState(false);
  const [loadingPublish, setLoadingPublish] = useState(false);
  const [message, setMessage] = useState("");

  const parsedImages = useMemo(
    () => imageFields.map((item) => item.trim()).filter(Boolean),
    [imageFields]
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
          video_url: videoUrl,
          whatsapp_number: whatsappNumber,
          website_url: websiteUrl,
          shopee_url: shopeeUrl,
          mercadolivre_url: mercadolivreUrl,
          instagram_url: instagramUrl,
          custom_button_label: customButtonLabel,
          custom_button_url: customButtonUrl,
          slug,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error || "Erro ao salvar.");

      setMessage("Alterações salvas com sucesso.");
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
          video_url: videoUrl,
          whatsapp_number: whatsappNumber,
          website_url: websiteUrl,
          shopee_url: shopeeUrl,
          mercadolivre_url: mercadolivreUrl,
          instagram_url: instagramUrl,
          custom_button_label: customButtonLabel,
          custom_button_url: customButtonUrl,
          slug,
        }),
      });

      const saveJson = await saveRes.json();
      if (!saveRes.ok || !saveJson.ok) throw new Error(saveJson.error || "Erro ao salvar.");

      const publishRes = await fetch(`/api/product-pages/${product.id}/publish`, {
        method: "POST",
      });

      const publishJson = await publishRes.json();
      if (!publishRes.ok || !publishJson.ok) throw new Error(publishJson.error || "Erro ao publicar.");

      setStatus("published");
      setMessage("Página publicada com sucesso.");
    } catch (err: unknown) {
      setMessage(err instanceof Error ? err.message : "Erro ao publicar.");
    } finally {
      setLoadingPublish(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#fcfaf7] px-6 py-10 text-zinc-900">
      <div className="mx-auto max-w-7xl rounded-[28px] border border-[#ece4d8] bg-white/80 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.04)] backdrop-blur md:p-10">
        <div className="mb-8 flex flex-wrap items-start justify-between gap-4 rounded-2xl border border-[#f0e7db] bg-[#fbf8f3] p-5">
          <div>
            <h1 className="text-3xl font-bold">Editor da página</h1>
            <p className="mt-2 text-zinc-600">Agora vídeo e imagens aparecem juntos.</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link href="/" className="rounded-2xl border border-[#e4d8c7] bg-white px-5 py-3 text-sm font-medium transition hover:bg-[#faf6ef]">Início</Link>
            <Link href="/admin" className="rounded-2xl border border-[#e4d8c7] bg-white px-5 py-3 text-sm font-medium transition hover:bg-[#faf6ef]">Meu painel</Link>
            <Link href="/catalogos" className="rounded-2xl border border-[#e4d8c7] bg-white px-5 py-3 text-sm font-medium transition hover:bg-[#faf6ef]">Meus catálogos</Link>
            <Link href="/catalogo" className="rounded-2xl bg-zinc-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-zinc-700">Catálogo geral</Link>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[24px] border border-[#ece4d8] bg-[#fbf8f3] p-5">
            <h2 className="mb-4 text-xl font-bold">Prévia em tempo real</h2>

            <div className="rounded-[24px] border border-[#ece4d8] bg-white p-4">
              <ProductMediaGallery
                title={title || "Produto"}
                images={parsedImages}
                videoUrl={videoUrl}
              />

              <div className="mt-5">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">Prévia da página</p>
                <h3 className="mt-3 text-2xl font-bold leading-tight">{title || "Nome do produto"}</h3>
                <p className="mt-3 text-2xl font-semibold">{price ? `R$ ${price}` : "Preço do produto"}</p>
                <p className="mt-4 whitespace-pre-line text-sm leading-7 text-zinc-600">{description || "A descrição do produto aparecerá aqui."}</p>

                <div className="mt-5 rounded-2xl border border-[#ece4d8] bg-[#fbf8f3] p-4 text-sm text-zinc-600">
                  <p><strong>Status:</strong> {status}</p>
                  <p className="mt-2"><strong>Total de imagens:</strong> {parsedImages.length}</p>
                  <p className="mt-2"><strong>Vídeo:</strong> {videoUrl ? "sim" : "não"}</p>
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                  {whatsappNumber && <button type="button" className="rounded-2xl bg-zinc-900 px-5 py-3 font-medium text-white">WhatsApp</button>}
                  {websiteUrl && <button type="button" className="rounded-2xl border border-[#e4d8c7] bg-white px-5 py-3 font-medium">Site</button>}
                  {instagramUrl && <button type="button" className="rounded-2xl border border-[#e4d8c7] bg-white px-5 py-3 font-medium">Instagram</button>}
                  {customButtonUrl && <button type="button" className="rounded-2xl border border-[#e4d8c7] bg-white px-5 py-3 font-medium">{customButtonLabel || "Abrir link"}</button>}
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[24px] border border-[#ece4d8] bg-[#fbf8f3] p-5">
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
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={6} className="min-h-[180px] w-full rounded-2xl border border-[#e4d8c7] bg-white px-4 py-3 outline-none transition focus:border-zinc-900" />
              </Field>

              <ImageFieldsManager images={imageFields} onChange={setImageFields} />
              <VideoUploadField videoUrl={videoUrl} onChange={setVideoUrl} />

              <Field label="WhatsApp">
                <input value={whatsappNumber} onChange={(e) => setWhatsappNumber(e.target.value)} className="w-full rounded-2xl border border-[#e4d8c7] bg-white px-4 py-3 outline-none transition focus:border-zinc-900" />
              </Field>

              <Field label="Link do site">
                <input value={websiteUrl} onChange={(e) => setWebsiteUrl(e.target.value)} className="w-full rounded-2xl border border-[#e4d8c7] bg-white px-4 py-3 outline-none transition focus:border-zinc-900" />
              </Field>

              <Field label="Link Shopee">
                <input value={shopeeUrl} onChange={(e) => setShopeeUrl(e.target.value)} className="w-full rounded-2xl border border-[#e4d8c7] bg-white px-4 py-3 outline-none transition focus:border-zinc-900" />
              </Field>

              <Field label="Link Mercado Livre">
                <input value={mercadolivreUrl} onChange={(e) => setMercadolivreUrl(e.target.value)} className="w-full rounded-2xl border border-[#e4d8c7] bg-white px-4 py-3 outline-none transition focus:border-zinc-900" />
              </Field>

              <Field label="Link Instagram">
                <input value={instagramUrl} onChange={(e) => setInstagramUrl(e.target.value)} className="w-full rounded-2xl border border-[#e4d8c7] bg-white px-4 py-3 outline-none transition focus:border-zinc-900" />
              </Field>

              <Field label="Texto do botão personalizado">
                <input value={customButtonLabel} onChange={(e) => setCustomButtonLabel(e.target.value)} className="w-full rounded-2xl border border-[#e4d8c7] bg-white px-4 py-3 outline-none transition focus:border-zinc-900" />
              </Field>

              <Field label="Link do botão personalizado">
                <input value={customButtonUrl} onChange={(e) => setCustomButtonUrl(e.target.value)} className="w-full rounded-2xl border border-[#e4d8c7] bg-white px-4 py-3 outline-none transition focus:border-zinc-900" />
              </Field>

              <Field label="Slug">
                <input value={slug} onChange={(e) => setSlug(e.target.value)} className="w-full rounded-2xl border border-[#e4d8c7] bg-white px-4 py-3 outline-none transition focus:border-zinc-900" />
              </Field>

              {message && <div className="rounded-2xl border border-[#ece4d8] bg-white px-4 py-3 text-sm text-zinc-700">{message}</div>}

              <div className="flex flex-wrap gap-3">
                <button type="button" onClick={saveOnly} disabled={loadingSave} className="rounded-2xl border border-[#e4d8c7] bg-white px-5 py-3 font-medium transition hover:bg-[#faf6ef] disabled:opacity-60">
                  {loadingSave ? "Salvando..." : "Salvar alterações"}
                </button>

                <button type="button" onClick={saveAndPublish} disabled={loadingPublish} className="rounded-2xl bg-zinc-900 px-5 py-3 font-medium text-white transition hover:bg-zinc-700 disabled:opacity-60">
                  {loadingPublish ? "Publicando..." : "Salvar e publicar"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
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
