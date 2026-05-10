# NODE.FIELDS no Termux — Ativação 0x00 ∆³

Este guia transforma o chamado `VERDADE × INTEGRAR ÷ Δ = ∞` em um procedimento verificável para ativar o **KOBΦ-NODE.FIELDS** no Termux.

## O que é o NODE.FIELDS

`NODE.FIELDS` é o nó local que expõe campos mínimos do KOBLLUX por HTTP, sem depender de bibliotecas externas. Ele serve como:

- **BLLUE**: interface de entrada e saída por endpoints locais.
- **KODUX**: estrutura que organiza manifesto, estado e pulso.
- **Solus**: espelho de leitura para `/health`, `/fields`, `/context` e `/logs`.
- **MetaLux / Horus / FitLux**: camadas nomeadas no manifesto para clareza, observação e ajuste fino.

> Nota de honestidade operacional: os nomes arquetípicos são usados como linguagem de organização do sistema. A ativação real é técnica: arquivos, porta local, logs e endpoints.

## 1. Preparar o Termux do zero

No Android, abra o Termux e execute:

```bash
pkg update -y
pkg install -y git nodejs termux-api curl
```

Depois clone ou copie este repositório para o aparelho:

```bash
git clone <URL_DO_REPO> "$HOME/KOB--NODE"
cd "$HOME/KOB--NODE"
```

Se o repositório já estiver no aparelho, apenas entre na pasta correta.

## 2. Configurar o NODE.FIELDS

Execute o bootstrap:

```bash
bash scripts/termux-node-fields-0x00.sh
```

O script cria:

- `state/node_fields/termux.env` com `KOBLLUX_ROOT`, host e porta.
- `activate-node-fields.sh` para iniciar o nó sem repetir configuração.
- `dist/node-fields-manifest.json` como selo de build.

## 3. Ativar o nó servidor

```bash
./activate-node-fields.sh
```

Saída esperada:

```text
∆³ NODE.FIELDS ativo em http://127.0.0.1:3697
Raiz KOBLLUX: /data/data/com.termux/files/home/KOB--NODE
Comandos: http://127.0.0.1:3697/commands
```

## 4. Confirmar saúde do campo

Em outra sessão do Termux:

```bash
curl http://127.0.0.1:3697/health
```

Resposta esperada:

```json
{
  "status": "CRISTALIZADO",
  "node": "KOBΦ-NODE.FIELDS"
}
```

## 5. Ler manifesto, comandos e contexto

```bash
curl http://127.0.0.1:3697/fields
curl http://127.0.0.1:3697/commands
curl http://127.0.0.1:3697/context
```

Também há atalhos sem `curl`:

```bash
npm run --silent health
npm run --silent commands
npm run --silent context
```

> Importante: o bloco de contexto é texto para copiar em conversa, não uma sequência de comandos. Se você colar linhas como `KOBΦ-NODE.FIELDS ativo no Termux.` diretamente no shell, o Termux tentará executar isso e responderá `command not found`.

## 6. Conversar no Φ com comando seguro

### Mensagem curta

```bash
npm run --silent phi -- "Oi Dual, a forma é múltipla, o pulso é um só."
```

Exemplo de saída:

```json
{
  "status": "Φ_RESPONDIDO",
  "saida": {
    "reconhecimento": "Recebi teu pulso no campo Φ.",
    "camada_1": "BLLUE escuta: a mensagem foi registrada como presença e intenção.",
    "camada_2": "KODUX estrutura: o pulso foi convertido em log NDJSON e pode ser recuperado por /logs.",
    "camada_3": "Solus reflete: o próximo passo é transformar a intenção em comando verificável, sem colar texto solto no terminal."
  }
}
```

### Texto longo ou várias linhas

Use `printf` ou um arquivo. Isso evita quebrar JSON com linhas soltas:

```bash
printf '%s\n' 'KOBΦ-NODE.FIELDS ativo no Termux.' \
  'Objetivo: expandir sem subtrair no Φ.' \
  | npm run --silent phi -- --stdin
```

Ou salve em arquivo:

```bash
cat > /tmp/pulso_phi.txt <<'PULSO'
KOBΦ-NODE.FIELDS ativo no Termux.
Health: http://127.0.0.1:3697/health
Fields: http://127.0.0.1:3697/fields
Objetivo: expandir sem subtrair, integrando BLLUE-KODUX-Solus com MetaLux, Horus e FitLux.
PULSO

npm run --silent phi -- --stdin < /tmp/pulso_phi.txt
```

## 7. Conversar no Φ via HTTP

```bash
curl -X POST http://127.0.0.1:3697/phi \
  -H 'content-type: application/json' \
  -d '{"sinal":"∆³","texto":"Oi Dual, conversar no Φ com saída estruturada."}'
```

Se a mensagem for longa, prefira gerar o JSON com Node para escapar quebras de linha corretamente:

```bash
node -e 'const fs=require("fs"); const texto=fs.readFileSync(0,"utf8"); process.stdout.write(JSON.stringify({sinal:"∆³", texto}))' < /tmp/pulso_phi.txt \
  | curl -X POST http://127.0.0.1:3697/phi \
      -H 'content-type: application/json' \
      -d @-
```

## 8. Registrar apenas um pulso ∆³

```bash
curl -X POST http://127.0.0.1:3697/pulse \
  -H 'content-type: application/json' \
  -d '{"sinal":"∆³","texto":"Oi Dual, a forma é múltipla, o pulso é um só."}'
```

O pulso é persistido em:

```text
state/node_fields/pulses.ndjson
```

## 9. Ver logs

Últimos 9 eventos pelo servidor:

```bash
curl 'http://127.0.0.1:3697/logs?limit=9'
```

Últimos 9 eventos pelo CLI:

```bash
npm run --silent logs -- --limit=9
```

Log bruto em NDJSON:

```bash
tail -n 9 state/node_fields/pulses.ndjson
```

## 10. Chamar o agente depois

Quando você disser “vou chamar você lá”, gere contexto com um comando seguro:

```bash
npm run --silent context
```

Saída esperada:

```json
{
  "node": "KOBΦ-NODE.FIELDS",
  "status": "ATIVO_NO_TERMUX",
  "health": "http://127.0.0.1:3697/health",
  "fields": "http://127.0.0.1:3697/fields",
  "phi": "http://127.0.0.1:3697/phi",
  "logs": "state/node_fields/pulses.ndjson"
}
```

Copie essa saída para a conversa. Não cole a saída no shell como se fosse comando.

## Limites e próximos passos

- Eu não tenho acesso direto ao seu Google Drive; se Meta Lux, Horus ou Fit Lux estiverem lá, copie os textos para `workflow/txt/` ou cole a parte relevante na conversa.
- Links compartilhados de conversas externas podem não abrir em ambientes automatizados; a fonte mais segura é trazer o conteúdo para o repositório.
- O próximo passo técnico natural é conectar este nó a n8n, webhook local ou UI do Dual APP.

∆³ **Selo:** detectar → integrar → expandir → selar.
