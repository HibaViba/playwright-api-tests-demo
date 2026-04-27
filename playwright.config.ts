import { defineConfig } from '@playwright/test';

/**
 * Playwright configuration for API tests against JSONPlaceholder.
 *
 * JSONPlaceholder (https://jsonplaceholder.typicode.com) is the de-facto
 * standard free fake REST API used in thousands of tutorials. It is rock-stable,
 * requires no auth, and supports the full set of HTTP verbs we need.
 *
 * Mirrors the configuration philosophy of the STM32 HIL repo:
 *  - explicit, pinned versions
 *  - retries only in CI (so flakes are loud locally)
 *  - HTML report uploaded as artifact in CI
 */
export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  expect: { timeout: 5_000 },

  // Fail the build on test.only left in source.
  forbidOnly: !!process.env.CI,

  // Retry only in CI to avoid masking real flakes during local development.
  retries: process.env.CI ? 2 : 0,

  // Parallel workers — same idea as pytest-xdist.
  workers: process.env.CI ? 2 : undefined,

  reporter: [
    ['list'],
    ['html', { open: 'never' }],
  ],

  use: {
    baseURL: 'https://jsonplaceholder.typicode.com',
    extraHTTPHeaders: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  },

  projects: [
    { name: 'api', testMatch: /.*\.spec\.ts/ },
  ],
});
