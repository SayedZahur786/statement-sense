# Decisions

- 2026-11-21: Separate statement-sense git repository. Root ignore already excludes every project directory except launch-kit; no root change needed.
- HDFC / ICICI / SBI are selected for v1 adapters. Support is layout-specific; no claim of full bank coverage without independent real-statement validation.
- Parse on the server using pdf-parse; retain neither uploaded PDF nor parsed transactions. Only sanitized descriptions are returned. No AI or external OCR.
- Free review uses browser memory. Paid history remains an interest list at proposed Rs 199/mo, no checkout until billing and account ownership are implemented. Do not pretend a signup purchases history.
- Shared kit analytics component remains disabled. Aggregate parsing counters contain no transactions or identity.
- Use Playwright real-browser recording with local text-to-speech and burned-in captions for docs/demo.mp4: demonstrating a PDF upload and tie-out is more valuable than a conceptual promo. The explicit Playwright choice uses the browser-recording exception in HyperFrames; no composition or brag install is needed.
- The story is an intended user workflow, not an invented founder testimonial. All demo transactions are synthetic.
- Operator: Sayed Zahur (workspace account identity); contact uses the verified GitHub profile. MIT license is chosen for this new app's authored code; copied kit source licensing needs owner confirmation before public redistribution (kit explicitly grants no license).
- Neon project still-waterfall-10785451 has dedicated production branch br-polished-tooth-b30o1rsm in Singapore (aws-ap-southeast-1). The authenticated free organization is org-sweet-wildflower-67376060; CLI has no organization-create command, so no new billing organization was created. No other app shares this project.
- Renamed Neon's initial main branch to production, then completed neon init and neon deploy. Existing installed Neon skills were consulted read-only; agent installation was skipped to respect project-only writes.
- Preserved the existing HTTP one-shot Neon driver; runtime uses a pooled connection with restricted table grants. Migration ownership stays separate. Preview secrets are not shared with production.
- Root layout is dynamic for per-request nonce CSP. Static HTML would be cheaper but cannot carry the correct per-request script nonce.

- Production alias is https://statement-sense-seven.vercel.app. The requested base slug was unavailable; all canonical metadata uses the verified alias. The first deployment is demo-only because automatic approval review twice rejected sending the generated runtime database and cron credentials to Vercel without specific user consent. A targeted approval request is pending. Public upload and signup controls show explicit unavailability; no secrets were transferred.
- Vercel testing exposed an untraced optional canvas dependency in pdf-parse. Added a direct runtime dependency and output tracing; parser import now occurs only after the shared rate gate. Local PDF tests are not represented as a successful hosted private upload.
