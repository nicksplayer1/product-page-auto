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

  const initialSelectedIds = useMemo(() => {
    const sorted = [...selectedItems].sort((a, b) => a.sort_order - b.sort_order);
    return sorted.map((item) => item.product_page_id);
  }, [selectedItems]);

  const [selectedIds, setSelectedIds] = useState<string[]>(initialSelectedIds);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const selectedCount = selectedIds.length;

  const productMap = useMemo(() => {
    const map = new Map<string, Product>();
    products.forEach((product) => map.set(product.id, product));
    return map;
  }, [products]);

  const selectedProducts = useMemo(
    () => selectedIds.map((id) => productMap.get(id)).filter(Boolean) as Product[],
    [selectedIds, productMap]
  );

  function isSelected(id: string) {
    return selectedIds.includes(id);
  }

  function toggleProduct(id: string, checked: boolean) {
    setMessage("");

    if (checked) {
      setSelectedIds((current) => (current.includes(id) ? current : [...current, id]));
      return;
    }

    setSelectedIds((current) => current.filter((item) => item !== id));
  }

  function moveSelected(id: string, direction: -1 | 1) {
    setMessage("");

    setSelectedIds((current) => {
      const index = current.indexOf(id);
      if (index === -1) return current;

      const nextIndex = index + direction;
      if (nextIndex < 0 || nextIndex >= current.length) return current;

      const next = [...current];
      const temp = next[index];
      next[index] = next[nextIndex];
      next[nextIndex] = temp;
      return next;
    });
  }

  async function handleSave() {
    setMessage("");
    setLoading(true);

    try {
      const items = selectedIds.map((product_page_id, index) => ({
        product_page_id,
        sort_order: index + 1,
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

      setMessage("Catálogo salvo com sucesso.");
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

      <div className="rounded-[24px] border border-[#ece4d8] bg-[#fbf8f3] p-5">
        <h2 className="text-2xl font-bold">Ordem do catálogo</h2>
        <p className="mt-2 text-sm text-zinc-600">
          Use os botões para subir ou descer os produtos já selecionados.
        </p>

        {selectedProducts.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-[#ece4d8] bg-white p-4 text-sm text-zinc-500">
            Nenhum produto selecionado ainda.
          </div>
        ) : (
          <div className="mt-4 space-y-3">
            {selectedProducts.map((product, index) => (
              <div
                key={product.id}
                className="rounded-2xl border border-[#ece4d8] bg-white p-4"
              >
                <div className="grid gap-4 md:grid-cols-[72px_1fr_auto] md:items-center">
                  <div className="h-[72px] w-[72px] overflow-hidden rounded-xl border border-[#ece4d8] bg-[#fbf8f3]">
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs text-zinc-500">
                        Sem imagem
                      </div>
                    )}
                  </div>

                  <div>
                    <span className="inline-flex rounded-full border border-[#e4d8c7] bg-[#fbf8f3] px-3 py-1 text-xs font-medium text-zinc-700">
                      Posição {index + 1}
                    </span>
                    <h3 className="mt-2 text-2xl font-bold leading-tight">{product.title}</h3>
                    <p className="mt-1 text-sm text-zinc-500">/{product.slug}</p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => moveSelected(product.id, -1)}
                      disabled={index === 0}
                      className="rounded-xl border border-[#e4d8c7] bg-white px-4 py-3 text-sm font-medium transition hover:bg-[#faf6ef] disabled:opacity-40"
                    >
                      ↑ Subir
                    </button>

                    <button
                      type="button"
                      onClick={() => moveSelected(product.id, 1)}
                      disabled={index === selectedProducts.length - 1}
                      className="rounded-xl border border-[#e4d8c7] bg-white px-4 py-3 text-sm font-medium transition hover:bg-[#faf6ef] disabled:opacity-40"
                    >
                      ↓ Descer
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleSave}
            disabled={loading}
            className="rounded-2xl bg-zinc-900 px-5 py-3 font-medium text-white transition hover:bg-zinc-700 disabled:opacity-60"
          >
            {loading ? "Salvando..." : "Salvar catálogo"}
          </button>

          {message && (
            <div className="rounded-2xl border border-[#ece4d8] bg-white px-4 py-3 text-sm text-zinc-700">
              {message}
            </div>
          )}
        </div>
      </div>

      <div className="rounded-[24px] border border-[#ece4d8] bg-[#fbf8f3] p-5">
        <h2 className="text-2xl font-bold">Selecionar produtos</h2>
        <p className="mt-2 text-sm text-zinc-600">
          Marque os produtos que devem entrar neste catálogo.
        </p>

        <div className="mt-4 space-y-3">
          {products.map((product) => {
            const checked = isSelected(product.id);

            return (
              <div
                key={product.id}
                className="rounded-2xl border border-[#ece4d8] bg-white p-4"
              >
                <div className="grid gap-4 md:grid-cols-[72px_1fr_auto] md:items-center">
                  <div className="h-[72px] w-[72px] overflow-hidden rounded-xl border border-[#ece4d8] bg-[#fbf8f3]">
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs text-zinc-500">
                        Sem imagem
                      </div>
                    )}
                  </div>

                  <div>
                    {checked && (
                      <span className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                        Selecionado
                      </span>
                    )}
                    <h3 className="mt-2 text-2xl font-bold leading-tight">{product.title}</h3>
                    <p className="mt-1 text-sm text-zinc-500">/{product.slug}</p>
                  </div>

                  <label className="flex items-center gap-2 text-sm font-medium text-zinc-700">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={(e) => toggleProduct(product.id, e.target.checked)}
                    />
                    Incluir
                  </label>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleSave}
            disabled={loading}
            className="rounded-2xl bg-zinc-900 px-5 py-3 font-medium text-white transition hover:bg-zinc-700 disabled:opacity-60"
          >
            {loading ? "Salvando..." : "Salvar catálogo"}
          </button>

          {message && (
            <div className="rounded-2xl border border-[#ece4d8] bg-white px-4 py-3 text-sm text-zinc-700">
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
