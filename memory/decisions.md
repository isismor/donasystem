# Decisões Permanentes

> Decisões que o agente deve respeitar SEMPRE.

### Credenciais no 1Password (08/03/2026)
Toda credencial vive no 1Password. Sem excecoes. Nunca hardcodar chaves em codigo, .env ou markdown.

### Dona nao e conhecida pela equipe (08/03/2026)
Marlua e Erica nao sabem que Dona existe. Qualquer mencao para equipe externa exige aprovacao de Isis.

### Acoes vermelhas exigem aprovacao explicita (08/03/2026)
Postar no Instagram, enviar email em nome de Isis, apagar conteudo, executar integracoes novas, decisoes estrategicas — todas exigem aprovacao antes de agir.

### Tom de comunicacao (08/03/2026)
Sem emojis. Sem travessao. Sem corporativismo. Sem ingles desnecessario. Genero neutro. Bullet points. Direto.

---

## 10 Regras Invioaveis (09/03/2026)
Licoes de 13 dias rodando agentes AI em producao. Inviolaveis.

### Regra 1 — Crons sempre isolated + agentTurn
sessionTarget: "isolated", payload.kind: "agentTurn", delivery: { mode: "announce" }.
Nunca systemEvent + main em crons (durationMs ~0ms, nao executa nada).

### Regra 2 — Nunca hardcodar credenciais
Todas as chaves vivem no .env (chmod 600) ou 1Password. Zero excecoes.

### Regra 3 — dmPolicy: allowlist desde o Dia 1
Telegram ID configurado no allowlist antes de qualquer outra coisa. Nunca deixar "open".

### Regra 4 — Extrair licoes ANTES de cada compactacao (INVIOLAVEL)
Antes de CADA compactacao: licoes → lessons.md, decisoes → decisions.md, pendencias → pending.md.
Compactacao descarta 80% do contexto. Sem extracao = HD formatado sem backup.

### Regra 5 — Todo agente novo começa N1 (Junior)
Sem autonomia sem historico. N1 = output sempre revisado. Promocao via performance review semanal.
Sistema de niveis: N1 Junior · N2 Pleno · N3 Senior · N4 Principal

### Regra 6 — Split de modelos por custo
Crons de execucao: Sonnet. Heartbeats: Haiku. Interacao direta e analise estrategica: Opus.
Sem split = $100-150/mes. Com split = $18-36/mes.

### Regra 7 — Backup antes de mudancas estruturais
Antes de criar agentes, modificar gateway config ou reorganizar workspace: salvar config + criar ROLLBACK.md.
config.patch reinicia gateway e mata crons em execucao.

### Regra 8 — Sub-agent travou: retry 2x, depois alerta humano
Nunca fire and forget. Sucesso = resumo. Falha = retry 2x. Falhou 2x = alerta imediato.

### Regra 9 — SOUL.md personalizado nao e opcional
Anti-patterns com exemplos. "Never dos" explicitos. USER.md com 400+ linhas ideal.
SOUL.md generico = agente generico = ChatGPT caro.

### Regra 10 — Creators sao skills, nao agentes
LinkedIn Creator, Newsletter Writer, Instagram Caption = prompts/skills dentro de 1 agente.
1 agente com 8 skills > 8 agentes separados. Cada agente extra = mais custo, mais falha, cold start.

### Arquitetura: supergrupo com topicos, nao grupos separados (09/03/2026)
Um unico agente main. Dona assume identidades por topico via AGENTS.md. Workspace e memoria centralizados. Binding unico. Grupos separados so fazem sentido com isolamento real (segunda empresa, cliente diferente).

### Cache do gateway: restart obrigatorio apos editar workspace files (10/03/2026)
O gateway cacheia SOUL.md, AGENTS.md e outros workspace files. Editar sem restart = modelo usa versao antiga. Sempre reiniciar gateway apos mudancas nos MDs.

### SOUL.md deve mencionar sistema de identidades (10/03/2026)
Se SOUL.md diz apenas "Nome: Dona" sem explicar que assumir identidades por topico e parte do design, o modelo resiste a trocar de persona. O sistema de identidades precisa estar explicito no SOUL.md.

### Heartbeat para Telegram topics: formato do campo to (10/03/2026)
Formato correto: `to: "<chatId>:topic:<threadId>"`. Exemplo: `"-1003514367085:topic:4"`.

### Design system como fonte da verdade (09/03/2026)
Qualquer material visual gerado por Dona usa obrigatoriamente os tokens do Design System ISIS v7.
Arquivo em `memory/design-system-isis-v7.html` e resumo em `memory/design-system.md`.
Nunca improvisar cores, fontes ou espaçamentos fora do sistema.

### Pipeline de cadeias: Atlas orquestra, Dona supervisiona (10/03/2026)
Cadeias com 2+ agentes são orquestradas por Atlas. Dona supervisiona e faz override se travar. Tarefas diretas (1 agente) ficam com Dona. Sem sobreposição. Gates vermelhos (output público) param e esperam ok de Isis. Gates verdes (conteúdo bruto entre agentes) seguem automático. Estado sempre gravado em projects.md. Modelo completo em `memory/pipeline-model.md`.

### Acentuação obrigatória em output público (10/03/2026)
Todo material que vira público deve ter acentuação correta em português. Guardrail global no AGENTS.md.

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

### Bonus — 3 regras operacionais
- Espacar crons por 15-30 min (colisao = rate limit)
- config.patch em horario sem crons (reinicia gateway e mata crons rodando)
- systemEvent nao notifica no Telegram — usar agentTurn + message send para lembretes
