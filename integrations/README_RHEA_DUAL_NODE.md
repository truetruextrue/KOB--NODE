# RHEA · Ponte Dual Infodose ↔ NODE.FIELDS

## 0x03 DETECTAR → correlacionar
Componentes **reais** do repositório:
- `src/node-fields-server.js` serve `127.0.0.1:3697` com `GET /health`, `GET /fields`, `POST /pulse`.
- O Dual Infodose do Android serve `127.0.0.1:8765` em outro projeto, **não está dentro deste repositório**.
- Browsers bloqueiam o fetch cruzado por CORS; a ponte opcional fica em `127.0.0.1:8770`.

## 0x06 INTEGRAR → correlacionar
O adendo `integrations/rhea_dual_node_bridge.py` é um servidor Python sem dependências externas e **sem acesso ao Vault**.
Expõe só:
- `GET /health` (status sanitizado);
- `GET /fields` (quatro campos públicos aprovados);
- `POST /pulse` com JSON contendo **exatamente** `event` e `reference`, tamanho máximo 4096 bytes; event em allowlist; referência até 160 caracteres.

Restringe CORS ao origin **exato** `http://127.0.0.1:8765`. Não expõe `/logs`, `/core`, `/phi`, `/patch-phi`, credenciais, chaves de API ou dados do cofre. Escuta somente em 127.0.0.1. **Todo POST /pulse grava NDJSON no NODE.FIELDS**, mas apenas após chamada explícita do usuário/app.

## 0x09 EXPANDIR → correlacionar
No Termux, com o repositório clonado numa pasta separada:

**Sessão A — NODE.FIELDS**
```bash
cd "$HOME/KOB--NODE"
node src/node-fields-server.js
```

**Sessão B — RHEA**
```bash
cd "$HOME/KOB--NODE"
python3 integrations/rhea_dual_node_bridge.py
```

**Sessão C — Dual existente** (com o backend de Vault atual; não substituí-lo)
```bash
cd /storage/emulated/0/Download/KOBLLUX_DUAL_SPIRAL_AST_RODA_VERITAS_20261125
python3 kobllux_servidor_ast_chat_fix.py
```

Use os comandos de execução somente quando os arquivos correspondentes existirem. Se usar outro diretório para o Dual, ajuste o `cd`, não mude a porta/origem do Vault.

**Teste GET sem gravar dados:**
```bash
curl -fsS http://127.0.0.1:3697/health
curl -fsS http://127.0.0.1:8770/health
curl -fsS http://127.0.0.1:8770/fields
```

**Teste POST, com gravação de um evento sem informações sensíveis:**
```bash
curl -fsS -X POST http://127.0.0.1:8770/pulse \
  -H 'Content-Type: application/json' \
  -H 'Origin: http://127.0.0.1:8765' \
  -d '{"event":"TRINITY_3697","reference":"KOB--NODE/workflow"}'
```

Para vincular um **novo build** do Dual, copiar `integrations/rhea_dual_node_client.js` para a pasta servida pelo Dual e acrescentar a referência de script à **cópia nova do HTML**, mantendo todos os estilos existentes. A chamada manual:
```javascript
await window.KoblluxNodeFieldsBridge.health();
await window.KoblluxNodeFieldsBridge.fields();
await window.KoblluxNodeFieldsBridge.pulse('AST_REFERENCE_SELECTED', 'ast://referencia/publica');
```

**Atenção:** o JavaScript foi publicado como extensor, mas sua inclusão no HTML do aparelho **ainda não ocorreu**. A correlação no GitHub não altera o Dual do Android automaticamente. Para a integração do frontend, acrescentar uma cópia nova do HTML ao fluxo de release, mantendo o original intacto.

## 0x07 SELAR
- Git commit e blobs identificam a versão do adendo.
- A gravação de pulsos está no `state/node_fields/pulses.ndjson` do NODE.FIELDS e não é um selo criptográfico. Se for exigida cadeia SHA-256, deve ser adicionada separadamente e testada sobre bytes reais.
- A `main` não é alterada até aprovação explícita do PR.
- A correlação TRINITY e a separação da criptografia/Vault permanecem nos documentos anexos ao PR.
