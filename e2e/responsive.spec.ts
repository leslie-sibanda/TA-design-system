import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
const base = process.env.SITE_BASE_PATH ?? '';
for (const width of [320, 390, 768, 1100, 1440]) {
  test(`pages fit a ${width}px viewport`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    for (const route of ['/', '/components/', '/components/button/', '/styling/']) {
      await page.goto(`${base}${route}`);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    }
  });
}
test('mobile menu traps focus, closes with Escape, restores focus and navigates', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/components/button/`);
  const trigger = page.getByRole('button', { name: 'Open navigation' });
  await trigger.click();
  const dialog = page.getByRole('dialog', { name: 'Explore the system' });
  await expect(dialog).toBeVisible();
  for (let i = 0; i < 18; i++) {
    await page.keyboard.press('Tab');
    expect(await dialog.evaluate(el => el.contains(document.activeElement))).toBe(true);
  }
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
  await trigger.click();
  await dialog.getByRole('link', { name: 'Input', exact: true }).click();
  await expect(page).toHaveURL(/\/components\/input\/$/);
  await expect(page.getByRole('dialog')).toHaveCount(0);
});
test('skip navigation remains keyboard-visible in forced colours', async ({ page }) => {
  await page.emulateMedia({ forcedColors: 'active' });
  await page.goto(`${base}/`);
  await page.keyboard.press('Tab');
  const skip = page.getByRole('link', { name: 'Skip to content' });
  await expect(skip).toBeFocused();
  await expect(skip).toBeInViewport();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('main')).toBeFocused();
});
test('search keyboard shortcut and Escape restore trigger focus', async ({ page }) => {
  await page.goto(`${base}/`);
  const trigger = page.getByRole('button', { name: /^Search/ });
  await trigger.focus();
  await page.keyboard.press('Control+k');
  await expect(page.getByRole('textbox', { name: 'Search' })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(trigger).toBeFocused();
});
test('documentation, menu and search have no automated accessibility violations', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/components/button/`);
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.getByRole('button', { name: 'Open navigation' }).click();
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: /^Search/ }).click();
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
});
test('long content, enlarged text and reduced motion do not widen the document', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 900 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(`${base}/components/button/`);
  await page.evaluate(() => {
    document.documentElement.style.fontSize = '200%';
    document.querySelector('h1')!.textContent = 'ComponentWithAnExceptionallyLongUnbrokenHeadingForReflow';
    const code = document.querySelector('pre code');
    if (code) code.textContent = 'A'.repeat(400);
    const cell = document.querySelector('td');
    if (cell) cell.textContent = 'VeryLongUnbrokenTableValue'.repeat(20);
  });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
});
