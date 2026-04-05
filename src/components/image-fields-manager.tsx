"use client";

import { ChangeEvent, useRef, useState } from "react";

type Props = {
  images: string[];
  onChange: (images: string[]) => void;
};

export default function ImageFieldsManager({ images, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  function normalizedImages(list: string[]) {
    return list.length > 0 ? list : [""];
  }

  function updateImage(index: number, value: string) {
    onChange(images.map((item, i) => (i === index ? value : item)));
  }

  function addImageField() {
    onChange([...images, ""]);
  }

  function removeImageField(index: number) {
    const next = images.filter((_, i) => i !== index);
    onChange(normalizedImages(next));
  }

  function moveImage(index: number, direction: -1 | 1) {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= images.length) return;

    const next = [...images];
    const current = next[index];
    next[index] = next[nextIndex];
    next[nextIndex] = current;
    onChange(next);
  }

  function setAsCover(index: number) {
    if (index === 0) return;
    const selected = images[index];
    const next = [selected, ...images.filter((_, i) => i !== index)];
    onChange(next);
  }

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const selectedFiles = Array.from(event.target.files || []);
    if (selectedFiles.length === 0) return;

    setUploading(true);
    setMessage("");

    try {
      const formData = new FormData();
      selectedFiles.forEach((file) => {
        formData.append("files", file);
      });

      const res = await fetch("/api/upload-image", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();

      if (!res.ok || !json.ok) {
        throw new Error(json.error || "Erro ao enviar imagem.");
      }

      const uploadedUrls = Array.isArray(json.urls) ? json.urls : [];
      const filled = images.map((item) => item.trim()).filter(Boolean);
      const merged = [...filled, ...uploadedUrls];

      onChange(normalizedImages(merged));
      setMessage(`${uploadedUrls.length} imagem(ns) enviada(s) com sucesso.`);
    } catch (err: unknown) {
      setMessage(err instanceof Error ? err.message : "Erro ao enviar imagem.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-zinc-700">
        Imagens do produto
      </label>

      <div className="rounded-2xl border border-[#e4d8c7] bg-white p-3">
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="rounded-xl bg-zinc-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-zinc-700 disabled:opacity-60"
          >
            {uploading ? "Enviando..." : "Enviar do aparelho"}
          </button>

          <button
            type="button"
            onClick={addImageField}
            className="rounded-xl border border-[#e4d8c7] px-4 py-3 text-sm font-medium transition hover:bg-[#faf6ef]"
          >
            + Adicionar campo manual
          </button>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleFileChange}
        />

        <div className="mt-4 rounded-xl border border-[#ece4d8] bg-[#fbf8f3] px-4 py-3 text-sm text-zinc-600">
          A primeira imagem da lista vira a capa do produto.
        </div>

        <div className="mt-4 space-y-3">
          {images.map((value, index) => (
            <div
              key={index}
              className="rounded-2xl border border-[#ece4d8] bg-[#fbf8f3] p-3"
            >
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-[#e4d8c7] bg-white px-3 py-1 text-xs font-medium text-zinc-700">
                  {index === 0 ? "Capa atual" : `Imagem ${index + 1}`}
                </span>

                {index !== 0 && (
                  <button
                    type="button"
                    onClick={() => setAsCover(index)}
                    className="rounded-xl border border-[#e4d8c7] bg-white px-3 py-2 text-xs font-medium transition hover:bg-[#faf6ef]"
                  >
                    Definir como capa
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => moveImage(index, -1)}
                  disabled={index === 0}
                  className="rounded-xl border border-[#e4d8c7] bg-white px-3 py-2 text-xs font-medium transition hover:bg-[#faf6ef] disabled:opacity-40"
                >
                  ↑ Subir
                </button>

                <button
                  type="button"
                  onClick={() => moveImage(index, 1)}
                  disabled={index === images.length - 1}
                  className="rounded-xl border border-[#e4d8c7] bg-white px-3 py-2 text-xs font-medium transition hover:bg-[#faf6ef] disabled:opacity-40"
                >
                  ↓ Descer
                </button>

                <button
                  type="button"
                  onClick={() => removeImageField(index)}
                  className="rounded-xl border border-red-200 bg-white px-3 py-2 text-xs font-medium text-red-600 transition hover:bg-red-50"
                >
                  Remover
                </button>
              </div>

              <input
                type="text"
                value={value}
                onChange={(e) => updateImage(index, e.target.value)}
                placeholder={`Imagem ${index + 1} - https://...`}
                className="w-full rounded-xl border border-[#e4d8c7] bg-white px-4 py-3 text-sm outline-none transition focus:border-zinc-900"
              />
            </div>
          ))}
        </div>

        {message && (
          <div className="mt-4 rounded-xl border border-[#ece4d8] bg-[#fbf8f3] px-4 py-3 text-sm text-zinc-700">
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
