# Protocolo de Handoff

## Regras

1. Dona inicia toda tarefa — nenhum agente inicia sem instrucao da Dona
2. Cada agente, ao concluir, notifica o proximo agente da cadeia
3. Cada handoff gera um arquivo neste diretorio com o formato abaixo
4. Nenhum agente aceita tarefa que tem a si mesmo como origem (previne loop)
5. Timeout: se o proximo agente nao confirmar em 30 minutos, Dona e notificada no grupo operacional

## Formato do arquivo de handoff

Nome: `YYYY-MM-DD-TASKID.md`

```
# Handoff YYYY-MM-DD-TASKID

Data: YYYY-MM-DD HH:MM UTC
De: <nome-do-agente>
Para: <nome-do-agente>
Squad: <marketing|conteudo|suporte>
Tarefa: <descricao em uma linha>
Status: <pendente|concluido|erro>

## Artefatos entregues
- <lista de arquivos ou outputs>

## Instrucao para o proximo agente
<o que o proximo agente deve fazer com os artefatos>

## Observacoes
<qualquer contexto relevante>
```

## Cadeia padrao por squad

**Marketing:**
Dona -> Social Media -> Copywriter -> Canal Marketing

**Conteudo:**
Dona -> Copywriter -> Conteudista -> Canal Conteudo

**Suporte:**
Dona -> Agente Suporte -> Canal Suporte (reativo, sem cadeia fixa)
