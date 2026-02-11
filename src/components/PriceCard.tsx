import { MapPin, Building, Clock } from 'lucide-react';
import type { Imovel } from '../types';
import '../css/Detalhes.css';

interface PriceCardProps {
  imovel: Imovel;
}

export const PriceCard = ({ imovel }: PriceCardProps) => {
  const TELEFONE_CORRETORA = "+5599991243054";
  const linkZap = `https://wa.me/${TELEFONE_CORRETORA}?text=Olá Lidiany! Vi o imóvel ${imovel.titulo.toUpperCase()} (Cód: ${imovel.id?.slice(0, 6)}) e gostaria de mais informações.`;

  return (
    <div className="price-card">
      {/* Preço Principal */}
      <div>
        <p className="price-label">
          Valor de {imovel.tipo}
        </p>
        <h2 className="price-value">
          {Number(imovel.preco).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
        </h2>
      </div>

      {/* Preço Secundário */}
      {imovel.tipo === "Ambos" && (imovel.precoAluguel ?? 0) > 0 && (
        <div className="rent-container">
          <p className="rent-label">
            OU ALUGUEL POR:
          </p>
          <p className="rent-value">
            {Number(imovel.precoAluguel).toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
            <span style={{ fontSize: "0.9rem", fontWeight: 400, color: '#64748b' }}>/mês</span>
          </p>
        </div>
      )}

      {/* Custos Extras */}
      {(Number(imovel.condominio) > 0 || Number(imovel.iptu) > 0) && (
        <div className="extra-costs">
          {Number(imovel.condominio) > 0 && (
            <div className="cost-row">
              <span className="cost-label">
                <Building size={14} /> Condomínio
              </span>
              <strong className="cost-value">
                {Number(imovel.condominio).toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </strong>
            </div>
          )}
          {Number(imovel.iptu) > 0 && (
            <div className="cost-row" style={{ marginTop: Number(imovel.condominio) > 0 ? '8px' : 0 }}>
              <span className="cost-label">
                <MapPin size={14} /> IPTU (anual)
              </span>
              <strong className="cost-value">
                {Number(imovel.iptu).toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </strong>
            </div>
          )}
        </div>
      )}

      {/* Botão de WhatsApp */}
      <div style={{ display: "grid", gap: "1rem" }}>
        <a
          href={linkZap}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-whatsapp"
        >
          <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          Chamar no WhatsApp
        </a>
      </div>

      {/* Info Horário */}
      <div className="quick-reply-info">
        <div className="reply-badge">
          <Clock size={14} /> Resposta rápida
        </div>
      </div>
    </div>
  );
};
