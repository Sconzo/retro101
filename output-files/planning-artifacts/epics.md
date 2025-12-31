---
stepsCompleted: ['step-01-validate-prerequisites', 'step-02-design-epics', 'step-03-create-stories', 'step-04-final-validation']
workflowStatus: 'complete'
completedAt: '2025-12-31'
inputDocuments:
  - 'C:\Users\rspol\dev\retro101\output-files\planning-artifacts\prd.md'
  - 'C:\Users\rspol\dev\retro101\output-files\planning-artifacts\architecture.md'
  - 'C:\Users\rspol\dev\retro101\output-files\planning-artifacts\ux-design-specification.md'
---

# retro101 - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for retro101, decomposing the requirements from the PRD, UX Design if it exists, and Architecture requirements into implementable stories.

## Requirements Inventory

### Functional Requirements

**FR1**: Facilitador pode criar uma nova sala de retrospectiva
**FR2**: Sistema gera automaticamente um link único compartilhável para cada sala criada
**FR3**: Qualquer usuário pode acessar uma sala ativa através de seu link único
**FR4**: Sala permanece ativa durante a sessão de retrospectiva
**FR5**: Sistema identifica quando usuário acessa pela primeira vez uma sala específica

**FR6**: Facilitador pode definir categorias personalizadas ao criar uma sala
**FR7**: Facilitador pode criar entre 2 e 5 categorias por sala
**FR8**: Todos os participantes podem visualizar as categorias definidas para a sala
**FR9**: Categorias permanecem fixas durante toda a retrospectiva
**FR10**: Sistema exibe nome de cada categoria de forma clara e organizada

**FR11**: Participante pode criar um novo card de texto em qualquer categoria disponível
**FR12**: Sistema associa automaticamente o nome do autor a cada card criado
**FR13**: Card exibe o nome do autor que o criou
**FR14**: Participantes podem visualizar todos os cards criados em cada categoria
**FR15**: Sistema organiza cards por categoria de forma clara
**FR16**: Qualquer participante pode editar o conteúdo de qualquer card existente
**FR17**: Qualquer participante pode excluir qualquer card existente
**FR18**: Sistema sincroniza edições de cards em tempo real para todos os participantes
**FR19**: Sistema sincroniza exclusões de cards em tempo real para todos os participantes

**FR20**: Usuário pode entrar em uma sala fornecendo apenas um nome
**FR21**: Sistema gera automaticamente um avatar para cada participante
**FR22**: Sistema identifica cada participante pelo nome fornecido
**FR23**: Participantes podem visualizar presença de outros participantes na sala
**FR24**: Facilitador entra na sala usando o mesmo processo que participantes (sem roles diferenciados)

**FR25**: Sistema sincroniza cards entre todos os participantes em tempo real
**FR26**: Card criado por um participante aparece para todos os outros participantes
**FR27**: Sistema mantém estado consistente da sala entre todos os participantes conectados
**FR28**: Sistema suporta 5-10 usuários simultâneos na mesma sala
**FR29**: Sistema tenta reconectar automaticamente se conexão WebSocket cair temporariamente
**FR30**: Sistema mantém heartbeat para detectar conexões ativas

**FR31**: Sistema fornece navegação completa por teclado para todos os elementos interativos
**FR32**: Sistema mantém contraste mínimo de 4.5:1 para texto
**FR33**: Sistema usa elementos HTML semânticos apropriados
**FR34**: Sistema fornece labels e ARIA attributes para acessibilidade básica
**FR35**: Sistema é responsivo para desktop (≥1024px), tablet (768-1023px) e mobile (≥320px)
**FR36**: Sistema funciona nas últimas 2 versões de Chrome, Firefox, Safari e Edge

### NonFunctional Requirements

**NFR1**: Ações do usuário (criar card, entrar em sala, definir categorias) devem completar em menos de 200ms em 95% dos casos. Sistema deve responder visualmente (feedback) imediatamente (<100ms) para todas as interações.

**NFR2**: Cards criados, editados ou excluídos devem aparecer para todos os participantes em menos de 500ms. Sistema deve manter latência de sincronização <500ms com até 10 usuários simultâneos na mesma sala.

**NFR3**: Sala deve carregar completamente (incluindo categorias e cards existentes) em menos de 2 segundos. Página inicial deve carregar em menos de 1 segundo.

**NFR4**: Bundle JavaScript do frontend deve ser otimizado para carregamento rápido (sem target específico de tamanho, mas manter razoável). Recursos críticos devem usar lazy loading quando apropriado.

**NFR5**: Sistema deve permanecer estável e funcional durante toda a duração típica de uma retrospectiva (30-60 minutos). Sistema deve ser acessível quando times precisam realizar retrospectivas.

**NFR6**: Sistema deve tentar reconectar automaticamente se conexão WebSocket cair temporariamente. Após reconexão bem-sucedida, sistema deve ressincronizar estado atual da sala.

**NFR7**: Todos os participantes devem ver o mesmo estado da sala (cards, categorias, participantes). Sincronização deve ser eventual consistent (tolerância a lag de rede).

**NFR8**: Se sincronização falhar, sistema deve informar usuário claramente. Sistema não deve crashar com erros de rede ou conexão - deve degradar gracefully.

**NFR9**: Sistema deve suportar 5-10 usuários simultâneos na mesma sala sem degradação perceptível de performance. Sistema deve funcionar corretamente (ainda que mais lento) com até 15 usuários por sala.

**NFR10**: Sistema deve suportar múltiplas salas ativas simultaneamente. Número de salas limitado apenas por recursos de servidor (definido no deployment).

**NFR11**: Performance mantida com até 50 cards por sala (cenário típico de retrospectiva). Degradação aceitável com até 100 cards por sala.

**NFR12**: Facilitador deve conseguir criar sala completa (incluindo categorias) em menos de 60 segundos. Fluxo de criação de sala deve ser intuitivo sem necessidade de tutorial.

**NFR13**: Participante deve conseguir entrar na sala e criar primeiro card em menos de 30 segundos do clique no link. Entrada na sala deve ser intuitiva sem necessidade de instruções.

**NFR14**: Usuários novos devem conseguir usar funcionalidades core (criar card, visualizar cards) sem consultar documentação. Interface deve ser autoexplicativa através de labels claros e feedback visual.

**NFR15**: Interface deve apresentar apenas opções essenciais - evitar sobrecarga cognitiva. Cada tela deve ter propósito único e claro.

**NFR16**: Todos os elementos interativos devem ser acessíveis via teclado (Tab, Enter, Escape). Sistema não deve ter "keyboard traps" que prendem o usuário.

**NFR17**: Texto deve ter contraste mínimo de 4.5:1 (WCAG AA para texto normal). Elementos interativos devem ter contraste mínimo de 3:1.

**NFR18**: Sistema deve usar elementos HTML semânticos apropriados (button, input, header, main). Sistema deve fornecer ARIA labels onde necessário. Live regions (aria-live) devem anunciar novos cards para screen readers.

**NFR19**: Sistema deve funcionar em desktop (≥1024px), tablet (768-1023px) e mobile (≥320px). Layout deve adaptar-se apropriadamente para cada breakpoint.

**NFR20**: Sistema deve funcionar corretamente nas últimas 2 versões de Chrome, Firefox, Safari e Edge. Sistema deve funcionar em Safari iOS e Chrome Android (últimas 2 versões). Funcionalidade core deve ser mantida mesmo se APIs específicas não forem suportadas (graceful degradation).

### Additional Requirements

#### Requisitos de Arquitetura e Tecnologia

**Starter Template e Stack:**
- Usar Vite Official React-TS template como base do frontend
- TypeScript 5.x com strict mode enabled
- React 18+ com hooks e concurrent features
- Tailwind CSS 3.4+ para styling (utility-first)
- Zustand v5.0.9 para state management
- WebSocket libraries: @stomp/stompjs, sockjs-client, react-stomp-hooks

**API e Comunicação:**
- API híbrida: REST (Spring MVC) para criação de salas + WebSocket/STOMP para real-time
- Endpoints REST: POST /api/rooms (criar sala), GET /api/rooms/{id} (detalhes)
- WebSocket Topics:
  - /topic/room/{roomId}/cards (card updates broadcast)
  - /topic/room/{roomId}/participants (participant join/leave)
  - /app/room/{roomId}/card/create|update|delete (client → server)
- Message format STOMP com type e payload estruturados
- Rate limiting: máximo 10 cards/segundo por participante no WebSocket handler
- Error handling: @ControllerAdvice para exceptions globais no backend

**Deployment e Infraestrutura:**
- Frontend: Deploy no Vercel (otimizado para Vite/React, deploy automático via Git)
- Backend: Deploy no Railway (suporte Java/Maven, CI/CD automático)
- Environment variables:
  - Frontend: VITE_API_URL, VITE_WS_URL
  - Backend: SPRING_PROFILES_ACTIVE, ALLOWED_ORIGINS
- CORS configurado corretamente entre frontend e backend
- Profiles Spring: development (localhost:8080) e production (Railway)

#### Requisitos de UX e Interação

**Animações e Motion:**
- Card entrance: Subtle fade-in + scale (200ms)
- Hover states: Quick transitions (100ms)
- Modal open/close: Fade + slide (150ms)
- Suporte a prefers-reduced-motion (desabilitar animações para usuários sensíveis)
- Todas as animações devem respeitar a preferência do usuário

**Keyboard Navigation:**
- Keyboard shortcuts: Alt+1 até Alt+5 para focar categorias rapidamente
- Focus trap em modais (Escape para fechar)
- Tab navigation funcional em todos os elementos interativos
- Indicadores visuais de foco em todos os elementos

**Error Handling e Feedback:**
- Error Boundaries para erros de componente no frontend
- Toast notifications para erros de ação do usuário (react-hot-toast ou similar)
- Retry logic para falhas de WebSocket com exponential backoff
- Mensagens de erro claras e em linguagem humana

**Accessibility Testing Requirements:**
- Lighthouse accessibility score ≥90 obrigatório antes do lançamento
- Automated testing: axe DevTools, WAVE, eslint-plugin-jsx-a11y
- Manual testing: keyboard navigation completa, screen reader (NVDA/JAWS), contraste visual
- Inputs com labels visíveis, error messages com aria-describedby
- Suporte a high contrast mode

### FR Coverage Map

**Epic 1: Room Creation & Participant Access**
- FR1: Facilitador pode criar uma nova sala de retrospectiva
- FR2: Sistema gera automaticamente um link único compartilhável para cada sala criada
- FR3: Qualquer usuário pode acessar uma sala ativa através de seu link único
- FR4: Sala permanece ativa durante a sessão de retrospectiva
- FR5: Sistema identifica quando usuário acessa pela primeira vez uma sala específica
- FR6: Facilitador pode definir categorias personalizadas ao criar uma sala
- FR7: Facilitador pode criar entre 2 e 5 categorias por sala
- FR8: Todos os participantes podem visualizar as categorias definidas para a sala
- FR9: Categorias permanecem fixas durante toda a retrospectiva
- FR10: Sistema exibe nome de cada categoria de forma clara e organizada
- FR20: Usuário pode entrar em uma sala fornecendo apenas um nome
- FR21: Sistema gera automaticamente um avatar para cada participante
- FR22: Sistema identifica cada participante pelo nome fornecido
- FR23: Participantes podem visualizar presença de outros participantes na sala
- FR24: Facilitador entra na sala usando o mesmo processo que participantes (sem roles diferenciados)

**Epic 2: Real-Time Card Collaboration**
- FR11: Participante pode criar um novo card de texto em qualquer categoria disponível
- FR12: Sistema associa automaticamente o nome do autor a cada card criado
- FR13: Card exibe o nome do autor que o criou
- FR14: Participantes podem visualizar todos os cards criados em cada categoria
- FR15: Sistema organiza cards por categoria de forma clara
- FR16: Qualquer participante pode editar o conteúdo de qualquer card existente
- FR17: Qualquer participante pode excluir qualquer card existente
- FR18: Sistema sincroniza edições de cards em tempo real para todos os participantes
- FR19: Sistema sincroniza exclusões de cards em tempo real para todos os participantes
- FR25: Sistema sincroniza cards entre todos os participantes em tempo real
- FR26: Card criado por um participante aparece para todos os outros participantes
- FR27: Sistema mantém estado consistente da sala entre todos os participantes conectados
- FR28: Sistema suporta 5-10 usuários simultâneos na mesma sala
- FR29: Sistema tenta reconectar automaticamente se conexão WebSocket cair temporariamente
- FR30: Sistema mantém heartbeat para detectar conexões ativas

**Epic 3: Accessible & Responsive Polish**
- FR31: Sistema fornece navegação completa por teclado para todos os elementos interativos
- FR32: Sistema mantém contraste mínimo de 4.5:1 para texto
- FR33: Sistema usa elementos HTML semânticos apropriados
- FR34: Sistema fornece labels e ARIA attributes para acessibilidade básica
- FR35: Sistema é responsivo para desktop (≥1024px), tablet (768-1023px) e mobile (≥320px)
- FR36: Sistema funciona nas últimas 2 versões de Chrome, Firefox, Safari e Edge

**Coverage Summary:**
- Epic 1: 15 FRs (FR1-FR10, FR20-FR24)
- Epic 2: 15 FRs (FR11-FR19, FR25-FR30)
- Epic 3: 6 FRs (FR31-FR36)
- **Total: 36 FRs - 100% Coverage ✓**

## Epic List

### Epic 1: Room Creation & Participant Access

Facilitadores podem criar salas de retrospectiva completas com categorias personalizadas em menos de 60 segundos e compartilhar via link único. Participantes podem entrar instantaneamente fornecendo apenas um nome e começar a colaborar sem fricção.

**FRs covered:** FR1, FR2, FR3, FR4, FR5, FR6, FR7, FR8, FR9, FR10, FR20, FR21, FR22, FR23, FR24

**Implementation Notes:**
- Inclui setup inicial do projeto (Vite + React + TypeScript + Tailwind + Spring Boot)
- Sistema REST API para criação de salas (POST /api/rooms)
- Links únicos compartilháveis gerados automaticamente
- Categorias personalizáveis (mínimo 2, máximo 5)
- Onboarding participante: nome + avatar gerado automaticamente
- Visualização de presença na sala (lista de participantes)
- Deploy inicial: Vercel (frontend) + Railway (backend)

### Epic 2: Real-Time Card Collaboration

Participantes colaboram em tempo real criando, editando e excluindo cards que aparecem instantaneamente (menos de 500ms) para todos na sala. Sistema suporta 5-10 usuários simultâneos com sincronização consistente via WebSocket.

**FRs covered:** FR11, FR12, FR13, FR14, FR15, FR16, FR17, FR18, FR19, FR25, FR26, FR27, FR28, FR29, FR30

**Implementation Notes:**
- WebSocket/STOMP integration (Spring WebSocket + @stomp/stompjs)
- CRUD completo de cards (criar, editar, excluir) com sincronização real-time
- Zustand state management para cards e sincronização
- Topics WebSocket: /topic/room/{roomId}/cards, /app/room/{roomId}/card/*
- Reconexão automática com exponential backoff
- Heartbeat/keepalive para detectar conexões ativas
- Rate limiting: 10 cards/segundo por participante
- Optimistic updates no frontend para responsividade

### Epic 3: Accessible & Responsive Polish

Sistema totalmente acessível por teclado com navegação completa, responsivo para desktop/tablet/mobile, e utilizável por todos os usuários incluindo aqueles com necessidades especiais. Lighthouse accessibility score ≥90 obrigatório.

**FRs covered:** FR31, FR32, FR33, FR34, FR35, FR36

**Implementation Notes:**
- Navegação completa por teclado (Tab, Enter, Escape)
- Keyboard shortcuts: Alt+1 até Alt+5 para focar categorias
- Focus trap em modais, focus indicators visíveis
- Contraste mínimo 4.5:1 (WCAG AA), elementos interativos 3:1
- HTML semântico (button, input, header, main) + ARIA labels
- Live regions (aria-live) para anunciar cards novos
- Responsive design: desktop (≥1024px), tablet (768-1023px), mobile (≥320px)
- Browser support: últimas 2 versões Chrome, Firefox, Safari, Edge
- Accessibility testing: axe DevTools, WAVE, Lighthouse ≥90
- Animações com suporte a prefers-reduced-motion

---

## Epic 1: Room Creation & Participant Access

Facilitadores podem criar salas de retrospectiva completas com categorias personalizadas em menos de 60 segundos e compartilhar via link único. Participantes podem entrar instantaneamente fornecendo apenas um nome e começar a colaborar sem fricção.

### Story 1.1: Project Setup & Landing Page

As a **developer**,
I want **complete project infrastructure setup with a functional landing page**,
So that **I have the foundation to build retro101 features with proper tooling and deployment**.

**Acceptance Criteria:**

**Given** the project needs to be initialized
**When** I run the setup commands
**Then** the following must be in place:

**And** Frontend setup is complete:
- Vite + React 18+ + TypeScript 5.x project created
- Tailwind CSS 3.4+ configured with PostCSS and Autoprefixer
- Project structure follows feature-based organization
- Development server runs on localhost:5173
- ESLint and Prettier configured for code quality

**And** Backend setup is complete:
- Spring Boot 3.x project initialized with Maven
- Java 17+ configured
- Application runs on localhost:8080
- Basic CORS configuration allows frontend localhost:5173
- Profile support for development and production

**And** Landing page is functional:
- Clean, minimalist landing page with project branding
- Single prominent "Create New Room" button (centered, clear CTA)
- Responsive layout works on desktop (≥1024px)
- Page loads in <1 second (NFR3)
- Basic HTML semantic structure (header, main, button)

**And** Initial deployment works:
- Frontend deployed to Vercel successfully
- Backend deployed to Railway successfully
- Environment variables configured (VITE_API_URL, VITE_WS_URL, ALLOWED_ORIGINS)
- Production CORS allows Vercel frontend domain
- Both environments accessible via public URLs

**And** Database/State setup:
- In-memory storage solution chosen for MVP (no database needed initially)
- Room storage mechanism defined (Map/HashMap in backend)

**And** Documentation exists:
- README with setup instructions
- Environment variable examples (.env.example files)
- Basic architecture decisions documented

### Story 1.2: Create Room with Categories

As a **facilitator**,
I want **to create a new retrospective room with 2-5 custom categories**,
So that **I can prepare the room format in less than 60 seconds and share it with my team**.

**Acceptance Criteria:**

**Given** I am on the landing page
**When** I click "Create New Room"
**Then** I am taken to a room creation form

**And** Category definition interface works:
- Form displays input fields for categories
- I can add between 2 and 5 categories (validation enforced)
- Default suggestion shows example categories ("What went well", "To improve", "Action items")
- I can edit/remove categories before creating room
- Form validates that at least 2 categories are provided
- Form validates that category names are not empty
- Clear, simple UI following minimalist design principle (NFR15)

**And** Room creation API works (FR1, FR2):
- POST /api/rooms endpoint accepts category list
- Backend generates unique room ID (UUID or similar)
- Backend stores room with categories in memory
- Backend returns room object with ID and share link
- Response time <200ms (NFR1)

**And** Room entity structure:
- Room model includes: id, categories[], createdAt, active status
- Category model includes: id, name, roomId
- Rooms stored in-memory (Map<String, Room>)

**And** Share link is generated (FR2):
- Unique shareable URL created: `/room/{roomId}`
- Full URL displayed to facilitator: `https://retro101.vercel.app/room/{roomId}`
- Copy button available to copy link to clipboard
- Visual feedback confirms link copied

**And** Facilitator is redirected:
- After room creation, facilitator redirected to `/room/{roomId}`
- Room loads with defined categories visible (FR8, FR10)
- Total time from "Create New Room" click to shareable link: <60 seconds (NFR12)

**And** Error handling works:
- If room creation fails, clear error message shown
- User can retry without losing category input
- Network errors handled gracefully (NFR8)

### Story 1.3: Room Access via Unique Link

As a **participant**,
I want **to access a retrospective room by clicking a shared link**,
So that **I can join the retrospective instantly without registration or complex steps**.

**Acceptance Criteria:**

**Given** I have received a room link (e.g., `/room/{roomId}`)
**When** I click the link or paste it in my browser
**Then** the room page loads successfully

**And** Room loading works (FR3, FR4):
- GET /api/rooms/{roomId} endpoint returns room details
- Frontend fetches room data on page load
- Room data includes: id, categories[], active status
- Response time <200ms (NFR1)
- Page fully loads in <2 seconds (NFR3)

**And** Room is displayed correctly (FR8, FR10):
- All categories defined by facilitator are visible
- Categories displayed in clean, organized multi-column layout
- Each category clearly labeled with its name
- Layout is responsive for desktop (≥1024px)
- Visual design is minimal and focused (NFR15)

**And** First-time access detection works (FR5):
- System detects this is user's first visit to this specific room
- User flagged for onboarding flow (Story 1.4)
- Detection uses browser state (no backend auth needed for MVP)

**And** Active room validation:
- If room doesn't exist, show clear "Room not found" message
- If room is inactive, show "Room has ended" message
- User can navigate back to landing page to create new room

**And** Error handling:
- Network errors show clear message with retry option
- Loading states displayed while fetching room data
- Graceful degradation if partial data loads (NFR8)

**And** Browser compatibility (FR36):
- Works in latest 2 versions of Chrome, Firefox, Safari, Edge
- No console errors in supported browsers

### Story 1.4: Participant Onboarding (Name Entry)

As a **participant**,
I want **to enter my name to join a room**,
So that **I can start contributing to the retrospective in less than 30 seconds without creating an account**.

**Acceptance Criteria:**

**Given** I accessed a room for the first time (FR5 detection from Story 1.3)
**When** the room page loads
**Then** an onboarding modal appears

**And** Name entry interface works (FR20):
- Modal displays simple prompt: "Enter your name to join"
- Single text input field for name (labeled clearly)
- Input has focus automatically (keyboard ready)
- "Join Room" button to submit
- Minimal design - no unnecessary fields or distractions (NFR15)

**And** Name validation works:
- Name must not be empty (client-side validation)
- Name trimmed of whitespace
- Name length: 1-50 characters
- Clear error message if validation fails
- No special characters validation needed for MVP

**And** Participant identification works (FR22, FR24):
- Participant object created with: id, name, roomId, joinedAt
- Participant stored in room's participants list
- Facilitator uses same process (no special roles in MVP)
- Backend endpoint: POST /api/rooms/{roomId}/participants

**And** Modal dismissal and room entry:
- After successful name submission, modal closes
- Participant now "in" the room
- Categories visible and ready for interaction
- Time from link click to first card creation: <30 seconds (NFR13)

**And** Participant persistence:
- Participant data stored in browser (localStorage)
- Returning to same room doesn't require re-entry
- Participant can clear data manually if needed

**And** Error handling:
- Network errors show retry option
- Duplicate names allowed (no unique constraint)
- Clear feedback if join fails

**And** Accessibility (FR31, FR34):
- Modal can be navigated with keyboard (Tab, Enter)
- Input has proper label and aria attributes
- Focus trap in modal until name entered

### Story 1.5: Avatar Generation & Participant List

As a **participant**,
I want **to see my automatically generated avatar and a list of all participants in the room**,
So that **I know who is present and can identify my own contributions visually**.

**Acceptance Criteria:**

**Given** I have entered my name and joined the room (Story 1.4)
**When** the room interface loads
**Then** my avatar is visible

**And** Avatar generation works (FR21):
- System generates avatar automatically based on participant name
- Avatar uses initials from name (e.g., "Rafael Silva" → "RS")
- Avatar has consistent color generated from name hash
- Avatar size appropriate for UI context (32px for list, 24px for cards)
- No external API calls needed (deterministic, client-side generation)

**And** Participant list is displayed (FR23):
- Participant list visible in room interface (sidebar or header)
- Shows all participants currently in room
- Each participant shows: avatar + name
- List updates when new participants join
- My own participant entry highlighted/differentiated

**And** Participant list API:
- GET /api/rooms/{roomId}/participants returns all participants
- Participant list fetched when room loads
- Response includes: id, name, joinedAt for each participant

**And** Real-time updates preparation:
- Participant list component ready for WebSocket updates (Epic 2)
- Currently uses polling or manual refresh (WebSocket in Epic 2)
- List re-fetches on room focus/visibility change

**And** Visual design (FR10, NFR15):
- Participant list clean and unobtrusive
- Doesn't distract from main content (categories/cards)
- Responsive design maintains visibility on smaller screens
- Proper spacing and typography

**And** Support for 5-10 users (FR28):
- Participant list handles up to 15 participants without UI breaking
- Scrollable if participant count exceeds visible area
- Performance maintained with 10 participants

**And** Accessibility (FR31, FR33):
- Participant list uses semantic HTML (ul/li or appropriate)
- Each participant has clear text alternative
- List accessible via keyboard navigation
- Screen reader announces participant count

---

## Epic 2: Real-Time Card Collaboration

Participantes colaboram em tempo real criando, editando e excluindo cards que aparecem instantaneamente (menos de 500ms) para todos na sala. Sistema suporta 5-10 usuários simultâneos com sincronização consistente via WebSocket.

### Story 2.1: WebSocket Infrastructure & Connection Setup

As a **developer**,
I want **complete WebSocket infrastructure with STOMP protocol integration**,
So that **the foundation is in place for real-time card synchronization across all participants**.

**Acceptance Criteria:**

**Given** the project needs real-time communication
**When** I implement WebSocket infrastructure
**Then** the following must be in place:

**And** Backend WebSocket setup is complete:
- Spring WebSocket dependency added to pom.xml
- STOMP over WebSocket configured in Spring Boot
- WebSocket endpoint exposed at `/ws`
- SimpleBroker configured for in-memory message broker
- Application destinations configured with `/app` prefix
- Topic destinations configured with `/topic` prefix
- CORS configured to allow WebSocket connections from frontend

**And** Frontend WebSocket client is setup:
- @stomp/stompjs and sockjs-client dependencies installed
- react-stomp-hooks installed for React integration
- WebSocket connection utility created
- Connection URL configured via environment variable (VITE_WS_URL)

**And** Zustand state management is configured:
- Zustand store created for room state
- Store includes: cards[], connectionStatus, room, participants
- Actions defined: addCard, updateCard, deleteCard, setConnectionStatus
- Store properly typed with TypeScript interfaces

**And** WebSocket connection lifecycle works:
- Connection established when participant joins room (Story 1.4)
- Connection URL: `ws://localhost:8080/ws` (dev) or `wss://...` (prod)
- STOMP client connects to broker successfully
- Connection status tracked in Zustand: 'connecting' | 'connected' | 'disconnected'
- Connection status displayed in UI (subtle indicator)

**And** Topic subscription works:
- Client subscribes to `/topic/room/{roomId}/cards` on connection
- Subscription receives messages broadcast by backend
- Messages properly parsed and handled by frontend

**And** Message sending works:
- Client can send messages to `/app/room/{roomId}/card/create`
- Client can send messages to `/app/room/{roomId}/card/update`
- Client can send messages to `/app/room/{roomId}/card/delete`
- Backend receives messages at @MessageMapping endpoints

**And** Error handling:
- Connection errors logged and displayed to user
- Failed connection shows retry option
- WebSocket errors don't crash application

**And** Development experience:
- WebSocket connection works in development (localhost)
- Hot reload doesn't break WebSocket connection permanently
- Console logs show connection status for debugging

### Story 2.2: Create Cards in Real-Time

As a **participant**,
I want **to create cards in any category that appear instantly for all participants**,
So that **I can contribute to the retrospective and see my team's input in real-time**.

**Acceptance Criteria:**

**Given** I am in a room with categories displayed (Story 1.3)
**When** I create a new card
**Then** the card appears for all participants in less than 500ms

**And** Card creation interface works (FR11):
- Each category has an "Add Card" button (+ icon or "Add" text)
- Clicking button shows card input field inline or in modal
- Input field has clear placeholder text
- Input accepts multi-line text (textarea)
- Character limit enforced (e.g., 500 characters)
- "Save" and "Cancel" buttons available

**And** Card creation client-side works:
- User types card content and clicks "Save"
- Client creates card object: { id, content, categoryId, authorId, authorName, createdAt }
- Client generates temporary ID for optimistic update
- Card immediately appears in UI (optimistic update - NFR1)
- Client sends STOMP message to `/app/room/{roomId}/card/create`

**And** Card creation backend works (FR11, FR12):
- Backend receives message at @MessageMapping("/room/{roomId}/card/create")
- Backend validates card content (not empty, length check)
- Backend creates Card entity: id, content, categoryId, authorId, authorName, roomId, createdAt
- Backend stores card in room's cards collection (in-memory Map)
- Backend broadcasts card to `/topic/room/{roomId}/cards`
- Message type: 'CARD_CREATED' with full card payload
- Response time <200ms (NFR1)

**And** Real-time synchronization works (FR25, FR26):
- All connected clients receive broadcast message
- Clients update Zustand store with new card (addCard action)
- Card appears in correct category for all participants
- Latency from creation to appearance: <500ms (NFR2)
- Optimistic update replaced by server-confirmed card

**And** Card display works (FR13, FR14, FR15):
- Card shows author name and avatar
- Card shows content with proper formatting
- Card positioned within correct category
- Multiple cards stack/flow properly in category
- Visual design is clean and minimal (NFR15)

**And** Rate limiting works:
- Backend enforces max 10 cards/second per participant
- Exceeded rate returns error message
- Error displayed to user with clear message

**And** Support for multiple users (FR28):
- System handles 5-10 users creating cards simultaneously
- No lag or performance degradation
- Cards appear in correct order for all users

**And** Error handling:
- If WebSocket send fails, show error and retry option
- If backend validation fails, show error message
- Network errors handled gracefully (NFR8)
- Failed optimistic update rolled back with clear feedback

**And** Accessibility (FR31, FR34):
- "Add Card" button keyboard accessible
- Input field has proper label
- Screen reader announces new cards via aria-live region

### Story 2.3: Edit Cards with Real-Time Synchronization

As a **participant**,
I want **to edit any card's content with changes appearing instantly for all participants**,
So that **I can refine feedback and correct mistakes collaboratively**.

**Acceptance Criteria:**

**Given** cards exist in the room (Story 2.2)
**When** I edit a card
**Then** the edited content appears for all participants in less than 500ms

**And** Card edit interface works (FR16):
- Each card has an "Edit" button/icon (pencil icon or context menu)
- Clicking edit makes card content editable inline or opens modal
- Current content pre-filled in edit field
- Character limit enforced (same as creation)
- "Save" and "Cancel" buttons available
- Any participant can edit any card (collaborative editing in MVP)

**And** Card edit client-side works:
- User modifies content and clicks "Save"
- Client updates card optimistically in Zustand store (NFR1)
- UI shows updated content immediately
- Client sends STOMP message to `/app/room/{roomId}/card/update`
- Message includes: cardId, newContent, participantId

**And** Card edit backend works (FR16, FR18):
- Backend receives message at @MessageMapping("/room/{roomId}/card/update")
- Backend validates: card exists, content not empty, length check
- Backend updates card in storage (in-memory Map)
- Backend adds updatedAt timestamp and updatedBy field
- Backend broadcasts update to `/topic/room/{roomId}/cards`
- Message type: 'CARD_UPDATED' with updated card payload
- Response time <200ms (NFR1)

**And** Real-time synchronization works (FR18):
- All connected clients receive broadcast message
- Clients update Zustand store (updateCard action)
- Card content updates for all participants
- Latency: <500ms (NFR2)
- Optimistic update confirmed or rolled back based on server response

**And** Conflict resolution:
- Last edit wins (simple conflict resolution for MVP)
- No locking mechanism needed initially
- If edit fails due to conflict, show error and latest content
- User can retry edit with latest content

**And** Visual feedback:
- Edited cards briefly highlighted or have subtle animation
- "Editing..." indicator while save in progress
- Success confirmation after save
- Edit history not tracked in MVP (future enhancement)

**And** Error handling:
- If card no longer exists, show clear error
- If update fails, roll back optimistic update
- Network errors handled gracefully
- Clear error messages in user's language

**And** Accessibility (FR31):
- Edit button keyboard accessible
- Edit field maintains focus management
- Screen reader announces content change

### Story 2.4: Delete Cards with Real-Time Synchronization

As a **participant**,
I want **to delete any card with removal appearing instantly for all participants**,
So that **we can remove duplicates, mistakes, or irrelevant feedback during the retrospective**.

**Acceptance Criteria:**

**Given** cards exist in the room (Story 2.2)
**When** I delete a card
**Then** the card disappears for all participants in less than 500ms

**And** Card delete interface works (FR17):
- Each card has a "Delete" button/icon (X icon or trash icon)
- Delete button positioned clearly but unobtrusively
- Clicking delete shows confirmation dialog ("Are you sure?")
- Confirmation has "Delete" and "Cancel" buttons
- Any participant can delete any card (collaborative in MVP)

**And** Card delete client-side works:
- User confirms deletion
- Client removes card optimistically from Zustand store (NFR1)
- Card disappears from UI immediately
- Client sends STOMP message to `/app/room/{roomId}/card/delete`
- Message includes: cardId, participantId

**And** Card delete backend works (FR17, FR19):
- Backend receives message at @MessageMapping("/room/{roomId}/card/delete")
- Backend validates: card exists, participant has permission (any in MVP)
- Backend removes card from storage (in-memory Map)
- Backend broadcasts deletion to `/topic/room/{roomId}/cards`
- Message type: 'CARD_DELETED' with cardId
- Response time <200ms (NFR1)

**And** Real-time synchronization works (FR19):
- All connected clients receive broadcast message
- Clients update Zustand store (deleteCard action)
- Card removed from UI for all participants
- Latency: <500ms (NFR2)
- Optimistic delete confirmed or rolled back based on server response

**And** Visual feedback:
- Card fades out smoothly before removal (200ms animation)
- Success confirmation after delete (subtle, non-intrusive)
- Undo not available in MVP (future enhancement)

**And** Edge cases handled:
- If card already deleted by another user, graceful handling
- If card doesn't exist, show clear error
- Multiple rapid deletes don't cause issues
- Deleted cards don't reappear after refresh

**And** Error handling:
- If delete fails, card reappears with error message
- Roll back optimistic delete if server rejects
- Network errors handled gracefully (NFR8)
- Clear error messages

**And** Accessibility (FR31):
- Delete button keyboard accessible
- Confirmation dialog keyboard navigable
- Screen reader announces card deletion
- Focus management after delete (moves to next card or add button)

### Story 2.5: WebSocket Reconnection & Heartbeat

As a **participant**,
I want **automatic reconnection if my connection drops and consistent state after reconnecting**,
So that **I can continue participating even with temporary network issues**.

**Acceptance Criteria:**

**Given** I am connected to a room via WebSocket (Story 2.1)
**When** my connection drops temporarily
**Then** the system automatically reconnects and resynchronizes

**And** Connection monitoring works (FR30):
- Client sends heartbeat/ping every 30 seconds
- Backend responds with pong
- Client detects missed heartbeats (3 consecutive = disconnected)
- Connection status updates in Zustand: 'connected' → 'disconnected'

**And** Automatic reconnection works (FR29):
- Client detects connection loss
- Reconnection attempted automatically after 1 second
- Exponential backoff for retries: 1s, 2s, 4s, 8s, max 30s
- Max reconnection attempts: 10
- Connection status: 'disconnected' → 'connecting' → 'connected'

**And** Visual feedback during reconnection:
- UI shows "Reconnecting..." message (toast or banner)
- Message updates with retry count ("Reconnecting... attempt 2/10")
- Message disappears when reconnected
- Distinct styling for disconnected state (subtle, not alarming)

**And** State reconciliation after reconnect (NFR6):
- After successful reconnection, client fetches current room state
- GET /api/rooms/{roomId}/cards endpoint returns all current cards
- Client merges server state with local state
- Optimistic updates pending sync are retried
- Any stale local cards removed

**And** Pending operations handling:
- Cards created during disconnection queued for retry
- Queued operations sent after reconnection
- Failed operations shown to user with retry option
- User can manually discard failed operations

**And** Heartbeat backend works:
- Spring WebSocket configured with heartbeat settings
- Backend detects dead connections and closes them
- Connection cleanup prevents memory leaks
- Participant list updated when connections drop

**And** State consistency maintained (FR27, NFR7):
- All participants see same room state after reconnection
- No duplicate cards from reconnection
- Eventual consistency achieved within 2 seconds of reconnect
- Conflict resolution uses server state as source of truth

**And** Reliability during retrospective (NFR5):
- System stable for full 30-60 minute retrospective
- Reconnection works reliably with 5-10 active users
- Brief network blips (<5s) don't disrupt experience
- Extended outages (>30s) handled with clear messaging

**And** Error handling:
- If reconnection fails after 10 attempts, show error message
- User offered "Refresh Page" option as fallback
- Manual reconnection button available
- Failed state reconciliation logged and reported

**And** Edge cases:
- Room deleted during disconnection handled gracefully
- Participant removed during disconnection handled
- Concurrent edits during disconnection resolved (server wins)

**And** Performance (NFR2):
- Reconnection completes in <2 seconds
- State sync completes in <2 seconds
- Heartbeat doesn't impact message latency
- Minimal battery/resource impact from heartbeat

---

## Epic 3: Accessible & Responsive Polish

Sistema totalmente acessível por teclado com navegação completa, responsivo para desktop/tablet/mobile, e utilizável por todos os usuários incluindo aqueles com necessidades especiais. Lighthouse accessibility score ≥90 obrigatório.

### Story 3.1: Keyboard Navigation & Shortcuts

As a **keyboard user**,
I want **complete keyboard navigation with shortcuts for common actions**,
So that **I can participate in retrospectives efficiently without using a mouse**.

**Acceptance Criteria:**

**Given** I am using the application with only my keyboard
**When** I navigate through the interface
**Then** all interactive elements are accessible via keyboard

**And** Basic keyboard navigation works (FR31):
- Tab key cycles through all interactive elements in logical order
- Shift+Tab cycles backwards through interactive elements
- Enter key activates buttons and links
- Escape key closes modals and cancels actions
- Arrow keys navigate within lists and card collections
- Focus order follows visual layout (top-to-bottom, left-to-right)

**And** Category shortcuts work:
- Alt+1 focuses first category
- Alt+2 focuses second category
- Alt+3 focuses third category
- Alt+4 focuses fourth category (if exists)
- Alt+5 focuses fifth category (if exists)
- Focus moves to "Add Card" button within selected category

**And** Card management keyboard shortcuts:
- Within a card: Enter to edit, Delete to remove
- While editing: Escape to cancel, Ctrl+Enter to save
- Navigate between cards with arrow keys (Up/Down)
- Tab moves between card actions (Edit/Delete buttons)

**And** Modal keyboard behavior:
- Focus trapped within modal when open (can't Tab outside)
- Escape closes modal and returns focus to trigger element
- First focusable element receives focus when modal opens
- Focus returns to original element when modal closes

**And** Focus indicators are visible (NFR16):
- All focused elements have clear visual indicator
- Focus ring/outline minimum 2px, high contrast color
- Focus indicator visible against all backgrounds
- Custom focus styles match design system
- Focus indicators respect browser preferences (not removed via outline: none)

**And** Skip links for efficiency:
- "Skip to main content" link at page top
- "Skip to categories" link available
- Skip links visible on keyboard focus
- Skip links hidden from mouse users (but available)

**And** Keyboard accessibility in room:
- Room creation form fully keyboard accessible
- Category input fields accessible in sequence
- Participant name entry modal keyboard accessible
- All participant list interactions keyboard accessible

**And** Visual feedback for keyboard actions:
- Keyboard actions show same feedback as mouse actions
- Hover states triggered on keyboard focus
- Active states visible for keyboard interactions
- No functionality available only to mouse users

**And** Error handling:
- Keyboard traps documented and intentional (modals only)
- No accidental keyboard traps in main interface
- All error messages keyboard accessible
- Error recovery actions keyboard accessible

**And** Testing completed:
- Full workflow tested with keyboard only (no mouse)
- All user journeys completable via keyboard
- Tested with screen reader (verify keyboard navigation works)

### Story 3.2: Accessibility Compliance (WCAG AA)

As a **user with visual impairments or using assistive technology**,
I want **the interface to meet WCAG AA accessibility standards**,
So that **I can use screen readers and other assistive tools to participate in retrospectives**.

**Acceptance Criteria:**

**Given** I am using assistive technology
**When** I interact with the application
**Then** all content and functionality are accessible

**And** Color contrast meets standards (FR32, NFR17):
- Text contrast minimum 4.5:1 for normal text (WCAG AA)
- Text contrast minimum 3:1 for large text (18pt+)
- Interactive elements contrast minimum 3:1
- No information conveyed by color alone
- Tested with browser DevTools color picker
- High contrast mode support (Windows High Contrast)

**And** Semantic HTML structure (FR33, NFR18):
- Proper heading hierarchy (h1, h2, h3) with no skipped levels
- Main landmark for main content (<main>)
- Navigation landmark for navigation (<nav>)
- Form elements use <form> tag
- Buttons use <button> (not <div> or <a>)
- Links use <a> with href
- Lists use <ul>/<ol>/<li> appropriately

**And** ARIA labels and attributes (FR34, NFR18):
- All icon-only buttons have aria-label
- Form inputs have associated labels (visible or aria-label)
- Error messages linked with aria-describedby
- Required fields marked with aria-required="true"
- Invalid fields marked with aria-invalid="true"
- Disabled elements use aria-disabled or disabled attribute

**And** Live regions for real-time updates (NFR18):
- New cards announced via aria-live="polite"
- Card edits announced via aria-live="polite"
- Card deletions announced via aria-live="polite"
- Connection status changes announced via aria-live="assertive"
- Participant join/leave announced via aria-live="polite"
- Announcements don't interrupt screen reader navigation

**And** Form accessibility:
- All form inputs have visible or aria labels
- Placeholder text not used as label replacement
- Error messages appear inline and linked via aria-describedby
- Field requirements communicated before input (not just on error)
- Success messages announced to screen readers

**And** Image and icon accessibility:
- All images have alt text (empty alt="" for decorative)
- SVG icons have <title> or aria-label
- Avatar images have descriptive alt text (participant name)
- Icon-only buttons have descriptive labels

**And** Table accessibility (if tables used):
- Tables have <caption> or aria-label
- Header cells use <th> with scope attribute
- Data cells use <td>
- Complex tables have proper associations

**And** Link accessibility:
- Links have descriptive text (not "click here")
- Link purpose clear from text alone
- External links indicated (visually and for screen readers)
- Links to non-HTML content identified (PDFs, etc.)

**And** Modal accessibility:
- Modal has role="dialog" and aria-modal="true"
- Modal has aria-labelledby pointing to title
- Modal has aria-describedby for description (if needed)
- Focus trapped within modal
- Escape closes modal

**And** Screen reader testing completed:
- NVDA (Windows) testing: all flows completable
- JAWS (Windows) testing if available
- VoiceOver (macOS) testing if available
- All interactive elements properly announced
- All state changes announced appropriately

**And** Automated testing passes:
- axe DevTools: 0 critical or serious issues
- WAVE browser extension: 0 errors
- Lighthouse accessibility score ≥90 (required)
- eslint-plugin-jsx-a11y: 0 errors in build

### Story 3.3: Responsive Design (Tablet & Mobile)

As a **user on tablet or mobile device**,
I want **the interface to adapt to my screen size with touch-friendly interactions**,
So that **I can participate in retrospectives from any device**.

**Acceptance Criteria:**

**Given** I am using a tablet or mobile device
**When** I access the application
**Then** the layout adapts appropriately to my screen size

**And** Breakpoints are defined (FR35, NFR19):
- Mobile: 320px - 767px width
- Tablet: 768px - 1023px width
- Desktop: ≥1024px width
- Layout adjusts smoothly at breakpoint transitions
- No horizontal scrolling at any breakpoint

**And** Mobile layout works (320px+):
- Categories stack vertically (single column)
- Cards display full-width within category
- Navigation/header collapses to hamburger menu (if needed)
- Touch targets minimum 44x44px (Apple guidelines)
- Adequate spacing between interactive elements
- Font sizes readable without zoom
- Forms and inputs properly sized for mobile

**And** Tablet layout works (768px-1023px):
- Categories display in 2 columns (if 2-4 categories)
- Categories display in grid if 5 categories
- Cards remain readable and touch-friendly
- Participant list visible (sidebar or collapsible)
- Modal dialogs sized appropriately
- Landscape and portrait orientations both work

**And** Desktop layout works (≥1024px):
- Categories display in multi-column layout
- All categories visible without scrolling (if ≤5)
- Participant list visible in sidebar
- Optimal use of screen real estate
- Comfortable reading distance

**And** Touch interactions work:
- All buttons and links have 44x44px minimum touch target
- Swipe gestures not required (but can be added later)
- Long press doesn't trigger unexpected behavior
- Touch feedback (visual response to touch)
- No hover-only functionality (works on touch)

**And** Mobile-specific optimizations:
- Virtual keyboard doesn't break layout
- Form inputs properly sized for mobile keyboards
- Input type="text" for names, type="textarea" for cards
- Autocomplete and autocorrect appropriate
- Fixed positioning doesn't block content

**And** Images and media responsive:
- Avatar images scale appropriately
- Icons remain clear at all sizes
- SVGs scale without pixelation
- No images cause layout overflow

**And** Performance on mobile (NFR3):
- Page loads in <2 seconds on 3G connection
- Smooth scrolling and interactions
- No layout shifts during load
- Animations smooth on mobile devices (60fps target)

**And** Testing on real devices:
- Tested on iPhone (iOS Safari)
- Tested on Android phone (Chrome)
- Tested on iPad or Android tablet
- Tested in both portrait and landscape
- Tested with various screen sizes in DevTools

**And** Browser compatibility mobile (FR36):
- Safari iOS (latest 2 versions)
- Chrome Android (latest 2 versions)
- No critical layout breaks
- Core functionality works on all supported mobile browsers

### Story 3.4: Animations & Motion Preferences

As a **user sensitive to motion or using reduced motion settings**,
I want **subtle animations that enhance the experience but respect my motion preferences**,
So that **I can use the application comfortably without motion sickness or distraction**.

**Acceptance Criteria:**

**Given** animations are part of the user experience
**When** I interact with the interface
**Then** animations are subtle, purposeful, and respect my preferences

**And** Card entrance animations work:
- New cards fade in with subtle scale (200ms duration)
- Animation: opacity 0→1, scale 0.95→1
- Easing: ease-out for natural feel
- Animation doesn't block interaction
- Stagger animation if multiple cards appear simultaneously

**And** Hover state transitions work:
- Interactive elements transition smoothly on hover (100ms)
- Properties animated: background-color, border-color, transform
- Hover doesn't trigger on touch devices
- Transitions subtle and not distracting

**And** Modal animations work:
- Modal fades in with slide (150ms duration)
- Modal background (overlay) fades in
- Modal content slides up slightly while fading
- Close animation reverses open animation
- Animation doesn't delay functionality

**And** Delete animations work:
- Card fades out before removal (200ms)
- Smooth collapse of space after removal
- No jarring layout shifts
- Animation can be interrupted if needed

**And** Loading states have animations:
- Skeleton screens or shimmer effects while loading
- Spinner for short waits (<2s)
- Progress indication for longer operations
- Loading animations loop smoothly

**And** Reduced motion support (prefers-reduced-motion):
- CSS media query: @media (prefers-reduced-motion: reduce)
- All animations reduced to instant (0.01ms) or removed
- Essential motion preserved (e.g., live region announcements)
- No information conveyed only through animation
- Tested with OS reduced motion setting enabled (macOS, Windows, iOS)

**And** Animation performance:
- Animations use transform and opacity (GPU accelerated)
- No animations of layout properties (width, height, top, left)
- 60fps maintained during animations
- Animations don't cause jank or frame drops
- will-change property used appropriately

**And** Animation accessibility:
- Animations don't trigger vestibular disorders
- No parallax effects or constant motion
- Flashing/strobing avoided (WCAG 2.3.1)
- Animations can be paused if auto-playing (not applicable for MVP)

### Story 3.5: Cross-Browser Testing & Polish

As a **user of various browsers**,
I want **consistent functionality and appearance across all supported browsers**,
So that **I have a reliable experience regardless of my browser choice**.

**Acceptance Criteria:**

**Given** the application should work across browsers
**When** I use any supported browser
**Then** core functionality works without critical issues

**And** Browser support defined (FR36, NFR20):
- Chrome: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- Edge: Latest 2 versions (Chromium-based)
- Mobile: Safari iOS, Chrome Android (latest 2 versions)

**And** Desktop browser testing completed:
- Chrome (latest): Full functionality verified
- Firefox (latest): Full functionality verified
- Safari (latest): Full functionality verified
- Edge (latest): Full functionality verified
- All user flows work in all browsers
- WebSocket connection works in all browsers

**And** Mobile browser testing completed:
- Safari iOS: Full functionality on iPhone
- Chrome Android: Full functionality on Android
- Touch interactions work correctly
- WebSocket connection stable on mobile

**And** Visual consistency across browsers:
- Layout identical across browsers (allowing for native differences)
- Fonts render consistently
- Colors match across browsers
- Spacing and sizing consistent
- No broken layouts in any supported browser

**And** Feature compatibility verified:
- CSS Grid/Flexbox works in all browsers
- WebSocket/STOMP works in all browsers
- LocalStorage works in all browsers
- CSS custom properties work in all browsers
- ES6+ features work (or polyfilled if needed)

**And** Graceful degradation (NFR20):
- Core functionality preserved even if advanced features fail
- Fallbacks for unsupported features
- Clear error messages if browser unsupported
- No white screen of death in any browser

**And** Performance testing:
- Lighthouse Performance score ≥80 on desktop
- Lighthouse Performance score ≥70 on mobile
- Core Web Vitals meet "Good" thresholds
- No memory leaks in long-running sessions

**And** Accessibility testing (REQUIRED):
- Lighthouse Accessibility score ≥90 (MANDATORY)
- axe DevTools: 0 critical/serious issues
- WAVE: 0 errors
- Manual keyboard navigation: 100% completable
- Screen reader testing: All flows work

**And** Final polish completed:
- All console errors resolved
- All console warnings reviewed (non-critical acceptable)
- No 404s or broken requests
- All images load correctly
- All fonts load correctly
- Favicon and meta tags present

**And** SEO and meta tags (basic):
- Page title descriptive
- Meta description present
- Open Graph tags for sharing
- Favicon present (all sizes)
- Mobile-friendly meta viewport tag

**And** Error handling polish:
- All error messages user-friendly
- All error states tested and styled
- Empty states designed and implemented
- Loading states smooth and informative

**And** Documentation for unsupported browsers:
- README documents browser support
- Unsupported browser detection (optional)
- Graceful message for IE users (if detected)
