# Configuração do Projeto e Variáveis de Ambiente

Este projeto utiliza Firebase e requer variáveis de ambiente para funcionar corretamente. Por questões de segurança, as chaves de API não são versionadas no repositório.

## 1. Configuração Local

1. Copie o arquivo de exemplo:
   ```bash
   cp .env.example .env
   ```

2. Preencha o arquivo `.env` com suas credenciais do Firebase.
   - Você pode encontrar essas informações no console do Firebase em **Project Settings > General > Your apps**.

3. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

> **Nota:** O arquivo `.env` já está no `.gitignore` e não será enviado para o GitHub.

## 2. Deploy (Vercel / Netlify)

Ao fazer deploy, você precisa configurar as variáveis de ambiente no painel da plataforma de hospedagem.

### Vercel
1. Vá para o dashboard do seu projeto.
2. Navegue até **Settings > Environment Variables**.
3. Adicione cada variável do arquivo `.env.example` (com seus valores reais).

### Netlify
1. Vá para o dashboard do seu site.
2. Navegue até **Site configuration > Environment variables**.
3. Adicione as variáveis lá.

## 3. Variáveis Disponíveis

| Variável | Descrição |
|----------|-----------|
| `VITE_FIREBASE_API_KEY` | Chave de API do Firebase |
| `VITE_FIREBASE_AUTH_DOMAIN` | Domínio de autenticação |
| `VITE_FIREBASE_PROJECT_ID` | ID do projeto |
| `VITE_FIREBASE_STORAGE_BUCKET` | URL do bucket de storage |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Sender ID para mensagens |
| `VITE_FIREBASE_APP_ID` | ID único da aplicação web |
| `VITE_FIREBASE_MEASUREMENT_ID` | ID do Google Analytics (opcional) |
| `VITE_ADMIN_UID` | UID do usuário administrador (para regras de segurança) |
