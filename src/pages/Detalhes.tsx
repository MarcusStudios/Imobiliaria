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
  Clock,
  CalendarCheck,
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
        Carregando...
      </div>
    );
  if (!imovel) return <div className="container">Imóvel não encontrado</div>;

  const imagens =
    imovel.imagens && imovel.imagens.length > 0
      ? imovel.imagens
      : ["https://via.placeholder.com/800x400?text=Sem+Foto"];

  const linkZap = `https://wa.me/${TELEFONE_CORRETORA}?text=Olá Lidiany! Vi o imóvel *${imovel.titulo}* (Cód: ${id?.slice(0, 4)}) e gostaria de mais informações.`;

  const renderComodidade = (ativo: boolean | undefined, label: string) => {
    if (!ativo) return null;
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          background: "#f8fafc",
          border: "1px solid #e2e8f0",
          padding: "8px 16px",
          borderRadius: "20px",
          fontSize: "0.9rem",
          color: "#334155",
          fontWeight: 500,
        }}
      >
        <CheckCircle2 size={16} color="var(--success)" />
        {label}
      </div>
    );
  };

  const formatarData = (timestamp: any) => {
    if (!timestamp) return "";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return new Intl.DateTimeFormat("pt-BR", { dateStyle: "long" }).format(date);
  };

  const dataRelevante = imovel.atualizadoEm
    ? imovel.atualizadoEm
    : imovel.criadoEm;
  const textoData = imovel.atualizadoEm ? "Atualizado em" : "Publicado em";

  // Formata o ID para não ficar gigante (pega os 6 primeiros caracteres e deixa maiúsculo)
  const codigoFormatado = id ? id.slice(0, 6).toUpperCase() : "";

  return (
    <div
      className="detalhes-page"
      style={{ background: "#fff", paddingBottom: "4rem" }}
    >
      {/* CABEÇALHO */}
      <div className="container" style={{ padding: "2rem 1.5rem 0" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "1.5rem",
          }}
        >
          <Link
            to="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              color: "#64748b",
            }}
          >
            <ArrowLeft size={20} /> Voltar
          </Link>

          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button
              onClick={handleShare}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                padding: "0.5rem 1rem",
                border: "1px solid #cbd5e1",
                borderRadius: "8px",
                background: "white",
                cursor: "pointer",
              }}
            >
              <Share2 size={16} /> {copied ? "Copiado!" : "Compartilhar"}
            </button>
            {isAdmin && (
              <Link
                to={`/editar/${imovel.id}`}
                className="btn-details"
                style={{
                  width: "auto",
                  background: "var(--secondary)",
                  marginTop: 0,
                }}
              >
                <Edit size={16} /> Editar
              </Link>
            )}
          </div>
        </div>

        {/* AREA DO TÍTULO */}
        <div style={{ marginBottom: "2rem" }}>
          {/* Linha de Badges, CÓDIGO e Data */}
          <div
            style={{
              display: "flex",
              gap: "10px",
              marginBottom: "12px",
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            {/* Tipo (Venda/Aluguel) */}
            <span
              style={{
                background: "var(--primary)",
                color: "white",
                padding: "4px 12px",
                borderRadius: "4px",
                fontSize: "0.8rem",
                fontWeight: "bold",
                textTransform: "uppercase",
              }}
            >
              {imovel.tipo}
            </span>

            {/* Destaque (Se houver) */}
            {imovel.destaque && (
              <span
                style={{
                  background: "#fbbf24",
                  color: "#92400e",
                  padding: "4px 12px",
                  borderRadius: "4px",
                  fontSize: "0.8rem",
                  fontWeight: "bold",
                  textTransform: "uppercase",
                }}
              >
                Destaque
              </span>
            )}

            {/* === CÓDIGO DO IMÓVEL (NOVO) === */}
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                background: "#f1f5f9",
                color: "#475569",
                padding: "4px 12px",
                borderRadius: "4px",
                fontSize: "0.8rem",
                fontWeight: "600",
                border: "1px solid #e2e8f0",
              }}
            >
               Código: {codigoFormatado}
            </span>

            {/* Data (Alinhada à direita) */}
            {dataRelevante && (
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  fontSize: "0.85rem",
                  color: "#94a3b8",
                  marginLeft: "auto",
                }}
              >
                <CalendarCheck size={14} />
                {textoData} <b>{formatarData(dataRelevante)}</b>
              </span>
            )}
          </div>

          <h1
            style={{
              fontSize: "2rem",
              color: "#1e293b",
              marginBottom: "0.5rem",
              lineHeight: 1.2,
            }}
          >
            {imovel.titulo}
          </h1>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              flexWrap: "wrap",
              color: "#64748b",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <MapPin size={18} />
              {imovel.endereco} - {imovel.bairro}, {imovel.cidade}
            </div>
          </div>
        </div>
      </div>

      <div className="container details-content">
        {/* === COLUNA DA ESQUERDA (Conteúdo) === */}
        <div style={{ flex: 2 }}>
          <ImageGallery images={imagens} />

          {/* Grid de Características */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))",
              gap: "1rem",
              margin: "2rem 0",
              padding: "1.5rem",
              background: "#f8fafc",
              borderRadius: "12px",
              border: "1px solid #f1f5f9",
            }}
          >
            {[
              { icon: Maximize, label: "Área Útil", val: `${imovel.area} m²` },
              { icon: Bed, label: "Quartos", val: imovel.quartos },
              {
                icon: CheckCircle2,
                label: "Suítes",
                val: imovel.suites || "-",
              },
              { icon: Bath, label: "Banheiros", val: imovel.banheiros },
              { icon: Car, label: "Vagas", val: imovel.vagas || "-" },
            ].map((item, idx) => (
              <div key={idx} style={{ textAlign: "center" }}>
                <item.icon
                  size={24}
                  style={{ color: "var(--primary)", marginBottom: "8px" }}
                />
                <div
                  style={{
                    fontWeight: "700",
                    color: "#334155",
                    fontSize: "1.1rem",
                  }}
                >
                  {item.val}
                </div>
                <div style={{ fontSize: "0.8rem", color: "#94a3b8" }}>
                  {item.label}
                </div>
              </div>
            ))}
          </div>

          <div className="description" style={{ marginBottom: "3rem" }}>
            <h3
              style={{
                fontSize: "1.5rem",
                color: "#1e293b",
                marginBottom: "1rem",
              }}
            >
              Sobre o imóvel
            </h3>
            <p
              style={{
                lineHeight: 1.8,
                color: "#475569",
                whiteSpace: "pre-line",
                fontSize: "1.05rem",
              }}
            >
              {imovel.descricao}
            </p>
          </div>

          <div>
            <h3
              style={{
                fontSize: "1.5rem",
                color: "#1e293b",
                marginBottom: "1rem",
              }}
            >
              Diferenciais
            </h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
              {renderComodidade(imovel.piscina, "Piscina")}
              {renderComodidade(imovel.churrasqueira, "Churrasqueira")}
              {renderComodidade(imovel.elevador, "Elevador")}
              {renderComodidade(imovel.mobiliado, "Mobiliado")}
              {renderComodidade(imovel.portaria, "Portaria 24h")}
              {renderComodidade(imovel.aceitaPet, "Aceita Pet")}
            </div>
          </div>
        </div>

        {/* === COLUNA DA DIREITA (Sidebar Sticky) === */}
        <aside
          style={{
            flex: 1,
            position: "sticky",
            top: "2rem",
            height: "fit-content",
          }}
        >
          <div
            className="agent-card"
            style={{
              border: "1px solid #e2e8f0",
              borderRadius: "12px",
              padding: "1.5rem",
              background: "#fff",
            }}
          >
            {/* Preço Principal */}
            <div>
              <p
                style={{
                  fontSize: "0.9rem",
                  color: "#64748b",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  marginBottom: "0.25rem",
                }}
              >
                Valor de {imovel.tipo}
              </p>
              <h2
                style={{
                  color: "var(--primary)",
                  fontSize: "2.5rem",
                  fontWeight: 800,
                  margin: 0,
                }}
              >
                {Number(imovel.preco).toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </h2>
            </div>

            {/* Preço Secundário */}
            {imovel.tipo === "Ambos" && (imovel.precoAluguel ?? 0) > 0 && (
              <div
                style={{
                  marginTop: "1rem",
                  paddingTop: "1rem",
                  borderTop: "1px dashed #e2e8f0",
                }}
              >
                <p
                  style={{
                    fontSize: "0.8rem",
                    color: "#64748b",
                    marginBottom: "2px",
                  }}
                >
                  OU ALUGUEL POR:
                </p>
                <p
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: 700,
                    color: "#16a34a",
                  }}
                >
                  {Number(imovel.precoAluguel).toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                  <span style={{ fontSize: "0.9rem", fontWeight: 400 }}>
                    /mês
                  </span>
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
                  margin: "1.5rem 0",
                  fontSize: "0.9rem",
                }}
              >
                {Number(imovel.condominio) > 0 && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "8px",
                    }}
                  >
                    <span
                      style={{
                        color: "#64748b",
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                      }}
                    >
                      <Building size={14} /> Condomínio
                    </span>
                    <strong style={{ color: "#334155" }}>
                      {Number(imovel.condominio).toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </strong>
                  </div>
                )}
                {Number(imovel.iptu) > 0 && (
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <span
                      style={{
                        color: "#64748b",
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                      }}
                    >
                      <MapPin size={14} /> IPTU (anual)
                    </span>
                    <strong style={{ color: "#334155" }}>
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
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                  background: "#25D366",
                  color: "white",
                  padding: "1rem",
                  borderRadius: "8px",
                  fontSize: "1.1rem",
                  fontWeight: 700,
                  textDecoration: "none",
                  boxShadow: "0 4px 6px rgba(37, 211, 102, 0.2)",
                }}
              >
                <svg
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  fill="currentColor"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Chamar no WhatsApp
              </a>
            </div>

            {/* Info Horário */}
            <div
              style={{
                marginTop: "1.5rem",
                textAlign: "center",
                fontSize: "0.85rem",
                color: "#64748b",
              }}
            >
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "5px",
                  background: "#f1f5f9",
                  padding: "4px 10px",
                  borderRadius: "12px",
                }}
              >
                <Clock size={14} /> Resposta rápida
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};
