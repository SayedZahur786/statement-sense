"use client";
import { useState } from "react";
import Link from "next/link";
export function InterestForm() {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [code, setCode] = useState("");
  const [removal, setRemoval] = useState("");
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setBusy(true);
    setMessage("");
    try {
      const r = await fetch("/api/interest", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email: form.get("email"),
          consent: form.get("consent") === "on",
        }),
      });
      const body = await r.json();
      setMessage(body.error || body.message);
      setCode(body.removalCode || "");
    } catch {
      setMessage("Could not connect. Please try again.");
    } finally {
      setBusy(false);
    }
  }
  async function remove(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    try {
      const form = new FormData(e.currentTarget);
      const r = await fetch("/api/interest", {
        method: "DELETE",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ code: form.get("code") }),
      });
      const body = await r.json();
      setRemoval(body.error || body.message);
    } catch {
      setRemoval("Could not connect. Try again later.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <div className="signup-card">
        <h2>Get early access updates</h2>
        <form onSubmit={submit}>
          <label htmlFor="email">Email address</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            maxLength={254}
          />
          <label className="consent">
            <input type="checkbox" name="consent" required />
            <span>
              I’d like updates about history access. I agree to the{" "}
              <Link href="/privacy">privacy policy</Link>. No payment or account
              is created.
            </span>
          </label>
          <button className="button" disabled={busy}>
            {busy ? "Saving…" : "Join the interest list"}
          </button>
        </form>
        <div role="status" className="signup-message">
          {message}
          {code && (
            <>
              <p>Save this private removal code:</p>
              <code>{code}</code>
            </>
          )}
        </div>
        <p className="small">
          Your email is kept for up to 90 days. You can remove it below.
        </p>
      </div>
      <details className="remove-panel">
        <summary>Remove an interest-list signup</summary>
        <form onSubmit={remove}>
          <label htmlFor="code">Your saved removal code</label>
          <input
            id="code"
            name="code"
            type="text"
            required
            pattern="[a-f0-9]{64}"
            maxLength={64}
            autoComplete="off"
          />
          <button className="button secondary" disabled={busy}>
            Remove my signup
          </button>
          <p role="status">{removal}</p>
        </form>
      </details>
    </>
  );
}
