# Lições Aprendidas

> Erros, padrões e aprendizados do dia a dia.
> Estratégicas = permanentes | Táticas = expiram em 30 dias

---

## Estratégicas (permanentes)

### Crons & Gateway
- SEMPRE usar `isolated + agentTurn + announce`. Nunca `systemEvent + main`. Cron com systemEvent mostra status ok mas durationMs ~0ms e não executa nada.
- Espaçar crons em pelo menos 15-30 min. Colisão de horários = rate limit = falhas silenciosas.
- `config.patch` reinicia o gateway e mata crons em execução. Fazer patches em horários sem crons rodando.

### Segurança
- `dmPolicy: allowlist` desde o Dia 1. Com "open", qualquer pessoa comanda o agente.
- Credenciais sempre no 1Password. Zero hardcode. Zero texto claro em .bashrc ou .env commitado.

### Contexto e Memória
- Compactação descarta 80% do contexto. Extrair ANTES é inviolável.
- Consolidar memória DURANTE o trabalho, não só quando pedido. Sessões de trabalho técnico devem ter checkpoints frequentes.
- Session initialization leve: carregar só SOUL.md, USER.md, IDENTITY.md. Usar memory_search() sob demanda.

### APIs e Plataformas
- IPs de cloud (Hetzner, DigitalOcean, AWS) são bloqueados por YouTube, Instagram, X. Usar RapidAPI como proxy.
- yt-dlp não funciona em VPS por bot detection. Usar Apify ou RapidAPI para transcrições.

### Sub-agents & Handoffs
- Mensagem do bot no próprio tópico NÃO gera trigger de execução. Nunca depender disso para handoffs.
- Orquestrador deve usar completion events de sessions_spawn como gatilho para spawnar próximo step.
- Estado da cadeia sempre gravado em projects.md. Se sessão cair, retoma de onde parou.

### Modelos e Custo
- Heartbeat e crons: Haiku. Interação direta: Sonnet/Opus. Nunca Opus em automações.

### PDF & Design
- `height: 297mm; overflow: hidden` em cada página é inviolável. Nunca `min-height` em PDF.
- `break-inside: avoid` + `min-height` = espaços em branco gigantes entre blocos.
- Distribuir conteúdo explicitamente por página. Não depender do algoritmo automático de quebra do browser.
- YakPDF: `wait.for: "timeout", milliseconds: 4000`. Nunca usar `"navigation"` (erro 400).
- Google Fonts carregam normalmente no Chromium headless do YakPDF.

### Atualizações do OpenClaw
- NUNCA automatizar update do openclaw via cron. Breaking changes silenciosos derrubam o sistema sem aviso.
- Encerramento silencioso por token ausente: sobe e morre em ~9s sem mensagem de erro. Inspecionar .service primeiro.
- `openclaw gateway install --force` pode criar serviço duplicado. As duas instâncias competem pela porta e geram crash loop infinito.
- Jobs com `wakeMode: now` e `nextRunAtMs` no passado disparam imediatamente no startup.
- Rollback deve ser considerado após 30-60 min sem convergência. Não insistir em fix-forward com versão opaca.

### Deploy & Infraestrutura
- Coolify Service Stack NÃO clona repo Git. Para build de Dockerfile do repo, usar tipo Application.
- `pnpm.onlyBuiltDependencies` bloqueia compilação de nativos. Incluir cada dependência nativa na lista.
- Next.js standalone não copia node_modules nativos. Copiar explicitamente do stage deps.
- Variáveis `NEXT_PUBLIC_*` do Next.js são injetadas no BUILD TIME. Alterar .env sem rebuild não muda nada no browser.
- `NEXT_PUBLIC_GATEWAY_HOST` deve ser o IP/domínio do servidor, NUNCA `127.0.0.1`.

### Tradução de UI NUNCA deve tocar nomes de código
- Find/replace de "Theme" para "Tema" converte `className`, `useTheme`, nomes de funções, tipos e interfaces.
- A tradução correta toca APENAS strings literais. Nunca traduzir variáveis, funções, tipos, interfaces, props, imports, exports.

### Device Identity no OpenClaw
- Gateway só reconhece `client.id === "openclaw-control-ui"` como Control UI. Qualquer outro client ID NÃO recebe bypass de `dangerouslyDisableDeviceAuth`.
- HTTP (non-secure context) bloqueia WebCrypto: browser não consegue gerar device identity.

### Firewall de datacenter bloqueia portas não padrão
- Servidor 72.60.241.247: apenas portas 18789 (gateway) e SSH estão abertas para tráfego externo.
- Qualquer serviço novo deve rodar na porta 18789 ou atrás de proxy nela.
- Nunca gastar tempo debugando código quando o browser mostra timeout: verificar firewall primeiro.

### OpenClaw tem Control UI nativo na porta do gateway
- Gateway serve painel web embutido em `http://<host>:18789/`.
- Precisa configurar `gateway.controlUi.allowedOrigins` com o IP/domínio de acesso externo.

### PDFs grandes travam sessões
- PDFs de 300+ páginas travam quando enviados pelo chat (estoura contexto de 200k).
- Solução: usar ferramenta `pdf` com parâmetro `pages` pra processar em blocos.
- Regra: arquivos grandes NUNCA vão direto no chat.

### Arquivos via Telegram
- HTML grande (75kb+) colado no chat trava a sessão. Sempre enviar como arquivo anexo.
- Arquivos de até 1,5MB chegam sem problema via Telegram.

### Elevated tools em sessão de grupo
- Adicionar `tools.elevated` via config.patch e reiniciar gateway NÃO garante elevated na sessão atual.
- Sessão pode precisar ser nova, ou elevated tem restrições em grupo Telegram.

### Coolify: variáveis Build vs Runtime
- No Coolify, variáveis marcadas como "Runtime" NÃO são injetadas no build do Next.js.
- `NEXT_PUBLIC_*` PRECISA estar marcada como "Build" (ou "Build + Runtime").

### Versões do OpenClaw podem mudar defaults silenciosamente (12/03/2026)
- Versão 2026.3.2: mudou default de `tools.exec.security` para "allowlist" e `tools.exec.ask` para "on-miss".
- Sempre definir `tools.exec.security: "full"` e `tools.exec.ask: "off"` explicitamente na config para manter comportamento esperado.

---

## Táticas (expiram em 30 dias)

### Cookie secure:true quebra login em HTTP (12/03/2026, expira 12/04/2026)
- Next.js em NODE_ENV=production seta cookies com `secure: true` por padrão.
- Cookie secure não funciona em HTTP (browser ignora) > redirect loop infinito.
- Fix: `MC_COOKIE_SECURE=false` ou servir via HTTPS.

### Notion API paginação (09/03/2026, expira 09/04/2026)
- Retorna só a primeira página por padrão. Sempre implementar paginação (`has_more` + `start_cursor`).

### Brave Search instável (09/03/2026, expira 09/04/2026)
- Instabilidade ocasional. Ter fallback com web_fetch direto na URL.

---

*Revisão mensal: deletar táticas vencidas.*
