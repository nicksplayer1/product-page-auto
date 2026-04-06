"use client";

type Props = {
  productId: string;
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
  productId,
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

  function trackClick(buttonType: string, destinationUrl?: string | null) {
    const payload = JSON.stringify({
      product_page_id: productId,
      button_type: buttonType,
      destination_url: destinationUrl || null,
    });

    try {
      if (navigator.sendBeacon) {
        const blob = new Blob([payload], { type: "application/json" });
        navigator.sendBeacon("/api/track-click", blob);
        return;
      }
    } catch {}

    fetch("/api/track-click", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: payload,
      keepalive: true,
    }).catch(() => {});
  }

  function openExternal(buttonType: string, url: string) {
    trackClick(buttonType, url);
    window.open(url, "_blank", "noopener,noreferrer");
  }

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(pageUrl);
      trackClick("copy_link", pageUrl);
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
        trackClick("share", pageUrl);
      } else {
        await navigator.clipboard.writeText(pageUrl);
        trackClick("share", pageUrl);
        alert("Link copiado.");
      }
    } catch {}
  }

  const actions = [
    whatsappHref
      ? {
          label: "Comprar pelo WhatsApp",
          href: whatsappHref,
          buttonType: "whatsapp",
          primary: true,
        }
      : null,
    websiteUrl
      ? {
          label: "Ver no site",
          href: websiteUrl,
          buttonType: "website",
          primary: false,
        }
      : null,
    shopeeUrl
      ? {
          label: "Ver na Shopee",
          href: shopeeUrl,
          buttonType: "shopee",
          primary: false,
        }
      : null,
    mercadolivreUrl
      ? {
          label: "Ver no Mercado Livre",
          href: mercadolivreUrl,
          buttonType: "mercadolivre",
          primary: false,
        }
      : null,
    instagramUrl
      ? {
          label: "Instagram",
          href: instagramUrl,
          buttonType: "instagram",
          primary: false,
        }
      : null,
    customButtonUrl
      ? {
          label: customButtonLabel || "Abrir link",
          href: customButtonUrl,
          buttonType: "custom",
          primary: false,
        }
      : null,
  ].filter(Boolean) as {
    label: string;
    href: string;
    buttonType: string;
    primary: boolean;
  }[];

  return (
    <div className="mt-8 space-y-3">
      <div className="grid gap-3 sm:flex sm:flex-wrap">
        {actions.map((action) => (
          <button
            key={`${action.label}-${action.href}`}
            type="button"
            onClick={() => openExternal(action.buttonType, action.href)}
            className={
              action.primary
                ? "inline-flex w-full items-center justify-center rounded-2xl bg-zinc-900 px-5 py-3 text-center font-medium text-white transition hover:bg-zinc-700 sm:w-auto"
                : "inline-flex w-full items-center justify-center rounded-2xl border border-[#e4d8c7] bg-white px-5 py-3 text-center font-medium transition hover:bg-[#faf6ef] sm:w-auto"
            }
          >
            {action.label}
          </button>
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
