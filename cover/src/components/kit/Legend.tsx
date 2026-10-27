import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

export interface LegendRow {
  key: string;
  label: ReactNode;
  value: ReactNode;
  tone?: 'default' | 'verified' | 'danger';
}

const VALUE_TONE = {
  default: 'text-ink',
  verified: 'text-verified',
  danger: 'text-danger',
} as const;

/**
 * The record as a row of plain numbers: the value, then what it counts.
 * A cell exists only when the fact does.
 */
export function Legend({ rows, className }: { rows: LegendRow[]; className?: string }) {
  if (rows.length === 0) return null;
  return (
    <div role="list" className={cn('flex flex-wrap gap-x-8 gap-y-3', className)}>
      {rows.map(row => (
        <div key={row.key} role="listitem" className="min-w-[96px]">
          <div className={cn('font-display text-xl font-semibold leading-none tabular-nums', VALUE_TONE[row.tone ?? 'default'])}>{row.value}</div>
          <div className="mt-1 text-xs text-mist">{row.label}</div>
        </div>
      ))}
    </div>
  );
}
