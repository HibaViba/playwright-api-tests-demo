import { test, expect } from '@playwright/test';

test.describe('Users API', () => {
  // 1) Happy path — GET single resource
  test('GET /users/2 returns the expected user contract', async ({ request }) => {
    const response = await request.get('/users/2');
    expect(response.status()).toBe(200);
    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(body).toHaveProperty('data');
    expect(body.data).toMatchObject({
      id: 2,
      email: expect.stringContaining('@'),
      first_name: expect.any(String),
      last_name: expect.any(String),
    });
  });

  // 2) Parametrized invariant
  for (const userId of [1, 2, 3, 4]) {
    test(`GET /users/${userId} returns user with matching id (parametrized)`, async ({ request }) => {
      const response = await request.get(`/users/${userId}`);
      expect(response.ok()).toBeTruthy();
      const body = await response.json();
      expect(body.data.id).toBe(userId);
    });
  }

  // 3) POST creates a resource
  test('POST /users creates a user and returns 201 with echoed fields', async ({ request }) => {
    const payload = { name: 'Hiba', job: 'QA Engineer' };
    const response = await request.post('/users', { data: payload });
    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body).toMatchObject(payload);
    expect(body.id).toBeDefined();
    expect(body.createdAt).toBeDefined();
  });

  // 4) PUT updates a resource
  test('PUT /users/2 updates the user', async ({ request }) => {
    const response = await request.put('/users/2', {
      data: { name: 'Hiba Updated', job: 'Senior QE' },
    });
    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(body.name).toBe('Hiba Updated');
    expect(body.job).toBe('Senior QE');
    expect(body.updatedAt).toBeDefined();
  });

  // 5) DELETE returns 204
  test('DELETE /users/2 returns 204 No Content', async ({ request }) => {
    const response = await request.delete('/users/2');
    expect(response.status()).toBe(204);
  });

  // 6) Negative — 404
  test('GET /users/23 returns 404 for a non-existent user', async ({ request }) => {
    const response = await request.get('/users/23');
    expect(response.status()).toBe(404);
  });
});
