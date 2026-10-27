import { useState, type Dispatch, type ReactNode } from 'react';
import { AlertTriangle, Check, ChevronLeft, Lock, MapPin, Phone } from 'lucide-react';
import { HostCard } from '@/components/HostCard';
import { ListerLine } from '@/components/AgentLine';
import { RequestDialog } from '@/components/RequestDialog';
import { TermsStamp, termsSentence, termsSentenceHost } from '@/components/TermsStamp';
import { Avatar } from '@/components/kit/Avatar';
import { Dialog } from '@/components/kit/Dialog';
import { TypeTile } from '@/components/kit/TypeTile';
import { Band, Panel, PanelBar } from '@/components/kit/Panel';
import { BUTTON_LINK_CN, PressButton } from '@/components/kit/PressButton';
import { Stamp } from '@/components/kit/Stamp';
import { StatusChip } from '@/components/kit/StatusChip';
import { NO_CHECKIN_ALERT_MIN, NO_SHOW_MIN, displayStatus, effectiveStatus, pendingFor, requestBy, requestsFor } from '@/lib/derive';
import { MIDDOT, MIN, fmtMoney, fmtTime, fmtWhen } from '@/lib/format';
import { canApprove, canCheckIn, canHostCancel, canListerCancel, canMarkNoShow, canRequest, isLate, type Action } from '@/lib/reducer';
import { propertyLabel, type Agent, type AppState, type OpenHouse } from '@/lib/types';
import { INLINE_LINK_CN, KICKER_CN } from '@/lib/ui';
import { cn } from '@/lib/cn';

const first = (a: Agent) => a.name.split(' ')[0];
const tel = (a: Agent) => `tel:${a.phone.replace(/\D/g, '')}`;

export function OpenHouseScreen({ state, id, now, dispatch }: { state: AppState; id: string; now: number; dispatch: Dispatch<Action> }) {
  const oh = state.openHouses[id];
  const me = state.agents[state.personaId];
  if (!oh) {
    return (
      <Panel className="p-6">
        <p className="font-bold">That open house isn't here anymore.</p>
      </Panel>
    );
  }
  const lister = state.agents[oh.listerId];
  const isLister = me.id === oh.listerId;
  const status = displayStatus(oh, now);

  return (
    <div className="space-y-6">
      <button type="button" onClick={() => dispatch({ type: 'go', screen: { name: 'home' } })} className={cn('inline-flex min-h-9 items-center gap-0.5 text-sm no-underline hover:underline', INLINE_LINK_CN)}>
        <ChevronLeft size={16} />
        Home
      </button>

      <Panel>
        <div className="flex gap-4 p-5">
          <TypeTile type={oh.propertyType} size="lg" className="max-sm:hidden" />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="min-w-0">
                <p className={KICKER_CN}>
                  {oh.neighborhood} {MIDDOT} {propertyLabel(oh.propertyType)}
                </p>
                <h1 className="mt-0.5 font-display text-2xl font-semibold leading-tight tracking-tight text-ink">
                  {oh.address}
                  {oh.unit ? ` ${oh.unit}` : ''}
                </h1>
              </div>
              <StatusChip label={status.label} tone={status.tone} className="mt-1" />
            </div>
            <p className="mt-2 text-[15px] text-ink">
              <span className="font-semibold tabular-nums">{fmtMoney(oh.price)}</span> {MIDDOT} {oh.beds} bd / {oh.baths} ba {MIDDOT} {fmtWhen(oh.startsAt, oh.endsAt, now, true)}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5">
              <TermsStamp fee={oh.fee} />
              {isLister ? <span className="text-sm text-mist">{termsSentence(oh.fee)}</span> : <ListerLine lister={lister} viewer={me} />}
            </div>
          </div>
        </div>
      </Panel>

      {isLister ? <ListerBody state={state} oh={oh} me={me} now={now} dispatch={dispatch} /> : <HostBody state={state} oh={oh} me={me} lister={lister} now={now} dispatch={dispatch} />}
    </div>
  );
}

function AccessPanel({ oh, host, viewerIsHost, dispatch, now }: { oh: OpenHouse; host: Agent | null; viewerIsHost: boolean; dispatch: Dispatch<Action>; now: number }) {
  return (
    <Panel>
      <PanelBar
        title={
          <span className="flex items-center gap-1.5">
            <Lock size={14} className="text-mist" />
            Access details
          </span>
        }
        aside={<Stamp tone="mist">Private</Stamp>}
      />
      <div className="p-5 text-sm">
        {viewerIsHost ? (
          oh.accessViewedAt ? (
            <>
              <p className="text-[15px] font-medium leading-relaxed text-ink">{oh.access}</p>
              <p className="mt-2 text-[13px] text-mist">The listing agent can see you viewed this at {fmtTime(oh.accessViewedAt)}.</p>
            </>
          ) : (
            <>
              <p className="text-sm text-mist">Shared with you only. Viewing is logged, so the listing agent knows you have it.</p>
              <PressButton variant="outline" size="sm" className="mt-3" onClick={() => dispatch({ type: 'viewAccess', ohId: oh.id, now })}>
                <Lock />
                Show access details
              </PressButton>
            </>
          )
        ) : (
          <>
            <p className="text-[15px] font-medium leading-relaxed text-ink">{oh.access}</p>
            <p className="mt-2 text-[13px] text-mist">
              {host ? (oh.accessViewedAt ? `Sent to ${first(host)} only. Viewed at ${fmtTime(oh.accessViewedAt)}.` : `Sent to ${first(host)} only. Not viewed yet.`) : 'Shown only to the host you approve.'}
            </p>
          </>
        )}
      </div>
    </Panel>
  );
}

function NotesPanel({ oh, lister }: { oh: OpenHouse; lister: Agent }) {
  if (!oh.notes) return null;
  return (
    <Panel>
      <PanelBar title={`Notes from ${first(lister)}`} />
      <p className="p-5 text-[15px] leading-relaxed text-ink">{oh.notes}</p>
    </Panel>
  );
}

function ListerBody({ state, oh, me, now, dispatch }: { state: AppState; oh: OpenHouse; me: Agent; now: number; dispatch: Dispatch<Action> }) {
  const status = effectiveStatus(oh, now);
  const host = oh.hostId ? state.agents[oh.hostId] : null;
  const requests = requestsFor(state, oh.id);
  const pending = pendingFor(state, oh.id);
  const [confirmCancel, setConfirmCancel] = useState(false);
  const cancelReason = canListerCancel(oh, now);
  const late = host !== null && isLate(oh, now);

  const cancelDialog = (
    <Dialog open={confirmCancel} onClose={() => setConfirmCancel(false)} title="Cancel this open house?">
      <p className="text-sm text-ink">
        {host ? `${first(host)} will be told right away.` : pending.length ? `The ${pending.length} agent${pending.length === 1 ? '' : 's'} who requested will be told.` : 'It comes off the feed right away.'}
      </p>
      {late ? <p className="mt-2 text-sm font-medium text-danger">This is inside 24 hours, so it shows on your record as a late cancel.</p> : null}
      <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <PressButton variant="outline" onClick={() => setConfirmCancel(false)}>
          Keep it
        </PressButton>
        <PressButton
          variant="danger"
          onClick={() => {
            dispatch({ type: 'listerCancel', ohId: oh.id, now });
            setConfirmCancel(false);
          }}
        >
          Cancel open house
        </PressButton>
      </div>
    </Dialog>
  );

  const footer = !cancelReason ? (
    <div className="flex justify-end border-t border-line pt-4">
      <PressButton variant="danger" size="sm" onClick={() => setConfirmCancel(true)}>
        Cancel open house
      </PressButton>
    </div>
  ) : null;

  if (status === 'open') {
    return (
      <div className="space-y-6">
        <div>
          <p className={KICKER_CN}>Requests to host</p>
          <h2 className="mt-1 font-display text-xl font-semibold tracking-tight text-ink">{pending.length ? `${pending.length} agent${pending.length === 1 ? '' : 's'} want${pending.length === 1 ? 's' : ''} to host` : 'No requests yet'}</h2>
          {pending.length ? <p className="mt-1 text-sm text-mist">You pick. Access details go only to the host you approve; the rest stay on a waitlist in case anything changes.</p> : null}
        </div>

        {pending.length === 0 ? (
          <Panel className="p-5">
            <p className="text-[15px] leading-relaxed text-ink">Verified agents within 10 miles were notified when you posted. Most posts get a first request within a day.</p>
            <p className="mt-2 text-sm leading-relaxed text-mist">If it's still empty 24 hours before the start, adding a fee usually helps: hosts can filter to paid open houses.</p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              {oh.fee ? (
                <span className="text-sm font-medium">${oh.fee} fee is on the post.</span>
              ) : (
                <PressButton size="sm" onClick={() => dispatch({ type: 'setFee', ohId: oh.id, fee: 100 })}>
                  Add a $100 fee
                </PressButton>
              )}
            </div>
          </Panel>
        ) : null}

        <div className="grid gap-4">
          {requests.map(req => {
            const h = state.agents[req.hostId];
            const reason = req.status === 'pending' ? canApprove(state, oh.id, req.id, now) : null;
            return (
              <HostCard
                key={req.id}
                host={h}
                lister={me}
                note={req.note}
                actions={
                  req.status === 'pending' ? (
                    <>
                      {reason ? (
                        <span className="mr-auto flex items-center gap-1.5 text-sm font-medium text-danger">
                          <AlertTriangle size={14} />
                          {reason}
                        </span>
                      ) : null}
                      <PressButton variant="outline" size="sm" onClick={() => dispatch({ type: 'decline', reqId: req.id })}>
                        Decline
                      </PressButton>
                      <PressButton size="sm" disabled={!!reason} onClick={() => dispatch({ type: 'approve', ohId: oh.id, reqId: req.id, now })}>
                        <Check />
                        Approve {first(h)}
                      </PressButton>
                    </>
                  ) : (
                    <Stamp tone="mist">{req.status === 'declined' ? 'Declined' : req.status}</Stamp>
                  )
                }
              />
            );
          })}
        </div>

        <AccessPanel oh={oh} host={null} viewerIsHost={false} dispatch={dispatch} now={now} />
        {footer}
        {cancelDialog}
      </div>
    );
  }

  if (status === 'booked' && host) {
    const alert = now >= oh.startsAt + NO_CHECKIN_ALERT_MIN * MIN;
    const noShowReason = canMarkNoShow(oh, now);
    return (
      <div className="space-y-6">
        <Panel>
          {alert ? (
            <Band tone="danger">
              <AlertTriangle size={16} className="mt-0.5 shrink-0" />
              <span>
                No check-in from {first(host)} yet. Call them. If they're not at the door by {fmtTime(oh.startsAt + NO_SHOW_MIN * MIN)} you can mark a no-show, which goes on their record and to a person for review.
              </span>
            </Band>
          ) : (
            <Band tone="verified">
              <Check size={16} className="mt-0.5 shrink-0" />
              <span>
                {first(host)} is hosting. You'll be told the moment they check in at the door{now < oh.startsAt ? `, from ${fmtTime(oh.startsAt - 30 * MIN)}` : ''}.
              </span>
            </Band>
          )}
          <div className="p-5">
            <HostCard host={host} lister={me} phone note={requestBy(state, oh.id, host.id)?.note} />
            {alert ? (
              <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <a href={tel(host)} className={BUTTON_LINK_CN.outline}>
                  <Phone size={16} />
                  Call {first(host)}
                </a>
                <PressButton variant="danger" disabled={!!noShowReason} title={noShowReason ?? undefined} onClick={() => dispatch({ type: 'markNoShow', ohId: oh.id, now })}>
                  Mark no-show
                </PressButton>
              </div>
            ) : null}
            {alert && noShowReason ? <p className="mt-2 text-right text-[13px] text-mist">{noShowReason}</p> : null}
          </div>
        </Panel>

        <AccessPanel oh={oh} host={host} viewerIsHost={false} dispatch={dispatch} now={now} />

        {pending.length ? (
          <Panel>
            <PanelBar title={`${pending.length} on the waitlist`} />
            <ul className="divide-y divide-line">
              {pending.map(req => {
                const h = state.agents[req.hostId];
                return (
                  <li key={req.id} className="flex items-center gap-3 px-5 py-3 text-sm">
                    <Avatar initials={h.initials} size="sm" />
                    <span className="font-medium text-ink">{h.name}</span>
                    <span className="text-mist">{h.brokerage}</span>
                    <span className="ml-auto text-sm tabular-nums text-mist">{h.hostRecord.hosted ? `${h.hostRecord.hosted} hosted` : 'New host'}</span>
                  </li>
                );
              })}
            </ul>
            <p className="border-t border-line px-5 py-3 text-sm text-mist">If {first(host)} cancels, this post reopens and you can approve one of them in one tap.</p>
          </Panel>
        ) : null}
        {footer}
        {cancelDialog}
      </div>
    );
  }

  if (status === 'checkedIn' && host) {
    return (
      <div className="space-y-6">
        <Panel>
          <Band tone="verified">
            <Check size={16} className="mt-0.5 shrink-0" />
            <span>
              {first(host)} checked in at {fmtTime(oh.checkedInAt ?? now)}. They'll mark it done when they leave.
            </span>
          </Band>
          <div className="p-5">
            <HostCard host={host} lister={me} phone />
          </div>
        </Panel>
        <AccessPanel oh={oh} host={host} viewerIsHost={false} dispatch={dispatch} now={now} />
      </div>
    );
  }

  if (status === 'done' && host) {
    return (
      <div className="space-y-6">
        <Panel>
          <Band tone="mist">
            <Check size={16} className="mt-0.5 shrink-0" />
            <span>
              Done. {first(host)} checked in at {fmtTime(oh.checkedInAt ?? oh.startsAt)} and finished at {fmtTime(oh.doneAt ?? oh.endsAt)}. Change the lockbox code now that the open house is over.
            </span>
          </Band>
          <div className="p-5">
            <HostCard host={host} lister={me} actions={<PressButton variant="outline" size="sm" onClick={() => dispatch({ type: 'flash', message: 'Ratings are the next thing on the build list; not in this demo yet.' })}>Rate {first(host)}</PressButton>} />
          </div>
        </Panel>
      </div>
    );
  }

  return (
    <Panel>
      <Band tone={status === 'uncovered' ? 'danger' : 'mist'}>
        {status === 'uncovered' ? <AlertTriangle size={16} className="mt-0.5 shrink-0" /> : null}
        <span>
          {status === 'uncovered'
            ? host
              ? `${first(host)} didn't check in. It's on their record and a person will review it.`
              : 'No host was approved before the start time.'
            : 'Cancelled.'}
        </span>
      </Band>
      {host ? (
        <div className="p-5">
          <HostCard host={host} lister={me} phone />
        </div>
      ) : null}
    </Panel>
  );
}

function HostBody({ state, oh, me, lister, now, dispatch }: { state: AppState; oh: OpenHouse; me: Agent; lister: Agent; now: number; dispatch: Dispatch<Action> }) {
  const status = effectiveStatus(oh, now);
  const myReq = requestBy(state, oh.id, me.id);
  const [requesting, setRequesting] = useState(false);

  if (oh.hostId === me.id) return <DayOf state={state} oh={oh} me={me} lister={lister} now={now} dispatch={dispatch} />;

  let body: ReactNode;
  if (myReq?.status === 'pending' && status === 'open') {
    body = (
      <Panel>
        <Band tone="accent">
          <span>Requested. {first(lister)} will pick a host, and you'll hear as soon as they decide.</span>
        </Band>
        <div className="flex items-center justify-between gap-3 p-5">
          <p className="text-sm text-mist">{termsSentenceHost(oh.fee)}</p>
          <PressButton variant="outline" size="sm" onClick={() => dispatch({ type: 'withdraw', reqId: myReq.id })}>
            Withdraw
          </PressButton>
        </div>
      </Panel>
    );
  } else if (myReq?.status === 'pending' && status === 'booked') {
    body = (
      <Panel>
        <Band tone="mist">
          <span>Filled. You're on the waitlist, next in line if anything changes.</span>
        </Band>
        <div className="flex justify-end p-5">
          <PressButton variant="outline" size="sm" onClick={() => dispatch({ type: 'withdraw', reqId: myReq.id })}>
            Leave the waitlist
          </PressButton>
        </div>
      </Panel>
    );
  } else if (myReq?.status === 'declined') {
    body = (
      <Panel>
        <Band tone="mist">
          <span>{first(lister)} chose another host for this one.</span>
        </Band>
      </Panel>
    );
  } else if (myReq?.status === 'withdrawn' || (myReq?.status === 'approved' && oh.hostId !== me.id)) {
    body = (
      <Panel>
        <Band tone="mist">
          <span>You're no longer hosting this one.</span>
        </Band>
      </Panel>
    );
  } else if (status === 'open' || status === 'booked') {
    const reason = canRequest(state, oh.id, me.id, now);
    body = (
      <Panel>
        <div className="p-5">
          <p className="text-[15px] font-medium text-ink">{termsSentenceHost(oh.fee)}</p>
          <p className="mt-1 text-sm text-mist">
            {status === 'booked' ? 'This one has a host. You can join the waitlist in case they cancel.' : `${first(lister)} picks the host. They'll see your license, brokerage and track record with your note.`}
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
            {reason ? (
              <span className="flex items-center gap-1.5 text-sm font-medium text-danger">
                <AlertTriangle size={14} />
                {reason}
              </span>
            ) : (
              <span />
            )}
            <PressButton disabled={!!reason} onClick={() => setRequesting(true)}>
              {status === 'booked' ? 'Join the waitlist' : 'Request to host'}
            </PressButton>
          </div>
        </div>
      </Panel>
    );
  } else {
    body = (
      <Panel>
        <Band tone="mist">
          <span>This open house isn't taking requests.</span>
        </Band>
      </Panel>
    );
  }

  return (
    <div className="space-y-6">
      {body}
      <RequestDialog
        oh={oh}
        lister={lister}
        now={now}
        open={requesting}
        onClose={() => setRequesting(false)}
        onSend={note => {
          dispatch({ type: 'request', ohId: oh.id, hostId: me.id, note, now });
          setRequesting(false);
        }}
      />
    </div>
  );
}

function DayOf({ state, oh, me, lister, now, dispatch }: { state: AppState; oh: OpenHouse; me: Agent; lister: Agent; now: number; dispatch: Dispatch<Action> }) {
  const [confirmCancel, setConfirmCancel] = useState(false);
  const checkInReason = canCheckIn(oh, now);
  const cancelReason = canHostCancel(oh, now);
  const late = isLate(oh, now);
  const waitlist = pendingFor(state, oh.id).length;
  // Steps 1..3; everything below `step` is done, `step` itself is current.
  const step = oh.status === 'done' ? 4 : oh.status === 'checkedIn' ? 3 : 2;
  const status = displayStatus(oh, now);
  const STEPS = ['Approved', 'Checked in', 'Done'];

  return (
    <div className="mx-auto w-full max-w-md space-y-4">
      <Panel>
        <PanelBar title={fmtWhen(oh.startsAt, oh.endsAt, now)} aside={<StatusChip label={status.label} tone={status.tone} />} />
        <div className="p-5">
          <h2 className="font-display text-xl font-semibold leading-tight tracking-tight text-ink">
            {oh.address}
            {oh.unit ? ` ${oh.unit}` : ''}
          </h2>
          <p className="mt-1 text-sm text-mist">
            Hosting for <span className="font-medium text-ink">{lister.name}</span> {MIDDOT}{' '}
            <a href={tel(lister)} className={INLINE_LINK_CN}>
              <Phone size={12} className="mr-1 inline" />
              Call
            </a>
          </p>
          <ol className="mt-5 grid grid-cols-3 gap-1">
            {STEPS.map((label, i) => {
              const n = i + 1;
              const done = n < step;
              const current = n === step;
              return (
                <li key={label} className="flex flex-col items-center gap-1.5 text-center">
                  <span aria-hidden className={cn('flex h-7 w-7 items-center justify-center rounded-full border text-xs font-semibold', done ? 'border-verified bg-verified text-paper' : current ? 'border-accent bg-accent-edge text-accent-text' : 'border-line bg-paper text-mist')}>
                    {done ? <Check size={14} /> : n}
                  </span>
                  <span className={cn('text-xs font-medium', done || current ? 'text-ink' : 'text-mist')}>{label}</span>
                </li>
              );
            })}
          </ol>
        </div>
        {oh.status === 'booked' && now >= oh.startsAt + NO_CHECKIN_ALERT_MIN * MIN ? (
          <Band tone="danger" className="border-b-0 border-t">
            <AlertTriangle size={16} className="mt-0.5 shrink-0" />
            <span>You haven't checked in and {first(lister)} has been alerted. Check in now, or call them.</span>
          </Band>
        ) : null}
        {oh.status === 'checkedIn' ? (
          <Band tone="verified" className="border-b-0 border-t">
            <Check size={16} className="mt-0.5 shrink-0" />
            <span>
              Checked in at {fmtTime(oh.checkedInAt ?? now)}. {first(lister)} can see you're here. Mark it done when you leave.
            </span>
          </Band>
        ) : null}
        {oh.status === 'done' ? (
          <Band tone="mist" className="border-b-0 border-t">
            <Check size={16} className="mt-0.5 shrink-0" />
            <span>Done at {fmtTime(oh.doneAt ?? now)}. The leads are yours.</span>
          </Band>
        ) : null}
      </Panel>

      <AccessPanel oh={oh} host={me} viewerIsHost dispatch={dispatch} now={now} />
      <NotesPanel oh={oh} lister={lister} />

      <p className="text-center text-sm text-mist">{termsSentenceHost(oh.fee)}</p>

      <div className="space-y-2">
        {oh.status === 'booked' ? (
          <>
            <PressButton size="lg" className="w-full" disabled={!!checkInReason} onClick={() => dispatch({ type: 'checkIn', ohId: oh.id, now })}>
              <MapPin />
              Check in at the door
            </PressButton>
            {checkInReason ? <p className="text-center text-[13px] text-mist">{checkInReason}</p> : null}
          </>
        ) : null}
        {oh.status === 'checkedIn' ? (
          <PressButton size="lg" className="w-full" onClick={() => dispatch({ type: 'markDone', ohId: oh.id, now })}>
            <Check />
            Mark done
          </PressButton>
        ) : null}
        {oh.status === 'done' ? (
          <PressButton variant="outline" size="lg" className="w-full" onClick={() => dispatch({ type: 'flash', message: 'Ratings are the next thing on the build list; not in this demo yet.' })}>
            Rate {first(lister)}
          </PressButton>
        ) : null}
        {oh.status === 'booked' && !cancelReason ? (
          <PressButton variant="danger" size="sm" className="w-full" onClick={() => setConfirmCancel(true)}>
            Can't make it? Cancel
          </PressButton>
        ) : null}
        <p className="pt-2 text-center text-sm text-mist">
          Something wrong?{' '}
          <button type="button" className={INLINE_LINK_CN} onClick={() => dispatch({ type: 'flash', message: 'Reports go to a person for review. In this demo, that stops here.' })}>
            Report it
          </button>
        </p>
      </div>

      <Dialog open={confirmCancel} onClose={() => setConfirmCancel(false)} title="Cancel hosting?">
        <p className="text-sm text-ink">
          {first(lister)} will be told right away{waitlist ? ` and can approve one of ${waitlist} waitlisted agent${waitlist === 1 ? '' : 's'}` : ''}.
        </p>
        {late ? <p className="mt-2 text-sm font-medium text-danger">This is inside 24 hours, so it shows on your record as a late cancel.</p> : null}
        <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <PressButton variant="outline" onClick={() => setConfirmCancel(false)}>
            Keep hosting
          </PressButton>
          <PressButton
            variant="danger"
            onClick={() => {
              dispatch({ type: 'hostCancel', ohId: oh.id, now });
              setConfirmCancel(false);
            }}
          >
            Cancel hosting
          </PressButton>
        </div>
      </Dialog>
    </div>
  );
}

