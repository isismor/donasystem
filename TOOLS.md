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
