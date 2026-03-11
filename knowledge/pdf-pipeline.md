# Pipeline de Geração de PDF — Padrão Unificado

> REFERÊNCIA OBRIGATÓRIA para todos os agentes que geram PDF.
> Qualquer agente (Aurora, Atlas, Masterson, Harpia, etc.) DEVE seguir este pipeline.

## Visão Geral

Toda geração de PDF no sistema segue 3 etapas:

1. **Montar HTML** usando Template C "Bold Statement" como base
2. **Converter HTML para PDF** via Puppeteer (local)
3. **Salvar output** em `workspace/output/`

## Etapa 1: Montar o HTML

### Template base
- Arquivo: `output/template-c-statement.html`
- LER SEMPRE antes de gerar qualquer HTML novo
- Regras detalhadas: `knowledge/aurora/template-c-regras.md`

### Design System ISIS v7 (inviolável)
- Paleta: Marfim #f9f8f4 | Creme #efede6 | Cacau #2a2420 | Ouro #b4a68c | Ouro Deep #7a6e5c | Mirror #9ba1a8
- Tipografia: DM Serif Text (títulos) | DM Sans (corpo/UI) | IBM Plex Mono (labels/dados)
- Fontes via Google Fonts (carregam normalmente no Chromium headless)
- Espaçamentos: múltiplos de 8px

### Estrutura de cada página
```html
<div class="page">
  <!-- CAPA: usar classe cover-c -->
  <!-- INTERNAS: usar classe inner-c + bg-marfim ou bg-creme alternando -->
</div>
```

### Regras CSS obrigatórias
- `height: 297mm; overflow: hidden` em cada `.page` (NUNCA `min-height`)
- `page-break-after: always` entre páginas
- Margens: 0mm (a margem é controlada via padding interno)
- Distribuir conteúdo EXPLICITAMENTE por página. Nunca depender de quebra automática do browser.
- `break-inside: avoid` + `min-height` = bug de espaços em branco. Evitar.

### Componentes disponíveis
| Classe | Uso |
|--------|-----|
| `.callout-dark` | Callout com fundo cacau |
| `.callout-gold` | Callout com tint ouro |
| `.callout-ouro` | Callout sólido ouro |
| `.callout-marfim` | Callout marfim (para páginas creme) |
| `.callout-outline` | Callout só borda |
| `.info-box.box-ouro` | Info box ouro |
| `.info-box.box-dark` | Info box cacau |
| `.info-box.box-creme` | Info box creme |
| `.stmt-quote` | Citação/statement |
| `.checklist` | Lista com checkboxes quadrados |
| `.agents-c` | Grid de cards 2x2 |
| `.tasks-c` | Lista de tarefas com dot ouro |

### Regra de containers
- TODOS os containers na MESMA página = MESMA cor
- Entre páginas pode variar

## Etapa 2: Converter para PDF

### Método principal: Puppeteer (local)

```bash
node /home/openclaw/.openclaw/workspace/scripts/html-to-pdf.js input.html output.pdf
```

Puppeteer + Chromium estão instalados no servidor. Funciona offline, sem API key.

**Configuração interna do script:**
- Format: A4
- printBackground: true
- Margins: 0mm
- waitUntil: networkidle0
- Espera fonts.ready + 2s extra

### Método alternativo: YakPDF (RapidAPI)

Usar APENAS se Puppeteer falhar.

```python
import json, urllib.request

with open("input.html", "r") as f:
    html = f.read()

payload = json.dumps({
    "source": {"html": html},
    "pdf": {
        "format": "A4",
        "printBackground": True,
        "margin": {"top": "0mm", "bottom": "0mm", "left": "0mm", "right": "0mm"}
    },
    "wait": {"for": "timeout", "milliseconds": 4000}
}).encode("utf-8")

req = urllib.request.Request(
    "https://yakpdf.p.rapidapi.com/pdf",
    data=payload,
    headers={
        "Content-Type": "application/json",
        "X-RapidAPI-Key": "<VIA 1PASSWORD>",
        "X-RapidAPI-Host": "yakpdf.p.rapidapi.com"
    },
    method="POST"
)

with urllib.request.urlopen(req, timeout=60) as resp:
    with open("output.pdf", "wb") as out:
        out.write(resp.read())
```

**ATENÇÃO YakPDF:**
- `wait.for` DEVE ser `"timeout"`. Nunca `"navigation"` (erro 400).
- API key: vault "Dona" > "RapidAPI Key". Nunca hardcode.

## Etapa 3: Output

- Salvar PDF em: `workspace/output/`
- Nomear descritivamente: `nome-do-material.pdf`
- Enviar para Isis no chat após gerar

## Erros Comuns (lições consolidadas)

| Erro | Causa | Fix |
|------|-------|-----|
| Páginas cortadas | `min-height` ao invés de `height: 297mm` | Usar `height` fixo + `overflow: hidden` |
| Espaços em branco | `break-inside: avoid` + `min-height` | Distribuir conteúdo manualmente |
| Fontes não carregam | Google Fonts link ausente | Incluir `<link>` no `<head>` |
| YakPDF erro 400 | `wait.for: "navigation"` | Trocar para `"timeout"` |
| HTML grande trava chat | Colou >75kb no chat | Sempre salvar como arquivo, nunca colar |

## Fluxo por Agente

| Agente | Papel no pipeline |
|--------|-------------------|
| Masterson | Escreve conteúdo em texto estruturado |
| Aurora | Monta HTML no Template C + converte para PDF |
| Atlas | Orquestra cadeia (Masterson > Aurora) |
| Harpia | Pode gerar roteiros em PDF seguindo mesmo pipeline |
| Vega | Pode gerar materiais de social em PDF |
| Qualquer agente | Se precisar gerar PDF, segue este pipeline |

## Checklist antes de gerar

- [ ] Li `knowledge/aurora/template-c-regras.md`?
- [ ] HTML usa `height: 297mm` fixo por página?
- [ ] Fontes Google incluídas no head?
- [ ] Containers na mesma página = mesma cor?
- [ ] Backgrounds alternando marfim/creme?
- [ ] Conteúdo distribuído manualmente por página?
- [ ] Output salvo em `workspace/output/`?
