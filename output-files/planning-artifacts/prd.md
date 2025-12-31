---
stepsCompleted: [1, 2, 3, 4, 7, 8, 9, 10, 11]
inputDocuments:
  - 'output-files/planning-artifacts/product-brief-retro101-2025-12-29.md'
briefCount: 1
researchCount: 0
brainstormingCount: 0
projectDocsCount: 0
workflowType: 'prd'
lastStep: 11
completed: true
date: 2025-12-30
author: Rspol
---

# Product Requirements Document - retro101

**Author:** Rspol
**Date:** 2025-12-30

## Executive Summary

**retro101** é uma ferramenta web minimalista projetada exclusivamente para facilitar retrospectivas ágeis. Ao contrário de ferramentas genéricas de colaboração (como Miro) ou plataformas complexas de retrospectiva, o retro101 oferece apenas o essencial: criar salas, definir categorias personalizadas, compartilhar via link e permitir que toda a equipe adicione cards de forma colaborativa em tempo real.

**O Problema:**
Times ágeis precisam realizar retrospectivas regularmente, mas as ferramentas disponíveis são inadequadas. Ferramentas genéricas como Miro não foram projetadas para retrospectivas e têm centenas de features irrelevantes que exigem configuração manual toda vez. Ferramentas específicas de retro frequentemente adicionam complexidade desnecessária (gamificação, analytics, integrações) quando tudo que o time precisa é de um quadro simples para coletar feedback.

Esta situação cria:
- **Perda de tempo**: 10-15 minutos de configuração antes de cada retrospectiva
- **Distração**: Features irrelevantes que desviam o foco da cerimônia
- **Barreira de entrada**: Ferramentas complexas exigem treinamento ou familiarização
- **Overhead cognitivo**: Decidir o que usar, como configurar, quais features habilitar

**A Solução:**
O retro101 oferece um fluxo ultra-simplificado em 4 passos:
1. **Criar sala**: Um clique para iniciar uma nova retrospectiva
2. **Definir categorias**: Personalizar as colunas (ex: "O que foi bem", "A melhorar", "Ações")
3. **Compartilhar link**: Enviar URL para toda a equipe entrar
4. **Criar cards**: Cada membro adiciona seus cards nas categorias disponíveis

Nada mais, nada menos. É uma ferramenta que desaparece e deixa o time focar na retrospectiva em si.

**Usuários-Alvo:**

*Facilitadores (Scrum Masters)* como Marina, que facilitam 2-3 retrospectivas por sprint com diferentes squads e precisam de agilidade para preparar a cerimônia sem perder tempo com configurações complexas. Sucesso para Marina significa criar sala em 30 segundos, definir categorias, compartilhar link e começar.

*Participantes (Membros do Time)* como Rafael, que participam de retrospectivas quinzenais e não querem criar mais uma conta/senha em mais uma ferramenta. Sucesso para Rafael significa clicar no link, colocar nome, começar a adicionar cards imediatamente - focando na retrospectiva, não na ferramenta.

### What Makes This Special

**retro101** se diferencia através de:

- **Simplicidade radical**: Zero curva de aprendizado, zero configuração complexa. Facilitadores criam salas completas em menos de 60 segundos. Participantes entram e adicionam primeiro card em menos de 30 segundos.

- **Foco laser**: Feito APENAS para retrospectivas, sem distrações. Enquanto outras ferramentas tentam fazer tudo, o retro101 faz uma coisa excepcionalmente bem.

- **Colaboração instantânea**: Compartilhar link e começar - sem cadastros obrigatórios, sem onboarding complexo. WebSockets garantem que cards aparecem em tempo real para todos os participantes.

- **Minimalismo intencional**: Resistir à tentação de adicionar features desnecessárias. Cada feature deve justificar sua existência - o padrão é "não adicionar" até que seja absolutamente essencial.

- **Projeto de aprendizado**: Construído para entender e dominar o desenvolvimento de ferramentas colaborativas em tempo real, incluindo WebSockets, sincronização de estado, e arquitetura cliente-servidor.

O momento "aha!" acontece quando facilitadores percebem que gastaram 30 segundos preparando ao invés de 15 minutos, e participantes entram e contribuem em 10 segundos sem fricção.

## Project Classification

**Technical Type:** Web App
**Domain:** General (Ferramenta de Colaboração)
**Complexity:** Low
**Project Context:** Greenfield - new project

**Rationale:**

Como uma aplicação web colaborativa em tempo real, o retro101 se encaixa claramente na categoria de web app com as seguintes características:
- Interface baseada em navegador acessível via URL compartilhada
- Arquitetura SPA (Single Page Application) para experiência fluida
- Comunicação em tempo real via WebSockets para sincronização de cards
- Responsivo para suportar diferentes dispositivos durante cerimônias
- Sem requisitos de instalação ou downloads

O domínio é classificado como **General** porque:
- Não possui requisitos regulatórios específicos (como healthcare ou fintech)
- Não requer conhecimento de domínio especializado
- Padrões web gerais e boas práticas de colaboração são suficientes
- Foco em produtividade e facilitação de processos ágeis

A complexidade é **Low** devido a:
- Escopo bem definido e focado (apenas retrospectivas)
- Sem integrações complexas no MVP
- Arquitetura cliente-servidor relativamente direta
- Padrões web estabelecidos para colaboração em tempo real

## Success Criteria

### User Success

O sucesso do usuário no retro101 é medido pela eliminação de fricção e pela capacidade de focar na retrospectiva em si, não na ferramenta.

**Para Facilitadores (Scrum Masters):**
- **Tempo até primeira retrospectiva**: Criar sala, definir categorias e compartilhar link em menos de 60 segundos
- **Zero curva de aprendizado**: Não precisa consultar documentação ou tutoriais para configurar uma sala
- **Controle sem complexidade**: Define categorias personalizadas de forma intuitiva
- **Uso recorrente**: Facilitadores escolhem retro101 para suas próximas retrospectivas ao invés de voltar para ferramentas antigas
- **Momento "aha!"**: Perceber que gastou 30 segundos preparando ao invés de 10-15 minutos em outras ferramentas

**Para Participantes (Membros do Time):**
- **Tempo até primeira contribuição**: Clicar no link, entrar na sala e adicionar primeiro card em menos de 30 segundos
- **Acesso sem fricção**: Entrar e começar a contribuir sem criar conta, fazer login ou passar por onboarding
- **Engajamento ativo**: Participantes adicionam múltiplos cards (média de 5+ cards) por retrospectiva
- **Colaboração fluida**: Ver cards dos colegas aparecerem em tempo real sem atrasos perceptíveis
- **Momento "aha!"**: Entrar e começar a contribuir em 10 segundos, focando na retrospectiva e não lutando com a ferramenta

**Sucesso Coletivo do Time:**
- Times conseguem realizar uma retrospectiva completa do início ao fim usando apenas o retro101
- Todos os participantes contribuem ativamente sem barreiras técnicas
- A ferramenta "desaparece" e permite que o time foque na discussão e nos insights

### Business Success

Como projeto de aprendizado com potencial de uso real, o sucesso do negócio é medido por domínio técnico e validação do conceito.

**Objetivos de Aprendizado (3 meses):**
- **Domínio técnico alcançado**: Compreensão profunda de desenvolvimento de aplicações colaborativas em tempo real
- **Stack dominado**: WebSockets, sincronização de estado, arquitetura cliente-servidor implementados com confiança
- **Código funcional**: Features core (salas, categorias, cards, compartilhamento) implementadas e testadas
- **Conhecimento aplicável**: Capacidade de construir outras ferramentas colaborativas usando os conceitos aprendidos

**Validação do Produto (MVP):**
- **Uso real**: Você usa o retro101 em pelo menos 2 retrospectivas reais com resultados positivos
- **Adoção orgânica**: Pelo menos 1 outro time (2-3 times idealmente) testa e fornece feedback
- **Validação do diferencial**: Feedback confirma que simplicidade é o grande valor vs ferramentas complexas
- **Problema resolvido**: Times confirmam que conseguem fazer retrospectivas mais rápido e com menos fricção

**Métricas de Validação:**
- Times que experimentam uma vez voltam a usar em retrospectivas seguintes
- Feedback qualitativo destaca velocidade de setup e facilidade de uso
- Nenhum usuário pede tutorial ou documentação para uso básico
- Comparações positivas com Miro e outras ferramentas complexas

### Technical Success

Requisitos técnicos que garantem a experiência do usuário e os objetivos de aprendizado.

**Performance:**
- **Tempo de resposta**: < 200ms para ações do usuário (criar card, atualizar sala, entrar em sala)
- **Latência em tempo real**: Cards aparecem para todos os participantes em < 500ms após criação
- **Carregamento inicial**: Sala carrega completamente em < 2 segundos
- **Responsividade**: Interface fluida em desktop, tablet e mobile

**Confiabilidade:**
- **Sincronização robusta**: Funciona consistentemente com 5-10 usuários simultâneos na mesma sala
- **Recuperação de conexão**: Reconecta automaticamente se WebSocket cair temporariamente
- **Consistência de dados**: Todos os participantes veem o mesmo estado da sala em tempo real
- **Disponibilidade**: Sistema funcional e acessível quando times precisam fazer retrospectivas

**Simplicidade Técnica:**
- **Zero configuração**: Participantes entram via URL sem instalação, cadastro ou configuração
- **Cross-browser**: Funciona em Chrome, Firefox, Safari, Edge sem problemas
- **Mobile-friendly**: Utilizável em smartphones durante cerimônias presenciais ou remotas
- **Graceful degradation**: Funcionalidade básica preservada mesmo com JavaScript limitado

**Arquitetura de Aprendizado:**
- **Código limpo**: Arquitetura cliente-servidor clara e compreensível
- **Padrões estabelecidos**: Uso de padrões web para colaboração em tempo real
- **Escalável**: Base sólida que permite adicionar features futuras sem refatoração massiva
- **Documentação técnica**: Código e decisões arquiteturais documentados para referência futura

### Measurable Outcomes

**Métricas Quantitativas:**
- **Tempo de setup (Facilitador)**: < 60 segundos da chegada ao site até sala criada e link compartilhado
- **Tempo até contribuição (Participante)**: < 30 segundos do clique no link até primeiro card criado
- **Taxa de engajamento**: Média de 5+ cards criados por participante por retrospectiva
- **Performance**: 95%+ das ações completam em < 200ms
- **Capacidade**: Suporta 5-10 usuários simultâneos sem degradação perceptível
- **Taxa de retorno**: 70%+ dos facilitadores que usam uma vez voltam a usar

**Métricas Qualitativas:**
- **Simplicidade validada**: 100% dos novos usuários conseguem participar sem instruções ou tutoriais
- **Diferencial confirmado**: Feedback menciona velocidade, simplicidade e foco como principais valores
- **Problema resolvido**: Times confirmam que retro101 eliminou fricção comparado a ferramentas anteriores
- **Aprendizado alcançado**: Você consegue explicar e implementar colaboração em tempo real em outros contextos

**Critérios de Aceitação MVP:**
1. Times conseguem realizar retrospectiva completa usando apenas retro101
2. Todos os fluxos core funcionam sem bugs críticos
3. Sincronização em tempo real é confiável e consistente
4. Facilitador cria sala completa em < 60 segundos consistentemente
5. Participantes entram e contribuem em < 30 segundos consistentemente
6. Sistema estável durante cerimônia de 30-60 minutos
7. Pelo menos 2 retrospectivas reais realizadas com sucesso
8. Feedback de pelo menos 1 outro time validando o conceito

## Product Scope

### MVP - Minimum Viable Product

O MVP foca no fluxo essencial: **criar → categorizar → compartilhar → colaborar**. Apenas o que é absolutamente necessário para realizar uma retrospectiva funcional.

**Features Essenciais do MVP:**

**1. Gerenciamento de Salas**
- Criar nova sala de retrospectiva com um clique
- Gerar link único compartilhável para a sala
- Sala ativa durante a cerimônia (sessão em tempo real)
- Acesso direto via URL sem autenticação complexa

**2. Categorias Personalizadas**
- Facilitador define categorias customizadas ao criar a sala
- Exemplos: "O que foi bem", "A melhorar", "Ações"
- Mínimo 2 categorias, máximo 5 categorias por sala
- Categorias visíveis para todos os participantes

**3. Sistema de Cards**
- Criar cards de texto em qualquer categoria
- Cards aparecem em tempo real para todos os participantes
- Cards sempre mostram quem criou (sem anonimidade no MVP)
- Visualização clara e organizada de cards por categoria
- Sem edição ou exclusão após criação (simplicidade intencional no MVP)

**4. Acesso Sem Fricção**
- Participantes entram via link compartilhado
- Sem cadastro/login obrigatório
- Nome simples + avatar padrão gerado automaticamente
- Facilitador também usa o mesmo sistema (sem roles complexos no MVP)
- Zero barreiras de entrada

**5. Colaboração em Tempo Real**
- WebSockets ou tecnologia similar para sincronização instantânea
- Cards aparecem para todos em < 500ms após criação
- Suportar 5-10 usuários simultâneos sem degradação perceptível
- Estado da sala sincronizado consistentemente entre todos

**Explicitamente FORA do MVP:**
- ❌ Anonimidade (opção de criar cards anônimos)
- ❌ Votação/Priorização (curtir, votar ou priorizar cards)
- ❌ Agrupamento (agrupar cards similares)
- ❌ Timer/Timeboxing (controle de tempo para fases)
- ❌ Edição/Exclusão (modificar cards após criação)
- ❌ Mover Cards (arrastar entre categorias)
- ❌ Templates (templates predefinidos de retrospectivas)
- ❌ Histórico (salvar ou acessar retrospectivas anteriores)
- ❌ Exportação (PDF, CSV, etc)
- ❌ Autenticação Completa (login/registro tradicional)
- ❌ Analytics (dashboards, métricas, relatórios)
- ❌ Integrações (Slack, Jira, Teams)
- ❌ Moderação (bloquear usuários, remover conteúdo)
- ❌ Persistência Longa (salas disponíveis indefinidamente)

**Justificativa:** O MVP valida que a simplicidade core resolve o problema. Features adicionais serão avaliadas após confirmar que o fluxo básico funciona e tem valor.

### Growth Features (Post-MVP)

Features que tornam o retro101 competitivo e expandem casos de uso, adicionadas após validação do MVP.

**Versão 2.0 - Facilitação Avançada:**

- **Anonimidade opcional**: Configurável pelo facilitador (sala toda anônima ou escolha por card)
- **Templates populares**: Starfish, 4Ls, Start-Stop-Continue, Mad-Sad-Glad
- **Votação e priorização**: Participantes podem curtir/votar em cards para identificar temas importantes
- **Timer para timeboxing**: Controle de tempo para fases da retrospectiva (coleta, discussão, ações)
- **Agrupamento de cards**: Arrastar cards similares juntos para organizar discussão
- **Edição/Exclusão**: Permitir que autor edite ou delete seus próprios cards
- **Mover cards**: Arrastar cards entre categorias conforme discussão evolui

**Por que Growth (não MVP):**
- Anonimidade é importante mas adiciona complexidade de UX e backend
- Templates aceleram setup mas o MVP valida se customização manual é suficiente
- Votação e agrupamento são úteis mas não essenciais para retrospectiva funcional
- Timer e edição melhoram experiência mas não impedem uso básico

### Vision (Future)

Capacidades de longo prazo que transformam retro101 em plataforma completa de retrospectivas.

**Versão 3.0 - Persistência e Análise:**

- **Histórico de retrospectivas**: Salvar e acessar retrospectivas anteriores do time
- **Exportação de resultados**: PDF, Markdown, imagem para compartilhamento
- **Tendências ao longo do tempo**: Visualizar temas recorrentes, sentimento do time, evolução
- **Acompanhamento de action items**: Marcar ações, atribuir responsáveis, rastrear conclusão
- **Comparação entre sprints**: Ver como feedback evolui entre retrospectivas

**Versão 4.0 - Ecossistema e IA:**

- **Biblioteca de formatos**: Catálogo de formatos de retrospectiva com exemplos e quando usar
- **Integrações com ferramentas de trabalho**: Slack, Microsoft Teams, Jira, Trello
- **Modo assíncrono**: Permitir adicionar cards antes da cerimônia para times distribuídos
- **Facilitação assistida por IA**: Sugestões de perguntas, identificação de insights, agrupamento automático
- **Analytics para líderes**: Dashboards de saúde do time, identificação de padrões, alertas

**Visão de Longo Prazo:**

Transformar retro101 na ferramenta de referência para retrospectivas ágeis - simples o suficiente para qualquer time começar em segundos, poderosa o suficiente para times maduros extraírem insights profundos ao longo do tempo.

**Princípio Guia:** Cada evolução mantém a simplicidade core. Novas features são **opcionais** e não complicam o fluxo básico. Um novo usuário sempre pode entrar, criar sala, adicionar cards em < 60 segundos, independente de quantas features avançadas existam.

## User Journeys

### Journey 1: Marina Santos - Reclamando Seu Tempo de Facilitação

Marina é Scrum Master de três squads diferentes e facilita 6 retrospectivas por sprint. É quarta-feira às 14h58, e ela tem uma retrospectiva começando às 15h00. Ela lembra da última vez que usou o Miro: 15 minutos configurando o quadro, criando post-its coloridos, ajustando fontes, enquanto o time esperava na call. Desta vez, ela decidiu tentar o retro101.

Às 14h58, Marina abre o retro101 pela primeira vez. A página inicial tem apenas um botão: "Criar Nova Sala". Ela clica. Uma tela simples aparece perguntando as categorias. Ela digita rapidamente: "O que foi bem", "A melhorar", "Ações para próximo sprint". Clica em "Criar Sala". Um link aparece. Ela copia e cola no canal do Slack do time: "Galera, retrospectiva começando! Link: retro101.app/sala/abc123".

Às 15h00, ela entra na call e vê que 4 membros do time já estão na sala do retro101, adicionando cards. Não houve perguntas sobre como usar, não houve problemas técnicos, não houve "Marina, como eu faço isso?". Os cards aparecem em tempo real nas três categorias que ela definiu. Pela primeira vez em meses, Marina pode realmente facilitar a discussão ao invés de gerenciar a ferramenta.

Trinta minutos depois, o time identificou três ações claras para o próximo sprint. Quando Marina olha o relógio, ela percebe: gastou 30 segundos preparando a retrospectiva. Não 15 minutos. **30 segundos**. Ela pode usar esses 14 minutos e 30 segundos para preparar melhor as perguntas facilitadoras para a próxima retrospectiva. Na próxima sprint, ela usa o retro101 novamente - e dessa vez, leva apenas 20 segundos porque já sabe exatamente quais categorias usar.

**Esta jornada revela requisitos para:**
- Criação de sala com um clique
- Interface minimalista de configuração (apenas categorias essenciais)
- Geração automática de link compartilhável
- Zero fricção para o facilitador começar
- Categorias personalizáveis (2-5 categorias)
- Acesso direto via URL sem autenticação

### Journey 2: Rafael Silva - Contribuindo em Segundos, Não Minutos

Rafael está no meio de uma tarefa complexa de refatoração quando recebe a notificação no Slack: "Galera, retrospectiva começando! Link: retro101.app/sala/abc123". Ele suspira. Lembra da última retrospectiva onde levou 5 minutos só para criar conta em uma ferramenta que ele nunca mais usaria. Mas precisa participar - feedback é importante.

Ele clica no link diretamente do Slack. O navegador abre. Não há tela de login. Não há "Crie sua conta gratuita!". Apenas uma pergunta simples: "Qual seu nome?". Rafael digita "Rafael" e pressiona Enter. Instantaneamente, ele está dentro da sala. Um avatar azul com suas iniciais "RS" aparece no canto. Ele vê três colunas: "O que foi bem", "A melhorar", "Ações para próximo sprint".

Cards já estão aparecendo nas colunas - seus colegas estão adicionando feedback em tempo real. Rafael clica no botão "+" na coluna "O que foi bem" e digita: "Pair programming na feature de autenticação funcionou muito bem". O card aparece imediatamente com "Rafael" embaixo. Ele vê Ana, Pedro e Julia também adicionando cards. É como um quadro colaborativo, mas sem toda a complexidade.

Em 10 segundos do clique no link, Rafael já havia adicionado seu primeiro card. Ele continua adicionando mais feedback: duas coisas que foram bem, três pontos a melhorar, uma ação específica que ele sugere. Vê os cards dos colegas aparecendo instantaneamente. Quando Marina começa a facilitar a discussão dos cards, Rafael está 100% presente - não perdeu tempo lutando com a ferramenta, não está frustrado com senhas esquecidas, não está se perguntando "por que essa ferramenta precisa de 47 botões?".

No final da retrospectiva, Rafael pensa: "Foi exatamente o que precisava ser. Simples. Direto. Sem fricção." Quando a próxima retrospectiva chega, ele até aguarda o link aparecer no Slack - sabe que em segundos estará contribuindo.

**Esta jornada revela requisitos para:**
- Acesso via link sem cadastro obrigatório
- Entrada com apenas nome (zero barreiras)
- Avatar gerado automaticamente
- Criação de cards em tempo real
- Sincronização instantânea (cards aparecem para todos)
- Interface intuitiva que não precisa de tutorial
- Identificação do autor em cada card
- Colaboração fluida com 5-10 participantes simultâneos

### Journey Requirements Summary

As jornadas de Marina e Rafael revelam cinco áreas críticas de capacidades:

**1. Gerenciamento de Salas (Jornada de Marina)**
- Criação de sala com interface minimalista (< 60 segundos total)
- Definição de categorias personalizadas (2-5 categorias)
- Geração automática de link único compartilhável
- Acesso direto via URL sem autenticação complexa

**2. Onboarding Sem Fricção (Jornada de Rafael)**
- Entrada via link compartilhado sem cadastro
- Identificação simples (apenas nome)
- Avatar padrão gerado automaticamente
- Zero barreiras de entrada (< 30 segundos até primeira contribuição)

**3. Sistema de Cards Colaborativo (Ambas as Jornadas)**
- Criar cards de texto em categorias específicas
- Cards aparecem em tempo real para todos os participantes
- Cards mostram identificação do autor
- Interface intuitiva sem necessidade de tutorial

**4. Colaboração em Tempo Real (Ambas as Jornadas)**
- Sincronização instantânea via WebSockets
- Cards aparecem em < 500ms para todos
- Suporte para 5-10 usuários simultâneos
- Estado consistente da sala entre todos os participantes

**5. Interface Minimalista (Ambas as Jornadas)**
- Design focado apenas no essencial
- Zero complexidade desnecessária
- Responsivo para diferentes dispositivos
- Funciona em navegadores principais sem instalação

Estas jornadas formam a base dos requisitos funcionais que serão detalhados nas próximas etapas do PRD.

## Web App Specific Requirements

### Project-Type Overview

O retro101 é uma **Single Page Application (SPA)** web colaborativa em tempo real. Como SPA, oferece uma experiência fluida e responsiva sem recarregamentos de página, ideal para a natureza dinâmica de retrospectivas onde cards aparecem instantaneamente e múltiplos usuários colaboram simultaneamente.

A arquitetura SPA permite:
- Interface instantânea sem latência de navegação entre páginas
- Estado da aplicação mantido no cliente para experiência fluida
- Comunicação WebSocket persistente para sincronização em tempo real
- Transições suaves entre criação de sala e colaboração

### Technical Architecture Considerations

**Single Page Application (SPA) Architecture:**
- Frontend renderizado completamente no cliente
- Roteamento client-side para navegação entre estados (home → criar sala → sala ativa)
- Estado da aplicação gerenciado no cliente (salas, categorias, cards, participantes)
- API backend apenas para persistência e sincronização via WebSocket
- Sem server-side rendering (SSR) necessário no MVP

**Real-Time Communication:**
- WebSocket connection persistente durante sessão da sala
- Sincronização bidirecional de estado (cards, participantes, eventos)
- Reconexão automática em caso de perda temporária de conexão
- Heartbeat/ping-pong para manter conexão ativa

### Browser Support Matrix

**Navegadores Suportados (MVP):**
- **Chrome/Chromium**: Últimas 2 versões
- **Firefox**: Últimas 2 versões
- **Safari**: Últimas 2 versões
- **Edge**: Últimas 2 versões (Chromium-based)

**Navegadores Móveis:**
- Safari iOS (últimas 2 versões)
- Chrome Android (últimas 2 versões)

**Justificativa:**
Suporte a navegadores modernos permite uso de APIs web modernas (WebSocket, ES6+, CSS Grid/Flexbox) sem necessidade de polyfills extensivos, mantendo bundle pequeno e performance alta.

**Não Suportado no MVP:**
- Internet Explorer (descontinuado)
- Navegadores com mais de 2 versões de defasagem
- Navegadores obscuros ou de baixo market share

### Responsive Design Requirements

**Design Responsivo Multi-Dispositivo:**

O retro101 deve funcionar em diferentes tamanhos de tela, pois retrospectivas podem acontecer com times remotos usando diversos dispositivos:

**Desktop (Primário):**
- Viewport mínimo: 1024px largura
- Layout multi-coluna para categorias lado a lado
- Otimizado para facilitar visualização de múltiplas categorias simultaneamente

**Tablet (Secundário):**
- Viewport: 768px - 1023px
- Layout adaptativo com categorias empilháveis ou scroll horizontal
- Touch-friendly (botões e áreas de clique adequadas para toque)

**Mobile (Terciário - Suporte Básico):**
- Viewport mínimo: 320px largura
- Layout vertical com categorias empilhadas
- Funcionalidade completa mantida (criar e ver cards)
- Experiência pode ser mais limitada mas utilizável

**Breakpoints:**
- Mobile: < 768px
- Tablet: 768px - 1023px
- Desktop: ≥ 1024px

### Performance Targets

**Carregamento Inicial:**
- **Sala carrega em < 2 segundos** (conforme definido em Success Criteria)
- Bundle JavaScript otimizado (sem target específico, mas manter razoável)
- CSS inline crítico para first paint rápido

**Responsividade de Ações:**
- **< 200ms para ações do usuário** (criar card, entrar em sala) - já definido
- **< 500ms para sincronização** (cards aparecem para todos) - já definido
- UI deve responder imediatamente (optimistic updates)

**Eficiência de Rede:**
- WebSocket messages pequenos e eficientes
- Apenas dados necessários transmitidos (sem payload desnecessário)
- Reconexão eficiente sem re-transmitir todo estado

**Escalabilidade de Cliente:**
- Performance mantida com 5-10 usuários simultâneos na mesma sala
- Degradação graciosa com mais usuários (não crashar, apenas desacelerar)

### SEO Strategy

**SEO Não Aplicável ao MVP:**

O retro101 **não requer** Search Engine Optimization porque:
- Salas são **temporárias e efêmeras** (existem apenas durante a cerimônia)
- Acesso é via **link direto compartilhado** (não via busca)
- Conteúdo de retrospectivas é **privado e contextual** ao time
- Não há benefício em indexar salas temporárias

**Implicações Técnicas:**
- Sem necessidade de SSR (Server-Side Rendering) para SEO
- Meta tags podem ser genéricas/estáticas
- Sem sitemap ou structured data necessários
- Arquitetura SPA pura sem complicações de SEO

**Consideração Futura (Post-MVP):**
- Landing page marketing pode precisar de SEO básico
- Página inicial pode ter meta tags otimizadas para compartilhamento social (Open Graph)
- Mas salas individuais permanecem não-indexáveis

### Accessibility Level

**Acessibilidade Básica (MVP):**

O retro101 implementa acessibilidade fundamental para garantir usabilidade básica:

**Navegação por Teclado:**
- Tab navigation funcional em todos os elementos interativos
- Enter/Space para ativar botões e criar cards
- Escape para fechar modais (se existirem)
- Sem "keyboard traps" que prendem o usuário

**Contraste Visual:**
- Contraste mínimo de texto: 4.5:1 (WCAG AA para texto normal)
- Contraste de elementos interativos: 3:1
- Cores não são único indicador de informação

**Semântica HTML:**
- Uso apropriado de elementos semânticos (button, input, header, main)
- Labels associados a inputs corretamente
- Estrutura de heading lógica (h1, h2, h3)

**ARIA Básico:**
- Atributos ARIA onde necessário (aria-label para ícones sem texto)
- Live regions para anúncio de cards novos (aria-live)
- Roles apropriados para componentes customizados

**Não Incluído no MVP:**
- Screen reader testing completo
- WCAG AA ou AAA certificação completa
- Suporte a navegação por voz
- Alto contraste ou temas de acessibilidade
- Redução de movimento (prefers-reduced-motion pode ser adicionado facilmente)

**Justificativa:**
Acessibilidade básica garante usabilidade para maioria dos usuários sem adicionar complexidade significativa ao MVP. Melhorias de acessibilidade podem ser iteradas post-MVP com base em feedback real.

### Implementation Considerations

**Stack Tecnológico:**

Baseado nos requisitos de web app e real-time:

**Frontend:**
- Framework JavaScript moderno (React, Vue, Svelte) para SPA
- WebSocket client para comunicação real-time
- State management leve para gerenciar salas/cards
- CSS moderno (Grid/Flexbox) para responsividade

**Backend:**
- **Java com Spring Boot** (definido)
- **Spring WebSocket** (ou STOMP over WebSocket) para comunicação real-time
- Persistência mínima (salas ativas em memória ou Redis para sessões)
- REST API com Spring MVC para criação de salas
- Embedded Tomcat para deployment simplificado

**Deployment:**
- Frontend: Static hosting (Vercel, Netlify, Cloudflare Pages)
- Backend: JAR executável com Spring Boot, deploy em container (Docker) ou cloud (AWS, Heroku, Railway)
- Escala horizontal para múltiplas salas simultâneas

**Desenvolvimento:**
- **Maven** para build e gerenciamento de dependências
- Frontend com hot reload para desenvolvimento rápido
- Lombok para reduzir boilerplate (opcional)
- Linting e formatting automatizados

**Considerações de Simplicidade:**
- Spring Boot reduz configuração complexa (convenção sobre configuração)
- WebSocket support nativo no Spring facilita implementação real-time
- Maven como build tool padrão e amplamente suportado
- Ecossistema Java maduro e produtivo para aprendizado
- Priorizar velocidade de desenvolvimento e clareza de código

## Project Scoping & Phased Development

### MVP Strategy & Philosophy

**MVP Approach: Problem-Solving MVP**

O retro101 adota uma abordagem de **Problem-Solving MVP** focada em resolver um problema específico e bem definido: eliminar a fricção de ferramentas complexas ou genéricas para retrospectivas ágeis.

**Filosofia:**
- Resolver o problema core (configuração lenta e complexa) com features mínimas essenciais
- Validar que simplicidade radical realmente elimina os 10-15 minutos de setup
- Provar que minimalismo intencional é um diferencial, não uma limitação
- Aprender desenvolvimento de aplicações colaborativas em tempo real através de implementação focada

**Não é:**
- Platform MVP tentando construir base para múltiplos use cases
- Revenue MVP focado em gerar receita imediata
- Experience MVP com features polidas mas incompletas

**Resource Requirements:**
- **Team Size**: Projeto solo ou dupla (desenvolvedor full-stack)
- **Skills Necessárias**:
  - Frontend: JavaScript/TypeScript, framework moderno (React/Vue/Svelte), CSS responsivo
  - Backend: Java, Spring Boot, Spring WebSocket, Maven
  - DevOps básico: Deploy de JAR, hosting de frontend estático
- **Timeline Estimado**: 3 meses para MVP funcional (conforme objetivos de aprendizado)

### MVP Feature Set (Phase 1)

**Core User Journeys Supported:**

O MVP suporta completamente as duas jornadas essenciais:

1. **Marina (Facilitadora)** - Criando e facilitando retrospectiva
   - Cria sala em <60 segundos
   - Define 2-5 categorias personalizadas
   - Compartilha link via Slack/Teams
   - Vê cards aparecendo em tempo real
   - Facilita discussão sem gerenciar ferramenta

2. **Rafael (Participante)** - Entrando e contribuindo
   - Clica no link e entra em <30 segundos
   - Adiciona nome simples, recebe avatar
   - Cria múltiplos cards em categorias
   - Vê colaboração em tempo real
   - Foca na retrospectiva, não na ferramenta

**Must-Have Capabilities:**

**1. Gerenciamento de Salas**
- Criar nova sala com um clique
- Gerar link único compartilhável automaticamente
- Sala ativa durante sessão (sem persistência longa no MVP)
- Acesso direto via URL sem autenticação

**2. Categorias Personalizadas**
- Facilitador define 2-5 categorias ao criar sala
- Exemplos: "O que foi bem", "A melhorar", "Ações"
- Categorias fixas durante a retrospectiva
- Visíveis para todos os participantes

**3. Sistema de Cards**
- Criar cards de texto em qualquer categoria
- Cards aparecem em tempo real (<500ms) para todos
- Cards mostram autor (nome fornecido no entrada)
- Visualização organizada por categoria
- **Sem edição/exclusão** após criação (simplicidade intencional)

**4. Acesso Sem Fricção**
- Entrada via link compartilhado
- **Zero cadastro/login** obrigatório
- Nome simples + avatar gerado automaticamente
- Facilitador usa mesmo sistema (sem roles complexos)

**5. Colaboração em Tempo Real**
- WebSocket connection para sincronização instantânea
- Cards sincronizados em <500ms
- Suporte para 5-10 usuários simultâneos
- Estado consistente entre todos os participantes
- Reconexão automática se conexão cair

**Technical Implementation (MVP):**
- SPA frontend (React/Vue/Svelte)
- Spring Boot backend com Spring WebSocket
- Salas em memória (ou Redis) - sem banco de dados complexo
- Deploy: Frontend estático + JAR executável

### Post-MVP Features

**Phase 2 - Facilitação Avançada (Growth Features):**

Após validar que MVP resolve o problema core, adicionar features que melhoram mas não são essenciais:

- **Anonimidade opcional**: Configurável pelo facilitador (sala anônima ou escolha por card)
- **Templates populares**: Starfish, 4Ls, Start-Stop-Continue, Mad-Sad-Glad
- **Votação e priorização**: Curtir/votar em cards para identificar temas importantes
- **Timer para timeboxing**: Controle de tempo para fases da retrospectiva
- **Agrupamento de cards**: Arrastar cards similares para organizar discussão
- **Edição/Exclusão de cards**: Permitir autor editar ou deletar próprios cards
- **Mover cards entre categorias**: Drag-and-drop conforme discussão evolui

**Justificativa Phase 2:**
- Anonimidade é valiosa mas adiciona complexidade de UX e backend
- Templates aceleram setup mas MVP valida se customização manual é suficiente
- Votação/agrupamento melhoram facilitação mas não impedem retrospectiva funcional

**Phase 3 - Persistência e Análise (Expansion Features):**

Transformar retro101 em plataforma completa de retrospectivas ao longo do tempo:

- **Histórico de retrospectivas**: Salvar e acessar retrospectivas anteriores do time
- **Exportação de resultados**: PDF, Markdown, imagem para compartilhamento
- **Tendências ao longo do tempo**: Visualizar temas recorrentes, evolução de sentimento
- **Acompanhamento de action items**: Marcar ações, atribuir responsáveis, rastrear conclusão
- **Comparação entre sprints**: Ver como feedback evolui

**Phase 4 - Ecossistema e IA (Vision Features):**

Capacidades de longo prazo se retro101 escalar:

- **Biblioteca de formatos**: Catálogo de formatos com exemplos e quando usar
- **Integrações**: Slack, Microsoft Teams, Jira, Trello
- **Modo assíncrono**: Adicionar cards antes da cerimônia (times distribuídos)
- **Facilitação assistida por IA**: Sugestões de perguntas, insights automáticos, agrupamento inteligente
- **Analytics para líderes**: Dashboards de saúde do time, padrões, alertas

**Princípio Guia de Evolução:**
Cada fase mantém simplicidade core. Novas features são **opcionais** e não complicam fluxo básico. Um novo usuário sempre pode criar sala e adicionar cards em <60 segundos, independente de quantas features avançadas existam.

### Risk Mitigation Strategy

**Technical Risks:**

**Risco #1: WebSocket Synchronization Complexity**
- **Descrição**: Sincronizar estado em tempo real entre múltiplos clientes é tecnicamente complexo
- **Probabilidade**: Alta (área nova de aprendizado)
- **Impacto**: Alto (core do diferencial do produto)
- **Mitigação**:
  - Começar com implementação simples (broadcast de eventos, state no cliente)
  - Testar cedo com 5-10 usuários simultâneos
  - Aceitar limitações iniciais (reconexão pode perder cards)
  - Spring WebSocket tem suporte robusto e exemplos
  - Iterar baseado em problemas reais, não antecipados

**Risco #2: Performance com Múltiplos Usuários**
- **Descrição**: Performance pode degradar com >10 usuários simultâneos
- **Probabilidade**: Média
- **Impacto**: Médio (maioria das retrospectivas tem 5-10 pessoas)
- **Mitigação**:
  - MVP limita oficialmente a 5-10 usuários
  - Otimizar apenas se problema real aparecer
  - Escalar horizontalmente (múltiplas instâncias) se necessário post-MVP

**Market Risks:**

**Risco #1: "Não é Simples o Suficiente"**
- **Descrição**: Times podem não adotar se retro101 não for percebido como mais simples que alternativas
- **Probabilidade**: Média
- **Impacto**: Alto (invalida proposta de valor principal)
- **Validação**:
  - Testar com pelo menos 2 retrospectivas reais (você como facilitador)
  - Obter feedback de pelo menos 1 outro time
  - Medir tempo de setup real vs target de <60s
  - Coletar feedback qualitativo sobre simplicidade percebida
- **Pivot Options**: Se não for simples o suficiente, remover features ao invés de adicionar

**Risco #2: Mercado Saturado**
- **Descrição**: Já existem muitas ferramentas de retrospectiva
- **Probabilidade**: Alta (mercado existente)
- **Impacto**: Baixo (projeto de aprendizado, não comercial inicialmente)
- **Mitigação**:
  - Foco em aprendizado técnico, não dominação de mercado
  - Diferenciação clara: minimalismo radical vs features complexas
  - Uso orgânico por alguns times já é sucesso

**Resource Risks:**

**Risco #1: Falta de Tempo/Recursos**
- **Descrição**: Projeto pode levar mais tempo que 3 meses planejados
- **Probabilidade**: Média (projetos de aprendizado frequentemente expandem)
- **Impacto**: Baixo (sem deadline rígida)
- **Contingência**:
  - Cortar features do MVP se necessário (ex: responsividade mobile avançada)
  - Aceitar bugs não-críticos no MVP
  - Focar em funcionalidade core (salas + cards) antes de polish
  - Minimum viable: desktop web, 2 categorias fixas, sem avatars

**Risco #2: Tecnologia Nova (Aprendizado)**
- **Descrição**: Spring WebSocket e sincronização real-time podem ter curva de aprendizado
- **Probabilidade**: Alta (área nova)
- **Impacto**: Médio (parte dos objetivos de aprendizado)
- **Mitigação**:
  - Objetivo é aprender, então "risco" é na verdade oportunidade
  - Começar com tutoriais e exemplos de Spring WebSocket
  - Implementação incremental (primeiro REST, depois WebSocket)
  - Aceitar que primeira versão pode ser imperfeita

**Success Criteria for MVP Launch:**

MVP está pronto para "lançamento" (uso real) quando:
1. ✓ Facilitador cria sala completa em <60 segundos consistentemente
2. ✓ Participante entra e cria primeiro card em <30 segundos
3. ✓ Sincronização funciona com 5-10 usuários sem lag perceptível
4. ✓ Sistema estável durante retrospectiva de 30-60 minutos
5. ✓ Você completa 2 retrospectivas reais usando retro101
6. ✓ Pelo menos 1 outro time testa e fornece feedback

## Functional Requirements

### Gerenciamento de Salas

- **FR1**: Facilitador pode criar uma nova sala de retrospectiva
- **FR2**: Sistema gera automaticamente um link único compartilhável para cada sala criada
- **FR3**: Qualquer usuário pode acessar uma sala ativa através de seu link único
- **FR4**: Sala permanece ativa durante a sessão de retrospectiva
- **FR5**: Sistema identifica quando usuário acessa pela primeira vez uma sala específica

### Gerenciamento de Categorias

- **FR6**: Facilitador pode definir categorias personalizadas ao criar uma sala
- **FR7**: Facilitador pode criar entre 2 e 5 categorias por sala
- **FR8**: Todos os participantes podem visualizar as categorias definidas para a sala
- **FR9**: Categorias permanecem fixas durante toda a retrospectiva
- **FR10**: Sistema exibe nome de cada categoria de forma clara e organizada

### Gerenciamento de Cards

- **FR11**: Participante pode criar um novo card de texto em qualquer categoria disponível
- **FR12**: Sistema associa automaticamente o nome do autor a cada card criado
- **FR13**: Card exibe o nome do autor que o criou
- **FR14**: Participantes podem visualizar todos os cards criados em cada categoria
- **FR15**: Sistema organiza cards por categoria de forma clara
- **FR16**: Qualquer participante pode editar o conteúdo de qualquer card existente
- **FR17**: Qualquer participante pode excluir qualquer card existente
- **FR18**: Sistema sincroniza edições de cards em tempo real para todos os participantes
- **FR19**: Sistema sincroniza exclusões de cards em tempo real para todos os participantes

### Gerenciamento de Participantes

- **FR20**: Usuário pode entrar em uma sala fornecendo apenas um nome
- **FR21**: Sistema gera automaticamente um avatar para cada participante
- **FR22**: Sistema identifica cada participante pelo nome fornecido
- **FR23**: Participantes podem visualizar presença de outros participantes na sala
- **FR24**: Facilitador entra na sala usando o mesmo processo que participantes (sem roles diferenciados)

### Colaboração em Tempo Real

- **FR25**: Sistema sincroniza cards entre todos os participantes em tempo real
- **FR26**: Card criado por um participante aparece para todos os outros participantes
- **FR27**: Sistema mantém estado consistente da sala entre todos os participantes conectados
- **FR28**: Sistema suporta 5-10 usuários simultâneos na mesma sala
- **FR29**: Sistema tenta reconectar automaticamente se conexão WebSocket cair temporariamente
- **FR30**: Sistema mantém heartbeat para detectar conexões ativas

### Interface e Acessibilidade

- **FR31**: Sistema fornece navegação completa por teclado para todos os elementos interativos
- **FR32**: Sistema mantém contraste mínimo de 4.5:1 para texto
- **FR33**: Sistema usa elementos HTML semânticos apropriados
- **FR34**: Sistema fornece labels e ARIA attributes para acessibilidade básica
- **FR35**: Sistema é responsivo para desktop (≥1024px), tablet (768-1023px) e mobile (≥320px)
- **FR36**: Sistema funciona nas últimas 2 versões de Chrome, Firefox, Safari e Edge

## Non-Functional Requirements

### Performance

**NFR1: Response Time para Ações do Usuário**
- Ações do usuário (criar card, entrar em sala, definir categorias) devem completar em menos de 200ms em 95% dos casos
- Sistema deve responder visualmente (feedback) imediatamente (<100ms) para todas as interações

**NFR2: Latência de Sincronização em Tempo Real**
- Cards criados, editados ou excluídos devem aparecer para todos os participantes em menos de 500ms
- Sistema deve manter latência de sincronização <500ms com até 10 usuários simultâneos na mesma sala

**NFR3: Carregamento Inicial**
- Sala deve carregar completamente (incluindo categorias e cards existentes) em menos de 2 segundos
- Página inicial deve carregar em menos de 1 segundo

**NFR4: Bundle e Assets**
- Bundle JavaScript do frontend deve ser otimizado para carregamento rápido (sem target específico de tamanho, mas manter razoável)
- Recursos críticos devem usar lazy loading quando apropriado

### Reliability

**NFR5: Disponibilidade do Sistema**
- Sistema deve permanecer estável e funcional durante toda a duração típica de uma retrospectiva (30-60 minutos)
- Sistema deve ser acessível quando times precisam realizar retrospectivas

**NFR6: Reconexão Automática**
- Sistema deve tentar reconectar automaticamente se conexão WebSocket cair temporariamente
- Após reconexão bem-sucedida, sistema deve ressincronizar estado atual da sala

**NFR7: Consistência de Dados**
- Todos os participantes devem ver o mesmo estado da sala (cards, categorias, participantes)
- Sincronização deve ser eventual consistent (tolerância a lag de rede)

**NFR8: Degradação Graciosa**
- Se sincronização falhar, sistema deve informar usuário claramente
- Sistema não deve crashar com erros de rede ou conexão - deve degradar gracefully

### Scalability

**NFR9: Usuários Simultâneos por Sala**
- Sistema deve suportar 5-10 usuários simultâneos na mesma sala sem degradação perceptível de performance
- Sistema deve funcionar corretamente (ainda que mais lento) com até 15 usuários por sala

**NFR10: Múltiplas Salas Simultâneas**
- Sistema deve suportar múltiplas salas ativas simultaneamente
- Número de salas limitado apenas por recursos de servidor (definido no deployment)

**NFR11: Crescimento de Dados**
- Performance mantida com até 50 cards por sala (cenário típico de retrospectiva)
- Degradação aceitável com até 100 cards por sala

### Usability

**NFR12: Tempo até Primeira Sala Criada (Facilitador)**
- Facilitador deve conseguir criar sala completa (incluindo categorias) em menos de 60 segundos
- Fluxo de criação de sala deve ser intuitivo sem necessidade de tutorial

**NFR13: Tempo até Primeira Contribuição (Participante)**
- Participante deve conseguir entrar na sala e criar primeiro card em menos de 30 segundos do clique no link
- Entrada na sala deve ser intuitiva sem necessidade de instruções

**NFR14: Curva de Aprendizado**
- Usuários novos devem conseguir usar funcionalidades core (criar card, visualizar cards) sem consultar documentação
- Interface deve ser autoexplicativa através de labels claros e feedback visual

**NFR15: Simplicidade Intencional**
- Interface deve apresentar apenas opções essenciais - evitar sobrecarga cognitiva
- Cada tela deve ter propósito único e claro

### Accessibility

**NFR16: Navegação por Teclado**
- Todos os elementos interativos devem ser acessíveis via teclado (Tab, Enter, Escape)
- Sistema não deve ter "keyboard traps" que prendem o usuário

**NFR17: Contraste Visual**
- Texto deve ter contraste mínimo de 4.5:1 (WCAG AA para texto normal)
- Elementos interativos devem ter contraste mínimo de 3:1

**NFR18: Semântica e ARIA**
- Sistema deve usar elementos HTML semânticos apropriados (button, input, header, main)
- Sistema deve fornecer ARIA labels onde necessário
- Live regions (aria-live) devem anunciar novos cards para screen readers

**NFR19: Responsividade**
- Sistema deve funcionar em desktop (≥1024px), tablet (768-1023px) e mobile (≥320px)
- Layout deve adaptar-se apropriadamente para cada breakpoint

### Browser Compatibility

**NFR20: Suporte de Navegadores**
- Sistema deve funcionar corretamente nas últimas 2 versões de Chrome, Firefox, Safari e Edge
- Sistema deve funcionar em Safari iOS e Chrome Android (últimas 2 versões)
- Funcionalidade core deve ser mantida mesmo se APIs específicas não forem suportadas (graceful degradation)

