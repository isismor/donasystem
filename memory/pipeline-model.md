# Modelo de Pipeline de Cadeias

> Definido em 10/03/2026. Aprovado por Isis.

## Conceito

Quando um material exige 2+ agentes em sequência, a produção segue um pipeline orquestrado.
O orquestrador (Atlas ou Dona) controla cada step, monitora completion events e garante handoffs.

## Quem orquestra

- **Atlas:** cadeias de produção com 2+ agentes (materiais, ebooks, campanhas)
- **Dona:** tarefas diretas, análises, override de cadeias travadas

Sem sobreposição. Se Isis pede no tópico do Atlas, Atlas assume. Se pede no tópico da Dona, Dona assume (pode delegar pra Atlas se for cadeia).

## Fluxo de execução

1. Orquestrador define a cadeia completa (ex: Vega > Masterson > Aurora)
2. Spawna o primeiro agente via sessions_spawn
3. Monitora completion event
4. Ao completar:
   a. Verifica output (qualidade mínima)
   b. Atualiza projects.md com status do step
   c. Verifica se próximo step é verde ou vermelho
5. Se verde: spawna próximo agente automaticamente
6. Se vermelho: notifica Isis com resumo + pergunta clara, espera aprovação
7. Repete até cadeia completa

## Gates

| Tipo | Classificação | Ação |
|---|---|---|
| Conteúdo bruto entre agentes | Verde | Segue automático |
| Design/formatação entre agentes | Verde | Segue automático |
| Output público | Vermelho | Para, notifica Isis, espera ok |
| Uso de voz/nome/identidade de Isis | Vermelho | Para, notifica Isis, espera ok |

## Recuperação de falhas

- Sub-agent falhou: retry 2x (Regra 8)
- Falhou 2x: alerta Dona (se Atlas orquestra) ou alerta Isis (se Dona orquestra)
- Sessão caiu no meio: estado gravado em projects.md com step atual. Ao voltar, lê estado e retoma

## Notificação por etapa

Ao completar cada step, notificar Isis no tópico da Dona (ID 2) com:
- O que foi feito
- Output gerado (arquivo ou resumo)
- Próximo step
- Se precisa de aprovação: pergunta clara

## Regras de qualidade

- Todo output público: acentuação correta em português
- Briefings para Aurora: estruturados (tipo de peça, dimensões, público, referências visuais, hierarquia)
- Nunca texto solto como input de design
