// src/pages/Admin.tsx
import { useState, type ChangeEvent, type FormEvent } from 'react';
import { db } from '../../services/firebaseConfig'; // Removemos 'storage' daqui
import { collection, addDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

export const Admin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    titulo: '', 
    preco: '', 
    endereco: '', 
    quartos: '', 
    banheiros: '', 
    area: '', 
    descricao: '', 
    tipo: 'Venda',
    lat: '-23.550520', 
    lng: '-46.633308'
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    console.log("--- INICIANDO CADASTRO SIMPLIFICADO ---");

    try {
      // Salva no Banco de Dados com uma imagem de mentirinha
      await addDoc(collection(db, "imoveis"), {
        ...formData,
        preco: Number(formData.preco),
        quartos: Number(formData.quartos),
        banheiros: Number(formData.banheiros),
        area: Number(formData.area),
        lat: Number(formData.lat),
        lng: Number(formData.lng),
        // Adicionamos uma imagem padrão automaticamente para não quebrar a Home
        imagens: ["https://placehold.co/600x400?text=Imagem+Pendente"] 
      });

      console.log("SUCESSO! Salvo no Firestore.");
      alert("Imóvel cadastrado com sucesso (sem foto real)!");
      navigate('/');
      
   } catch (error) {
      // Removemos o ': any' e tratamos o tipo aqui dentro
      console.error("ERRO NO BANCO DE DADOS:", error);
      
      // Verificamos se 'error' é realmente um objeto de Erro para pegar a mensagem segura
      const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
      
      alert("Erro ao salvar no banco: " + errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '2rem 0', maxWidth: '800px' }}>
      <h1>Painel Administrativo (Sem Upload)</h1>
      <div className="card" style={{ padding: '2rem' }}>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
          
          <label className="label">Título</label>
          <input name="titulo" onChange={handleChange} className="input-control" required placeholder="Ex: Casa no Centro" />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label className="label">Preço (R$)</label>
              <input name="preco" type="number" onChange={handleChange} className="input-control" required />
            </div>
            <div>
              <label className="label">Tipo</label>
              <select name="tipo" onChange={handleChange} className="input-control">
                <option value="Venda">Venda</option>
                <option value="Aluguel">Aluguel</option>
              </select>
            </div>
          </div>

          <label className="label">Endereço</label>
          <input name="endereco" onChange={handleChange} className="input-control" required />

          <div style={{ display: 'flex', gap: '1rem' }}>
             <input name="quartos" type="number" placeholder="Quartos" onChange={handleChange} className="input-control" />
             <input name="banheiros" type="number" placeholder="Banheiros" onChange={handleChange} className="input-control" />
             <input name="area" type="number" placeholder="Área (m²)" onChange={handleChange} className="input-control" />
          </div>

          <label className="label">Descrição</label>
          <textarea name="descricao" rows={4} onChange={handleChange} className="input-control" />

          <p style={{ fontSize: '0.9rem', color: '#666', fontStyle: 'italic', background: '#f0f0f0', padding: '10px', borderRadius: '4px' }}>
            ℹ️ O upload de imagens foi desativado temporariamente. O imóvel será salvo com uma imagem padrão.
          </p>

          <button type="submit" className="btn-details" style={{ background: 'var(--success)', color: 'white' }} disabled={loading}>
            {loading ? "Salvando..." : "Cadastrar Imóvel"}
          </button>

        </form>
      </div>
    </div>
  );
};