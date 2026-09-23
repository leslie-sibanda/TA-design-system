import { test, expect } from '@playwright/test';
const base = process.env.SITE_BASE_PATH ?? '';
test('static search finds Button and navigates to the exported page', async ({ page }) => {
  await page.goto(`${base}/`);
  await page.getByRole('button', { name: /^Search/ }).click();
  await page.getByRole('textbox', { name: 'Search' }).fill('Button');
  const result = page.getByRole('dialog').getByRole('button', { name: /Docs.*Components.*Button/ }).first();
  await expect(result).toBeVisible();
  await result.click();
  await expect(page).toHaveURL(/\/components\/button\/?(?:#.*)?$/);
});
test('search explains no matches', async ({ page }) => {
  await page.goto(`${base}/`);
  await page.getByRole('button', { name: /^Search/ }).click();
  await page.getByRole('textbox', { name: 'Search' }).fill('zzzz-no-such-component-999');
  await expect(page.getByText('No results found', { exact: false })).toBeVisible();
});
test('search reports unavailable static index without breaking the page', async ({ page }) => {
  await page.route('**/api/search*', route => route.abort());
  await page.goto(`${base}/`);
  await page.getByRole('button', { name: /^Search/ }).click();
  await page.getByRole('textbox', { name: 'Search' }).fill('Button');
  await expect(page.getByRole('dialog').getByRole('alert')).toContainText('Search is unavailable');
});
