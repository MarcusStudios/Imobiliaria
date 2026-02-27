import { useEffect } from 'react';
import { Award, ShieldCheck, HeartHandshake, MessageCircle } from 'lucide-react';
import { useSEO } from '../hooks/useSEO';
import '../css/SobreNos.css';

export const SobreNos = () => {
  useSEO({ title: 'Sobre Nós', description: 'Conheça Lidiany Lopes e a Moriá Imóveis. Corretora com mais de uma década de experiência no mercado imobiliário de Açailândia.' });
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="sobre-nos-page">
      {/* 1. HERO BANNER */}
      <section className="sobre-nos-hero">
        <div className="container sobre-hero-content">
          <h1>Nossa História</h1>
          <p>Conectando você ao imóvel perfeito com segurança e ética.</p>
        </div>
      </section>

      {/* 2. BIOGRAFIA / QUEM SOMOS */}
      <section className="sobre-main">
        <div className="container sobre-main-container">
          <div className="sobre-text-content">
            <span className="sobre-subtitle">Lidiany Lopes & Moria Imóveis</span>
            <h2 className="sobre-title">Mais de uma década realizando sonhos na região.</h2>
            
            <p className="sobre-text">
              Com sólida experiência no mercado imobiliário de Açailândia e região, minha missão sempre foi além do simples fechamento de contratos. O foco é oferecer um <strong>atendimento extremamente personalizado</strong>, pautado na total transparência e excelência, para quem busca comprar, vender ou alugar imóveis.
            </p>
            <p className="sobre-text">
              Acredito que cada cliente é único, e cada negociação exige dedicação exclusiva. Trabalho incessantemente para entender as suas reais necessidades, mapeando o mercado para apresentar as <strong>melhores e mais seguras oportunidades</strong>, garantindo que o seu patrimônio seja valorizado e sua família encontre o lar ideal.
            </p>

            <div className="sobre-stats">
              <div className="stat-item">
                <h4>922-J</h4>
                <p>CRECI-MA Moria Imóveis</p>
              </div>
              <div className="stat-item">
                <h4>F4632</h4>
                <p>CRECI-MA Lidiany Lopes</p>
              </div>
            </div>
          </div>

          <div className="sobre-image-col">
            <div className="sobre-image-container">
              {/* Imagem Placeholder Elegante. Pode ser trocada depois pela foto da corretora */}
              <img 
                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                alt="Escritório Lidiany Lopes" 
              />
            </div>
          </div>
        </div>
      </section>

      {/* 3. NOSSOS VALORES / DIFERENCIAIS */}
      <section className="valores-section">
        <div className="container">
          <div className="valores-header">
            <h2>Por que nos escolher?</h2>
          </div>
          <div className="valores-grid">
            <div className="valor-card">
              <div className="valor-icon">
                <ShieldCheck size={32} />
              </div>
              <h3>Segurança Jurídica</h3>
              <p>Trabalhamos com rigor em toda a documentação, garantindo contratos blindados e negociações sem dores de cabeça do início ao fim.</p>
            </div>
            
            <div className="valor-card">
              <div className="valor-icon">
                <HeartHandshake size={32} />
              </div>
              <h3>Atendimento Humano</h3>
              <p>Não tratamos imóveis como números. Entendemos histórias de vida e buscamos opções que realmente façam sentido para o seu momento.</p>
            </div>

            <div className="valor-card">
              <div className="valor-icon">
                <Award size={32} />
              </div>
              <h3>Curadoria de Excelência</h3>
              <p>Nossa carteira de imóveis passa por uma rigorosa seleção. Só oferecemos propriedades com real potencial de valorização e qualidade construtiva.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CALL TO ACTION FINAL */}
      <section className="sobre-cta">
        <div className="container">
          <div className="cta-box">
            <h2>Pronto para encontrar seu imóvel ideal?</h2>
            <p>Agende uma conversa sem compromisso. Nossa equipe está pronta para entender sua necessidade e mostrar as melhores opções da cidade.</p>
            <a href="https://wa.me/5599991243054" target="_blank" rel="noopener noreferrer" className="btn-cta-whatsapp">
              <MessageCircle size={24} />
              Chamar no WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
