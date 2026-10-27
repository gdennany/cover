import { useEffect, useRef, type ReactNode } from 'react';
import { X } from 'lucide-react';
import { PanelBar } from './Panel';
import { FOCUS_CN } from '@/lib/ui';
import { cn } from '@/lib/cn';

/** A native dialog styled as a panel. Centered from md; a bottom sheet on phones. */
export function Dialog({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && !el.open) el.showModal();
    if (!open && el.open) el.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={e => {
        if (e.target === ref.current) onClose();
      }}
      className="m-auto w-[calc(100%-2rem)] max-w-md rounded-kit border border-line bg-paper p-0 text-ink max-md:mb-0 max-md:mt-auto max-md:w-full max-md:max-w-none max-md:rounded-b-none"
    >
      <div onClick={e => e.stopPropagation()}>
        <PanelBar
          title={title}
          aside={
            <button type="button" onClick={onClose} aria-label="Close" className={cn('-mr-2 flex h-9 w-9 items-center justify-center rounded-full text-mist hover:bg-paper-hover hover:text-ink', FOCUS_CN)}>
              <X size={18} />
            </button>
          }
        />
        <div className="px-5 py-5 max-md:pb-[max(1.25rem,env(safe-area-inset-bottom))]">{children}</div>
      </div>
    </dialog>
  );
}
