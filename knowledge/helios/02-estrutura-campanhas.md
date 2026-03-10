# Estrutura de Campanhas Meta Ads (2025/2026)

> Referência para objetivos, estrutura, otimização e boas práticas de campanhas no Meta Ads Manager.

---

## Os 6 Objetivos de Campanha

Meta consolidou os objetivos em 6 categorias:

| Objetivo | Quando Usar | Otimiza Para |
|---|---|---|
| **Awareness** (Reconhecimento) | Alcançar público frio, gerar lembrança de marca | Alcance, impressões, lembrança de anúncio |
| **Traffic** (Tráfego) | Direcionar para site, landing page, app | Cliques no link, visualizações de landing page |
| **Engagement** (Engajamento) | Curtidas, comentários, compartilhamentos, mensagens | Interações com post, mensagens, conversas |
| **Leads** | Capturar leads com formulário nativo ou externo | Leads gerados, custo por lead |
| **App Promotion** | Instalar ou usar aplicativo | Instalações, eventos no app |
| **Sales** (Vendas) | E-commerce, compras, conversões | Compras, ROAS, valor de conversão |

**Regra crítica:** Escolha o objetivo que reflete o resultado real que você quer. Otimizar para tráfego quando quer vendas = algoritmo vai trazer clicadores, não compradores.

---

## Estrutura Recomendada

### Princípio: Simplicidade

- **1 objetivo = 1 campanha** — permite ao algoritmo consolidar dados e otimizar mais rápido
- Evitar fragmentação de budget entre campanhas concorrentes
- Dentro da campanha, usar ad sets separados para testar públicos/criativos diferentes

### Estrutura de 2 Campanhas (modelo testado)

| Campanha | Objetivo | Público | Budget |
|---|---|---|---|
| **Testing** | Vendas/Leads | Público amplo ou cold | 70-80% do budget |
| **Retargeting** | Vendas/Leads | Custom audiences (visitantes, engajados) | 20-30% do budget |

### Estrutura por Funil

| Estágio | Objetivo | Público | Conteúdo |
|---|---|---|---|
| **TOF** (Topo) | Awareness / Engajamento | Cold, broad, lookalike | Conteúdo educativo, hooks, curiosidade |
| **MOF** (Meio) | Traffic / Engajamento | Warm (engajaram, visitaram) | Prova social, depoimentos, cases |
| **BOF** (Fundo) | Sales / Leads | Hot (add to cart, iniciar checkout) | Oferta direta, urgência, bônus |

---

## Advantage+ (Automação Meta)

Suite de automação central do Meta. Usa IA para:
- **Advantage+ Audiences:** targeting automatizado baseado em dados do pixel
- **Advantage+ Placements:** distribui automaticamente entre posicionamentos
- **Advantage+ Creative:** testa variações de criativo automaticamente
- **Advantage+ Shopping Campaigns:** campanha automatizada end-to-end para e-commerce

**Quando usar:** Com boa base de dados (pixel maduro, CAPI configurado, histórico de conversões).
**Quando evitar:** Contas novas sem dados, nicho muito específico, necessidade de controle manual.

---

## Pixel e Conversions API (CAPI)

### Pixel
- Tag JavaScript instalada no site
- Rastreia eventos: PageView, ViewContent, AddToCart, InitiateCheckout, Purchase, Lead
- Base para otimização e criação de públicos

### Conversions API (CAPI)
- Envia dados server-side direto para Meta
- Mais confiável que pixel (não depende de cookies/browser)
- Essencial pós-iOS 14+ (bloqueio de tracking)
- **Recomendação:** usar Pixel + CAPI juntos (deduplicação automática)

### Eventos Prioritários
Configurar no Events Manager os 8 eventos priorizados (restrição iOS 14):
1. Purchase
2. InitiateCheckout
3. AddToCart
4. Lead
5. CompleteRegistration
6. ViewContent
7. AddPaymentInfo
8. Search

---

## Públicos

### Custom Audiences (Público Personalizado)
- Visitantes do site (Pixel)
- Lista de clientes (email/telefone)
- Engajaram com página/perfil do Instagram
- Assistiram X% de um vídeo
- Interagiram com formulário de lead

### Lookalike Audiences (Público Semelhante)
- Baseado em custom audience de alta qualidade
- **1%** = mais similar (menor mas mais qualificado)
- **1-3%** = bom equilíbrio alcance/qualidade
- **3-10%** = mais amplo, menos qualificado

### Exclusões (crítico)
- Sempre excluir compradores recentes do TOF
- Excluir públicos de retargeting do prospecting
- Usar Audience Overlap Tool para verificar sobreposição

---

## Métricas Essenciais

| Métrica | O Que Significa | Benchmark Geral |
|---|---|---|
| **CPM** | Custo por 1000 impressões | R$15-50 (varia muito por nicho/país) |
| **CTR** | Taxa de clique (cliques/impressões) | 1-3% (feed), 0.5-1.5% (stories) |
| **CPC** | Custo por clique | Depende do nicho |
| **CPL** | Custo por lead | Depende do nicho e oferta |
| **CPA** | Custo por aquisição/ação | Depende do ticket |
| **ROAS** | Retorno sobre gasto com anúncio (receita/gasto) | >3x é bom para infoprodutos |
| **Frequency** | Média de vezes que cada pessoa viu o anúncio | <3 para cold, pode ser maior em retargeting |
| **Hook Rate** | % de retenção nos primeiros 3 segundos (vídeo) | >25% é bom |
| **Hold Rate** | % que assistiu até o final | >15% é bom |
| **ThruPlay Rate** | % que assistiu 15s+ ou vídeo completo | Varia por duração |

---

## Boas Práticas de Otimização

1. **Criativo é o novo targeting** — com Advantage+, a qualidade do criativo importa mais que segmentação manual
2. **Testar variáveis de alto impacto primeiro:** produto > oferta > ângulo > criativo > público
3. **Respeitar a learning phase** — não alterar ad sets com menos de 50 conversões na semana
4. **CBO (Campaign Budget Optimization)** — ativar quando já identificou ad sets vencedores, Meta distribui budget automaticamente
5. **Mínimos e máximos por ad set** — dentro de CBO, usar spend caps para evitar que Meta concentre tudo em um ad set
6. **Escalar verticalmente** — aumentar budget em 20-30% a cada 3-5 dias
7. **Escalar horizontalmente** — duplicar ad set vencedor para novos públicos
8. **Refresh criativo a cada 2-4 semanas** — fadiga criativa mata performance
9. **Testar UGC e depoimentos** — conteúdo autêntico performa melhor que produção polida
10. **Monitorar frequência** — acima de 3x no cold = hora de trocar criativo ou público

---

## Funil para Infoprodutos (Contexto Isis Moreira)

| Estágio | Formato | Conteúdo | Objetivo |
|---|---|---|---|
| **Atração** | Reels, vídeos curtos | Conteúdo de valor, hooks, provocações | Awareness + Engajamento |
| **Captura** | Carrossel, vídeo + CTA | Isca digital, masterclass, quiz | Leads |
| **Nutrição** | Retargeting vídeo/carrossel | Depoimentos, cases, bastidores | Engajamento warm |
| **Conversão** | Vídeo VSL, imagem direta | Oferta, escassez, bônus | Vendas |

---

*Fontes: Meta Business Help Center, Meta Marketing API Docs, best practices compiladas de modo25.com, pansofic.com, lebesgue.io (março 2026)*
