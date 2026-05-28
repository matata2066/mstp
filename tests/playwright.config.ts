import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './specs',
  timeout: 30000,
  expect: { timeout: 10000 },
  fullyParallel: false,
  retries: 0,
  reporter: [['html', { open: 'never' }], ['list']],
  use: {
    baseURL: 'http://localhost:3200',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    actionTimeout: 5000,
  },
  webServer: {
    command: 'npx http-server ../demo -p 3200 -c-1 --silent',
    port: 3200,
    reuseExistingServer: true,
    timeout: 10000,
  },
});
