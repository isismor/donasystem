# Design System — ISIS v7 · Isis Moreira

> Arquivo HTML completo salvo em: `memory/design-system-isis-v7.html`
> Versão: 7 | Atualizado: 2026-03-09

---

## Paleta de Cores

### Cores base (tokens)
| Token | Hex | Nome |
|-------|-----|------|
| `--marfim` | `#f9f8f4` | Fundo principal |
| `--creme` | `#efede6` | Fundo elevado / cards |
| `--cacao` | `#2a2420` | Texto principal / fundo dark |
| `--mirror` | `#9ba1a8` | Texto terciário / neutro |
| `--ouro` | `#b4a68c` | Accent principal |
| `--ouro-pale` | `#d4cec4` | Ouro claro |
| `--ouro-deep` | `#7a6e5c` | Ouro escuro / accent-text |

### Dark mode (tons escuros)
| Token | Hex |
|-------|-----|
| `--dark-0` | `#1a1210` |
| `--dark-1` | `#251c18` |
| `--dark-2` | `#2f2219` |
| `--dark-3` | `#382820` |

### Status
| Estado | Hex |
|--------|-----|
| OK | `#34A853` |
| Warn | `#F5A623` |
| Error | `#E03131` |

---

## Tipografia

| Token | Fonte |
|-------|-------|
| `--sans` | DM Sans |
| `--serif` | DM Serif Text |
| `--mono` | IBM Plex Mono |

### Escala de tamanhos
| Token | Tamanho |
|-------|---------|
| `--t-2xs` | 9px |
| `--t-xs` | 11px |
| `--t-sm` | 13px |
| `--t-md` | 15px (corpo base) |
| `--t-lg` | 18px |
| `--t-xl` | 24px |
| `--t-2xl` | 32px |
| `--t-3xl` | 48px |
| `--t-4xl` | 64px |
| `--t-5xl` | 80px |

### Letter-spacing
- UI: `0.5px`
- Leitura: `2.5px`
- Logo: `4px`

---

## Espaçamento

| Token | Valor |
|-------|-------|
| `--d-xs` | 8px |
| `--d-sm` | 12px |
| `--d-md` | 16px |
| `--d-lg` | 24px |
| `--d-xl` | 40px |
| `--d-2xl` | 64px |

### Cards & Grids (regras inegociáveis)
| Token | Valor |
|-------|-------|
| `--card-gap` | 24px |
| `--card-pad` | 28px |
| `--card-pad-sm` | 16px |
| `--card-pad-lg` | 40px |
| `--card-radius` | 10px (r-lg) |
| `--grid-mb` | 24px |
| `--card-border` | rgba(180,166,140,.40) — ouro diluído |

---

## Border Radius

| Token | Valor |
|-------|-------|
| `--r-xs` | 3px |
| `--r-sm` | 6px |
| `--r-md` | 8px |
| `--r-lg` | 10px |
| `--r-xl` | 14px |
| `--r-2xl` | 20px |
| `--r-full` | 9999px |

---

## Animações

| Token | Valor |
|-------|-------|
| `--fast` | 120ms |
| `--normal` | 200ms |
| `--slow` | 400ms |
| `--spring` | 380ms |
| `--ease-std` | cubic-bezier(.4,0,.2,1) |
| `--ease-out` | cubic-bezier(0,0,.2,1) |
| `--ease-spring` | cubic-bezier(.34,1.56,.64,1) |

---

## Filosofia Visual

- Sem glass morphism: tom sobre tom, sem blur artificial
- Light: marfim + creme + cacao + ouro
- Dark: dark-0/1 com marfim e ouro
- Seções: max-width 1080px, padding 56px 64px
- Títulos: DM Serif Text italic, letter-spacing negativo
- Labels/tags: IBM Plex Mono uppercase, letter-spacing amplo
- Sem travessão, sem emoji, sem excessos decorativos
- Elegância pelo espaço e pela tipografia, não por ornamentos

---

## Arquivo Original
- Localização: `memory/design-system-isis-v7.html`
- Tamanho: 74kb
- Formato: HTML com CSS completo e componentes documentados
