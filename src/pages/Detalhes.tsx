import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Bed,
  Bath,
  Maximize,
  MapPin,
  MessageCircle,
  Car,
  ArrowLeft,
  CheckCircle2,
  Edit,
  Building,
} from "lucide-react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../services/firebaseConfig";
import { ImageGallery } from "../components/ImageGallery";
// Removido: import { PropertyMap } from '../components/MapContainer';
import type { Imovel } from "../types";
import { useAuth } from "../contexts/AuthContext";

export const Detalhes = () => {
  const { id } = useParams<{ id: string }>();
  const [imovel, setImovel] = useState<Imovel | null>(null);
  const [loading, setLoading] = useState(true);
  const { isAdmin } = useAuth();

  // SEU NÚMERO AQUI
  const TELEFONE_CORRETORA = "99991954552";

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

  // Dentro do useEffect ou logo após o if(!imovel) return...

  useEffect(() => {
    if (imovel) {
      document.title = `${imovel.titulo} | Lidiane Corretora`;
    }
    // Quando sair da página, volta ao normal
    return () => {
      document.title = "Lidiane Corretora de Imóveis";
    };
  }, [imovel]);

  if (loading)
    return (
      <div
        className="container"
        style={{ padding: "4rem", textAlign: "center" }}
      >
        Carregando...
      </div>
    );
  if (!imovel)
    return (
      <div
        className="container"
        style={{ padding: "4rem", textAlign: "center" }}
      >
        Imóvel não encontrado.
      </div>
    );

  const imagens =
    imovel.imagens && imovel.imagens.length > 0
      ? imovel.imagens
      : ["https://via.placeholder.com/800x400?text=Sem+Foto"];

  const linkZap = `https://wa.me/${TELEFONE_CORRETORA}?text=Olá Lidiane! Vi o imóvel "${
    imovel.titulo
  }" (Ref: ${id?.slice(0, 4)}) e gostaria de mais detalhes.`;

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

  return (
    <div className="detalhes-page" style={{ paddingBottom: "4rem" }}>
      {/* Cabeçalho */}
      <div className="container" style={{ padding: "2rem 1.5rem 0" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1.5rem",
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
            }}
          >
            <ArrowLeft size={20} /> Voltar
          </Link>

          {isAdmin && (
            <Link
              to={`/admin/${imovel.id}`}
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
              <Edit size={16} /> Editar Imóvel
            </Link>
          )}
        </div>

        <span
          style={{
            background: "var(--primary)",
            color: "white",
            padding: "0.25rem 0.75rem",
            borderRadius: "99px",
            fontSize: "0.875rem",
            fontWeight: 600,
            marginBottom: "0.5rem",
            display: "inline-block",
          }}
        >
          {imovel.tipo === "Ambos" ? "Venda ou Aluguel" : imovel.tipo}
        </span>

        <h1
          style={{ fontSize: "2rem", lineHeight: 1.2, marginBottom: "0.5rem" }}
        >
          {imovel.titulo}
        </h1>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            color: "var(--text-muted)",
            gap: "5px",
          }}
        >
          <MapPin size={18} />
          {imovel.endereco} {imovel.bairro && `- ${imovel.bairro}`}{" "}
          {imovel.cidade && `- ${imovel.cidade}`}
        </div>
      </div>

      <div
        className="container details-content"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "2.5rem",
          marginTop: "2rem",
        }}
      >
        {/* COLUNA ESQUERDA: Fotos e Informações */}
        <div>
          <ImageGallery images={imagens} />

          {/* Características */}
          <div
            className="features-row"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(80px, 1fr))",
              gap: "1rem",
              padding: "1.5rem 0",
              borderBottom: "1px solid var(--border)",
            }}
          >
            <div style={{ textAlign: "center" }}>
              <Maximize
                size={24}
                color="var(--text-muted)"
                style={{ margin: "0 auto" }}
              />
              <div style={{ fontWeight: 600 }}>
                {imovel.area} <small>m²</small>
              </div>
            </div>
            <div style={{ textAlign: "center" }}>
              <Bed
                size={24}
                color="var(--text-muted)"
                style={{ margin: "0 auto" }}
              />
              <div style={{ fontWeight: 600 }}>
                {imovel.quartos} <small>Quartos</small>
              </div>
            </div>
            {imovel.suites && imovel.suites > 0 && (
              <div style={{ textAlign: "center" }}>
                <CheckCircle2
                  size={24}
                  color="var(--text-muted)"
                  style={{ margin: "0 auto" }}
                />
                <div style={{ fontWeight: 600 }}>
                  {imovel.suites} <small>Suítes</small>
                </div>
              </div>
            )}
            <div style={{ textAlign: "center" }}>
              <Bath
                size={24}
                color="var(--text-muted)"
                style={{ margin: "0 auto" }}
              />
              <div style={{ fontWeight: 600 }}>
                {imovel.banheiros} <small>Banh.</small>
              </div>
            </div>
            {imovel.vagas && imovel.vagas > 0 && (
              <div style={{ textAlign: "center" }}>
                <Car
                  size={24}
                  color="var(--text-muted)"
                  style={{ margin: "0 auto" }}
                />
                <div style={{ fontWeight: 600 }}>
                  {imovel.vagas} <small>Vagas</small>
                </div>
              </div>
            )}
          </div>

          {/* Comodidades */}
          <div style={{ marginTop: "2rem" }}>
            <h3 style={{ marginBottom: "1rem", fontSize: "1.25rem" }}>
              O que esse imóvel oferece
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
                  Consulte detalhes com a corretora.
                </p>
              )}
            </div>
          </div>

          {/* Descrição */}
          <div className="description" style={{ marginTop: "2rem" }}>
            <h3 style={{ marginBottom: "0.5rem", fontSize: "1.25rem" }}>
              Descrição
            </h3>
            <p
              style={{
                lineHeight: 1.7,
                color: "#334155",
                whiteSpace: "pre-line",
              }}
            >
              {imovel.descricao}
            </p>
          </div>

          {/* MAPA REMOVIDO AQUI */}
        </div>

        {/* COLUNA DIREITA: Card de Preço */}
        <aside>
          <div
            className="agent-card"
            style={{
              background: "white",
              padding: "2rem",
              borderRadius: "12px",
              boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
              position: "sticky",
              top: "100px",
              border: "1px solid #e2e8f0",
            }}
          >
            <h3
              style={{
                color: "#64748b",
                fontSize: "0.9rem",
                textTransform: "uppercase",
                letterSpacing: "1px",
              }}
            >
              Valor do Imóvel
            </h3>
            <h2
              style={{
                color: "var(--primary)",
                fontSize: "2.5rem",
                fontWeight: 700,
                margin: "0.5rem 0 1.5rem",
              }}
            >
              {Number(imovel.preco).toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </h2>

            {(Number(imovel.condominio) > 0 || Number(imovel.iptu) > 0) && (
              <div
                style={{
                  background: "#f8fafc",
                  padding: "1rem",
                  borderRadius: "8px",
                  marginBottom: "1.5rem",
                }}
              >
                {Number(imovel.condominio) > 0 && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "5px",
                      fontSize: "0.9rem",
                    }}
                  >
                    <span
                      style={{
                        display: "flex",
                        gap: "5px",
                        alignItems: "center",
                      }}
                    >
                      <Building size={14} /> Condomínio:
                    </span>
                    <strong>
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
                        gap: "5px",
                        alignItems: "center",
                      }}
                    >
                      <MapPin size={14} /> IPTU:
                    </span>
                    <strong>
                      {Number(imovel.iptu).toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </strong>
                  </div>
                )}
              </div>
            )}

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
                fontWeight: 600,
                textDecoration: "none",
                transition: "transform 0.2s",
              }}
            >
              <MessageCircle size={24} />
              Chamar no WhatsApp
            </a>
            <p
              style={{
                textAlign: "center",
                marginTop: "1rem",
                fontSize: "0.8rem",
                color: "#94a3b8",
              }}
            >
              Resposta rápida garantida.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
};
