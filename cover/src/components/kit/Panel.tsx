import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

/** The surface: white on the ground, a hairline, a soft radius. */
export function Panel({ className, children }: { className?: string; children: ReactNode }) {
  return <section className={cn('overflow-hidden rounded-kit border border-line bg-paper', className)}>{children}</section>;
}

/** A panel's title row. */
export function PanelBar({ title, aside, className }: { title: ReactNode; aside?: ReactNode; className?: string }) {
  return (
    <header className={cn('flex min-h-12 items-center justify-between gap-3 border-b border-line px-5 py-2.5', className)}>
      <h2 className="flex items-center gap-1.5 text-sm font-semibold text-ink">{title}</h2>
      {aside}
    </header>
  );
}

/** A tinted row inside a panel for a state message. */
export function Band({ tone, children, className }: { tone: 'verified' | 'danger' | 'mist' | 'accent'; children: ReactNode; className?: string }) {
  const TONE = {
    verified: 'bg-verified-fill text-verified',
    danger: 'bg-danger-fill text-danger',
    mist: 'bg-ground text-mist',
    accent: 'bg-accent-edge text-accent-text',
  } as const;
  return <div className={cn('flex items-start gap-2.5 border-b border-line px-5 py-3 text-sm font-medium leading-snug [&>svg]:mt-0.5 [&>svg]:shrink-0', TONE[tone], className)}>{children}</div>;
}
