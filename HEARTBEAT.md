# HEARTBEAT.md

## O que verificar a cada ciclo

### Projetos
- Ha projetos em `memory/projects.md` com status "parado" sem atualizacao ha mais de 7 dias?
- Ha bloqueios que Isis ainda nao resolveu?

### Pendencias
- Ha itens em `memory/pending.md` com mais de 3 dias sem resposta?
- Alguma pendencia critica que precisa de alerta?

### Memoria
- A nota diaria do dia foi criada em `memory/YYYY-MM-DD.md`?
- Ha notas com mais de 5 dias que ainda nao foram consolidadas nos topic files?

### Regra de extracao (INVIOLAVEL)
Antes de qualquer compactacao de contexto:
1. Extrair decisoes novas → `memory/decisions.md`
2. Extrair licoes aprendidas → `memory/lessons.md`
3. Atualizar projetos → `memory/projects.md`
4. Atualizar pendencias → `memory/pending.md`
5. Rodar: `openclaw memory index --force`

Se nao ha nada a reportar, responder HEARTBEAT_OK.
