/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useState, useEffect, useCallback } from 'react';

interface PropertyGalleryProps {
  images: string[];
  title: string;
  tag?: string;
  isFeatured?: boolean;
}

export const PropertyGallery: React.FC<PropertyGalleryProps> = ({
  images,
  title,
  tag,
  isFeatured,
}) => {
  const safeImages = images && images.length > 0
    ? images
    : ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'];

  const [activeIndex, setActiveIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const nextImage = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % safeImages.length);
  }, [safeImages.length]);

  const prevImage = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + safeImages.length) % safeImages.length);
  }, [safeImages.length]);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  // Keyboard navigation for Lightbox
  useEffect(() => {
    if (!isModalOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal();
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen, closeModal, nextImage, prevImage]);

  return (
    <>
      <section className="space-y-4" aria-label="Galería de la propiedad">
        {/* Main Hero Image */}
        <div
          onClick={() => setIsModalOpen(true)}
          className="relative aspect-[16/10] overflow-hidden rounded-xl shadow-sm group cursor-pointer bg-slate-100 dark:bg-slate-800"
        >
          <img
            alt={`${title} - Foto ${activeIndex + 1}`}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            src={safeImages[activeIndex]}
          />

          {/* Badges */}
          <div className="absolute top-4 left-4 flex gap-2 z-10 pointer-events-none">
            {isFeatured && (
              <span className="bg-mosque text-white text-xs font-semibold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
                Premium
              </span>
            )}
            {tag && (
              <span className="bg-white/95 backdrop-blur text-nordic dark:text-nordic text-xs font-semibold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
                {tag}
              </span>
            )}
          </div>

          {/* View All Photos Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsModalOpen(true);
            }}
            aria-label="Ver todas las fotos en pantalla completa"
            className="absolute bottom-4 right-4 bg-white/90 hover:bg-white text-nordic dark:text-nordic px-4 py-2 rounded-lg text-sm font-semibold shadow-lg backdrop-blur transition-all flex items-center gap-2 cursor-pointer z-10"
          >
            <span className="material-icons text-sm">grid_view</span>
            View All Photos ({safeImages.length})
          </button>
        </div>

        {/* Thumbnails Row */}
        {safeImages.length > 1 && (
          <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 snap-x">
            {safeImages.map((img, idx) => {
              const isActive = activeIndex === idx;
              return (
                <button
                  key={`${img}-${idx}`}
                  type="button"
                  onClick={() => setActiveIndex(idx)}
                  aria-label={`Ver imagen ${idx + 1} de ${safeImages.length}`}
                  className={`flex-none w-44 aspect-[4/3] rounded-lg overflow-hidden cursor-pointer transition-all snap-start ${
                    isActive
                      ? 'ring-2 ring-mosque ring-offset-2 ring-offset-clear-day opacity-100 scale-100'
                      : 'opacity-70 hover:opacity-100 hover:scale-[1.02]'
                  }`}
                >
                  <img
                    alt={`Miniatura ${idx + 1}`}
                    className="w-full h-full object-cover"
                    src={img}
                    loading="lazy"
                  />
                </button>
              );
            })}
          </div>
        )}
      </section>

      {/* Fullscreen Lightbox Modal */}
      {isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Visor de galería en pantalla completa"
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col items-center justify-between p-4 sm:p-6"
        >
          {/* Header */}
          <div className="w-full max-w-7xl flex items-center justify-between text-white py-2 z-10">
            <div className="flex items-center gap-3">
              <span className="font-semibold text-lg truncate max-w-xs sm:max-w-md">
                {title}
              </span>
              <span className="text-sm text-white/70 bg-white/10 px-2.5 py-1 rounded-full">
                {activeIndex + 1} / {safeImages.length}
              </span>
            </div>

            <button
              onClick={closeModal}
              aria-label="Cerrar galería"
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            >
              <span className="material-icons text-2xl">close</span>
            </button>
          </div>

          {/* Main Large Image & Navigation */}
          <div className="relative w-full max-w-5xl h-[70vh] flex items-center justify-center my-auto">
            <img
              alt={`${title} - Foto ${activeIndex + 1}`}
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl transition-all duration-300"
              src={safeImages[activeIndex]}
            />

            {/* Prev Button */}
            <button
              onClick={prevImage}
              aria-label="Foto anterior"
              className="absolute left-2 sm:-left-12 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 hover:bg-mosque text-white transition-all cursor-pointer shadow-lg"
            >
              <span className="material-icons text-2xl">chevron_left</span>
            </button>

            {/* Next Button */}
            <button
              onClick={nextImage}
              aria-label="Foto siguiente"
              className="absolute right-2 sm:-right-12 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 hover:bg-mosque text-white transition-all cursor-pointer shadow-lg"
            >
              <span className="material-icons text-2xl">chevron_right</span>
            </button>
          </div>

          {/* Bottom Thumbnails */}
          <div className="w-full max-w-4xl flex gap-2 overflow-x-auto py-2 justify-center scrollbar-hide">
            {safeImages.map((img, idx) => (
              <button
                key={`modal-thumb-${idx}`}
                onClick={() => setActiveIndex(idx)}
                className={`w-16 h-12 rounded overflow-hidden flex-shrink-0 border-2 transition-all ${
                  activeIndex === idx
                    ? 'border-mosque scale-110'
                    : 'border-transparent opacity-50 hover:opacity-100'
                }`}
              >
                <img
                  alt={`Thumb ${idx + 1}`}
                  className="w-full h-full object-cover"
                  src={img}
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
};
