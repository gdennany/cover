import type { ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/cn';
import { ERROR_CN, HELP_CN, LABEL_CN } from '@/lib/ui';

export function Field({
  label,
  htmlFor,
  help,
  error,
  children,
  className,
}: {
  label: ReactNode;
  htmlFor?: string;
  help?: ReactNode;
  error?: string | null;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('min-w-0', className)}>
      <label htmlFor={htmlFor} className={LABEL_CN}>
        {label}
      </label>
      {children}
      {error ? (
        <p className={ERROR_CN} role="alert">
          <AlertTriangle size={14} />
          {error}
        </p>
      ) : help ? (
        <p className={HELP_CN}>{help}</p>
      ) : null}
    </div>
  );
}
