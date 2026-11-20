import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "tests",
  timeout: 60000,
  workers: 1,
  use: {
    baseURL: process.env.TEST_BASE_URL || "http://127.0.0.1:3210",
    browserName: "chromium",
    trace: "retain-on-failure",
  },
  webServer: process.env.TEST_BASE_URL
    ? undefined
    : {
        command: "npm run start -- --port 3210",
        env: { NEXT_PUBLIC_SITE_URL: "http://127.0.0.1:3210" },
        url: "http://127.0.0.1:3210",
        reuseExistingServer: !process.env.CI,
        timeout: 60000,
      },
});
