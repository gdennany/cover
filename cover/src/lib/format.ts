export const MIN = 60_000;
export const HOUR = 60 * MIN;
export const DAY = 24 * HOUR;

const EN_DASH = String.fromCharCode(0x2013);
export const MIDDOT = String.fromCharCode(0xb7);

export function fmtMoney(n: number): string {
  if (n >= 1_000_000) {
    const m = n / 1_000_000;
    return `$${Number.isInteger(m) ? m.toFixed(0) : m.toFixed(2).replace(/0+$/, '')}M`;
  }
  if (n >= 1_000) return `$${Math.round(n / 1_000)}K`;
  return `$${n}`;
}

const timeFmt = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit' });
const dayFmt = new Intl.DateTimeFormat('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
const longDayFmt = new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'short', day: 'numeric' });

export const fmtTime = (ts: number) => timeFmt.format(ts);

export function fmtTimeRange(startsAt: number, endsAt: number): string {
  const a = fmtTime(startsAt);
  const b = fmtTime(endsAt);
  const [at, ap] = a.split(' ');
  const [bt, bp] = b.split(' ');
  return ap === bp ? `${at}${EN_DASH}${bt} ${bp}` : `${a}${EN_DASH}${b}`;
}

const sameDay = (a: Date, b: Date) => a.toDateString() === b.toDateString();

export function fmtDay(ts: number, now: number, long = false): string {
  const d = new Date(ts);
  const n = new Date(now);
  if (sameDay(d, n)) return 'Today';
  const tomorrow = new Date(n);
  tomorrow.setDate(n.getDate() + 1);
  if (sameDay(d, tomorrow)) return 'Tomorrow';
  const yesterday = new Date(n);
  yesterday.setDate(n.getDate() - 1);
  if (sameDay(d, yesterday)) return 'Yesterday';
  return (long ? longDayFmt : dayFmt).format(d);
}

export const fmtWhen = (startsAt: number, endsAt: number, now: number, long = false) =>
  `${fmtDay(startsAt, now, long)} ${MIDDOT} ${fmtTimeRange(startsAt, endsAt)}`;

export const fmtMiles = (mi: number) => `${mi.toFixed(1)} mi`;

export function fmtRel(ts: number, now: number): string {
  const diff = ts - now;
  const abs = Math.abs(diff);
  const unit = abs < HOUR ? `${Math.max(1, Math.round(abs / MIN))} min` : abs < DAY ? `${Math.round(abs / HOUR)} h` : `${Math.round(abs / DAY)} d`;
  return diff >= 0 ? `in ${unit}` : `${unit} ago`;
}

export const isWeekend = (ts: number) => {
  const d = new Date(ts).getDay();
  return d === 0 || d === 6;
};

/** Local date string for an <input type="date">. */
export function toDateInput(ts: number): string {
  const d = new Date(ts);
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

export function toTimeInput(ts: number): string {
  const d = new Date(ts);
  const p = (n: number) => String(n).padStart(2, '0');
  return `${p(d.getHours())}:${p(d.getMinutes())}`;
}

export function fromDateTimeInputs(date: string, time: string): number {
  const [y, m, d] = date.split('-').map(Number);
  const [hh, mm] = time.split(':').map(Number);
  return new Date(y, m - 1, d, hh, mm, 0, 0).getTime();
}
