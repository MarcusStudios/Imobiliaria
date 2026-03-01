// src/components/ImageUploader.tsx
import { type ChangeEvent } from 'react';
import { Upload, X } from 'lucide-react';
import { optimizeCloudinaryUrl } from '../services/cloudinaryService';

interface ImageUploaderProps {
  previewUrls: string[];
  uploadingImages: boolean;
  uploadProgress: number;
  onImageSelect: (e: ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: (index: number) => void;
}

export const ImageUploader = ({
  previewUrls,
  uploadingImages,
  uploadProgress,
  onImageSelect,
  onRemoveImage,
}: ImageUploaderProps) => {
  return (
    <div className="grid-gap-1-5">
      <div className="upload-area">
        <input 
          id="image-upload"
          type="file" 
          accept="image/*" 
          multiple 
          onChange={onImageSelect}
          className="file-input"
          aria-label="Selecionar fotos do imóvel"
        />
        <label htmlFor="image-upload" className="upload-label-wrapper" style={{ cursor: 'pointer', display: 'block', width: '100%' }}>
          <Upload size={48} className="upload-icon" />
          <p className="upload-title">
            Clique ou arraste fotos aqui
          </p>
          <p className="upload-hint">
            Máximo 10 fotos • JPG, PNG ou WEBP • Máx 5MB cada
          </p>
        </label>
        <p className="upload-counter">
          {previewUrls.length}/10 fotos adicionadas
        </p>
      </div>

      {/* Barra de Progresso */}
      {uploadingImages && (
        <div className="progress-container">
          <div className="progress-bar-bg">
            <div className="progress-bar-fill" style={{ width: `${uploadProgress}%` }} />
          </div>
          <p className="progress-text">
            Enviando fotos... {uploadProgress}%
          </p>
        </div>
      )}

      {/* Preview das Imagens */}
      {previewUrls.length > 0 && (
        <div className="previews-grid">
          {previewUrls.map((url, index) => (
            <div key={index} className="preview-card">
              {index === 0 && (
                <div className="cover-badge">
                  CAPA
                </div>
              )}
              <img 
                src={url.includes('cloudinary') ? optimizeCloudinaryUrl(url, 300) : url}
                alt={`Preview ${index + 1}`}
                className="preview-image"
              />
              <button
                type="button"
                onClick={() => onRemoveImage(index)}
                className="remove-image-btn"
                title="Remover imagem"
              >
                <X size={18} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
