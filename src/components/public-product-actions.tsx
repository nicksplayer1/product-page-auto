"use client";

import { useState } from "react";

type Props = {
  title: string;
  whatsappNumber: string | null;
};

function onlyDigits(value: string | null) {
  return String(value || "").replace(/\D/g, "");
}

export default function PublicProductActions({ title, whatsappNumber }: Props) {
  const [message, setMessage] = useState("");

  const whatsapp = onlyDigits(whatsappNumber);
  const whatsappUrl = `https://wa.me/${whatsapp}?text=${encodeURIComponent(`Olá! Tenho interesse em ${title}.`)}`;

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setMessage("Link copiado com sucesso.");
    } catch {
      setMessage("Não foi possível copiar o link.");
    }
  }

  async function shareLink() {
    try {
      if (navigator.share) {
        await navigator.share({ title, url: window.location.href });
        return;
      }
      await copyLink();
    } catch {}
  }

  return (
    <div className="mt-8">
      <div className="flex flex-wrap gap-3">
        <a href={whatsappUrl} target="_blank" rel="noreferrer" className="rounded-2xl bg-zinc-900 px-5 py-3 font-medium text-white transition hover:bg-zinc-700">
          Comprar pelo WhatsApp
        </a>

        <button type="button" onClick={copyLink} className="rounded-2xl border border-[#e4d8c7] bg-white px-5 py-3 font-medium transition hover:bg-[#faf6ef]">
          Copiar link
        </button>

        <button type="button" onClick={shareLink} className="rounded-2xl border border-[#e4d8c7] bg-white px-5 py-3 font-medium transition hover:bg-[#faf6ef]">
          Compartilhar
        </button>
      </div>

      {message && <div className="mt-4 rounded-2xl border border-[#ece4d8] bg-white px-4 py-3 text-sm text-zinc-700">{message}</div>}
    </div>
  );
}
