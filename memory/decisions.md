# Decisões Permanentes

> Decisões que o agente deve respeitar SEMPRE.

---

## Arquitetura & Infraestrutura

### Arquitetura: supergrupo com tópicos, não grupos separados (09/03/2026)
Um único agente main. Dona assume identidades por tópico via AGENTS.md. Workspace e memória centralizados. Binding único. Grupos separados só fazem sentido com isolamento real (segunda empresa, cliente diferente).

### Cache do gateway: restart obrigatório após editar workspace files (10/03/2026)
O gateway cacheia SOUL.md, AGENTS.md e outros workspace files. Editar sem restart = modelo usa versão antiga. Sempre reiniciar gateway após mudanças nos MDs.

### SOUL.md deve mencionar sistema de identidades (10/03/2026)
Se SOUL.md diz apenas "Nome: Dona" sem explicar que assumir identidades por tópico é parte do design, o modelo resiste a trocar de persona. O sistema de identidades precisa estar explícito no SOUL.md.

### Heartbeat para Telegram topics: formato do campo to (10/03/2026)
Formato correto: `to: "<chatId>:topic:<threadId>"`. Exemplo: `"-1003514367085:topic:4"`.

### Torre Dona: migração para servidor local (12/03/2026)
Abandonado deploy via Coolify (72.61.63.82). Torre Dona roda direto no srv1464443 (72.60.241.247). Motivação: controle total, gateway na mesma máquina, elimina complexidade. Nginx instalado, Certbot instalado. Pendente: sudo para reload nginx e certbot SSL.

---

## Segurança & Credenciais

### Credenciais no 1Password (08/03/2026)
Toda credencial vive no 1Password. Sem exceções. Nunca hardcodar chaves em código, .env ou markdown.

### Dona não é conhecida pela equipe (08/03/2026)
Marlua e Érica não sabem que Dona existe. Qualquer menção para equipe externa exige aprovação de Isis.

### Ações vermelhas exigem aprovação explícita (08/03/2026)
Postar no Instagram, enviar email em nome de Isis, apagar conteúdo, executar integrações novas, decisões estratégicas: todas exigem aprovação antes de agir.

### Dona NUNCA atualiza openclaw de forma autônoma (10/03/2026)
Atualizações do openclaw podem introduzir breaking changes silenciosos. Todo update exige supervisão manual de Isis e validação do serviço. Sem exceções. Sem cron de auto-update.

---

## Comunicação & Conteúdo

### Tom de comunicação (08/03/2026)
Sem emojis. Sem travessão. Sem corporativismo. Sem inglês desnecessário. Gênero neutro. Bullet points. Direto.

### Acentuação obrigatória em todo contexto (10/03/2026)
Todo texto produzido por qualquer agente, em qualquer contexto (chats, materiais, outputs, páginas, memory files), deve usar português correto com acentuação. Sem exceções.

### Briefings estruturados para Aurora (10/03/2026)
Briefings para Aurora devem conter: tipo de peça, dimensões, público, referências visuais, hierarquia de conteúdo. Nunca texto solto.

---

## Design & Produção Visual

### Design system como fonte da verdade (09/03/2026)
Qualquer material visual gerado por Dona usa obrigatoriamente os tokens do Design System ISIS v7. Arquivo em `memory/design-system-isis-v7.html` e resumo em `memory/design-system.md`. Nunca improvisar cores, fontes ou espaçamentos fora do sistema.

### Pipeline de PDF unificado para todos os agentes (11/03/2026)
Documento canônico: `knowledge/pdf-pipeline.md`. Template C + Puppeteer local + Design System ISIS v7. Método principal: `scripts/html-to-pdf.js`. Fallback: YakPDF via RapidAPI.

### Template C "Bold Statement" aprovado como padrão (10/03/2026)
Capa: cacau, centralizada, título 56px com mix regular + itálico + palavra em ouro. Internas: alinhamento superior, páginas alternando marfim e creme. Template salvo em `output/template-c-statement.html`.

---

## Tráfego Pago

### Framework de Distribuição de Tráfego aprovado (10/03/2026)
Ciclo: Teste (R$10/1 dia) > Série A (<R$0,50/seguidor, R$30/dia) > Série B (R$0,50-0,70, R$10/dia) > Cortado (>R$0,70). Report diário obrigatório. Documento: `knowledge/helios/framework-distribuicao.md`.

### Acesso Meta Ads configurado (11/03/2026)
System User: Conversions API System User (ID: 983724147397665). Conta principal: act_777100762498033 ("Mulher de Negócios"). Token em variável de ambiente `META_ACCESS_TOKEN`.

---

## Orquestração & Agentes

### Pipeline de cadeias: Atlas orquestra, Dona supervisiona (10/03/2026)
Cadeias com 2+ agentes são orquestradas por Atlas. Dona supervisiona e faz override se travar. Tarefas diretas (1 agente) ficam com Dona. Gates vermelhos (output público) param e esperam ok de Isis. Gates verdes seguem automático. Modelo completo em `memory/pipeline-model.md`.

### Papéis definidos: Vega = Social Media, Masterson = Escritor (10/03/2026)
Vega faz conteúdo omnichannel, pesquisa de tendências, scraping, transcrição de reels virais. Masterson faz textos longos: ebooks, páginas de vendas, sequências de email.

---

## 10 Regras Invioláveis (09/03/2026)

### Regra 1: Crons sempre isolated + agentTurn
sessionTarget: "isolated", payload.kind: "agentTurn", delivery: { mode: "announce" }. Nunca systemEvent + main.

### Regra 2: Nunca hardcodar credenciais
Todas as chaves vivem no .env (chmod 600) ou 1Password. Zero exceções.

### Regra 3: dmPolicy: allowlist desde o Dia 1
Telegram ID configurado no allowlist antes de qualquer outra coisa.

### Regra 4: Extrair lições ANTES de cada compactação (INVIOLÁVEL)
Antes de CADA compactação: lições > lessons.md, decisões > decisions.md, pendências > pending.md. Sem extração = HD formatado sem backup.

### Regra 5: Todo agente novo começa N1 (Junior)
N1 = output sempre revisado. Promoção via performance review semanal. Níveis: N1 Junior, N2 Pleno, N3 Sênior, N4 Principal.

### Regra 6: Split de modelos por custo
Crons de execução: Sonnet. Heartbeats: Haiku. Interação direta e análise estratégica: Opus.

### Regra 7: Backup antes de mudanças estruturais
Antes de criar agentes, modificar gateway config ou reorganizar workspace: salvar config + criar ROLLBACK.md.

### Regra 8: Sub-agent travou: retry 2x, depois alerta humano
Nunca fire and forget. Sucesso = resumo. Falha = retry 2x. Falhou 2x = alerta imediato.

### Regra 9: SOUL.md personalizado não é opcional
Anti-patterns com exemplos. "Never dos" explícitos. SOUL.md genérico = agente genérico.

### Regra 10: Creators são skills, não agentes
1 agente com 8 skills > 8 agentes separados. Cada agente extra = mais custo, mais falha, cold start.

### Bônus: 3 regras operacionais
- Espaçar crons por 15-30 min (colisão = rate limit)
- config.patch em horário sem crons (reinicia gateway e mata crons rodando)
- systemEvent não notifica no Telegram: usar agentTurn + message send para lembretes
