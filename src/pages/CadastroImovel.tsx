// src/pages/Admin.tsx - VERSÃO ATUALIZADA COM UPLOAD DE IMAGENS
import { useState, useEffect, type ChangeEvent, type FormEvent } from 'react';
import { db } from '../../services/firebaseConfig';
import { collection, addDoc, doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { useNavigate, useParams } from 'react-router-dom';
import type { Imovel } from '../types';
import { uploadMultipleImages, optimizeCloudinaryUrl } from '../services/cloudinaryService';

export const CadastroImovel = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const [formData, setFormData] = useState<Omit<Imovel, 'id'>>({
    titulo: '', descricao: '', tipo: 'Venda',
    preco: 0, precoAluguel: 0,
    endereco: '', bairro: '', cidade: 'Açailândia',
    area: 0, quartos: 0, suites: 0, banheiros: 0, vagas: 0,
    condominio: 0, iptu: 0,
    piscina: false, churrasqueira: false, elevador: false,
    mobiliado: false, portaria: false, aceitaPet: false,
    imagens: [], 
    lat: -15.5518, lng: -54.2980
  });

  useEffect(() => {
    if (id) {
      const carregarDados = async () => {
        setLoading(true);
        try {
          const docSnap = await getDoc(doc(db, "imoveis", id));
          if (docSnap.exists()) {
            const data = docSnap.data() as Imovel;
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { id: idIgnorado, ...dadosSemId } = data;
            setFormData(dadosSemId);
            setPreviewUrls(dadosSemId.imagens || []);
          } else {
            alert("Imóvel não encontrado!");
            navigate('/admin');
          }
        } catch (error) {
          console.error("Erro ao buscar:", error);
        } finally {
          setLoading(false);
        }
      };
      carregarDados();
    }
  }, [id, navigate]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const isNumber = ['preco', 'precoAluguel', 'area', 'quartos', 'banheiros', 'suites', 'vagas', 'condominio', 'iptu', 'lat', 'lng'].includes(name);
    setFormData(prev => ({ ...prev, [name]: isNumber ? Number(value) : value }));
  };

  const handleCheck = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleImageSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const filesArray = Array.from(files);
    setSelectedFiles(prev => [...prev, ...filesArray]);

    // Criar previews locais
    filesArray.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrls(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    
    // Se estiver editando, remover também do formData
    if (id) {
      setFormData(prev => ({
        ...prev,
        imagens: prev.imagens.filter((_, i) => i !== index)
      }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
  e.preventDefault();
  setLoading(true);
  
  try {
    let imagensUrls = [...formData.imagens];

    // Fazer upload das novas imagens selecionadas
    if (selectedFiles.length > 0) {
      setUploadingImages(true);
      const novasUrls = await uploadMultipleImages(selectedFiles);
      imagensUrls = [...imagensUrls, ...novasUrls];
      setUploadingImages(false);
    }

    const dadosFinais = { 
      ...formData,
      imagens: imagensUrls,
    };
    
    if (dadosFinais.tipo !== 'Ambos') dadosFinais.precoAluguel = 0;

    if (id) {
      // EDITANDO - adiciona data de atualização
      await updateDoc(doc(db, "imoveis", id), {
        ...dadosFinais,
        atualizadoEm: serverTimestamp(), // ← ADICIONA TIMESTAMP DE ATUALIZAÇÃO
      });
      alert("Imóvel atualizado com sucesso!");
    } else {
      // CRIANDO - adiciona data de criação
      await addDoc(collection(db, "imoveis"), {
        ...dadosFinais,
        criadoEm: serverTimestamp(), // ← ADICIONA TIMESTAMP DE CRIAÇÃO
      });
      alert("Imóvel cadastrado com sucesso!");
    }
    navigate('/');
  } catch (error) { 
    console.error("Erro ao salvar:", error);
    const msg = error instanceof Error ? error.message : "Erro desconhecido";
    alert("Erro ao salvar: " + msg);
  } finally {
    setLoading(false);
    setUploadingImages(false);
  }
};

  return (
    <div className="container" style={{ padding: '2rem 0', maxWidth: '900px' }}>
      <h1>{id ? "✏️ Editar Imóvel" : "🏠 Cadastrar Novo Imóvel"}</h1>
      
      <div className="card" style={{ padding: '2rem', marginTop: '1rem', border: 'none', boxShadow: 'none', background: 'transparent' }}>
        <form onSubmit={handleSubmit} style={{ display: 'grid' }}>
          
          <section>
            <h3>Informações Principais</h3>
            <div style={{ display: 'grid', gap: '1rem' }}>
              <div>
                <label className="label">Título</label>
                <input 
                  name="titulo" 
                  value={formData.titulo} 
                  onChange={handleChange} 
                  className="input-control" 
                  required 
                  placeholder="Ex: Apartamento no Centro com Vista" 
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="label">Finalidade</label>
                  <select name="tipo" value={formData.tipo} onChange={handleChange} className="input-control">
                    <option value="Venda">Venda</option>
                    <option value="Aluguel">Aluguel</option>
                    <option value="Ambos">Ambos</option>
                  </select>
                </div>
                <div>
                  <label className="label">{formData.tipo === 'Aluguel' ? 'Aluguel (R$)' : 'Venda (R$)'}</label>
                  <input 
                    name="preco" 
                    type="number" 
                    value={formData.preco || ''} 
                    onChange={handleChange} 
                    className="input-control" 
                    required 
                    placeholder="Ex: 350000"
                  />
                </div>
                {formData.tipo === 'Ambos' && (
                  <div>
                    <label className="label">Aluguel (R$)</label>
                    <input 
                      name="precoAluguel" 
                      type="number" 
                      min="0"
                      step="0.01"
                      max="999999"
                      autoComplete="off"
                      value={formData.precoAluguel || ''} 
                      onChange={handleChange} 
                      className="input-control" 
                      required 
                      placeholder="Ex: 2500"
                    />
                  </div>
                )}
              </div>
            </div>
          </section>

          <section>
             <h3>Localização</h3>
             <div style={{ display: 'grid', gap: '1rem' }}>
                <div>
                  <label className="label">Endereço</label>
                  <input 
                    name="endereco" 
                    value={formData.endereco} 
                    onChange={handleChange} 
                    className="input-control" 
                    required 
                    placeholder="Ex: Rua das Palmeiras, 123"
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                   <div>
                     <label className="label">Bairro</label>
                     <input 
                       name="bairro" 
                       value={formData.bairro} 
                       onChange={handleChange} 
                       className="input-control" 
                       required 
                       placeholder="Ex: Jardim Imperial"
                     />
                   </div>
                   <div>
                     <label className="label">Cidade</label>
                     <input 
                       name="cidade" 
                       value={formData.cidade} 
                       onChange={handleChange} 
                       className="input-control" 
                       placeholder="Ex: Primavera do Leste"
                     />
                   </div>
                </div>
             </div>
          </section>

          <section>
            <h3>Detalhes</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '1rem' }}>
              <div><label className="label">Área (m²)</label><input name="area" type="number" value={formData.area || ''} onChange={handleChange} className="input-control" placeholder="Ex: 120" /></div>
              <div><label className="label">Quartos</label><input name="quartos" type="number" value={formData.quartos || ''} onChange={handleChange} className="input-control" placeholder="Ex: 3" /></div>
              <div><label className="label">Suítes</label><input name="suites" type="number" value={formData.suites || ''} onChange={handleChange} className="input-control" placeholder="Ex: 1" /></div>
              <div><label className="label">Banh.</label><input name="banheiros" type="number" value={formData.banheiros || ''} onChange={handleChange} className="input-control" placeholder="Ex: 2" /></div>
              <div><label className="label">Vagas</label><input name="vagas" type="number" value={formData.vagas || ''} onChange={handleChange} className="input-control" placeholder="Ex: 2" /></div>
            </div>
          </section>

          <section>
             <h3>Custos Extras</h3>
             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div><label className="label">Condomínio (R$)</label><input name="condominio" type="number" value={formData.condominio || ''} onChange={handleChange} className="input-control" placeholder="Ex: 450" /></div>
                <div><label className="label">IPTU (R$)</label><input name="iptu" type="number" value={formData.iptu || ''} onChange={handleChange} className="input-control" placeholder="Ex: 1200" /></div>
             </div>
          </section>

          <section>
            <h3>Comodidades</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '1rem' }}>
              <label style={{display:'flex', gap:'8px', alignItems:'center', cursor:'pointer'}}><input type="checkbox" name="piscina" checked={formData.piscina} onChange={handleCheck} style={{width:'18px', height:'18px'}} /> Piscina</label>
              <label style={{display:'flex', gap:'8px', alignItems:'center', cursor:'pointer'}}><input type="checkbox" name="churrasqueira" checked={formData.churrasqueira} onChange={handleCheck} style={{width:'18px', height:'18px'}} /> Churrasqueira</label>
              <label style={{display:'flex', gap:'8px', alignItems:'center', cursor:'pointer'}}><input type="checkbox" name="elevador" checked={formData.elevador} onChange={handleCheck} style={{width:'18px', height:'18px'}} /> Elevador</label>
              <label style={{display:'flex', gap:'8px', alignItems:'center', cursor:'pointer'}}><input type="checkbox" name="mobiliado" checked={formData.mobiliado} onChange={handleCheck} style={{width:'18px', height:'18px'}} /> Mobiliado</label>
              <label style={{display:'flex', gap:'8px', alignItems:'center', cursor:'pointer'}}><input type="checkbox" name="portaria" checked={formData.portaria} onChange={handleCheck} style={{width:'18px', height:'18px'}} /> Portaria</label>
              <label style={{display:'flex', gap:'8px', alignItems:'center', cursor:'pointer'}}><input type="checkbox" name="aceitaPet" checked={formData.aceitaPet} onChange={handleCheck} style={{width:'18px', height:'18px'}} /> Aceita Pet</label>
            </div>
          </section>

          {/* NOVA SEÇÃO: UPLOAD DE IMAGENS */}
          <section>
            <h3>📸 Fotos do Imóvel</h3>
            <div style={{ display: 'grid', gap: '1rem' }}>
              <div>
                <label className="label">Adicionar Fotos</label>
                <input 
                  type="file" 
                  accept="image/*" 
                  multiple 
                  onChange={handleImageSelect}
                  className="input-control"
                  style={{ padding: '0.5rem' }}
                />
                <small style={{ color: '#666', fontSize: '0.85rem' }}>
                  Selecione até 10 fotos. Formatos: JPG, PNG, WEBP
                </small>
              </div>

              {/* Preview das imagens */}
              {previewUrls.length > 0 && (
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', 
                  gap: '1rem',
                  marginTop: '1rem'
                }}>
                  {previewUrls.map((url, index) => (
                    <div 
                      key={index} 
                      style={{ 
                        position: 'relative',
                        aspectRatio: '4/3',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        border: '2px solid #ddd'
                      }}
                    >
                      <img 
                        src={url.includes('cloudinary') ? optimizeCloudinaryUrl(url, 300) : url}
                        alt={`Preview ${index + 1}`}
                        style={{ 
                          width: '100%', 
                          height: '100%', 
                          objectFit: 'cover' 
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        style={{
                          position: 'absolute',
                          top: '5px',
                          right: '5px',
                          background: 'rgba(255, 0, 0, 0.8)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '50%',
                          width: '28px',
                          height: '28px',
                          cursor: 'pointer',
                          fontSize: '16px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          <section>
            <label className="label">Descrição</label>
            <textarea 
              name="descricao" 
              rows={6} 
              value={formData.descricao} 
              onChange={handleChange} 
              className="input-control" 
              style={{height: 'auto'}}
              placeholder="Ex: Imóvel recém reformado, próximo a escolas e supermercados. Possui acabamento em porcelanato..." 
            />
          </section>

          <button 
            type="submit" 
            className="btn-details" 
            style={{ background: 'var(--primary)', color: 'white', marginTop:'1rem' }} 
            disabled={loading || uploadingImages}
          >
            {uploadingImages ? "📤 Enviando imagens..." : loading ? "💾 Salvando..." : "✅ Salvar Imóvel"}
          </button>
        </form>
      </div>
    </div>
  );
};