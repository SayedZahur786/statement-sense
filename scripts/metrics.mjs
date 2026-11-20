import { neon } from "@neondatabase/serverless";
const sql = neon(process.env.DATABASE_URL);
console.table(
  await sql`SELECT day,event,count FROM daily_metrics WHERE day>=current_date-7 ORDER BY day,event`,
);
