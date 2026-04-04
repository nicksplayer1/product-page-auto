"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type Product = {
  id: string;
  title: string;
  slug: string;
  price: string | null;
  image_url: string | null;
};

type SelectedItem = {
  product_page_id: string;
  sort_order: number;
};

type Props = {
  catalogId: string;
  products: Product[];
  selectedItems: SelectedItem[];
};

export default function CatalogItemsForm({
  catalogId,
  products,
  selectedItems,
}: Props) {
  const router = useRouter();
  const [selectedMap, setSelectedMap] = useState<Record<string, { selected: boolean; sort_order: number }>>(() => {
    const map: Record<string, { selected: boolean; sort_order: number }> = {};
    products.forEach((product, index) => {
      const found = selectedItems.find((item) => item.product_page_id === product.id);
      map[product.id] = {
        selected: Boolean(found),
        sort_order: found?.sort_order ?? index,
      };
    });
    return map;
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const selectedCount = useMemo(
    () => Object.values(selectedMap).filter((item) => item.selected).length,
    [selectedMap]
  );

  function toggleProduct(id: string, checked: boolean) {
    setSelectedMap((current) => ({
      ...current,
      [id]: {
        ...current[id],
        selected: checked,
      },
    }));
  }

  function updateOrder(id: string, value: string) {
    setSelectedMap((current) => ({
      ...current,
      [id]: {
        ...current[id],
        sort_order: Number(value) || 0,
      },
    }));
  }

  async function handleSave() {
    setMessage("");
    setLoading(true);

    try {
      const items = Object.entries(selectedMap)
        .filter(([, value]) => value.selected)
        .map(([product_page_id, value]) => ({
          product_page_id,
          sort_order: value.sort_order,
        }));

      const res = await fetch(`/api/catalogs/${catalogId}/items`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ items }),
      });

      const json = await res.json();

      if (!res.ok || !json.ok) {
        throw new Error(json.error || "Erro ao salvar catálogo.");
      }

      setMessage("Produtos do catálogo salvos com sucesso.");
      router.refresh();
    } catch (err: unknown) {
      setMessage(err instanceof Error ? err.message : "Erro ao salvar catálogo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-[#ece4d8] bg-white p-4 text-sm text-zinc-700">
        Produtos selecionados: {selectedCount}
      </div>

      <div className="space-y-4">
        {products.map((product) => {
          const state = selectedMap[product.id];
          return (
            <div
              key={product.id}
              className="rounded-2xl border border-[#ece4d8] bg-white p-4"
            >
              <div className="grid gap-4 md:grid-cols-[96px_1fr_auto] md:items-center">
                <div className="h-24 w-24 overflow-hidden rounded-xl border border-[#ece4d8] bg-[#fbf8f3]">
                  {product.image_url ? (
                    <img src={product.image_url} alt={product.title} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs text-zinc-500">
                      Sem imagem
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="font-semibold">{product.title}</h3>
                  <p className="mt-1 text-sm text-zinc-500">/{product.slug}</p>
                  <label className="mt-3 flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={state?.selected || false}
                      onChange={(e) => toggleProduct(product.id, e.target.checked)}
                    />
                    Incluir no catálogo
                  </label>
                </div>

                <div>
                  <label className="mb-2 block text-sm text-zinc-600">Ordem</label>
                  <input
                    type="number"
                    value={state?.sort_order ?? 0}
                    onChange={(e) => updateOrder(product.id, e.target.value)}
                    disabled={!state?.selected}
                    className="w-24 rounded-xl border border-[#e4d8c7] bg-white px-3 py-2 text-sm outline-none disabled:opacity-50"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {message && (
        <div className="rounded-2xl border border-[#ece4d8] bg-white px-4 py-3 text-sm text-zinc-700">
          {message}
        </div>
      )}

      <button
        type="button"
        onClick={handleSave}
        disabled={loading}
        className="rounded-2xl bg-zinc-900 px-5 py-3 font-medium text-white transition hover:bg-zinc-700 disabled:opacity-60"
      >
        {loading ? "Salvando..." : "Salvar catálogo"}
      </button>
    </div>
  );
}
