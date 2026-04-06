"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ImageFieldsManager from "@/components/image-fields-manager";
import ProductMediaGallery from "@/components/product-media-gallery";
import VideoUploadField from "@/components/video-upload-field";

const themes = [
  { value: "clean", label: "Clean" },
  { value: "vitrine", label: "Vitrine" },
  { value: "oferta", label: "Oferta" },
  { value: "premium", label: "Premium" },
];

function themeBox(theme: string) {
  if (theme === "oferta") return "border-[#f0c3c3] bg-[#fff7f7]";
  if (theme === "premium") return "border-[#d9ceb9] bg-[#f7f1e7]";
  if (theme === "vitrine") return "border-[#d6dfef] bg-[#f7faff]";
  return "border-[#ece4d8] bg-[#fbf8f3]";
}

export default function CreatePage() {
  const router = useRouter();

  const [sourceUrl, setSourceUrl] = useState("");
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrls, setImageUrls] = useState([""]);
  const [videoUrl, setVideoUrl] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [shopeeUrl, setShopeeUrl] = useState("");
  const [mercadolivreUrl, setMercadolivreUrl] = useState("");
  const [instagramUrl, setInstagramUrl] = useState("");
  const [customButtonLabel, setCustomButtonLabel] = useState("");
  const [customButtonUrl, setCustomButtonUrl] = useState("");
  const [theme, setTheme] = useState("clean");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const parsedImages = useMemo(
    () => imageUrls.map((item) => item.trim()).filter(Boolean),
    [imageUrls]
  );

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/product-pages", {
        method: "POST",
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
          theme,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error || "Erro ao criar página.");

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
            <p className="mt-2 text-zinc-600">Agora você pode escolher um tema visual.</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link href="/" className="rounded-2xl border border-[#e4d8c7] bg-white px-5 py-3 text-sm font-medium">Início</Link>
            <Link href="/admin" className="rounded-2xl border border-[#e4d8c7] bg-white px-5 py-3 text-sm font-medium">Meu painel</Link>
            <Link href="/catalogos" className="rounded-2xl border border-[#e4d8c7] bg-white px-5 py-3 text-sm font-medium">Meus catálogos</Link>
            <Link href="/catalogo" className="rounded-2xl bg-zinc-900 px-5 py-3 text-sm font-medium text-white">Catálogo geral</Link>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div className={`rounded-[24px] border p-5 ${themeBox(theme)}`}>
            <h2 className="mb-4 text-xl font-bold">Prévia rápida</h2>

            <div className="rounded-[24px] border border-[#ece4d8] bg-white p-4">
              <ProductMediaGallery title={title || "Produto"} images={parsedImages} videoUrl={videoUrl} />

              <div className="mt-5">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">Tema {theme}</p>
                <h3 className="mt-3 text-2xl font-bold leading-tight">{title || "Nome do produto"}</h3>
                <p className="mt-3 text-2xl font-semibold">{price ? `R$ ${price}` : "Preço do produto"}</p>
                <p className="mt-4 line-clamp-4 whitespace-pre-line text-sm leading-7 text-zinc-600">{description || "A descrição do produto aparecerá aqui."}</p>
              </div>
            </div>
          </div>

          <div className="rounded-[24px] border border-[#ece4d8] bg-[#fbf8f3] p-5">
            <form onSubmit={handleSubmit} className="space-y-5">
              <Field label="Tema">
                <div className="grid gap-3 sm:grid-cols-2">
                  {themes.map((item) => (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() => setTheme(item.value)}
                      className={`rounded-2xl border px-4 py-3 text-left text-sm font-medium ${
                        theme === item.value
                          ? "border-zinc-900 bg-zinc-900 text-white"
                          : "border-[#e4d8c7] bg-white"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </Field>

              <Field label="URL do produto"><input type="text" value={sourceUrl} onChange={(e) => setSourceUrl(e.target.value)} className="w-full rounded-2xl border border-[#e4d8c7] bg-white px-4 py-3" /></Field>
              <Field label="Nome do produto"><input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded-2xl border border-[#e4d8c7] bg-white px-4 py-3" /></Field>
              <Field label="Preço"><input type="text" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full rounded-2xl border border-[#e4d8c7] bg-white px-4 py-3" /></Field>
              <Field label="Descrição"><textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={6} className="min-h-[180px] w-full rounded-2xl border border-[#e4d8c7] bg-white px-4 py-3" /></Field>

              <ImageFieldsManager images={imageUrls} onChange={setImageUrls} />
              <VideoUploadField videoUrl={videoUrl} onChange={setVideoUrl} />

              <Field label="WhatsApp"><input type="text" value={whatsappNumber} onChange={(e) => setWhatsappNumber(e.target.value)} className="w-full rounded-2xl border border-[#e4d8c7] bg-white px-4 py-3" /></Field>
              <Field label="Link do site"><input type="text" value={websiteUrl} onChange={(e) => setWebsiteUrl(e.target.value)} className="w-full rounded-2xl border border-[#e4d8c7] bg-white px-4 py-3" /></Field>
              <Field label="Link Shopee"><input type="text" value={shopeeUrl} onChange={(e) => setShopeeUrl(e.target.value)} className="w-full rounded-2xl border border-[#e4d8c7] bg-white px-4 py-3" /></Field>
              <Field label="Link Mercado Livre"><input type="text" value={mercadolivreUrl} onChange={(e) => setMercadolivreUrl(e.target.value)} className="w-full rounded-2xl border border-[#e4d8c7] bg-white px-4 py-3" /></Field>
              <Field label="Link Instagram"><input type="text" value={instagramUrl} onChange={(e) => setInstagramUrl(e.target.value)} className="w-full rounded-2xl border border-[#e4d8c7] bg-white px-4 py-3" /></Field>
              <Field label="Texto do botão personalizado"><input type="text" value={customButtonLabel} onChange={(e) => setCustomButtonLabel(e.target.value)} className="w-full rounded-2xl border border-[#e4d8c7] bg-white px-4 py-3" /></Field>
              <Field label="Link do botão personalizado"><input type="text" value={customButtonUrl} onChange={(e) => setCustomButtonUrl(e.target.value)} className="w-full rounded-2xl border border-[#e4d8c7] bg-white px-4 py-3" /></Field>

              {error && <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>}

              <button type="submit" disabled={loading} className="w-full rounded-2xl bg-zinc-900 px-5 py-4 font-medium text-white">
                {loading ? "Criando..." : "Criar e continuar"}
              </button>
            </form>
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
