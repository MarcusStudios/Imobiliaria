// src/components/ImageGallery.tsx
import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import '../css/ImageGallery.css'; // Novo CSS dedicado

interface ImageGalleryProps {
  images: string[];
  altBase?: string; // Texto base para o alt descritivo (ex: título do imóvel)
}

export const ImageGallery = ({ images, altBase = 'Imóvel' }: ImageGalleryProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const openModal = (index: number) => {
    setCurrentIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Foco no botão de fechar ao abrir o modal + fechar com Escape
  useEffect(() => {
    if (isModalOpen) {
      closeButtonRef.current?.focus();
    }
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isModalOpen]);

  return (
    <>
      {/* Galeria Principal */}
      <div className="gallery-container">
        {/* Imagem Principal */}
        <div
          role="button"
          tabIndex={0}
          aria-label={`Ampliar foto ${currentIndex + 1} de ${images.length} de ${altBase}`}
          className="gallery-main-image-container"
          onClick={() => openModal(currentIndex)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              openModal(currentIndex);
            }
          }}
        >
          <img
            src={images[currentIndex]}
            alt={`Foto ${currentIndex + 1} de ${images.length} — ${altBase}`}
            className="gallery-main-image"
          />

          {/* Navegação */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
                aria-label={`Foto anterior (${currentIndex === 0 ? images.length : currentIndex} de ${images.length})`}
                className="gallery-nav-button prev"
              >
                <ChevronLeft size={24} aria-hidden="true" />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
                aria-label={`Próxima foto (${(currentIndex + 2) > images.length ? 1 : currentIndex + 2} de ${images.length})`}
                className="gallery-nav-button next"
              >
                <ChevronRight size={24} aria-hidden="true" />
              </button>

              {/* Contador de fotos */}
              <div
                aria-hidden="true"
                className="gallery-counter"
              >
                {currentIndex + 1} / {images.length}
              </div>
            </>
          )}
        </div>

        {/* Miniaturas */}
        {images.length > 1 && (
          <div
            role="list"
            aria-label="Miniaturas das fotos"
            className="gallery-thumbnails"
          >
            {images.map((img, idx) => (
              <button
                key={idx}
                role="listitem"
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Ver foto ${idx + 1} de ${images.length}`}
                aria-current={currentIndex === idx ? 'true' : undefined}
                className={`gallery-thumbnail-button ${currentIndex === idx ? 'active' : ''}`}
              >
                <img
                  src={img}
                  alt={`Miniatura ${idx + 1} — ${altBase}`}
                  className="gallery-thumbnail-image"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Modal de Visualização em Tela Cheia */}
      {isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Galeria de fotos — ${altBase}. Foto ${currentIndex + 1} de ${images.length}`}
          className="gallery-modal-overlay"
          onClick={closeModal}
        >
          {/* Botão Fechar */}
          <button
            ref={closeButtonRef}
            onClick={closeModal}
            aria-label="Fechar galeria"
            className="gallery-modal-close"
          >
            <X size={28} color="#1e293b" aria-hidden="true" />
          </button>

          {/* Imagem em Tela Cheia */}
          <img
            src={images[currentIndex]}
            alt={`Foto ${currentIndex + 1} de ${images.length} — ${altBase} (ampliada)`}
            className="gallery-modal-image"
            onClick={(e) => e.stopPropagation()}
          />

          {/* Navegação no Modal */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
                aria-label={`Foto anterior (${currentIndex === 0 ? images.length : currentIndex} de ${images.length})`}
                className="gallery-modal-nav-button prev"
              >
                <ChevronLeft size={28} aria-hidden="true" />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
                aria-label={`Próxima foto (${(currentIndex + 2) > images.length ? 1 : currentIndex + 2} de ${images.length})`}
                className="gallery-modal-nav-button next"
              >
                <ChevronRight size={28} aria-hidden="true" />
              </button>

              <div
                aria-hidden="true"
                className="gallery-modal-counter"
              >
                {currentIndex + 1} / {images.length}
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};