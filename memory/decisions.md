# Decisões Permanentes

> Decisões que o agente deve respeitar SEMPRE.

### Framework de Distribuição de Tráfego aprovado (10/03/2026)
- Ciclo: Teste (R$10/1 dia) → Série A (<R$0,50/seguidor, R$30/dia) → Série B (R$0,50-0,70, R$10/dia) → Cortado (>R$0,70)
- Report diário obrigatório: gasto, séries ativas, custo/seguidor
- Todo post novo entra em teste antes de receber verba contínua
- Documento: knowledge/helios/framework-distribuicao.md

### Torre Dona — painel operacional (11/03/2026)
- URL: hub.donasystem.com.br
- Base: Mission Control (Next.js + SQLite)
- Deploy: Coolify (72.61.63.82), tipo Application, Dockerfile, base dir `/hub`
- Gateway: OpenClaw (72.60.241.247:18789), bind "lan", allowedOrigins configurados
- Visual: Design System ISIS v7 (paleta aplicada), UI ainda em inglês (tradução PT-BR pendente)
- Env vars no Coolify: NEXT_PUBLIC_GATEWAY_HOST, NEXT_PUBLIC_GATEWAY_PORT, NEXT_PUBLIC_GATEWAY_PROTOCOL
- Pendente: HTTPS, remover flags dangerously*, token do gateway, tradução da UI (só strings)

### Pipeline de PDF unificado para todos os agentes (11/03/2026)
- Documento canônico: `knowledge/pdf-pipeline.md`
- TODO agente que gerar PDF deve seguir o mesmo pipeline: Template C + Puppeteer local + Design System ISIS v7
- Método principal: `scripts/html-to-pdf.js` (Puppeteer). Fallback: YakPDF via RapidAPI.
- Referência adicionada em AGENTS.md para Atlas, Aurora, Masterson, Harpia, Vega + guardrail global
- Decisão de Isis: padronizar para que qualquer tópico/agente produza PDF com o mesmo método e qualidade

### Credenciais no 1Password (08/03/2026)
Toda credencial vive no 1Password. Sem exceções. Nunca hardcodar chaves em código, .env ou markdown.

### Dona não é conhecida pela equipe (08/03/2026)
Marlua e Érica não sabem que Dona existe. Qualquer menção para equipe externa exige aprovação de Isis.

### Ações vermelhas exigem aprovação explícita (08/03/2026)
Postar no Instagram, enviar email em nome de Isis, apagar conteúdo, executar integrações novas, decisões estratégicas — todas exigem aprovação antes de agir.

### Tom de comunicação (08/03/2026)
Sem emojis. Sem travessão. Sem corporativismo. Sem inglês desnecessário. Gênero neutro. Bullet points. Direto.

---

## 10 Regras Invioláveis (09/03/2026)
Lições de 13 dias rodando agentes AI em produção. Invioláveis.

### Regra 1 — Crons sempre isolated + agentTurn
sessionTarget: "isolated", payload.kind: "agentTurn", delivery: { mode: "announce" }.
Nunca systemEvent + main em crons (durationMs ~0ms, não executa nada).

### Regra 2 — Nunca hardcodar credenciais
Todas as chaves vivem no .env (chmod 600) ou 1Password. Zero exceções.

### Regra 3 — dmPolicy: allowlist desde o Dia 1
Telegram ID configurado no allowlist antes de qualquer outra coisa. Nunca deixar "open".

### Regra 4 — Extrair lições ANTES de cada compactação (INVIOLÁVEL)
Antes de CADA compactação: lições → lessons.md, decisões → decisions.md, pendências → pending.md.
Compactação descarta 80% do contexto. Sem extração = HD formatado sem backup.

### Regra 5 — Todo agente novo começa N1 (Junior)
Sem autonomia sem histórico. N1 = output sempre revisado. Promoção via performance review semanal.
Sistema de níveis: N1 Junior · N2 Pleno · N3 Sênior · N4 Principal

### Regra 6 — Split de modelos por custo
Crons de execução: Sonnet. Heartbeats: Haiku. Interação direta e análise estratégica: Opus.
Sem split = $100-150/mês. Com split = $18-36/mês.

### Regra 7 — Backup antes de mudanças estruturais
Antes de criar agentes, modificar gateway config ou reorganizar workspace: salvar config + criar ROLLBACK.md.
config.patch reinicia gateway e mata crons em execução.

### Regra 8 — Sub-agent travou: retry 2x, depois alerta humano
Nunca fire and forget. Sucesso = resumo. Falha = retry 2x. Falhou 2x = alerta imediato.

### Regra 9 — SOUL.md personalizado não é opcional
Anti-patterns com exemplos. "Never dos" explícitos. USER.md com 400+ linhas ideal.
SOUL.md genérico = agente genérico = ChatGPT caro.

### Regra 10 — Creators são skills, não agentes
LinkedIn Creator, Newsletter Writer, Instagram Caption = prompts/skills dentro de 1 agente.
1 agente com 8 skills > 8 agentes separados. Cada agente extra = mais custo, mais falha, cold start.

### Arquitetura: supergrupo com tópicos, não grupos separados (09/03/2026)
Um único agente main. Dona assume identidades por tópico via AGENTS.md. Workspace e memória centralizados. Binding único. Grupos separados só fazem sentido com isolamento real (segunda empresa, cliente diferente).

### Cache do gateway: restart obrigatório após editar workspace files (10/03/2026)
O gateway cacheia SOUL.md, AGENTS.md e outros workspace files. Editar sem restart = modelo usa versão antiga. Sempre reiniciar gateway após mudanças nos MDs.

### SOUL.md deve mencionar sistema de identidades (10/03/2026)
Se SOUL.md diz apenas "Nome: Dona" sem explicar que assumir identidades por tópico é parte do design, o modelo resiste a trocar de persona. O sistema de identidades precisa estar explícito no SOUL.md.

### Heartbeat para Telegram topics: formato do campo to (10/03/2026)
Formato correto: `to: "<chatId>:topic:<threadId>"`. Exemplo: `"-1003514367085:topic:4"`.

### Design system como fonte da verdade (09/03/2026)
Qualquer material visual gerado por Dona usa obrigatoriamente os tokens do Design System ISIS v7.
Arquivo em `memory/design-system-isis-v7.html` e resumo em `memory/design-system.md`.
Nunca improvisar cores, fontes ou espaçamentos fora do sistema.

### Pipeline de cadeias: Atlas orquestra, Dona supervisiona (10/03/2026)
Cadeias com 2+ agentes são orquestradas por Atlas. Dona supervisiona e faz override se travar. Tarefas diretas (1 agente) ficam com Dona. Sem sobreposição. Gates vermelhos (output público) param e esperam ok de Isis. Gates verdes (conteúdo bruto entre agentes) seguem automático. Estado sempre gravado em projects.md. Modelo completo em `memory/pipeline-model.md`.

### Acentuação obrigatória em todo contexto (10/03/2026)
Todo texto produzido por qualquer agente, em qualquer contexto (chats, materiais, outputs, páginas, memory files), deve usar português correto com acentuação. Sem exceções.

### Briefings estruturados para Aurora (10/03/2026)
Briefings para Aurora devem conter: tipo de peça, dimensões, público, referências visuais, hierarquia de conteúdo. Nunca texto solto.

### Dona NUNCA atualiza openclaw de forma autônoma (10/03/2026)
Atualizações do openclaw podem introduzir breaking changes silenciosos (token obrigatório, instabilidade de provedor). Todo update exige supervisão manual de Isis e validação do serviço. Sem exceções. Sem cron de auto-update. Incidente de 5 horas de downtime em 10/03/2026 comprovou o risco. Post-mortem completo em `media/inbound/incidente_openclaw_10-03-2026_postmortem*.md`.

### Nunca executar `openclaw gateway install --force` durante diagnóstico (10/03/2026)
Cria serviço duplicado que gera crash loop. Sempre verificar `systemctl list-unit-files | grep openclaw` antes e depois de qualquer intervenção no serviço.

### Verificar .service após qualquer atualização do openclaw (10/03/2026)
Variáveis de ambiente (token, etc) podem ser removidas silenciosamente por um novo install. Inspecionar o arquivo .service é o primeiro passo em qualquer crash loop.

### Rollback é prioridade quando investigação não converge (10/03/2026)
Se o comportamento da nova versão é opaco e a investigação não converge após 30-60 minutos, rollback imediato. Não insistir em fix-forward.

### Bônus — 3 regras operacionais
- Espaçar crons por 15-30 min (colisão = rate limit)
- config.patch em horário sem crons (reinicia gateway e mata crons rodando)
- systemEvent não notifica no Telegram — usar agentTurn + message send para lembretes
