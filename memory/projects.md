# Projetos

## Ativos

### Configuração de Skills (OpenClaw)
- **Status:** em andamento
- **Próximo passo:** instalar moviepy, configurar Creatomate, ativar OpenAI/Gemini no OpenClaw
- **Bloqueios:** ElevenLabs bloqueado por pagamento pendente; Manim requer sudo para deps

### Design System ISIS v7
- **Status:** concluído
- **Concluído em:** 09/03/2026
- **Arquivos:** `memory/design-system-isis-v7.html` (fonte da verdade) + `memory/design-system.md` (tokens indexados)
- **Uso:** obrigatório em todos os materiais visuais gerados por Dona

### Templates de Relatório PDF
- **Status:** em andamento
- **Template base:** `relatorio-domingo-v2.html` — reusar para próximos relatórios semanais
- **Ferramenta:** YakPDF (RapidAPI) com wait.for timeout 4000ms
- **Próximo passo:** refinar template conforme feedback de Isis

### Infraestrutura de Integrações
- **Status:** em andamento
- **Concluído:** RapidAPI (5 APIs), Canva OAuth, GitHub SSH, Coolify deploy, FFmpeg, ElevenLabs (salvo)
- **Pendente:** moviepy, Creatomate (VSL), Supabase, OpenAI/Gemini no OpenClaw

### Crescimento de Audiência Instagram
- **Status:** planejamento
- **Próximo passo:** configurar instagram-analyzer e meta-ads-manager após ter as keys
- **Meta:** 1 milhão de seguidores em 3 meses (atual: 377k)
- **Bloqueios:** skills ainda não configuradas

### Escala de Receita
- **Status:** em andamento
- **Meta:** R$ 1M/mês (atual: R$ 100k/mês orgânico)
- **Próximo passo:** funis de produtos (maior potencial que mentorias)

### Material: Time de Agentes do Zero ao Avançado
- **Status:** aprovado, em produção
- **Formato:** PDF robusto (base para aula/vídeo)
- **Público:** leigo a avançado, posicionamento de autoridade
- **Estrutura:** 6 blocos (Problema > O que são agentes > Framework > Construção > Operação > Resultado)
- **Sanitização:** nomes e papéis ok, nada de IPs/tokens/configs/paths/vault
- **Cadeia:** Atlas (plano) > Vega (redação) > Masterson (tom/CTA) > Aurora (design PDF)
- **Aprovado em:** 10/03/2026
- **Próximo passo:** Vega inicia redação dos 6 blocos

### Torre Dona (hub.donasystem.com.br)
**Status:** Online e conectada ao gateway
**Repo:** isismor/donasystem (branch main, dir /hub)
**Infra:** Coolify (72.61.63.82) → Application Dockerfile → porta 3000
**Base:** Mission Control (Next.js + SQLite)
**Login:** isisalvesmoreira@gmail.com / hub#2027
**Gateway:** Conectado via controlUi (allowedOrigins: hub.donasystem.com.br, dangerouslyDisableDeviceAuth: true)
**Visual:** Design System ISIS v7 aplicado (cores e fontes), menu em inglês, conteúdo em português
**Painéis:** 28 (Tasks, Agents, Crons, Memory, Health, Tokens, Sessions, Activity, etc.)
**Concluído em:** 11/03/2026
**Pendente:** Ativar HTTPS, remover flags dangerously*, mover token do Dockerfile para build args

### Framework de Distribuição de Tráfego (Helios)
**Status:** Estruturado, aguardando token Meta funcional
**Conta:** act_777100762498033
**Estratégia:** Teste R$10/dia → Série A (R$30/dia, <R$0,50/seguidor) → Série B (R$10/dia, R$0,50-0,70) → Cortado (>R$0,70)
**Report:** Diário para Isis (gasto, séries ativas, custo/seguidor)
**Documento:** knowledge/helios/framework-distribuicao.md
**Pendente:** App Meta em modo Live, novo token via Marketing Essencial, conta desbloqueada
**Criado em:** 10/03/2026

### Doninha (Agente de Suporte Mentoria Skava)
**Status:** Em montagem
**Papel:** Suporte automatizado de alunas nos grupos de WhatsApp da Mentoria Skava
**Canais:** 2 grupos de WhatsApp da mentoria (acesso pendente)
**Tom:** Direta, humana, didática
**Operação:** 24h, responde dúvidas de conteúdo e técnicas com base fechada
**Limites:** Não vende, não dá dados pessoais, não inventa respostas fora da base
**Relatório:** PDF diário às 20h com resumo + lacunas
**Base de conhecimento:** knowledge/doninha/ (FAQ, PDO, Helios consolidado)
**Ciclo de atualização:** Lacunas no relatório > Isis responde > base atualizada > Doninha aprende
**Integração:** Módulo Doninha na Torre Dona (Atlas vai consolidar escopo)
**Pendente:**
- Isis adicionar nos 2 grupos de WhatsApp (amanhã)
- Definir número de WhatsApp da Doninha
- Puxar restante dos docs (truncados em 50KB)
- Eva estruturar identidade completa (IDENTITY.md, SOUL.md)
- Definir formato do relatório PDF diário
**Criado em:** 12/03/2026

## Backlog

- Configurar análise diária automática (08h SP) após ter acesso a dados do Instagram
- Integrar Cademi para acompanhar vendas e alunas
- Configurar email para Dona acessar
