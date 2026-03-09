# Design System — Isis Moreira v7

> Referência completa em: `workspace/design-system-v7.html`
> Qualquer material gerado DEVE seguir esses tokens.

---

## Identidade Visual

**Nome da marca:** ISISMOREIRA (all caps no logotipo)
**Versão:** v7

---

## Paleta de Cores

### Cores base
| Token | Hex | Uso |
|---|---|---|
| --marfim | #f9f8f4 | Background principal |
| --creme | #efede6 | Background cards/raised |
| --cacao | #251c18 | Texto principal / dark bg |
| --mirror | #9ba1a8 | Texto terciário |
| --ouro | #b4a68c | Cor de destaque / accent |
| --ouro-pale | #d4cec4 | Ouro claro |
| --ouro-deep | #7a6e5c | Ouro texto / links |

### Dark Mode
| Token | Valor |
|---|---|
| --dark-0 | #1c1410 |
| --dark-1 | #251c18 |
| --dark-2 | #2e2018 |
| --dark-3 | #3a2620 |

### Status
| Token | Hex |
|---|---|
| --ok | #34A853 |
| --warn | #F5A623 |
| --err | #E03131 |

---

## Tipografia

| Token | Fonte | Uso |
|---|---|---|
| --sans | DM Sans | Corpo, UI, labels |
| --serif | DM Serif Text | Títulos, display, itálico |
| --mono | IBM Plex Mono | Código, tags, metadados |

### Escala de tamanhos
| Token | Valor |
|---|---|
| --t-2xs | 9px |
| --t-xs | 11px |
| --t-sm | 13px |
| --t-md | 15px |
| --t-lg | 18px |
| --t-xl | 24px |
| --t-2xl | 32px |
| --t-3xl | 48px |
| --t-4xl | 64px |
| --t-5xl | 80px |

### Letter spacing
| Token | Valor | Uso |
|---|---|---|
| --track-ui | 0.5px | Texto UI normal |
| --track-eye | 2.5px | Labels uppercase |
| --track-logo | 4px | Logotipo |

---

## Espaçamento

| Token | Valor |
|---|---|
| --d-xs | 8px |
| --d-sm | 12px |
| --d-md | 16px |
| --d-lg | 24px |
| --d-xl | 40px |
| --d-2xl | 64px |

### Cards (guardrails inegociáveis)
| Token | Valor |
|---|---|
| --card-gap | 24px |
| --card-pad | 28px |
| --card-pad-sm | 16px |
| --card-pad-lg | 40px |
| --card-radius | 10px (--r-lg) |
| --card-border | rgba(155,161,168,.35) |

---

## Border Radius

| Token | Valor |
|---|---|
| --r-xs | 3px |
| --r-sm | 6px |
| --r-md | 8px |
| --r-lg | 10px |
| --r-xl | 14px |
| --r-2xl | 20px |
| --r-full | 9999px |

---

## Sombras

| Token | Uso |
|---|---|
| --sh-1 | Elevação mínima |
| --sh-2 | Cards default |
| --sh-3 | Cards hover |
| --sh-4 | Cards selected / elevated |
| --sh-focus | Focus ring (ouro 25%) |
| --sh-ouro | Glow dourado suave |

---

## Glass Effect

```css
background: rgba(249,248,244,.38);
border: 1px solid rgba(255,255,255,.74);
backdrop-filter: blur(24px) saturate(1.6);
box-shadow: 0 10px 40px rgba(37,28,24,.10), 0 2px 10px rgba(37,28,24,.05), inset 0 1px 0 rgba(255,255,255,.73);
```

---

## Animações

| Token | Valor |
|---|---|
| --fast | 120ms |
| --normal | 200ms |
| --slow | 400ms |
| --spring | 380ms |
| --ease-std | cubic-bezier(.4,0,.2,1) |
| --ease-out | cubic-bezier(0,0,.2,1) |
| --ease-spring | cubic-bezier(.34,1.56,.64,1) |

---

## Fontes do Google (CDN)

```
https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,200;0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,700;0,9..40,800;1,9..40,300;1,9..40,400&family=DM+Serif+Text:ital@0;1&family=IBM+Plex+Mono:wght@300;400;500;700&display=swap
```

---

## Regras de Uso

- Logotipo: ISISMOREIRA em DM Sans weight 300, letter-spacing 4px, uppercase
- Títulos display: DM Serif Text, italic, letter-spacing negativo (-0.5px a -2px)
- Labels/metadados: IBM Plex Mono, 9px, letter-spacing 2-3px, uppercase
- Cor de destaque primária: --ouro (#b4a68c)
- Hierarquia de texto: --text-1 (cacao/marfim) > --text-2 (65% opacity) > --text-3 (mirror)
- Background preferido: --marfim com cards em --creme
- Bordas cards: rgba(155,161,168,.35) (mirror 35%)
