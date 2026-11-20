import { neon } from "@neondatabase/serverless";
import assert from "node:assert/strict";
const sql = neon(process.env.DATABASE_URL);
const role =
  await sql`SELECT current_user,rolsuper,rolcreatedb,rolcreaterole FROM pg_roles WHERE rolname=current_user`;
assert.equal(role[0].current_user, "statement_sense_app");
assert.equal(role[0].rolsuper, false);
assert.equal(role[0].rolcreatedb, false);
assert.equal(role[0].rolcreaterole, false);
const key = `qa-${Date.now()}`;
await Promise.all(
  Array.from(
    { length: 15 },
    () =>
      sql`INSERT INTO rate_windows(bucket,count,expires_at) VALUES (${key},1,now()+interval '1 minute') ON CONFLICT(bucket) DO UPDATE SET count=rate_windows.count+1`,
  ),
);
const count = await sql`SELECT count FROM rate_windows WHERE bucket=${key}`;
assert.equal(count[0].count, 15);
await sql`DELETE FROM rate_windows WHERE bucket=${key}`;
const missing =
  await sql`SELECT count(*)::int AS count FROM interest_signups WHERE email LIKE '%@statement-sense.invalid'`;
assert.equal(missing[0].count, 0);
console.log(
  "PASS database: restricted runtime role, concurrent atomic counters, signup cleanup",
);
