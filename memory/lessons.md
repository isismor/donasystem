# Lições Aprendidas

> Erros, padrões e aprendizados do dia a dia com o agente.
> Estratégicas = permanentes | Táticas = expiram em 30 dias

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
- Todo agente novo começa L1 (Observer). Sem confiança automática.
- Sub-agent travou: retry 2x. Se falhar 2x: alertar Isis. Nunca limbo silencioso.
- Sub-agents em sandbox isolado não acessam localhost. Fallback manual necessário.

### Modelos e Custo
- Heartbeat e crons: Haiku. Interação direta: Sonnet. Nunca Opus em automações.
- Lições estratégicas = permanentes. Táticas = expiram em 30 dias. Revisão mensal.

---

## Táticas

### Notion API
- Retorna só a primeira página por padrão. Sempre implementar paginação (`has_more` + `start_cursor`). Expira: 2026-04-09

### systemd override
- Se o gateway rodar via systemd, o arquivo .service sobrescreve o .env. Atualizar AMBOS ao trocar credenciais. Verificar se aplicável ao nosso setup. Expira: 2026-04-09

### Brave Search
- Instabilidade ocasional. Ter fallback com web_fetch direto na URL. Expira: 2026-04-09

---

*Revisão mensal: deletar táticas vencidas.*
