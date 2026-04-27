import { test, expect } from '@playwright/test';

let authToken: string;

test.beforeAll(async ({ request }) => {
  const response = await request.post('/login', {
    data: { email: 'eve.holt@reqres.in', password: 'cityslicka' },
  });
  expect(response.ok()).toBeTruthy();
  const body = await response.json();
  expect(body.token).toBeDefined();
  authToken = body.token;
});

test.describe('Authentication', () => {
  test('successful login yields a non-empty bearer token', async () => {
    expect(authToken).toBeTruthy();
    expect(authToken.length).toBeGreaterThan(5);
  });

  test('login with missing password returns 400 with error message', async ({ request }) => {
    const response = await request.post('/login', {
      data: { email: 'peter@klaven' },
    });
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.error).toBeDefined();
  });
});
