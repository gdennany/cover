import { cn } from '@/lib/cn';
import type { Tone } from '@/lib/derive';

const TONE_CN: Record<Tone, string> = {
  ink: 'bg-ground text-ink',
  verified: 'bg-verified-fill text-verified',
  danger: 'bg-danger-fill text-danger',
  mist: 'bg-ground text-mist',
  accent: 'bg-accent-edge text-accent-text',
};

const DOT_CN: Record<Tone, string> = {
  ink: 'bg-ink',
  verified: 'bg-verified',
  danger: 'bg-danger',
  mist: 'bg-mist',
  accent: 'bg-accent',
};

export function StatusChip({ label, tone, className }: { label: string; tone: Tone; className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-1.5 whitespace-nowrap rounded-ctl px-2 py-0.5 text-xs font-semibold leading-5', TONE_CN[tone], className)}>
      <span aria-hidden className={cn('h-1.5 w-1.5 shrink-0 rounded-full', DOT_CN[tone])} />
      {label}
    </span>
  );
}
