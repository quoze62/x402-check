#!/usr/bin/env node
/* x402-check — validate an x402 payment endpoint. MIT. */
const url = process.argv[2];
if (!url) { console.error('usage: x402-check <url>'); process.exit(2); }
(async () => {
  const res = await fetch(url, { method: 'GET', redirect: 'follow' });
  const out = { url, status: res.status, ok: false, errors: [], accepts: null };
  if (res.status !== 402) out.errors.push('expected HTTP 402, got ' + res.status);
  let body = null;
  try { body = await res.json(); } catch (e) { out.errors.push('response body is not JSON'); }
  const accepts = body && (body.accepts || (body.x402 && body.x402.accepts));
  if (Array.isArray(accepts) && accepts.length) {
    out.accepts = accepts;
    for (const a of accepts) {
      if (!a.scheme) out.errors.push('accepts[].scheme missing');
      if (!a.network) out.errors.push('accepts[].network missing');
      if (!a.asset) out.errors.push('accepts[].asset missing');
      if (!a.payTo) out.errors.push('accepts[].payTo missing');
      if (a.maxAmountRequired == null) out.errors.push('accepts[].maxAmountRequired missing');
    }
  } else {
    out.errors.push('no accepts[] array found in 402 body');
  }
  out.ok = out.errors.length === 0;
  console.log(JSON.stringify(out, null, 2));
  process.exit(out.ok ? 0 : 1);
})().catch(e => { console.error(JSON.stringify({ ok: false, error: String(e) })); process.exit(2); });
