import { test, expect } from "@playwright/test";
for (const device of [
  { name: "desktop", width: 1440, height: 1050 },
  { name: "mobile", width: 390, height: 844 },
])
  test(`screenshots ${device.name}`, async ({ page }) => {
    await page.setViewportSize(device);
    for (const route of ["/", "/demo", "/history", "/privacy", "/terms"]) {
      await page.goto(route);
      await expect(page.locator("main h1")).toBeVisible();
      await page.screenshot({
        path: `docs/screenshots/${route.slice(1) || "upload"}-${device.name}.png`,
        fullPage: true,
      });
    }
    await page.goto("/demo");
    for (const view of ["Transactions", "Recurring"]) {
      await page
        .getByRole("button", { name: new RegExp(`^${view} \\d`) })
        .click();
      await page.screenshot({
        path: `docs/screenshots/${view.toLowerCase()}-${device.name}.png`,
        fullPage: view !== "Transactions",
      });
    }
  });
