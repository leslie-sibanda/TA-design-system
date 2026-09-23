import { test, expect } from '@playwright/test';
const base = process.env.SITE_BASE_PATH ?? '';
test('homepage identifies the design system', async ({ page }) => {
  await page.goto(`${base}/`);
  await expect(page).toHaveTitle(/TeacherActive/);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Shared foundations');
});
