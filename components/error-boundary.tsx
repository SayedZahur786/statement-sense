"use client";

import { Component, type ReactNode } from "react";

export class ErrorBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    if (this.state.failed)
      return (
        <section
          role="alert"
          className="rounded-xl border border-red-300 bg-red-50 p-6 text-slate-950"
        >
          <h2 className="text-xl font-semibold">Something went wrong</h2>
          <p className="my-3">
            Please try again. Your action may not have completed.
          </p>
          <button
            type="button"
            className="rounded bg-slate-900 px-4 py-2 text-white focus-visible:outline-2"
            onClick={() => this.setState({ failed: false })}
          >
            Try again
          </button>
        </section>
      );
    return this.props.children;
  }
}
