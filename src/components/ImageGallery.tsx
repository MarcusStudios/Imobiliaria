// src/components/ImageGallery.tsx
import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageGalleryProps {
  images: string[];
}

export const ImageGallery = ({ images }: ImageGalleryProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    const isFirst = currentIndex === 0;
    const newIndex = isFirst ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const nextSlide = () => {
    const isLast = currentIndex === images.length - 1;
    const newIndex = isLast ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  return (
    <div className="gallery-container">
      {/* Imagem Principal */}
      <div className="main-image-wrapper">
        <img src={images[currentIndex]} alt="Imóvel" className="gallery-main-img" />
        
        {/* Botões só aparecem se tiver mais de 1 foto */}
        {images.length > 1 && (
          <>
            <button onClick={prevSlide} className="gallery-btn btn-left">
              <ChevronLeft size={24} />
            </button>
            <button onClick={nextSlide} className="gallery-btn btn-right">
              <ChevronRight size={24} />
            </button>
          </>
        )}
        
        <div className="gallery-counter">
          {currentIndex + 1} / {images.length}
        </div>
      </div>

      {/* Miniaturas (Thumbnails) */}
      {images.length > 1 && (
        <div className="thumbnails-row">
          {images.map((img, idx) => (
            <img 
              key={idx} 
              src={img} 
              alt={`thumb-${idx}`} 
              className={`thumb ${currentIndex === idx ? 'thumb-active' : ''}`}
              onClick={() => setCurrentIndex(idx)}
            />
          ))}
        </div>
      )}
    </div>
  );
};