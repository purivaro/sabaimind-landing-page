"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";

export function VideoHighlight({
  videoId,
  title,
  sub,
}: {
  videoId: string;
  title: string;
  sub: string;
}) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={title}
        className="group relative block w-full cursor-pointer overflow-hidden rounded-2xl text-left shadow-editorial"
      >
        <div className="relative aspect-video w-full">
          <Image
            src="/images/hero/pool-reflection.jpg"
            alt={title}
            fill
            className="object-cover transition-transform duration-1000 group-hover:scale-105"
            sizes="(max-width: 1120px) 100vw, 1120px"
          />
        </div>
        <div className="absolute inset-0 flex items-center justify-center bg-on-surface/20">
          <div className="flex h-24 w-24 items-center justify-center rounded-full border border-surface/50 backdrop-blur-sm transition-all duration-500 group-hover:scale-110 group-hover:bg-primary/20">
            <span className="material-symbols-outlined translate-x-1 text-5xl text-white">
              play_arrow
            </span>
          </div>
        </div>
        <div className="absolute bottom-6 left-6 right-6 md:bottom-12 md:left-12 md:right-12">
          <h3 className="mb-2 font-display text-2xl text-white md:text-headline-lg">
            {title}
          </h3>
          <p className="font-body text-body-md text-white/80">{sub}</p>
        </div>
      </button>

      {mounted &&
        open &&
        createPortal(
          <div
            className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          >
            <button
              type="button"
              aria-label="閉じる"
              onClick={() => setOpen(false)}
              className="absolute right-4 top-4 text-white/80 transition-colors hover:text-white"
            >
              <span className="material-symbols-outlined text-[32px]">close</span>
            </button>
            <div
              className="relative aspect-video w-full max-w-5xl"
              onClick={(e) => e.stopPropagation()}
            >
              <iframe
                className="h-full w-full rounded-xl"
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
                title={title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
