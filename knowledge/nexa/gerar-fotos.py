#!/usr/bin/env python3
"""
Gerador automático de fotos Nexa — Dona System
Seleciona combinações aleatórias dos cardápios e gera via Nano Banana Pro.

Uso:
    python3 gerar-fotos.py [quantidade]    (default: 4)
    python3 gerar-fotos.py 1              (gerar 1 foto)
    python3 gerar-fotos.py 10             (gerar 10 fotos)
"""

import random
import subprocess
import sys
from datetime import datetime
from pathlib import Path

WORKSPACE = Path(__file__).parent.parent.parent
SCRIPT = "/usr/lib/node_modules/openclaw/skills/nano-banana-pro/scripts/generate_image.py"
REFERENCIA = Path(__file__).parent / "foto-referencia-isis.jpg"
OUTPUT_DIR = WORKSPACE / "output" / "nexa"

DNA_FIXO = (
    "Crie uma Fotografia de beleza high-end, retrato de uma modelo radiante, "
    "super feminina, levemente sensual, magra e atlética, de 25 anos, com cabelos "
    "igual da referência. Unhas elegantes, minimalistas e levemente manicuradas em "
    "tom claro, formato amendoado e curto. Pele saudável e realista. A maquiagem é "
    "natural, porém refinada. Olhar sonhador, poderoso, com cílios aparentes, "
    "discretos, que realçam o olhar. Em uma expressão confiante, autêntica e ousada. "
    "Coloque brinco e colar discretos, sem anéis. Boca totalmente fechada com "
    "expressão leve. Cabelos lisos levemente bagunçados com ondas, secos, mas "
    "alinhados. A imagem ultrarrealista transmite autenticidade e confiança. "
    "Canon EOS R5, lente 85mm f/1.8, profundidade de campo rasa com foco nítido "
    "no rosto, estilo de campanha editorial de beleza de luxo, iluminação natural "
    "quente. Use como referência a imagem enviada. Negativo: tom ruivo."
)

POSES = [
    "Retrato 3/4 frontal: ângulo levemente acima dos olhos (10-15°); ombros a 30° da camera; braço mais próximo relaxado ao lado; mão oposta tocando de leve o maxilar; plano retrato (do peito pra cima).",
    "Meio corpo com rotação de tronco: câmera na altura do peito; quadril de frente e tronco torcido 40°; mão na cintura; outra mão no ombro oposto; plano meio corpo.",
    "Retrato perfil suave: câmera na altura dos olhos; rosto em perfil 80-90°; braço de trás cruzando a cintura; mão da frente segurando o próprio antebraço; plano retrato.",
    "Corpo inteiro em escada (um degrau acima): câmera na altura do quadril; um pé no degrau acima; mão no corrimão (ou na parede); outra mão no bolso; plano corpo inteiro.",
    "Close beleza (queixo apoiado): câmera ligeiramente abaixo do rosto; queixo apoiado no dorso da mão; cotovelo fora do quadro; ombros relaxados; plano closeup (rosto).",
    "Meio corpo mão levantando o queixo: câmera levemente abaixo; dedos sob o queixo (muito leve); outro braço cruzando o abdômen; plano retrato.",
    "Close olhar por cima do ombro: câmera na altura dos olhos; corpo de costas 70°; cabeça vira para câmera; braço de trás solto; mão da frente tocando clavícula; plano closeup/rosto.",
    "De costas + cabeça virada: câmera na altura dos olhos; costas 100%; cabeça vira 60° para câmera; uma mão no quadril; outra solta; plano 3/4/meio corpo.",
    "Meio corpo com braço em V: câmera na altura do peito; corpo 20°; um braço levantado acima da cabeça com cotovelo dobrado; outro braço na cintura; plano meio corpo.",
    "Corpo inteiro parada no meio do espaço: câmera na altura da cintura; pés afastados na largura do quadril; braços soltos e longos; olhar para fora da câmera; plano corpo inteiro.",
    "Meio corpo mãos no cabelo: câmera na altura dos olhos; corpo 30°; duas mãos no cabelo (uma mais alta, outra atrás da orelha); cotovelos abertos; plano meio corpo.",
    "Meio corpo com mão segurando punho: câmera na altura do peito; mão esquerda segura o punho direito na frente do corpo; ombros 30°; olhar direto; plano meio corpo.",
    "Meio corpo com mão no bolso: câmera na altura do peito; corpo 45°; um braço com mão no bolso; outro braço relaxado; queixo levemente para baixo; plano meio corpo.",
    "Retrato com ombros para trás (postura editorial): câmera na altura dos olhos; ombros alinhados; braços relaxados; queixo neutro; plano retrato.",
    "Corpo inteiro S-curve: câmera na altura da cintura; peso na perna de trás; quadril projeta de leve; braço da frente solto; mão oposta tocando o pulso; plano corpo inteiro.",
    "Close mão na bochecha: câmera na altura dos olhos; palma apoiada na bochecha; dedos apontando para têmpora; outro braço fora; plano closeup.",
    "Corpo inteiro andando (passo lento): câmera na altura da cintura; passo com perna da frente; braços soltos com balanço mínimo; olhar para fora da câmera; plano corpo inteiro.",
    "Sentada com joelho levantado: câmera na altura do peito; um joelho levantado; braço envolvendo o joelho; outra mão no cabelo; plano meio corpo.",
    "Corpo inteiro cruzando pernas: câmera na altura do quadril; pernas cruzadas no tornozelo; mão na cintura; outra mão segurando o próprio braço; plano corpo inteiro.",
    "De pé encostada na parede: câmera na altura do peito; costas na parede; um joelho dobrado com pé na parede; braço cruzado suave; outra mão no cabelo; plano corpo inteiro/3/4.",
    "Retrato com mão na nuca: câmera na altura dos olhos; mão de trás na nuca; cotovelo apontando para fora; outra mão no abdômen; plano retrato/meio corpo.",
    "Meio corpo com mãos unidas à frente: câmera na altura do peito; mãos entrelaçadas abaixo do umbigo; ombros 10°; postura alongada; plano meio corpo.",
    "Sentada frontal tronco inclinado: câmera na altura dos olhos; tronco inclina levemente à frente; cotovelo apoiado na coxa; mão tocando o queixo; plano retrato/meio corpo.",
    "Corpo inteiro meia volta: câmera na altura da cintura; corpo girando 60°; braços soltos; cabelo acompanha movimento; plano corpo inteiro.",
    "Meio corpo segurando a própria cintura: câmera na altura do peito; uma mão na cintura; outra mão segurando o pulso; corpo 45°; plano meio corpo.",
    "Corpo inteiro mãos atrás: câmera na altura da cintura; mãos entrelaçadas atrás do corpo; ombros abertos; peso na perna de trás; plano corpo inteiro.",
]

ROUPAS = [
    "Vestido slip de cetim, champagne/nude, cetim acetinado, alças finas, midi, decote reto.",
    "Vestido frente única minimal, off-white, cetim fosco, costas limpas, corte reto.",
    "Vestido midi de cetim, preto, cetim pesado, decote drapeado, fenda discreta lateral.",
    "Vestido longo de cetim, café, cetim acetinado, alças finas, fenda lateral suave.",
    "Blusa com ombreiras discretas, off-white, crepe estruturado, saia lápis café em crepe, blazer encorpado café em lã fria.",
    "Camisa de alfaiataria, off-white, algodão premium, calça reta cinza em crepe, blazer encorpado cinza em lã fria.",
    "Blusa de cetim gola alta com costas levemente abertas, preto, cetim pesado, calça reta cinza quente em lã fria, blazer oversized off-white em lã fria.",
    "Camisa oversized, branca, algodão premium, saia midi preta em cetim pesado, blazer encorpado preto em lã fria.",
    "Vestido tubinho de alta alfaiataria, cinza quente, crepe estruturado, recortes limpos, comprimento midi.",
    "Body gola alta, nude, malha premium, calça reta off-white em crepe, blazer oversized café em lã fria.",
    "Vestido midi de linho, areia, linho premium, botões forrados discretos, cintura levemente marcada.",
    "Segunda pele justa, cinza, malha premium, saia midi off-white em cetim fosco, blazer encorpado preto em lã fria.",
    "Vestido blazer de alta alfaiataria, preto, lã fria encorpada, decote V, ombreiras discretas.",
    "Top de cetim decote drapeado, champagne, cetim pesado, saia midi café em crepe estruturado, blazer oversized off-white em lã fria.",
    "Macacão de alfaiataria, preto, crepe estruturado, decote V, cintura marcada, perna reta.",
    "Body decote quadrado, nude, malha premium encorpada, saia midi preta em crepe, blazer oversized preto em lã fria.",
    "Macacão minimal tomara-que-caia, nude, crepe de alfaiataria, cintura marcada, perna reta.",
    "Blusa um ombro só manga longa, off-white, jersey premium, saia midi cinza em cetim fosco, blazer cinza em lã fria.",
    "Macacão de cetim, champagne, cetim acetinado, decote drapeado, alças finas, perna ampla.",
    "Blazer cropped estruturado, nude, crepe de alfaiataria, top preto canelado em algodão premium, saia midi nude em crepe estruturado.",
    "Blazer oversized, off-white, lã fria premium, top de cetim alças finas champagne, calça reta off-white de alfaiataria em crepe.",
    "Camisa oversized, preta, algodão premium acetinado, saia lápis off-white em crepe, blazer preto encorpado em lã fria.",
    "Blusa de cetim, café, cetim pesado, calça reta preta em crepe, blazer oversized café em lã fria.",
    "Body gola alta, preto, malha canelada premium, calça pantalona cinza quente em lã fria, blazer alongado cinza em lã fria.",
    "Camisa super justa gola alta, off-white, malha premium, saia midi cinza em crepe, blazer oversized cinza em lã fria.",
    "Camisa super justa gola alta, preto, malha canelada premium, saia midi nude em crepe, blazer oversized nude em crepe alfaiataria.",
]

FUNDOS = [
    "Cenário com Boiserie branca/off-white: parede com molduras clássicas finas e simétricas; pintura off-white acetinada; relevo discreto e elegante; luz lateral suave e difusa; fundo clean high-end; mood clássico minimal/quiet luxury.",
    "Cenário com Sofá claro neutro + parede lisa: sofá creme/off-white com linhas simples; parede lisa neutra sem quadros; ambiente quase vazio; luz suave e natural; estética editorial clean.",
    "Cenário com Parede de microcimento claro: parede cinza claro com microtextura sutil; acabamento fosco contínuo; iluminação difusa; sensação minimal sofisticada; composição limpa e silenciosa.",
    "Cenário com Parede de travertino claro: parede de travertino claro com textura sutil; acabamento fosco; luz lateral delicada; sensação de luxo silencioso; fundo high-end limpo.",
    "Cenário com Fundo de linho/canvas esticado (studio): backdrop de canvas/linho off-white esticado; textura mínima e uniforme; luz suave frontal ou lateral leve; estética editorial premium; atmosfera de estúdio clean.",
    "Cenário com Painel de madeira clara (carvalho): painel de carvalho claro com veios muito discretos; acabamento fosco/satinado leve; tom quente e sofisticado; iluminação suave; composição minimal.",
    "Cenário com Fundo paper roll (seamless) quente neutro: seamless areia/creme/cinza quente; superfície lisa sem marcas; iluminação uniforme; visual clean premium; aparência de campanha.",
    "Cenário com Escada minimalista: parede lisa off-white; degraus claros em pedra/cimento refinado; volumes simples e geométricos; luz lateral suave; fundo arquitetônico limpo.",
    "Cenário com Quina de parede (canto) com sombra suave: canto off-white liso; sombra natural macia; luz lateral indireta; composição vazia e elegante; estética minimal editorial.",
    "Cenário com Galeria/atelier branco (white cube): espaço tipo galeria branca; paredes e teto brancos lisos; cantos limpos; iluminação difusa uniforme; estética editorial contemporânea.",
    "Cenário com Janela grande + cortina de linho translúcida: janela ampla fora de foco; cortina de linho translúcida filtrando luz; iluminação difusa e suave; sensação airy e sofisticada; mood editorial natural.",
    "Cenário com Hall minimalista: hall high-end com paredes claras lisas; piso de pedra clara com acabamento fosco; linhas retas; espaço vazio elegante; luz natural suave.",
    "Cenário com Parede externa branca + sol suave: fachada branca lisa; luz natural suave sem sombras duras; fundo limpo; sensação mediterrânea contemporânea; composição vazia e premium.",
    "Cenário com Campo aberto neutro: paisagem de tons neutros (areia, palha, oliva seco); horizonte limpo; céu suave; composição simples; sensação quiet luxury.",
    "Cenário com Parede bege/areia (fachada mediterrânea): parede areia/bege com textura sutil; luz quente controlada; céu limpo e neutro; estética quiet luxury externa; aparência editorial.",
    "Cenário com Dunas/deserto clean: areia lisa com ondulações suaves; céu limpo e claro; paleta neutra; sensação silenciosa e high-end; estética minimal natural.",
    "Cenário com Corredor arquitetônico: corredor de concreto claro/pedra clara; linhas retas e repetição de planos; perspectiva longa e limpa; luz suave lateral; vazio elegante.",
    "Cenário com Entrada de prédio elegante: fachada high-end com porta ampla; materiais neutros (pedra clara/metal fosco); linhas limpas; sem texto/logos; luz natural difusa.",
    "Cenário com Pátio com piso de pedra clara (travertino): piso de travertino/pedra clara fosca; juntas discretas; sem móveis visíveis; luz natural difusa; sensação high-end resort.",
    "Cenário com Varanda/terraço + guarda-corpo neutro + céu limpo: guarda-corpo neutro minimal; céu limpo como fundo principal; profundidade com leve desfoque; luz suave; estética premium.",
    "Cenário com Golden wall neutra ao entardecer: parede quente neutra (areia/caramelo claro); luz de fim de tarde suave; sombras macias e amplas; sensação acolhedora e editorial.",
    "Cenário com Muro baixo + mar desfocado: mureta de pedra clara ou concreto claro; mar ao fundo bem desfocado e calmo; horizonte limpo; luz suave; composição minimal.",
    "Cenário com Calçada/rua minimalista: piso neutro limpo; parede lisa contínua; ausência de placas, fios e carros; linhas simples; luz suave; estética urbana minimal premium.",
]


def main():
    qty = int(sys.argv[1]) if len(sys.argv) > 1 else 4
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    if not REFERENCIA.exists():
        print(f"ERRO: Foto de referência não encontrada em {REFERENCIA}")
        sys.exit(1)

    poses = random.sample(POSES, min(qty, len(POSES)))
    roupas = random.sample(ROUPAS, min(qty, len(ROUPAS)))
    fundos = random.sample(FUNDOS, min(qty, len(FUNDOS)))

    ts = datetime.now().strftime("%Y-%m-%d-%H-%M-%S")
    generated = []

    for i in range(qty):
        pose = poses[i % len(poses)]
        roupa = roupas[i % len(roupas)]
        fundo = fundos[i % len(fundos)]

        prompt = (
            f"Crie uma foto com a mulher da imagem de referência com "
            f"{DNA_FIXO} {pose} {roupa} {fundo}"
        )

        filename = f"{ts}-nexa-{i+1:02d}.png"
        filepath = OUTPUT_DIR / filename

        print(f"\n--- Gerando foto {i+1}/{qty} ---")
        print(f"Pose: {pose[:60]}...")
        print(f"Roupa: {roupa[:60]}...")
        print(f"Fundo: {fundo[:60]}...")

        cmd = [
            "uv", "run", SCRIPT,
            "--prompt", prompt,
            "--filename", str(filepath),
            "-i", str(REFERENCIA),
        ]

        try:
            result = subprocess.run(cmd, capture_output=True, text=True, timeout=120)
            print(result.stdout)
            if result.returncode == 0:
                generated.append(str(filepath))
                print(f"OK: {filepath}")
            else:
                print(f"ERRO: {result.stderr}")
        except subprocess.TimeoutExpired:
            print(f"TIMEOUT na foto {i+1}")
        except Exception as e:
            print(f"ERRO: {e}")

    print(f"\n=== {len(generated)}/{qty} fotos geradas ===")
    for f in generated:
        print(f"MEDIA:{f}")


if __name__ == "__main__":
    main()
