# Statement Sense — plan

Prepared 21 November 2026. Primary persona: a 24-year-old Indian salaried professional with two cards and one salary account, reviewing a monthly PDF on a laptop after wondering “kahan gaya paisa?”. Core job: turn one statement into an inspectable monthly explanation, with enough reconciliation evidence to know when to distrust it.

## Competitive research

Sources accessed 21 November 2026; prices are vendor claims, not purchase quotes. Complaints are anecdotes, not prevalence estimates.

| Alternative            | Capability / price evidence                                                                                                                                                    | Complaints or limitations                                                                                                                                                            | Our narrow opportunity                                                                  |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------- |
| Fold                   | Bank/account aggregation, merchant categories, recurring bills; free and Plus tiers. [Official FAQ](https://fold.money/faq). Exact current INR checkout price not established. | [User discussion](https://www.reddit.com/r/CreditCardsIndia/comments/1ju36a8/) describes card-payment double counting; historical anecdote, not a verified current defect.           | One deliberate PDF review without ongoing account access; exclude transfers from spend. |
| Axio / Walnut          | SMS-driven expense tracking, adjacent lending products. [Official channel](https://www.youtube.com/@add_axio). Standalone tracker fee not established.                         | [Users reported SMS-reading failures](https://www.reddit.com/r/personalfinanceindia/comments/1kicolh/expense_tracking_app_any_axio_alternatives/); original poster later says fixed. | A statement-based alternative independent of SMS permissions.                           |
| BankConvert            | PDF to spreadsheet/accounting formats and categorisation. [Pricing](https://bankconvert.com/pricing): Starter $49 monthly or $24/mo billed $288 annually, 50 statements.       | No sufficiently sourced user complaint found. Inferred limitation: accounting conversion price/scope exceeds a single consumer review.                                               | INR-oriented monthly summary with upfront uncertainty.                                  |
| Vertex42 Money Manager | [Free personal-use Excel/Sheets template](https://www.vertex42.com/ExcelTemplates/money-management-template.html), categorisation and reconciliation.                          | Author warns edits can introduce errors. No independently verified complaint; transaction entry/import effort is our inference.                                                      | PDF extraction and visible tie-out before trusting the chart.                           |

## Smallest lovable v1

The fixed five capabilities: HDFC, ICICI and SBI PDF adapters; deterministic categorisation; recurring/subscription candidates; monthly categories and merchants; explicit tie-out. One statement at a time is free. History/multi-bank is a proposed Rs 199/mo plan, interest signup only until authentication and billing exist. No live bank linking, UPI integration, family accounts, OCR, or money movement.

## Data and routes

All money uses integer paise. Transaction: id, ISO date, redacted description, merchant, debit/credit, category, amount. Parsed statement: bank, rows, skipped-row count, debit total, credit total, extracted summary totals, reconciliation state (matched/mismatch/unverified). Browser memory holds the active statement; never persist PDFs or transaction rows. Neon stores only history-interest emails, rate windows and daily aggregate counters. Migration lives in migrations/001_initial.sql.

Routes: / (overview and upload), /demo (clearly synthetic 80-row report), /history (interest signup, no payment), /privacy, /terms, /api/parse, /api/interest. Empty upload, parsing, unsupported/encrypted/oversized/error, matched, mismatch and unverified are explicit states. Filters and category correction are in-memory only.

## Risk and cheapest test

Biggest risk: bank PDF layout variations silently lose or misinterpret rows. Synthetic fixture coverage does not validate bank-issued PDFs. Cheapest test: recruit five consenting people for each bank, have them anonymise their PDFs, compare every extracted row and debit/credit totals manually, and record unsupported layouts. Public launch as supported production software is gated on this exercise. No fabricated user validation.

## Sequence

Implement and unit-test parsing, build UI and synthetic PDFs, add Neon interest/aggregate services with fail-closed shared limits, production-test flows and security, run all shared gates, capture screenshots and narrated real-browser demo, publish repository and Vercel preview, document residual launch blockers.
