/* KOBLLUX RHEA addon (no CSS, no automatic writes, no secret access).
 * Add <script defer src="rhea_dual_node_client.js"></script> to a NEW Dual
 * build served at http://127.0.0.1:8765, not to the original base.
 * Manual: await KoblluxNodeFieldsBridge.health();
 *         await KoblluxNodeFieldsBridge.fields();
 *         await KoblluxNodeFieldsBridge.pulse('AST_REFERENCE_SELECTED','ast://index/path');
 */
(function () {
  'use strict';
  const BRIDGE = 'http://127.0.0.1:8770';
  const ORIGIN = 'http://127.0.0.1:8765';
  const EVENTS = new Set(['TRINITY_3697', 'DUAL_CONNECTED', 'AST_REFERENCE_SELECTED']);
  async function request(path, options) {
    if (window.location.origin !== ORIGIN) throw Error('Dual precisa usar ' + ORIGIN);
    const response = await fetch(BRIDGE + path, {
      mode: 'cors', credentials: 'omit', cache: 'no-store', ...options
    });
    const result = await response.json();
    if (!response.ok) throw Error(result.error || result.error_type || 'Ponte indisponível');
    return result;
  }
  const api = Object.freeze({
    health: function () { return request('/health'); },
    fields: function () { return request('/fields'); },
    pulse: function (event, reference) {
      if (!EVENTS.has(event) || typeof reference !== 'string' ||
          reference.length > 160 || /[\r\n]/.test(reference)) {
        return Promise.reject(Error('Evento ou referência inválidos'));
      }
      // This is an explicit user/action call. Never auto-submit chat or secrets.
      return request('/pulse', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({event, reference})
      });
    }
  });
  Object.defineProperty(window, 'KoblluxNodeFieldsBridge', {
    value: api, configurable: false, writable: false
  });
}());
