import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { KICKER_CN } from '@/lib/ui';

/** Every screen opens with a small label, one H1 and a line of description. */
export function PageHead({ kicker, title, description, aside, className }: { kicker: string; title: ReactNode; description?: ReactNode; aside?: ReactNode; className?: string }) {
  return (
    <div className={cn('flex flex-wrap items-end justify-between gap-x-6 gap-y-4', className)}>
      <div className="min-w-0">
        <p className={KICKER_CN}>{kicker}</p>
        <h1 className="mt-1 font-display text-2xl font-semibold leading-tight tracking-tight text-ink md:text-[28px]">{title}</h1>
        {description ? <p className="mt-2 max-w-prose text-[15px] leading-relaxed text-mist">{description}</p> : null}
      </div>
      {aside}
    </div>
  );
}
