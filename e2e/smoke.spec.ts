import { test, expect } from '@playwright/test';
const base = process.env.SITE_BASE_PATH ?? '';
test('exported homepage, search and direct component navigation work', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(`${base}/`);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Shared foundations');
  await page.getByRole('button', { name: /^Search/ }).click();
  await page.getByRole('textbox', { name: 'Search' }).fill('Button');
  await expect(page.getByRole('dialog').getByRole('button', { name: /Docs.*Components.*Button/ }).first()).toBeVisible();
  await page.keyboard.press('Escape');
  await page.goto(`${base}/components/button/`);
  await expect(page.getByRole('heading', { name: 'Button', exact: true, level: 1 })).toBeVisible();
  expect(errors).toEqual([]);
});
