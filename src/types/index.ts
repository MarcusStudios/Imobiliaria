// src/types.ts

export interface Imovel {
  id: string;
  titulo: string;
  tipo: 'Venda' | 'Aluguel' | 'Ambos'; // Tipagem estrita ajuda a evitar erros de digitação
  
  // Controle de Rascunho vs Publicado
  ativo?: boolean; 
  
  // Destaque (imóveis em evidência)
  destaque?: boolean;

  // Valores
  preco: number;          // Preço de Venda (ou Aluguel se for só aluguel)
  precoAluguel?: number;  // Preço secundário caso o imóvel seja "Ambos"
  
  // Localização
  endereco: string;
  bairro: string;
  cidade: string;
  lat?: number;
  lng?: number;

  // Detalhes do Imóvel
  quartos: number;
  banheiros: number;
  suites?: number;
  vagas?: number;
  area: number;
  descricao: string;

  

  // Custos Extras
  condominio?: number;
  iptu?: number;

  // Comodidades (Features)
  piscina?: boolean;
  churrasqueira?: boolean;
  elevador?: boolean;
  mobiliado?: boolean;
  portaria?: boolean;
  aceitaPet?: boolean;

  // Mídia
  imagens: string[];
  
  // Metadados
  criadoEm?: any; // Timestamp do Firebase (pode ser Date ou Timestamp)
  atualizadoEm?: any; // Timestamp da última atualização
}