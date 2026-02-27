// src/App.tsx
import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import "./css/App.css";

// Components
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { RotaPrivada } from "./components/RotaPrivada";
import { Home } from "./pages/Home";

// Imports com Lazy Loading (Carregamento sob demanda)
const Admin = lazy(() =>
  import("./pages/Admin").then((module) => ({ default: module.Admin })),
);
const Detalhes = lazy(() =>
  import("./pages/Detalhes").then((module) => ({ default: module.Detalhes })),
);

const Perfil = lazy(() =>
  import("./pages/Perfil").then((module) => ({ default: module.Perfil })),
);

const Favoritos = lazy(() =>
  import("./pages/Favoritos").then((module) => ({ default: module.Favoritos })),
);

const SobreNos = lazy(() =>
  import("./pages/SobreNos").then((module) => ({ default: module.SobreNos })),
);

const Login = lazy(() =>
  import("./pages/Login").then((module) => ({ default: module.Login })),
);
const Cadastro = lazy(() =>
  import("./pages/Cadastro").then((module) => ({ default: module.Cadastro })),
);
const RecuperarSenha = lazy(() =>
  import("./pages/RecuperarSenha").then((module) => ({
    default: module.RecuperarSenha,
  })),
);

// Import do Formulário de Cadastro/Edição
const CadastroImovel = lazy(() =>
  import("./pages/CadastroImovel").then((module) => ({
    default: module.CadastroImovel,
  })),
);


// Import Cadastro Terreno
const CadastroTerreno = lazy(() =>
  import("./pages/CadastroTerreno").then((module) => ({
    default: module.CadastroTerreno,
  })),
);


// Componente de Loading
const Loading = () => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      padding: "4rem",
      color: "#64748b",
    }}
  >
    <p>Carregando...</p>
  </div>
);

function App() {
  return (
    <div className="app">
      <Header />

      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/imovel/:id" element={<Detalhes />} />
          <Route path="/favoritos" element={<Favoritos />} />
          <Route path="/sobre-nos" element={<SobreNos />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/recuperar-senha" element={<RecuperarSenha />} />

          {/* ROTAS PROTEGIDAS DO ADMIN */}
          <Route
            path="/admin"
            element={
              <RotaPrivada>
                <Admin />
              </RotaPrivada>
            }
          />

          {/* Rota para CRIAR novo imóvel */}
          <Route
            path="/cadastro-imovel"
            element={
              <RotaPrivada>
                <CadastroImovel />
              </RotaPrivada>
            }
          />

          {/* Rota para EDITAR imóvel existente (usa o mesmo form) */}
          <Route
            path="/editar/:id"
            element={
              <RotaPrivada>
                <CadastroImovel />
              </RotaPrivada>
            }
          />

          {/* Rotas para TERRENOS */}
          <Route
            path="/admin/terrenos/novo"
            element={
              <RotaPrivada>
                <CadastroTerreno />
              </RotaPrivada>
            }
          />
          <Route
            path="/admin/terrenos/editar/:id"
            element={
              <RotaPrivada>
                <CadastroTerreno />
              </RotaPrivada>
            }
          />

        </Routes>
      </Suspense>

      <Footer />
    </div>
  );
}

export default App;
