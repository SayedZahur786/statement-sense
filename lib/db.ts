import { neon } from "@neondatabase/serverless";
import { createHash, randomBytes } from "node:crypto";
export function database() {
  if (!process.env.DATABASE_URL) throw new Error("Database unavailable");
  return neon(process.env.DATABASE_URL);
}
// A global bucket intentionally avoids trusting caller-provided IP headers.
// One atomic upsert is shared by every deployment instance.
export async function rateLimit(kind: string, limit: number) {
  const sql = database();
  const bucket = `${kind}:${Math.floor(Date.now() / 60000)}`;
  const rows =
    await sql`INSERT INTO rate_windows(bucket,count,expires_at) VALUES (${bucket},1,now()+interval '2 minutes') ON CONFLICT(bucket) DO UPDATE SET count=rate_windows.count+1 RETURNING count`;
  await sql`DELETE FROM rate_windows WHERE expires_at < now()`;
  return Number(rows[0].count) <= limit;
}
export async function metric(event: "parsed" | "matched" | "interest") {
  const sql = database();
  await sql`INSERT INTO daily_metrics(day,event,count) VALUES (current_date,${event},1) ON CONFLICT(day,event) DO UPDATE SET count=daily_metrics.count+1`;
}
export function token() {
  return randomBytes(32).toString("hex");
}
export function hash(value: string) {
  return createHash("sha256").update(value).digest("hex");
}
export function sameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  const allowed = process.env.NEXT_PUBLIC_SITE_URL;
  return (
    !!origin &&
    (origin === new URL(request.url).origin ||
      (!!allowed && origin === allowed))
  );
}
