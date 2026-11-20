# Validation evidence — 21 November 2026

## Local configured production build

- Frozen npm ci completed. npm audit: zero vulnerabilities across production and development dependencies at the final dependency installation.
- Strict TypeScript build and ESLint pass.
- 20 unit/integration tests: real PDF text extraction for three synthetic bank fixtures; card/account formats, integer amounts, impossible dates, unknown rows, missing totals, debit/credit mismatches, transfers, recurring candidates and body-byte caps.
- Four Playwright checks: upload → summary → recurring candidate → search/category correction; all main routes on mobile and actual 404; upload/origin/cleanup denial; interest insertion and deletion by removal capability.
- Dedicated Neon production project migration applied. Runtime role lacks superuser, role-creation and database-creation permission. Fifteen concurrent rate-counter writes produced exactly 15 increments. Test signup rows were removed.
- Fourteen real desktop/mobile PNGs saved in docs/screenshots. The local configured app, not the unconfigured hosted demo, is shown.
- GitHub README banner animation verified in Chromium: screenshots 1.6 seconds apart differ; image loads and Demo video section renders.
- Narrated real-browser video: 51.4 seconds, H.264 video + AAC audio, large burned-in captions. Six voice segments align to recorded stage timings. Local synthetic HDFC fixture used.
- Gitleaks scanned the tracked source snapshot and complete git history with no findings. Ignored environment credentials are expected locally and are excluded from deploy archives. No owner connection is sent to Vercel.

## Shared launch-kit gates

- PASS placeholder-scan: authored source/docs contain no banned filler patterns.
- PASS header-check: public HTTPS deployment returned required headers on /, /privacy and /terms, including HSTS.
- PASS policy-check: public policy pages have distinct substantive visible content; factual/legal adequacy is not established by this script.
- PASS perf-check: final UI cold mobile lab LCP 776 / 660 / 724 ms; worst 776 ms, below 2,500 ms. This is local hardware evidence, not field performance or upload latency.

## Hosted scope

The Vercel production build succeeded. The public site is intentionally demo-only until transfer of app-specific credentials is explicitly authorized. A first hosted API probe exposed missing canvas packaging; the code now traces that runtime dependency and imports the parser only after availability/rate checks. Final hosted checks PASS: HTTPS headers including HSTS; substantive policy pages; public demo interactions; unavailable upload/signup controls; and HTTP 503 from the unconfigured upload API. Canonical origin is https://statement-sense-seven.vercel.app. No claim of hosted private-upload success is made without a real end-to-end test.

## Not established

Real bank-issued layout compatibility; a 30-second user outcome; verified signup email ownership; paid history; billing; independent security certification; restore drill; 200 users/statements or 30 signups. Week-one figures in LAUNCH.md are targets only. All screenshots and sample PDFs contain invented data.
