import { expect, test } from '@playwright/test';

import { MOCK_USER } from '../utils';

test('user can log in with valid credentials', async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel('Email').fill(MOCK_USER.email);
  await page.getByLabel('Password').fill(MOCK_USER.password);

  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page).toHaveURL('/');
  await expect(page.getByText('New chat')).toBeVisible();
});
