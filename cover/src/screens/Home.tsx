import type { Dispatch } from 'react';
import { ChevronRight, Plus, Search } from 'lucide-react';
import { OpenHouseCard } from '@/components/OpenHouseCard';
import { PageHead } from '@/components/kit/PageHead';
import { Panel, PanelBar } from '@/components/kit/Panel';
import { PressButton } from '@/components/kit/PressButton';
import { Stamp } from '@/components/kit/Stamp';
import { clockShifted } from '@/lib/clock';
import { MIDDOT, fmtTime } from '@/lib/format';
import { actionItems, myHosting, myOpenHouses, myRequests, pendingFor, type Tone } from '@/lib/derive';
import type { Action } from '@/lib/reducer';
import type { AppState } from '@/lib/types';
import { FOCUS_CN, SECTION_TITLE_CN } from '@/lib/ui';
import { cn } from '@/lib/cn';

const DOT: Record<Tone, string> = { ink: 'bg-ink', verified: 'bg-verified', danger: 'bg-danger', mist: 'bg-mist', accent: 'bg-accent' };

export function Home({ state, now, dispatch }: { state: AppState; now: number; dispatch: Dispatch<Action> }) {
  const me = state.agents[state.personaId];
  const items = actionItems(state, me.id, now);
  const mine = myOpenHouses(state, me.id);
  const upcoming = mine.filter(o => o.endsAt >= now);
  const earlier = mine.filter(o => o.endsAt < now).reverse();
  const hosting = myHosting(state, me.id).filter(o => o.status !== 'done' || o.endsAt >= now - 7 * 24 * 3600_000);
  const requests = myRequests(state, me.id);
  const isLister = mine.length > 0;
  const open = (id: string) => dispatch({ type: 'go', screen: { name: 'openHouse', id } });

  return (
    <div className="space-y-10">
      <PageHead
        kicker={`Home ${MIDDOT} ${me.name}${clockShifted ? ` ${MIDDOT} Demo time ${fmtTime(now)}` : ''}`}
        title={items.length ? `${items.length} thing${items.length === 1 ? '' : 's'} need${items.length === 1 ? 's' : ''} you` : 'Nothing needs you right now'}
        description="Across the open houses you post and the ones you host."
        aside={
          isLister ? (
            <PressButton onClick={() => dispatch({ type: 'go', screen: { name: 'post' } })}>
              <Plus />
              Post an open house
            </PressButton>
          ) : (
            <PressButton onClick={() => dispatch({ type: 'go', screen: { name: 'find' } })}>
              <Search />
              Find open houses
            </PressButton>
          )
        }
      />

      {items.length ? (
        <Panel>
          <PanelBar title="Needs you" />
          <ul className="divide-y divide-line">
            {items.map(item => (
              <li key={item.key}>
                <button
                  type="button"
                  onClick={() => open(item.ohId)}
                  className={cn('flex min-h-12 w-full items-center gap-3 px-5 py-2.5 text-left text-[15px] font-medium text-ink hover:bg-paper-hover', FOCUS_CN)}
                >
                  <span aria-hidden className={cn('h-2 w-2 shrink-0 rounded-full', DOT[item.tone])} />
                  <span className="flex-1">{item.text}</span>
                  <ChevronRight size={16} className="shrink-0 text-mist" />
                </button>
              </li>
            ))}
          </ul>
        </Panel>
      ) : null}

      {upcoming.length ? (
        <section>
          <h2 className={SECTION_TITLE_CN}>Your open houses</h2>
          <div className="mt-3 grid gap-3">
            {upcoming.map(oh => {
              const pending = pendingFor(state, oh.id).length;
              return (
                <OpenHouseCard key={oh.id} oh={oh} now={now} viewer={me} lister={state.agents[oh.listerId]} onOpen={() => open(oh.id)}>
                  {oh.status === 'open' && pending ? (
                    <p className="mt-2 text-sm font-medium text-ink">
                      {pending} request{pending === 1 ? '' : 's'} to host
                    </p>
                  ) : oh.hostId ? (
                    <p className="mt-2 text-sm text-mist">Host: {state.agents[oh.hostId].name}</p>
                  ) : null}
                </OpenHouseCard>
              );
            })}
          </div>
        </section>
      ) : null}

      {hosting.length ? (
        <section>
          <h2 className={SECTION_TITLE_CN}>You're hosting</h2>
          <div className="mt-3 grid gap-3">
            {hosting.map(oh => (
              <OpenHouseCard key={oh.id} oh={oh} now={now} viewer={me} lister={state.agents[oh.listerId]} onOpen={() => open(oh.id)} aside={<Stamp tone={oh.status === 'done' ? 'mist' : 'verified'}>{oh.status === 'done' ? 'Done' : oh.status === 'checkedIn' ? 'Checked in' : 'Approved'}</Stamp>} />
            ))}
          </div>
        </section>
      ) : null}

      {requests.length ? (
        <section>
          <h2 className={SECTION_TITLE_CN}>Your requests</h2>
          <div className="mt-3 grid gap-3">
            {requests.map(({ request, openHouse }) => (
              <OpenHouseCard
                key={request.id}
                oh={openHouse}
                now={now}
                viewer={me}
                lister={state.agents[openHouse.listerId]}
                onOpen={() => open(openHouse.id)}
                aside={<Stamp tone={openHouse.status === 'booked' ? 'mist' : 'accent'}>{openHouse.status === 'booked' ? 'On the waitlist' : 'Requested'}</Stamp>}
              />
            ))}
          </div>
        </section>
      ) : null}

      {earlier.length ? (
        <section>
          <h2 className={SECTION_TITLE_CN}>Earlier</h2>
          <div className="mt-3 grid gap-3">
            {earlier.map(oh => (
              <OpenHouseCard key={oh.id} oh={oh} now={now} viewer={me} lister={state.agents[oh.listerId]} onOpen={() => open(oh.id)}>
                {oh.hostId ? <p className="mt-2 text-sm text-mist">Hosted by {state.agents[oh.hostId].name}</p> : null}
              </OpenHouseCard>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
