# Projetos

---

## Ativos

### Torre Dona (hub.donasystem.com.br)
**Status:** Parcialmente online. Migração para local em andamento.
**Infra atual:** Next.js rodando na porta 3000 do srv1464443. Nginx instalado. DNS apontando para 72.60.241.247.
**Repo:** isismor/donasystem (branch main, dir /hub)
**Login:** isisalvesmoreira@gmail.com / hub#2027
**Gateway:** Conectado via controlUi.
**Bloqueio:** Precisa de sudo para nginx reload + certbot SSL.
**Pendente:** HTTPS, remover flags dangerously*, systemd service, tradução UI para PT-BR.
**Criado em:** 11/03/2026

### Framework de Distribuição de Tráfego (Helios)
**Status:** Operacional. Primeira campanha ativa.
**Conta:** act_777100762498033 ("Mulher de Negócios"), saldo R$1,49
**Campanha ativa:** "Distribuição - Teste Posts" (TRAFFIC, desde 12/03, janela até 13/03)
**Campanhas pausadas:** "Distribuição Série - Março 2026" (ENGAGEMENT), "Distribuição - Teste Posts" (antiga)
**Documento:** knowledge/helios/framework-distribuicao.md
**Criado em:** 10/03/2026

### Doninha (Agente de Suporte Mentoria Skava)
**Status:** Em montagem
**Papel:** Suporte automatizado de alunas nos grupos de WhatsApp da Mentoria Skava
**Número WhatsApp:** +5511915064046
**Tom:** Direta, humana, didática. Operação 24h.
**Base de conhecimento:** knowledge/doninha/ (FAQ, PDO, Helios consolidado)
**Ciclo:** Lacunas no relatório > Isis responde > base atualizada > Doninha aprende
**Pendente:**
- [ ] Conectar WhatsApp (QR code scan)
- [ ] Isis adicionar nos 2 grupos de WhatsApp
- [ ] Puxar restante dos docs Google (truncados em 50KB)
- [ ] Eva estruturar identidade completa (IDENTITY.md, SOUL.md)
- [ ] Definir formato do relatório PDF diário
- [ ] Atlas consolidar escopo Torre Dona incluindo módulo Doninha
**Criado em:** 12/03/2026

### Material: Time de Agentes do Zero ao Avançado
**Status:** Aprovado, em produção
**Formato:** PDF robusto (base para aula/vídeo)
**Público:** Leigo a avançado, posicionamento de autoridade
**Estrutura:** 6 blocos (Problema > O que são agentes > Framework > Construção > Operação > Resultado)
**Cadeia:** Atlas (plano) > Vega (redação) > Masterson (tom/CTA) > Aurora (design PDF)
**Sanitização:** Nomes e papéis ok, nada de IPs/tokens/configs/paths/vault
**Próximo passo:** Vega inicia redação dos 6 blocos
**Aprovado em:** 10/03/2026

### Crescimento de Audiência Instagram
**Status:** Planejamento
**Meta:** 1 milhão de seguidores em 3 meses (atual: 377k)
**Anomalia:** 4 dias sem publicação (09/03 a 12/03)
**Bloqueio:** API Instagram (instagram120.p.rapidapi.com) com endpoints quebrados. Precisa atualizar integração.
**Criado em:** 08/03/2026

### Escala de Receita
**Status:** Em andamento
**Meta:** R$ 1M/mês (atual: R$ 100k/mês orgânico)
**Próximo passo:** Funis de produtos (maior potencial que mentorias)
**Criado em:** 08/03/2026

### Configuração de Skills (OpenClaw)
**Status:** Em andamento
**Pendente:** Instalar moviepy, configurar OpenAI/Gemini no OpenClaw
**Bloqueios:** ElevenLabs bloqueado por pagamento pendente
**Criado em:** 08/03/2026

---

## Concluídos

### Design System ISIS v7
**Concluído em:** 09/03/2026
**Arquivos:** `memory/design-system-isis-v7.html` + `memory/design-system.md`

### Templates de Relatório PDF
**Template base:** `relatorio-domingo-v2.html`
**Ferramenta:** YakPDF (RapidAPI) + Puppeteer local
**Concluído em:** 10/03/2026

### Infraestrutura de Integrações
**Concluído:** RapidAPI (5 APIs), Canva OAuth, GitHub SSH, Coolify deploy, FFmpeg, ElevenLabs (salvo), 1Password CLI
**Concluído em:** 08/03/2026

### Base de Conhecimento Masterson/Vega
**5 materiais processados e salvos** em knowledge/masterson/ (com symlinks em knowledge/vega/):
big-black-book.md, how-i-built-my-wealth.md, copy-logic.md, architecture-of-persuasion.md, ideias-que-colam.md
**Concluído em:** 10/03/2026

### Base de Conhecimento Helios
**4 materiais compilados** em knowledge/helios/:
01-especificacoes-criativos.md, 02-estrutura-campanhas.md, 03-politicas-anuncios.md, 04-diagnostico-problemas.md
**Concluído em:** 10/03/2026

### Palestra Copy Perfeita
**Output:** output/palestra-copy-perfeita.html + .pdf (15 slides, Design System ISIS v7)
**Concluído em:** 11/03/2026

---

## Backlog

- Integrar Cademi para acompanhar vendas e alunas
- Configurar email para Dona acessar
- Documento diagnóstico para cliente de Isis (cadeia Masterson + Helios + Aurora, aguardando dados da cliente)
- Configurar análise diária automática (08h SP) após resolver API Instagram
