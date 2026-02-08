import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Bed,
  Bath,
  Maximize,
  MapPin,
  Car,
  ArrowLeft,
  CheckCircle2,
  Edit,
  Building,
  Share2,
  Calendar,
  Clock,
} from "lucide-react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../services/firebaseConfig";
import { ImageGallery } from "../components/ImageGallery";
import type { Imovel } from "../types";
import { useAuth } from "../contexts/AuthContext";

export const Detalhes = () => {
  const { id } = useParams<{ id: string }>();
  const [imovel, setImovel] = useState<Imovel | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const { isAdmin } = useAuth();

  // SEU NÚMERO AQUI
  const TELEFONE_CORRETORA = "+5599991243054";

  useEffect(() => {
    const fetchImovel = async () => {
      if (!id) return;
      try {
        const docSnap = await getDoc(doc(db, "imoveis", id));
        if (docSnap.exists()) {
          setImovel({ id: docSnap.id, ...docSnap.data() } as Imovel);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchImovel();
  }, [id]);

  useEffect(() => {
    if (imovel) {
      document.title = `${imovel.titulo} | Lidiany Lopes Corretora`;
    }
    return () => {
      document.title = "Lidiany Lopes Corretora de Imóveis";
    };
  }, [imovel]);

  const handleShare = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: imovel?.titulo,
        text: `Confira este imóvel: ${imovel?.titulo}`,
        url: url,
      });
    } else {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading)
    return (
      <div
        className="container"
        style={{ padding: "4rem", textAlign: "center" }}
      >
        <div style={{ fontSize: "1.2rem", color: "var(--text-muted)" }}>
          Carregando imóvel...
        </div>
      </div>
    );

  if (!imovel)
    return (
      <div
        className="container"
        style={{ padding: "4rem", textAlign: "center" }}
      >
        <h2>Imóvel não encontrado</h2>
        <Link
          to="/"
          style={{
            color: "var(--primary)",
            marginTop: "1rem",
            display: "inline-block",
          }}
        >
          Voltar para o início
        </Link>
      </div>
    );

  const imagens =
    imovel.imagens && imovel.imagens.length > 0
      ? imovel.imagens
      : ["https://via.placeholder.com/800x400?text=Sem+Foto"];

  const linkZap = `https://wa.me/${TELEFONE_CORRETORA}?text=Olá Lidiany! Vi o imóvel *${imovel.titulo}* no site e gostaria de mais detalhes *${id?.slice(0, 8).toUpperCase()}*. Link: ${window.location.href}`;


  const renderComodidade = (ativo: boolean | undefined, label: string) => {
    if (!ativo) return null;
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          background: "#f1f5f9",
          padding: "8px 12px",
          borderRadius: "6px",
          fontSize: "0.9rem",
          color: "#334155",
        }}
      >
        <CheckCircle2 size={16} color="var(--success)" />
        {label}
      </div>
    );
  };

  const formatarData = (timestamp: any) => {
    if (!timestamp) return "Data não disponível";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(date);
  };

  return (
    <div className="detalhes-page">
      {/* Cabeçalho com breadcrumb e ações */}
      <div className="container" style={{ padding: "2rem 1.5rem 0" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1.5rem",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <Link
            to="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              color: "var(--text-muted)",
              fontWeight: 500,
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.color = "var(--primary)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = "var(--text-muted)")
            }
          >
            <ArrowLeft size={20} /> Voltar aos imóveis
          </Link>

          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            {/* Botão Compartilhar */}
            <button
              onClick={handleShare}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "0.5rem 1rem",
                background: "white",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "0.9rem",
                fontWeight: 500,
                color: "#334155",
                transition: "all 0.2s",
              }}
            >
              <Share2 size={16} />
              {copied ? "Link copiado!" : "Compartilhar"}
            </button>

            {/* Botão Editar (Admin) */}
            {isAdmin && (
              <Link
                to={`/editar/${imovel.id}`}
                className="btn-details"
                style={{
                  background: "var(--secondary)",
                  width: "auto",
                  padding: "0.5rem 1rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  marginTop: 0,
                }}
              >
                <Edit size={16} /> Editar
              </Link>
            )}
          </div>
        </div>

        {/* Badge + Título + Endereço */}
        <div style={{ marginBottom: "1.5rem" }}>
          <div
            style={{
              display: "flex",
              gap: "0.5rem",
              alignItems: "center",
              flexWrap: "wrap",
              marginBottom: "0.75rem",
            }}
          >
            <span
              style={{
                background: "var(--primary)",
                color: "white",
                padding: "0.25rem 0.75rem",
                borderRadius: "99px",
                fontSize: "0.875rem",
                fontWeight: 600,
              }}
            >
              {imovel.tipo === "Ambos" ? "Venda ou Aluguel" : imovel.tipo}
            </span>

            {/* Badge de Destaque (se tiver) */}
            {imovel.destaque && (
              <span
                style={{
                  background: "#fbbf24",
                  color: "#78350f",
                  padding: "0.25rem 0.75rem",
                  borderRadius: "99px",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                }}
              >
                ⭐ Destaque
              </span>
            )}

            {/* Código do imóvel */}
            <span
              style={{
                background: "#f1f5f9",
                color: "#64748b",
                padding: "0.25rem 0.75rem",
                borderRadius: "99px",
                fontSize: "0.875rem",
                fontWeight: 500,
              }}
            >
              Cód: {id?.slice(0, 8).toUpperCase()}

            </span>
          </div>

          <h1
            style={{
              fontSize: "2rem",
              lineHeight: 1.2,
              marginBottom: "0.75rem",
              color: "#1e293b",
            }}
          >
            {imovel.titulo}
          </h1>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              color: "var(--text-muted)",
              gap: "5px",
              fontSize: "1rem",
            }}
          >
            <MapPin size={18} />
            {imovel.endereco}
            {imovel.bairro && ` - ${imovel.bairro}`}
            {imovel.cidade && ` - ${imovel.cidade}`}
          </div>

          {/* Informações adicionais */}
          <div
            style={{
              display: "flex",
              gap: "1.5rem",
              marginTop: "1rem",
              fontSize: "0.875rem",
              color: "#64748b",
              flexWrap: "wrap",
            }}
          >
            {imovel.criadoEm && (
              <div
                style={{ display: "flex", alignItems: "center", gap: "6px" }}
              >
                <Calendar size={14} />
                Publicado em {formatarData(imovel.criadoEm)}
              </div>
            )}
            {imovel.atualizadoEm && (
              <div
                style={{ display: "flex", alignItems: "center", gap: "6px" }}
              >
                <Calendar size={14} />
                Atualizado em {formatarData(imovel.atualizadoEm)}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container details-content">
        {/* COLUNA ESQUERDA: Fotos e Informações */}
        <div>
          <ImageGallery images={imagens} />

          {/* Características com ícones maiores */}
          <div className="features-row">
            <div style={{ textAlign: "center" }}>
              <Maximize
                size={28}
                color="var(--primary)"
                style={{ margin: "0 auto 8px" }}
              />
              <div style={{ fontWeight: 600, fontSize: "1.1rem" }}>
                {imovel.area}
              </div>
              <small style={{ color: "#64748b" }}>m² de área</small>
            </div>
            <div style={{ textAlign: "center" }}>
              <Bed
                size={28}
                color="var(--primary)"
                style={{ margin: "0 auto 8px" }}
              />
              <div style={{ fontWeight: 600, fontSize: "1.1rem" }}>
                {imovel.quartos}
              </div>
              <small style={{ color: "#64748b" }}>Quartos</small>
            </div>
            {imovel.suites && imovel.suites > 0 && (
              <div style={{ textAlign: "center" }}>
                <CheckCircle2
                  size={28}
                  color="var(--primary)"
                  style={{ margin: "0 auto 8px" }}
                />
                <div style={{ fontWeight: 600, fontSize: "1.1rem" }}>
                  {imovel.suites}
                </div>
                <small style={{ color: "#64748b" }}>Suítes</small>
              </div>
            )}
            <div style={{ textAlign: "center" }}>
              <Bath
                size={28}
                color="var(--primary)"
                style={{ margin: "0 auto 8px" }}
              />
              <div style={{ fontWeight: 600, fontSize: "1.1rem" }}>
                {imovel.banheiros}
              </div>
              <small style={{ color: "#64748b" }}>Banheiros</small>
            </div>
            {imovel.vagas && imovel.vagas > 0 && (
              <div style={{ textAlign: "center" }}>
                <Car
                  size={28}
                  color="var(--primary)"
                  style={{ margin: "0 auto 8px" }}
                />
                <div style={{ fontWeight: 600, fontSize: "1.1rem" }}>
                  {imovel.vagas}
                </div>
                <small style={{ color: "#64748b" }}>Vagas</small>
              </div>
            )}
          </div>

          {/* Descrição - movida para cima */}
          <div
            className="description"
            style={{ marginTop: "2rem", marginBottom: "2rem" }}
          >
            <h3
              style={{
                marginBottom: "1rem",
                fontSize: "1.5rem",
                color: "#1e293b",
              }}
            >
              Sobre este imóvel
            </h3>
            <p
              style={{
                lineHeight: 1.8,
                color: "#475569",
                fontSize: "1rem",
                whiteSpace: "pre-line",
              }}
            >
              {imovel.descricao}
            </p>
          </div>

          {/* Comodidades */}
          <div style={{ marginTop: "2rem" }}>
            <h3
              style={{
                marginBottom: "1rem",
                fontSize: "1.5rem",
                color: "#1e293b",
              }}
            >
              Comodidades e Diferenciais
            </h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
              {renderComodidade(imovel.piscina, "Piscina")}
              {renderComodidade(imovel.churrasqueira, "Churrasqueira")}
              {renderComodidade(imovel.elevador, "Elevador")}
              {renderComodidade(imovel.mobiliado, "Mobiliado")}
              {renderComodidade(imovel.portaria, "Portaria 24h")}
              {renderComodidade(imovel.aceitaPet, "Aceita Pet")}
              {![
                imovel.piscina,
                imovel.churrasqueira,
                imovel.elevador,
                imovel.mobiliado,
                imovel.portaria,
                imovel.aceitaPet,
              ].some(Boolean) && (
                <p style={{ color: "#64748b", fontStyle: "italic" }}>
                  Entre em contato para mais informações sobre as comodidades.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* COLUNA DIREITA: Card de Contato */}
        <aside>
          <div className="agent-card">
            <h3
              style={{
                color: "#64748b",
                fontSize: "0.85rem",
                textTransform: "uppercase",
                letterSpacing: "1.5px",
                fontWeight: 600,
              }}
            >
              {imovel.tipo === "Aluguel"
                ? "Valor do Aluguel"
                : "Valor do Imóvel"}
            </h3>
            <h2
              style={{
                color: "var(--primary)",
                fontSize: "2.75rem",
                fontWeight: 700,
                margin: "0.5rem 0 0.5rem",
                lineHeight: 1,
              }}
            >
              {Number(imovel.preco).toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </h2>

            {imovel.tipo === "Ambos" && imovel.precoAluguel > 0 && (
              <div
                style={{
                  marginTop: "0.5rem",
                  paddingTop: "0.5rem",
                  borderTop: "1px solid #e2e8f0",
                }}
              >
                <p
                  style={{
                    fontSize: "0.85rem",
                    color: "#64748b",
                    marginBottom: "4px",
                  }}
                >
                  OU ALUGUEL POR:
                </p>
                <p
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: 700,
                    color: "var(--primary)",
                    margin: 0,
                  }}
                >
                  {Number(imovel.precoAluguel).toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                  /mês
                </p>
              </div>
            )}

            {/* Custos Extras */}
            {(Number(imovel.condominio) > 0 || Number(imovel.iptu) > 0) && (
              <div
                style={{
                  background: "#f8fafc",
                  padding: "1rem",
                  borderRadius: "8px",
                  marginTop: "1.5rem",
                  marginBottom: "1.5rem",
                }}
              >
                <p
                  style={{
                    fontSize: "0.8rem",
                    color: "#64748b",
                    marginBottom: "0.75rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    fontWeight: 600,
                  }}
                >
                  Custos Mensais
                </p>
                {Number(imovel.condominio) > 0 && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "8px",
                      fontSize: "0.9rem",
                    }}
                  >
                    <span
                      style={{
                        display: "flex",
                        gap: "6px",
                        alignItems: "center",
                        color: "#64748b",
                      }}
                    >
                      <Building size={14} /> Condomínio:
                    </span>
                    <strong style={{ color: "#1e293b" }}>
                      {Number(imovel.condominio).toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </strong>
                  </div>
                )}
                {Number(imovel.iptu) > 0 && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: "0.9rem",
                    }}
                  >
                    <span
                      style={{
                        display: "flex",
                        gap: "6px",
                        alignItems: "center",
                        color: "#64748b",
                      }}
                    >
                      <MapPin size={14} /> IPTU/ano:
                    </span>
                    <strong style={{ color: "#1e293b" }}>
                      {Number(imovel.iptu).toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </strong>
                  </div>
                )}
              </div>
            )}

            {/* Botões de Contato */}
            <div style={{ display: "grid", gap: "0.75rem" }}>
              <a
                href={linkZap}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                  background: "#25D366",
                  color: "white",
                  padding: "1rem",
                  borderRadius: "8px",
                  fontSize: "1.05rem",
                  fontWeight: 600,
                  textDecoration: "none",
                  transition: "all 0.2s",
                }}
              >
                <svg
                  viewBox="0 0 24 24"
                  width="22"
                  height="22"
                  fill="currentColor"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Chamar no WhatsApp
              </a>

              

             
            </div>

            {/* Informação de atendimento */}
            <div
              style={{
                marginTop: "1.5rem",
                padding: "1rem",
                background: "#f0fdf4",
                borderRadius: "8px",
                border: "1px solid #86efac",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "6px",
                }}
              >
                <Clock size={16} color="#16a34a" />
                <strong style={{ fontSize: "0.9rem", color: "#166534" }}>
                  Horário de Atendimento
                </strong>
              </div>
              <p
                style={{
                  margin: 0,
                  fontSize: "0.85rem",
                  color: "#15803d",
                  lineHeight: 1.5,
                }}
              >
                Segunda a Sexta: 8h - 18h
                <br />
                Sábado: 8h - 13h
              </p>
            </div>

            <p
              style={{
                textAlign: "center",
                marginTop: "1rem",
                marginBottom: "1rem",
                fontSize: "0.85rem",
                color: "#94a3b8",
              }}
            >
              Resposta rápida garantida • Atendimento personalizado
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
};
