# NODE.FIELDS no Termux — Ativação 0x00 ∆³

Este guia transforma o chamado `VERDADE × INTEGRAR ÷ Δ = ∞` em um procedimento verificável para ativar o **KOBΦ-NODE.FIELDS** no Termux.

## O que é o NODE.FIELDS

`NODE.FIELDS` é o nó local que expõe campos mínimos do KOBLLUX por HTTP, sem depender de bibliotecas externas. Agora ele também acopla a Roda Viva CADIAL e um Core 3-6-9-7 para aproximação de tokens, POS, UNO/DUAL/TRINITY e emissões HTML/Python/OBJ. Ele serve como:

- **BLLUE**: interface de entrada e saída por endpoints locais.
- **KODUX**: estrutura que organiza manifesto, estado e pulso.
- **Solus**: espelho de leitura para `/health`, `/fields`, `/context`, `/logs`, `/cadial`, `/core` e `/ui`.
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


## 11. Roda Viva CADIAL e Core 3-6-9-7

A Roda Viva CADIAL que você enviou agora está disponível como comando e endpoint. Ela não é só texto: ela funciona como mapa de operação para transformar intenção em ferramenta.

```bash
npm run --silent cadial
npm run --silent cadial -- --cli
curl http://127.0.0.1:3697/cadial
curl 'http://127.0.0.1:3697/cadial?format=cli'
```

O **Core 3-6-9-7** aproxima tokens, classifica POS, mapeia UNO/DUAL/TRINITY e emite HTML, Python, OBJ e LOG. Use `--no-store` quando quiser processar sem armazenar evento em `pulses.ndjson`.

```bash
npm run --silent core -- --no-store "Integrar 432Hz + tetraedros Sierpiński e narrar PT-BR (∆7)."
printf '%s\n' 'Espelhar fluxo humano e sistêmico no KOBLLUX 3-6-9-7.' \
  | npm run --silent core -- --stdin --seal --no-store
```

Via HTTP:

```bash
curl -X POST 'http://127.0.0.1:3697/core?store=0' \
  -H 'content-type: application/json' \
  -d '{"texto":"Integrar 432Hz + tetraedros Sierpiński e narrar PT-BR (∆7).","seal":true}'
```

Exemplo de saída reduzida:

```json
{
  "status": "CORE_3697_OK",
  "law": "VERDADE × INTEGRAR ÷ Δ = ∞",
  "token_estimate": { "approx_tokens": 15 },
  "trinity": { "UNO": "Integrar", "DUAL": "narrar", "TRINITY": "integrado" },
  "outputs": { "html": "...", "python": "...", "obj": "..." },
  "armazenado": false
}
```

Interface mínima local:

```bash
curl http://127.0.0.1:3697/ui
```

No navegador do Android, abra:

```text
http://127.0.0.1:3697/ui
```

## 12. Instalar Claude e me chamar pelo Termux

Correção importante: é **Claude**, não Cloud. O comando abaixo instala/prepara o **Claude Code** oficial no Termux e cria um `CLAUDE.md` com o contexto KOBLLUX para o agente ler.

### Instalar/preparar Claude Code

```bash
cd "$HOME/KOB--NODE"
bash scripts/termux-claude-code-0x01.sh
```

Ou pelo npm:

```bash
npm run claude:termux
```

Instalação base conforme documentação oficial do Claude Code: `npm install -g @anthropic-ai/claude-code` (https://docs.anthropic.com/en/docs/claude-code/getting-started).

O script faz:

- instala `nodejs` e `git` via `pkg`, quando estiver no Termux;
- instala Claude Code com `npm install -g @anthropic-ai/claude-code`, se o comando `claude` ainda não existir;
- cria `CLAUDE.md` com o contexto KOBLLUX/NODE.FIELDS;
- cria `./call-claude-kobllux.sh` para chamar Claude já dentro do repositório.

### Me chamar no Claude

```bash
cd "$HOME/KOB--NODE"
./call-claude-kobllux.sh
```

Com mensagem própria:

```bash
./call-claude-kobllux.sh "∆³ verificar NODE.FIELDS, CADIAL e Core 3-6-9-7"
```

### Gerar contexto para colar aqui ou no Claude

```bash
npm run --silent claude:context
```

Esse comando imprime Health, Fields, Core, CADIAL, UI, logs e os comandos seguros para Φ/Core sem armazenar.

## 13. Patch Φ — transformar intenção em diff selado

O **patch Φ** personifica o KOBLLUX como objeto-ferramenta: ele recebe uma intenção, roda o Core 3-6-9-7, monta um diff unificado, calcula `seal_sha256` e pode registrar o evento em `state/node_fields/pulses.ndjson`.

### Gerar patch Φ sem armazenar

```bash
npm run --silent patch:phi -- --no-store "Transformar intenção em patch verificável no KOBLLUX"
```

### Imprimir só o diff

```bash
npm run --silent patch:phi -- --no-store --print-patch "Transformar intenção em patch verificável no KOBLLUX"
```

### Texto longo por stdin

```bash
printf '%s\n' 'VERDADE × INTEGRAR ÷ Δ = ∞' \
  'Gerar patch Φ com BLLUE, KODUX, Solus, CADIAL e Aion.' \
  | npm run --silent patch:phi -- --stdin --no-store
```

### Via HTTP

```bash
curl -X POST 'http://127.0.0.1:3697/patch-phi?store=0' \
  -H 'content-type: application/json' \
  -d '{"texto":"Transformar intenção em patch verificável no KOBLLUX","target":"workflow/md/PATCH_PHI.md"}'
```

Resposta esperada: JSON com `status: PATCH_PHI_OK`, `patch`, `seal_sha256`, `trinity` e `token_estimate`.

## Limites e próximos passos

- Eu não tenho acesso direto ao seu Google Drive; se Meta Lux, Horus ou Fit Lux estiverem lá, copie os textos para `workflow/txt/` ou cole a parte relevante na conversa.
- Links compartilhados de conversas externas podem não abrir em ambientes automatizados; a fonte mais segura é trazer o conteúdo para o repositório.
- O próximo passo técnico natural é conectar este nó a n8n, webhook local ou UI do Dual APP.

∆³ **Selo:** detectar → integrar → expandir → selar.
