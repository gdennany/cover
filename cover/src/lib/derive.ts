import { MIN, fmtTime } from './format';
import type { Agent, AppState, HostRequest, OpenHouse, OpenHouseStatus } from './types';

export type Tone = 'ink' | 'verified' | 'danger' | 'mist' | 'accent';

/** An open post whose start has passed is uncovered; derived, never stored. */
export function effectiveStatus(oh: OpenHouse, now: number): OpenHouseStatus {
  if (oh.status === 'open' && now >= oh.startsAt) return 'uncovered';
  return oh.status;
}

export const NO_CHECKIN_ALERT_MIN = 10;
export const NO_SHOW_MIN = 15;
export const CHECKIN_OPENS_MIN = 30;

export function displayStatus(oh: OpenHouse, now: number): { label: string; tone: Tone } {
  switch (effectiveStatus(oh, now)) {
    case 'open':
      return { label: 'Needs host', tone: 'accent' };
    case 'booked':
      if (now >= oh.startsAt + NO_CHECKIN_ALERT_MIN * MIN) return { label: 'No check-in yet', tone: 'danger' };
      return { label: 'Host approved', tone: 'verified' };
    case 'checkedIn':
      return { label: `Checked in ${fmtTime(oh.checkedInAt ?? now)}`, tone: 'verified' };
    case 'done':
      return { label: 'Done', tone: 'mist' };
    case 'cancelled':
      return { label: 'Cancelled', tone: 'mist' };
    case 'uncovered':
      return { label: 'Uncovered', tone: 'danger' };
  }
}

export const requestsFor = (s: AppState, ohId: string): HostRequest[] =>
  Object.values(s.requests)
    .filter(r => r.openHouseId === ohId && r.status !== 'withdrawn')
    .sort((a, b) => a.createdAt - b.createdAt);

export const pendingFor = (s: AppState, ohId: string) => requestsFor(s, ohId).filter(r => r.status === 'pending');

export const requestBy = (s: AppState, ohId: string, hostId: string): HostRequest | undefined =>
  Object.values(s.requests).find(r => r.openHouseId === ohId && r.hostId === hostId && r.status !== 'withdrawn');

export const overlaps = (a: OpenHouse, b: OpenHouse) => a.startsAt < b.endsAt && b.startsAt < a.endsAt;

/** The open house this host is already committed to in the same window, if any. */
export function hostingConflict(s: AppState, hostId: string, oh: OpenHouse): OpenHouse | null {
  return (
    Object.values(s.openHouses).find(
      o => o.id !== oh.id && o.hostId === hostId && (o.status === 'booked' || o.status === 'checkedIn') && overlaps(o, oh)
    ) ?? null
  );
}

export const sameBrokerage = (a: Agent, b: Agent) => a.brokerage === b.brokerage;
export const hostedForBefore = (host: Agent, lister: Agent) => host.hostedForIds.includes(lister.id);

const byStart = (a: OpenHouse, b: OpenHouse) => a.startsAt - b.startsAt;

export const myOpenHouses = (s: AppState, agentId: string) =>
  Object.values(s.openHouses)
    .filter(o => o.listerId === agentId)
    .sort(byStart);

export const myHosting = (s: AppState, agentId: string) =>
  Object.values(s.openHouses)
    .filter(o => o.hostId === agentId)
    .sort(byStart);

export const myRequests = (s: AppState, agentId: string) =>
  Object.values(s.requests)
    .filter(r => r.hostId === agentId && r.status === 'pending')
    .map(r => ({ request: r, openHouse: s.openHouses[r.openHouseId] }))
    .sort((a, b) => byStart(a.openHouse, b.openHouse));

/** Open houses a host can browse: open, upcoming, not their own. */
export const browsable = (s: AppState, agentId: string, now: number) =>
  Object.values(s.openHouses)
    .filter(o => o.listerId !== agentId && effectiveStatus(o, now) === 'open')
    .sort((a, b) => byStart(a, b) || a.distanceMi - b.distanceMi);

export interface ActionItem {
  key: string;
  text: string;
  ohId: string;
  tone: Tone;
}

/** What needs this persona now, as plain sentences. */
export function actionItems(s: AppState, agentId: string, now: number): ActionItem[] {
  const items: ActionItem[] = [];
  for (const oh of myOpenHouses(s, agentId)) {
    const status = effectiveStatus(oh, now);
    const host = oh.hostId ? s.agents[oh.hostId] : null;
    const pending = pendingFor(s, oh.id).length;
    if (status === 'open' && pending > 0) {
      items.push({ key: `${oh.id}-requests`, ohId: oh.id, tone: 'accent', text: `${pending} agent${pending === 1 ? '' : 's'} want${pending === 1 ? 's' : ''} to host ${oh.address}` });
    } else if (status === 'open' && oh.startsAt - now < 24 * 60 * MIN) {
      items.push({ key: `${oh.id}-empty`, ohId: oh.id, tone: 'danger', text: `No requests yet for ${oh.address}. Consider adding a fee.` });
    } else if (status === 'booked' && host && now >= oh.startsAt + NO_CHECKIN_ALERT_MIN * MIN) {
      items.push({ key: `${oh.id}-nocheckin`, ohId: oh.id, tone: 'danger', text: `${host.name.split(' ')[0]} hasn't checked in at ${oh.address}` });
    } else if (status === 'booked' && host && oh.startsAt - now < 24 * 60 * MIN) {
      items.push({ key: `${oh.id}-today`, ohId: oh.id, tone: 'verified', text: `${host.name.split(' ')[0]} hosts ${oh.address} at ${fmtTime(oh.startsAt)}` });
    } else if (status === 'checkedIn' && host) {
      items.push({ key: `${oh.id}-in`, ohId: oh.id, tone: 'verified', text: `${host.name.split(' ')[0]} checked in at ${oh.address}` });
    }
  }
  for (const oh of myHosting(s, agentId)) {
    const status = effectiveStatus(oh, now);
    if (status === 'booked' && oh.startsAt - now < 24 * 60 * MIN) {
      items.push({ key: `${oh.id}-host`, ohId: oh.id, tone: 'accent', text: `You host ${oh.address} ${now < oh.startsAt ? `at ${fmtTime(oh.startsAt)}` : 'now'}. Check-in opens ${fmtTime(oh.startsAt - CHECKIN_OPENS_MIN * MIN)}.` });
    } else if (status === 'checkedIn') {
      items.push({ key: `${oh.id}-hosting`, ohId: oh.id, tone: 'verified', text: `You're checked in at ${oh.address}. Mark it done when you leave.` });
    }
  }
  const rank: Record<Tone, number> = { danger: 0, accent: 1, verified: 2, ink: 3, mist: 4 };
  return items.sort((a, b) => rank[a.tone] - rank[b.tone]);
}
