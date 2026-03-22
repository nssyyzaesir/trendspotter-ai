ROTEIRO COMPLETO - FluxMetric

1. O SaaS Completo: Anatomia, Arquitetura e Engenharia
Para ter o SaaS funcionando perfeitamente, precisamos dividir o sistema em três grandes pilares, garantindo que o backend pesado não afete a experiência do usuário no frontend.
1.1 A Anatomia (Componentes de Valor)
* Pilar de Captura e Processamento (O Cérebro):
    * Scrapers Integrados: Motores que consultam APIs de terceiros (como Apify ou RapidAPI) para obter dados do TikTok de forma segura e escalável, sem risco de bloqueios diretos.
    * Algoritmo de Tendência: Código assíncrono que calcula o 'score de tendência' cruzando velocidade de crescimento de visualizações, engajamento e volume de menções.
* Pilar de Interface (O Rosto):
    * Dashboard Visual: Tabela de produtos com filtros avançados, gráficos dinâmicos de crescimento e cards de detalhes.
    * Visualização de Produtos 3D/Animação: Um componente central que usa Three.js para renderizar os produtos mais quentes em 3D, ou animações complexas de fluxo de dados usando GSAP, dando um aspecto futurista e de "inteligência" à ferramenta.
* Pilar de Gestão (O Negócio):
    * Autenticação de Usuário (Auth): Cadastro, login e perfis protegidos.
    * Checkout & Assinaturas: Integração com Stripe para pagamentos recorrentes e liberação de recursos com base no plano.
1.2 Arquitetura de Engenharia (A Pilha Tecnológica)
* Frontend & API Gateway:
    * Next.js (com React): Framework React full-stack para SEO amigável, rotas de API serverless e deploy nativo na Vercel.
    * Tailwind CSS: Para estilização rápida e responsiva.
    * Three.js (com react-three-fiber): Para renderização de elementos 3D dinâmicos no dashboard.
    * GSAP (GreenSock Animation Platform): Para animações de transição de dados e micro-interações fluidas.
* Backend & Banco de Dados (BaaS):
    * Supabase (PostgreSQL): Banco de dados relacional para usuários, produtos, métricas e histórico. Fornece autenticação instantânea e tabelas protegidas.
    * Vercel Edge/Serverless Functions: Rotas assíncronas no Next.js para processar as chamadas das APIs de dados e calcular os scores sem travar o frontend.

2. Roteiro Completo de Desenvolvimento (Mão na Massa)
Fase 1: Setup e Infraestrutura (A Fundação)
1. Repositório e Vercel:
    * Crie um repositório no GitHub.
    * Importe para a Vercel para deploy contínuo (CD).
    * Crie um projeto no Supabase e adicione as chaves de API (NEXT_PUBLIC_SUPABASE_URL, etc.) nas variáveis de ambiente da Vercel.
2. Arquitetura do Banco de Dados:
    * No Supabase SQL Editor, crie as tabelas principais:
        * users: (ID, email, status da assinatura Stripe).
        * products: (ID, nome, preço, imagem, links).
        * metrics: (ID do produto, views, likes, comments, data, trend_score, hashtag_growth).
3. Configuração de Bibliotecas:
    * Instale o Supabase client, Stripe SDK, Three.js (@react-three/fiber e @react-three/drei), e GSAP.
Fase 2: O Motor de Dados (Backend)
1. Integração do Scraper:
    * Configure uma integração com uma API de extração de dados do TikTok (ex: Apify's TikTok Scraper).
2. Cálculo e Ingestão de Dados:
    * Crie uma rota de API no Next.js (/api/sync-data).
    * Esta função deve: chamar a API de dados, formatar os resultados, calcular o trend_score (ex: ((likes + comments)/views) * velocidade_crescimento) e inserir os dados limpos nas tabelas products e metrics.
3. Agendamento:
    * Use Vercel Cron Jobs para acionar a rota /api/sync-data a cada 12 horas.
Fase 3: Dashboard e Interface (Frontend e Animações)
1. Dashboard Básico:
    * Crie o layout principal e uma tabela com Tailwind CSS para listar os produtos do Supabase.
    * Implemente autenticação com Supabase Auth.
2. Design Avançado com Three.js e GSAP:
    * Componente 3D: Desenvolva um componente ProductViewer que usa Three.js para renderizar um modelo genérico ou dinâmico de produto.
    * Animações de Dados: Use GSAP para animar a entrada dos cards de produto e as barras dos gráficos de métricas. Quando os dados mudarem, use GSAP para criar transições fluidas.
    * Otimização: Garanta que Three.js rode em requestAnimationFrame e que os modelos sejam leves para não travar o navegador.
Fase 4: Pagamentos e Lançamento (Finalização)
1. Configuração do Stripe:
    * Crie os planos Pro e Gratuito no painel do Stripe.
    * Integre o checkout no Next.js.
2. Webhooks de Pagamento:
    * Crie uma rota /api/webhooks/stripe.
    * Configure o Stripe para enviar eventos para esta rota. Quando um pagamento for confirmado, atualize a tabela users no Supabase para o status 'premium'.
3. Polimento e Testes:
    * Refine as animações, verifique a responsividade e faça testes de ponta a ponta (cadastro, sync de dados, pagamento).

3. Prompt para o Antigravity (IA Desenvolvedora)
Você pode colar o texto abaixo diretamente para a inteligência artificial para delegar a execução completa do projeto.
Markdown

---
# INSTRUÇÃO PARA DESENVOLVIMENTO DE SAAS COMPLETO

**Contexto:**
Este projeto visa criar uma plataforma SaaS de inteligência de produtos virais do TikTok. O sistema deve coletar dados de vídeos (views, engajamento, crescimento de menções) usando APIs de terceiros, calcular um score de tendência e exibir esses dados em um dashboard de alta tecnologia para vendedores e criadores de conteúdo.

**Pilha Tecnológica (Tecnologias Obrigatórias):**
- **Frontend:** Next.js (com React, App Router e rotas de API Serverless).
- **Hospedagem & Deploy:** Vercel (com deploy contínuo, Vercel Edge/Serverless Functions e Vercel Cron Jobs).
- **Backend & DB:** Supabase (PostgreSQL para dados, Supabase Auth para usuários).
- **Estilização:** Tailwind CSS.
- **Animação & UX:** Three.js (via `@react-three/fiber` e `@react-three/drei` para renderização 3D dinâmica) e GSAP (GreenSock para animações de dados e transições de interface).
- **Pagamentos:** Stripe (Checkout e Assinaturas).

**Design de UI/UX (Obrigatório):**
O dashboard deve ter um visual futurista, de "inteligência de dados". Deve incluir animações de fluxo de dados GSAP fluidas e uma visualização central de produto em Three.js que reage aos dados de tendência (ex: um modelo 3D pulsando quando a tendência está em crescimento emergente).

**Seu Objetivo:**
Criar o plano de execução passo a passo e, em seguida, gerar o código completo e funcional para o MVP (Produto Mínimo Viável) deste SaaS, pronto para deploy na Vercel. Use todas as suas habilidades de engenharia full-stack, modelagem de banco de dados, integração de APIs e animação avançada.

---

### DIVISÃO DE PASSO A PASSO (A SER SEGUIDO PELA IA)

Por favor, responda com o código completo e as instruções para cada um dos seguintes passos, garantindo que o sistema final seja coeso e funcional na Vercel:

1.  **Configuração de Banco de Dados e Auth:** Modelagem SQL para Supabase (tabelas de usuários, produtos, métricas) e configuração de autenticação.
2.  **Motor de Coleta e Score:** Código Serverless Function (`/api/sync-data`) que consulta uma API de dados do TikTok (ex: Apify/RapidAPI - pode usar dados estáticos simulados se não houver chave de API), processa os dados, calcula o score e insere no Supabase.
3.  **Configuração de Vercel Cron:** Instruções exatas sobre como agendar a rota `/api/sync-data`.
4.  **Dashboard Frontend:** Código Next.js e Tailwind CSS para autenticação, dashboard de tabela de produtos e filtros.
5.  **Animações e Componentes 3D (Obrigatório):** Código funcional para o componente central em Three.js e animações GSAP para entrada de dados e transições.
6.  **Configuração Stripe & Webhooks:** Código de checkout e rota de API para processar webhooks de pagamento do Stripe, atualizando o status do usuário no Supabase.
7.  **Instruções de Deploy:** Passos para conectar o repositório à Vercel e configurar as variáveis de ambiente.

Inicie gerando o passo 1 e pare para minha confirmação antes de prosseguir para o próximo.


PROMPT PARA FAZER O REPLANEJAMENTO TOTAL.

Você é um Engenheiro de Software Full-Stack Sénior e Arquiteto de Soluções especializado em arquiteturas Serverless. A sua tarefa é desenvolver o código completo para um SaaS de inteligência de dados, seguindo estritamente a estrutura lógica, arquitetural e visual fornecida abaixo.

Aja com lógica e precisão. Responda apenas com código modular, arquitetura técnica limpa e comandos de terminal exatos. Não presuma funcionalidades fora do escopo e aguarde a minha aprovação no final de cada passo.

### 1. CONTEXTO DE NEGÓCIO
* **Nome do Projeto:** FluxMetric (SaaS de Inteligência de Produtos)
* **Problema:** Vendedores e criadores perdem tempo e dinheiro testando produtos que não têm potencial de viralização.
* **Público-alvo:** Vendedores do TikTok Shop, afiliados e dropshippers.
* **Objetivo:** Entregar um dashboard atualizado diariamente com produtos em alta, baseando-se em métricas reais de engajamento (views, likes, crescimento de menções).

### 2. ANATOMIA DO SISTEMA
* **Módulo 1: Landing Page e Auth:** Interface de conversão, planos e autenticação de utilizadores.
* **Módulo 2: Dashboard:** Tabela de produtos virais, filtros avançados e cards de análise individual.
* **Módulo 3: Motor de Inteligência:** Sistema em background para recolha via Apify, cálculo de score e inserção no banco de dados.
* **Módulo 4: Monetização:** Gateway de pagamentos para assinaturas (Grátis vs. Pro) via Stripe.
* **Módulo 5: Backoffice (Admin):** Integração com Forest Admin para gestão corporativa da plataforma.

### 3. ARQUITETURA E ENGENHARIA (A Pilha Tecnológica)
* **Frontend:** Next.js (com React e App Router).
* **Backend/API:** Next.js Serverless/Edge Functions.
* **Banco de Dados & Auth:** Supabase (PostgreSQL + Supabase Auth).
* **Integrações:** Stripe (Pagamentos) e Apify (Recolha de dados via Actors).
* **Backoffice Interno:** Forest Admin (Conectado via PostgreSQL / Agent).
* **Animação & UX:** Three.js (`@react-three/fiber` e `@react-three/drei`) e GSAP.

### 4. DIRETRIZES DE DESIGN E UX/UI (Obrigatório)
* **Estética Premium:** Visual futurista e de "inteligência de dados". Fuja de layouts genéricos. Use tipografia moderna, espaçamento generoso e Tailwind CSS.
* **Micro-interações:** Utilize GSAP para transições fluidas de dados na interface.
* **Visualização Avançada:** Componente central em Three.js no dashboard que reaja aos dados de tendência (ex: pulsando conforme o crescimento).

### 5. SEGURANÇA, BANCO DE DADOS E FOREST ADMIN
* **Modelagem para o Forest Admin:** O banco de dados no Supabase deve ser perfeitamente normalizado. Utilize *Foreign Keys* rigorosas entre as tabelas `users`, `products` e `metrics` para mapeamento automático.
* **Role Management:** Crie uma coluna `role` (enum: 'admin', 'pro', 'free') na tabela de utilizadores para gestão de acessos.
* **Segurança Nativa:** Implemente Row Level Security (RLS) no Supabase. Configure Rate Limiting via `middleware.ts` no Next.js.
* **Resiliência:** Se a API não tiver dados novos, exiba dados em cache da última sincronização usando React Suspense. Não exiba ecrãs de erro fatais.

### 6. ESTRATÉGIA DE SAÍDA E CÓDIGO LIMPO (Exit Strategy)
* O código deve ser concebido para uma futura venda ("Operação Sem Dono").
* **Isolamento Absoluto:** Nenhuma variável de ambiente (`APIFY_API_TOKEN`, `STRIPE_SECRET_KEY`, `SUPABASE_SERVICE_ROLE_KEY`) deve ser "hardcoded". TUDO deve usar `.env.local`.
* **Documentação:** Utilize comentários JSDoc nas funções de cálculo complexas para facilitar a *Due Diligence*.

### 7. ROTEIRO DE EXECUÇÃO (Passo a Passo)
**NÃO escreva todo o código de uma vez.** Entregue o código e as instruções do PASSO 1, e então PARE. Só avance quando eu aprovar explicitamente.

* **Passo 1: Setup, Infraestrutura e Modelagem SQL:** Criação do Next.js, instalação de dependências e script SQL completo para o Supabase (Tabelas preparadas para o Forest Admin e políticas RLS).
* **Passo 2: Autenticação e Middlewares:** Setup do Supabase Auth e rotas protegidas baseadas na coluna `role`.
* **Passo 3: Motor de Dados (Apify + Webhooks):** * Crie uma rota `/api/cron/trigger-scraper` que APENAS inicia a execução do *Actor* no Apify (usando o plano gratuito) e retorna 200 OK imediatamente para evitar o timeout da Vercel.
    * Crie uma segunda rota `/api/webhooks/apify-result` que o Apify irá chamar quando terminar. Esta rota deve receber o JSON de resultados, aplicar a fórmula de *trend_score* e guardar tudo no Supabase.
* **Passo 4: Dashboard Frontend (Design & UX):** Interface principal com Tailwind, Three.js e animações GSAP, consumindo os dados reais do Supabase.
* **Passo 5: Pagamentos e Backoffice:** Integração do Stripe Checkout/Webhooks e configuração do agente do Forest Admin.

Confirme que compreendeu a arquitetura, especialmente a restrição de timeout no Passo 3, e inicie imediatamente entregando os códigos e instruções detalhadas do **Passo 1**.
