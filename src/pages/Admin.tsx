import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import { db } from "../../services/firebaseConfig";
import { collection, addDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { useNavigate, useParams } from "react-router-dom";
import type { Imovel } from "../types";

export const Admin = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);

  // Estado com TODOS os campos
  const [formData, setFormData] = useState<Omit<Imovel, "id">>({
    titulo: "",
    descricao: "",
    tipo: "Venda",

    // Preços
    preco: 0, // Principal
    precoAluguel: 0, // Secundário (só para 'Ambos')

    // Localização
    endereco: "",
    bairro: "",
    cidade: "Primavera do Leste",

    // Detalhes
    area: 0,
    quartos: 0,
    suites: 0,
    banheiros: 0,
    vagas: 0,

    // Custos Extras
    condominio: 0,
    iptu: 0,

    // Comodidades
    piscina: false,
    churrasqueira: false,
    elevador: false,
    mobiliado: false,
    portaria: false,
    aceitaPet: false,

    // Sistema
    imagens: [],
    lat: -23.55052,
    lng: -46.633308,
  });

  // Carregar dados na edição
  useEffect(() => {
    if (id) {
      const carregarDados = async () => {
        setLoading(true);
        try {
          const docSnap = await getDoc(doc(db, "imoveis", id));
          if (docSnap.exists()) {
            const data = docSnap.data() as Imovel;
            
            // CORREÇÃO 1: Usamos o comentário abaixo para o fiscal ignorar que o 'id' não será usado
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { id: idIgnorado, ...dadosSemId } = data;
            
            setFormData(dadosSemId);
          } else {
            alert("Imóvel não encontrado!");
            navigate("/admin");
          }
        } catch (error) {
          console.error("Erro ao buscar:", error);
        } finally {
          setLoading(false);
        }
      };
      carregarDados();
    }
    // CORREÇÃO 2: Adicionamos 'navigate' na lista de dependências
  }, [id, navigate]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    // Lista de campos que são números
    const isNumber = [
      "preco",
      "precoAluguel",
      "area",
      "quartos",
      "banheiros",
      "suites",
      "vagas",
      "condominio",
      "iptu",
      "lat",
      "lng",
    ].includes(name);

    setFormData((prev) => ({
      ...prev,
      [name]: isNumber ? Number(value) : value,
    }));
  };

  const handleCheck = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Limpeza: Se não for 'Ambos', zera o precoAluguel para evitar sujeira no banco
      const dadosFinais = { ...formData };
      if (dadosFinais.tipo !== "Ambos") {
        dadosFinais.precoAluguel = 0;
      }

      if (id) {
        await updateDoc(doc(db, "imoveis", id), dadosFinais);
        alert("Imóvel atualizado com sucesso!");
      } else {
        await addDoc(collection(db, "imoveis"), dadosFinais);
        alert("Imóvel cadastrado com sucesso!");
      }
      navigate("/");
      
    } catch (error) { // <--- 1. Removemos o ': any'
      console.error("Erro ao salvar:", error);

      // 2. Verificamos se é um erro padrão para pegar a mensagem com segurança
      const message = error instanceof Error ? error.message : "Erro desconhecido";
      
      alert("Erro ao salvar: " + message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: "2rem 0", maxWidth: "900px" }}>
      <h1>{id ? "✏️ Editar Imóvel" : "🏠 Cadastrar Novo Imóvel"}</h1>

      <div className="card" style={{ padding: "2rem", marginTop: "1rem" }}>
        <form
          onSubmit={handleSubmit}
          style={{ display: "grid", gap: "1.5rem" }}
        >
          {/* SEÇÃO 1: BÁSICO E PREÇOS */}
          <section>
            <h3
              style={{
                marginBottom: "1rem",
                color: "var(--primary)",
                borderBottom: "1px solid #eee",
                paddingBottom: "0.5rem",
              }}
            >
              Informações Principais
            </h3>
            <div style={{ display: "grid", gap: "1rem" }}>
              <div>
                <label className="label">Título do Anúncio</label>
                <input
                  name="titulo"
                  value={formData.titulo}
                  onChange={handleChange}
                  className="input-control"
                  required
                  placeholder="Ex: Casa no Centro"
                />
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: "1rem",
                }}
              >
                <div>
                  <label className="label">Finalidade</label>
                  <select
                    name="tipo"
                    value={formData.tipo}
                    onChange={handleChange}
                    className="input-control"
                  >
                    <option value="Venda">Venda</option>
                    <option value="Aluguel">Aluguel</option>
                    <option value="Ambos">Venda e Aluguel</option>
                  </select>
                </div>

                {/* CAMPO DE PREÇO 1 */}
                <div>
                  <label className="label">
                    {formData.tipo === "Aluguel"
                      ? "Valor do Aluguel (R$)"
                      : "Valor de Venda (R$)"}
                  </label>
                  <input
                    name="preco"
                    type="number"
                    value={formData.preco || ""}
                    onChange={handleChange}
                    className="input-control"
                    required
                  />
                </div>

                {/* CAMPO DE PREÇO 2 (SÓ APARECE SE FOR AMBOS) */}
                {formData.tipo === "Ambos" && (
                  <div>
                    <label className="label">Valor do Aluguel (R$)</label>
                    <input
                      name="precoAluguel"
                      type="number"
                      value={formData.precoAluguel || ""}
                      onChange={handleChange}
                      className="input-control"
                      required
                    />
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* SEÇÃO 2: DETALHES */}
          <section>
            <h3
              style={{
                marginBottom: "1rem",
                color: "var(--primary)",
                borderBottom: "1px solid #eee",
                paddingBottom: "0.5rem",
              }}
            >
              Detalhes do Imóvel
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                gap: "1rem",
              }}
            >
              <div>
                <label className="label">Área (m²)</label>
                <input
                  name="area"
                  type="number"
                  value={formData.area || ""}
                  onChange={handleChange}
                  className="input-control"
                  required
                />
              </div>
              <div>
                <label className="label">Quartos</label>
                <input
                  name="quartos"
                  type="number"
                  value={formData.quartos || ""}
                  onChange={handleChange}
                  className="input-control"
                  required
                />
              </div>
              <div>
                <label className="label">Suítes</label>
                <input
                  name="suites"
                  type="number"
                  value={formData.suites || ""}
                  onChange={handleChange}
                  className="input-control"
                />
              </div>
              <div>
                <label className="label">Banheiros</label>
                <input
                  name="banheiros"
                  type="number"
                  value={formData.banheiros || ""}
                  onChange={handleChange}
                  className="input-control"
                  required
                />
              </div>
              <div>
                <label className="label">Vagas Garagem</label>
                <input
                  name="vagas"
                  type="number"
                  value={formData.vagas || ""}
                  onChange={handleChange}
                  className="input-control"
                />
              </div>
            </div>
          </section>

          {/* SEÇÃO 3: CUSTOS EXTRAS */}
          <section>
            <h3
              style={{
                marginBottom: "1rem",
                color: "var(--primary)",
                borderBottom: "1px solid #eee",
                paddingBottom: "0.5rem",
              }}
            >
              Custos Mensais/Anuais
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1rem",
              }}
            >
              <div>
                <label className="label">Condomínio (R$)</label>
                <input
                  name="condominio"
                  type="number"
                  value={formData.condominio || ""}
                  onChange={handleChange}
                  className="input-control"
                  placeholder="Opcional"
                />
              </div>
              <div>
                <label className="label">IPTU (R$)</label>
                <input
                  name="iptu"
                  type="number"
                  value={formData.iptu || ""}
                  onChange={handleChange}
                  className="input-control"
                  placeholder="Opcional"
                />
              </div>
            </div>
          </section>

          {/* SEÇÃO 4: LOCALIZAÇÃO */}
          <section>
            <h3
              style={{
                marginBottom: "1rem",
                color: "var(--primary)",
                borderBottom: "1px solid #eee",
                paddingBottom: "0.5rem",
              }}
            >
              Localização
            </h3>
            <div style={{ display: "grid", gap: "1rem" }}>
              <div>
                <label className="label">Endereço (Rua e Número)</label>
                <input
                  name="endereco"
                  value={formData.endereco}
                  onChange={handleChange}
                  className="input-control"
                  required
                />
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "1rem",
                }}
              >
                <div>
                  <label className="label">Bairro</label>
                  <input
                    name="bairro"
                    value={formData.bairro}
                    onChange={handleChange}
                    className="input-control"
                    required
                  />
                </div>
                <div>
                  <label className="label">Cidade</label>
                  <input
                    name="cidade"
                    value={formData.cidade}
                    onChange={handleChange}
                    className="input-control"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* SEÇÃO 5: COMODIDADES */}
          <section>
            <h3
              style={{
                marginBottom: "1rem",
                color: "var(--primary)",
                borderBottom: "1px solid #eee",
                paddingBottom: "0.5rem",
              }}
            >
              O que oferece?
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
                gap: "1rem",
              }}
            >
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  name="piscina"
                  checked={formData.piscina}
                  onChange={handleCheck}
                />{" "}
                Piscina
              </label>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  name="churrasqueira"
                  checked={formData.churrasqueira}
                  onChange={handleCheck}
                />{" "}
                Churrasqueira
              </label>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  name="elevador"
                  checked={formData.elevador}
                  onChange={handleCheck}
                />{" "}
                Elevador
              </label>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  name="mobiliado"
                  checked={formData.mobiliado}
                  onChange={handleCheck}
                />{" "}
                Mobiliado
              </label>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  name="portaria"
                  checked={formData.portaria}
                  onChange={handleCheck}
                />{" "}
                Portaria 24h
              </label>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  name="aceitaPet"
                  checked={formData.aceitaPet}
                  onChange={handleCheck}
                />{" "}
                Aceita Pet
              </label>
            </div>
          </section>

          {/* SEÇÃO 6: DESCRIÇÃO */}
          <section>
            <label className="label">Descrição Detalhada</label>
            <textarea
              name="descricao"
              rows={6}
              value={formData.descricao}
              onChange={handleChange}
              className="input-control"
              placeholder="Descreva os pontos fortes do imóvel..."
            />
          </section>

          <button
            type="submit"
            className="btn-details"
            style={{
              background: "var(--success)",
              color: "white",
              marginTop: "1rem",
            }}
            disabled={loading}
          >
            {loading
              ? "Salvando..."
              : id
              ? "💾 Salvar Alterações"
              : "✅ Cadastrar Imóvel"}
          </button>
        </form>
      </div>
    </div>
  );
};
