import { ShieldCheck, Building2 } from 'lucide-react';
import { Avatar } from '@/components/kit/Avatar';
import { Stamp } from '@/components/kit/Stamp';
import type { Agent } from '@/lib/types';
import { cn } from '@/lib/cn';

/** The listing agent as a host sees them: verified, brokerage, posting record. */
export function ListerLine({ lister, viewer, className }: { lister: Agent; viewer: Agent; className?: string }) {
  const r = lister.listerRecord;
  return (
    <div className={cn('flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-mist', className)}>
      <Avatar initials={lister.initials} size="sm" />
      <span className="font-medium text-ink">{lister.name}</span>
      {lister.licenseStatus === 'verified' ? (
        <Stamp tone="verified">
          <ShieldCheck />
          Verified
        </Stamp>
      ) : (
        <Stamp tone="danger">Unverified</Stamp>
      )}
      {lister.brokerage === viewer.brokerage ? (
        <Stamp tone="accent">
          <Building2 />
          Same brokerage
        </Stamp>
      ) : (
        <span>{lister.brokerage}</span>
      )}
      <span className="tabular-nums">
        {r.posted} posted {String.fromCharCode(0xb7)} {r.lateCancels} late cancel{r.lateCancels === 1 ? '' : 's'}
      </span>
    </div>
  );
}
