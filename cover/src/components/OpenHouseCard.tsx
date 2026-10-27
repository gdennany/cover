import type { ReactNode } from 'react';
import { ChevronRight } from 'lucide-react';
import { Panel } from '@/components/kit/Panel';
import { StatusChip } from '@/components/kit/StatusChip';
import { TypeTile } from '@/components/kit/TypeTile';
import { TermsStamp } from '@/components/TermsStamp';
import { ListerLine } from '@/components/AgentLine';
import { displayStatus } from '@/lib/derive';
import { MIDDOT, fmtMiles, fmtMoney, fmtWhen } from '@/lib/format';
import { propertyLabel, type Agent, type OpenHouse } from '@/lib/types';
import { FOCUS_CN } from '@/lib/ui';
import { cn } from '@/lib/cn';

export function OpenHouseCard({
  oh,
  now,
  viewer,
  lister,
  onOpen,
  aside,
  children,
}: {
  oh: OpenHouse;
  now: number;
  viewer: Agent;
  lister: Agent;
  onOpen: () => void;
  /** Top-right slot; defaults to the status chip for the lister, distance for a host. */
  aside?: ReactNode;
  children?: ReactNode;
}) {
  const isLister = viewer.id === oh.listerId;
  const status = displayStatus(oh, now);
  return (
    <Panel className="p-4 hover:border-line-strong md:p-5">
      <div className="flex gap-4">
        <TypeTile type={oh.propertyType} />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <button type="button" onClick={onOpen} className={cn('inline-flex items-center gap-0.5 rounded-ctl text-left font-display text-[17px] font-semibold leading-tight text-ink hover:text-accent-text', FOCUS_CN)}>
                {oh.address}
                {oh.unit ? ` ${oh.unit}` : ''}
                <ChevronRight size={16} className="shrink-0 text-mist" />
              </button>
              <p className="mt-0.5 text-sm text-mist">
                {oh.neighborhood} {MIDDOT} {propertyLabel(oh.propertyType)} {MIDDOT} {oh.beds} bd / {oh.baths} ba
              </p>
            </div>
            {aside ?? (isLister ? <StatusChip label={status.label} tone={status.tone} /> : <span className="whitespace-nowrap text-sm tabular-nums text-mist">{fmtMiles(oh.distanceMi)}</span>)}
          </div>
          <p className="mt-2 text-sm text-ink">
            <span className="font-semibold tabular-nums">{fmtMoney(oh.price)}</span> <span className="text-mist">{MIDDOT}</span> {fmtWhen(oh.startsAt, oh.endsAt, now)}
          </p>
          <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1.5">
            <TermsStamp fee={oh.fee} />
            {!isLister ? <ListerLine lister={lister} viewer={viewer} /> : null}
          </div>
          {children}
        </div>
      </div>
    </Panel>
  );
}
