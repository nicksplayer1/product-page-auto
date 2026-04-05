"use client";

import { ChangeEvent, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";

type Props = {
  videoUrl: string;
  onChange: (value: string) => void;
};

export default function VideoUploadField({ videoUrl, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setMessage("");

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("Faça login antes de enviar vídeo.");
      }

      const extension = file.name.split(".").pop() || "mp4";
      const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "-");
      const filePath = `${user.id}/${Date.now()}-${safeName}.${extension}`;

      const { error: uploadError } = await supabase.storage
        .from("product-videos")
        .upload(filePath, file, {
          upsert: false,
        });

      if (uploadError) {
        throw new Error(uploadError.message);
      }

      const { data } = supabase.storage
        .from("product-videos")
        .getPublicUrl(filePath);

      onChange(data.publicUrl);
      setMessage("Vídeo enviado com sucesso.");
    } catch (err: unknown) {
      setMessage(err instanceof Error ? err.message : "Erro ao enviar vídeo.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-zinc-700">
        Vídeo do produto
      </label>

      <div className="rounded-2xl border border-[#e4d8c7] bg-white p-3">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="rounded-xl bg-zinc-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-zinc-700 disabled:opacity-60"
        >
          {uploading ? "Enviando..." : "Enviar vídeo do aparelho"}
        </button>

        <input
          ref={inputRef}
          type="file"
          accept="video/*"
          className="hidden"
          onChange={handleFileChange}
        />

        <input
          type="text"
          value={videoUrl}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://...video.mp4"
          className="mt-4 w-full rounded-xl border border-[#e4d8c7] bg-white px-4 py-3 text-sm outline-none transition focus:border-zinc-900"
        />

        {message && (
          <div className="mt-4 rounded-xl border border-[#ece4d8] bg-[#fbf8f3] px-4 py-3 text-sm text-zinc-700">
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
