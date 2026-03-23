# Guia do Template: Landing Page Isis Moreira

Template canônico baseado no Design System ISIS v7. Use para criar novas landing pages de produtos e programas da Isis Moreira.

---

## Como criar uma nova página a partir do template

1. Copie o arquivo `landing-page-isis.html` para a pasta do novo programa. Exemplo: `cp templates/landing-page-isis.html meu-programa/index.html`
2. Abra o arquivo copiado em qualquer editor de texto.
3. Use a função "Buscar e substituir" (Ctrl+H ou Cmd+H) para localizar cada `{{PLACEHOLDER}}` e substituir pelo valor real.
4. Substitua todos os placeholders antes de publicar. Nenhum placeholder deve aparecer na versão final.
5. Coloque os arquivos de imagem na pasta `assets/` do programa.
6. Suba o arquivo e a pasta `assets/`.

---

## Seções fixas da página (em ordem)

| Ordem | ID da seção | Fundo | Descrição |
|---|---|---|---|
| 1 | `#hero` | Escuro (hero-dark) | Foto de fundo, logo, tagline, descrição e botão CTA |
| 2 | `#ticker` | Cacau | Faixa animada com palavras-chave do programa |
| 3 | `#stats` | Marfim | Quatro números de credibilidade |
| 4 | `#dores` | Creme | Seis blocos de problemas do público |
| 5 | `#solucao` | Cacau | Texto de transição apresentando o programa como solução |
| 6 | `#para-quem` | Marfim | Duas colunas: para quem é e para quem não é |
| 7 | `#entregas` | Cacau | Seis cards com o que o programa entrega |
| 8 | `#comparativo` | Marfim | Tabela de contraste: com o programa vs. sem o programa |
| 9 | `#investimento` | Cacau | Texto sobre acesso ou preço, com botão CTA |
| 10 | `#urgencia` | Marfim | Texto de senso de urgência e consequência de não agir |
| 11 | `#sobre` | Creme | Biografia de Isis Moreira com foto e mini-estatísticas |
| 12 | `#faq` | Creme | Quatro perguntas frequentes em formato acordeão |
| 13 | `#cta-final` | Cacau | Texto de fechamento com botão CTA final |
| 14 | `#footer` | Cacau | Copyright e referência ao ecossistema |

---

## Placeholders: referência completa

### Meta e identificação

| Placeholder | Onde aparece | Exemplo de valor |
|---|---|---|
| `{{META_TITULO}}` | Tag `<title>` do HTML | `Club Myna \| Isis Moreira` |
| `{{META_DESCRICAO}}` | Tag `<meta name="description">` | `O club de negócios onde você implementa seu sistema operacional com IA.` |
| `{{PROGRAMA_NOME}}` | Logo alt, títulos de seção, ticker, comparativo, FAQ, para quem | `Club Myna` |

---

### Hero

| Placeholder | Onde aparece | Exemplo de valor |
|---|---|---|
| `{{FOTO_HERO}}` | CSS `background-image` da seção `#hero` | `./assets/hero-isis.jpg` ou string base64 (ver seção de fotos) |
| `{{LOGO_SRC}}` | Atributo `src` da tag `<img>` do logo | `./assets/logo-myna.png` |
| `{{PROGRAMA_BADGE}}` | Texto dentro do badge-pill no hero | `Club de sistemas, tecnologia e negócios inteligentes` |
| `{{PROGRAMA_TAGLINE}}` | Tag `<h1>` do hero | `Escale de forma automatizada, inteligente, rápida e econômica com um sistema operacional que trabalha enquanto você lidera.` |
| `{{PROGRAMA_DESCRICAO}}` | Parágrafo de descrição abaixo do H1 no hero | `O Myna é o único club de negócios onde você aprende, implementa e opera sistemas de IA com acompanhamento real.` |
| `{{CTA_TEXTO}}` | Texto dos botões CTA (hero, investimento e CTA final) | `Quero aplicar e entrar no club` |
| `{{CTA_LINK}}` | Atributo `href` dos botões CTA | `https://myna.isismoreira.com.br/aplicar` |

Observação sobre o botão CTA: o Design System original usa cada letra em um `<span>` separado para o efeito de animação letra a letra no hover. No template, o texto foi simplificado para um bloco único `{{CTA_TEXTO}}`. Se desejar reativar a animação letra a letra, substitua o conteúdo de `.btn-text` por um `<span>` por caractere, exemplo: `<span>Q</span><span>u</span><span>e</span><span>r</span><span>o</span>`. O CSS para esse efeito já está presente e funcionará automaticamente.

---

### Ticker

| Placeholder | Onde aparece | Exemplo de valor |
|---|---|---|
| `{{TICKER_ITEM_1}}` | Primeiro item da faixa animada | `Sistemas libertam` |
| `{{TICKER_ITEM_2}}` | Terceiro item (o segundo é `{{PROGRAMA_NOME}}`) | `Tecnologia` |
| `{{TICKER_ITEM_3}}` | Quarto item | `Inteligência Artificial` |
| `{{TICKER_ITEM_4}}` | Quinto item | `Agentes Orquestrados` |
| `{{TICKER_ITEM_5}}` | Sexto item | `Negócios Inteligentes` |
| `{{TICKER_ITEM_6}}` | Sétimo item | `Chegue na frente` |
| `{{TICKER_ITEM_7}}` | Oitavo item | `Velocidade` |
| `{{TICKER_ITEM_8}}` | Nono item | `Precisão` |

O ticker tem 9 itens únicos duplicados para loop contínuo. `{{PROGRAMA_NOME}}` aparece fixo na segunda posição.

---

### Stats (4 blocos)

| Placeholder | Onde aparece | Exemplo de valor |
|---|---|---|
| `{{STAT_1_NUMERO}}` | Número em destaque do stat 1 | `10 anos` |
| `{{STAT_1_TEXTO}}` | Label descritivo do stat 1 | `formando homens e mulheres que empreendem com negócios educacionais` |
| `{{STAT_2_NUMERO}}` | Número em destaque do stat 2 | `40 mil` |
| `{{STAT_2_TEXTO}}` | Label descritivo do stat 2 | `alunos formados no ecossistema Isis Moreira` |
| `{{STAT_3_NUMERO}}` | Número em destaque do stat 3 | `2 mil` |
| `{{STAT_3_TEXTO}}` | Label descritivo do stat 3 | `empreendedores mentorados diretamente` |
| `{{STAT_4_NUMERO}}` | Número em destaque do stat 4 | `R$30 mil` |
| `{{STAT_4_TEXTO}}` | Label descritivo do stat 4 | `de economia mensal mínima que membros do Myna conquistam na operação` |

---

### Dores / Problemas (6 blocos)

Cada bloco tem um título curto e um texto descritivo. O título foi adicionado ao template como elemento `<strong class="dor-titulo">` para ampliar a hierarquia visual. O CSS da classe `.dor-titulo` já está incluído.

| Placeholder | Onde aparece | Exemplo de valor |
|---|---|---|
| `{{DORES_TITULO}}` | H2 da seção de dores | `Você reconhece alguma dessas situações?` |
| `{{PROBLEMA_1_TITULO}}` | Título do bloco de problema 1 | `Equipe que nunca chega no nível` |
| `{{PROBLEMA_1_TEXTO}}` | Texto descritivo do bloco 1 | `Você contrata, treina, contrata de novo. A equipe nunca chega no nível que o seu negócio exige.` |
| `{{PROBLEMA_2_TITULO}}` | Título do bloco 2 | `Você apaga incêndio o tempo todo` |
| `{{PROBLEMA_2_TEXTO}}` | Texto do bloco 2 | `Semanas passam. As entregas não chegam. Você mesmo faz o que deveria ter sido feito.` |
| `{{PROBLEMA_3_TITULO}}` | Título do bloco 3 | `Custo crescendo mais rápido que a receita` |
| `{{PROBLEMA_3_TEXTO}}` | Texto do bloco 3 | `O custo operacional cresce mais rápido do que a receita. Mais faturamento, menos sobra.` |
| `{{PROBLEMA_4_TITULO}}` | Título do bloco 4 | `Ferramentas que não se conectam` |
| `{{PROBLEMA_4_TEXTO}}` | Texto do bloco 4 | `Você tentou ferramentas de IA, contratou freelancers, comprou cursos. Nada se conectou.` |
| `{{PROBLEMA_5_TITULO}}` | Título do bloco 5 | `Reuniões que não decidem nada` |
| `{{PROBLEMA_5_TEXTO}}` | Texto do bloco 5 | `Reunião sobre reunião, e as decisões continuam presas no mesmo lugar.` |
| `{{PROBLEMA_6_TITULO}}` | Título do bloco 6 | `Concorrentes menores crescem mais rápido` |
| `{{PROBLEMA_6_TEXTO}}` | Texto do bloco 6 | `O mercado acelera. Concorrentes menores crescem mais rápido, com equipes mais enxutas.` |

---

### Solução

| Placeholder | Onde aparece | Exemplo de valor |
|---|---|---|
| `{{SOLUCAO_TITULO}}` | H2 da seção solução | `O problema nunca foi falta de esforço.` |
| `{{SOLUCAO_TEXTO}}` | Primeiro parágrafo de corpo | `Você trabalhou. Contratou. Reorganizou. Investiu. E mesmo assim, o crescimento ficou represado.` |
| `{{SOLUCAO_TEXTO_2}}` | Segundo parágrafo de corpo | `O que faltou foi um sistema. Um sistema real, operando de forma integrada.` |
| `{{SOLUCAO_GANCHO}}` | Parágrafo em cor ouro, faz a ponte para o produto | `Esse sistema existe. Ele tem nome.` |
| `{{SOLUCAO_DESTAQUE}}` | Frase em destaque (DM Serif, itálico, ouro grande) | `Conheça o Club Myna.` |
| `{{SOLUCAO_TEXTO_3}}` | Parágrafo após o destaque, descrevendo o produto | `O Myna foi criado para empresários que decidiram parar de crescer na base do volume humano.` |
| `{{SOLUCAO_TAGLINE}}` | Linha final em IBM Plex Mono, caixa alta | `Sistemas libertam. Tecnologia é leveza.` |

---

### Para quem é / não é

| Placeholder | Onde aparece | Exemplo de valor |
|---|---|---|
| `{{PARA_QUEM_SIM_1}}` a `{{PARA_QUEM_SIM_6}}` | Itens da lista "Para quem é" | `Para quem fatura e quer escalar sem contratar mais.` |
| `{{PARA_QUEM_NAO_1}}` a `{{PARA_QUEM_NAO_6}}` | Itens da lista "Para quem não é" | `Para quem prefere manter os processos engessados como estão.` |

Os cabeçalhos das colunas usam `{{PROGRAMA_NOME}}` automaticamente.

---

### Entregas (6 cards)

O campo `{{ENTREGA_N_NUMERO}}` substitui o ícone original. Pode receber um número ordinal ("01", "02") ou uma classe de ícone Flaticon (`<i class="fi fi-rr-comments"></i>`). O container `.entrega-icon` já tem estilo para centralizar qualquer conteúdo inline.

| Placeholder | Onde aparece | Exemplo de valor |
|---|---|---|
| `{{ENTREGA_1_NUMERO}}` | Ícone/número do card 1 | `01` |
| `{{ENTREGA_1_TITULO}}` | Título do card 1 | `Grupo diário de membros` |
| `{{ENTREGA_1_TEXTO}}` | Descrição do card 1 | `Acesso a um grupo ativo com outros empresários do mesmo nível.` |
| `{{ENTREGA_2_NUMERO}}` a `{{ENTREGA_6_NUMERO}}` | Ícone/número dos cards 2 a 6 | `02`, `03`... |
| `{{ENTREGA_2_TITULO}}` a `{{ENTREGA_6_TITULO}}` | Títulos dos cards 2 a 6 | `1 encontro online por mês` |
| `{{ENTREGA_2_TEXTO}}` a `{{ENTREGA_6_TEXTO}}` | Descrições dos cards 2 a 6 | `Sessão ao vivo com Isis Moreira.` |

---

### Comparativo (8 linhas)

| Placeholder | Onde aparece | Exemplo de valor |
|---|---|---|
| `{{COMPARATIVO_SEM_1}}` a `{{COMPARATIVO_SEM_8}}` | Coluna esquerda "Sem o programa" | `Contratações constantes para cobrir buracos da operação` |
| `{{COMPARATIVO_COM_1}}` a `{{COMPARATIVO_COM_8}}` | Coluna direita "Com o programa" | `1 sistema que substitui funções inteiras` |

---

### Investimento

| Placeholder | Onde aparece | Exemplo de valor |
|---|---|---|
| `{{INVESTIMENTO_TITULO}}` | H2 da seção | `O acesso ao Myna é feito por aplicação.` |
| `{{INVESTIMENTO_TEXTO_1}}` | Primeiro parágrafo | `O processo de aplicação existe para garantir que cada membro está no momento certo.` |
| `{{INVESTIMENTO_TEXTO_2}}` | Segundo parágrafo | `Preencha sua aplicação. Vamos avaliar e entrar em contato para a próxima etapa.` |

---

### Urgência

| Placeholder | Onde aparece | Exemplo de valor |
|---|---|---|
| `{{URGENCIA_TITULO}}` | H2 da seção | `Quem age agora tem vantagem que demora anos para ser recuperada.` |
| `{{URGENCIA_TEXTO_1}}` a `{{URGENCIA_TEXTO_4}}` | Parágrafos do corpo | `Enquanto você avalia, empresários do mesmo porte já estão implementando.` |
| `{{URGENCIA_TAGLINE}}` | Linha final em caixa alta e borda lateral | `Sistemas libertam. E quem sistematiza primeiro, chega mais longe.` |

---

### Sobre Isis

| Placeholder | Onde aparece | Exemplo de valor |
|---|---|---|
| `{{SOBRE_TITULO}}` | H2 da seção | `Isis Moreira` (pode usar `<em>` inline: `Isis <em>Moreira</em>`) |
| `{{SOBRE_BIO_1}}` a `{{SOBRE_BIO_3}}` | Parágrafos de biografia | `Isis Moreira é mentora de negócios há 10 anos.` |
| `{{SOBRE_BIO_DESTAQUE}}` | Parágrafo final em itálico ouro-deep | `Isis não ensina o que vai tentar. Ensina o que já opera.` |
| `{{SOBRE_STAT_1_NUM}}` a `{{SOBRE_STAT_4_NUM}}` | Números das mini-estatísticas | `10 anos`, `40k`, `2k`, `1 livro` |
| `{{SOBRE_STAT_1_LABEL}}` a `{{SOBRE_STAT_4_LABEL}}` | Labels das mini-estatísticas | `de mentoria`, `alunos formados`, `mentorados`, `best-seller` |
| `{{SOBRE_FOTO_SRC}}` | Atributo `src` da foto de Isis na seção Sobre | `./assets/foto-sobre-isis.jpg` |
| `{{SOBRE_FOTO_ALT}}` | Atributo `alt` da foto | `Isis Moreira` |

---

### FAQ (4 perguntas)

| Placeholder | Onde aparece | Exemplo de valor |
|---|---|---|
| `{{FAQ_1_PERGUNTA}}` a `{{FAQ_4_PERGUNTA}}` | Texto do botão de pergunta | `Já testei ferramentas de IA e não tive resultado. Por que o Myna seria diferente?` |
| `{{FAQ_1_RESPOSTA}}` a `{{FAQ_4_RESPOSTA}}` | Texto da resposta expandida | `Porque o Myna não entrega ferramentas. Entrega um sistema.` |

---

### CTA Final

| Placeholder | Onde aparece | Exemplo de valor |
|---|---|---|
| `{{CTA_FINAL_TITULO}}` | H2 da seção de fechamento | `Você chegou até aqui porque reconhece o que o Club Myna representa.` |
| `{{CTA_FINAL_TEXTO_1}}` | Primeiro parágrafo | `Um negócio que cresce com sistemas, opera com inteligência e libera o seu tempo.` |
| `{{CTA_FINAL_TEXTO_2}}` | Segundo parágrafo | `A aplicação leva minutos. A decisão de entrar pode mudar os próximos anos da sua operação.` |
| `{{CTA_FINAL_TAGLINE}}` | Linha em IBM Plex Mono antes do botão | `O próximo passo é simples.` |

---

### Footer

| Placeholder | Onde aparece | Exemplo de valor |
|---|---|---|
| `{{FOOTER_COPY}}` | Texto de copyright à esquerda | `© 2026 Club Myna. Isis Moreira. Todos os direitos reservados.` |
| `{{FOOTER_ECOSSISTEMA}}` | Texto complementar à direita | `Club Myna faz parte do ecossistema Donas do Ouro.` |

---

## Instruções para a foto de fundo do hero

O placeholder `{{FOTO_HERO}}` define a `background-image` da seção `#hero` via CSS.

**Formatos aceitos:**
- Caminho relativo para arquivo de imagem: `./assets/hero-isis.jpg`
- URL absoluta: `https://exemplo.com/imagem.jpg`
- String base64 completa: `data:image/jpeg;base64,/9j/4AAQSkZJRgAB...`

**Tamanho recomendado:**
- Largura mínima: 1920px
- Altura mínima: 900px
- Formato: JPG (qualidade 85) para menor peso
- Orientação: a imagem deve ter o assunto principal centralizado ou levemente à direita, pois o overlay escuro cobre o lado esquerdo para garantir legibilidade do texto

**Dica de posicionamento:** o CSS usa `background-position: center top`. Se a foto tem o rosto ou elemento principal no terço superior, ele ficará visível. Para ajustar, edite o valor de `background-position` diretamente no CSS da regra `#hero`.

---

## Instruções para a foto da seção Sobre

O placeholder `{{SOBRE_FOTO_SRC}}` define o atributo `src` de uma tag `<img>` convencional.

**Tamanho recomendado:**
- Largura: 600px a 900px
- Altura: 800px a 1200px (proporção retrato)
- A imagem é renderizada com `height: 560px` e `object-fit: cover`, então o enquadramento é feito automaticamente
- Em mobile, a altura reduz para 360px

---

## Notas técnicas

- Todo o Design System ISIS v7 está embutido no `<style>` do arquivo. Nenhuma folha de estilo externa é necessária além das fontes (Google Fonts) e ícones (Flaticon CDN).
- O JavaScript no final do arquivo controla dois comportamentos: animação de entrada dos elementos ao fazer scroll (IntersectionObserver) e o acordeão de FAQ. Nenhuma biblioteca externa é usada.
- A animação de ticker usa CSS puro com `@keyframes ticker-move`. A velocidade pode ser ajustada alterando o valor `35s` na regra `.ticker-track`.
- Para adicionar ou remover blocos de problema, entrega ou FAQ, copie ou remova o bloco HTML correspondente e renomeie os placeholders em sequência.
