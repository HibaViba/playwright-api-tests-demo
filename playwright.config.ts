import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  expect: { timeout: 5_000 },
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [
    ['list'],
    ['html', { open: 'never' }],
  ],
  use: {
    baseURL: 'https://reqres.in/api',
    extraHTTPHeaders: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'x-api-key': 'reqres-free-v1',
    },
  },
  projects: [
    { name: 'api', testMatch: /.*\.spec\.ts/ },
  ],
});
