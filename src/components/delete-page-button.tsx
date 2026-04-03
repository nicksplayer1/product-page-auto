"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeletePageButton({ id }: { id: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    const confirmed = window.confirm("Deseja apagar esta página?");
    if (!confirmed) return;

    setLoading(true);

    try {
      const res = await fetch(`/api/product-pages/${id}`, {
        method: "DELETE",
      });

      const json = await res.json();

      if (!res.ok || !json.ok) {
        throw new Error(json.error || "Erro ao apagar.");
      }

      router.refresh();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Erro ao apagar.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={loading}
      className="rounded-xl border border-red-200 bg-white px-3 py-2 text-sm text-red-600 transition hover:bg-red-50 disabled:opacity-60"
    >
      {loading ? "Apagando..." : "Apagar"}
    </button>
  );
}
