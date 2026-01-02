# Deploy no Render - Guia Completo

Este guia explica como fazer o deploy do backend Retro101 no Render.

## 📋 Pré-requisitos

- Conta no [Render](https://render.com/) (gratuita)
- Repositório Git (GitHub, GitLab, ou Bitbucket)
- Frontend já deployado no Vercel em `https://retro101.vercel.app`

## 🚀 Deploy Automático (Recomendado)

### Método 1: Usando render.yaml (Blueprint)

1. **Push o código para o repositório Git**
   ```bash
   git add .
   git commit -m "Add Render deployment configuration"
   git push
   ```

2. **Criar novo Blueprint no Render**
   - Acesse: https://dashboard.render.com/
   - Clique em **"New +"** → **"Blueprint"**
   - Conecte seu repositório
   - O Render detectará automaticamente o `render.yaml`
   - Clique em **"Apply"**

3. **Aguardar o deploy**
   - O Render fará o build automático usando o Dockerfile
   - Primeiro deploy leva ~5-10 minutos
   - Deployments subsequentes são mais rápidos

4. **Copiar a URL do serviço**
   - Após o deploy, você verá algo como: `https://retro101-backend.onrender.com`
   - Copie esta URL

### Método 2: Deploy Manual

1. **Criar novo Web Service**
   - Acesse: https://dashboard.render.com/
   - Clique em **"New +"** → **"Web Service"**
   - Conecte seu repositório
   - Selecione a branch (geralmente `main`)

2. **Configurar o serviço**
   - **Name:** `retro101-backend`
   - **Region:** Oregon (US West) - mais próximo e rápido
   - **Branch:** `main`
   - **Root Directory:** `retro101-backend`
   - **Runtime:** `Docker`
   - **Dockerfile Path:** `./retro101-backend/Dockerfile`
   - **Docker Build Context Directory:** `./retro101-backend`

3. **Configurar variáveis de ambiente**

   Clique em **"Advanced"** e adicione:

   | Key | Value |
   |-----|-------|
   | `SPRING_PROFILES_ACTIVE` | `production` |
   | `PORT` | `8080` |
   | `ALLOWED_ORIGINS` | `https://retro101.vercel.app` |
   | `FRONTEND_URL` | `https://retro101.vercel.app` |
   | `JAVA_OPTS` | `-Xmx512m -Xms256m` |

4. **Configurar plano**
   - **Instance Type:** `Free` (512MB RAM, suficiente para começar)
   - **Health Check Path:** `/actuator/health`

5. **Criar o serviço**
   - Clique em **"Create Web Service"**
   - Aguarde o build e deploy

## ⚙️ Configurar o Frontend (Vercel)

Após obter a URL do backend no Render (ex: `https://retro101-backend.onrender.com`):

1. **Acessar o painel do Vercel**
   - Vá para: https://vercel.com/dashboard
   - Selecione o projeto `retro101-frontend`

2. **Configurar variáveis de ambiente**
   - Vá em **Settings** → **Environment Variables**
   - Adicione as seguintes variáveis:

   | Name | Value |
   |------|-------|
   | `VITE_API_URL` | `https://retro101-backend.onrender.com` |
   | `VITE_WS_URL` | `https://retro101-backend.onrender.com` |

3. **Redeploy o frontend**
   - Vá em **Deployments**
   - Clique nos **"..."** do último deployment
   - Clique em **"Redeploy"**
   - Aguarde o deploy completar

## 🔍 Verificar o Deploy

### Backend (Render)

1. **Health Check**
   ```bash
   curl https://retro101-backend.onrender.com/actuator/health
   ```

   Deve retornar:
   ```json
   {"status":"UP"}
   ```

2. **Verificar CORS**
   ```bash
   curl -H "Origin: https://retro101.vercel.app" \
        -H "Access-Control-Request-Method: POST" \
        -X OPTIONS \
        https://retro101-backend.onrender.com/api/rooms
   ```

### Frontend (Vercel)

1. Acesse: https://retro101.vercel.app
2. Tente criar uma sala
3. Verifique no console do browser se não há erros de CORS
4. Teste a funcionalidade de WebSocket

## 🛠️ Troubleshooting

### Backend não inicia

1. **Verificar logs no Render**
   - Dashboard → Seu serviço → Aba **"Logs"**
   - Procure por erros de Java/Spring Boot

2. **Verificar variáveis de ambiente**
   - Dashboard → Seu serviço → **"Environment"**
   - Certifique-se que todas as variáveis estão configuradas

3. **Verificar Dockerfile**
   - O Render usa o Dockerfile em `retro101-backend/Dockerfile`
   - Verifique se o build local funciona:
     ```bash
     cd retro101-backend
     docker build -t test .
     docker run -p 8080:8080 -e SPRING_PROFILES_ACTIVE=production test
     ```

### Health check falhando

1. **Verificar endpoint do actuator**
   ```bash
   curl https://SEU-APP.onrender.com/actuator/health
   ```

2. **Verificar se actuator está no pom.xml**
   ```xml
   <dependency>
       <groupId>org.springframework.boot</groupId>
       <artifactId>spring-boot-starter-actuator</artifactId>
   </dependency>
   ```

### CORS errors no frontend

1. **Verificar ALLOWED_ORIGINS no backend**
   - Deve ser exatamente: `https://retro101.vercel.app`
   - Sem barra no final!

2. **Verificar URL do frontend**
   - No console do browser, veja qual origem está fazendo a requisição
   - Adicione todas as origens necessárias (ex: preview deployments)

3. **Adicionar múltiplas origens**
   ```
   ALLOWED_ORIGINS=https://retro101.vercel.app,https://retro101-git-*.vercel.app
   ```

### Serviço indo para sleep (Render Free Tier)

O Render free tier coloca serviços inativos em sleep após 15 minutos:

1. **Primeira requisição será lenta** (~30-60 segundos)
2. **Soluções:**
   - Upgrade para plano pago ($7/mês)
   - Use serviço de ping (cron-job.org, UptimeRobot)
   - Aceite o cold start inicial

### Out of Memory (OOM)

Se o serviço crashar por falta de memória:

1. **Otimizar JAVA_OPTS** (já configurado):
   ```
   JAVA_OPTS=-Xmx512m -Xms256m
   ```

2. **Reduzir consumo de memória:**
   - Remover dependências não usadas
   - Otimizar queries e caching

3. **Upgrade para plano pago** (mais RAM)

## 🔄 Deploy Contínuo

Com o setup atual, **cada push para a branch main** dispara um novo deploy automático no Render.

Para fazer deploy:
```bash
git add .
git commit -m "Sua mensagem de commit"
git push
```

O Render automaticamente:
1. Detecta o novo commit
2. Faz build da nova imagem Docker
3. Executa health check
4. Faz deploy sem downtime (zero-downtime deployment)

## 📊 Monitoramento

### Render Dashboard

- **Logs em tempo real:** Dashboard → Logs
- **Métricas:** Dashboard → Metrics (CPU, RAM, requests)
- **Deploy history:** Dashboard → Events

### Logs úteis

```bash
# Ver logs em tempo real
# (Instale o Render CLI)
render logs -f retro101-backend

# Ver últimos 100 logs
render logs -n 100 retro101-backend
```

## 💰 Custos

### Free Tier (Atual)
- **Custo:** $0/mês
- **RAM:** 512MB
- **CPU:** Compartilhado
- **Limitações:**
  - Sleep após 15min de inatividade
  - 750 horas/mês (suficiente para 1 serviço)
  - Build time limitado

### Starter ($7/mês)
- **RAM:** 512MB
- **CPU:** Dedicado
- **Sem sleep**
- **Builds mais rápidos**

### Standard ($25/mês)
- **RAM:** 2GB
- **CPU:** Dedicado
- **Alta performance**

## 🔗 Links Úteis

- **Render Dashboard:** https://dashboard.render.com/
- **Documentação Render:** https://render.com/docs
- **Status do Render:** https://status.render.com/
- **Suporte:** https://render.com/support

## ✅ Checklist de Deploy

- [ ] Código commitado e pushed para Git
- [ ] `render.yaml` configurado
- [ ] Serviço criado no Render
- [ ] Variáveis de ambiente configuradas
- [ ] Deploy bem-sucedido
- [ ] Health check passando
- [ ] URL do backend copiada
- [ ] Variáveis do frontend (Vercel) atualizadas
- [ ] Frontend redeployed
- [ ] Teste end-to-end funcionando
- [ ] CORS configurado corretamente
- [ ] WebSocket funcionando

---

**Pronto!** Seu backend agora está rodando no Render. 🎉

**URLs finais:**
- Backend: `https://retro101-backend.onrender.com`
- Frontend: `https://retro101.vercel.app`
