"use client";

import { useMemo, useState } from "react";

type Props = {
  title: string;
  images: string[];
  videoUrl?: string | null;
};

type MediaItem =
  | { type: "video"; src: string }
  | { type: "image"; src: string };

export default function ProductMediaGallery({
  title,
  images,
  videoUrl,
}: Props) {
  const items = useMemo<MediaItem[]>(() => {
    const cleanImages = images.filter(Boolean);
    const media: MediaItem[] = [];

    if (videoUrl) {
      media.push({ type: "video", src: videoUrl });
    }

    cleanImages.forEach((src) => {
      media.push({ type: "image", src });
    });

    return media;
  }, [images, videoUrl]);

  const [selectedIndex, setSelectedIndex] = useState(0);

  if (items.length === 0) {
    return (
      <div className="flex aspect-[4/3] items-center justify-center rounded-[20px] border border-[#ece4d8] bg-white text-sm text-zinc-500">
        Nenhuma mídia disponível.
      </div>
    );
  }

  const current = items[selectedIndex];

  function goPrev() {
    setSelectedIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1));
  }

  function goNext() {
    setSelectedIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1));
  }

  return (
    <div>
      <div className="relative overflow-hidden rounded-[20px] border border-[#ece4d8] bg-white p-3">
        {current.type === "video" ? (
          <video
            src={current.src}
            controls
            className="aspect-[4/3] w-full rounded-[16px] object-cover"
          />
        ) : (
          <img
            src={current.src}
            alt={title}
            className="aspect-[4/3] w-full rounded-[16px] object-cover"
          />
        )}

        {items.length > 1 && (
          <>
            <button
              type="button"
              onClick={goPrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/70 px-3 py-2 text-sm text-white"
            >
              ←
            </button>

            <button
              type="button"
              onClick={goNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/70 px-3 py-2 text-sm text-white"
            >
              →
            </button>
          </>
        )}
      </div>

      {items.length > 1 && (
        <div className="mt-3 flex flex-wrap gap-3">
          {items.map((item, index) => (
            <button
              key={`${item.type}-${item.src}-${index}`}
              type="button"
              onClick={() => setSelectedIndex(index)}
              className={`overflow-hidden rounded-2xl border p-1 transition ${
                selectedIndex === index
                  ? "border-zinc-900 bg-white"
                  : "border-[#e4d8c7] bg-white"
              }`}
            >
              {item.type === "video" ? (
                <div className="flex h-20 w-24 items-center justify-center rounded-xl bg-[#fbf8f3] text-xs font-medium text-zinc-600">
                  Vídeo
                </div>
              ) : (
                <img
                  src={item.src}
                  alt={`${title} ${index + 1}`}
                  className="h-20 w-24 rounded-xl object-cover"
                />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
