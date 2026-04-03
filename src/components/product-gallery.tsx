"use client";

import { useMemo, useState } from "react";

export default function ProductGallery({
  images,
  title,
}: {
  images: string[];
  title: string;
}) {
  const validImages = useMemo(() => images.filter(Boolean), [images]);
  const [currentIndex, setCurrentIndex] = useState(0);

  if (validImages.length === 0) {
    return (
      <div className="flex h-[420px] w-full items-center justify-center rounded-[24px] border border-[#ece4d8] bg-white text-zinc-500">
        Imagem não disponível
      </div>
    );
  }

  const currentImage = validImages[currentIndex] || validImages[0];

  function goPrev() {
    setCurrentIndex((prev) =>
      prev === 0 ? validImages.length - 1 : prev - 1
    );
  }

  function goNext() {
    setCurrentIndex((prev) =>
      prev === validImages.length - 1 ? 0 : prev + 1
    );
  }

  return (
    <div>
      <div className="relative">
        <img
          src={currentImage}
          alt={title}
          className="w-full rounded-[24px] border border-[#ece4d8] bg-white object-cover"
        />

        {validImages.length > 1 && (
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

      {validImages.length > 1 && (
        <div className="mt-4 grid grid-cols-4 gap-3">
          {validImages.map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              onClick={() => setCurrentIndex(index)}
              className={`overflow-hidden rounded-2xl border ${
                currentIndex === index
                  ? "border-zinc-900"
                  : "border-[#ece4d8]"
              }`}
            >
              <img
                src={image}
                alt={`${title} ${index + 1}`}
                className="h-24 w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
