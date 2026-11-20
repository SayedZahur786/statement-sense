export const categories = [
  "Food & drinks",
  "Groceries",
  "Shopping",
  "Transport",
  "Fuel",
  "Subscriptions",
  "Bills & rent",
  "Transfers",
  "Other",
] as const;
export type Category = (typeof categories)[number];
export type Bank = "HDFC" | "ICICI" | "SBI";
export type Transaction = {
  id: string;
  date: string;
  description: string;
  merchant: string;
  amount: number;
  direction: "debit" | "credit";
  category: Category;
};
export type Statement = {
  bank: Bank;
  transactions: Transaction[];
  debits: number;
  credits: number;
  expectedDebits: number | null;
  expectedCredits: number | null;
  tieOut: "matched" | "mismatch" | "unverified";
  skipped: number;
  warnings: string[];
  synthetic: boolean;
};
export const money = (paise: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(paise / 100);
export function paise(value: string): number {
  const cleaned = value.replace(/,/g, "");
  if (!/^\d{1,10}\.\d{2}$/.test(cleaned)) throw new Error("Invalid amount");
  const [whole, fraction] = cleaned.split(".");
  return Number(whole) * 100 + Number(fraction);
}
export function redact(text: string): string {
  return text
    .replace(/\b[\w.+-]+@[\w.-]+\b/g, "[UPI ID]")
    .replace(/\b(?:\d[ -]?){8,19}\b/g, "[reference]")
    .replace(/\b[A-Z]{4}0[A-Z0-9]{6}\b/g, "[IFSC]")
    .slice(0, 180);
}
const rules: [RegExp, Category][] = [
  [
    /NETFLIX|SPOTIFY|YOUTUBE PREMIUM|APPLE COM|HOTSTAR|ADOBE|AMAZON PRIME/i,
    "Subscriptions",
  ],
  [/SWIGGY|ZOMATO|CAFE|COFFEE|RESTAURANT|DARSHINI|STARBUCKS/i, "Food & drinks"],
  [/BIGBASKET|BLINKIT|ZEPTO|DMART|GROCERY|FRESH/i, "Groceries"],
  [/PETROL|FUEL|HPCL|BPCL|IOCL|INDIAN OIL/i, "Fuel"],
  [/UBER|OLA\b|RAPIDO|METRO|IRCTC/i, "Transport"],
  [/ELECTRIC|BESCOM|AIRTEL|JIO\b|RENT|BROADBAND/i, "Bills & rent"],
  [/AMAZON|FLIPKART|MYNTRA|UNIQLO|DECATHLON/i, "Shopping"],
  [/NEFT|IMPS|TRANSFER|CREDIT CARD PAYMENT|CARD BILL|SALARY/i, "Transfers"],
];
export function classify(description: string): Category {
  return rules.find(([pattern]) => pattern.test(description))?.[1] ?? "Other";
}
export function merchantOf(description: string): string {
  return (
    redact(description)
      .replace(/^(UPI|POS|ECOM|ACH|NACH)[\s/:-]+/i, "")
      .replace(/\s*\[reference\].*$/, "")
      .replace(/\s*\[UPI ID\].*$/, "")
      .replace(/\s+/g, " ")
      .trim() || "Unidentified merchant"
  );
}
export function dateISO(value: string): string | null {
  const match = value.match(
    /^(\d{2})[/-](\d{2}|[A-Za-z]{3})[/-](\d{2}|\d{4})$/,
  );
  if (!match) return null;
  const months = [
    "jan",
    "feb",
    "mar",
    "apr",
    "may",
    "jun",
    "jul",
    "aug",
    "sep",
    "oct",
    "nov",
    "dec",
  ];
  const month = /^\d+$/.test(match[2])
    ? Number(match[2])
    : months.indexOf(match[2].toLowerCase()) + 1;
  const year =
    match[3].length === 2 ? 2000 + Number(match[3]) : Number(match[3]);
  const day = Number(match[1]);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
    ? `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    : null;
}
const amount = "([\\d,]+\\.\\d{2})";
const datePattern = "(\\d{2}[/-](?:\\d{2}|[A-Za-z]{3})[/-](?:\\d{4}|\\d{2}))";
// Card rows have one signed amount. Account rows must expose both debit and credit columns.
function cardRow(line: string) {
  const match = line.match(
    new RegExp(`^${datePattern}\\s+(.+?)\\s+${amount}\\s*(DR|CR)?$`, "i"),
  );
  if (!match) return null;
  return {
    date: match[1],
    description: match[2],
    amount: paise(match[3]),
    direction:
      match[4]?.toUpperCase() === "CR"
        ? ("credit" as const)
        : ("debit" as const),
  };
}
function accountRow(line: string) {
  const match = line.match(
    new RegExp(
      `^${datePattern}\\s+(?:${datePattern}\\s+)?(.+?)\\s+${amount}\\s+${amount}\\s+${amount}(?:\\s*(?:CR|DR))?$`,
      "i",
    ),
  );
  if (!match) return null;
  const debit = paise(match[4]),
    credit = paise(match[5]);
  if (debit > 0 === credit > 0) return null;
  return {
    date: match[1],
    description: match[3],
    amount: debit || credit,
    direction: debit ? ("debit" as const) : ("credit" as const),
  };
}
export const adapters = {
  HDFC: {
    identity: /HDFC\s+BANK/i,
    card: /CREDIT CARD|CARD STATEMENT/i,
    debits:
      /TOTAL (?:DEBITS|SPENDS|PURCHASES)\s*:?\s*(?:INR|Rs\.?)?\s*([\d,]+\.\d{2})/i,
    credits: /TOTAL CREDITS\s*:?\s*([\d,]+\.\d{2})/i,
  },
  ICICI: {
    identity: /ICICI\s+BANK/i,
    card: /CREDIT CARD|CARD STATEMENT/i,
    debits:
      /TOTAL (?:DEBITS|WITHDRAWALS|PURCHASES)\s*:?\s*(?:INR|Rs\.?)?\s*([\d,]+\.\d{2})/i,
    credits: /TOTAL (?:CREDITS|DEPOSITS)\s*:?\s*([\d,]+\.\d{2})/i,
  },
  SBI: {
    identity: /STATE BANK OF INDIA|SBI\s+(?:CARD|BANK)/i,
    card: /CREDIT CARD|CARD STATEMENT|SBI CARD/i,
    debits:
      /TOTAL (?:DEBITS|DEBIT AMOUNT|PURCHASES)\s*:?\s*(?:INR|Rs\.?)?\s*([\d,]+\.\d{2})/i,
    credits: /TOTAL (?:CREDITS|CREDIT AMOUNT)\s*:?\s*([\d,]+\.\d{2})/i,
  },
};
export function parseStatement(text: string, bank: Bank): Statement {
  if (text.length > 1_000_000)
    throw new Error("Statement text exceeds the review limit.");
  const adapter = adapters[bank];
  if (!adapter.identity.test(text))
    throw new Error(
      `This document does not identify itself as ${bank}. Choose the matching bank.`,
    );
  const card = adapter.card.test(text);
  const transactions: Transaction[] = [];
  let skipped = 0;
  const lines = text
    .split(/\r?\n/)
    .map((x) => x.trim())
    .filter(Boolean);
  for (const line of lines) {
    if (!/^\d{2}[/-](?:\d{2}|[A-Za-z]{3})[/-]\d{2}/.test(line)) continue;
    try {
      const row = card ? cardRow(line) : accountRow(line);
      if (!row) {
        skipped++;
        continue;
      }
      const date = dateISO(row.date);
      if (!date || row.amount <= 0) {
        skipped++;
        continue;
      }
      const description = redact(row.description);
      transactions.push({
        ...row,
        date,
        description,
        merchant: merchantOf(description),
        category: classify(description),
        id: `row-${transactions.length + 1}`,
      });
    } catch {
      skipped++;
    }
  }
  if (!transactions.length)
    throw new Error(
      "No supported transaction rows found. Use a text-based PDF with visible debit/credit columns; scans and some layouts are not supported.",
    );
  if (transactions.length > 2000)
    throw new Error("Use a statement with at most 2,000 transactions.");
  const debits = transactions
      .filter((t) => t.direction === "debit")
      .reduce((a, t) => a + t.amount, 0),
    credits = transactions
      .filter((t) => t.direction === "credit")
      .reduce((a, t) => a + t.amount, 0);
  const expectedDebits = text.match(adapter.debits),
    expectedCredits = text.match(adapter.credits);
  const expectedD = expectedDebits ? paise(expectedDebits[1]) : null,
    expectedC = expectedCredits ? paise(expectedCredits[1]) : null;
  const mismatch =
    (expectedD !== null && expectedD !== debits) ||
    (expectedC !== null && expectedC !== credits);
  const tieOut = mismatch
    ? "mismatch"
    : skipped || expectedD === null || (credits > 0 && expectedC === null)
      ? "unverified"
      : "matched";
  const warnings: string[] = [];
  if (skipped)
    warnings.push(
      `${skipped} dated rows could not be read. This report is incomplete.`,
    );
  if (expectedD === null)
    warnings.push(
      "No explicit debit total was found. Total amount due is not a spending total.",
    );
  if (credits > 0 && expectedC === null)
    warnings.push(
      "Credits could not be reconciled against an explicit credit total.",
    );
  if (mismatch)
    warnings.push(
      "Parsed amounts differ from the statement totals. Check the original before relying on this report.",
    );
  return {
    bank,
    transactions,
    debits,
    credits,
    expectedDebits: expectedD,
    expectedCredits: expectedC,
    tieOut,
    skipped,
    warnings,
    synthetic: /SYNTHETIC DEMO/i.test(text),
  };
}
export function recurring(transactions: Transaction[]) {
  const groups = new Map<string, Transaction[]>();
  for (const t of transactions.filter((t) => t.direction === "debit")) {
    const key = t.merchant.toUpperCase();
    groups.set(key, [...(groups.get(key) ?? []), t]);
  }
  return [...groups.values()].flatMap((rows) => {
    const subscription = rows[0].category === "Subscriptions";
    const dates = rows.map((t) => Date.parse(t.date)).sort((a, b) => a - b);
    const periodic =
      rows.length >= 2 &&
      dates.slice(1).every((d, i) => {
        const gap = (d - dates[i]) / 86400000;
        return gap >= 25 && gap <= 35;
      });
    const similar = rows.every(
      (t) =>
        Math.abs(t.amount - rows[0].amount) <=
        Math.max(100, rows[0].amount * 0.05),
    );
    if (!subscription && !(periodic && similar)) return [];
    return [
      {
        merchant: rows[0].merchant,
        amount: [...rows].sort((a, b) => a.date.localeCompare(b.date)).at(-1)!
          .amount,
        count: rows.length,
        reason:
          periodic && similar
            ? "Monthly pattern"
            : "Known subscription merchant — verify",
        confirmed: periodic && similar,
      },
    ];
  });
}
export function summary(rows: Transaction[]) {
  const spending = rows.filter(
    (t) => t.direction === "debit" && t.category !== "Transfers",
  );
  const total = spending.reduce((a, t) => a + t.amount, 0);
  const grouped = (key: "category" | "merchant") =>
    Object.entries(
      spending.reduce<Record<string, number>>((acc, t) => {
        acc[t[key]] = (acc[t[key]] ?? 0) + t.amount;
        return acc;
      }, {}),
    ).sort((a, b) => b[1] - a[1]);
  return {
    total,
    categories: grouped("category"),
    merchants: grouped("merchant"),
    transfers: rows
      .filter((t) => t.direction === "debit" && t.category === "Transfers")
      .reduce((a, t) => a + t.amount, 0),
  };
}
