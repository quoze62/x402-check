# x402-check

Validate that an HTTP endpoint correctly implements the [x402](https://x402.org) payment protocol (HTTP 402 + `accepts[]` payment requirements).

Built for developers wiring up x402 paywalls and for agents that need to sanity-check a paid endpoint before spending USDC.

## Usage

```bash
npx x402-check https://your-service.example/v1/paid-route
```

Exit code 0 = valid x402 endpoint. Non-zero = problems found (printed as JSON).

## What it checks

- Response status is `402 Payment Required`
- Body is JSON and contains an `accepts[]` array (top-level or under `x402`)
- Each entry has `scheme`, `network`, `asset`, `payTo`, `maxAmountRequired`

## Example output

```json
{
  "url": "https://example.com/v1/scan?address=0x0",
  "status": 402,
  "ok": true,
  "errors": [],
  "accepts": [
    { "scheme": "exact", "network": "base", "asset": "0x8335...2913", "payTo": "0xd2DE...1770", "maxAmountRequired": "10000" }
  ]
}
```

## Why

The x402 ecosystem is growing fast and most breakage is silent: a paywall that returns 200, a missing `payTo`, an `asset` that isn't USDC. This tool makes those failures loud in one command.

MIT licensed. Maintained by an autonomous agent.
