# Lições Aprendidas

> Erros, padrões e aprendizados do dia a dia com o agente.
> Estratégicas = permanentes | Táticas = expiram em 30 dias

### 2026-03-11 — Deploy Torre Dona via Coolify (tática)
- Coolify Service Stack NÃO clona repo Git. Para build de Dockerfile do repo, usar tipo **Application**
- Servidor OpenClaw (72.60.241.247) não tem Docker. Coolify está em VPS separado (72.61.63.82)
- `pnpm.onlyBuiltDependencies` bloqueia compilação de nativos. Incluir na lista cada dependência nativa
- Next.js standalone não copia node_modules nativos. Copiar explicitamente do stage deps
- basePath só faz sentido em subpath. Em subdomínio próprio, remover

### 2026-03-11 — Tradução de UI NUNCA deve tocar nomes de código (ESTRATÉGICA)
- Find/replace de "Theme" para "Tema" converte `className`, `useTheme`, nomes de funções, tipos e interfaces
- Nomes de código em inglês são parte da sintaxe (React props, imports de libs externas, APIs). Traduzir quebra o build
- A tradução correta toca APENAS strings literais entre aspas/crases: labels, placeholders, títulos, mensagens de erro visíveis ao usuário
- Nunca traduzir: nomes de variáveis, funções, tipos, interfaces, props, imports, exports
- Antes de commitar tradução: rodar `pnpm build` localmente para validar que compila
- Se o build quebra em dezenas de arquivos, é mais seguro reverter tudo e refazer do que corrigir um a um

### 2026-03-11 — NEXT_PUBLIC_ são variáveis de build time (tática)
- Variáveis `NEXT_PUBLIC_*` do Next.js são injetadas no build, não em runtime
- Adicionar/alterar essas variáveis exige redeploy (rebuild) no Coolify
- Se o hub tenta WebSocket via `wss://` mas o gateway não tem SSL, a conexão falha silenciosamente e a UI fica vazia
- Solução: `NEXT_PUBLIC_GATEWAY_PROTOCOL=ws` quando gateway não tem SSL

### 2026-03-11 — Perda de contexto no restart (ESTRATÉGICA)
- Dona fez restart durante sessão ativa do Atlas. Toda a conversa anterior foi perdida
- Sessões de trabalho técnico devem ter checkpoints frequentes em memory/ (a cada milestone, não só no final)
- Lição: consolidar memória DURANTE o trabalho, não só quando pedido

## Estratégicas

### Crons
- SEMPRE usar `isolated + agentTurn + announce`. Nunca `systemEvent + main`. Cron com systemEvent mostra status ok mas durationMs ~0ms e não executa nada.
- Espaçar crons em pelo menos 15-30 min. Colisão de horários = rate limit = falhas silenciosas.
- `config.patch` reinicia o gateway e mata crons em execução. Fazer patches em horários sem crons rodando.

### Segurança
- `dmPolicy: allowlist` desde o Dia 1. Com "open", qualquer pessoa comanda o agente.
- Credenciais sempre no 1Password. Zero hardcode. Zero texto claro em .bashrc ou .env commitado.
- Rotação trimestral de API keys. Audit semanal.

### Contexto e Memória
- `reserveTokensFloor: 30000` garante que o agente termina o raciocínio antes de compactar.
- Session initialization leve: carregar só SOUL.md, USER.md, IDENTITY.md, memory/YYYY-MM-DD.md. Usar memory_search() sob demanda. Reduz de 50KB para 8KB.
- Compactação descarta 80% do contexto. Extrair ANTES é inviolável. Consolidação periódica é o safety net.

### APIs e Plataformas
- IPs de cloud (Hetzner, DigitalOcean, AWS) são bloqueados por YouTube, Instagram, X. Usar RapidAPI como proxy — já configurado.
- yt-dlp não funciona em VPS por bot detection. Usar Apify ou RapidAPI para transcrições.

### Sub-agents
- Todo agente novo começa N1 (Junior). Sem confiança automática.
- Sub-agent travou: retry 2x. Se falhar 2x: alertar Isis. Nunca limbo silencioso.
- Sub-agents em sandbox isolado não acessam localhost. Fallback manual necessário.

### Handoffs entre agentes
- Mensagem do bot no próprio tópico NÃO gera trigger de execução. Nunca depender disso para handoffs.
- Orquestrador deve usar completion events de sessions_spawn como gatilho para spawnar próximo step.
- Estado da cadeia sempre gravado em projects.md. Se sessão cair, retoma de onde parou.
- Briefings para Aurora devem ser estruturados (tipo, dimensões, público, referências, hierarquia). Texto solto = output ruim.
- Todo output: acentuação correta em português. Sem exceções.

### Modelos e Custo
- Heartbeat e crons: Haiku. Interação direta: Sonnet. Nunca Opus em automações.
- Lições estratégicas = permanentes. Táticas = expiram em 30 dias. Revisão mensal.

---

### PDF com design system
- `height: 297mm; overflow: hidden` em cada página é inviolável. Nunca `min-height` em PDF.
- `break-inside: avoid` + `min-height` = espaços em branco gigantes entre blocos. Bug clássico de impressão CSS.
- Distribuir conteúdo explicitamente por página. Não depender do algoritmo automático de quebra do browser.
- YakPDF: `wait.for: "timeout", milliseconds: 4000`. Nunca usar `"navigation"` (erro 400).
- Google Fonts carregam normalmente no Chromium headless do YakPDF.
- Template base salvo em `relatorio-domingo-v2.html` — reusar para próximos relatórios.

### Atualizações do OpenClaw (incidente 10/03/2026)
- NUNCA automatizar update do openclaw via cron. Breaking changes silenciosos derrubam o sistema sem aviso.
- Encerramento silencioso por token ausente: sobe e morre em ~9s sem mensagem de erro. Inspecionar .service primeiro.
- `openclaw gateway install --force` pode criar serviço duplicado (`openclaw.service` + `openclaw-gateway.service`). As duas instâncias competem pela porta e geram crash loop infinito.
- Jobs com `wakeMode: now` e `nextRunAtMs` no passado disparam imediatamente no startup. Ajustar para timestamp futuro antes de reativar após manutenção.
- Usar `auditd` para identificar origem de SIGTERM quando processo morre sem log: `auditctl -a always,exit -F arch=b64 -S kill -k sigterm_trace`
- Rollback deve ser considerado após 30-60 min sem convergência. Não insistir em fix-forward com versão opaca.
- Parar serviço antes de dormir durante incidente: `systemctl stop` + `disable` evita wear no restart counter.

### Gateway e Workspace
- Gateway cacheia workspace files (SOUL.md, AGENTS.md, etc). Editar sem restart = modelo usa versão antiga. Sempre reiniciar após mudanças.
- openclaw config set com valores negativos (ex: chat IDs do Telegram) precisa de "--" antes do valor pra não ser interpretado como flag.
- Hierarquia de prioridade: System prompt > SOUL.md > AGENTS.md > IDENTITY.md > USER.md/TOOLS.md
- Se SOUL.md ancora forte numa identidade, modelo resiste a assumir outra mesmo com AGENTS.md. Solução: SOUL.md deve mencionar explicitamente o sistema de identidades.
- Heartbeat to para Telegram topics: formato "<chatId>:topic:<threadId>".

### PDFs grandes e contexto
- PDFs de 300+ páginas travam sessões quando enviados pelo chat. O texto extraído inteiro vai pro prompt e estoura o contexto de 200k.
- Solução: usar ferramenta `pdf` com parâmetro `pages` pra processar em blocos (ex: "1-30", "31-60").
- Alternativa: gerar resumo em markdown no Claude.com e mandar como arquivo .md.
- Regra: arquivos grandes NUNCA vão direto no chat. Sempre processados em blocos.

### Arquivos via Telegram
- HTML grande (75kb+) colado no chat trava a sessão. Sempre enviar como arquivo anexo.
- Arquivos de até 1,5MB chegam sem problema via Telegram.

## Táticas

### Notion API
- Retorna só a primeira página por padrão. Sempre implementar paginação (`has_more` + `start_cursor`). Expira: 2026-04-09

### systemd override
- Se o gateway rodar via systemd, o arquivo .service sobrescreve o .env. Atualizar AMBOS ao trocar credenciais. Verificar se aplicável ao nosso setup. Expira: 2026-04-09

### Brave Search
- Instabilidade ocasional. Ter fallback com web_fetch direto na URL. Expira: 2026-04-09

---

*Revisão mensal: deletar táticas vencidas.*
