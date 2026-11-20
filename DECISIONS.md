# Decisions

- 2026-11-21: Separate statement-sense git repository. Root ignore already excludes every project directory except launch-kit; no root change needed.
- HDFC / ICICI / SBI are selected for v1 adapters. Support is layout-specific; no claim of full bank coverage without independent real-statement validation.
- Parse on the server using pdf-parse; retain neither uploaded PDF nor parsed transactions. Only sanitized descriptions are returned. No AI or external OCR.
- Free review uses browser memory. Paid history remains an interest list at proposed Rs 199/mo, no checkout until billing and account ownership are implemented. Do not pretend a signup purchases history.
- Shared kit analytics component remains disabled. Aggregate parsing counters contain no transactions or identity.
- Use Playwright real-browser recording with local text-to-speech and burned-in captions for docs/demo.mp4: demonstrating a PDF upload and tie-out is more valuable than a conceptual promo. The explicit Playwright choice uses the browser-recording exception in HyperFrames; no composition or brag install is needed.
- The story is an intended user workflow, not an invented founder testimonial. All demo transactions are synthetic.
- Operator: Sayed Zahur (workspace account identity); contact uses the verified GitHub profile. MIT license is chosen for this new app's authored code; copied kit source licensing needs owner confirmation before public redistribution (kit explicitly grants no license).
