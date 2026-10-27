import { useState, type Dispatch } from 'react';
import { AlertTriangle } from 'lucide-react';
import { OpenHouseCard } from '@/components/OpenHouseCard';
import { RequestDialog } from '@/components/RequestDialog';
import { Chip } from '@/components/kit/Chip';
import { PageHead } from '@/components/kit/PageHead';
import { Panel } from '@/components/kit/Panel';
import { PressButton } from '@/components/kit/PressButton';
import { Stamp } from '@/components/kit/Stamp';
import { browsable, requestBy } from '@/lib/derive';
import { DAY, isWeekend } from '@/lib/format';
import { canRequest, type Action } from '@/lib/reducer';
import { PROPERTY_TYPES, type AppState, type PropertyType } from '@/lib/types';
import { KICKER_CN } from '@/lib/ui';

type When = 'any' | 'today' | 'weekend';

export function Find({ state, now, dispatch }: { state: AppState; now: number; dispatch: Dispatch<Action> }) {
  const me = state.agents[state.personaId];
  const [when, setWhen] = useState<When>('any');
  const [within, setWithin] = useState(5);
  const [paidOnly, setPaidOnly] = useState(false);
  const [types, setTypes] = useState<PropertyType[]>([]);
  const [requesting, setRequesting] = useState<string | null>(null);

  const sameDay = (a: number, b: number) => new Date(a).toDateString() === new Date(b).toDateString();
  const list = browsable(state, me.id, now).filter(oh => {
    if (when === 'today' && !sameDay(oh.startsAt, now)) return false;
    if (when === 'weekend' && !(isWeekend(oh.startsAt) && oh.startsAt - now < 7 * DAY)) return false;
    if (oh.distanceMi > within) return false;
    if (paidOnly && !oh.fee) return false;
    if (types.length && !types.includes(oh.propertyType)) return false;
    return true;
  });

  const toggleType = (t: PropertyType) => setTypes(ts => (ts.includes(t) ? ts.filter(x => x !== t) : [...ts, t]));
  const open = (id: string) => dispatch({ type: 'go', screen: { name: 'openHouse', id } });
  const target = requesting ? state.openHouses[requesting] : null;

  return (
    <div className="space-y-6">
      <PageHead kicker="Find open houses" title="Open houses that need a host" description="Sorted by time, then distance. Each one says what kind of buyers to expect and what you get for hosting." />

      <Panel className="p-5">
        <div className="grid gap-4 md:grid-cols-[auto_1fr] md:gap-x-6 md:gap-y-3">
          <span className={KICKER_CN}>When</span>
          <div className="flex flex-wrap gap-2">
            {(
              [
                ['any', 'Any day'],
                ['today', 'Today'],
                ['weekend', 'This weekend'],
              ] as const
            ).map(([v, label]) => (
              <Chip key={v} on={when === v} onClick={() => setWhen(v)}>
                {label}
              </Chip>
            ))}
          </div>
          <span className={KICKER_CN}>Within</span>
          <div className="flex flex-wrap gap-2">
            {[2, 5, 10].map(mi => (
              <Chip key={mi} on={within === mi} onClick={() => setWithin(mi)}>
                {mi} mi
              </Chip>
            ))}
          </div>
          <span className={KICKER_CN}>Pay</span>
          <div className="flex flex-wrap gap-2">
            <Chip on={paidOnly} onClick={() => setPaidOnly(p => !p)}>
              Paid only
            </Chip>
          </div>
          <span className={KICKER_CN}>Type</span>
          <div className="flex flex-wrap gap-2">
            {PROPERTY_TYPES.map(t => (
              <Chip key={t.value} on={types.includes(t.value)} onClick={() => toggleType(t.value)}>
                {t.label}
              </Chip>
            ))}
          </div>
        </div>
      </Panel>

      <p className="text-sm font-medium text-mist tabular-nums">
        {list.length} open house{list.length === 1 ? '' : 's'} within {within} mi
      </p>

      {list.length === 0 ? (
        <Panel className="p-8 text-center">
          <p className="font-semibold text-ink">Nothing matches right now.</p>
          <p className="mt-1 text-sm text-mist">Widen the distance or clear a filter. New posts show up here as soon as a listing agent needs a host.</p>
        </Panel>
      ) : (
        <div className="grid gap-3">
          {list.map(oh => {
            const req = requestBy(state, oh.id, me.id);
            const reason = canRequest(state, oh.id, me.id, now);
            return (
              <OpenHouseCard key={oh.id} oh={oh} now={now} viewer={me} lister={state.agents[oh.listerId]} onOpen={() => open(oh.id)}>
                <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                  {req?.status === 'pending' ? (
                    <>
                      <Stamp tone="accent">Requested</Stamp>
                      <PressButton variant="outline" size="sm" onClick={() => dispatch({ type: 'withdraw', reqId: req.id })}>
                        Withdraw
                      </PressButton>
                    </>
                  ) : req?.status === 'declined' ? (
                    <Stamp tone="mist">Not chosen</Stamp>
                  ) : reason ? (
                    <>
                      <span className="flex items-center gap-1.5 text-sm font-medium text-danger">
                        <AlertTriangle size={14} />
                        {reason}
                      </span>
                      <PressButton size="sm" disabled>
                        Request to host
                      </PressButton>
                    </>
                  ) : (
                    <>
                      <span />
                      <PressButton size="sm" onClick={() => setRequesting(oh.id)}>
                        Request to host
                      </PressButton>
                    </>
                  )}
                </div>
              </OpenHouseCard>
            );
          })}
        </div>
      )}

      <RequestDialog
        oh={target}
        lister={target ? state.agents[target.listerId] : null}
        now={now}
        open={requesting !== null}
        onClose={() => setRequesting(null)}
        onSend={note => {
          if (target) dispatch({ type: 'request', ohId: target.id, hostId: me.id, note, now });
          setRequesting(null);
        }}
      />
    </div>
  );
}
