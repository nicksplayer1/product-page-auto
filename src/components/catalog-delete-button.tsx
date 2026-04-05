"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CatalogDeleteButton({ id }: { id: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    const confirmed = window.confirm("Tem certeza que deseja apagar este catálogo?");
    if (!confirmed) return;

    setLoading(true);

    try {
      const res = await fetch(`/api/catalogs/${id}`, { method: "DELETE" });
      const json = await res.json();

      if (!res.ok || !json.ok) {
        throw new Error(json.error || "Erro ao apagar catálogo.");
      }

      router.refresh();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Erro ao apagar catálogo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={loading}
      className="rounded-2xl border border-red-200 bg-white px-4 py-3 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-60"
    >
      {loading ? "Apagando..." : "Apagar"}
    </button>
  );
}
