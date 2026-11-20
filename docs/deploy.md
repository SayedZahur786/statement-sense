# Deployment and operations

Live demo: https://statement-sense-seven.vercel.app/demo. Uploads and signup are explicitly unavailable in production until app-secret transfer is authorized. They are implemented and tested locally.

Vercel project: statement-sense, prj_EjL9mkANpXbYzeAWm1Scm81DtTda. GitHub: SayedZahur786/statement-sense.
Neon: still-waterfall-10785451, production branch br-polished-tooth-b30o1rsm, Singapore.

## Environment

DATABASE_URL: app-role pooled connection, server-only. CRON_SECRET: dedicated cleanup authorization secret. NEXT_PUBLIC_SITE_URL: the canonical origin. DATABASE_URL_UNPOOLED is an owner credential for local migrations; never upload it to hosting. Values are in ignored .env.local / .env.admin, never this document. Neon deploy repulls owner env values, so restore the scoped runtime URL afterward before app deployment.

After authorizing transfer of the two app-specific secrets to Vercel, run `node --env-file=.env.local scripts/vercel-env.mjs`, then `vercel --prod --yes`. The environment helper only adds values; it refuses existing keys to avoid silently replacing them. It does not print values. Verify the final alias and update NEXT_PUBLIC_SITE_URL if the desired alias was unavailable.

Run `node --env-file=.env.local scripts/metrics.mjs` for seven-day aggregate counts. This is an operator-only CLI, not a public API. The three targets are 200 non-demo parsed statements, 30 new history-interest signups, and at least 95% matched tie-outs among parsed statements. The last is a product target, not a measured result. Counts measure events, not unique people or unique documents.

## Retention and recovery

Vercel calls /api/cleanup daily at 03:00 UTC with CRON_SECRET. Manually invoke with the same bearer secret if a run fails; verify HTTP 200 without logging the token. Cleanup removes signups older than 90 days; backups can retain data under Neon policy. Monitor Vercel cron failures.

Neon's created project reports a six-hour restore window. Before a schema change, create an isolated branch and validate the migration there. For recovery, use Neon Console to branch from a known-good timestamp within the retained window, validate row counts and grants, then explicitly point the app at the recovered branch. Recovery has not been drill-tested. There is no financial data in Postgres to restore.

## Launch limits

Only synthetic PDF layouts have been tested. Obtain consented anonymised real statements before announcing broad bank compatibility. No billing provider, saved history or account login is live. Signup email ownership is not verified; do not treat interest entries as verified customers or send marketing without reviewing consent and email ownership. No automated outbound email is sent by this app.
