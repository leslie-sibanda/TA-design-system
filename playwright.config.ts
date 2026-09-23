import { defineConfig, devices } from '@playwright/test';
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 2,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: { baseURL: 'http://127.0.0.1:4173', trace: 'retain-on-failure', screenshot: 'only-on-failure' },
  webServer: { command: 'PORT=4173 pnpm serve:export', url: `http://127.0.0.1:4173${process.env.SITE_BASE_PATH ?? ''}/`, reuseExistingServer: false },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['iPhone 13'], defaultBrowserType: 'chromium' } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] }, testMatch: '**/smoke.spec.ts' },
    { name: 'webkit', use: { ...devices['Desktop Safari'] }, testMatch: '**/smoke.spec.ts' },
  ],
});
