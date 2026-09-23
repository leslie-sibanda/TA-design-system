import { test, expect } from '@playwright/test';
const base = process.env.SITE_BASE_PATH ?? '';
test('catalogue and proposal pages load directly without runtime routes', async ({ page }) => {
  for (const [path, title] of [['components', 'Components'], ['components/alert', 'Alert'], ['components/button', 'Button'], ['components/input', 'Input'], ['components/tabs', 'Tabs'], ['pages', 'Pages'], ['styling', 'Styling'], ['foundations', 'Foundations'], ['contributing', 'Contributing']]) {
    const response = await page.goto(`${base}/${path}/`);
    expect(response?.status()).toBe(200);
    await expect(page.getByRole('heading', { name: title, exact: true, level: 1 })).toBeVisible();
  }
});
test('catalogue links and browser history use ordinary paths', async ({ page }) => {
  await page.goto(`${base}/components/`);
  await page.locator('main').getByRole('link', { name: /Button/ }).click();
  await expect(page).toHaveURL(new RegExp('/components/button/$'));
  await expect(page.getByText('Proposed API', { exact: false }).first()).toBeVisible();
  await page.goBack();
  await expect(page.getByRole('heading', { name: 'Components', exact: true, level: 1 })).toBeVisible();
});
test('unknown components have a genuine static 404', async ({ page }) => {
  const response = await page.goto(`${base}/components/does-not-exist/`);
  expect(response?.status()).toBe(404);
});
