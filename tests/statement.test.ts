import { test } from "node:test";
import assert from "node:assert/strict";
import {
  parseStatement,
  classify,
  recurring,
  redact,
  paise,
  dateISO,
  summary,
} from "../lib/statement";
import { demoText } from "../lib/demo";
for (const bank of ["HDFC", "ICICI", "SBI"] as const)
  test(`${bank}: reads 80 rows and reconciles synthetic card fixture`, () => {
    const s = parseStatement(demoText(bank), bank);
    assert.equal(s.transactions.length, 80);
    assert.equal(s.tieOut, "matched");
    assert.equal(s.credits, 8500000);
    assert.equal(recurring(s.transactions).length, 3);
    assert.equal(s.synthetic, true);
  });
for (const bank of ["HDFC", "ICICI", "SBI"] as const)
  test(`${bank}: reads debit/credit/balance account layout`, () => {
    const s = parseStatement(
      `${bank === "SBI" ? "STATE BANK OF INDIA" : bank + " BANK"} ACCOUNT STATEMENT\n01/10/2026 SWIGGY 200.50 0.00 799.50\n02/10/2026 NEFT REFUND 0.00 100.00 899.50\nTOTAL DEBITS 200.50\nTOTAL CREDITS 100.00`,
      bank,
    );
    assert.equal(s.debits, 20050);
    assert.equal(s.credits, 10000);
    assert.equal(s.tieOut, "matched");
  });
test("money, dates, redaction and classification", () => {
  assert.equal(paise("1,23,456.78"), 12345678);
  assert.equal(dateISO("31/02/2026"), null);
  assert.equal(dateISO("01-Oct-26"), "2026-10-01");
  assert.equal(classify("UPI SWIGGY"), "Food & drinks");
  assert.equal(classify("HPCL"), "Fuel");
  assert.equal(classify("NETFLIX"), "Subscriptions");
  assert.equal(classify("IMPS TRANSFER"), "Transfers");
  assert.equal(classify("UPI UNKNOWN"), "Other");
  assert.ok(!redact("UPI NAME 123456789012 name@upi").includes("123456789012"));
});
test("total due never substitutes for debit total", () => {
  const s = parseStatement(
    "HDFC BANK CREDIT CARD\n01/10/2026 CAFE 200.00 DR\nTOTAL AMOUNT DUE 200.00",
    "HDFC",
  );
  assert.equal(s.tieOut, "unverified");
});
test("mismatched debit or credit totals cannot pass", () => {
  assert.equal(
    parseStatement(
      demoText().replace(/TOTAL DEBITS [\d.]+/, "TOTAL DEBITS 1.00"),
      "HDFC",
    ).tieOut,
    "mismatch",
  );
  assert.equal(
    parseStatement(
      demoText().replace("TOTAL CREDITS 85000.00", "TOTAL CREDITS 1.00"),
      "HDFC",
    ).tieOut,
    "mismatch",
  );
});
test("invalid and missing dated rows prevent successful tie-out", () => {
  const s = parseStatement(
    demoText() + "\n31/02/2026 CAFE 4.00 DR\n08/10/2026 broken row",
    "HDFC",
  );
  assert.equal(s.skipped, 2);
  assert.equal(s.tieOut, "unverified");
});
test("no cross-bank acceptance and no empty report", () => {
  assert.throws(() => parseStatement(demoText(), "ICICI"));
  assert.throws(() => parseStatement("HDFC BANK no rows", "HDFC"));
});
test("transfers excluded from spending; repeated food is not subscription", () => {
  const s = parseStatement(demoText(), "HDFC");
  assert.ok(summary(s.transactions).total < s.debits);
  assert.ok(
    recurring(s.transactions).every((r) => !r.merchant.includes("SWIGGY")),
  );
});
test("monthly repeated merchant is a candidate; same-day duplicates are not", () => {
  const s = parseStatement(
    "HDFC BANK CREDIT CARD\n01/09/2026 GYM 1000.00 DR\n01/10/2026 GYM 1000.00 DR",
    "HDFC",
  );
  assert.equal(recurring(s.transactions)[0].confirmed, true);
  assert.equal(
    recurring([...s.transactions.map((t) => ({ ...t, date: "2026-10-01" }))])
      .length,
    0,
  );
});
