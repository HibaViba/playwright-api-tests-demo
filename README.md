# Playwright API Tests Demo

[![Playwright API Tests](https://github.com/HibaViba/playwright-api-tests-demo/actions/workflows/playwright.yml/badge.svg)](https://github.com/HibaViba/playwright-api-tests-demo/actions/workflows/playwright.yml)

> **Companion repo to [stm32-hil-testing](https://github.com/HibaViba/stm32-hil-testing).**
> Same test-engineering principles — different transport.

A small but production-shaped Playwright + TypeScript suite that validates a public REST API ([reqres.in](https://reqres.in)). The goal is to demonstrate that the patterns built for hardware-in-the-loop testing translate directly to API testing for microservices.

## What's inside

| File | Purpose |
|---|---|
| `tests/users.spec.ts` | 6 tests — happy path, parametrized, POST/PUT/DELETE, 404 negative |
| `tests/auth.spec.ts` | Bearer-token flow with `beforeAll` hook |
| `playwright.config.ts` | `baseURL`, retries-only-in-CI, HTML reporter, parallel workers |
| `.github/workflows/playwright.yml` | CI on every push and PR, uploads HTML report as artifact |

## Test patterns demonstrated

| # | Pattern | Test | API-testing category |
|---|---|---|---|
| 1 | Contract / shape | `GET /users/2 returns expected user contract` | Happy path + schema |
| 2 | Parametrized invariant | `GET /users/{id} ... matching id` (×4) | Data-driven + invariant |
| 3 | Resource creation | `POST /users ... 201` | State-changing happy path |
| 4 | Resource update | `PUT /users/2 updates the user` | State-changing happy path |
| 5 | Resource deletion | `DELETE /users/2 returns 204` | Status code contract |
| 6 | Negative | `GET /users/23 returns 404` | Failure-mode coverage |
| 7 | Auth flow | Login → token → reuse | Setup hook + Bearer auth |
| 8 | Negative auth | Login with missing field → 400 | Error-path validation |

## How this maps to the STM32 HIL repo

| STM32 HIL framework | Playwright equivalent here |
|---|---|
| `Board` facade over UART/CAN | `request: APIRequestContext` injected into tests |
| `conftest.py` pytest fixtures | `test.beforeAll` / `test.beforeEach` hooks |
| `@pytest.mark.parametrize` | Top-level `for` loop generating `test()` calls |
| Tolerance assertion | `expect(value).toBeCloseTo(...)` |
| CAN frame contract assertion | `expect(body).toMatchObject({...})` |
| `HIL_MODE=replay` env var | `BASE_URL` / `extraHTTPHeaders` config |
| pytest-html report | Built-in Playwright HTML reporter |
| GitHub Actions on push + PR | Identical workflow structure here |

## Running locally

```bash
npm install
npx playwright install --with-deps
npx playwright test
npx playwright show-report
```

## Author

**Hiba Ould Hadj** — Master's student in Mechatronics & Robotics, focusing on test automation and quality engineering.
- Main repo: [stm32-hil-testing](https://github.com/HibaViba/stm32-hil-testing)
- LinkedIn: [hibaould](https://linkedin.com/in/hibaould)