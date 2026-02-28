// src/components/ImageGallery.tsx
import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

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
      <div style={{ marginBottom: '1.5rem' }}>
        {/* Imagem Principal */}
        <div
          role="button"
          tabIndex={0}
          aria-label={`Ampliar foto ${currentIndex + 1} de ${images.length} de ${altBase}`}
          style={{
            position: 'relative',
            width: '100%',
            aspectRatio: '16 / 9',
            borderRadius: '12px',
            overflow: 'hidden',
            background: '#f1f5f9',
            cursor: 'pointer',
          }}
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
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
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
                style={{
                  position: 'absolute',
                  left: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'rgba(0, 0, 0, 0.4)',
                  border: '1px solid rgba(255, 255, 255, 0.5)',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  color: '#fff',
                }}
              >
                <ChevronLeft size={24} aria-hidden="true" />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
                aria-label={`Próxima foto (${(currentIndex + 2) > images.length ? 1 : currentIndex + 2} de ${images.length})`}
                style={{
                  position: 'absolute',
                  right: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'rgba(0, 0, 0, 0.4)',
                  border: '1px solid rgba(255, 255, 255, 0.5)',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  color: '#fff',
                }}
              >
                <ChevronRight size={24} aria-hidden="true" />
              </button>

              {/* Contador de fotos */}
              <div
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  bottom: '1rem',
                  right: '1rem',
                  background: 'rgba(0, 0, 0, 0.7)',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '20px',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                }}
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
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))',
              gap: '0.5rem',
              marginTop: '0.75rem',
              maxHeight: '100px',
              overflowX: 'auto',
            }}
          >
            {images.map((img, idx) => (
              <button
                key={idx}
                role="listitem"
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Ver foto ${idx + 1} de ${images.length}`}
                aria-current={currentIndex === idx ? 'true' : undefined}
                style={{
                  aspectRatio: '1 / 1',
                  borderRadius: '6px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  border: currentIndex === idx ? '3px solid var(--primary)' : '2px solid #e2e8f0',
                  opacity: currentIndex === idx ? 1 : 0.6,
                  transition: 'all 0.2s',
                  padding: 0,
                  background: 'none',
                }}
              >
                <img
                  src={img}
                  alt={`Miniatura ${idx + 1} — ${altBase}`}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                  }}
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
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.95)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
          }}
          onClick={closeModal}
        >
          {/* Botão Fechar */}
          <button
            ref={closeButtonRef}
            onClick={closeModal}
            aria-label="Fechar galeria"
            style={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              background: 'rgba(255, 255, 255, 0.9)',
              border: 'none',
              borderRadius: '50%',
              width: '48px',
              height: '48px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 10000,
            }}
          >
            <X size={28} color="#1e293b" aria-hidden="true" />
          </button>

          {/* Imagem em Tela Cheia */}
          <img
            src={images[currentIndex]}
            alt={`Foto ${currentIndex + 1} de ${images.length} — ${altBase} (ampliada)`}
            style={{
              maxWidth: '90%',
              maxHeight: '90%',
              objectFit: 'contain',
              borderRadius: '8px',
            }}
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
                style={{
                  position: 'absolute',
                  left: '2rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'rgba(0, 0, 0, 0.5)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '50%',
                  width: '48px',
                  height: '48px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#fff',
                  transition: 'background 0.2s',
                }}
              >
                <ChevronLeft size={28} aria-hidden="true" />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
                aria-label={`Próxima foto (${(currentIndex + 2) > images.length ? 1 : currentIndex + 2} de ${images.length})`}
                style={{
                  position: 'absolute',
                  right: '2rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'rgba(0, 0, 0, 0.5)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '50%',
                  width: '48px',
                  height: '48px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#fff',
                  transition: 'background 0.2s',
                }}
              >
                <ChevronRight size={28} aria-hidden="true" />
              </button>

              <div
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  bottom: '2rem',
                  background: 'rgba(0, 0, 0, 0.7)',
                  color: 'white',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '25px',
                  fontSize: '1rem',
                  fontWeight: 500,
                }}
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