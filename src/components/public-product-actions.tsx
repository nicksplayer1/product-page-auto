"use client";

type Props = {
  title: string;
  whatsappNumber?: string | null;
  websiteUrl?: string | null;
  shopeeUrl?: string | null;
  mercadolivreUrl?: string | null;
  instagramUrl?: string | null;
  customButtonLabel?: string | null;
  customButtonUrl?: string | null;
};

export default function PublicProductActions({
  title,
  whatsappNumber,
  websiteUrl,
  shopeeUrl,
  mercadolivreUrl,
  instagramUrl,
  customButtonLabel,
  customButtonUrl,
}: Props) {
  const pageUrl =
    typeof window !== "undefined" ? window.location.href : "";

  const whatsappHref = whatsappNumber
    ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Olá! Tenho interesse em: ${title}`)}`
    : null;

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(pageUrl);
      alert("Link copiado.");
    } catch {
      alert("Não foi possível copiar o link.");
    }
  }

  async function handleShare() {
    try {
      if (navigator.share) {
        await navigator.share({
          title,
          url: pageUrl,
        });
      } else {
        await navigator.clipboard.writeText(pageUrl);
        alert("Link copiado.");
      }
    } catch {}
  }

  const actions = [
    whatsappHref
      ? {
          label: "Comprar pelo WhatsApp",
          href: whatsappHref,
          primary: true,
        }
      : null,
    websiteUrl
      ? {
          label: "Ver no site",
          href: websiteUrl,
          primary: false,
        }
      : null,
    shopeeUrl
      ? {
          label: "Ver na Shopee",
          href: shopeeUrl,
          primary: false,
        }
      : null,
    mercadolivreUrl
      ? {
          label: "Ver no Mercado Livre",
          href: mercadolivreUrl,
          primary: false,
        }
      : null,
    instagramUrl
      ? {
          label: "Instagram",
          href: instagramUrl,
          primary: false,
        }
      : null,
    customButtonUrl
      ? {
          label: customButtonLabel || "Abrir link",
          href: customButtonUrl,
          primary: false,
        }
      : null,
  ].filter(Boolean) as { label: string; href: string; primary: boolean }[];

  return (
    <div className="mt-8 space-y-3">
      <div className="grid gap-3 sm:flex sm:flex-wrap">
        {actions.map((action) => (
          <a
            key={`${action.label}-${action.href}`}
            href={action.href}
            target="_blank"
            rel="noreferrer"
            className={
              action.primary
                ? "inline-flex w-full items-center justify-center rounded-2xl bg-zinc-900 px-5 py-3 text-center font-medium text-white transition hover:bg-zinc-700 sm:w-auto"
                : "inline-flex w-full items-center justify-center rounded-2xl border border-[#e4d8c7] bg-white px-5 py-3 text-center font-medium transition hover:bg-[#faf6ef] sm:w-auto"
            }
          >
            {action.label}
          </a>
        ))}

        <button
          type="button"
          onClick={handleCopyLink}
          className="inline-flex w-full items-center justify-center rounded-2xl border border-[#e4d8c7] bg-white px-5 py-3 text-center font-medium transition hover:bg-[#faf6ef] sm:w-auto"
        >
          Copiar link
        </button>

        <button
          type="button"
          onClick={handleShare}
          className="inline-flex w-full items-center justify-center rounded-2xl border border-[#e4d8c7] bg-white px-5 py-3 text-center font-medium transition hover:bg-[#faf6ef] sm:w-auto"
        >
          Compartilhar
        </button>
      </div>
    </div>
  );
}
