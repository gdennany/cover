import type { ReactNode } from 'react';
import { Building2, History, Phone, ShieldCheck, Star } from 'lucide-react';
import { Avatar } from '@/components/kit/Avatar';
import { Legend, type LegendRow } from '@/components/kit/Legend';
import { Panel } from '@/components/kit/Panel';
import { Stamp } from '@/components/kit/Stamp';
import { hostedForBefore, sameBrokerage } from '@/lib/derive';
import { MIDDOT } from '@/lib/format';
import type { Agent } from '@/lib/types';
import { INLINE_LINK_CN } from '@/lib/ui';

/**
 * The host as the listing agent sees them (product doc, "Facilitate Trust"): license,
 * brokerage, the raw track record, their note. No composite score.
 */
export function HostCard({ host, lister, note, actions, phone = false }: { host: Agent; lister: Agent; note?: string; actions?: ReactNode; phone?: boolean }) {
  const r = host.hostRecord;
  const isNew = r.hosted === 0;
  const rows: LegendRow[] = [];
  if (!isNew) {
    rows.push({ key: 'hosted', label: 'Hosted on Cover', value: r.hosted });
    rows.push({ key: 'noshow', label: 'No-shows', value: r.noShows, tone: r.noShows > 0 ? 'danger' : 'verified' });
    rows.push({ key: 'late', label: 'Late cancels', value: r.lateCancels, tone: r.lateCancels > 0 ? 'danger' : 'verified' });
  }
  if (r.rating !== null) {
    rows.push({
      key: 'rating',
      label: `Rating from ${r.ratingCount} listing agent${r.ratingCount === 1 ? '' : 's'}`,
      value: (
        <span className="inline-flex items-center gap-1">
          <Star size={14} className="fill-current" />
          {r.rating.toFixed(1)}
        </span>
      ),
    });
  }
  rows.push({ key: 'years', label: 'Years licensed', value: host.yearsLicensed });

  return (
    <Panel className="p-5">
      <div className="flex items-start gap-3">
        <Avatar initials={host.initials} />
        <div className="min-w-0 flex-1">
          <h3 className="font-display text-[17px] font-semibold leading-tight text-ink">{host.name}</h3>
          <p className="mt-0.5 text-sm text-mist">
            {host.brokerage}
            {phone ? (
              <>
                {' '}
                {MIDDOT}{' '}
                <a href={`tel:${host.phone.replace(/\D/g, '')}`} className={INLINE_LINK_CN}>
                  <Phone size={12} className="mr-1 inline" />
                  {host.phone}
                </a>
              </>
            ) : null}
          </p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {host.licenseStatus === 'verified' ? (
          <Stamp tone="verified">
            <ShieldCheck />
            NY license verified
          </Stamp>
        ) : (
          <Stamp tone="danger">License {host.licenseStatus}</Stamp>
        )}
        {sameBrokerage(host, lister) ? (
          <Stamp tone="accent">
            <Building2 />
            Same brokerage
          </Stamp>
        ) : null}
        {hostedForBefore(host, lister) ? (
          <Stamp tone="accent">
            <History />
            Hosted for you before
          </Stamp>
        ) : null}
        {isNew ? <Stamp tone="mist">New host</Stamp> : null}
      </div>

      {isNew ? (
        <p className="mt-3 text-sm leading-relaxed text-mist">
          New host, no open houses on Cover yet. What you can go on: a verified license, {host.yearsLicensed} year{host.yearsLicensed === 1 ? '' : 's'} licensed, their brokerage, and their note.
        </p>
      ) : null}

      <Legend rows={rows} className="mt-4 border-t border-line pt-4" />

      {note ? <p className="mt-4 rounded-ctl bg-ground px-4 py-3 text-sm leading-relaxed text-ink">{`“${note}”`}</p> : null}

      {actions ? <div className="mt-4 flex flex-wrap items-center justify-end gap-2">{actions}</div> : null}
    </Panel>
  );
}
