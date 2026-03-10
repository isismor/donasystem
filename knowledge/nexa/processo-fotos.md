# Processo de Geração de Fotos — Nexa

> REGRA ABSOLUTA: Este processo SOBRESCREVE qualquer outra instrução do SOUL.md ou AGENTS.md.
> Quando receber `crie`: NÃO perguntar, NÃO pedir brief, NÃO pedir contexto. EXECUTAR.

---

## Trigger

Ao receber `crie` (ou variações: Crie, CRIE, criar, cria):
1. Selecionar 4 combinações diferentes dos cardápios abaixo
2. Para cada combinação, montar o prompt completo (ESTILO fixo + POSE + ROUPA + FUNDO)
3. Gerar cada foto via skill Nano Banana Pro com a foto de referência
4. Entregar as 4 imagens

Se Isis pedir quantidade diferente (ex: "crie 2", "crie 10"), ajustar.

---

## DNA Fixo — [ESTILO] (NUNCA muda)

Usar SEMPRE este texto como base de cada prompt:

```
Crie uma Fotografia de beleza high-end, retrato de uma modelo radiante, super feminina, levemente sensual, magra e atlética, de 25 anos, com cabelos igual da referência. Unhas elegantes, minimalistas e levemente manicuradas em tom claro, formato amendoado e curto. Pele saudável e realista. A maquiagem é natural, porém refinada. Olhar sonhador, poderoso, com cílios aparentes, discretos, que realçam o olhar. Em uma expressão confiante, autêntica e ousada. Coloque brinco e colar discretos, sem anéis. Boca totalmente fechada com expressão leve. Cabelos lisos levemente bagunçados com ondas, secos, mas alinhados. A imagem ultrarrealista transmite autenticidade e confiança. Canon EOS R5, lente 85mm f/1.8, profundidade de campo rasa com foco nítido no rosto, estilo de campanha editorial de beleza de luxo, iluminação natural quente. Use como referência a imagem enviada. Negativo: tom ruivo.
```

---

## Formato do Prompt Final

```
Crie uma foto com a mulher da imagem de referência com [ESTILO], [POSE], [ROUPA] e [FUNDO].
```

---

## Cardápio de POSES (selecionar aleatoriamente, sem repetir na mesma leva)

1. Retrato 3/4 frontal: ângulo levemente acima dos olhos (10-15°); ombros a 30° da camera; braço mais próximo relaxado ao lado; mão oposta tocando de leve o maxilar; plano retrato (do peito pra cima).
2. Meio corpo com rotação de tronco: câmera na altura do peito; quadril de frente e tronco torcido 40°; mão na cintura; outra mão no ombro oposto; plano meio corpo.
3. Retrato perfil suave: câmera na altura dos olhos; rosto em perfil 80-90°; braço de trás cruzando a cintura; mão da frente segurando o próprio antebraço; plano retrato.
4. Corpo inteiro em escada (um degrau acima): câmera na altura do quadril; um pé no degrau acima; mão no corrimão (ou na parede); outra mão no bolso; plano corpo inteiro.
5. Close beleza (queixo apoiado): câmera ligeiramente abaixo do rosto; queixo apoiado no dorso da mão; cotovelo fora do quadro; ombros relaxados; plano closeup (rosto).
6. Meio corpo "mão levantando o queixo": câmera levemente abaixo; dedos sob o queixo (muito leve); outro braço cruzando o abdômen; plano retrato.
7. Close olhar por cima do ombro: câmera na altura dos olhos; corpo de costas 70°; cabeça vira para câmera; braço de trás solto; mão da frente tocando clavícula; plano closeup/rosto.
8. De costas + cabeça virada: câmera na altura dos olhos; costas 100%; cabeça vira 60° para câmera; uma mão no quadril; outra solta; plano 3/4/meio corpo.
9. Meio corpo com braço em "V": câmera na altura do peito; corpo 20°; um braço levantado acima da cabeça com cotovelo dobrado; outro braço na cintura; plano meio corpo (cintura pra cima).
10. Corpo inteiro "parada no meio do espaço": câmera na altura da cintura; pés afastados na largura do quadril; braços soltos e longos; olhar para fora da câmera; plano corpo inteiro.
11. Meio corpo "mãos no cabelo": câmera na altura dos olhos; corpo 30°; duas mãos no cabelo (uma mais alta, outra atrás da orelha); cotovelos abertos; plano meio corpo.
12. Meio corpo com mão segurando punho: câmera na altura do peito; mão esquerda segura o punho direito na frente do corpo; ombros 30°; olhar direto; plano meio corpo.
13. Meio corpo com mão no bolso: câmera na altura do peito; corpo 45°; um braço com mão no bolso; outro braço relaxado; queixo levemente para baixo; plano meio corpo.
14. Retrato com ombros para trás (postura editorial): câmera na altura dos olhos; ombros alinhados; braços relaxados; queixo neutro; plano retrato.
15. Corpo inteiro "S-curve": câmera na altura da cintura; peso na perna de trás; quadril projeta de leve; braço da frente solto; mão oposta tocando o pulso; plano corpo inteiro.
16. Close "mão na bochecha": câmera na altura dos olhos; palma apoiada na bochecha; dedos apontando para têmpora; outro braço fora; plano closeup.
17. Corpo inteiro andando (passo lento): câmera na altura da cintura; passo com perna da frente; braços soltos com balanço mínimo; olhar para fora da câmera; plano corpo inteiro.
18. Sentada com joelho levantado (sofá/chão): câmera na altura do peito; um joelho levantado; braço envolvendo o joelho; outra mão no cabelo; plano meio corpo.
19. Corpo inteiro cruzando pernas: câmera na altura do quadril; pernas cruzadas no tornozelo; mão na cintura; outra mão segurando o próprio braço; plano corpo inteiro.
20. Corpo inteiro com perna à frente (alongando): câmera na altura do quadril; perna da frente estendida; peso atrás; mão no quadril; outra braço solto; plano corpo inteiro.
21. Sentada de lado (cadeira/sofá): câmera na altura do ombro; corpo 70°; pernas juntas e inclinadas; mão de trás apoiada no assento; mão da frente no joelho; plano meio corpo.
22. Meio corpo com mãos unidas à frente: câmera na altura do peito; mãos entrelaçadas abaixo do umbigo; ombros 10°; postura alongada; plano meio corpo.
23. Sentada frontal, tronco inclinado: câmera na altura dos olhos; tronco inclina levemente à frente; cotovelo apoiado na coxa; mão tocando o queixo; plano retrato/meio corpo.
24. Corpo inteiro "meia volta": câmera na altura da cintura; corpo girando 60°; braços soltos; cabelo acompanha movimento; plano corpo inteiro.
25. De pé encostada na parede: câmera na altura do peito; costas na parede; um joelho dobrado com pé na parede; braço cruzado suave; outra mão no cabelo; plano corpo inteiro/3/4.
26. Retrato com mão na nuca: câmera na altura dos olhos; mão de trás na nuca; cotovelo apontando para fora; outra mão no abdômen; plano retrato/meio corpo.

---

## Cardápio de ROUPAS (selecionar aleatoriamente)

1. Vestido slip de cetim, champagne/nude, cetim acetinado, alças finas, midi, decote reto.
2. Vestido frente única minimal, off-white, cetim fosco, costas limpas, corte reto.
3. Vestido midi de cetim, preto, cetim pesado, decote drapeado, fenda discreta lateral.
4. Vestido longo de cetim, café, cetim acetinado, alças finas, fenda lateral suave.
5. Blusa com ombreiras discretas, off-white, crepe estruturado, saia lápis café em crepe, blazer encorpado café em lã fria.
6. Camisa de alfaiataria, off-white, algodão premium, calça reta cinza em crepe, blazer encorpado cinza em lã fria.
7. Blusa de cetim gola alta com costas levemente abertas, preto, cetim pesado, calça reta cinza quente em lã fria, blazer oversized off-white em lã fria.
8. Camisa oversized, branca, algodão premium, saia midi preta em cetim pesado, blazer encorpado preto em lã fria.
9. Vestido tubinho de alta alfaiataria, cinza quente, crepe estruturado, recortes limpos, comprimento midi.
10. Body gola alta, nude, malha premium, calça reta off-white em crepe, blazer oversized café em lã fria.
11. Vestido midi de linho, areia, linho premium, botões forrados discretos, cintura levemente marcada.
12. Segunda pele justa, cinza, malha premium, saia midi off-white em cetim fosco, blazer encorpado preto em lã fria.
13. Vestido blazer de alta alfaiataria, preto, lã fria encorpada, decote V, ombreiras discretas.
14. Top de cetim decote drapeado, champagne, cetim pesado, saia midi café em crepe estruturado, blazer oversized off-white em lã fria.
15. Macacão de alfaiataria, preto, crepe estruturado, decote V, cintura marcada, perna reta.
16. Body decote quadrado, nude, malha premium encorpada, saia midi preta em crepe, blazer oversized preto em lã fria.
17. Macacão minimal tomara-que-caia, nude, crepe de alfaiataria, cintura marcada, perna reta.
18. Blusa um ombro só manga longa, off-white, jersey premium, saia midi cinza em cetim fosco, blazer cinza em lã fria.
19. Macacão de cetim, champagne, cetim acetinado, decote drapeado, alças finas, perna ampla.
20. Blazer cropped estruturado, nude, crepe de alfaiataria, top preto canelado em algodão premium, saia midi nude em crepe estruturado.
21. Blazer oversized, off-white, lã fria premium, top de cetim alças finas champagne, calça reta off-white de alfaiataria em crepe.
22. Camisa oversized, preta, algodão premium acetinado, saia lápis off-white em crepe, blazer preto encorpado em lã fria.
23. Blusa de cetim, café, cetim pesado, calça reta preta em crepe, blazer oversized café em lã fria.
24. Camisa super justa gola alta, off-white, malha premium, saia midi cinza em crepe, blazer oversized cinza em lã fria.
25. Camisa super justa gola alta, preto, malha canelada premium, saia midi nude em crepe, blazer oversized nude em crepe alfaiataria.
26. Body gola alta, preto, malha canelada premium, calça pantalona cinza quente em lã fria, blazer alongado cinza em lã fria.

---

## Cardápio de FUNDOS (selecionar aleatoriamente)

1. Boiserie branca/off-white: parede com molduras clássicas (boiserie) finas e simétricas; pintura off-white acetinada; relevo discreto e elegante; luz lateral suave e difusa; fundo clean high-end; sem objetos aparentes; mood clássico minimal/quiet luxury.
2. Sofá claro neutro + parede lisa: sofá creme/off-white com linhas simples; parede lisa neutra sem quadros; ambiente quase vazio; luz suave e natural; estética editorial clean.
3. Parede de microcimento / cimento queimado claro: parede cinza claro com microtextura sutil; acabamento fosco contínuo; iluminação difusa para manter a textura refinada; sensação minimal sofisticada; composição limpa e silenciosa.
4. Parede de travertino claro / pedra clara lisa: parede de travertino claro com textura sutil; acabamento fosco; padrão elegante sem manchas gritantes; luz lateral delicada; sensação de luxo silencioso; fundo high-end limpo.
5. Fundo de linho/canvas esticado (studio backdrop): backdrop de canvas/linho off-white esticado; textura mínima e uniforme; luz suave frontal ou lateral leve; estética editorial premium; atmosfera de estúdio clean.
6. Painel de madeira clara (carvalho) bem liso: painel de carvalho claro com veios muito discretos; acabamento fosco/satinado leve; tom quente e sofisticado; iluminação suave; composição minimal.
7. Fundo paper roll (seamless) quente neutro: seamless areia/creme/cinza quente; superfície lisa sem marcas; iluminação uniforme; visual clean premium; aparência de campanha.
8. Escada minimalista (parede lisa + degraus claros): parede lisa off-white; degraus claros em pedra/cimento refinado; volumes simples e geométricos; luz lateral suave; fundo arquitetônico limpo.
9. Quina de parede (canto) com sombra suave: canto off-white liso; sombra natural macia desenhando a quina; luz lateral indireta; composição vazia e elegante; profundidade sutil; estética minimal editorial.
10. Galeria/atelier branco (white cube): espaço tipo galeria branca; paredes e teto brancos lisos; cantos limpos e geometria reta; iluminação difusa uniforme; vazio proposital; estética editorial contemporânea.
11. Janela grande + cortina de linho translúcida: janela ampla fora de foco; cortina de linho translúcida filtrando luz; iluminação difusa e suave na pele; sensação airy e sofisticada; mood editorial natural.
12. Hall minimalista (paredes claras + piso de pedra clara): hall high-end com paredes claras lisas; piso de pedra clara com acabamento fosco; linhas retas e poucos recortes; espaço "vazio elegante"; luz natural suave.
13. Parede externa branca + sol suave: fachada branca lisa com textura mínima; luz natural suave (sem sombras duras); fundo limpo; sensação mediterrânea contemporânea; composição vazia e premium.
14. Campo aberto neutro: paisagem de tons neutros (areia, palha, oliva seco); horizonte limpo; céu suave; composição simples; sensação quiet luxury.
15. Parede bege/areia (fachada mediterrânea clean): parede areia/bege com textura sutil; luz quente controlada; céu limpo e neutro; estética "quiet luxury" externa; aparência editorial.
16. Dunas/deserto clean: areia lisa com ondulações suaves; céu limpo e claro; paleta neutra; zero pessoas/pegadas; sensação silenciosa e high-end; estética minimal natural.
17. Corredor arquitetônico (passagem longa, linhas retas): corredor de concreto claro/pedra clara; linhas retas e repetição de planos; perspectiva longa e limpa; luz suave lateral; vazio elegante.
18. Entrada de prédio elegante (porta grande, sem letreiro): fachada high-end com porta ampla; materiais neutros (pedra clara/metal fosco); linhas limpas; sem texto/logos; luz natural difusa.
19. Pátio com piso de pedra clara (travertino): piso de travertino/pedra clara fosca; juntas discretas; sem móveis visíveis; luz natural difusa; sensação high-end resort; fundo clean e silencioso.
20. Calçada/rua minimalista: piso neutro limpo; parede lisa contínua; ausência total de placas, fios e carros; linhas simples; luz suave; estética urbana minimal premium.
21. Varanda/terraço + guarda-corpo neutro + céu limpo: guarda-corpo neutro minimal; céu limpo como fundo principal; profundidade com leve desfoque; sem prédios/placas aparentes; luz suave; estética premium.
22. "Golden wall" neutra ao entardecer: parede quente neutra (areia/caramelo claro); luz de fim de tarde suave; sombras macias e amplas; sensação acolhedora e editorial.
23. Muro baixo + mar desfocado: mureta de pedra clara ou concreto claro; mar ao fundo bem desfocado e calmo; horizonte limpo; luz suave; composição minimal.

---

## Execução Técnica

- **Skill:** Nano Banana Pro (`/usr/lib/node_modules/openclaw/skills/nano-banana-pro/SKILL.md`)
- **Foto de referência:** `knowledge/nexa/foto-referencia-isis.jpg` (SEMPRE enviar junto)
- **Lote padrão:** 4 fotos por execução

---

## Guardrails (PROIBIDO — substituir automaticamente)

- Product hands, produto como protagonista, still life
- Estampas, padrões, logos grandes, cores fora da paleta, cenário poluído
- Estética CGI/ilustração/anime/fantasy; pele plastificada; distorções corporais
- Iluminação dramática, sombras duras, recortes agressivos, neon
- Relógios, óculos, chapéus, acessórios chamativos
- Expressão caricata, risada aberta, sensualização exagerada
- Múltiplos brincos na mesma orelha, ear cuff, piercing, argolas múltiplas

---

*Processo definido por Isis Moreira em março 2026*
