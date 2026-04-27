import { test, expect } from '@playwright/test';

/**
 * Core API tests against JSONPlaceholder.
 *
 * Each test demonstrates a different testing pattern that maps 1:1
 * to the contract / invariant tests in the STM32 HIL repo.
 */

test.describe('Users API', () => {
  // 1) HAPPY PATH — GET single resource
  // Equivalent to: STM32 'test_firmware_transmits_expected_extended_frame'
  test('GET /users/2 returns the expected user contract', async ({ request }) => {
    const response = await request.get('/users/2');

    expect(response.status()).toBe(200);
    expect(response.ok()).toBeTruthy();

    const body = await response.json();

    // Contract assertions — fixed shape and required fields
    expect(body).toMatchObject({
      id: 2,
      name: expect.any(String),
      username: expect.any(String),
      email: expect.stringContaining('@'),
    });
    expect(body).toHaveProperty('address');
    expect(body).toHaveProperty('company');
  });

  // 2) PARAMETRIZED — same assertion, multiple inputs
  // Equivalent to: STM32 'test_all_six_dac_channels_agree' parametrized over 6 rows.
  for (const userId of [1, 2, 3, 4]) {
    test(`GET /users/${userId} returns user with matching id (parametrized)`, async ({ request }) => {
      const response = await request.get(`/users/${userId}`);
      expect(response.ok()).toBeTruthy();
      const body = await response.json();

      // Invariant — the returned id MUST equal the requested id
      expect(body.id).toBe(userId);
    });
  }
});

test.describe('Posts API', () => {
  // 3) POST — create a resource
  test('POST /posts creates a post and returns 201 with echoed fields', async ({ request }) => {
    const payload = { title: 'QA matters', body: 'Automated tests prevent regressions.', userId: 1 };
    const response = await request.post('/posts', { data: payload });

    expect(response.status()).toBe(201);
    const body = await response.json();

    // Echo check — server returned what we sent, plus a generated id
    expect(body).toMatchObject(payload);
    expect(body.id).toBeDefined();
    expect(typeof body.id).toBe('number');
  });

  // 4) PUT — update a resource
  test('PUT /posts/1 updates the post', async ({ request }) => {
    const payload = { id: 1, title: 'Updated title', body: 'Updated body', userId: 1 };
    const response = await request.put('/posts/1', { data: payload });

    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(body.title).toBe('Updated title');
    expect(body.body).toBe('Updated body');
  });

  // 5) DELETE — remove a resource
  test('DELETE /posts/1 returns 200 OK', async ({ request }) => {
    const response = await request.delete('/posts/1');
    expect(response.ok()).toBeTruthy();
  });

  // 6) NEGATIVE — resource not found
  // Critical: a healthy suite asserts on FAILURE behavior, not just success.
  test('GET /posts/9999 returns 404 for a non-existent post', async ({ request }) => {
    const response = await request.get('/posts/9999');
    expect(response.status()).toBe(404);
  });
});
