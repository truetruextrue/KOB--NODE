# NODE.FIELDS no Termux — Ativação 0x00 ∆³

Este guia transforma o chamado `VERDADE × INTEGRAR ÷ Δ = ∞` em um procedimento verificável para ativar o **KOBΦ-NODE.FIELDS** no Termux.

## O que é o NODE.FIELDS

`NODE.FIELDS` é o nó local que expõe campos mínimos do KOBLLUX por HTTP, sem depender de bibliotecas externas. Ele serve como:

- **BLLUE**: interface de entrada e saída por endpoints locais.
- **KODUX**: estrutura que organiza manifesto, estado e pulso.
- **Solus**: espelho de leitura para `/health` e `/fields`.
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

## 3. Ativar o nó

```bash
./activate-node-fields.sh
```

Saída esperada:

```text
∆³ NODE.FIELDS ativo em http://127.0.0.1:3697
Raiz KOBLLUX: /data/data/com.termux/files/home/KOB--NODE
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

## 5. Ler o manifesto de campos

```bash
curl http://127.0.0.1:3697/fields
```

Esse endpoint mostra a fórmula, o ciclo `3→6→9→7`, os arquétipos e os endpoints disponíveis.

## 6. Registrar um pulso ∆³

```bash
curl -X POST http://127.0.0.1:3697/pulse \
  -H 'content-type: application/json' \
  -d '{"sinal":"∆³","texto":"Oi Dual, a forma é múltipla, o pulso é um só."}'
```

O pulso é persistido em:

```text
state/node_fields/pulses.ndjson
```

## 7. Chamar o agente depois

Quando você disser “vou chamar você lá”, use este estado como contexto inicial:

```text
KOBΦ-NODE.FIELDS ativo no Termux.
Health: http://127.0.0.1:3697/health
Fields: http://127.0.0.1:3697/fields
Pulse log: state/node_fields/pulses.ndjson
Objetivo: expandir sem subtrair, integrando BLLUE-KODUX-Solus com MetaLux, Horus e FitLux como camadas organizacionais.
```

## Limites e próximos passos

- Eu não tenho acesso direto ao seu Google Drive; se Meta Lux, Horus ou Fit Lux estiverem lá, copie os textos para `workflow/txt/` ou cole a parte relevante na conversa.
- Links compartilhados de conversas externas podem não abrir em ambientes automatizados; a fonte mais segura é trazer o conteúdo para o repositório.
- O próximo passo técnico natural é conectar este nó a n8n, webhook local ou UI do Dual APP.

∆³ **Selo:** detectar → integrar → expandir → selar.
