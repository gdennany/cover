import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import type { Tone } from '@/lib/derive';

const BASE_CN = 'inline-flex items-center gap-1 rounded-ctl px-2 py-0.5 text-xs font-semibold leading-5 whitespace-nowrap [&>svg]:h-3.5 [&>svg]:w-3.5';

const TONE_CN: Record<Tone, string> = {
  ink: 'border border-line bg-paper text-ink',
  verified: 'bg-verified-fill text-verified',
  danger: 'bg-danger-fill text-danger',
  mist: 'bg-ground text-mist',
  accent: 'bg-accent-edge text-accent-text',
};

/** A small tinted badge, sentence case. */
export function Stamp({ tone = 'ink', className, children }: { tone?: Tone; className?: string; children: ReactNode }) {
  return <span className={cn(BASE_CN, TONE_CN[tone], className)}>{children}</span>;
}
