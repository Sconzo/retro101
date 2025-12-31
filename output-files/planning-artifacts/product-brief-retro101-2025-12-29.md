---
stepsCompleted: [1, 2, 3, 4, 5]
inputDocuments: []
date: 2025-12-29
author: Rspol
---

# Product Brief: retro101

<!-- Content will be appended sequentially through collaborative workflow steps -->

## Executive Summary

**retro101** é uma ferramenta web minimalista e focada exclusivamente em facilitar retrospectivas ágeis. Ao contrário de ferramentas genéricas de colaboração (como Miro) ou plataformas complexas de retrospectiva, o retro101 oferece apenas o essencial: criar salas, definir categorias personalizadas, compartilhar via link e permitir que toda a equipe adicione cards de forma colaborativa. É simplicidade intencional para times que querem fazer retrospectivas sem distrações ou curva de aprendizado.

---

## Core Vision

### Problem Statement

Times ágeis precisam realizar retrospectivas regularmente, mas as ferramentas disponíveis são ou genéricas demais (como Miro, que não é feito para retrospectivas) ou complexas demais. Falta uma opção simples, direta e focada que permita criar uma sala de retrospectiva, definir categorias e começar a colaborar em segundos.

### Problem Impact

Quando as ferramentas são genéricas ou complicadas:
- **Perda de tempo**: Configuração desnecessária antes de começar a retrospectiva
- **Distração**: Features irrelevantes que desviam o foco da cerimônia
- **Barreira de entrada**: Ferramentas complexas exigem treinamento ou familiarização
- **Overhead cognitivo**: Decidir o que usar, como configurar, quais features habilitar

### Why Existing Solutions Fall Short

- **Ferramentas genéricas (Miro)**: Não foram projetadas para retrospectivas, têm centenas de features irrelevantes, exigem configuração manual toda vez
- **Ferramentas específicas de retro**: Frequentemente adicionam complexidade desnecessária (gamificação, analytics, integrações) quando tudo que o time precisa é de um quadro simples para coletar feedback

### Proposed Solution

**retro101** oferece um fluxo ultra-simplificado:

1. **Criar sala**: Um clique para iniciar uma nova retrospectiva
2. **Definir categorias**: Personalizar as colunas (ex: "O que foi bem", "A melhorar", "Ações")
3. **Compartilhar link**: Enviar URL para toda a equipe entrar
4. **Criar cards**: Cada membro adiciona seus cards nas categorias disponíveis

Nada mais, nada menos. É uma ferramenta que desaparece e deixa o time focar na retrospectiva em si.

### Key Differentiators

- **Simplicidade radical**: Zero curva de aprendizado, zero configuração complexa
- **Foco laser**: Feito APENAS para retrospectivas, sem distrações
- **Colaboração instantânea**: Compartilhar link e começar - sem cadastros, sem onboarding
- **Minimalismo intencional**: Resistir à tentação de adicionar features - manter apenas o essencial
- **Projeto de aprendizado**: Construído para entender e dominar o desenvolvimento de ferramentas colaborativas em tempo real

---

## Target Users

### Primary Users

**1. O Facilitador (Scrum Master)**

**Persona: Marina, Scrum Master**
- Marina facilita 2-3 retrospectivas por sprint com diferentes squads
- Precisa de agilidade para preparar a cerimônia sem perder tempo com configurações complexas
- Valoriza controle sobre o formato da retrospectiva (categorias personalizadas, anonimidade opcional)
- Quer focar em facilitar a discussão, não em lutar com a ferramenta

**Problema que enfrenta:**
- Ferramentas genéricas (Miro) exigem configuração manual toda vez
- Ferramentas complexas têm features que ela nunca usa
- Perder 10-15 minutos configurando antes de cada retrospectiva

**Sucesso para Marina:**
- Criar sala em 30 segundos, definir categorias, compartilhar link e começar
- Controle simples sobre anonimidade quando o time precisa de segurança psicológica
- Time colaborando sem problemas técnicos ou confusão

**2. Os Participantes (Membros do Time)**

**Persona: Rafael, Desenvolvedor**
- Rafael participa de retrospectivas quinzenais com seu squad
- Não quer criar mais uma conta/senha em mais uma ferramenta
- Valoriza simplicidade: entrar rápido, adicionar feedback, participar da discussão
- Às vezes precisa de anonimidade para dar feedback mais honesto

**Problema que enfrenta:**
- Ferramentas que exigem cadastro/login criam fricção desnecessária
- Interfaces complexas distraem do propósito da retrospectiva
- Falta de opção de anonimidade pode inibir feedbacks importantes

**Sucesso para Rafael:**
- Clicar no link, colocar nome, começar a adicionar cards imediatamente
- Interface intuitiva que não precisa de tutorial
- Poder escolher ser anônimo quando necessário
- Focar na retrospectiva, não na ferramenta

### Secondary Users

N/A - O retro101 serve apenas facilitadores e participantes de retrospectivas.

### User Journey

**Jornada do Facilitador (Marina):**

1. **Preparação (2 minutos antes da cerimônia)**
   - Abre retro101
   - Cria nova sala com um clique
   - Define categorias: "O que foi bem", "A melhorar", "Ações"
   - Habilita anonimidade opcional para este sprint (time pediu)

2. **Início da Retrospectiva**
   - Compartilha link no Slack/Teams
   - Aguarda time entrar
   - Todos começam a adicionar cards simultaneamente

3. **Facilitação**
   - Visualiza cards sendo criados em tempo real
   - Facilita discussão categoria por categoria
   - Time colabora de forma síncrona

4. **Momento "Aha!"**
   - "Gastei 30 segundos preparando ao invés de 15 minutos - posso focar em facilitar!"

**Jornada do Participante (Rafael):**

1. **Recebimento**
   - Recebe link do Slack durante a cerimônia

2. **Acesso Instantâneo**
   - Clica no link
   - Vê tela simples: "Digite seu nome"
   - Coloca "Rafael" + recebe avatar padrão
   - Entra na sala - sem cadastro, sem fricção

3. **Colaboração**
   - Vê as categorias já definidas
   - Adiciona cards: alguns com seu nome, outros anônimos
   - Vê cards dos colegas aparecendo em tempo real

4. **Momento "Aha!"**
   - "Entrei e comecei a contribuir em 10 segundos - e pude ser anônimo quando precisei!"

---

## Success Metrics

### Métricas de Sucesso do Usuário

**Para o Facilitador (Marina):**
- **Tempo até primeira retrospectiva**: Criar sala, definir categorias e compartilhar link em menos de 60 segundos
- **Uso recorrente**: Facilitadores voltam a usar o retro101 para suas próximas retrospectivas
- **Zero fricção**: Não precisa consultar documentação ou tutoriais para usar

**Para o Participante (Rafael):**
- **Tempo até primeira contribuição**: Entrar na sala e adicionar primeiro card em menos de 30 segundos
- **Engajamento ativo**: Participantes adicionam múltiplos cards por retrospectiva
- **Colaboração fluida**: Cards aparecem em tempo real sem atrasos perceptíveis

### Business Objectives

**Como projeto de aprendizado:**
- **Aprender desenvolvimento de aplicações colaborativas em tempo real**: WebSockets, sincronização de estado, arquitetura cliente-servidor
- **Dominar stack tecnológico escolhido**: Implementar features core (salas, categorias, cards, compartilhamento)
- **Criar produto funcional e utilizável**: Ferramenta que você e outros podem realmente usar em retrospectivas

**Adoção (se compartilhar com outros):**
- Uso orgânico por pelo menos 2-3 times diferentes
- Feedback positivo sobre simplicidade vs ferramentas complexas

### Key Performance Indicators

**Indicadores Técnicos:**
- **Performance**: Tempo de resposta < 200ms para ações (criar card, atualizar sala)
- **Confiabilidade**: Sincronização em tempo real funciona com 5-10 usuários simultâneos
- **Disponibilidade**: Sistema funcional e acessível quando necessário

**Indicadores de Uso:**
- **Engajamento**: Média de 5+ cards criados por participante por retrospectiva
- **Simplicidade validada**: Novos usuários conseguem participar sem instruções
- **Retenção**: Times que usam uma vez voltam a usar

**Indicadores de Aprendizado:**
- **Código funcional**: Features core implementadas e testadas
- **Conhecimento adquirido**: Compreensão profunda de colaboração em tempo real, gerenciamento de estado distribuído
- **Projeto completo**: MVP funcional que resolve o problema identificado

---

## MVP Scope

### Core Features

**Features Essenciais do MVP:**

1. **Gerenciamento de Salas**
   - Criar nova sala de retrospectiva com um clique
   - Gerar link único compartilhável para a sala
   - Sala ativa durante a cerimônia (sessão em tempo real)

2. **Categorias Personalizadas**
   - Facilitador define categorias customizadas ao criar a sala
   - Exemplos: "O que foi bem", "A melhorar", "Ações"
   - Mínimo 2 categorias, máximo razoável (ex: 5)

3. **Sistema de Cards**
   - Criar cards de texto em qualquer categoria
   - Cards aparecem em tempo real para todos os participantes
   - Cards sempre mostram quem criou (sem anonimidade no MVP)
   - Visualização clara de cards por categoria

4. **Acesso Sem Fricção**
   - Participantes entram via link compartilhado
   - Sem cadastro/login obrigatório
   - Nome + avatar padrão gerado automaticamente
   - Facilitador também usa o mesmo sistema (sem autenticação complexa)

5. **Colaboração em Tempo Real**
   - WebSockets ou tecnologia similar para sincronização
   - Cards aparecem instantaneamente para todos
   - Suportar 5-10 usuários simultâneos sem degradação

### Out of Scope for MVP

**Explicitamente FORA do MVP (versões futuras):**

- ❌ **Anonimidade**: Opção de criar cards anônimos ou escolher por card
- ❌ **Votação/Priorização**: Curtir, votar ou priorizar cards
- ❌ **Agrupamento**: Agrupar cards similares ou criar categorias dinâmicas
- ❌ **Timer/Timeboxing**: Controle de tempo para fases da retrospectiva
- ❌ **Edição/Exclusão**: Editar ou deletar cards após criação
- ❌ **Mover Cards**: Arrastar cards entre categorias
- ❌ **Templates**: Templates predefinidos de retrospectivas (Starfish, 4Ls, etc)
- ❌ **Histórico**: Salvar ou acessar retrospectivas anteriores
- ❌ **Exportação**: Exportar resultados (PDF, CSV, etc)
- ❌ **Autenticação Completa**: Sistema de login/registro tradicional
- ❌ **Analytics**: Dashboards, métricas, relatórios
- ❌ **Integrações**: Slack, Jira, Teams, etc
- ❌ **Moderação**: Bloquear usuários, remover conteúdo inadequado
- ❌ **Persistência Longa**: Salas permanecem disponíveis indefinidamente

**Justificativa:** O MVP foca no fluxo essencial: criar → categorizar → compartilhar → colaborar. Features adicionais (incluindo anonimidade) podem ser avaliadas após validar que a simplicidade core resolve o problema.

### MVP Success Criteria

**Critérios para considerar o MVP bem-sucedido:**

1. **Funcionalidade Completa**
   - Times conseguem realizar uma retrospectiva completa usando apenas o retro101
   - Todos os fluxos core funcionam sem bugs críticos
   - Sincronização em tempo real é confiável

2. **Simplicidade Validada**
   - Facilitador cria sala completa em < 60 segundos
   - Participantes entram e criam primeiro card em < 30 segundos
   - Zero necessidade de documentação/tutorial para uso básico

3. **Performance Adequada**
   - Tempo de resposta < 200ms para criar cards
   - Suporta 5-10 usuários simultâneos sem lag perceptível
   - Sistema estável durante cerimônia de 30-60 minutos

4. **Aprendizado Técnico Alcançado**
   - Compreensão profunda de WebSockets e sincronização em tempo real
   - Arquitetura cliente-servidor funcional implementada
   - Gerenciamento de estado distribuído dominado

5. **Uso Real**
   - Você usa o retro101 em pelo menos 2 retrospectivas reais
   - Pelo menos 1 outro time testa e dá feedback
   - Feedback confirma que simplicidade é o diferencial

### Future Vision

**Se o retro101 for bem-sucedido, próximos passos (pós-MVP):**

**Versão 2.0 - Facilitação Avançada:**
- **Anonimidade opcional** (configurável pelo facilitador)
- Templates populares de retrospectiva (Starfish, 4Ls, Start-Stop-Continue)
- Votação e priorização de cards
- Timer para timeboxing de fases
- Agrupamento de cards similares

**Versão 3.0 - Persistência e Análise:**
- Histórico de retrospectivas anteriores
- Exportação de resultados (PDF, Markdown)
- Tendências ao longo do tempo (temas recorrentes)
- Acompanhamento de action items

**Visão de Longo Prazo:**
- Biblioteca de formatos de retrospectiva
- Integrações com ferramentas de trabalho (Slack, Teams)
- Modo assíncrono (adicionar cards antes da cerimônia)
- Facilitação assistida por IA (sugestões de perguntas, insights)

**Princípio Guia:** Cada evolução mantém a simplicidade core. Novas features são opcionais e não complicam o fluxo básico.
