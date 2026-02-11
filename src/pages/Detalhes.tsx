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
  Share2,
  Clock,
  CalendarCheck,
} from "lucide-react";
import { doc, getDoc, type Timestamp } from "firebase/firestore";
import { db } from "../../services/firebaseConfig";
import { ImageGallery } from "../components/ImageGallery";
import { PriceCard } from "../components/PriceCard";
import type { Imovel } from "../types";
import { useAuth } from "../contexts/AuthContext";
import { useWhatsApp } from "../contexts/WhatsAppContext";
import "../css/Detalhes.css";

export const Detalhes = () => {
  const { id } = useParams<{ id: string }>();
  const [imovel, setImovel] = useState<Imovel | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const { isAdmin } = useAuth();
  const { setMessage, resetMessage } = useWhatsApp();

  useEffect(() => {
    window.scrollTo(0, 0);
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
      setMessage(`Olá! Estou interessado no imóvel "${imovel.titulo}" (Código: ${id ? id.slice(0, 6).toUpperCase() : ""}) e gostaria de mais informações.`);
    }
    return () => {
      document.title = "Lidiany Lopes Corretora de Imóveis";
      resetMessage();
    };
  }, [imovel, id, setMessage, resetMessage]);

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
      <div className="container" style={{ padding: "4rem", textAlign: "center" }}>
        Carregando...
      </div>
    );
  if (!imovel) return <div className="container">Imóvel não encontrado</div>;

  const imagens =
    imovel.imagens && imovel.imagens.length > 0
      ? imovel.imagens
      : ["https://via.placeholder.com/800x400?text=Sem+Foto"];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formatarData = (timestamp: any | Timestamp) => {
    if (!timestamp) return "";
    // Verifica se tem o método toDate (Timestamp do Firebase)
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return new Intl.DateTimeFormat("pt-BR", { dateStyle: "long" }).format(date);
  };

  const dataRelevante = imovel.atualizadoEm
    ? imovel.atualizadoEm
    : imovel.criadoEm;
  const textoData = imovel.atualizadoEm ? "Atualizado em" : "Publicado em";
  const codigoFormatado = id ? id.slice(0, 6).toUpperCase() : "";

  const renderComodidade = (ativo: boolean | undefined, label: string) => {
    if (!ativo) return null;
    return (
      <div className="comodidade-badge">
        <CheckCircle2 size={16} color="var(--success)" />
        {label}
      </div>
    );
  };

  return (
    <div className="detalhes-page">
      {/* CABEÇALHO */}
      <div className="container detalhes-header-container">
        
        <div className="detalhes-nav-bar">
          <Link to="/" className="detalhes-back-link">
            <ArrowLeft size={20} /> Voltar
          </Link>
          <div className="detalhes-actions">
            <button onClick={handleShare} className="btn-share">
              <Share2 size={16} /> {copied ? "Copiado!" : "Compartilhar"}
            </button>
            {isAdmin && (
              <Link
                to={`/editar/${imovel.id}`}
                className="btn-details"
                style={{ width: "auto", background: "var(--secondary)", marginTop: 0 }}
              >
                <Edit size={16} /> Editar
              </Link>
            )}
          </div>
        </div>

        <div style={{ marginBottom: "2rem" }}>
          <div className="detalhes-tags-container">
            <span className="tag-tipo">
              {imovel.tipo}
            </span>
            {imovel.destaque && (
              <span className="tag-destaque">
                Destaque
              </span>
            )}
            <span className="tag-codigo">
              Código: {codigoFormatado}
            </span>
            <div className="detalhes-dates">
              {/* Data Relevante / Atualizado em */}
              {dataRelevante && (
                <span className="date-info">
                  <CalendarCheck size={14} /> {textoData}{" "}
                  <b>{formatarData(dataRelevante)}</b>
                </span>
              )}

              {/* Criado em */}
              {imovel.criadoEm && !imovel.atualizadoEm && (
                <span className="date-info">
                  <Clock size={14} /> Criado em{" "}
                  <b>{formatarData(imovel.criadoEm)}</b>
                </span>
              )}
            </div>
          </div>
          <h1 className="detalhes-title">
            {imovel.titulo}
          </h1>
          <div className="detalhes-location">
            <div className="location-item">
              <MapPin size={18} /> {imovel.endereco} - {imovel.bairro},{" "}
              {imovel.cidade}
            </div>
          </div>
        </div>
      </div>

      {/* LAYOUT PRINCIPAL */}
      <div className="container details-layout">
        {/* COLUNA DA ESQUERDA */}
        <div className="details-column-left">
          <ImageGallery images={imagens} />

          {/* Card de Preço SÓ PARA CELULAR */}
          <div className="mobile-price-container">
            <PriceCard imovel={imovel} />
          </div>

          {/* Grid de Características */}
          <div className="features-grid">
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
              <div key={idx} className="feature-item">
                <item.icon
                  size={24}
                  className="feature-icon"
                />
                <div className="feature-value">
                  {item.val}
                </div>
                <div className="feature-label">
                  {item.label}
                </div>
              </div>
            ))}
          </div>

          <div className="description-section">
            <h3 className="section-title">
              Sobre o imóvel
            </h3>
            <p className="description-text">
              {imovel.descricao}
            </p>
          </div>

          <div>
            <h3 className="section-title">
              Diferenciais
            </h3>
            <div className="comodidades-list">
              {renderComodidade(imovel.piscina, "Piscina")}
              {renderComodidade(imovel.churrasqueira, "Churrasqueira")}
              {renderComodidade(imovel.elevador, "Elevador")}
              {renderComodidade(imovel.mobiliado, "Mobiliado")}
              {renderComodidade(imovel.portaria, "Portaria 24h")}
              {renderComodidade(imovel.aceitaPet, "Aceita Pet")}
            </div>
          </div>
        </div>

        {/* COLUNA DA DIREITA (Sidebar - SÓ PARA DESKTOP) */}
        <aside className="desktop-sidebar">
          <PriceCard imovel={imovel} />
        </aside>
      </div>
    </div>
  );
};
