import { timingSafeEqual } from "node:crypto";
import { database } from "@/lib/db";
export async function GET(request: Request) {
  const expected = process.env.CRON_SECRET;
  const auth = request.headers.get("authorization") || "";
  const valid =
    expected &&
    Buffer.byteLength(auth) === Buffer.byteLength(`Bearer ${expected}`) &&
    timingSafeEqual(Buffer.from(auth), Buffer.from(`Bearer ${expected}`));
  if (!valid) return Response.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const sql = database();
    await sql`DELETE FROM interest_signups WHERE created_at < now()-interval '90 days'`;
    await sql`DELETE FROM rate_windows WHERE expires_at < now()`;
    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "Cleanup unavailable" }, { status: 503 });
  }
}
