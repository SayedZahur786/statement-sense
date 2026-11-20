'use client';

import { useEffect } from 'react';

// Explicit consent is conservative. Call with the current consent state;
// the receiver must validate, rate-limit, minimize and expire events.
export function Analytics({ consent, endpoint = '/api/analytics' }: { consent: boolean; endpoint?: string }) {
  useEffect(() => {
    if (!consent || navigator.doNotTrack === '1') return;
    const url = new URL(endpoint, window.location.origin);
    if (url.origin !== window.location.origin || url.search || url.hash) return;
    const controller = new AbortController();
    // Deliberately omit paths, queries, referrers and identifiers: URLs can contain personal data.
    void fetch(url, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ event: 'page_view' }), credentials: 'omit', signal: controller.signal }).catch(() => {});
    return () => controller.abort();
  }, [consent, endpoint]);
  return null;
}
