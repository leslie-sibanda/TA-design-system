import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
const base = process.env.SITE_BASE_PATH ?? '';
test('homepage has no automated accessibility violations', async ({ page }) => {
  await page.goto(`${base}/`);
  // Recorded exception (docs/design/site-design-status.md): white on brand orange is about 2.69:1, so only
  // the colour-contrast rule is waived, and only for the orange action. Everything else is fully scanned.
  const orangeAction = '.site-action.primary';
  expect((await new AxeBuilder({ page }).exclude(orangeAction).analyze()).violations).toEqual([]);
  expect((await new AxeBuilder({ page }).include(orangeAction).disableRules(['color-contrast']).analyze()).violations).toEqual([]);
});
test('homepage identifies the design system', async ({ page }) => {
  await page.goto(`${base}/`);
  await expect(page).toHaveTitle(/TeacherActive/);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Shared foundations');
});
test('homepage has the approved identity and navigation', async ({ page, isMobile }) => {
  await page.goto(`${base}/`);
  await expect(page.getByRole('img', { name: 'TeacherActive home' })).toBeVisible();
  await expect(page.getByRole('img', { name: 'TeacherActive', exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Browse components' })).toHaveAttribute('href', `${base}/components/`);
  await expect(page.getByRole('link', { name: 'Explore pages' })).toHaveAttribute('href', `${base}/pages/`);
  await expect(page.getByRole('navigation', { name: 'Documentation' })).toHaveCount(0);
  if (isMobile) await page.getByRole('button', { name: 'Open navigation' }).click();
  for (const name of ['Components', 'Pages', 'Styling']) await expect(page.getByRole('link', { name, exact: true }).first()).toBeVisible();
});
