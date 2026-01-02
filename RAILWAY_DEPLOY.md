# 🚂 Guia de Deploy no Railway

Este projeto é um monorepo com frontend (React/Vite) e backend (Spring Boot/Java). Você precisa criar **dois serviços separados** no Railway.

## 📋 Passo a Passo

### 1️⃣ Deploy do Backend (Spring Boot)

1. Acesse [Railway.app](https://railway.app) e faça login
2. Clique em **"+ New Project"**
3. Selecione **"Deploy from GitHub repo"**
4. Escolha o repositório **`retro101`**
5. **IMPORTANTE**: Configure as seguintes opções:
   - **Service Name**: `retro101-backend` (ou qualquer nome)
   - **Root Directory**: `retro101-backend`
   - **Start Command**: (deixe em branco - o nixpacks.toml cuida disso)

6. **Variáveis de Ambiente** (Settings → Variables):
   ```
   SPRING_PROFILES_ACTIVE=production
   PORT=8080
   ALLOWED_ORIGINS=https://seu-frontend.railway.app
   FRONTEND_URL=https://seu-frontend.railway.app
   ```

   ⚠️ **IMPORTANTE**: Substitua `seu-frontend.railway.app` pela URL real do frontend após fazer deploy dele (passo 2)

7. Clique em **Deploy**

8. Após o deploy, copie a URL do backend (ex: `https://retro101-backend-production.railway.app`)

---

### 2️⃣ Deploy do Frontend (React/Vite)

1. No mesmo projeto Railway, clique em **"+ New Service"**
2. Selecione **"GitHub Repo"**
3. Escolha o mesmo repositório **`retro101`**
4. **IMPORTANTE**: Configure as seguintes opções:
   - **Service Name**: `retro101-frontend` (ou qualquer nome)
   - **Root Directory**: `retro101-frontend`
   - **Start Command**: (deixe em branco - o nixpacks.toml cuida disso)

5. **Variáveis de Ambiente** (Settings → Variables):
   ```
   VITE_API_URL=https://retro101-backend-production.railway.app
   ```

   ⚠️ **IMPORTANTE**: Use a URL real do backend copiada no passo 1

6. Clique em **Deploy**

---

### 3️⃣ Atualizar CORS no Backend

Após ter a URL do frontend:

1. Volte no serviço do **backend**
2. Vá em **Settings → Variables**
3. Atualize a variável `ALLOWED_ORIGINS` com a URL correta do frontend
4. Exemplo: `ALLOWED_ORIGINS=https://retro101-frontend-production.railway.app`
5. O Railway vai fazer redeploy automaticamente

---

## ✅ Verificação

Após ambos os deploys:

1. Acesse a URL do frontend
2. Tente criar uma retrospectiva
3. Verifique se a comunicação com o backend está funcionando
4. Verifique os logs em caso de erro:
   - Backend: Railway → retro101-backend → Deployments → View Logs
   - Frontend: Railway → retro101-frontend → Deployments → View Logs

---

## 🔧 Variáveis de Ambiente - Resumo

### Backend (`retro101-backend`)
| Variável | Exemplo | Descrição |
|----------|---------|-----------|
| `SPRING_PROFILES_ACTIVE` | `production` | Define o perfil Spring |
| `PORT` | `8080` | Porta do servidor (Railway define automaticamente) |
| `ALLOWED_ORIGINS` | `https://retro101-frontend-production.railway.app` | URLs permitidas para CORS |
| `FRONTEND_URL` | `https://retro101-frontend-production.railway.app` | URL do frontend |

### Frontend (`retro101-frontend`)
| Variável | Exemplo | Descrição |
|----------|---------|-----------|
| `VITE_API_URL` | `https://retro101-backend-production.railway.app` | URL da API backend |

---

## 🐛 Problemas Comuns

### CORS Error
- Verifique se `ALLOWED_ORIGINS` no backend contém a URL exata do frontend
- Verifique se não tem barra final na URL (use `https://app.com` e não `https://app.com/`)

### Frontend não conecta ao Backend
- Verifique se `VITE_API_URL` está correta
- Verifique se o backend está rodando (Railway → Backend → Deployments)
- Verifique os logs do backend para erros

### Build Failed
- Verifique se o `Root Directory` está correto
- Verifique os logs de build no Railway
- Certifique-se de que os arquivos `nixpacks.toml` estão commitados no repositório

---

## 📚 Arquivos de Configuração

- `retro101-backend/nixpacks.toml` - Configuração de build do backend
- `retro101-frontend/nixpacks.toml` - Configuração de build do frontend
- `.dockerignore` - Arquivos ignorados no build
