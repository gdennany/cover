import { useEffect, useState } from 'react';
import { clockNow } from './clock';

/** The clock the screens read, ticking every 30s so windows open on time. */
export function useNow(intervalMs = 30_000): number {
  const [now, setNow] = useState(clockNow);
  useEffect(() => {
    const id = window.setInterval(() => setNow(clockNow()), intervalMs);
    return () => window.clearInterval(id);
  }, [intervalMs]);
  return now;
}
