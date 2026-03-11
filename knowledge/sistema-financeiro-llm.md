# Sistema Financeiro LLM — DonaSystem

> Referência canônica de custos, uso e otimização dos modelos de linguagem.
> Atualizado: 11 de março de 2026

---

## 1. Modelos disponíveis (Anthropic Claude)

Nosso provider é Anthropic. Todos os modelos abaixo são acessados via API key direta.

| Modelo | Input (por 1M tokens) | Output (por 1M tokens) | Perfil de uso |
|--------|----------------------|------------------------|---------------|
| Claude 3 Haiku | US$ 0,25 | US$ 1,25 | Descontinuado |
| **Claude 4.5 Haiku** | **US$ 1,00** | **US$ 5,00** | Tarefas rotineiras, crons, checagens |
| Claude 3.5 Sonnet | US$ 3,00 | US$ 15,00 | Tarefas intermediárias |
| **Claude 4.6 Sonnet** | **US$ 3,00** | **US$ 15,00** | Produção de conteúdo, análise |
| Claude 3 Opus (legado) | US$ 15,00 | US$ 75,00 | Descontinuado (5x mais caro) |
| **Claude 4.6 Opus** | **US$ 5,00** | **US$ 25,00** | Raciocínio complexo, estratégia |

### Cache de prompt (prompt caching)
Tokens cacheados custam 90% menos na entrada. O OpenClaw usa cache automaticamente para contexto repetido (system prompt, workspace files, AGENTS.md, SOUL.md etc.).

| Tipo | Input normal | Input cacheado | Economia |
|------|-------------|----------------|----------|
| Haiku 4.5 | US$ 1,00/M | US$ 0,10/M | 90% |
| Sonnet 4.6 | US$ 3,00/M | US$ 0,30/M | 90% |
| Opus 4.6 | US$ 5,00/M | US$ 0,50/M | 90% |

---

## 2. Nossa configuração atual

### Modelo padrão
**Claude Opus 4.6** (`anthropic/claude-opus-4-6`)

Esse é o modelo usado em todas as conversas diretas com Isis e em qualquer cron ou subagente que não especifique modelo.

### Perfis de autenticação
| Perfil | Tipo | Prioridade |
|--------|------|-----------|
| `anthropic:manual` | Token | 1 (primário) |
| `anthropic:default` | API Key | 2 |
| `anthropic:donabot` | Token | 3 (fallback) |

---

## 3. Uso por componente

### Conversas diretas (tópicos do Equipe)
| Componente | Modelo | Justificativa |
|-----------|--------|---------------|
| Dona (tópico 2) | Opus 4.6 | Decisões complexas, estratégia, orquestração |
| Eva (tópico 5) | Opus 4.6 | Arquitetura de agentes requer raciocínio profundo |
| Aurora (tópico 6) | Opus 4.6 | Geração de HTML/CSS/design complexo |
| Harpia (tópico 7) | Opus 4.6 | Roteiros, direção criativa |
| Masterson (tópico 8) | Opus 4.6 | Escrita longa, persuasão, copy |
| Vega (tópico 10) | Opus 4.6 | Conteúdo, pesquisa de tendências |
| Orion (tópico 11) | Opus 4.6 | Código, automações |
| Helios (tópico 12) | Opus 4.6 | Análise de tráfego, Meta Ads API |
| Nexa (tópico 14) | Opus 4.6 | Geração de imagens, curadoria visual |
| Atlas (tópico 15) | Opus 4.6 | Orquestração de cadeias, planejamento |

### Crons automatizados (9 ativos)
| Cron | Modelo | Frequência | Custo relativo |
|------|--------|-----------|----------------|
| health-monitor | Opus 4.6 (padrão) | A cada 1h (24x/dia) | ALTO |
| checagem-proativa-6h | **Haiku 4.5** | 4x/dia (08,12,16,20h SP) | BAIXO |
| organizacao-memoria-diaria | **Haiku 4.5** | 1x/dia (23h SP) | BAIXO |
| backup-diario | Opus 4.6 (padrão) | 1x/dia (03h SP) | MEDIO |
| watchdog-monitor-crons | **Haiku 4.5** | 1x/dia (09h SP) | BAIXO |
| stats-collector | Opus 4.6 (padrão) | 1x/dia (11h SP) | MEDIO |
| task-reminder | Opus 4.6 (padrão) | 1x/dia (14h SP) | MEDIO |
| security-audit-semanal | **Haiku 4.5** | 1x/semana (dom 10h SP) | BAIXO |
| consolidacao-memoria-semanal | Opus 4.6 (padrão) | 1x/semana (seg 02h SP) | MEDIO |

---

## 4. Estimativa de custos mensais

### Premissas
- Contexto médio por conversa: ~50k tokens de entrada (system prompt + workspace + histórico)
- Output médio por resposta: ~2k tokens
- Cache hit rate: ~16% (medido hoje)
- Conversas diretas: ~50/dia (estimativa conservadora)
- Subagentes: ~10 spawns/dia

### Crons (custos fixos mensais)

| Cron | Modelo | Execuções/mês | Tokens estimados (in+out) | Custo estimado |
|------|--------|---------------|--------------------------|----------------|
| health-monitor | Opus | 720 | ~15k in + 500 out por exec | ~US$ 63 |
| checagem-proativa | Haiku | 120 | ~15k in + 500 out | ~US$ 2,10 |
| organizacao-memoria | Haiku | 30 | ~20k in + 2k out | ~US$ 0,90 |
| backup-diario | Opus | 30 | ~10k in + 500 out | ~US$ 1,88 |
| watchdog | Haiku | 30 | ~15k in + 1k out | ~US$ 0,60 |
| stats-collector | Opus | 30 | ~15k in + 2k out | ~US$ 3,75 |
| task-reminder | Opus | 30 | ~15k in + 1k out | ~US$ 3,00 |
| security-audit | Haiku | 4 | ~15k in + 1k out | ~US$ 0,08 |
| consolidacao-semanal | Opus | 4 | ~30k in + 3k out | ~US$ 0,90 |
| **Total crons** | | **~998** | | **~US$ 76/mês** |

### Conversas interativas (custos variáveis)

| Tipo | Modelo | Volume estimado | Custo estimado/mês |
|------|--------|-----------------|--------------------|
| Conversas com Isis (todos os tópicos) | Opus | ~1500 mensagens | ~US$ 150-300 |
| Subagentes (produção de materiais) | Opus | ~300 spawns | ~US$ 50-100 |
| **Total interativo** | | | **~US$ 200-400/mês** |

### Custo total estimado: US$ 276 a US$ 476/mês

---

## 5. Comparativo de cenários

### Cenário A: Tudo no Opus (atual parcial)
Custo estimado: **US$ 350-500/mês**

### Cenário B: Opus para Isis + Sonnet para produção + Haiku para crons
Custo estimado: **US$ 150-250/mês** (economia de ~50%)

### Cenário C: Sonnet como padrão + Opus só para estratégia
Custo estimado: **US$ 100-180/mês** (economia de ~65%)

### Cenário D: Haiku para tudo (mínimo viável)
Custo estimado: **US$ 30-60/mês** (economia de ~85%)
Risco: perda significativa de qualidade em raciocínio complexo, copy e código.

---

## 6. Otimizações já implementadas

1. **Crons com Haiku**: 4 dos 9 crons já usam `anthropic/claude-haiku-4-5`, economizando ~80% nesses jobs
2. **Prompt caching**: Cache automático do OpenClaw (16% hit rate atual)
3. **Compactação de contexto**: Sessões longas compactam automaticamente, reduzindo tokens repetidos
4. **Heartbeat silencioso**: Crons que não encontram problemas respondem HEARTBEAT_OK sem gerar conversa

---

## 7. Otimizações recomendadas (não implementadas)

### Prioridade alta (impacto imediato)

| Ação | Economia estimada | Esforço |
|------|-------------------|---------|
| Migrar health-monitor para Haiku | ~US$ 61/mês | 1 minuto (trocar model no cron) |
| Migrar backup-diario para Haiku | ~US$ 1,50/mês | 1 minuto |
| Migrar stats-collector para Sonnet | ~US$ 1,50/mês | 1 minuto |
| Migrar task-reminder para Haiku | ~US$ 2,40/mês | 1 minuto |
| Migrar consolidacao-semanal para Sonnet | ~US$ 0,30/mês | 1 minuto |
| **Total** | **~US$ 67/mês** | **5 minutos** |

### Prioridade média (requer teste)

| Ação | Economia estimada | Risco |
|------|-------------------|-------|
| Usar Sonnet como default para tópicos de execução (Orion, Nexa, Vega) | ~US$ 40-80/mês | Qualidade de código e conteúdo pode cair |
| Manter Opus só para Dona, Atlas, Masterson, Aurora | Incluído acima | Baixo risco nesses agentes |

### Prioridade baixa (longo prazo)

| Ação | Impacto |
|------|---------|
| Aumentar cache hit rate (otimizar prompts de sistema) | Redução gradual de ~10-20% |
| Implementar roteamento dinâmico por complexidade da tarefa | Requer desenvolvimento |

---

## 8. Outros custos de API (não LLM)

| Serviço | Custo | Uso |
|---------|-------|-----|
| OpenAI Whisper API | ~US$ 0,006/min de áudio | Transcrição de áudio (sob demanda) |
| Google Gemini (web search) | Gratuito (tier free) | Buscas web via OpenClaw |
| RapidAPI (Instagram, YouTube, etc.) | Freemium | Scraping e APIs diversas |
| ElevenLabs TTS | Variável | Text-to-speech (sob demanda) |
| Meta Ads API | Gratuito | Acesso a dados de campanhas |
| Nano Banana Pro (Gemini 3 Pro Image) | Via Gemini API key | Geração de imagens |

---

## 9. Como cada modelo se comporta

### Haiku 4.5 (o econômico)
- Rápido (latência ~1-3s)
- Bom para: checagens rotineiras, classificação, formatação simples, tarefas com instruções claras
- Ruim para: raciocínio multi-step, copy persuasiva, código complexo, decisões estratégicas
- Custo: 5x mais barato que Opus no input, 5x mais barato no output

### Sonnet 4.6 (o equilibrado)
- Velocidade média (latência ~3-8s)
- Bom para: produção de conteúdo, código moderado, análise de dados, pesquisa
- Ruim para: raciocínio muito profundo, arquitetura complexa de sistemas
- Custo: 60% mais barato que Opus

### Opus 4.6 (o premium)
- Mais lento (latência ~5-15s)
- Bom para: tudo. Raciocínio complexo, estratégia, copy avançada, código sofisticado, decisões com múltiplas variáveis
- Ruim para: tarefas simples onde o custo não justifica a qualidade extra
- Custo: o mais caro da linha

---

## 10. Regra de ouro para escolha de modelo

```
SE a tarefa é rotineira, checagem ou formatação → Haiku
SE a tarefa é produção de conteúdo ou código moderado → Sonnet
SE a tarefa envolve estratégia, decisão complexa ou copy de alto impacto → Opus
SE não tem certeza → Sonnet (melhor custo-benefício)
```

---

## 11. Monitoramento

Para acompanhar custos reais:
- Dashboard Anthropic: https://console.anthropic.com/settings/billing
- Comando `/status` no OpenClaw mostra tokens da sessão atual
- Cache hit rate aparece no status da sessão
- Logs do gateway registram tokens por request

---

*Documento mantido por Dona. Atualizar quando preços mudarem ou configuração for alterada.*
