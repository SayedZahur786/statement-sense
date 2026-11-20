import { spawnSync } from "node:child_process";
const values = {
  DATABASE_URL: process.env.DATABASE_URL,
  CRON_SECRET: process.env.CRON_SECRET,
};
for (const [name, value] of Object.entries(values)) {
  if (!value) throw new Error(`${name} is missing`);
  const result = spawnSync("vercel", ["env", "add", name, "production"], {
    input: value,
    encoding: "utf8",
  });
  if (result.status !== 0) {
    console.error(
      `Failed setting ${name}; inspect Vercel environment settings.`,
    );
    process.exit(1);
  }
  console.log(`Configured ${name} in production`);
}
