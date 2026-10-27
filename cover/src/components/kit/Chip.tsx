import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { CHIP_CN, CHIP_ON_CN } from '@/lib/ui';

/** A filter toggle: the paper edge, the accent fill when on, no easing. */
export function Chip({ on, onClick, children, className }: { on: boolean; onClick: () => void; children: ReactNode; className?: string }) {
  return (
    <button type="button" aria-pressed={on} onClick={onClick} className={cn(CHIP_CN, on && CHIP_ON_CN, className)}>
      {children}
    </button>
  );
}
