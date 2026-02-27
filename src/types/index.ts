// src/types.ts

// Tipo que representa um Timestamp do Firebase ou uma Date/string JavaScript
export interface FirebaseTimestamp {
  toDate: () => Date;
  toMillis: () => number;
  seconds: number;
  nanoseconds: number;
}

export interface Imovel {
  id: string;
  titulo: string;
  tipo: 'Venda' | 'Aluguel' | 'Ambos'; // Tipagem estrita ajuda a evitar erros de digitação
  categoria?: 'Imovel' | 'Terreno'; // Diferenciação entre imóvel construído e terreno

  
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

  // Campos Específicos para Terrenos
  dimensoes?: string; // Ex: 12x30
  topografia?: 'Plano' | 'Aclive' | 'Declive';
  zoneamento?: 'Residencial' | 'Comercial' | 'Misto' | 'Industrial' | 'Rural';


  // Mídia
  imagens: string[];
  
  // Metadados
  visualizacoes?: number;
  criadoEm?: FirebaseTimestamp | Date | null;
  atualizadoEm?: FirebaseTimestamp | Date | null;
}