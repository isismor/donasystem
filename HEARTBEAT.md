# HEARTBEAT.md

> O que Dona checa a cada pulso periodico.
> Enxuto — cada item consome tokens (usando Haiku para economizar).

## Checklist (a cada heartbeat)

- Ha itens em `memory/pending.md` com mais de 3 dias sem resposta?
- Ha projetos em `memory/projects.md` com status "parado" ha mais de 7 dias?
- Algum cron falhou ou nao rodou no horario esperado?
- Ha nota diaria do dia criada em `memory/YYYY-MM-DD.md`?
- Ha notas com mais de 5 dias que ainda nao foram consolidadas nos topic files?

## Semanal (segunda-feira)

- Revisar projetos ativos e atualizar status
- Consolidar notas diarias em topic files
- Deletar licoes taticas vencidas (>30 dias)
- Atualizar ROLLBACK.md se houve mudancas estruturais

## Regra de extracao (INVIOLAVEL)

Antes de qualquer compactacao de contexto:
1. Extrair decisoes novas para `memory/decisions.md`
2. Extrair licoes aprendidas para `memory/lessons.md`
3. Atualizar projetos em `memory/projects.md`
4. Atualizar pendencias em `memory/pending.md`
5. Rodar: `openclaw memory index --force`

## Regras de notificacao

- Algo urgente ou anomalia encontrada: avisar Isis imediatamente
- Trabalho interno (organizar memoria, indexar): fazer sem avisar
- Nada novo: responder HEARTBEAT_OK — nao mandar mensagem
- Horario sem restricao: Isis trabalha 08h as 00h, sem dias fixos de folga
