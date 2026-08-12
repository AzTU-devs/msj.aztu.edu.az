"use client";
import { useEffect, useRef } from "react";

/** Fires a single view/download metric event to the backend (deduped server-side). */
export default function MetricBeacon({ articleId, type }: { articleId: number; type: string }) {
  const sent = useRef(false);
  useEffect(() => {
    if (sent.current) return;
    sent.current = true;
    fetch(`/api/v1/metrics/events`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ articleId, type }),
      keepalive: true,
    }).catch(() => {});
  }, [articleId, type]);
  return null;
}
