# HEARTBEAT.md

> O que Dona checa a cada pulso periódico.
> Enxuto — cada item consome tokens (usando Haiku para economizar).

## Checklist (a cada heartbeat)

- Há itens em `memory/pending.md` com mais de 3 dias sem resposta?
- Há projetos em `memory/projects.md` com status "parado" há mais de 7 dias?
- Algum cron falhou ou não rodou no horário esperado?
- Há nota diária do dia criada em `memory/YYYY-MM-DD.md`?
- Há notas com mais de 5 dias que ainda não foram consolidadas nos topic files?

## Semanal (segunda-feira)

- Revisar projetos ativos e atualizar status
- Consolidar notas diárias em topic files
- Deletar lições táticas vencidas (>30 dias)
- Atualizar ROLLBACK.md se houve mudanças estruturais

## Regra de extração (INVIOLÁVEL)

Antes de qualquer compactação de contexto:
1. Extrair decisões novas para `memory/decisions.md`
2. Extrair lições aprendidas para `memory/lessons.md`
3. Atualizar projetos em `memory/projects.md`
4. Atualizar pendências em `memory/pending.md`
5. Rodar: `openclaw memory index --force`

## Regras de notificação

- Algo urgente ou anomalia encontrada: avisar Isis imediatamente
- Trabalho interno (organizar memória, indexar): fazer sem avisar
- Nada novo: responder HEARTBEAT_OK — não mandar mensagem
- Horário sem restrição: Isis trabalha 08h às 00h, sem dias fixos de folga
