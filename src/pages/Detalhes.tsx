import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Bed, Bath, Maximize, MapPin, MessageCircle } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../services/firebaseConfig';
import { ImageGallery } from '../components/ImageGallery';
import { PropertyMap } from '../components/MapContainer';
import type { Imovel } from '../types';

export const Detalhes = () => {
  const { id } = useParams<{ id: string }>();
  const [imovel, setImovel] = useState<Imovel | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImovel = async () => {
      if (!id) return;
      try {
        const docSnap = await getDoc(doc(db, "imoveis", id));
        if (docSnap.exists()) setImovel({ id: docSnap.id, ...docSnap.data() } as Imovel);
      } catch (error) { console.error(error); } finally { setLoading(false); }
    };
    fetchImovel();
  }, [id]);

  if (loading) return <div className="container">Carregando...</div>;
  if (!imovel) return <div className="container">Imóvel não encontrado.</div>;

  const linkZap = `https://wa.me/5511999999999?text=Olá, interesse no imóvel ${imovel.titulo}`;
  const imagens = imovel.imagens || ["https://via.placeholder.com/800x400"];

  return (
    <div className="detalhes-page">
      <div className="page-header">
        <div className="container">
          <Link to="/" className="btn-back">← Voltar</Link>
          <h1>{imovel.titulo}</h1>
          <p><MapPin size={16} style={{ display: "inline" }} /> {imovel.endereco}</p>
        </div>
      </div>
      <div className="container details-content">
        <div>
          <ImageGallery images={imagens} />
          <div className="features-row" style={{ justifyContent: "space-around", padding: "2rem 0" }}>
             <span className="feat"><Bed /> {imovel.quartos} Quartos</span>
             <span className="feat"><Bath /> {imovel.banheiros} Banheiros</span>
             <span className="feat"><Maximize /> {imovel.area} m²</span>
          </div>
          <div className="description"><h3>Descrição</h3><p>{imovel.descricao}</p></div>
          <div style={{ marginTop: "3rem" }}><h3>Localização</h3><PropertyMap lat={imovel.lat} lng={imovel.lng} endereco={imovel.endereco} /></div>
        </div>
        <aside>
           <div className="agent-card">
             <h3>Valor</h3>
             <h2 style={{ color: "#0f172a", fontSize: "2rem" }}>
               {Number(imovel.preco).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
             </h2>
             <a href={linkZap} target="_blank" className="btn-whatsapp"><MessageCircle size={20} /> WhatsApp</a>
           </div>
        </aside>
      </div>
    </div>
  );
};