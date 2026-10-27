import { useEffect } from 'react';
import { X } from 'lucide-react';
import { FOCUS_CN } from '@/lib/ui';
import { cn } from '@/lib/cn';

/** One message at a time, gone after a few seconds. */
export function Flash({ message, onClose }: { message: string | null; onClose: () => void }) {
  useEffect(() => {
    if (!message) return;
    const id = window.setTimeout(onClose, 6000);
    return () => window.clearTimeout(id);
  }, [message, onClose]);
  if (!message) return null;
  return (
    <div role="status" className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-lg">
      <div className="flex items-start gap-3 rounded-kit bg-ink px-4 py-3 text-sm font-medium leading-snug text-paper">
        <span className="flex-1">{message}</span>
        <button type="button" onClick={onClose} aria-label="Dismiss" className={cn('-m-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-paper/70 hover:text-paper', FOCUS_CN)}>
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
