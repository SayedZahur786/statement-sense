import { test, expect } from "@playwright/test";
test("GitHub renders the committed animated banner", async ({ page }) => {
  await page.goto("https://github.com/SayedZahur786/statement-sense");
  const banner = page.locator(
    'article img[alt="Statement Sense — Less spreadsheet. More perspective."]',
  );
  await expect(banner).toBeVisible();
  await expect(banner).toHaveJSProperty("complete", true);
  const first = await banner.screenshot();
  await page.waitForTimeout(1600);
  const second = await banner.screenshot();
  expect(first.equals(second)).toBe(false);
  await expect(
    page.getByRole("heading", { name: "Demo video", exact: true }),
  ).toBeVisible();
});
