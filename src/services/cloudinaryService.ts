// src/services/cloudinaryService.ts

const CLOUD_NAME = 'dj16hchjj'; // Substitua pelo seu cloud name
const UPLOAD_PRESET = 'imoveis_preset'; // Crie um unsigned preset no Cloudinary

interface CloudinaryResponse {
  secure_url: string;
  public_id: string;
  width: number;
  height: number;
}

export const uploadImageToCloudinary = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);
  formData.append('folder', 'imoveis'); // Organiza em uma pasta

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error('Erro ao fazer upload da imagem');
    }

    const data: CloudinaryResponse = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error('Erro no upload:', error);
    throw error;
  }
};

export const uploadMultipleImages = async (files: File[]): Promise<string[]> => {
  try {
    const uploadPromises = files.map(file => uploadImageToCloudinary(file));
    const urls = await Promise.all(uploadPromises);
    return urls;
  } catch (error) {
    console.error('Erro ao fazer upload de múltiplas imagens:', error);
    throw error;
  }
};

// Função para deletar imagem (opcional, requer configuração de API key)
export const deleteImageFromCloudinary = async (publicId: string): Promise<void> => {
  // Isso requer um backend para manter sua API key segura
  // Por enquanto, você pode deixar as imagens no Cloudinary
  console.log('Deletar imagem:', publicId);
};

// Função helper para otimizar URLs do Cloudinary
export const optimizeCloudinaryUrl = (url: string, width = 800): string => {
  if (!url.includes('cloudinary.com')) return url;
  return url.replace('/upload/', `/upload/w_${width},q_auto,f_auto/`);
};