// src/pages/Admin.tsx
import { useState, type ChangeEvent, type FormEvent } from 'react';
import { db, storage } from '../../services/firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useNavigate } from 'react-router-dom'; // Para redirecionar após salvar

export const Admin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    titulo: '', preco: '', endereco: '', quartos: '', 
    banheiros: '', area: '', descricao: '', tipo: 'Venda',
    lat: '-23.550520', lng: '-46.633308'
  });
  const [imagem, setImagem] = useState<File | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImagem(file);
      // Cria uma URL temporária para mostrar o preview
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imagemUrl = '';
      if (imagem) {
        const storageRef = ref(storage, `imoveis/${Date.now()}-${imagem.name}`);
        const snapshot = await uploadBytes(storageRef, imagem);
        imagemUrl = await getDownloadURL(snapshot.ref);
      }

      await addDoc(collection(db, "imoveis"), {
        ...formData,
        preco: Number(formData.preco),
        quartos: Number(formData.quartos),
        banheiros: Number(formData.banheiros),
        area: Number(formData.area),
        lat: Number(formData.lat),
        lng: Number(formData.lng),
        imagens: [imagemUrl]
      });

      alert("Imóvel cadastrado com sucesso!");
      navigate('/'); // Volta para a Home
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao cadastrar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '2rem 0', maxWidth: '800px' }}>
      <h1 style={{ marginBottom: '1.5rem', color: 'var(--primary)' }}>Cadastrar Novo Imóvel</h1>
      
      <div className="card" style={{ padding: '2rem' }}>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.5rem' }}>
          
          <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '1rem', padding: 0 }}>
            <div>
              <label className="label">Título do Anúncio</label>
              <input name="titulo" onChange={handleChange} className="input-control" required />
            </div>
            <div>
              <label className="label">Tipo</label>
              <select name="tipo" onChange={handleChange} className="input-control">
                <option value="Venda">Venda</option>
                <option value="Aluguel">Aluguel</option>
              </select>
            </div>
          </div>

          <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '1rem', padding: 0 }}>
             <div>
               <label className="label">Preço (R$)</label>
               <input name="preco" type="number" onChange={handleChange} className="input-control" required />
             </div>
             <div>
               <label className="label">Endereço</label>
               <input name="endereco" onChange={handleChange} className="input-control" required />
             </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <input name="quartos" type="number" placeholder="Quartos" onChange={handleChange} className="input-control" />
            <input name="banheiros" type="number" placeholder="Banheiros" onChange={handleChange} className="input-control" />
            <input name="area" type="number" placeholder="Área (m²)" onChange={handleChange} className="input-control" />
          </div>

          <div>
             <label className="label">Descrição</label>
             <textarea name="descricao" rows={4} onChange={handleChange} className="input-control" />
          </div>

          {/* Área de Upload com Preview */}
          <div style={{ border: '2px dashed #cbd5e1', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
            <label style={{ cursor: 'pointer', display: 'block' }}>
              <span style={{ fontWeight: 'bold', color: 'var(--primary)' }}>Clique para adicionar foto</span>
              <input type="file" onChange={handleImageChange} style={{ display: 'none' }} required />
            </label>
            {preview && (
              <img src={preview} alt="Preview" style={{ marginTop: '10px', maxHeight: '200px', borderRadius: '8px' }} />
            )}
          </div>

          {/* Localização */}
          <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px' }}>
            <h4 style={{marginBottom: '0.5rem'}}>Coordenadas (Mapa)</h4>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <input name="lat" placeholder="Latitude" onChange={handleChange} className="input-control" defaultValue={formData.lat}/>
              <input name="lng" placeholder="Longitude" onChange={handleChange} className="input-control" defaultValue={formData.lng}/>
            </div>
          </div>

          <button 
            type="submit" 
            className="btn-details" 
            style={{ background: 'var(--success)', color: 'white', marginTop: '1rem' }} 
            disabled={loading}
          >
            {loading ? "Salvando..." : "Confirmar Cadastro"}
          </button>
        </form>
      </div>
    </div>
  );
};