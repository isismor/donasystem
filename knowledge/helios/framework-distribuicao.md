# Framework de Distribuição de Conteúdo — Helios

> Estratégia de tráfego para crescimento orgânico de seguidores via Meta Ads.
> Aprovado por Isis em 10/03/2026.

## Objetivo

Distribuir posts e reels do @moreira.isis via Meta Ads com o objetivo de levar pessoas ao perfil e ganhar seguidores. Toda publicação passa por um ciclo de teste e classificação por custo por seguidor.

## Conta de Anúncios

- **Ad Account ID:** act_777100762498033
- **Página:** Moreira.Isis (ID: 101741828467105) / Isis Moreira (ID: 984391171599553)
- **Token:** Salvo no servidor (variável META_ACCESS_TOKEN)

## Ciclo de Classificação

### Fase 1: Teste
- **Verba:** R$10 por 1 dia
- **Regra:** TODO post/reel novo entra automaticamente nesta fase
- **Objetivo da campanha:** Engajamento / Visitas ao perfil

### Fase 2: Classificação (após 24h de teste)

| Classificação | Custo por seguidor | Verba diária | Ação |
|---|---|---|---|
| **Série A** | Abaixo de R$0,50 | R$30/dia | Manter e escalar |
| **Série B** | Entre R$0,50 e R$0,70 | R$10/dia | Manter com verba base |
| **Cortado** | Acima de R$0,70 | R$0/dia | Pausar, sem mais verba |

### Regras de transição
- Publicação que estava na Série A e subiu acima de R$0,50: rebaixa para Série B
- Publicação na Série B que caiu abaixo de R$0,50: promove para Série A
- Publicação que ultrapassa R$0,70 em qualquer momento: cortada

## Report Diário (obrigatório)

Todos os dias, reportar para Isis:

1. **Gasto total do dia**
2. **Publicações ativas em Série A** (quais e quantas)
3. **Publicações ativas em Série B** (quais e quantas)
4. **Custo por seguidor geral** (média ponderada)
5. **Novos seguidores do dia** (se disponível)

## Estrutura Técnica no Meta Ads

- **1 campanha** com objetivo de engajamento/visitas ao perfil
- **1 ad set por publicação** (nomeado com ID ou título do post)
- **Público:** Brasil, feminino, 24-45 anos, Advantage+ ativo
- **Posicionamento:** automático (Meta decide melhor placement)
- **Cada ad usa o post existente** (não criar criativo novo, usar existing post)

## Início

- Primeiras 10 publicações: os 10 posts/reels mais recentes do @moreira.isis
- Cada um recebe R$10 por 1 dia de teste
- Após 24h: classificar e realocar verba conforme tabela acima

## Pendências (10/03/2026)

- App Meta precisa estar em modo Live (não Development)
- Token gerado pelo app Marketing Essencial (não NDD4)
- Conta teve restrição temporária por excesso de ações no Business Manager (libera em horas)
