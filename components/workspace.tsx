"use client";
import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  Upload,
  ShieldCheck,
  FileText,
  Check,
  AlertTriangle,
  ChartPie,
  Repeat2,
  Search,
  Wallet,
  RefreshCw,
  X,
  ChevronDown,
} from "lucide-react";
import {
  categories,
  money,
  summary,
  recurring,
  type Statement,
  type Bank,
  type Category,
} from "@/lib/statement";
export function Workspace({
  initial,
  uploadsAvailable = true,
}: {
  initial?: Statement;
  uploadsAvailable?: boolean;
}) {
  const [statement, setStatement] = useState<Statement | undefined>(initial);
  const [bank, setBank] = useState<Bank>("HDFC");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [tab, setTab] = useState("Overview");
  const [month, setMonth] = useState("all");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [drag, setDrag] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const rows = useMemo(
    () =>
      statement?.transactions.filter(
        (t) => month === "all" || t.date.startsWith(month),
      ) ?? [],
    [statement, month],
  );
  const data = summary(rows);
  const repeats = recurring(statement?.transactions ?? []);
  const months = [
    ...new Set(statement?.transactions.map((t) => t.date.slice(0, 7))),
  ].sort();
  const filtered = rows.filter(
    (t) =>
      (category === "all" || t.category === category) &&
      `${t.merchant} ${t.description}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  async function upload(file?: File) {
    if (!file || !uploadsAvailable) return;
    setError("");
    if (file.size > 3_000_000) {
      setError("Choose a PDF smaller than 3 MB.");
      return;
    }
    setBusy(true);
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("bank", bank);
      const response = await fetch("/api/parse", {
        method: "POST",
        body: form,
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      setStatement(result);
      setTab("Overview");
      setMonth("all");
      setQuery("");
      setCategory("all");
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "The upload failed. Please try again.",
      );
    } finally {
      setBusy(false);
      if (input.current) input.current.value = "";
    }
  }
  function correct(id: string, value: Category) {
    if (statement)
      setStatement({
        ...statement,
        transactions: statement.transactions.map((t) =>
          t.id === id ? { ...t, category: value } : t,
        ),
      });
  }
  return (
    <main id="main" className="workspace">
      <aside className="sidebar">
        <div className="side-label">YOUR MONEY, CLEARER</div>
        <button
          className={tab === "Overview" ? "side-item active" : "side-item"}
          onClick={() => setTab("Overview")}
        >
          <ChartPie size={19} /> Overview
        </button>
        <button
          className={tab === "Transactions" ? "side-item active" : "side-item"}
          onClick={() => setTab("Transactions")}
        >
          <FileText size={19} /> Transactions{" "}
          {statement && (
            <span className="count">{statement.transactions.length}</span>
          )}
        </button>
        <button
          className={tab === "Recurring" ? "side-item active" : "side-item"}
          onClick={() => setTab("Recurring")}
        >
          <Repeat2 size={19} /> Recurring{" "}
          {statement && <span className="count">{repeats.length}</span>}
        </button>
        <div className="sidebar-bottom">
          <div className="privacy-icon">
            <ShieldCheck size={22} />
          </div>
          <strong>Your statement. Your business.</strong>
          <p>No bank login. No AI processing. Your PDF isn’t saved.</p>
          <Link href="/privacy">How we handle your data</Link>
        </div>
      </aside>
      <div className="workspace-body">
        <div className="eyebrow">
          <span className="mini-logo">S</span> YOUR MONTHLY MONEY MOMENT{" "}
          <span className="preview-label">RESEARCH PREVIEW</span>
        </div>
        <div className="page-heading">
          <div>
            <h1>
              {statement
                ? "A little clarity. A lot of sense."
                : "Kahan gaya paisa?"}
            </h1>
            <p>
              {statement
                ? "Here’s the story behind your statement."
                : "One statement. A clear picture of where your money went."}
            </p>
          </div>
          {statement && (
            <button
              className="button secondary"
              onClick={() => {
                setStatement(undefined);
                setMonth("all");
                setTab("Overview");
                setError("");
              }}
            >
              <Upload size={17} /> New statement
            </button>
          )}
        </div>
        {!statement ? (
          <>
            <section
              className={`upload-card ${drag ? "dragging" : ""}`}
              onDragOver={(e) => {
                e.preventDefault();
                setDrag(true);
              }}
              onDragLeave={() => setDrag(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDrag(false);
                if (!busy) void upload(e.dataTransfer.files[0]);
              }}
            >
              <div className="upload-illustration">
                <FileText size={42} strokeWidth={1.4} />
                <span>
                  <Check size={16} />
                </span>
              </div>
              <div className="eyebrow">FROM PDF TO PEACE OF MIND</div>
              <h2>Your money story starts here.</h2>
              <p>
                Drop your bank or credit card statement.
                <br />
                We’ll help you connect the dots.
              </p>
              {uploadsAvailable ? (
                <div className="upload-actions">
                  <label className="select-wrap">
                    <span className="sr-only">Statement bank</span>
                    <select
                      aria-label="Statement bank"
                      value={bank}
                      onChange={(e) => setBank(e.target.value as Bank)}
                      disabled={busy}
                    >
                      <option>HDFC</option>
                      <option>ICICI</option>
                      <option>SBI</option>
                    </select>
                    <ChevronDown size={15} />
                  </label>
                  <button
                    className="button"
                    disabled={busy}
                    onClick={() => input.current?.click()}
                  >
                    {busy ? (
                      <RefreshCw size={18} className="spin" />
                    ) : (
                      <Upload size={18} />
                    )}{" "}
                    {busy ? "Reading your statement…" : "Choose a PDF"}
                  </button>
                </div>
              ) : (
                <p className="error-message">
                  Private uploads are not enabled on this deployment yet.
                  Explore the synthetic demo below.
                </p>
              )}
              <input
                ref={input}
                type="file"
                accept="application/pdf,.pdf"
                aria-label="Upload statement PDF"
                className="sr-only"
                disabled={busy || !uploadsAvailable}
                onChange={(e) => void upload(e.target.files?.[0])}
              />
              <p className="small">
                PDF up to 3 MB · 30 pages · Unlocked, text-based statements
              </p>
              <div aria-live="polite">
                {busy && (
                  <p>
                    Reading rows and checking the totals. This may take a
                    moment.
                  </p>
                )}
                {error && (
                  <p role="alert" className="error-message">
                    {error}
                  </p>
                )}
              </div>
              <div className="demo-link">
                Just looking around?{" "}
                <Link href="/demo">
                  Explore a sample statement <ArrowUpRight size={14} />
                </Link>
              </div>
            </section>
            <div className="feature-grid">
              <Feature
                icon={<ChartPie />}
                title="See the bigger picture"
                text="Food runs, fuel stops, and everything in between. Categorised automatically."
              />
              <Feature
                icon={<Repeat2 />}
                title="Catch the quiet charges"
                text="Spot subscription merchants and monthly patterns worth a second look."
              />
              <Feature
                icon={<ShieldCheck />}
                title="Numbers you can check"
                text="Compare parsed amounts with statement totals. Gaps stay visible."
              />
            </div>
            <div className="support-note">
              <FileText size={18} />
              <p>
                <strong>Built for HDFC, ICICI & SBI layouts.</strong> This
                preview is tested on synthetic fixtures. Real bank layouts vary;
                always inspect the tie-out and your original PDF.
              </p>
              <a href="/samples/hdfc-synthetic.pdf" download>
                Download sample PDF
              </a>
            </div>
          </>
        ) : (
          <>
            <div className="report-toolbar">
              <div>
                <FileText size={17} />
                <strong>{statement.bank} statement</strong>
                <span className="pill">
                  {statement.synthetic
                    ? "Synthetic demo · 80 transactions"
                    : "Private session"}
                </span>
              </div>
              <label className="select-wrap">
                <span className="sr-only">Month</span>
                <select
                  aria-label="Month"
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                >
                  <option value="all">Full statement</option>
                  {months.map((m) => (
                    <option key={m} value={m}>
                      {new Date(m + "-02").toLocaleDateString("en-IN", {
                        month: "long",
                        year: "numeric",
                      })}
                    </option>
                  ))}
                </select>
                <ChevronDown size={14} />
              </label>
            </div>
            {statement.synthetic && (
              <p className="demo-notice">
                You’re exploring invented transactions, not someone’s bank data.{" "}
                <a href="/samples/hdfc-synthetic.pdf" download>
                  Download this PDF
                </a>
              </p>
            )}
            <div className={`tie-out ${statement.tieOut}`}>
              <div>
                {statement.tieOut === "matched" ? (
                  <ShieldCheck size={22} />
                ) : (
                  <AlertTriangle size={22} />
                )}
                <div>
                  <strong>
                    {statement.tieOut === "matched"
                      ? "The numbers add up."
                      : statement.tieOut === "mismatch"
                        ? "The totals don’t match."
                        : "This statement needs a closer look."}
                  </strong>
                  <p>
                    Full statement: {money(statement.debits)} parsed debits ·{" "}
                    {statement.expectedDebits === null
                      ? "no debit total found"
                      : `${money(statement.expectedDebits)} stated debits`}
                    {statement.skipped > 0
                      ? ` · ${statement.skipped} unread rows`
                      : ""}
                  </p>
                </div>
              </div>
              <span className="pill">
                {statement.tieOut === "matched"
                  ? "Tie-out matched"
                  : statement.tieOut === "mismatch"
                    ? "Mismatch"
                    : "Unverified"}
              </span>
            </div>
            {statement.warnings.map((w) => (
              <p key={w} className="error-message">
                {w}
              </p>
            ))}
            {tab === "Overview" && (
              <>
                <div className="stats-grid">
                  <section className="stat primary-stat">
                    <div>
                      <span>Total spending</span>
                      <Wallet size={18} />
                    </div>
                    <h2>{money(data.total)}</h2>
                    <p>Excludes {money(data.transfers)} in transfers</p>
                    <div className="stat-decoration" aria-hidden="true">
                      <i />
                      <i />
                      <i />
                      <i />
                      <i />
                      <i />
                      <i />
                      <i />
                    </div>
                  </section>
                  <section className="stat">
                    <div>
                      <span>Transactions</span>
                      <FileText size={18} />
                    </div>
                    <h2>
                      {rows.length}
                      <span> entries</span>
                    </h2>
                    <p>Debits and credits, all in one place</p>
                    <button
                      className="text-button"
                      onClick={() => setTab("Transactions")}
                    >
                      See every transaction <ArrowUpRight size={15} />
                    </button>
                  </section>
                  <section className="stat">
                    <div>
                      <span>Subscription candidates</span>
                      <Repeat2 size={18} />
                    </div>
                    <h2>
                      {repeats.length}
                      <span> to review</span>
                    </h2>
                    <p>Detected across the full statement</p>
                    <button
                      className="text-button"
                      onClick={() => setTab("Recurring")}
                    >
                      Take a closer look <ArrowUpRight size={15} />
                    </button>
                  </section>
                </div>
                <div className="report-grid">
                  <section className="panel">
                    <div className="panel-heading">
                      <h2>Where it went</h2>
                      <span>BY CATEGORY</span>
                    </div>
                    <div className="category-chart">
                      <div
                        className="donut"
                        aria-label="Spending category breakdown"
                      >
                        <svg
                          viewBox="0 0 160 160"
                          role="img"
                          aria-label={`${data.categories.length} spending categories`}
                        >
                          <circle
                            cx="80"
                            cy="80"
                            r="62"
                            fill="none"
                            stroke="#eef1ed"
                            strokeWidth="23"
                          />
                          {data.categories.map(([name, value], i) => {
                            const previous = data.categories
                              .slice(0, i)
                              .reduce((a, x) => a + x[1], 0);
                            return (
                              <circle
                                key={name}
                                cx="80"
                                cy="80"
                                r="62"
                                fill="none"
                                className={`stroke-${i % 8}`}
                                strokeWidth="23"
                                pathLength="100"
                                strokeDasharray={`${Math.max(0, (value / data.total) * 100 - 1)} ${100 - (value / data.total) * 100 + 1}`}
                                strokeDashoffset={
                                  (-previous / data.total) * 100
                                }
                                transform="rotate(-90 80 80)"
                              />
                            );
                          })}
                        </svg>
                        <div>
                          <strong>{data.categories.length}</strong>
                          <span>categories</span>
                        </div>
                      </div>
                      <div className="category-legend">
                        {data.categories.map(([name, value], i) => (
                          <div key={name}>
                            <span className={`color-dot color-${i % 8}`} />
                            <span>{name}</span>
                            <strong>{money(value)}</strong>
                          </div>
                        ))}
                      </div>
                    </div>
                    <p className="panel-footnote">
                      Categories are suggestions. Adjust them in Transactions.
                    </p>
                  </section>
                  <section className="panel">
                    <div className="panel-heading">
                      <h2>Your top merchants</h2>
                      <span>BY SPEND</span>
                    </div>
                    <div className="merchant-list">
                      {data.merchants.slice(0, 5).map(([name, value], i) => (
                        <div key={name}>
                          <span className={`merchant-avatar color-${i % 8}`}>
                            {name.slice(0, 1)}
                          </span>
                          <div>
                            <strong>{name}</strong>
                            <p>
                              {
                                rows.filter(
                                  (t) =>
                                    t.merchant === name &&
                                    t.direction === "debit",
                                ).length
                              }{" "}
                              transactions
                            </p>
                          </div>
                          <strong>{money(value)}</strong>
                        </div>
                      ))}
                    </div>
                    <button
                      className="text-button panel-link"
                      onClick={() => setTab("Transactions")}
                    >
                      Explore all transactions <ArrowUpRight size={15} />
                    </button>
                  </section>
                </div>
                <section className="insight">
                  <span className="insight-icon">
                    <Repeat2 size={22} />
                  </span>
                  <div>
                    <strong>Small charges have a way of adding up.</strong>
                    <p>
                      {repeats.length
                        ? `${repeats.length} subscription or recurring candidates found. A familiar merchant doesn’t always mean an active subscription.`
                        : "No clear recurring pattern found. One month may not contain enough evidence."}
                    </p>
                  </div>
                  <button
                    className="button secondary"
                    onClick={() => setTab("Recurring")}
                  >
                    Review charges
                  </button>
                </section>
              </>
            )}
            {tab === "Transactions" && (
              <section className="panel transaction-panel">
                <div className="panel-heading">
                  <div>
                    <h2>Every rupee, accounted for.</h2>
                    <p>
                      Review and correct suggested categories. Changes last for
                      this session.
                    </p>
                  </div>
                  <span>{filtered.length} ENTRIES</span>
                </div>
                <div className="filters">
                  <label className="search">
                    <Search size={17} />
                    <input
                      aria-label="Search merchants"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Search merchants"
                    />
                    {query && (
                      <button
                        aria-label="Clear search"
                        onClick={() => setQuery("")}
                      >
                        <X size={16} />
                      </button>
                    )}
                  </label>
                  <label className="select-wrap">
                    <span className="sr-only">Filter category</span>
                    <select
                      aria-label="Filter category"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      <option value="all">All categories</option>
                      {categories.map((c) => (
                        <option key={c}>{c}</option>
                      ))}
                    </select>
                    <ChevronDown size={15} />
                  </label>
                </div>
                <div className="table-scroll">
                  <table>
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Merchant</th>
                        <th>Category</th>
                        <th>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((t) => (
                        <tr key={t.id}>
                          <td>
                            {new Date(t.date + "T12:00:00").toLocaleDateString(
                              "en-IN",
                              { day: "2-digit", month: "short" },
                            )}
                          </td>
                          <td>
                            <strong>{t.merchant}</strong>
                            <small>
                              {t.direction === "credit"
                                ? "Credit / payment"
                                : "Debit"}
                            </small>
                          </td>
                          <td>
                            <select
                              aria-label={`Category for ${t.id}`}
                              value={t.category}
                              onChange={(e) =>
                                correct(t.id, e.target.value as Category)
                              }
                            >
                              {categories.map((c) => (
                                <option key={c}>{c}</option>
                              ))}
                            </select>
                          </td>
                          <td
                            className={t.direction === "credit" ? "credit" : ""}
                          >
                            {t.direction === "credit" ? "+" : "−"}
                            {money(t.amount)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {!filtered.length && (
                  <p className="empty-state">
                    No transactions match these filters.
                  </p>
                )}
              </section>
            )}
            {tab === "Recurring" && (
              <section className="panel">
                <div className="panel-heading">
                  <div>
                    <h2>The charges that keep coming back.</h2>
                    <p>
                      Full-statement candidates, not confirmed subscriptions.
                      Check with each provider before cancelling.
                    </p>
                  </div>
                </div>
                <div className="recurring-grid">
                  {repeats.map((r) => (
                    <article key={r.merchant} className="recurring-card">
                      <span className="recurring-icon">
                        <Repeat2 size={22} />
                      </span>
                      <h3>{r.merchant}</h3>
                      <h2>{money(r.amount)}</h2>
                      <p>
                        Latest charge · {r.count} occurrence
                        {r.count !== 1 ? "s" : ""}
                      </p>
                      <span className="pill">{r.reason}</span>
                    </article>
                  ))}
                </div>
                {!repeats.length && (
                  <p className="empty-state">
                    No candidates found. A single statement may not establish a
                    recurring pattern.
                  </p>
                )}
              </section>
            )}
            <p className="session-note">
              <ShieldCheck size={15} /> This report stays in this tab’s memory.
              Refresh or close it to clear your data.
            </p>
          </>
        )}
        <div className="bottom-note">
          <span>Less spreadsheet. More perspective.</span>
          <span>Made for your monthly reset.</span>
        </div>
      </div>
    </main>
  );
}
function Feature({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <section className="feature">
      <span>{icon}</span>
      <h3>{title}</h3>
      <p>{text}</p>
    </section>
  );
}
