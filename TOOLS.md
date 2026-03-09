# TOOLS.md - Local Notes

Skills define _how_ tools work. This file is for _your_ specifics — the stuff that's unique to your setup.

## What Goes Here

Things like:

- Camera names and locations
- SSH hosts and aliases
- Preferred voices for TTS
- Speaker/room names
- Device nicknames
- Anything environment-specific

## Examples

```markdown
### Cameras

- living-room → Main area, 180° wide angle
- front-door → Entrance, motion-triggered

### SSH

- home-server → 192.168.1.100, user: admin

### TTS

- Preferred voice: "Nova" (warm, slightly British)
- Default speaker: Kitchen HomePod
```

## Why Separate?

Skills are shared. Your setup is yours. Keeping them apart means you can update skills without losing your notes, and share skills without leaking your infrastructure.

---

Add whatever helps you do your job. This is your cheat sheet.

---

## Skills Ativas

### canva-connect (clawhub)
- Localização: `workspace/skills/canva-connect/`
- Uso: listar designs, exportar PNG/PDF, upload de assets, autofill de templates
- Credencial: vault "Dona" > "Canva API Key" (OAuth, tokens em ~/.clawdbot/canva-tokens.json)
- Quando usar: gerar ou exportar materiais visuais do Canva programaticamente
- Quando NAO usar: criar conteudo dentro do design (a API nao edita elementos)

### openai-whisper-api (bundled)
- Localização: `/usr/lib/node_modules/openclaw/skills/openai-whisper-api/`
- Uso: transcrever audio via OpenAI Whisper-1
- Credencial: OPENAI_API_KEY (vault "Dona" > "Open AI")
- Quando usar: audio local ou upload direto para OpenAI
- Alternativa: whisper-from-url.p.rapidapi.com (para audios via URL publica)

### video-frames (bundled)
- Localização: `/usr/lib/node_modules/openclaw/skills/video-frames/`
- Uso: extrair frames ou clipes curtos de videos com ffmpeg
- Binario ffmpeg: `/home/openclaw/.local/bin/ffmpeg` (v7.0.2)
- Quando usar: analisar frames de reels, extrair thumbnails de videos

---

## Quando Usar Skill vs Cron vs Main Agent

| Situacao | Use |
|---|---|
| Tarefa recorrente e automatica | Cron (isolated + agentTurn) |
| Ferramenta especifica com CLI/API | Skill |
| Analise, decisao, resposta para Isis | Main agent |
| Geracao de conteudo/material | Main agent + skill de output |
| Monitoramento periodico | Cron |

---

## Binarios e Paths

| Ferramenta | Path |
|---|---|
| ffmpeg | `/home/openclaw/.local/bin/ffmpeg` |
| 1Password CLI | `/home/openclaw/.local/bin/op` |
| pip | `/home/openclaw/.local/bin/pip` |
| Python | `/usr/bin/python3` (3.12.3) |
| Node | `/usr/bin/node` (v22.22.1) |

---

## APIs RapidAPI (sem skill, chamadas diretas)

| API | Host | Uso |
|---|---|---|
| Instagram | instagram120.p.rapidapi.com | Posts e reels por usuario |
| YouTube | youtube138.p.rapidapi.com | Videos de canal |
| Whisper URL | whisper-from-url.p.rapidapi.com | Transcricao por URL |
| Background Removal | background-removal4.p.rapidapi.com | Remove fundo de imagens |
| YakPDF | yakpdf.p.rapidapi.com | HTML para PDF |

Chave: vault "Dona" > "RapidAPI Key"

---

## Ambiente do Servidor

### Shell
- Você TEM acesso a bash/exec nesse ambiente
- Para instalar skills: `openclaw skills install <nome>`
- Para listar skills disponíveis: `openclaw skills list`
- Usuário do sistema: openclaw
- Servidor: srv1464443 (72.60.241.247)

### Paths importantes
- Workspace: /home/openclaw/.openclaw/workspace/
- Auth: /home/openclaw/.openclaw/agents/main/agent/auth-profiles.json
- Config: /home/openclaw/.openclaw/openclaw.json
