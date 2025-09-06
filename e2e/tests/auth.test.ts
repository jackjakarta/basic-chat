import { expect, test } from '@playwright/test';

const mockUser = {
  email: process.env.E2E_USER_EMAIL!,
  password: process.env.E2E_USER_PASSWORD!,
};

test('user can log in with valid credentials', async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel('Email').fill(mockUser.email);
  await page.getByLabel('Password').fill(mockUser.password);

  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page).toHaveURL('/');
  await expect(page.getByText('New chat')).toBeVisible();
});
