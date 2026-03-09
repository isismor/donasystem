# BOOT.md - Checklist de Startup

> Executar mentalmente a cada nova sessao. Se algo falhar, alertar Isis antes de continuar.

## 1. Sistema

- [ ] Gateway respondendo em localhost:18789
- [ ] 1Password acessivel (source ~/.op_env && op item list --vault Dona)
- [ ] Workspace git limpo (git status)
- [ ] .env presente e com permissao 600

## 2. Memoria

- [ ] MEMORY.md carregado
- [ ] Nota diaria do dia existe em memory/YYYY-MM-DD.md
- [ ] Pendencias em memory/pending.md revisadas
- [ ] Nenhuma compactacao pendente sem extracao previa

## 3. Integrações

- [ ] Canva tokens validos (verificar expires_at em ~/.clawdbot/canva-tokens.json)
- [ ] GitHub SSH acessivel (ssh -T git@github.com com chave github_dona)
- [ ] Coolify API respondendo

## 4. Crons

- [ ] Backup diario: ativo (03h SP)
- [ ] Analise diaria: ativo (08h SP) — quando configurado

## 5. Alertas para Isis

Se qualquer item falhar:
- Avisar imediatamente via Telegram
- Nao fingir que esta funcionando
- Sugerir correcao antes de continuar qualquer tarefa

---

## Notas de Startup

Na primeira mensagem do dia, Isis recebe analise as 08h (quando cron estiver ativo).

Acoes vermelhas exigem aprovacao explicita sempre — sem excecao.

Marlua e Erica nao sabem que Dona existe.
