import { test, expect } from '@playwright/test';

function uniqueEmail() {
  return `playwright-user-${Date.now()}@example.com`;
}

test('user can register, log in, favorite a film, and view it later', async ({ page }) => {
  const email = uniqueEmail();
  const password = 'Password123!';

  await page.goto('/');

  await page.getByRole('link', { name: 'Join' }).click();

  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Password').fill(password);
  await page.getByRole('button', { name: 'Create account' }).click();

  await page.waitForURL('**/login');

  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Password').fill(password);
  await page.getByRole('button', { name: 'Sign in' }).click();

  await page.waitForURL('**/');

  await expect(page.getByText('Showing')).toBeVisible();

  const favoriteButton = page.getByRole('button', { name: 'Favorite' }).first();
  await favoriteButton.click();
  await expect(page.getByRole('button', { name: 'Favorited' }).first()).toBeVisible();

  await page.getByRole('link', { name: 'Favorites' }).click();
  await page.waitForURL('**/favorites');
  await expect(page.getByText('Your favorites')).toBeVisible();
  await expect(page.getByRole('heading', { level: 3 })).toContainText(/.+/);
});
