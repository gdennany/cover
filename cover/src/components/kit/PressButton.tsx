import type { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';
import { FOCUS_CN } from '@/lib/ui';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

const SIZE_CN = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-5 text-base',
} as const;

const VARIANT_CN = {
  primary: 'bg-accent text-accent-ink hover:bg-accent-text',
  outline: 'border border-line-strong bg-paper text-ink hover:bg-paper-hover',
  danger: 'border border-danger/40 bg-paper text-danger hover:bg-danger-fill',
  ghost: 'text-ink hover:bg-paper-hover',
} as const;

export function PressButton({ variant = 'primary', size = 'md', className, type = 'button', ...props }: Props) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-ctl font-semibold disabled:cursor-not-allowed disabled:opacity-50 [&>svg]:h-4 [&>svg]:w-4',
        VARIANT_CN[variant],
        SIZE_CN[size],
        FOCUS_CN,
        className
      )}
      {...props}
    />
  );
}

/** The same look on an anchor, for tel: and external links. */
export const BUTTON_LINK_CN = {
  outline: `inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-ctl border border-line-strong bg-paper px-4 text-sm font-semibold text-ink hover:bg-paper-hover [&>svg]:h-4 [&>svg]:w-4 ${FOCUS_CN}`,
};
