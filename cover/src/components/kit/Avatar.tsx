import { cn } from '@/lib/cn';

export function Avatar({ initials, size = 'md', className }: { initials: string; size?: 'sm' | 'md' | 'lg'; className?: string }) {
  const SIZE = { sm: 'h-7 w-7 text-[11px]', md: 'h-10 w-10 text-sm', lg: 'h-14 w-14 text-lg' } as const;
  return (
    <span aria-hidden className={cn('flex shrink-0 items-center justify-center rounded-full bg-accent-edge font-semibold text-accent-text', SIZE[size], className)}>
      {initials}
    </span>
  );
}
