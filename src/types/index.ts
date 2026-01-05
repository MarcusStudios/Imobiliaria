export interface Imovel {
  id: string;
  titulo: string;
  tipo: 'Venda' | 'Aluguel' | 'Ambos';
  
  preco: number;          // Preço principal (Venda OU Aluguel se for único)
  precoAluguel?: number;  // NOVO: Preço específico de aluguel para caso "Ambos"
  
  endereco: string;
  bairro: string;
  cidade: string;
  lat?: number;
  lng?: number;

  quartos: number;
  banheiros: number;
  suites?: number;
  vagas?: number;
  area: number;
  descricao: string;

  condominio?: number;
  iptu?: number;

  piscina?: boolean;
  churrasqueira?: boolean;
  elevador?: boolean;
  mobiliado?: boolean;
  portaria?: boolean;
  aceitaPet?: boolean;

  imagens: string[];
}