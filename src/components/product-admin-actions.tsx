"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  id: string;
  status: string | null;
};

export default function ProductAdminActions({ id, status }: Props) {
  const router = useRouter();
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  async function handleDuplicate() {
    setLoadingAction("duplicate");

    try {
      const res = await fetch(`/api/product-pages/${id}/duplicate`, {
        method: "POST",
      });

      const json = await res.json();

      if (!res.ok || !json.ok) {
        throw new Error(json.error || "Erro ao duplicar produto.");
      }

      router.refresh();
      alert("Produto duplicado com sucesso.");
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Erro ao duplicar produto.");
    } finally {
      setLoadingAction(null);
    }
  }

  async function handleVisibility(action: "hide" | "show") {
    setLoadingAction(action);

    try {
      const res = await fetch(`/api/product-pages/${id}/visibility`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action }),
      });

      const json = await res.json();

      if (!res.ok || !json.ok) {
        throw new Error(json.error || "Erro ao alterar visibilidade.");
      }

      router.refresh();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Erro ao alterar visibilidade.");
    } finally {
      setLoadingAction(null);
    }
  }

  return (
    <div className="flex flex-wrap gap-3">
      <button
        type="button"
        onClick={handleDuplicate}
        disabled={loadingAction !== null}
        className="rounded-2xl border border-[#e4d8c7] bg-white px-4 py-3 text-sm font-medium transition hover:bg-[#faf6ef] disabled:opacity-60"
      >
        {loadingAction === "duplicate" ? "Duplicando..." : "Duplicar"}
      </button>

      {status === "published" && (
        <button
          type="button"
          onClick={() => handleVisibility("hide")}
          disabled={loadingAction !== null}
          className="rounded-2xl border border-amber-200 bg-white px-4 py-3 text-sm font-medium text-amber-700 transition hover:bg-amber-50 disabled:opacity-60"
        >
          {loadingAction === "hide" ? "Ocultando..." : "Ocultar"}
        </button>
      )}

      {status === "hidden" && (
        <button
          type="button"
          onClick={() => handleVisibility("show")}
          disabled={loadingAction !== null}
          className="rounded-2xl border border-emerald-200 bg-white px-4 py-3 text-sm font-medium text-emerald-700 transition hover:bg-emerald-50 disabled:opacity-60"
        >
          {loadingAction === "show" ? "Mostrando..." : "Mostrar novamente"}
        </button>
      )}
    </div>
  );
}
