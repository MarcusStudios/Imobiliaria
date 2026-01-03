// src/types/index.ts
export interface Imovel {
  id: string;
  titulo: string;
  tipo: string;
  preco: number;
  imagens: string[];
  quartos: number;
  banheiros: number;
  area: number;
  endereco: string;
  descricao: string;
  lat: number;
  lng: number;
}