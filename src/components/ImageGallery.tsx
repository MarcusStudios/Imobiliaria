// src/components/ImageGallery.tsx
import { useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

interface ImageGalleryProps {
  images: string[];
}

export const ImageGallery = ({ images }: ImageGalleryProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  return (
    <>
      {/* Galeria Principal */}
      <div style={{ marginBottom: '1.5rem' }}>
        {/* Imagem Principal - TAMANHO CONTROLADO */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            // height: '400px', // REMOVIDO: A altura fixa anterior
            aspectRatio: '16 / 9', // ADICIONADO: Isso força o container a ser um quadrado perfeito
            borderRadius: '12px',
            overflow: 'hidden',
            background: '#f1f5f9',
            cursor: 'pointer',
          }}
          onClick={() => openModal(currentIndex)}
        >
          <img
            src={images[currentIndex]}
            alt={`Imagem ${currentIndex + 1}`}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover', // IMPORTANTE: cobre o espaço quadrado sem distorcer
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
                <ChevronLeft size={24} />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
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
                <ChevronRight size={24} />
              </button>

              {/* Contador de fotos */}
              <div
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
              <div
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                style={{
                  aspectRatio: '1 / 1', // Opcional: Deixa as miniaturas quadradas também
                  // height: '80px', // Removido altura fixa das miniaturas para usar aspect ratio
                  borderRadius: '6px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  border: currentIndex === idx ? '3px solid var(--primary)' : '2px solid #e2e8f0',
                  opacity: currentIndex === idx ? 1 : 0.6,
                  transition: 'all 0.2s',
                }}
              >
                <img
                  src={img}
                  alt={`Miniatura ${idx + 1}`}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de Visualização em Tela Cheia (Sem alterações aqui) */}
      {isModalOpen && (
        <div
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
          onClick={() => setIsModalOpen(false)}
        >
          {/* Botão Fechar */}
          <button
            onClick={() => setIsModalOpen(false)}
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
            <X size={28} color="#1e293b" />
          </button>

          {/* Imagem em Tela Cheia */}
          <img
            src={images[currentIndex]}
            alt={`Imagem ${currentIndex + 1}`}
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
                <ChevronLeft size={28} />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
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
                <ChevronRight size={28} />
              </button>

              <div
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