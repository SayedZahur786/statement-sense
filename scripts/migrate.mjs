import { readFileSync } from "node:fs";
import { neon } from "@neondatabase/serverless";
const sql = neon(process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL);
const statements = readFileSync("migrations/001_initial.sql", "utf8")
  .split(";")
  .map((x) => x.trim())
  .filter(Boolean);
await sql.transaction(statements.map((s) => sql.query(s)));
console.log("PASS migration: three application tables provisioned");
