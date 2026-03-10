# Diagnóstico de Problemas Meta Ads (2025/2026)

> Guia de troubleshooting para os problemas mais comuns em campanhas Meta Ads.

---

## Conta Restrita / Bloqueada

### Causas comuns:
- **Violação de políticas:** claims enganosos, conteúdo proibido, conteúdo sensível sem cuidado
- **Atividade suspeita:** aumento rápido de budget, login de local desconhecido, método de pagamento com problema
- **Autenticidade:** nome falso, pagamento não verificado, sem verificação de negócio
- **Feedback negativo:** muitas denúncias ou reações negativas dos usuários
- **Burlar restrição:** criar conta nova após bloqueio = ban de todos os ativos

### Como resolver:
1. **Business Support Home** (primeiro passo sempre) — mostra detalhes da restrição e recomendações
2. **Verificar identidade** — enviar documento válido, verificar método de pagamento
3. **Ativar 2FA** — autenticação em dois fatores + revisar atividade de login
4. **Solicitar revisão** — apelar no Business Support Home dentro de 30 dias, explicando práticas e conformidade
5. **Corrigir violações antes de apelar** — auditar todos os anúncios (ativos E pausados), corrigir conteúdo + landing pages
6. **Contato Meta Business Support** — último recurso, chat ao vivo disponível em algumas regiões

### Prevenção:
- Manter comportamento consistente de login e gastos
- Revisar políticas regularmente (Meta atualiza com frequência)
- Monitorar score de feedback
- Transparência na coleta de dados (especialmente lead ads)

---

## Anúncio Reprovado

### Motivos mais comuns:
| Motivo | Exemplo | Solução |
|---|---|---|
| Atributos pessoais | "Você que está acima do peso..." | Reescrever sem se referir a atributos do usuário |
| Claims de saúde | "Cura comprovada", "Resultados garantidos" | Usar linguagem aspiracional, remover claims |
| Antes/depois corporal | Fotos de transformação física | Remover ou usar apenas depoimentos em texto |
| Landing page inconsistente | Anúncio promete X, página mostra Y | Alinhar promessa do anúncio com conteúdo da página |
| Landing page com erro | Página 404 ou lenta | Corrigir URL e performance |
| Conteúdo sensacionalista | Linguagem alarmista excessiva | Moderar tom, focar no positivo |
| Texto excessivo na imagem | Mais de 20% de texto | Reduzir texto, mover para copy do anúncio |

### Processo de recurso:
1. Revisar motivo da reprovação no Ads Manager
2. Corrigir o problema identificado
3. Reenviar para revisão
4. Se acredita ser erro: solicitar revisão manual

---

## CPM Alto

### Fatores que aumentam CPM:
- **Público muito restrito** — mais competição por impressões
- **Criativo de baixa qualidade** — baixo engajamento = Meta cobra mais
- **Frequência alta** — fadiga de anúncio (acima de 3x no cold)
- **Posicionamento caro** — feed do Instagram é mais caro que Audience Network
- **Sazonalidade** — Black Friday, fim de ano, datas comerciais = CPM dispara
- **Bidding inadequado** — estratégia de lance não alinhada ao objetivo

### Como reduzir:
1. **Ampliar público** — dar mais espaço para o algoritmo otimizar
2. **Melhorar criativo** — hook nos 3 primeiros segundos, A/B test de formatos
3. **Advantage+ Placements** — deixar Meta distribuir entre posicionamentos
4. **Monitorar frequência** — trocar criativo quando frequência passar de 3
5. **Testar bidding** — spend-based para controlar dentro do budget
6. **Retargeting warm** — público que já engajou tende a ter melhor CPM
7. **Diversificar formatos** — Reels geralmente tem CPM menor que feed estático

---

## Entrega Baixa / Anúncio Não Gasta

### Causas:
- **Learning phase** — menos de 50 conversões na semana, algoritmo ainda testando
- **Público muito pequeno** — menos de 100k pessoas no público
- **Budget muito baixo** — insuficiente para competir nos leilões
- **Lance (bid) muito baixo** — se usando bid cap, pode estar abaixo do mercado
- **Relevância baixa** — Meta prioriza anúncios com melhor relevância
- **Sobreposição de público** — suas campanhas competindo entre si

### Como resolver:
1. Verificar tamanho do público no ad set
2. Aumentar budget ou mudar para auto-bid
3. Melhorar relevância do criativo para o público
4. Checar Audience Overlap Tool
5. Consolidar ad sets (menos ad sets = mais dados por ad set)
6. Aguardar learning phase (mínimo 7 dias sem mudanças)

---

## ROAS Baixo

### Diagnóstico em cascata:
1. **CTR baixo?** → Problema no criativo/hook. Testar novos ângulos.
2. **CTR bom mas CVR baixo?** → Problema na landing page. Testar headline, oferta, prova social.
3. **CVR bom mas ticket baixo?** → Problema de oferta. Testar upsell, order bump, pacotes.
4. **Tudo ok mas CPA alto?** → Problema de público/CPM. Testar novos públicos, ampliar targeting.

### Ações rápidas:
- Pausar ad sets com CPA 2x acima da meta após 50+ impressões significativas
- Duplicar ad sets vencedores para novos públicos
- Testar novo criativo no ad set com melhor público
- Verificar se Pixel está disparando corretamente (Events Manager > Test Events)

---

## Learning Phase

### O que é:
- Período em que o algoritmo está aprendendo a otimizar a entrega
- Precisa de ~50 conversões por ad set por semana para sair
- Performance instável durante esse período

### Regras:
- **Não editar** o ad set durante learning phase (reseta o aprendizado)
- Se não sai da learning phase: público pode ser muito restrito ou budget muito baixo
- Considerar otimizar para evento mais acima no funil (ex: AddToCart em vez de Purchase)

---

## Checklist de Diagnóstico Rápido

| Sintoma | Primeiro check | Segundo check | Terceiro check |
|---|---|---|---|
| Conta bloqueada | Business Support Home | Verificação de identidade | Apelar com detalhes |
| Anúncio reprovado | Motivo no Ads Manager | Corrigir e reenviar | Solicitar revisão manual |
| CPM alto | Tamanho do público | Qualidade do criativo | Frequência |
| Sem entrega | Budget suficiente? | Público grande o bastante? | Overlap entre campanhas? |
| ROAS baixo | CTR do anúncio | CVR da landing page | CPA vs ticket médio |
| Learning phase travada | Número de conversões/semana | Otimizar para evento mais acima | Consolidar ad sets |

---

*Fontes: superads.ai, agrowth.io, lebesgue.io, madgicx.com, adamigo.ai (consolidado em março 2026)*
