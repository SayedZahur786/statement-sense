# Statement Sense launch notes

Adapted from ../launch-kit/templates/launch-post.md. Drafts only; no messages have been posted. Live synthetic demo: https://statement-sense-seven.vercel.app/demo. Private upload and signup await app-secret authorization. Repository: https://github.com/SayedZahur786/statement-sense.

## Launch status

The local research preview has PDF parsing, categories, subscription candidates, monthly reporting and tie-out. Only synthetic layouts have been validated. Saved history is an interest list, not a paid product. Do not announce full bank coverage, a 30-second performance claim, or user traction without evidence.

## Instagram reel — before / after

Hook: “Month-end: salary aayi thi… kahan gaya paisa?”
Before: show the clearly labelled synthetic PDF and its 80 rows.
After: show categories, top merchants, subscription candidates and the tie-out.
Voice: “Statement Sense turns a supported PDF into a clearer spending picture. No bank login. No AI processing. Check every total before trusting the chart.”
Close: “Research preview. Try the synthetic demo. Tell us which layout breaks.”
Use docs/demo.mp4 as the honest product walkthrough. Crop deliberately for vertical delivery; do not silently crop captions out.

## r/IndiaInvestments — moderator review first

Title: Built a statement-review prototype with an explicit debit/credit tie-out — looking for parser feedback

I built Statement Sense for the monthly spreadsheet chore: categorising card spends and checking that the totals actually reconcile. It has HDFC, ICICI and SBI layout adapters, deterministic categories, recurring candidates and a visible matched/mismatch/unverified state. PDFs are processed transiently; no financial rows are saved.

The important limitation: current evidence uses synthetic PDFs. I’m looking for feedback on the workflow and, separately, consented anonymised layouts for validation. Please do not post bank statements or account details in comments. History at ₹199/mo is a proposed plan; there is no payment flow. Repository: https://github.com/SayedZahur786/statement-sense. Check subreddit self-promotion rules and obtain moderator permission before posting.

## Personal-finance X — four posts

1/ Kahan gaya paisa? I built Statement Sense: a PDF-to-spending report with categories, recurring candidates and a visible tie-out. Research preview: https://github.com/SayedZahur786/statement-sense

2/ The spreadsheet ritual: download, copy, categorise, recheck. Statement Sense puts the monthly picture and the original arithmetic check in the same view. Transfers stay separate from spending.

3/ HDFC, ICICI and SBI adapters; no bank linking; no AI processing. Current tests use synthetic PDFs. A missing total says “unverified”. A known subscription merchant is a candidate, not proof.

4/ One statement at a time is free. History is an interest list at a proposed ₹199/mo, not a paid feature yet. Would this help your month-end review? Feedback welcome; never share private statements publicly.

## College WhatsApp groups — administrator permission first

Built a small research preview for the “kahan gaya paisa?” moment: Statement Sense turns a supported statement PDF into categories, top merchants, subscription candidates and a total check. Try the synthetic demo first; don’t share your PDF in this group. Currently tested on synthetic HDFC/ICICI/SBI layouts, not every bank format. Repository: https://github.com/SayedZahur786/statement-sense. Feedback on the flow would help. Free single-statement review; proposed paid history is not live.

## Week-one measurements

| Target                  | Definition                                                 | Where                                                 |
| ----------------------- | ---------------------------------------------------------- | ----------------------------------------------------- |
| 200 parsed statements   | Successful non-demo parse events, not unique users         | daily_metrics event parsed; scripts/metrics.mjs       |
| 30 history signups      | New interest-list email insertions, not verified customers | daily_metrics event interest; scripts/metrics.mjs     |
| ≥95% tie-out match rate | matched / parsed for the same period                       | daily_metrics matched and parsed; scripts/metrics.mjs |

Synthetic demo requests do not increment parse/match counters. Local signup-test events are removed before launch. These are targets, not achieved numbers.

## HUMAN NEEDED

1. Authorize transferring the two generated app-only secrets to Vercel; automatic approval review rejected the transfer without that specific consent.
2. Provide or recruit consented anonymised bank-issued PDFs for independent validation of all three bank adapters.
3. Review policy/contact details and shared launch-kit redistribution rights before marketing a commercial service. The app’s original code is MIT; no upstream kit license is invented.
4. Approve and publish channel posts personally. No outbound posting has been authorized or performed.
