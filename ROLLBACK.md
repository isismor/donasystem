# ROLLBACK.md

> Instrucoes de reversao para o estado estavel do sistema.
> Atualizar SEMPRE antes de mudancas estruturais.

Ultima atualizacao: 2026-03-09
Estado: estavel (pos-setup inicial)

---

## Estado Atual do Sistema

### Git workspace
Commit estavel: `8966b6b` — decisions: 10 regras invioaveis (09/03/2026)

Para reverter workspace:
```bash
cd /home/openclaw/.openclaw/workspace
git log --oneline        # ver commits
git reset --hard 8966b6b # voltar para este commit
```

### Gateway
Porta: 18789
Config: `/home/openclaw/.openclaw/openclaw.json`
Modelo principal: `anthropic/claude-sonnet-4-6`
Context tokens: 160000
Compaction: safeguard, reserveTokensFloor: 30000
Memory search: enabled, provider: openai, sources: ["memory"]

Para reverter config do gateway:
```bash
# 1. Editar openclaw.json manualmente
nano /home/openclaw/.openclaw/openclaw.json

# 2. Ou usar config.patch para restaurar valores especificos

# 3. Reiniciar gateway
kill -USR1 $(pgrep -f "openclaw gateway")
```

### Binarios instalados
- FFmpeg: `/home/openclaw/.local/bin/ffmpeg` (v7.0.2-static)
- 1Password CLI: `/home/openclaw/.local/bin/op` (v2.30.3)
- pip: `/home/openclaw/.local/bin/pip`
- Pacotes Python: moviepy, pillow, numpy

### Skills instaladas
- canva-connect: `/home/openclaw/.openclaw/workspace/skills/canva-connect/`

### Arquivos de autenticacao
- 1Password service account: `/home/openclaw/.op_env` (chmod 600)
- GitHub deploy key: `/home/openclaw/.ssh/github_dona` (chmod 600)
- Canva tokens: `/home/openclaw/.clawdbot/canva-tokens.json` (chmod 600)
- Secrets loader: `/home/openclaw/.openclaw/load-secrets.sh` (chmod 600)

### 1Password vault "Dona" — itens ativos
- RapidAPI Key (5 APIs: Instagram, YouTube, Whisper, BgRemoval, YakPDF)
- Canva API Key (OAuth completo)
- GitHub - donasystem (deploy key SSH)
- Coolify - donasystem (API token, UUID: p4wc04484cc0404g0wsgcow0)
- ElevenLabs (aguardando pagamento)
- Open AI
- GOOGLE_GEMINI
- Cademi

---

## Procedimento de Rollback Completo

Se tudo quebrar:

```bash
# 1. Verificar se gateway ainda responde
curl -s -o /dev/null -w "%{http_code}" http://localhost:18789/health

# 2. Se nao responder, matar e reiniciar
pkill -f "openclaw gateway"
nohup openclaw gateway start > /tmp/gateway.log 2>&1 &

# 3. Reverter workspace para commit estavel
cd /home/openclaw/.openclaw/workspace
git reset --hard 8966b6b

# 4. Verificar vault ainda acessivel
source /home/openclaw/.op_env && op item list --vault Dona

# 5. Testar Telegram
# Mandar mensagem para o bot e verificar resposta
```

---

## Como Atualizar Este Arquivo

Antes de qualquer mudanca estrutural:
1. Anotar o commit atual do workspace (`git log --oneline -1`)
2. Descrever o estado atual dos binarios e configs
3. Commitar o ROLLBACK.md atualizado
4. So entao fazer a mudanca estrutural
