# Imobiliária

Aplicativo web moderno para visualização e gerenciamento de imóveis, desenvolvido com React e TypeScript.

## 🚀 Tecnologias Utilizadas

Este projeto foi construído utilizando as seguintes tecnologias e bibliotecas:

- **[React](https://react.dev/)** (v19) - Biblioteca para construção de interfaces de usuário.
- **[TypeScript](https://www.typescriptlang.org/)** - Superset do JavaScript com tipagem estática.
- **[Vite](https://vitejs.dev/)** - Build tool e ambiente de desenvolvimento rápido.
- **[React Router](https://reactrouter.com/)** (v7) - Gerenciamento de rotas e navegação.
- **[Firebase](https://firebase.google.com/)** - Backend as a Service (Autenticação e Banco de Dados).
- **[Leaflet](https://leafletjs.com/)** & **[React Leaflet](https://react-leaflet.js.org/)** - Mapas interativos.
- **[Cloudinary](https://cloudinary.com/)** - Gerenciamento e otimização de imagens.
- **[Lucide React](https://lucide.dev/)** - Ícones.

## ✨ Funcionalidades

- **Catálogo de Imóveis**: Visualização de imóveis disponíveis com filtros (implícito na Home).
- **Detalhes do Imóvel**: Página dedicada com informações completas e localização no mapa.
- **Favoritos**: Permite aos usuários salvar imóveis de interesse.
- **Autenticação**:
  - Login e Cadastro de usuários.
  - Recuperação de senha.
- **Painel Administrativo/Usuário**:
  - **Perfil**: Gerenciamento de dados do usuário.
  - **Cadastro de Imóveis**: Criação de novos anúncios (Rota Protegida).
  - **Edição**: Atualização de informações de imóveis existentes.
  - **Admin**: Gestão de imóveis cadastrados.

## 📦 Como rodar o projeto

### Pré-requisitos

Certifique-se de ter o [Node.js](https://nodejs.org/) instalado em sua máquina.

### Instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/marcusstudios/Imobiliaria.git
   ```

2. Acesse a pasta do projeto:
   ```bash
   cd Imobiliaria
   ```

3. Instale as dependências:
   ```bash
   npm install
   ```

### Executando

Para iniciar o servidor de desenvolvimento:

```bash
npm run dev
```

O aplicativo estará disponível em `http://localhost:5173` (ou porta similar indicada no terminal).

### Outros Comandos

- **Build de Produção**:
  ```bash
  npm run build
  ```
- **Preview do Build**:
  ```bash
  npm run preview
  ```
- **Linting**:
  ```bash
  npm run lint
  ```

## 📂 Estrutura do Projeto

```
src/
├── assets/       # Recursos estáticos (imagens, etc)
├── components/   # Componentes reutilizáveis (Header, Footer, Cards, etc)
├── contexts/     # Context API (Gerenciamento de estado global)
├── css/          # Arquivos de estilo
├── pages/        # Páginas da aplicação (Home, Admin, Perfil, etc)
├── services/     # Integrações com APIs/Serviços (Firebase, etc)
├── types/        # Definições de tipos TypeScript
├── App.tsx       # Componente principal e configuração de rotas
└── main.tsx      # Ponto de entrada da aplicação
```

## 👤 Autor

Desenvolvido por **Marcus Studios**.
