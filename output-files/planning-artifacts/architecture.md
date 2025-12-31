---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]
inputDocuments:
  - 'output-files/planning-artifacts/prd.md'
  - 'output-files/planning-artifacts/product-brief-retro101-2025-12-29.md'
  - 'output-files/planning-artifacts/ux-design-specification.md'
workflowType: 'architecture'
project_name: 'retro101'
user_name: 'Rspol'
date: '2025-12-30'
lastStep: 8
status: 'complete'
completedAt: '2025-12-30'
---

# Architecture Decision Document

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

## Project Context Analysis

### Requirements Overview

**Functional Requirements:**

O retro101 possui 36 requisitos funcionais organizados em 6 áreas principais:

1. **Gerenciamento de Salas** (FR1-FR5): Criação de salas com links únicos compartilháveis, acesso via URL, identificação de primeira visita
2. **Gerenciamento de Categorias** (FR6-FR10): Definição de 2-5 categorias personalizadas pelo facilitador, fixas durante retrospectiva
3. **Gerenciamento de Cards** (FR11-FR19): Criação, edição e exclusão de cards de texto com autoria automática, sincronização em tempo real de todas as operações
4. **Gerenciamento de Participantes** (FR20-FR24): Entrada com apenas nome, avatar gerado automaticamente, sem roles diferenciados
5. **Colaboração em Tempo Real** (FR25-FR30): Sincronização via WebSocket, suporte a 5-10 usuários, reconexão automática, heartbeat
6. **Interface e Acessibilidade** (FR31-FR36): Navegação por teclado, contraste mínimo 4.5:1, HTML semântico, ARIA básico, responsivo (desktop/tablet/mobile), compatibilidade com últimas 2 versões dos browsers principais

**Implicações Arquiteturais dos FRs:**
- Necessidade de WebSocket server robusto para sincronização bidirecional
- Sistema de identificação de sessões efêmeras (não persistente)
- Estado distribuído entre múltiplos clientes que precisa permanecer consistente
- Frontend SPA com state management para responsividade
- Edição e exclusão de cards (FR16-FR19) requerem resolução de conflitos e sincronização consistente

**Non-Functional Requirements:**

20 NFRs críticos organizados em 6 categorias:

1. **Performance** (NFR1-NFR4):
   - < 200ms para ações do usuário (95% dos casos)
   - < 500ms para sincronização em tempo real
   - < 2s para carregamento inicial da sala
   - Bundle otimizado e lazy loading

2. **Reliability** (NFR5-NFR8):
   - Sistema estável durante 30-60 minutos
   - Reconexão automática WebSocket
   - Consistência eventual de dados
   - Degradação graciosa em falhas

3. **Scalability** (NFR9-NFR11):
   - 5-10 usuários por sala sem degradação
   - Até 15 usuários com degradação aceitável
   - Múltiplas salas simultâneas
   - Performance mantida até 50 cards por sala

4. **Usability** (NFR12-NFR15):
   - Facilitador cria sala em < 60s
   - Participante contribui em < 30s
   - Interface autoexplicativa (zero documentação)
   - Simplicidade intencional

5. **Accessibility** (NFR16-NFR19):
   - Navegação completa por teclado
   - Contraste mínimo 4.5:1
   - HTML semântico + ARIA
   - Responsivo (desktop/tablet/mobile)

6. **Browser Compatibility** (NFR20):
   - Últimas 2 versões: Chrome, Firefox, Safari, Edge
   - Safari iOS e Chrome Android
   - Graceful degradation

**Implicações Arquiteturais dos NFRs:**
- Performance targets exigem optimistic updates, caching agressivo, e otimização de bundle
- Latência < 500ms requer WebSocket eficiente e possivelmente servidor geograficamente próximo aos usuários
- Reconexão automática exige state reconciliation e mecanismo de retry com backoff
- Escalabilidade para múltiplas salas sugere arquitetura stateless ou estado em memória compartilhada (Redis)
- Metas de usabilidade (< 60s e < 30s) influenciam design de API e fluxos de frontend

**Scale & Complexity:**

- **Primary domain**: Full-Stack Web Application com Real-Time Collaboration
- **Complexity level**: Médio-Baixa
  - Escopo bem definido e focado
  - Arquitetura relativamente direta (cliente-servidor com WebSocket)
  - Maior desafio técnico: sincronização confiável em tempo real
  - Sem requisitos regulatórios ou de compliance complexos

- **Estimated architectural components**: 6-8 componentes principais
  1. Room Management Service
  2. Category Management
  3. Card Management Service
  4. Participant Management
  5. WebSocket Hub/Broker
  6. State Synchronization Engine
  7. Session Management (efêmero)
  8. REST API Gateway (criação de salas)

- **Project scale indicators**:
  - 36 requisitos funcionais
  - 20 requisitos não-funcionais
  - 5-10 usuários simultâneos por sala (escala pequena-média)
  - MVP focado (sem features de growth no escopo inicial)
  - Projeto de aprendizado com objetivo de uso real

### Technical Constraints & Dependencies

**Stack Tecnológico Definido:**
- **Backend**: Java com Spring Boot (definido pelo usuário)
- **WebSocket**: Spring WebSocket ou STOMP over WebSocket
- **Build Tool**: Maven
- **Frontend**: SPA framework moderno (React/Vue/Svelte - a definir)
- **Deployment**: JAR executável Spring Boot + frontend estático

**Constraints Identificados:**
1. **Salas Efêmeras**: Não há persistência de longo prazo - salas existem apenas durante sessões ativas
2. **Sem Autenticação Complexa**: Apenas identificação por nome (sem JWT, OAuth, etc no MVP)
3. **Browser Support**: Apenas browsers modernos (sem IE), permite uso de APIs modernas
4. **Real-Time como Requisito Core**: Arquitetura precisa priorizar sincronização sobre persistência
5. **Desktop-First**: Otimização primária para viewport ≥1024px, secundária para mobile

**Dependencies Identificadas:**
- Spring WebSocket para comunicação real-time
- Frontend framework com state management robusto
- Potencialmente Redis ou similar para estado compartilhado entre instâncias (se escalar horizontalmente)
- WebSocket client library no frontend

### Cross-Cutting Concerns Identified

**1. Real-Time State Synchronization**
- **Afeta**: Cards, participantes, categorias, presença
- **Criticidade**: ALTA - diferencial core do produto
- **Implicações**:
  - Protocolo de sincronização consistente
  - Resolução de conflitos (edição/exclusão simultânea)
  - Broadcast eficiente para múltiplos clientes
  - Ordenação de eventos

**2. Session & Connection Management**
- **Afeta**: Salas, participantes, WebSocket connections
- **Criticidade**: ALTA - impacta confiabilidade
- **Implicações**:
  - Heartbeat/keepalive para detectar conexões mortas
  - Reconexão automática com state reconciliation
  - Limpeza de sessões abandonadas
  - Identificação de participantes através de reconexões

**3. Performance & Responsiveness**
- **Afeta**: Todos os componentes (frontend, backend, rede)
- **Criticidade**: ALTA - metas específicas (< 200ms, < 500ms)
- **Implicações**:
  - Optimistic updates no cliente
  - Minimização de payload WebSocket
  - Indexação eficiente de salas/cards
  - Bundle splitting e lazy loading no frontend

**4. Error Handling & Resilience**
- **Afeta**: WebSocket, sincronização, persistência temporária
- **Criticidade**: MÉDIA-ALTA - impacta trust do usuário
- **Implicações**:
  - Retry logic com exponential backoff
  - Degradação graciosa (funcionalidade básica mantida)
  - Mensagens de erro claras e acionáveis
  - Recovery de estado após falhas

**5. Responsive Multi-Device Experience**
- **Afeta**: Frontend (layout, interações)
- **Criticidade**: MÉDIA - desktop é primário, mas precisa funcionar em outros
- **Implicações**:
  - CSS responsive design (mobile-first ou desktop-first)
  - Touch-friendly em tablet/mobile
  - Performance em dispositivos com menos recursos

**6. Accessibility & Inclusive Design**
- **Afeta**: Frontend (markup, estilos, interações)
- **Criticidade**: MÉDIA - requisito básico (não certificação completa)
- **Implicações**:
  - HTML semântico consistente
  - Navegação por teclado completa
  - ARIA live regions para updates em tempo real
  - Contraste de cores adequado

## Starter Template Evaluation

### Primary Technology Domain

**Full-Stack Web Application com Real-Time Collaboration**

- **Frontend**: React + TypeScript SPA
- **Backend**: Java Spring Boot (já definido)
- **Communication**: WebSocket/STOMP

### Technical Preferences Established

**Frontend Stack:**
- **Framework**: React 18+ (biblioteca de componentes mais popular, excelente ecossistema)
- **Language**: TypeScript (type safety, melhor DX, reduz bugs)
- **Build Tool**: Vite (HMR ultrarrápido, build otimizado, configuração mínima)
- **Styling**: Tailwind CSS (utility-first, prototipação rápida, bundle pequeno)

**Rationale for Stack Choice:**
- **React**: Ecossistema maduro, excelente para SPAs interativas, hooks perfeitos para WebSocket
- **TypeScript**: Type safety crítico para sincronização real-time e state management complexo
- **Vite**: Performance de desenvolvimento excepcional, HMR instantâneo, otimização de build automática
- **Tailwind**: Velocidade de desenvolvimento, consistência visual, minimalismo intencional alinha com UX

### Starter Options Considered

**Option 1: Vite Official Template + Manual Setup (SELECTED)**
- **Command**: `npm create vite@latest retro101-frontend -- --template react-ts`
- **Approach**: Start com template oficial minimalista, adicionar Tailwind e outras dependências manualmente
- **Source**: [Official Vite Guide](https://vite.dev/guide/)

**Option 2: Community Boilerplates**
- [vite-react-typescript-tailwind-shadcn-template](https://github.com/Lightxxo/vite-react-typescript-tailwind-shadcn-template)
- [reactjs-vite-tailwindcss-boilerplate](https://github.com/joaopaulomoraes/reactjs-vite-tailwindcss-boilerplate)
- **Analysis**: Incluem setup completo (ESLint, Prettier, Vitest, etc.) mas adicionam dependências que podem não ser necessárias

### Selected Starter: Vite Official React-TS Template

**Rationale for Selection:**

1. **Simplicidade e Controle Total**
   - Template minimalista oficial sem opiniões excessivas
   - Adiciona apenas o que o projeto precisa
   - Evita dependências desnecessárias de boilerplates

2. **Sempre Atualizado**
   - Comando `npm create vite@latest` sempre usa versão mais recente
   - Mantido oficialmente pela equipe Vite
   - Best practices atualizadas automaticamente

3. **Flexibilidade para Real-Time**
   - Fácil adicionar bibliotecas WebSocket (STOMP.js, SockJS)
   - Sem configurações pré-estabelecidas que podem conflitar
   - State management pode ser escolhido conforme necessidade (Zustand, Context API)

4. **Objetivo de Aprendizado**
   - Setup manual ensina cada ferramenta e decisão arquitetural
   - Compreensão profunda da stack ao invés de "magia" de boilerplate
   - Controle total sobre evolução do projeto

5. **Performance Otimizada**
   - Bundle mínimo desde o início
   - Vite otimiza automaticamente para produção
   - Tree-shaking eficiente

**Initialization Commands:**

```bash
# 1. Create Vite project with React + TypeScript
npm create vite@latest retro101-frontend -- --template react-ts

# 2. Navigate to project
cd retro101-frontend

# 3. Install dependencies
npm install

# 4. Install Tailwind CSS and dependencies
npm install -D tailwindcss@^3.4 postcss@^8 autoprefixer@^10

# 5. Initialize Tailwind configuration
npx tailwindcss init -p

# 6. Install WebSocket libraries for Spring Boot integration
npm install @stomp/stompjs sockjs-client

# 7. Install React hooks for STOMP (optional, recommended)
npm install react-stomp-hooks

# 8. Install additional utilities
npm install clsx tailwind-merge
```

**Tailwind Configuration (tailwind.config.js):**

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

**Global CSS Update (src/index.css):**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### Architectural Decisions Provided by Starter

**Language & Runtime:**
- **TypeScript 5.x** with strict mode enabled
- **React 18+** with hooks and concurrent features
- **ESNext** target for modern JavaScript features
- **tsx/jsx** for component syntax

**Build Tooling:**
- **Vite 6.x** (current latest) for development and production builds
- **esbuild** for ultrafast transpilation
- **Rollup** for production bundling with tree-shaking
- **Hot Module Replacement (HMR)** para desenvolvimento instantâneo
- **CSS code splitting** automático

**Styling Solution:**
- **Tailwind CSS 3.4+** utility-first framework
- **PostCSS** para processamento de CSS
- **Autoprefixer** para compatibilidade cross-browser
- **JIT (Just-In-Time)** mode do Tailwind para classes on-demand

**Development Experience:**
- **TypeScript** com tsconfig.json otimizado para React
- **Vite dev server** com HMR instantâneo (< 50ms updates)
- **Source maps** para debugging
- **.env** support para variáveis de ambiente
- **Fast Refresh** preserva estado de componentes durante desenvolvimento

**Testing Framework (to be added):**
- **Vitest** (recomendado, integração nativa com Vite)
- **React Testing Library** para testes de componentes
- **Playwright** ou **Cypress** para E2E (a definir posteriormente)

**Code Organization (Base Structure):**

```
retro101-frontend/
├── src/
│   ├── assets/          # Imagens, fonts, etc
│   ├── components/      # Componentes React reutilizáveis
│   ├── features/        # Feature-based modules (rooms, cards, etc)
│   ├── hooks/           # Custom React hooks (useWebSocket, etc)
│   ├── services/        # API e WebSocket services
│   ├── types/           # TypeScript type definitions
│   ├── utils/           # Utility functions
│   ├── App.tsx          # Root component
│   ├── main.tsx         # Entry point
│   └── index.css        # Global styles com Tailwind
├── public/              # Static assets
├── index.html           # HTML template
├── vite.config.ts       # Vite configuration
├── tailwind.config.js   # Tailwind configuration
├── tsconfig.json        # TypeScript configuration
└── package.json         # Dependencies
```

**WebSocket Integration Setup:**

Para integrar com Spring Boot WebSocket (STOMP):

```typescript
// src/services/websocket.ts
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

export const createWebSocketClient = (roomId: string) => {
  const client = new Client({
    webSocketFactory: () => new SockJS('/ws'), // Spring Boot endpoint
    reconnectDelay: 5000,
    heartbeatIncoming: 4000,
    heartbeatOutgoing: 4000,
  });

  return client;
};
```

Ou com React hooks:

```typescript
// Using react-stomp-hooks
import { useStompClient, useSubscription } from 'react-stomp-hooks';
```

**State Management (to be decided):**

Opções arquiteturais para gerenciar estado real-time:

1. **React Context API** (simple, built-in)
2. **Zustand** (lightweight, recomendado para estado distribuído)
3. **Redux Toolkit** (se complexidade crescer)

Decisão será tomada na fase de decisões arquiteturais.

**References:**
- [Vite Official Guide](https://vite.dev/guide/)
- [Tailwind CSS Vite Guide](https://v3.tailwindcss.com/docs/guides/vite)
- [STOMP.js Documentation](https://stomp-js.github.io/)
- [React STOMP Hooks Guide](https://medium.com/front-end-world/a-complete-guide-to-using-stomp-js-and-sockjs-in-react-react-native-typescript-0d8bade60b48)
- [WebSockets with React Guide](https://ably.com/blog/websockets-react-tutorial)

**Note:** Project initialization using these commands should be the first implementation task/story. Frontend setup é independente do backend e pode ser desenvolvido em paralelo.

## Core Architectural Decisions

### Decision Priority Analysis

**Critical Decisions (Block Implementation):**

1. ✅ **Data Persistence Strategy** - In-Memory para MVP, PostgreSQL para futuro
2. ✅ **State Management** - Zustand v5 para estado real-time
3. ✅ **Backend Structure** - Layer-based package organization
4. ✅ **Testing Strategy** - Vitest/Playwright (frontend), JUnit 5 (backend)
5. ✅ **Deployment** - Vercel (frontend), Railway (backend)

**Important Decisions (Shape Architecture):**

1. ✅ **Environment Configuration** - .env (frontend), application.yml (backend)
2. ✅ **CORS Configuration** - Spring CORS para desenvolvimento/produção
3. ✅ **Error Handling** - Padrões estabelecidos para frontend e backend
4. ✅ **Logging** - Logback (Spring Boot padrão)

**Deferred Decisions (Post-MVP):**

1. ⏸️ **API Documentation** - Swagger/OpenAPI (adicionar quando API estabilizar)
2. ⏸️ **Monitoring/Observability** - Sentry, DataDog (adicionar após MVP validado)
3. ⏸️ **Advanced CI/CD** - Pipelines complexos (Vercel/Railway CI/CD básico suficiente para MVP)
4. ⏸️ **Performance Monitoring** - APM tools (adicionar se necessário)
5. ⏸️ **Analytics** - User analytics (post-MVP)

### Data Architecture

**Decision: Ephemeral In-Memory Storage (MVP)**

- **Implementation**: ConcurrentHashMap para armazenar salas ativas
- **Rationale**:
  - Salas são efêmeras por design (requisito do produto)
  - Simplicidade de implementação para projeto de aprendizado
  - Zero dependências externas
  - Performance máxima (tudo em memória)
- **Trade-offs**:
  - ✅ Simples, rápido, sem setup
  - ❌ Dados perdidos em restart do servidor
  - ❌ Não escala horizontalmente (single instance)
- **Affects**: RoomService, CardService, ParticipantService
- **Future Migration**: PostgreSQL quando necessário persistir histórico de retrospectivas

**Data Model (In-Memory):**

```java
// Stored in ConcurrentHashMap<String, Room>
class Room {
    String id;
    List<Category> categories;
    List<Card> cards;
    Set<Participant> participants;
    LocalDateTime createdAt;
}

class Card {
    String id;
    String content;
    String categoryId;
    String authorId;
    LocalDateTime createdAt;
}

class Participant {
    String id;
    String name;
    String sessionId; // WebSocket session
    String avatarColor;
}
```

**Session Management:**

- **WebSocket Sessions**: Gerenciadas pelo Spring WebSocket
- **Room Cleanup**: TTL-based (remover salas inativas após X horas)
- **Participant Tracking**: Por WebSocket session ID

**Future Database Strategy (v2+):**

- **Database**: PostgreSQL 16+
- **ORM**: Spring Data JPA + Hibernate
- **Migration Tool**: Flyway ou Liquibase
- **Use Cases**:
  - Persistir histórico de retrospectivas
  - Analytics de longo prazo
  - Templates de categorias salvos
  - User accounts (se adicionar autenticação)

### Authentication & Security

**Decision: No Authentication in MVP**

- **Rationale**:
  - Requisito do produto: acesso via link sem fricção
  - Identificação simples por nome
  - Salas são efêmeras e não contêm dados sensíveis
- **Security Measures**:
  - CORS configurado para permitir apenas domínios conhecidos
  - Rate limiting no WebSocket (prevenir flood)
  - Input validation (sanitize card content)
  - HTTPS em produção (Vercel + Railway suportam)

**CORS Configuration:**

```java
// Spring Boot - WebSocketConfig
@Configuration
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {
    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws")
                .setAllowedOrigins(
                    "http://localhost:5173",  // Vite dev
                    "https://retro101.vercel.app" // Produção
                )
                .withSockJS();
    }
}
```

**Input Validation:**

- **Card Content**: Max 500 caracteres, sanitize HTML
- **Participant Name**: Max 50 caracteres, alphanumeric + espaços
- **Room ID**: UUID v4, validação no backend

**Future Authentication (v2+):**

- **Method**: JWT-based authentication
- **Provider**: Auth0, Supabase Auth, ou implementação custom
- **Use Case**: Accounts para salvar retrospectivas, histórico

### API & Communication Patterns

**Decision: Hybrid REST + WebSocket**

**REST API (Spring MVC):**

- **Purpose**: Criação de salas, operações one-time
- **Endpoints**:
  ```
  POST   /api/rooms          # Criar sala
  GET    /api/rooms/{id}     # Detalhes da sala (opcional, pode vir via WS)
  ```
- **Response Format**: JSON
- **Error Handling**: @ControllerAdvice para exceptions globais

**WebSocket/STOMP (Spring WebSocket):**

- **Purpose**: Real-time collaboration (cards, participants, presence)
- **Protocol**: STOMP over SockJS/WebSocket
- **Message Broker**: SimpleBroker (in-memory, suficiente para MVP)
- **Topics**:
  ```
  /topic/room/{roomId}/cards        # Card updates
  /topic/room/{roomId}/participants # Participant join/leave
  /app/room/{roomId}/card/create    # Client → Server
  /app/room/{roomId}/card/update    # Client → Server
  /app/room/{roomId}/card/delete    # Client → Server
  ```

**Message Format (STOMP):**

```typescript
// Frontend → Backend
{
  type: 'CARD_CREATE' | 'CARD_UPDATE' | 'CARD_DELETE',
  payload: {
    cardId?: string,
    content: string,
    categoryId: string,
    authorId: string
  }
}

// Backend → Frontend (broadcast)
{
  type: 'CARD_CREATED' | 'CARD_UPDATED' | 'CARD_DELETED',
  payload: Card,
  timestamp: number
}
```

**Error Handling Standards:**

**Frontend:**
- Error Boundaries para erros de componente
- Toast notifications para erros de ação (via react-hot-toast ou similar)
- Retry logic para falhas de WebSocket (exponential backoff)

**Backend:**
```java
@ControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(RoomNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleRoomNotFound(RoomNotFoundException ex) {
        return ResponseEntity.status(404).body(new ErrorResponse(ex.getMessage()));
    }
}
```

**API Versioning:** Não necessário no MVP (v1 implícito)

**Rate Limiting:** Implementar no WebSocket handler (max 10 cards/segundo por participante)

### Frontend Architecture

**Decision: Feature-Based Component Organization**

**State Management:**

- **Library**: [Zustand v5.0.9](https://www.npmjs.com/package/zustand)
- **Rationale**:
  - Lightweight (~1KB), perfeito para estado real-time
  - API simples e direta
  - Excelente performance (sem re-renders desnecessários)
  - DevTools para debugging
  - Integração fácil com WebSocket
- **Store Structure**:
  ```typescript
  // stores/roomStore.ts
  interface RoomState {
    room: Room | null;
    cards: Card[];
    participants: Participant[];
    connectionStatus: 'connected' | 'disconnected' | 'connecting';

    // Actions
    setRoom: (room: Room) => void;
    addCard: (card: Card) => void;
    updateCard: (cardId: string, content: string) => void;
    deleteCard: (cardId: string) => void;
    addParticipant: (participant: Participant) => void;
    removeParticipant: (participantId: string) => void;
  }

  export const useRoomStore = create<RoomState>((set) => ({ /* ... */ }));
  ```

**Component Architecture:**

```
src/
├── features/
│   ├── room/
│   │   ├── components/
│   │   │   ├── RoomView.tsx
│   │   │   ├── CategoryColumn.tsx
│   │   │   └── ShareLink.tsx
│   │   ├── hooks/
│   │   │   ├── useRoom.ts
│   │   │   └── useWebSocket.ts
│   │   └── types.ts
│   ├── card/
│   │   ├── components/
│   │   │   ├── CardList.tsx
│   │   │   ├── CardItem.tsx
│   │   │   └── CardForm.tsx
│   │   ├── hooks/
│   │   │   └── useCardActions.ts
│   │   └── types.ts
│   └── participant/
│       ├── components/
│       │   ├── ParticipantList.tsx
│       │   └── ParticipantAvatar.tsx
│       └── types.ts
├── components/         # Shared components
│   ├── ui/            # Tailwind UI components
│   └── layout/
├── services/
│   ├── websocket.ts   # WebSocket/STOMP setup
│   └── api.ts         # REST API client
├── stores/
│   └── roomStore.ts   # Zustand store
├── hooks/             # Shared hooks
├── utils/
└── types/             # Shared types
```

**Routing:**

- **Library**: React Router v6
- **Routes**:
  ```typescript
  /                    # Home (criar sala)
  /room/:roomId        # Sala ativa
  /join/:roomId        # Entry point (pedir nome)
  ```

**Performance Optimization:**

- **Code Splitting**: React.lazy() para rotas
- **Memoization**: React.memo() para CardItem, ParticipantAvatar
- **Virtualization**: Não necessário no MVP (< 50 cards típico)
- **Bundle Optimization**: Vite automaticamente otimiza (tree-shaking, minification)

**Optimistic Updates:**

```typescript
const addCard = async (content: string, categoryId: string) => {
  const tempCard = {
    id: `temp-${Date.now()}`,
    content,
    categoryId,
    authorId: currentUser.id,
    createdAt: new Date()
  };

  // Optimistic update
  useRoomStore.getState().addCard(tempCard);

  try {
    // Send via WebSocket
    stompClient.publish({
      destination: `/app/room/${roomId}/card/create`,
      body: JSON.stringify({ content, categoryId })
    });
  } catch (error) {
    // Rollback on error
    useRoomStore.getState().deleteCard(tempCard.id);
    showError('Failed to create card');
  }
};
```

### Infrastructure & Deployment

**Frontend Deployment: Vercel**

- **Platform**: [Vercel](https://vercel.com)
- **Rationale**:
  - Otimizado para Vite/React
  - Deploy automático via Git (push to main = deploy)
  - Edge network global (CDN)
  - Preview deployments para cada PR
  - Free tier generoso
  - Zero configuração necessária
- **Build Command**: `npm run build` (Vite)
- **Output Directory**: `dist/`
- **Environment Variables**:
  ```
  VITE_API_URL=https://retro101-backend.railway.app
  VITE_WS_URL=wss://retro101-backend.railway.app/ws
  ```

**Backend Deployment: Railway**

- **Platform**: [Railway](https://railway.app)
- **Rationale**:
  - Suporte nativo Java/Maven
  - Deploy via Git push
  - CI/CD automático
  - Free tier (com limites razoáveis)
  - Fácil configuração
  - Logs e monitoring básico incluídos
- **Build**: Maven build automático
- **Start Command**: `java -jar target/retro101-backend.jar`
- **Environment Variables**:
  ```
  SPRING_PROFILES_ACTIVE=production
  ALLOWED_ORIGINS=https://retro101.vercel.app
  ```

**Environment Configuration:**

**Frontend (.env files):**
```bash
# .env.development
VITE_API_URL=http://localhost:8080
VITE_WS_URL=ws://localhost:8080/ws

# .env.production (Vercel)
VITE_API_URL=https://retro101-backend.railway.app
VITE_WS_URL=wss://retro101-backend.railway.app/ws
```

**Backend (application.yml):**
```yaml
spring:
  profiles:
    active: ${SPRING_PROFILES_ACTIVE:development}

---
spring:
  config:
    activate:
      on-profile: development

server:
  port: 8080

allowed-origins: http://localhost:5173

---
spring:
  config:
    activate:
      on-profile: production

server:
  port: ${PORT:8080}

allowed-origins: ${ALLOWED_ORIGINS}
```

**Scaling Strategy (Future):**

- **Frontend**: Vercel escala automaticamente (edge network)
- **Backend**:
  - MVP: Single Railway instance suficiente
  - v2: Horizontal scaling com Redis para sessões compartilhadas
  - v3: Load balancer + múltiplas instâncias + PostgreSQL

**Monitoring & Logging:**

- **MVP**:
  - Vercel Analytics (básico, free)
  - Railway Logs (stdout/stderr)
  - Console.log no frontend (desenvolvimento)
- **Future**:
  - Sentry para error tracking
  - DataDog/New Relic para APM
  - Structured logging (Logstash)

### Testing Strategy

**Frontend Testing:**

**Unit & Component Tests:**
- **Framework**: [Vitest](https://vitest.dev/) (integração nativa com Vite)
- **Library**: React Testing Library
- **Coverage Target**: 70%+ para componentes core
- **Run**: `npm run test`

**E2E Tests:**
- **Framework**: [Playwright 1.57.0](https://playwright.dev/docs/release-notes)
- **Browsers**: Chromium, Firefox, WebKit
- **Scenarios**:
  - Criar sala e compartilhar link
  - Entrar em sala existente
  - Criar, editar, deletar cards
  - Sincronização real-time entre múltiplos participantes
- **Run**: `npx playwright test`

**Backend Testing:**

**Unit Tests:**
- **Framework**: JUnit 5
- **Mocking**: Mockito
- **Coverage Target**: 80%+ para services e controllers
- **Run**: `mvn test`

**Integration Tests:**
- **Framework**: Spring Boot Test
- **WebMvc**: MockMvc para REST endpoints
- **WebSocket**: Spring WebSocket Test support
- **Test Containers**: Pode adicionar se usar PostgreSQL no futuro

**Example Test:**
```java
@SpringBootTest
@AutoConfigureMockMvc
public class RoomControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    public void testCreateRoom() throws Exception {
        mockMvc.perform(post("/api/rooms")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"categories\": [\"Good\", \"Bad\", \"Actions\"]}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").exists());
    }
}
```

**WebSocket Testing:**
```typescript
// Frontend - Playwright E2E
test('real-time card sync', async ({ page, context }) => {
  // Open room in first tab
  await page.goto('/room/test-room-id');

  // Open same room in second tab
  const secondPage = await context.newPage();
  await secondPage.goto('/room/test-room-id');

  // Create card in first tab
  await page.fill('[data-testid="card-input"]', 'Test card');
  await page.click('[data-testid="add-card-btn"]');

  // Verify card appears in second tab
  await secondPage.waitForSelector('text=Test card', { timeout: 1000 });
});
```

**Test Automation:**
- Vite: Tests run automatically em development
- CI/CD: Tests executam em cada PR (Vercel/Railway)
- Pre-commit hook: Rodar testes unitários (opcional)

### Decision Impact Analysis

**Implementation Sequence:**

1. **Setup Projects** (Parallel)
   - Frontend: Vite + React + TypeScript + Tailwind
   - Backend: Spring Boot + Maven + Spring WebSocket

2. **Core Infrastructure**
   - Backend: In-memory storage (ConcurrentHashMap)
   - Backend: WebSocket configuration (STOMP)
   - Frontend: WebSocket client service
   - Frontend: Zustand store setup

3. **Feature Development** (Sequential ou parallel)
   - Room creation (REST API + frontend)
   - WebSocket connection + participant management
   - Card CRUD via WebSocket
   - Real-time synchronization

4. **Testing**
   - Unit tests durante desenvolvimento
   - Integration tests após features completas
   - E2E tests após MVP completo

5. **Deployment**
   - Frontend → Vercel
   - Backend → Railway
   - Environment configuration
   - CORS verification

**Cross-Component Dependencies:**

1. **WebSocket ↔ State Management**
   - Zustand store recebe updates via WebSocket subscriptions
   - Actions no store publicam mensagens STOMP

2. **CORS ↔ Deployment**
   - CORS configuration depende de URLs de deployment
   - Development: localhost:5173 ↔ localhost:8080
   - Production: vercel.app ↔ railway.app

3. **Testing ↔ WebSocket**
   - E2E tests precisam simular múltiplas conexões WebSocket
   - Playwright suporta múltiplos contexts/pages

4. **In-Memory Storage ↔ Scaling**
   - Single instance limitation conhecida
   - Migração para Redis quando escalar horizontalmente

**Technology Version Matrix:**

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18+ | Frontend framework |
| TypeScript | 5.x | Type safety |
| Vite | 6.x | Build tool |
| Tailwind CSS | 3.4+ | Styling |
| Zustand | 5.0.9 | State management |
| React Router | 6.x | Routing |
| Playwright | 1.57.0 | E2E testing |
| Vitest | Latest | Unit testing |
| Java | 17+ | Backend runtime |
| Spring Boot | 3.x | Backend framework |
| Maven | 3.8+ | Build tool |
| JUnit | 5 | Backend testing |
| PostgreSQL | 16+ | Database (future) |

## Implementation Patterns & Consistency Rules

### Pattern Categories Defined

**Critical Conflict Points Identified:** 8 áreas principais onde AI agents poderiam fazer escolhas diferentes

**Purpose:** Garantir que múltiplos AI agents escrevam código compatível e consistente que funciona perfeitamente em conjunto, eliminando conflitos de implementação.

### Naming Patterns

**Backend Java (Spring Boot) Naming Conventions:**

**RULE: Follow Java standard conventions**

- **Classes**: PascalCase
  ```java
  public class RoomService { }
  public class CardController { }
  public class Room { }
  ```

- **Methods & Variables**: camelCase
  ```java
  public Room createRoom(List<String> categories) { }
  private String roomId;
  private final RoomService roomService;
  ```

- **Constants**: SCREAMING_SNAKE_CASE
  ```java
  private static final int MAX_CARDS_PER_ROOM = 50;
  private static final String DEFAULT_CATEGORY = "General";
  ```

- **Package Names**: lowercase, no underscores
  ```java
  package com.retro101.controller;
  package com.retro101.service;
  package com.retro101.model;
  ```

**Frontend TypeScript/React Naming Conventions:**

**RULE: Follow React/TypeScript standard conventions**

- **Components**: PascalCase
  ```typescript
  export function RoomView() { }
  export function CardItem() { }
  export function ParticipantAvatar() { }
  ```

- **Component Files**: Match component name exactly
  ```
  RoomView.tsx
  CardItem.tsx
  ParticipantAvatar.tsx
  ```

- **Hooks & Functions**: camelCase, hooks prefixed with 'use'
  ```typescript
  export function useRoom() { }
  export function useWebSocket() { }
  export function createCard(content: string) { }
  ```

- **Variables & Constants**: camelCase for variables, SCREAMING_SNAKE_CASE for constants
  ```typescript
  const roomId = '123';
  const participantName = 'Rafael';
  const MAX_CARD_LENGTH = 500;
  ```

- **Types & Interfaces**: PascalCase
  ```typescript
  interface Room { }
  type CardType = 'text' | 'vote';
  ```

**API Endpoint Naming Conventions:**

**RULE: RESTful plural resources with kebab-case**

- **Endpoints**: Plural nouns, kebab-case for multi-word resources
  ```
  POST   /api/rooms
  GET    /api/rooms/{roomId}
  POST   /api/rooms/{roomId}/cards
  DELETE /api/rooms/{roomId}/cards/{cardId}
  ```

- **Path Parameters**: camelCase in code, matched in URL
  ```java
  @GetMapping("/rooms/{roomId}")
  public Room getRoom(@PathVariable String roomId) { }
  ```

- **Query Parameters**: camelCase
  ```
  GET /api/rooms?includeInactive=true&maxResults=10
  ```

**JSON Field Naming Convention:**

**RULE: camelCase for all JSON fields (frontend ↔ backend)**

```json
{
  "roomId": "abc123",
  "categoryId": "cat-1",
  "authorId": "user-456",
  "createdAt": "2025-12-30T10:30:00Z"
}
```

**Spring Boot Configuration for camelCase:**
```java
// Spring Boot automatically serializes to camelCase with Jackson (default)
// No additional configuration needed
```

**WebSocket Topic & Destination Naming:**

**RULE: kebab-case for topics, hierarchical structure**

```
/topic/room/{roomId}/cards
/topic/room/{roomId}/participants
/app/room/{roomId}/card/create
/app/room/{roomId}/card/update
```

### Structure Patterns

**Frontend Project Organization:**

**RULE: Feature-based organization with shared components**

```
src/
├── features/              # Feature-based modules
│   ├── room/
│   │   ├── components/   # Room-specific components
│   │   ├── hooks/        # Room-specific hooks
│   │   └── types.ts      # Room-specific types
│   ├── card/
│   └── participant/
├── components/           # Shared/reusable components
│   ├── ui/              # UI primitives (Button, Input, etc)
│   └── layout/          # Layout components
├── services/            # API and WebSocket services
├── stores/              # Zustand stores
├── hooks/               # Shared custom hooks
├── utils/               # Utility functions
├── types/               # Shared TypeScript types
└── assets/              # Images, fonts, etc
```

**Frontend Test Location:**

**RULE: Co-located tests next to source files**

```
CardItem.tsx
CardItem.test.tsx
useRoom.ts
useRoom.test.ts
```

**Backend Project Organization:**

**RULE: Layer-based organization (Spring Boot standard)**

```
src/main/java/com/retro101/
├── controller/           # REST & WebSocket controllers
├── service/             # Business logic
├── repository/          # Data access (in-memory for MVP)
├── model/               # Domain models
├── config/              # Configuration classes
├── exception/           # Custom exceptions
└── dto/                 # Data Transfer Objects (if needed)

src/test/java/com/retro101/
├── controller/          # Controller tests (mirror structure)
├── service/            # Service tests
└── integration/        # Integration tests
```

**Backend Test Location:**

**RULE: Mirror source structure in src/test/java**

```
src/main/java/com/retro101/controller/RoomController.java
src/test/java/com/retro101/controller/RoomControllerTest.java
```

**Configuration File Organization:**

**Frontend:**
```
.env.development          # Development environment variables
.env.production          # Production environment variables
vite.config.ts           # Vite configuration
tailwind.config.js       # Tailwind configuration
tsconfig.json            # TypeScript configuration
playwright.config.ts     # Playwright E2E configuration
vitest.config.ts         # Vitest test configuration
```

**Backend:**
```
src/main/resources/
├── application.yml              # Default configuration
├── application-development.yml  # Development profile
└── application-production.yml   # Production profile
```

### Format Patterns

**API Response Formats:**

**RULE: Direct response for success, structured object for errors**

**Success Response (200, 201):**
```json
{
  "id": "abc123",
  "categories": ["Good", "Bad", "Actions"],
  "createdAt": "2025-12-30T10:30:00Z"
}
```

**Error Response (4xx, 5xx):**
```json
{
  "error": {
    "message": "Room not found",
    "code": "ROOM_NOT_FOUND",
    "status": 404,
    "timestamp": "2025-12-30T10:30:00Z"
  }
}
```

**Spring Boot Error Response DTO:**
```java
public class ErrorResponse {
    private ErrorDetail error;

    public static class ErrorDetail {
        private String message;
        private String code;
        private int status;
        private String timestamp;
    }
}
```

**Date/Time Format:**

**RULE: ISO 8601 strings in JSON, LocalDateTime in Java**

**JSON (API & WebSocket):**
```json
{
  "createdAt": "2025-12-30T10:30:00Z",
  "updatedAt": "2025-12-30T11:45:30Z"
}
```

**Java:**
```java
@JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss'Z'")
private LocalDateTime createdAt;
```

**TypeScript:**
```typescript
interface Card {
  createdAt: string; // ISO string from API
}

// Display in UI
const displayDate = new Date(card.createdAt).toLocaleString();
```

**Boolean Representation:**

**RULE: true/false (JSON boolean), not 1/0 or "true"/"false"**

```json
{
  "isActive": true,
  "hasVoted": false
}
```

**Null Handling:**

**RULE: Use null for absent values, never undefined in JSON**

```json
{
  "authorName": "Rafael",
  "avatarUrl": null
}
```

### Communication Patterns

**WebSocket Message Format:**

**RULE: Consistent message structure with type and payload**

**Client → Server:**
```typescript
interface ClientMessage {
  type: 'CARD_CREATE' | 'CARD_UPDATE' | 'CARD_DELETE';
  payload: {
    cardId?: string;
    content: string;
    categoryId: string;
    authorId: string;
  };
}
```

**Server → Clients (Broadcast):**
```typescript
interface ServerMessage {
  type: 'CARD_CREATED' | 'CARD_UPDATED' | 'CARD_DELETED' | 'PARTICIPANT_JOINED' | 'PARTICIPANT_LEFT';
  payload: Card | Participant;
  timestamp: number;
}
```

**Event Type Naming:**

**RULE: SCREAMING_SNAKE_CASE for event types**

```typescript
// Good
'CARD_CREATED'
'PARTICIPANT_JOINED'
'ROOM_UPDATED'

// Bad
'cardCreated'
'participant-joined'
'RoomUpdated'
```

**State Management Patterns (Zustand):**

**RULE: Immutable state updates, actions in the store**

```typescript
interface RoomStore {
  // State
  cards: Card[];

  // Actions (imperative naming)
  addCard: (card: Card) => void;
  updateCard: (cardId: string, updates: Partial<Card>) => void;
  deleteCard: (cardId: string) => void;
}

export const useRoomStore = create<RoomStore>((set) => ({
  cards: [],

  addCard: (card) => set((state) => ({
    cards: [...state.cards, card]  // Immutable
  })),

  updateCard: (cardId, updates) => set((state) => ({
    cards: state.cards.map(c =>
      c.id === cardId ? { ...c, ...updates } : c
    )
  })),

  deleteCard: (cardId) => set((state) => ({
    cards: state.cards.filter(c => c.id !== cardId)
  }))
}));
```

### Process Patterns

**Error Handling Patterns:**

**Frontend Error Handling:**

**RULE: Error Boundaries for component errors, toast for user actions**

```typescript
// Component-level errors
<ErrorBoundary fallback={<ErrorFallback />}>
  <RoomView />
</ErrorBoundary>

// User action errors
try {
  await createCard(content);
} catch (error) {
  toast.error('Failed to create card. Please try again.');
  console.error('Card creation failed:', error);
}
```

**Backend Error Handling:**

**RULE: @ControllerAdvice for global exception handling**

```java
@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(RoomNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleRoomNotFound(RoomNotFoundException ex) {
        ErrorResponse error = new ErrorResponse(
            "Room not found",
            "ROOM_NOT_FOUND",
            404
        );
        return ResponseEntity.status(404).body(error);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGenericError(Exception ex) {
        log.error("Unexpected error", ex);
        ErrorResponse error = new ErrorResponse(
            "Internal server error",
            "INTERNAL_ERROR",
            500
        );
        return ResponseEntity.status(500).body(error);
    }
}
```

**WebSocket Error & Retry Pattern:**

**RULE: Exponential backoff with max 5 retries**

```typescript
function connectWebSocket(roomId: string) {
  const maxRetries = 5;
  let retryCount = 0;

  const connect = () => {
    try {
      const client = createStompClient(roomId);

      client.onConnect = () => {
        retryCount = 0; // Reset on successful connection
        toast.success('Connected');
      };

      client.onStompError = (frame) => {
        console.error('WebSocket error:', frame);

        if (retryCount < maxRetries) {
          const delay = Math.pow(2, retryCount) * 1000; // Exponential backoff
          retryCount++;

          setTimeout(connect, delay);
          toast.error(`Connection lost. Retrying in ${delay/1000}s...`);
        } else {
          toast.error('Unable to connect. Please refresh the page.');
        }
      };

      client.activate();
    } catch (error) {
      console.error('Failed to create WebSocket client:', error);
    }
  };

  connect();
}
```

**Loading State Patterns:**

**RULE: Boolean flags in Zustand store, optimistic updates**

```typescript
interface RoomStore {
  isLoading: boolean;
  isConnecting: boolean;
  connectionStatus: 'connected' | 'disconnected' | 'connecting';
}

// Optimistic update pattern
const createCard = async (content: string) => {
  const tempCard = { id: `temp-${Date.now()}`, content, /* ... */ };

  // Immediate UI update
  addCard(tempCard);

  try {
    // Send to server
    await sendCardViaWebSocket(content);
  } catch (error) {
    // Rollback on error
    deleteCard(tempCard.id);
    toast.error('Failed to create card');
  }
};
```

**Logging Patterns:**

**Backend:**
```java
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class RoomService {
    private static final Logger log = LoggerFactory.getLogger(RoomService.class);

    public Room createRoom(List<String> categories) {
        log.info("Creating room with {} categories", categories.size());

        try {
            Room room = new Room(UUID.randomUUID().toString(), categories);
            rooms.put(room.getId(), room);

            log.info("Room created successfully: {}", room.getId());
            return room;
        } catch (Exception e) {
            log.error("Failed to create room", e);
            throw new RoomCreationException("Could not create room", e);
        }
    }
}
```

**Frontend:**
```typescript
// Development: console logs
if (import.meta.env.DEV) {
  console.log('[WebSocket] Connected to room:', roomId);
}

// Production: silent or error tracking service
if (import.meta.env.PROD && error) {
  // Send to Sentry or similar (future)
  console.error('Production error:', error);
}
```

### Enforcement Guidelines

**All AI Agents MUST:**

1. **Follow Naming Conventions**
   - Backend: Java standard (PascalCase classes, camelCase methods)
   - Frontend: React/TS standard (PascalCase components, camelCase functions)
   - JSON: camelCase fields consistently

2. **Maintain Structure Patterns**
   - Frontend: Feature-based organization, co-located tests
   - Backend: Layer-based organization, mirrored test structure

3. **Use Consistent Formats**
   - API: Direct success responses, structured error objects
   - Dates: ISO 8601 strings in JSON
   - WebSocket: type + payload structure

4. **Implement Standard Error Handling**
   - Frontend: Error Boundaries + toast notifications
   - Backend: @ControllerAdvice global handler
   - WebSocket: Exponential backoff retry (max 5 attempts)

5. **Apply Optimistic Updates**
   - Immediate UI feedback before server confirmation
   - Rollback on error with user notification

**Pattern Verification:**

- **Code Reviews**: Check against these patterns before merging
- **Linting**: ESLint (frontend), Checkstyle (backend) enforce naming
- **Testing**: Integration tests verify API response formats
- **Documentation**: Reference this architecture doc for all implementations

**Pattern Updates:**

- Propose changes via pull request to architecture.md
- Discuss with team before adopting new patterns
- Update all existing code when patterns change

### Pattern Examples

**Good Examples:**

**✅ Consistent API Response:**
```java
@PostMapping("/rooms")
public ResponseEntity<Room> createRoom(@RequestBody CreateRoomRequest request) {
    Room room = roomService.createRoom(request.getCategories());
    return ResponseEntity.status(201).body(room); // Direct response
}
```

**✅ Proper Error Handling:**
```typescript
const handleCreateCard = async (content: string) => {
  try {
    await createCard(content);
    toast.success('Card created!');
  } catch (error) {
    toast.error('Failed to create card');
    console.error('[CardForm] Create failed:', error);
  }
};
```

**✅ Immutable State Update:**
```typescript
addCard: (card) => set((state) => ({
  cards: [...state.cards, card]  // New array, not mutation
}))
```

**✅ Optimistic Update with Rollback:**
```typescript
const deleteCard = async (cardId: string) => {
  const originalCards = useRoomStore.getState().cards;

  // Optimistic delete
  useRoomStore.getState().removeCard(cardId);

  try {
    await sendDeleteViaWebSocket(cardId);
  } catch (error) {
    // Rollback
    useRoomStore.setState({ cards: originalCards });
    toast.error('Failed to delete card');
  }
};
```

**Anti-Patterns (DO NOT USE):**

**❌ Inconsistent JSON Naming:**
```json
{
  "room_id": "abc",      // snake_case
  "categoryId": "cat1"   // camelCase
}
// Pick ONE convention - we use camelCase
```

**❌ Wrapped Success Response:**
```json
{
  "data": {              // Unnecessary wrapper
    "id": "abc123"
  }
}
// Use direct response for success
```

**❌ Direct State Mutation:**
```typescript
addCard: (card) => {
  state.cards.push(card);  // ❌ Mutates state directly
}

// ✅ Use immutable update
addCard: (card) => set((state) => ({
  cards: [...state.cards, card]
}))
```

**❌ Generic Error Messages:**
```typescript
catch (error) {
  toast.error('Error');  // ❌ Not helpful
}

// ✅ Be specific
catch (error) {
  toast.error('Failed to create card. Please try again.');
}
```

**❌ Missing Error Logging:**
```typescript
catch (error) {
  toast.error('Failed');
  // ❌ No console.error for debugging
}

// ✅ Always log for debugging
catch (error) {
  console.error('[Component] Operation failed:', error);
  toast.error('Failed');
}
```

**❌ Inconsistent File Naming:**
```
room-view.tsx          // kebab-case
CardItem.tsx           // PascalCase
participant_avatar.tsx // snake_case

// ✅ Use PascalCase matching component name
RoomView.tsx
CardItem.tsx
ParticipantAvatar.tsx
```

## Project Structure & Boundaries

### Complete Project Directory Structure

O projeto retro101 consiste em **dois repositórios separados**: frontend e backend.

**Frontend: retro101-frontend (React + TypeScript + Vite)**

```
retro101-frontend/
├── README.md
├── package.json
├── package-lock.json
├── vite.config.ts                # Vite configuration
├── tailwind.config.js            # Tailwind CSS configuration
├── postcss.config.js             # PostCSS configuration
├── tsconfig.json                 # TypeScript configuration
├── tsconfig.node.json            # TypeScript config for Vite
├── .env.development              # Development environment variables
├── .env.production               # Production environment variables
├── .env.example                  # Environment variables template
├── .gitignore
├── .eslintrc.cjs                 # ESLint configuration
├── playwright.config.ts          # Playwright E2E configuration
├── vitest.config.ts              # Vitest unit test configuration
├── index.html                    # HTML entry point
├── public/                       # Static assets
│   ├── favicon.ico
│   └── robots.txt
├── src/
│   ├── main.tsx                  # Application entry point
│   ├── App.tsx                   # Root component with Router
│   ├── index.css                 # Global styles + Tailwind directives
│   ├── vite-env.d.ts            # Vite type definitions
│   ├── features/                 # Feature-based modules
│   │   ├── room/
│   │   │   ├── components/
│   │   │   │   ├── RoomView.tsx
│   │   │   │   ├── RoomView.test.tsx
│   │   │   │   ├── CategoryColumn.tsx
│   │   │   │   ├── CategoryColumn.test.tsx
│   │   │   │   ├── ShareLink.tsx
│   │   │   │   └── ShareLink.test.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useRoom.ts
│   │   │   │   ├── useRoom.test.ts
│   │   │   │   ├── useWebSocket.ts
│   │   │   │   └── useWebSocket.test.ts
│   │   │   └── types.ts          # Room-specific types
│   │   ├── card/
│   │   │   ├── components/
│   │   │   │   ├── CardList.tsx
│   │   │   │   ├── CardList.test.tsx
│   │   │   │   ├── CardItem.tsx
│   │   │   │   ├── CardItem.test.tsx
│   │   │   │   ├── CardForm.tsx
│   │   │   │   └── CardForm.test.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useCardActions.ts
│   │   │   │   └── useCardActions.test.ts
│   │   │   └── types.ts          # Card-specific types
│   │   ├── participant/
│   │   │   ├── components/
│   │   │   │   ├── ParticipantList.tsx
│   │   │   │   ├── ParticipantList.test.tsx
│   │   │   │   ├── ParticipantAvatar.tsx
│   │   │   │   └── ParticipantAvatar.test.tsx
│   │   │   └── types.ts          # Participant-specific types
│   │   └── home/
│   │       ├── components/
│   │       │   ├── HomePage.tsx
│   │       │   ├── HomePage.test.tsx
│   │       │   ├── CreateRoomForm.tsx
│   │       │   └── CreateRoomForm.test.tsx
│   │       └── types.ts
│   ├── components/               # Shared/reusable components
│   │   ├── ui/                  # UI primitives
│   │   │   ├── Button.tsx
│   │   │   ├── Button.test.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Input.test.tsx
│   │   │   ├── Toast.tsx
│   │   │   └── ErrorBoundary.tsx
│   │   └── layout/              # Layout components
│   │       ├── Header.tsx
│   │       └── Footer.tsx
│   ├── services/                # API and WebSocket services
│   │   ├── api.ts              # REST API client
│   │   ├── api.test.ts
│   │   ├── websocket.ts        # WebSocket/STOMP setup
│   │   └── websocket.test.ts
│   ├── stores/                  # Zustand stores
│   │   ├── roomStore.ts        # Room state management
│   │   └── roomStore.test.ts
│   ├── hooks/                   # Shared custom hooks
│   │   ├── useToast.ts
│   │   └── useLocalStorage.ts
│   ├── utils/                   # Utility functions
│   │   ├── avatarGenerator.ts  # Generate participant avatars
│   │   ├── dateFormatter.ts    # Date formatting utilities
│   │   └── validation.ts       # Input validation helpers
│   ├── types/                   # Shared TypeScript types
│   │   ├── index.ts            # Main type exports
│   │   ├── api.ts              # API request/response types
│   │   └── websocket.ts        # WebSocket message types
│   └── router/                  # React Router configuration
│       └── index.tsx           # Route definitions
├── tests/                       # E2E tests (Playwright)
│   ├── e2e/
│   │   ├── room-creation.spec.ts
│   │   ├── card-operations.spec.ts
│   │   ├── realtime-sync.spec.ts
│   │   └── participant-flow.spec.ts
│   └── fixtures/               # Test fixtures
│       └── mockData.ts
└── dist/                        # Build output (gitignored)
```

**Backend: retro101-backend (Spring Boot + Java + Maven)**

```
retro101-backend/
├── README.md
├── pom.xml                       # Maven configuration
├── .gitignore
├── .env.example                  # Environment variables template
├── src/
│   ├── main/
│   │   ├── java/com/retro101/
│   │   │   ├── Retro101Application.java   # Spring Boot main class
│   │   │   ├── controller/                # REST & WebSocket controllers
│   │   │   │   ├── RoomController.java
│   │   │   │   ├── CardWebSocketController.java
│   │   │   │   └── ParticipantWebSocketController.java
│   │   │   ├── service/                   # Business logic
│   │   │   │   ├── RoomService.java
│   │   │   │   ├── CardService.java
│   │   │   │   └── ParticipantService.java
│   │   │   ├── repository/                # Data access (in-memory)
│   │   │   │   ├── RoomRepository.java
│   │   │   │   ├── CardRepository.java
│   │   │   │   └── ParticipantRepository.java
│   │   │   ├── model/                     # Domain models
│   │   │   │   ├── Room.java
│   │   │   │   ├── Card.java
│   │   │   │   ├── Participant.java
│   │   │   │   └── Category.java
│   │   │   ├── dto/                       # Data Transfer Objects
│   │   │   │   ├── CreateRoomRequest.java
│   │   │   │   ├── CreateRoomResponse.java
│   │   │   │   ├── CardMessage.java
│   │   │   │   └── ErrorResponse.java
│   │   │   ├── config/                    # Configuration classes
│   │   │   │   ├── WebSocketConfig.java
│   │   │   │   ├── CorsConfig.java
│   │   │   │   └── JacksonConfig.java
│   │   │   ├── exception/                 # Custom exceptions
│   │   │   │   ├── RoomNotFoundException.java
│   │   │   │   ├── CardNotFoundException.java
│   │   │   │   ├── GlobalExceptionHandler.java  # @ControllerAdvice
│   │   │   │   └── RoomCreationException.java
│   │   │   └── util/                      # Utility classes
│   │   │       ├── IdGenerator.java
│   │   │       └── AvatarColorGenerator.java
│   │   └── resources/
│   │       ├── application.yml                 # Default configuration
│   │       ├── application-development.yml    # Development profile
│   │       ├── application-production.yml     # Production profile
│   │       └── logback-spring.xml            # Logging configuration
│   └── test/
│       └── java/com/retro101/
│           ├── controller/                # Controller tests
│           │   ├── RoomControllerTest.java
│           │   └── CardWebSocketControllerTest.java
│           ├── service/                   # Service tests
│           │   ├── RoomServiceTest.java
│           │   ├── CardServiceTest.java
│           │   └── ParticipantServiceTest.java
│           ├── repository/                # Repository tests
│           │   └── RoomRepositoryTest.java
│           ├── integration/               # Integration tests
│           │   ├── RoomIntegrationTest.java
│           │   └── WebSocketIntegrationTest.java
│           └── util/                      # Test utilities
│               └── TestDataBuilder.java
└── target/                                # Build output (gitignored)
```

### Architectural Boundaries

**API Boundaries:**

**REST API (Backend → Frontend):**
- **Endpoint**: `POST /api/rooms`
  - **Boundary**: HTTP REST
  - **Request**: `CreateRoomRequest` (JSON, camelCase)
  - **Response**: `Room` (JSON, camelCase, direct response)
  - **Purpose**: Create new retrospective room
  - **Lives in**: `RoomController.java`

- **Endpoint**: `GET /api/rooms/{roomId}`
  - **Boundary**: HTTP REST
  - **Response**: `Room` (JSON)
  - **Purpose**: Get room details (optional, can come via WebSocket)
  - **Lives in**: `RoomController.java`

**WebSocket API (Bidirectional):**
- **Connection Endpoint**: `/ws` (SockJS + STOMP)
  - **Boundary**: WebSocket/STOMP protocol
  - **Lives in**: `WebSocketConfig.java` (backend), `websocket.ts` (frontend)

- **Topics** (Server → Clients broadcast):
  - `/topic/room/{roomId}/cards` - Card updates
  - `/topic/room/{roomId}/participants` - Participant join/leave
  - **Message Format**: `{ type: string, payload: object, timestamp: number }`

- **Destinations** (Client → Server):
  - `/app/room/{roomId}/card/create`
  - `/app/room/{roomId}/card/update`
  - `/app/room/{roomId}/card/delete`
  - **Message Format**: `{ type: string, payload: object }`
  - **Lives in**: `CardWebSocketController.java`, `ParticipantWebSocketController.java`

**Component Boundaries:**

**Frontend Component Communication:**

1. **Feature Components ↔ Zustand Store**
   - **Boundary**: Store hooks (`useRoomStore`)
   - **Pattern**: Components subscribe to store, call actions
   - **Example**: `RoomView.tsx` → `useRoomStore()` → `addCard(card)`

2. **Features ↔ Shared Components**
   - **Boundary**: Props interface
   - **Pattern**: Props down, callbacks up
   - **Example**: `CardForm` uses `Button` (shared UI component)

3. **Features ↔ Services**
   - **Boundary**: Service functions
   - **Pattern**: Import service, call async functions
   - **Example**: `useRoom.ts` → `api.createRoom()` → `POST /api/rooms`

4. **WebSocket Service ↔ Store**
   - **Boundary**: Event subscriptions
   - **Pattern**: WebSocket listens to topics, updates store
   - **Example**: Message on `/topic/room/123/cards` → `addCard()` in store

**Backend Service Communication:**

1. **Controller ↔ Service**
   - **Boundary**: Service interface
   - **Pattern**: Controllers inject services via constructor
   - **Example**: `RoomController` → `@Autowired RoomService` → `roomService.createRoom()`

2. **Service ↔ Repository**
   - **Boundary**: Repository interface
   - **Pattern**: Services inject repositories
   - **Example**: `RoomService` → `roomRepository.save(room)`

3. **WebSocket Controller ↔ SimpMessagingTemplate**
   - **Boundary**: Spring messaging abstraction
   - **Pattern**: Inject `SimpMessagingTemplate`, broadcast to topics
   - **Example**: `cardService.createCard()` → `messagingTemplate.convertAndSend("/topic/room/123/cards", message)`

**Service Boundaries:**

**Internal Service Layers:**

- **Presentation Layer** (`controller/`)
  - Handles HTTP/WebSocket requests
  - Input validation
  - Response formatting
  - No business logic

- **Business Layer** (`service/`)
  - Business logic and rules
  - Orchestrates repositories
  - Transaction management (if needed)
  - No direct HTTP concerns

- **Data Access Layer** (`repository/`)
  - CRUD operations
  - In-memory storage (ConcurrentHashMap)
  - No business logic

**Data Boundaries:**

**In-Memory Storage (MVP):**

- **Boundary**: `ConcurrentHashMap<String, Room>`
- **Access Pattern**: Only through `RoomRepository`
- **Lives in**: `RoomRepository.java`
- **Thread-Safety**: ConcurrentHashMap ensures thread-safe access

**Future Database (PostgreSQL):**

- **Schema Boundary**: When migrated, use Spring Data JPA
- **Migration Path**: Replace in-memory repositories with JPA repositories
- **No Changes Needed**: Services remain same, only repository implementation changes

**WebSocket Session Storage:**

- **Boundary**: Spring WebSocket session management
- **Access Pattern**: Automatic by Spring WebSocket
- **Lives in**: `WebSocketConfig.java`

### Requirements to Structure Mapping

**Functional Requirements → Structure Mapping:**

**FR1-FR5: Room Management**
- **Backend**:
  - `controller/RoomController.java` - REST endpoints
  - `service/RoomService.java` - Room creation, retrieval logic
  - `repository/RoomRepository.java` - In-memory storage
  - `model/Room.java` - Room domain model
- **Frontend**:
  - `features/room/components/RoomView.tsx` - Main room display
  - `features/room/hooks/useRoom.ts` - Room state management
  - `stores/roomStore.ts` - Zustand store for room

**FR6-FR10: Category Management**
- **Backend**:
  - `model/Category.java` - Category model
  - Part of `Room.java` (categories list)
- **Frontend**:
  - `features/room/components/CategoryColumn.tsx` - Category display

**FR11-FR19: Card Management**
- **Backend**:
  - `controller/CardWebSocketController.java` - WebSocket handlers
  - `service/CardService.java` - Card CRUD logic
  - `model/Card.java` - Card domain model
- **Frontend**:
  - `features/card/components/CardList.tsx` - List cards
  - `features/card/components/CardItem.tsx` - Single card display
  - `features/card/components/CardForm.tsx` - Create/edit cards
  - `features/card/hooks/useCardActions.ts` - Card operations

**FR20-FR24: Participant Management**
- **Backend**:
  - `controller/ParticipantWebSocketController.java` - Join/leave handlers
  - `service/ParticipantService.java` - Participant logic
  - `model/Participant.java` - Participant model
- **Frontend**:
  - `features/participant/components/ParticipantList.tsx` - Show participants
  - `features/participant/components/ParticipantAvatar.tsx` - Avatar display

**FR25-FR30: Real-Time Collaboration**
- **Backend**:
  - `config/WebSocketConfig.java` - STOMP configuration
  - All WebSocket controllers
- **Frontend**:
  - `services/websocket.ts` - WebSocket client setup
  - `features/room/hooks/useWebSocket.ts` - WebSocket hook

**FR31-FR36: Interface & Accessibility**
- **Frontend**:
  - All components - keyboard navigation, ARIA, semantic HTML
  - `index.css` - Tailwind base, ensures contrast ratios
  - `components/ui/ErrorBoundary.tsx` - Error handling

**Cross-Cutting Concerns Mapping:**

**Error Handling**
- **Backend**: `exception/GlobalExceptionHandler.java` - @ControllerAdvice
- **Frontend**: `components/ui/ErrorBoundary.tsx`, `hooks/useToast.ts`

**Logging**
- **Backend**: SLF4J in all services, `logback-spring.xml` config
- **Frontend**: `console.log` in development, error tracking (future)

**Configuration**
- **Backend**: `config/` package, `application*.yml`
- **Frontend**: `.env.*` files, `vite.config.ts`

**Testing**
- **Backend**: `src/test/java/com/retro101/` mirrors main structure
- **Frontend**: Co-located `.test.tsx` files, `tests/e2e/` for Playwright

### Integration Points

**Internal Communication (Frontend):**

1. **Router → Features**
   - Route `/room/:roomId` → `RoomView.tsx`
   - Route `/` → `HomePage.tsx`

2. **WebSocket Service → Zustand Store**
   - Subscribe to `/topic/room/{roomId}/cards`
   - On message → `useRoomStore.getState().addCard(card)`

3. **Components → API Service**
   - `CreateRoomForm` → `api.createRoom()` → `POST /api/rooms`

**Internal Communication (Backend):**

1. **REST Controller → Service → Repository**
   - `RoomController.createRoom()` → `RoomService.createRoom()` → `RoomRepository.save()`

2. **WebSocket Controller → Service → Broadcast**
   - Client sends to `/app/room/123/card/create`
   - `CardWebSocketController.handleCreateCard()`
   - `CardService.createCard()`
   - Broadcast to `/topic/room/123/cards`

**External Communication:**

**Frontend ↔ Backend (REST):**
- URL: `VITE_API_URL` environment variable
- Dev: `http://localhost:8080`
- Prod: `https://retro101-backend.railway.app`
- CORS: Configured in `CorsConfig.java`

**Frontend ↔ Backend (WebSocket):**
- URL: `VITE_WS_URL` environment variable
- Dev: `ws://localhost:8080/ws`
- Prod: `wss://retro101-backend.railway.app/ws`
- CORS: Configured in `WebSocketConfig.java` (`setAllowedOrigins`)

**Data Flow:**

1. **Room Creation Flow**:
   ```
   User clicks "Create Room"
   → CreateRoomForm.tsx
   → api.createRoom()
   → POST /api/rooms
   → RoomController.createRoom()
   → RoomService.createRoom()
   → RoomRepository.save()
   → Response with Room
   → Navigate to /room/{roomId}
   ```

2. **Card Creation Flow (Real-Time)**:
   ```
   User types card content
   → CardForm.tsx
   → useCardActions.createCard()
   → Optimistic update (add to store immediately)
   → Send via WebSocket to /app/room/{roomId}/card/create
   → CardWebSocketController.handleCreateCard()
   → CardService.createCard()
   → Broadcast to /topic/room/{roomId}/cards
   → All clients receive message
   → Update Zustand store
   → Re-render CardList
   ```

3. **Participant Join Flow**:
   ```
   User enters name
   → Navigate to /room/{roomId}
   → useWebSocket.connect()
   → Connect to /ws
   → Subscribe to /topic/room/{roomId}/participants
   → Send join message to /app/room/{roomId}/participant/join
   → ParticipantWebSocketController.handleJoin()
   → ParticipantService.addParticipant()
   → Broadcast to /topic/room/{roomId}/participants
   → All clients see new participant
   ```

### File Organization Patterns

**Configuration Files:**

**Frontend:**
- **Root level**: Build and tool configs (`vite.config.ts`, `tailwind.config.js`, etc.)
- **Environment**: `.env.*` files for environment-specific variables
- **TypeScript**: `tsconfig.json` for compiler options

**Backend:**
- **Root level**: `pom.xml` for Maven dependencies and build
- **Resources**: `src/main/resources/application*.yml` for Spring profiles
- **Logging**: `src/main/resources/logback-spring.xml`

**Source Organization:**

**Frontend (`src/`):**
- **Entry**: `main.tsx` (Vite entry) → `App.tsx` (Router setup)
- **Features**: Feature-based, each feature is self-contained
- **Shared**: `components/`, `hooks/`, `utils/`, `types/` for cross-feature code
- **Services**: `services/` for external communication (API, WebSocket)
- **Stores**: `stores/` for Zustand state management

**Backend (`src/main/java/com/retro101/`):**
- **Entry**: `Retro101Application.java` (Spring Boot @SpringBootApplication)
- **Layers**: `controller/`, `service/`, `repository/`, `model/`
- **Config**: `config/` for Spring configuration classes
- **Cross-cutting**: `exception/`, `util/`, `dto/`

**Test Organization:**

**Frontend:**
- **Unit/Component**: Co-located `.test.tsx` next to source files
- **E2E**: Separate `tests/e2e/` directory for Playwright tests
- **Fixtures**: `tests/fixtures/` for test data

**Backend:**
- **Mirror Structure**: `src/test/java/com/retro101/` mirrors `src/main/java/com/retro101/`
- **Test Types**: `controller/`, `service/`, `repository/` for unit tests, `integration/` for integration tests
- **Utilities**: `util/TestDataBuilder.java` for test data creation

**Asset Organization:**

**Frontend:**
- **Static**: `public/` for static files (favicon, robots.txt)
- **Dynamic**: `src/assets/` for images, fonts imported in code (if needed)
- **Build Output**: `dist/` (gitignored) for production build

**Backend:**
- **Resources**: `src/main/resources/` for non-code files
- **Build Output**: `target/` (gitignored) for compiled classes and JAR

### Development Workflow Integration

**Development Server Structure:**

**Frontend Development:**
```bash
cd retro101-frontend
npm install
npm run dev  # Vite dev server on http://localhost:5173
```
- **HMR**: Vite provides instant hot module replacement
- **Environment**: Uses `.env.development`
- **Proxy**: Configure in `vite.config.ts` if needed for API calls

**Backend Development:**
```bash
cd retro101-backend
mvn spring-boot:run  # Spring Boot on http://localhost:8080
```
- **Hot Reload**: Spring Boot DevTools (optional dependency)
- **Environment**: Uses `application-development.yml` profile
- **CORS**: Allows `http://localhost:5173` in development

**Build Process Structure:**

**Frontend Build:**
```bash
npm run build  # Vite builds to dist/
```
- **Output**: `dist/` contains optimized static files
- **Process**: TypeScript compilation + Vite bundling + Tailwind purging
- **Optimization**: Tree-shaking, minification, code splitting

**Backend Build:**
```bash
mvn clean package  # Maven builds to target/
```
- **Output**: `target/retro101-backend.jar` (executable JAR)
- **Process**: Compile → Test → Package
- **Includes**: All dependencies bundled (fat JAR)

**Deployment Structure:**

**Frontend Deployment (Vercel):**
- **Source**: Git repository (main branch)
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Environment Variables**: Set in Vercel dashboard
- **Result**: Static files served via Vercel CDN

**Backend Deployment (Railway):**
- **Source**: Git repository (main branch)
- **Build**: Railway detects Maven, runs `mvn package`
- **Start Command**: `java -jar target/retro101-backend.jar`
- **Environment Variables**: Set in Railway dashboard
- **Result**: Spring Boot app running on Railway infrastructure

## Architecture Validation Results

### Coherence Validation ✅

**Decision Compatibility:**

Todas as decisões tecnológicas trabalham perfeitamente em conjunto:

- **Frontend Stack**: React 18+ ↔ TypeScript 5.x ↔ Vite 6.x formam trio otimizado e moderno
- **Styling**: Tailwind CSS 3.4+ integra nativamente com Vite via PostCSS
- **State Management**: Zustand 5.0.9 totalmente compatível com React 18 hooks
- **Routing**: React Router 6.x alinhado com React 18 concurrent features
- **Backend Stack**: Spring Boot 3.x ↔ Java 17+ ↔ Maven 3.8+ = Stack enterprise robusta
- **Real-Time**: Spring WebSocket + STOMP.js/SockJS = Integração padrão amplamente testada
- **Testing**: Vitest (Vite-native) + Playwright 1.57.0 (frontend), JUnit 5 (backend)
- **Deployment**: Vercel (otimizado para Vite) + Railway (suporte nativo Java/Maven)

**Nenhum conflito de versões ou incompatibilidades identificadas.**

**Pattern Consistency:**

Todos os padrões de implementação suportam as decisões arquiteturais:

- **Naming Conventions** alinhadas com tecnologias:
  - Backend: Java standard (PascalCase classes, camelCase methods, SCREAMING_SNAKE_CASE constants)
  - Frontend: React/TS standard (PascalCase components, camelCase functions/hooks)
  - JSON API: camelCase consistente (Spring Boot Jackson default)

- **Structure Patterns** seguem best practices:
  - Frontend: Feature-based organization (React best practice para escalabilidade)
  - Backend: Layer-based organization (Spring Boot standard)
  - Tests: Co-located (frontend), mirrored structure (backend)

- **Communication Patterns** consistentes:
  - API REST: Direct success response, structured error object
  - WebSocket: `{ type: string, payload: object, timestamp: number }` format
  - State Management: Immutable updates via Zustand

- **Error Handling** em camadas:
  - Frontend: ErrorBoundary (component errors) + toast (user action errors)
  - Backend: @ControllerAdvice (global exception handling)
  - WebSocket: Exponential backoff retry (max 5 attempts)

**Padrões são abrangentes, consistentes e previnem conflitos entre AI agents.**

**Structure Alignment:**

A estrutura do projeto suporta perfeitamente todas as decisões arquiteturais:

- **Frontend Structure** habilita feature-based development com isolamento claro
- **Backend Structure** separa concerns via layers (controller → service → repository → model)
- **WebSocket Integration** tem pontos de integração bem definidos:
  - Backend: `WebSocketConfig.java` + `CardWebSocketController.java`
  - Frontend: `services/websocket.ts` + `hooks/useWebSocket.ts`
- **State Management** integrado via Zustand:
  - Store: `stores/roomStore.ts`
  - Consumption: `useRoomStore()` hook em qualquer feature
- **Testing Infrastructure** alinhada com structure patterns:
  - Frontend: Co-located `.test.tsx` files
  - Backend: `src/test/` mirrors `src/main/` structure
- **Deployment** suporta CI/CD:
  - Vercel: `dist/` output from `npm run build`
  - Railway: `target/*.jar` from `mvn package`

**Estrutura e decisões estão perfeitamente alinhadas.**

### Requirements Coverage Validation ✅

**Functional Requirements Coverage (36/36):**

**FR1-FR5: Room Management** ✅
- Arquiteturalmente suportado por:
  - Backend: `RoomController.java`, `RoomService.java`, `RoomRepository.java` (in-memory ConcurrentHashMap)
  - Frontend: `features/room/components/RoomView.tsx`, `hooks/useRoom.ts`, `stores/roomStore.ts`
  - API: `POST /api/rooms`, `GET /api/rooms/{roomId}`
  - Shareable links via URL routing (`/room/{roomId}`)

**FR6-FR10: Category Management** ✅
- Arquiteturalmente suportado por:
  - Backend: `model/Category.java`, part of `Room.java` (categories list)
  - Frontend: `features/room/components/CategoryColumn.tsx`
  - Categories fixas durante retrospectiva (immutable após criação)

**FR11-FR19: Card CRUD & Real-Time Sync** ✅
- Arquiteturalmente suportado por:
  - Backend: `CardWebSocketController.java`, `CardService.java`, `model/Card.java`
  - Frontend: `features/card/components/CardList.tsx`, `CardItem.tsx`, `CardForm.tsx`
  - WebSocket: `/app/room/{roomId}/card/create|update|delete` (client → server)
  - Broadcast: `/topic/room/{roomId}/cards` (server → clients)
  - Real-time sync: Optimistic updates + WebSocket broadcast

**FR20-FR24: Participant Management** ✅
- Arquiteturalmente suportado por:
  - Backend: `ParticipantWebSocketController.java`, `ParticipantService.java`, `model/Participant.java`
  - Frontend: `features/participant/components/ParticipantList.tsx`, `ParticipantAvatar.tsx`
  - Avatar generation: `utils/avatarGenerator.ts`
  - WebSocket session tracking via Spring WebSocket

**FR25-FR30: Real-Time Collaboration** ✅
- Arquiteturalmente suportado por:
  - Backend: `config/WebSocketConfig.java` (STOMP over SockJS)
  - Frontend: `services/websocket.ts`, `hooks/useWebSocket.ts`
  - Heartbeat: `heartbeatIncoming: 4000, heartbeatOutgoing: 4000`
  - Reconnection: `reconnectDelay: 5000` com exponential backoff
  - 5-10 users: In-memory storage suficiente, SimpleBroker adequado

**FR31-FR36: Interface & Accessibility** ✅
- Arquiteturalmente suportado por:
  - Semantic HTML: React components com JSX semântico
  - Keyboard navigation: Todos os componentes UI
  - Contrast 4.5:1: Tailwind CSS defaults + custom theme
  - ARIA: `components/ui/` primitives com ARIA attributes
  - Responsive: Tailwind responsive classes (mobile-first ou desktop-first)
  - Browser compatibility: Modern ES features via Vite, no IE

**Non-Functional Requirements Coverage (20/20):**

**NFR1-NFR4: Performance** ✅
- **< 200ms user actions**: Optimistic updates (immediate UI feedback)
- **< 500ms real-time sync**: WebSocket low-latency, optimized message payloads
- **< 2s initial load**: Vite optimization (code splitting, tree-shaking, minification), lazy loading via React.lazy()
- **Optimized bundle**: Tailwind JIT mode, Vite automatic chunking

**NFR5-NFR8: Reliability** ✅
- **30-60min stability**: Stateless backend design, ephemeral rooms
- **Auto-reconnection**: WebSocket client reconnectDelay with exponential backoff (max 5 retries)
- **Eventual consistency**: Broadcast to all clients, Zustand state reconciliation
- **Graceful degradation**: Error boundaries (frontend), @ControllerAdvice (backend), toast notifications

**NFR9-NFR11: Scalability** ✅
- **5-10 users per room**: ConcurrentHashMap in-memory storage, SimpleBroker sufficient
- **Up to 15 users**: Acceptable degradation strategy documented
- **Multiple concurrent rooms**: Stateless service layer, rooms isolated by roomId
- **50 cards per room**: No virtualization needed (< 50 typical), can add react-window later if needed

**NFR12-NFR15: Usability** ✅
- **< 60s room creation**: Simple `POST /api/rooms` + navigate to `/room/{roomId}`
- **< 30s first contribution**: WebSocket auto-connect, immediate card creation
- **Zero documentation**: Self-explanatory UI via Tailwind clean design, toast feedback
- **Intentional simplicity**: Minimalist architecture, no over-engineering

**NFR16-NFR19: Accessibility** ✅
- **Full keyboard navigation**: All UI components keyboard-accessible
- **4.5:1 contrast**: Tailwind default palette meets WCAG AA
- **Semantic HTML + ARIA**: React components with proper semantics, ARIA live regions for real-time updates
- **Responsive**: Tailwind responsive utilities, mobile/tablet/desktop support

**NFR20: Browser Compatibility** ✅
- **Latest 2 versions**: Chrome, Firefox, Safari, Edge (via Vite modern build)
- **Mobile browsers**: Safari iOS, Chrome Android
- **Graceful degradation**: Feature detection, fallbacks for older browsers

**Todos os requisitos (36 FRs + 20 NFRs) possuem suporte arquitetural completo.**

### Implementation Readiness Validation ✅

**Decision Completeness:**

Todas as decisões críticas estão documentadas com versões específicas verificadas:

- ✅ **Technology Versions Verified**: Zustand 5.0.9 (latest), Playwright 1.57.0 (latest), todas as versões confirmadas via web search
- ✅ **Initialization Commands Provided**: Vite template setup, Tailwind installation, WebSocket libraries
- ✅ **Configuration Examples Included**:
  - Frontend: `vite.config.ts`, `tailwind.config.js`, `.env.*` files
  - Backend: `application*.yml` profiles, `WebSocketConfig.java`, `CorsConfig.java`
- ✅ **Deployment Strategy Complete**:
  - Vercel (frontend): Build command, output dir, env vars
  - Railway (backend): Maven build, start command, env vars
  - CORS configuration for both development and production

**Structure Completeness:**

A estrutura do projeto está 100% definida e específica:

- ✅ **Complete Directory Trees**: Frontend (72 files/dirs mapped), Backend (48 files/dirs mapped)
- ✅ **All Files Defined**: Every controller, service, repository, component, hook documented
- ✅ **Integration Points Specified**:
  - REST: `POST /api/rooms`, `GET /api/rooms/{roomId}`
  - WebSocket Topics: `/topic/room/{roomId}/cards`, `/topic/room/{roomId}/participants`
  - WebSocket Destinations: `/app/room/{roomId}/card/{action}`
- ✅ **Component Boundaries Clear**:
  - Frontend: Features ↔ Zustand Store, Features ↔ Services, WebSocket ↔ Store
  - Backend: Controller ↔ Service ↔ Repository, WebSocket Controller ↔ SimpMessagingTemplate

**Pattern Completeness:**

8 categorias de padrões identificadas e completamente especificadas:

1. ✅ **Naming Patterns**: Java standard, React/TS standard, API endpoints (plural, kebab-case), JSON (camelCase), WebSocket topics, event types (SCREAMING_SNAKE_CASE)
2. ✅ **Structure Patterns**: Feature-based (frontend), layer-based (backend), test locations (co-located vs mirrored), config file organization
3. ✅ **Format Patterns**: API responses (direct success, structured errors), date/time (ISO 8601), booleans (true/false), null handling
4. ✅ **Communication Patterns**: WebSocket messages (type + payload), event naming, Zustand state management (immutable updates)
5. ✅ **Process Patterns**: Error handling (ErrorBoundary + toast, @ControllerAdvice), WebSocket retry (exponential backoff, max 5), loading states (optimistic updates)
6. ✅ **Examples Provided**: Good examples for every pattern category
7. ✅ **Anti-Patterns Documented**: 6 anti-patterns with explanations (inconsistent naming, wrapped responses, direct mutation, generic errors, etc.)
8. ✅ **Enforcement Guidelines**: Code reviews, linting (ESLint, Checkstyle), integration tests, documentation reference

**Conflicts Prevented:** Todas as áreas onde AI agents poderiam fazer escolhas diferentes foram identificadas e resolvidas.

**AI agents podem implementar de forma consistente e sem conflitos.**

### Gap Analysis Results

**Critical Gaps:** ❌ NENHUM

Todas as decisões bloqueantes estão tomadas:
- ✅ Data architecture (in-memory MVP, PostgreSQL future)
- ✅ State management (Zustand)
- ✅ Backend structure (layer-based)
- ✅ Testing strategy (Vitest/Playwright, JUnit 5)
- ✅ Deployment (Vercel + Railway)
- ✅ Communication protocols (REST + WebSocket/STOMP)
- ✅ All technology versions verified

**Important Gaps:** ❌ NENHUM

Todas as decisões importantes foram endereçadas:
- ✅ Environment configuration (.env, application.yml)
- ✅ CORS configuration (development + production)
- ✅ Error handling patterns (frontend + backend)
- ✅ Logging strategy (SLF4J + Logback)
- ✅ Complete project structure defined
- ✅ All requirements mapped to files

**Nice-to-Have Gaps (Opcionais, não bloqueiam implementação):**

1. **Session Cleanup Strategy (TTL)** 📝
   - **Gap**: Estratégia específica de TTL para limpeza de salas inativas não está detalhada
   - **Impact**: Baixo - pode ser decidido durante implementação
   - **Suggestion**: Adicionar `@Scheduled` task no backend para remover salas sem atividade > 2 horas
   - **Blocks Implementation**: ❌ NÃO

2. **WebSocket Retry Formula Exata** 📝
   - **Gap**: Formula exata de exponential backoff não especificada (apenas "exponential backoff, max 5 retries")
   - **Impact**: Baixo - padrão exponencial backoff é bem conhecido
   - **Current**: `Math.pow(2, retryCount) * 1000` já documentado em patterns
   - **Blocks Implementation**: ❌ NÃO

3. **Development Tooling Recommendations** 📝
   - **Gap**: Não há recomendações de IDEs, extensões, ou ferramentas de desenvolvimento
   - **Impact**: Muito baixo - desenvolvedores podem escolher próprias ferramentas
   - **Suggestion**: VSCode + ESLint/Prettier extensions, IntelliJ IDEA para backend
   - **Blocks Implementation**: ❌ NÃO

4. **CI/CD Pipeline Details** 📝
   - **Gap**: Detalhes de configuração de CI/CD (GitHub Actions, testes automáticos em PR)
   - **Impact**: Baixo - Vercel e Railway têm CI/CD básico automático
   - **Current**: "Tests executam em cada PR (Vercel/Railway)" mencionado
   - **Blocks Implementation**: ❌ NÃO

**Nenhum gap bloqueia o início da implementação. Todos são refinamentos que podem ser adicionados progressivamente.**

### Validation Issues Addressed

**Critical Issues:** ✅ NENHUM ENCONTRADO

**Important Issues:** ✅ NENHUM ENCONTRADO

**Minor Issues:** ✅ NENHUM ENCONTRADO

**Observações Positivas:**

1. **Comprehensive Requirements Mapping**: Todos os 36 FRs e 20 NFRs foram explicitamente mapeados para componentes arquiteturais específicos
2. **Conflict Prevention**: 8 áreas de potencial conflito entre AI agents foram identificadas e resolvidas com padrões claros
3. **Technology Verification**: Versões de dependências críticas foram verificadas via web search (Zustand 5.0.9, Playwright 1.57.0)
4. **Complete Examples**: Padrões incluem tanto exemplos corretos quanto anti-padrões (o que NÃO fazer)
5. **Future-Proofing**: Migration path para PostgreSQL documentado, escalabilidade horizontal considerada
6. **Deployment Ready**: Comandos exatos de inicialização, build e deployment fornecidos

**A arquitetura está robusta, completa e pronta para guiar implementação consistente.**

### Architecture Completeness Checklist

**✅ Requirements Analysis**

- [x] Project context thoroughly analyzed (36 FRs, 20 NFRs, complexity level assessed)
- [x] Scale and complexity assessed (Médio-Baixa complexity, 6-8 components, 5-10 users/room)
- [x] Technical constraints identified (ephemeral rooms, no complex auth, browser support, real-time core)
- [x] Cross-cutting concerns mapped (real-time sync, session management, performance, error handling, responsive design, accessibility)

**✅ Starter Template Evaluation**

- [x] Primary technology domain identified (Full-Stack Web Application com Real-Time Collaboration)
- [x] Technical preferences established (React + TypeScript + Vite + Tailwind)
- [x] Starter options evaluated (Vite official template selected over community boilerplates)
- [x] Initialization commands provided (complete setup from `npm create vite` to WebSocket libraries)
- [x] Rationale documented (simplicity, control, learning objective, performance)

**✅ Architectural Decisions**

- [x] Critical decisions documented with versions (Data: in-memory ConcurrentHashMap; State: Zustand 5.0.9; Backend: layer-based; Testing: Vitest/Playwright + JUnit 5; Deployment: Vercel + Railway)
- [x] Technology stack fully specified (Frontend: React 18+, TS 5.x, Vite 6.x, Tailwind 3.4+; Backend: Java 17+, Spring Boot 3.x, Maven 3.8+)
- [x] Integration patterns defined (Hybrid REST + WebSocket/STOMP, SimpleBroker, CORS config)
- [x] Performance considerations addressed (Optimistic updates, < 200ms actions, < 500ms sync, bundle optimization)
- [x] Security decisions made (No auth in MVP, CORS, input validation, rate limiting, HTTPS in production)

**✅ Implementation Patterns**

- [x] Naming conventions established (Java standard, React/TS standard, camelCase JSON, SCREAMING_SNAKE_CASE events)
- [x] Structure patterns defined (Feature-based frontend, layer-based backend, co-located tests, mirrored test structure)
- [x] Communication patterns specified (WebSocket type + payload, Zustand immutable updates, API direct success/structured errors)
- [x] Process patterns documented (Error handling: ErrorBoundary + toast + @ControllerAdvice; Retry: exponential backoff max 5; Logging: SLF4J + console)
- [x] Examples provided (14 good examples, 6 anti-patterns with explanations)
- [x] Enforcement guidelines defined (Code reviews, ESLint/Checkstyle, integration tests)

**✅ Project Structure**

- [x] Complete directory structure defined (Frontend: 72 files/dirs, Backend: 48 files/dirs)
- [x] Component boundaries established (Frontend: Features ↔ Store ↔ Services; Backend: Controller ↔ Service ↔ Repository)
- [x] Integration points mapped (REST: /api/rooms, WebSocket: /ws, Topics: /topic/room/{id}/*, Destinations: /app/room/{id}/*)
- [x] Requirements to structure mapping complete (FR1-FR36 mapped to specific files, cross-cutting concerns assigned)

**✅ Validation**

- [x] Coherence validated (All tech choices compatible, patterns align with decisions, structure supports architecture)
- [x] Requirements coverage verified (36/36 FRs covered, 20/20 NFRs addressed)
- [x] Implementation readiness confirmed (Decisions complete, structure complete, patterns complete with examples)
- [x] Gaps identified and assessed (0 critical, 0 important, 4 nice-to-have que não bloqueiam)

### Architecture Readiness Assessment

**Overall Status:** ✅ **READY FOR IMPLEMENTATION**

**Confidence Level:** 🟢 **HIGH**

**Rationale:**
- Todas as decisões críticas foram tomadas e documentadas com versões específicas
- 100% dos requisitos (FRs e NFRs) possuem suporte arquitetural
- Estrutura completa do projeto definida com mapeamento requisito → arquivo
- Padrões abrangentes previnem conflitos entre AI agents
- Nenhum gap crítico ou importante identificado
- Exemplos e anti-padrões fornecem guidance clara
- Deployment strategy testada e comprovada (Vercel + Railway)
- Technology stack moderna, compatível e amplamente suportada

**Key Strengths:**

1. **Comprehensive Conflict Prevention**: 8 categorias de potenciais conflitos entre AI agents foram identificadas e resolvidas com padrões explícitos (naming, structure, format, communication, process)

2. **Complete Requirements Coverage**: Cada um dos 56 requisitos (36 FRs + 20 NFRs) foi mapeado para componentes arquiteturais específicos com paths exatos

3. **Technology Stack Validation**: Versões de dependências críticas foram verificadas via web search em 2025-12-30, garantindo que são latest stable versions

4. **Learning-Oriented Architecture**: Decisões priorizaram simplicidade e controle (Vite official template vs boilerplates, in-memory MVP vs database complexity) alinhado com objetivo de projeto de aprendizado

5. **Production-Ready Patterns**: Todos os padrões (error handling, retry logic, optimistic updates, WebSocket reconnection) seguem industry best practices

6. **Deployment Strategy Proven**: Vercel + Railway são plataformas testadas e confiáveis para React/Vite + Spring Boot respectivamente

7. **Future-Proof Design**: Migration path para PostgreSQL documentado, horizontal scaling strategy considerada, authentication v2 planejado

8. **Complete Data Flow Documentation**: Fluxos críticos (room creation, card CRUD real-time, participant join) documentados passo-a-passo

**Areas for Future Enhancement (Post-MVP):**

1. **Session Cleanup Automation**: Implementar `@Scheduled` task para remover salas inativas (TTL strategy)
2. **Advanced Monitoring**: Adicionar Sentry para error tracking, DataDog/New Relic para APM
3. **API Documentation**: Adicionar Swagger/OpenAPI quando API estabilizar
4. **Performance Monitoring**: Adicionar Web Vitals tracking, bundle size monitoring
5. **Horizontal Scaling**: Migrar para Redis quando precisar múltiplas instâncias backend
6. **Database Migration**: PostgreSQL + Flyway quando necessário persistir histórico
7. **Advanced CI/CD**: GitHub Actions com test automation, code coverage, automated deployments
8. **Analytics**: Adicionar user analytics (Plausible, PostHog) para entender uso

**Nenhuma dessas melhorias futuras bloqueia o início da implementação MVP.**

### Implementation Handoff

**AI Agent Guidelines:**

Ao implementar este projeto, AI agents DEVEM:

1. **Follow Architectural Decisions Exactly**
   - Use versões especificadas (React 18+, Zustand 5.0.9, Spring Boot 3.x, etc.)
   - Implementar data architecture conforme definido (ConcurrentHashMap in-memory)
   - Seguir deployment strategy (Vercel frontend, Railway backend)

2. **Use Implementation Patterns Consistently**
   - Naming: Java standard (backend), React/TS standard (frontend), camelCase JSON
   - Structure: Feature-based (frontend), layer-based (backend)
   - Error Handling: ErrorBoundary + toast (frontend), @ControllerAdvice (backend)
   - WebSocket: type + payload message format, exponential backoff retry

3. **Respect Project Structure and Boundaries**
   - Frontend: `src/features/` para feature-specific code, `src/components/` para shared
   - Backend: `controller/` → `service/` → `repository/` layers
   - Tests: Co-located `.test.tsx` (frontend), mirrored structure `src/test/` (backend)
   - Config: `.env.*` (frontend), `application*.yml` (backend)

4. **Refer to Architecture Document for Questions**
   - Uncertainty sobre naming? Consultar "Naming Patterns" section
   - Dúvida sobre API response format? Ver "Format Patterns" examples
   - WebSocket message structure? Checar "Communication Patterns"
   - Conflito de implementação? Verificar "Anti-Patterns" para o que evitar

5. **Maintain Pattern Compliance**
   - Run ESLint (frontend) e Checkstyle (backend) antes de commitar
   - Write tests seguindo test location patterns
   - Log errors apropriadamente (SLF4J backend, console.error frontend)
   - Implement optimistic updates para ações de usuário

**First Implementation Priority:**

```bash
# Step 1: Initialize Frontend Project
npm create vite@latest retro101-frontend -- --template react-ts
cd retro101-frontend
npm install
npm install -D tailwindcss@^3.4 postcss@^8 autoprefixer@^10
npx tailwindcss init -p
npm install @stomp/stompjs sockjs-client react-stomp-hooks
npm install zustand
npm install clsx tailwind-merge
npm install react-router-dom

# Configure Tailwind (tailwind.config.js, index.css)
# Configure Vite (vite.config.ts)
# Setup environment variables (.env.development, .env.production)

# Step 2: Initialize Backend Project (Parallel)
# Use Spring Initializr or manual Maven project
# Dependencies: Spring Boot 3.x, Spring Web, Spring WebSocket, Lombok
# Configure application.yml profiles
# Setup WebSocketConfig.java, CorsConfig.java

# Step 3: Implement Core Infrastructure
# Backend: RoomRepository (ConcurrentHashMap), RoomService, RoomController
# Frontend: Zustand roomStore, api.ts service, websocket.ts service

# Step 4: Develop Features (Story by Story)
# Following Requirements to Structure Mapping in architecture.md
```

**Sequence de Implementação Recomendada:**

1. ✅ **Project Setup** (Frontend + Backend initialization)
2. ✅ **Core Infrastructure** (In-memory storage, WebSocket config, Zustand store)
3. ✅ **Room Creation** (FR1-FR5: REST API + frontend form)
4. ✅ **WebSocket Connection** (FR25-FR30: Connect, heartbeat, reconnection)
5. ✅ **Participant Management** (FR20-FR24: Join, avatar, participant list)
6. ✅ **Card CRUD Real-Time** (FR11-FR19: Create, edit, delete cards via WebSocket)
7. ✅ **Category Display** (FR6-FR10: Show categories, assign cards to categories)
8. ✅ **Testing** (Unit tests durante features, integration tests, E2E após MVP)
9. ✅ **Deployment** (Vercel + Railway setup, environment variables, CORS verification)

**Refer to this architecture document throughout implementation for all architectural decisions and patterns.**

## Architecture Completion Summary

### Workflow Completion

**Architecture Decision Workflow:** COMPLETED ✅
**Total Steps Completed:** 8
**Date Completed:** 2025-12-30
**Document Location:** output-files/planning-artifacts/architecture.md

### Final Architecture Deliverables

**📋 Complete Architecture Document**

- All architectural decisions documented with specific versions
- Implementation patterns ensuring AI agent consistency
- Complete project structure with all files and directories
- Requirements to architecture mapping
- Validation confirming coherence and completeness

**🏗️ Implementation Ready Foundation**

- 15+ architectural decisions made (Data, State, Backend Structure, Testing, Deployment, API patterns, Security, etc.)
- 8 implementation pattern categories defined (Naming, Structure, Format, Communication, Process)
- 8 architectural components specified (Room, Category, Card, Participant, WebSocket Hub, State Sync, Session, REST Gateway)
- 56 requirements fully supported (36 FRs + 20 NFRs)

**📚 AI Agent Implementation Guide**

- Technology stack with verified versions (React 18+, Zustand 5.0.9, Spring Boot 3.x, Playwright 1.57.0)
- Consistency rules that prevent implementation conflicts
- Project structure with clear boundaries (120+ files/directories mapped)
- Integration patterns and communication standards

### Implementation Handoff

**For AI Agents:**
This architecture document is your complete guide for implementing retro101. Follow all decisions, patterns, and structures exactly as documented.

**First Implementation Priority:**

```bash
# Step 1: Initialize Frontend Project
npm create vite@latest retro101-frontend -- --template react-ts
cd retro101-frontend
npm install
npm install -D tailwindcss@^3.4 postcss@^8 autoprefixer@^10
npx tailwindcss init -p
npm install @stomp/stompjs sockjs-client react-stomp-hooks
npm install zustand
npm install clsx tailwind-merge
npm install react-router-dom
```

**Development Sequence:**

1. Initialize project using documented starter template (Vite React-TS + Tailwind)
2. Set up development environment per architecture (.env files, configs)
3. Implement core architectural foundations (RoomRepository, Zustand store, WebSocket config)
4. Build features following established patterns (Room creation → WebSocket → Participants → Cards)
5. Maintain consistency with documented rules (naming, structure, error handling)

### Quality Assurance Checklist

**✅ Architecture Coherence**

- [x] All decisions work together without conflicts
- [x] Technology choices are compatible (React 18 + TS 5 + Vite 6, Spring Boot 3 + Java 17)
- [x] Patterns support the architectural decisions (Feature-based, layer-based, optimistic updates)
- [x] Structure aligns with all choices (Frontend feature modules, backend layers)

**✅ Requirements Coverage**

- [x] All functional requirements are supported (36/36 FRs mapped to specific files)
- [x] All non-functional requirements are addressed (20/20 NFRs architecturally supported)
- [x] Cross-cutting concerns are handled (Real-time sync, session mgmt, performance, errors, accessibility)
- [x] Integration points are defined (REST API, WebSocket topics/destinations, data flow)

**✅ Implementation Readiness**

- [x] Decisions are specific and actionable (Exact versions, commands, config examples)
- [x] Patterns prevent agent conflicts (8 conflict areas identified and resolved)
- [x] Structure is complete and unambiguous (All files and directories mapped)
- [x] Examples are provided for clarity (14 good examples, 6 anti-patterns)

### Project Success Factors

**🎯 Clear Decision Framework**
Every technology choice was made collaboratively with clear rationale, ensuring all stakeholders understand the architectural direction.

**🔧 Consistency Guarantee**
Implementation patterns and rules ensure that multiple AI agents will produce compatible, consistent code that works together seamlessly.

**📋 Complete Coverage**
All project requirements are architecturally supported, with clear mapping from business needs to technical implementation.

**🏗️ Solid Foundation**
The chosen starter template (Vite official React-TS) and architectural patterns (Zustand, Spring WebSocket, optimistic updates) provide a production-ready foundation following current best practices.

---

**Architecture Status:** READY FOR IMPLEMENTATION ✅

**Next Phase:** Begin implementation using the architectural decisions and patterns documented herein.

**Document Maintenance:** Update this architecture when major technical decisions are made during implementation.
