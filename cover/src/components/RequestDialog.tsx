import { useState } from 'react';
import { Dialog } from '@/components/kit/Dialog';
import { Field } from '@/components/kit/Field';
import { PressButton } from '@/components/kit/PressButton';
import { TermsStamp } from '@/components/TermsStamp';
import { MIDDOT, fmtMoney, fmtWhen } from '@/lib/format';
import type { Agent, OpenHouse } from '@/lib/types';
import { FIELD_CN } from '@/lib/ui';

export function RequestDialog({ oh, lister, now, open, onClose, onSend }: { oh: OpenHouse | null; lister: Agent | null; now: number; open: boolean; onClose: () => void; onSend: (note: string) => void }) {
  const [note, setNote] = useState('');
  const first = lister?.name.split(' ')[0] ?? 'the listing agent';
  return (
    <Dialog open={open} onClose={onClose} title="Request to host">
      {oh ? (
        <div className="space-y-4">
          <div>
            <p className="font-display text-[17px] font-semibold text-ink">
              {oh.address}
              {oh.unit ? ` ${oh.unit}` : ''}
            </p>
            <p className="text-sm text-mist tabular-nums">
              {fmtWhen(oh.startsAt, oh.endsAt, now)} {MIDDOT} {fmtMoney(oh.price)}
            </p>
            <div className="mt-2">
              <TermsStamp fee={oh.fee} />
            </div>
          </div>
          <Field label={`A note to ${first}`} htmlFor="req-note" help="They see your license, brokerage and track record next to this.">
            <textarea
              id="req-note"
              rows={3}
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="Where you're based, how often you host, anything that helps them pick you."
              className={FIELD_CN}
            />
          </Field>
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <PressButton variant="outline" onClick={onClose}>
              Not now
            </PressButton>
            <PressButton
              onClick={() => {
                onSend(note.trim());
                setNote('');
              }}
            >
              Send request
            </PressButton>
          </div>
        </div>
      ) : null}
    </Dialog>
  );
}
