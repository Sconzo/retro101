# Retro101 - Guia Docker

Este guia explica como executar o backend do Retro101 usando Docker.

## Pré-requisitos

- Docker instalado (versão 20.10+)
- Docker Compose instalado (versão 2.0+)

## Configuração Rápida

### 1. Configurar Variáveis de Ambiente

Copie o arquivo de exemplo e ajuste conforme necessário:

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:

```env
# Porta onde o backend será exposto
BACKEND_PORT=8080

# Perfil do Spring Boot (development ou production)
SPRING_PROFILES_ACTIVE=production

# URLs permitidas para CORS (separe múltiplas URLs com vírgula)
ALLOWED_ORIGINS=http://localhost:5173

# URL do frontend
FRONTEND_URL=http://localhost:5173
```

### 2. Executar com Docker Compose

Para iniciar o backend:

```bash
docker-compose up -d
```

Para acompanhar os logs:

```bash
docker-compose logs -f backend
```

Para parar o backend:

```bash
docker-compose down
```

### 3. Configurar o Frontend

O frontend já está configurado para usar variáveis de ambiente. Ajuste o arquivo `.env.development` ou `.env.example` no diretório `retro101-frontend`:

```env
VITE_API_URL=http://localhost:8080
VITE_WS_URL=http://localhost:8080
```

## Comandos Úteis

### Build e Start
```bash
# Rebuild e iniciar
docker-compose up -d --build

# Ver logs em tempo real
docker-compose logs -f

# Ver status dos containers
docker-compose ps
```

### Manutenção
```bash
# Parar os serviços
docker-compose stop

# Parar e remover containers
docker-compose down

# Parar, remover containers e volumes
docker-compose down -v

# Remover imagens antigas
docker image prune -a
```

### Debug
```bash
# Acessar o container do backend
docker-compose exec backend sh

# Ver logs do backend
docker-compose logs backend

# Verificar health check
docker-compose ps
```

## Deployment em Produção

### Opção 1: Docker Compose em Servidor

1. Clone o repositório no servidor
2. Configure o arquivo `.env` com valores de produção:
   ```env
   BACKEND_PORT=8080
   SPRING_PROFILES_ACTIVE=production
   ALLOWED_ORIGINS=https://seu-dominio.com
   FRONTEND_URL=https://seu-dominio.com
   ```
3. Execute: `docker-compose up -d`

### Opção 2: Build e Push para Registry

```bash
# Build da imagem
docker build -t retro101-backend:latest ./retro101-backend

# Tag para seu registry
docker tag retro101-backend:latest seu-registry/retro101-backend:latest

# Push para o registry
docker push seu-registry/retro101-backend:latest
```

### Opção 3: Plataformas Cloud

Para Railway, Render, ou outras plataformas:

1. Use o `Dockerfile` em `retro101-backend/Dockerfile`
2. Configure as variáveis de ambiente na plataforma:
   - `SPRING_PROFILES_ACTIVE=production`
   - `PORT=8080`
   - `ALLOWED_ORIGINS=<url-do-frontend>`
   - `FRONTEND_URL=<url-do-frontend>`

## Variáveis de Ambiente

### Backend (Spring Boot)

| Variável | Descrição | Padrão | Obrigatória |
|----------|-----------|--------|-------------|
| `SPRING_PROFILES_ACTIVE` | Perfil do Spring (development/production) | production | Não |
| `PORT` | Porta do servidor | 8080 | Não |
| `ALLOWED_ORIGINS` | URLs permitidas para CORS | - | Sim (em prod) |
| `FRONTEND_URL` | URL do frontend | - | Sim (em prod) |

### Frontend (Vite/React)

| Variável | Descrição | Padrão | Obrigatória |
|----------|-----------|--------|-------------|
| `VITE_API_URL` | URL da API do backend | http://localhost:8080 | Sim |
| `VITE_WS_URL` | URL do WebSocket do backend | http://localhost:8080 | Sim |

## Troubleshooting

### Backend não inicia

1. Verifique os logs: `docker-compose logs backend`
2. Verifique se a porta 8080 está livre: `netstat -an | grep 8080`
3. Verifique as variáveis de ambiente no `.env`

### Frontend não conecta ao backend

1. Verifique se `VITE_API_URL` e `VITE_WS_URL` estão corretos
2. Verifique se `ALLOWED_ORIGINS` no backend inclui a URL do frontend
3. Verifique CORS errors no console do browser

### Health check falhando

O health check verifica `/actuator/health`. Se estiver falhando:

1. Adicione a dependência do actuator no `pom.xml`:
   ```xml
   <dependency>
       <groupId>org.springframework.boot</groupId>
       <artifactId>spring-boot-starter-actuator</artifactId>
   </dependency>
   ```
2. Rebuild: `docker-compose up -d --build`

## Arquitetura

```
┌─────────────────┐         ┌─────────────────┐
│   Frontend      │         │    Backend      │
│   (Vite/React)  │ ◄─────► │  (Spring Boot)  │
│   Port: 5173    │         │   Port: 8080    │
└─────────────────┘         └─────────────────┘
        │                            │
        └────────── Docker ──────────┘
                   Network
```

## Recursos Adicionais

- [Documentação Docker](https://docs.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)
- [Spring Boot Docker](https://spring.io/guides/gs/spring-boot-docker/)
