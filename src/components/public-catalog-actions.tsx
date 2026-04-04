"use client";

import { useState } from "react";

type Props = {
  title: string;
};

export default function PublicCatalogActions({ title }: Props) {
  const [message, setMessage] = useState("");

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
    <div className="mt-4 flex flex-wrap gap-3">
      <button type="button" onClick={copyLink} className="rounded-2xl border border-[#e4d8c7] bg-white px-4 py-3 text-sm font-medium transition hover:bg-[#faf6ef]">
        Copiar link
      </button>

      <button type="button" onClick={shareLink} className="rounded-2xl border border-[#e4d8c7] bg-white px-4 py-3 text-sm font-medium transition hover:bg-[#faf6ef]">
        Compartilhar
      </button>
    </div>
  );
}
