import { useEffect } from 'react';
import { Award, ShieldCheck, HeartHandshake } from 'lucide-react';
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
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 16 16" fill="currentColor">
                <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/>
              </svg>
              Chamar no WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
