import { test, expect } from "@playwright/test";
test("upload PDF, inspect categories, review subscriptions and correct transaction", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await page
    .getByLabel("Upload statement PDF")
    .setInputFiles("public/samples/hdfc-synthetic.pdf");
  await expect(page.getByText("The numbers add up.")).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Where it went" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Review charges" }).click();
  await expect(
    page.getByRole("heading", { name: "NETFLIX", exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: /Transactions 80/ }).click();
  await page.getByLabel("Search merchants").fill("SWIGGY");
  await expect(page.locator("tbody tr")).toHaveCount(4);
  const category = page.locator("tbody select").first();
  await category.selectOption("Other");
  await expect(category).toHaveValue("Other");
  await page.getByRole("button", { name: "New statement" }).click();
  await expect(
    page.getByRole("heading", { name: "Your money story starts here." }),
  ).toBeVisible();
  expect(errors).toEqual([]);
});
test("routes, mobile overflow, headers and 404", async ({ page, request }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const route of ["/", "/demo", "/history", "/privacy", "/terms"]) {
    const response = await page.goto(route);
    expect(response?.status()).toBe(200);
    await expect(page.locator("main h1")).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  }
  const missing = await page.goto("/no-such-route");
  expect(missing?.status()).toBe(404);
  const header = await request.get("/");
  expect(header.headers()["x-content-type-options"]).toBe("nosniff");
});
test("upload denial and malformed PDF", async ({ page, request, baseURL }) => {
  const denial = await request.post("/api/parse", { data: "x" });
  expect(denial.status()).toBe(403);
  await page.goto("/");
  await page
    .getByLabel("Upload statement PDF")
    .setInputFiles({
      name: "invalid.pdf",
      mimeType: "application/pdf",
      buffer: Buffer.from("not a PDF"),
    });
  await expect(page.locator("main [role=alert]")).toHaveText(
    "This file is not a PDF.",
  );
  const cron = await request.get("/api/cleanup");
  expect(cron.status()).toBe(401);
  const interest = await request.post("/api/interest", {
    headers: { origin: baseURL! },
    data: { email: "invalid", consent: false },
  });
  expect(interest.status()).toBe(400);
});
test("interest signup persists and removal code deletes only its own signup", async ({
  page,
  request,
  baseURL,
}) => {
  await page.goto("/history");
  await page
    .getByLabel("Email address")
    .fill(`qa-${Date.now()}@statement-sense.invalid`);
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Join the interest list" }).click();
  await expect(page.locator(".signup-card code")).toBeVisible({
    timeout: 15000,
  });
  const code = (await page.locator(".signup-card code").textContent())!;
  expect(code).toMatch(/^[a-f0-9]{64}$/);
  const denied = await request.delete("/api/interest", {
    headers: { origin: "https://untrusted.invalid" },
    data: { code },
  });
  expect(denied.status()).toBe(403);
  await page
    .getByText("Remove an interest-list signup", { exact: true })
    .click();
  await page.getByLabel("Your saved removal code").fill(code);
  await page.getByRole("button", { name: "Remove my signup" }).click();
  await expect(
    page.getByText("Any signup matching this code has been removed."),
  ).toBeVisible();
  const invalid = await request.delete("/api/interest", {
    headers: { origin: baseURL! },
    data: { code: "short" },
  });
  expect(invalid.status()).toBe(400);
});
