import { test, expect } from '@playwright/test';

/**
 * Session-setup pattern demonstration.
 *
 * JSONPlaceholder doesn't have real authentication, so this file demonstrates
 * the same beforeAll-fetch-once pattern you'd use for a Bearer-token flow:
 *  - run a setup request once per file
 *  - cache the result in a module-scoped variable
 *  - reuse it across all tests in the file
 *
 * In a real microservice suite this would be:
 *   const response = await request.post('/login', {...});
 *   authToken = (await response.json()).token;
 */

let sessionUserId: number;

test.beforeAll(async ({ request }) => {
  // Fetch "current user" once — same pattern as logging in once for the whole file.
  const response = await request.get('/users/1');
  expect(response.ok()).toBeTruthy();
  const body = await response.json();
  expect(body.id).toBeDefined();
  sessionUserId = body.id;
});

test.describe('Session setup pattern (beforeAll)', () => {
  test('session user id is captured and reusable across tests', async () => {
    expect(sessionUserId).toBe(1);
  });

  test('cached session id can be used to fetch user-owned resources', async ({ request }) => {
    // Use the session-scoped id to query a related resource —
    // analogous to using a cached bearer token for protected endpoints.
    const response = await request.get(`/users/${sessionUserId}/posts`);
    expect(response.ok()).toBeTruthy();
    const posts = await response.json();
    expect(Array.isArray(posts)).toBeTruthy();
    expect(posts.length).toBeGreaterThan(0);
    // Every returned post must belong to the session user (invariant).
    for (const post of posts) {
      expect(post.userId).toBe(sessionUserId);
    }
  });
});
