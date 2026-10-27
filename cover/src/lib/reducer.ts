import { CHECKIN_OPENS_MIN, NO_SHOW_MIN, effectiveStatus, hostingConflict, pendingFor, requestBy } from './derive';
import { HOUR, MIN, fmtTime } from './format';
import { makeSeed } from './seed';
import type { AppState, OpenHouse, Screen } from './types';

export type PostInput = Pick<
  OpenHouse,
  'address' | 'unit' | 'neighborhood' | 'propertyType' | 'price' | 'beds' | 'baths' | 'startsAt' | 'endsAt' | 'fee' | 'notes' | 'access' | 'sellerOk'
>;

export type Action =
  | { type: 'setPersona'; id: string }
  | { type: 'go'; screen: Screen }
  | { type: 'reset'; now: number }
  | { type: 'flash'; message: string | null }
  | { type: 'post'; input: PostInput; now: number }
  | { type: 'setFee'; ohId: string; fee: number | null }
  | { type: 'request'; ohId: string; hostId: string; note: string; now: number }
  | { type: 'withdraw'; reqId: string }
  | { type: 'approve'; ohId: string; reqId: string; now: number }
  | { type: 'decline'; reqId: string }
  | { type: 'hostCancel'; ohId: string; now: number }
  | { type: 'listerCancel'; ohId: string; now: number }
  | { type: 'checkIn'; ohId: string; now: number }
  | { type: 'markDone'; ohId: string; now: number }
  | { type: 'markNoShow'; ohId: string; now: number }
  | { type: 'viewAccess'; ohId: string; now: number };

// Guards return the reason an action is blocked, or null when it can run.
// The UI shows the reason; the reducer re-checks before applying.

export function canRequest(s: AppState, ohId: string, hostId: string, now: number): string | null {
  const oh = s.openHouses[ohId];
  const host = s.agents[hostId];
  if (host.licenseStatus !== 'verified') return 'Verify your license to request to host.';
  if (oh.listerId === hostId) return 'This is your own open house.';
  const status = effectiveStatus(oh, now);
  if (status !== 'open' && status !== 'booked') return 'This open house is no longer taking requests.';
  if (requestBy(s, ohId, hostId)) return 'You already requested this one.';
  const conflict = hostingConflict(s, hostId, oh);
  if (conflict) return `Overlaps ${conflict.address}, which you're hosting.`;
  return null;
}

export function canApprove(s: AppState, ohId: string, reqId: string, now: number): string | null {
  const oh = s.openHouses[ohId];
  const req = s.requests[reqId];
  if (effectiveStatus(oh, now) !== 'open') return 'This open house already has a host.';
  if (req.status !== 'pending') return 'This request is no longer open.';
  const conflict = hostingConflict(s, req.hostId, oh);
  if (conflict) return `${s.agents[req.hostId].name} is already hosting ${conflict.address} then.`;
  return null;
}

export function canCheckIn(oh: OpenHouse, now: number): string | null {
  if (oh.status !== 'booked') return oh.status === 'checkedIn' ? 'Already checked in.' : 'Nothing to check in to.';
  const opens = oh.startsAt - CHECKIN_OPENS_MIN * MIN;
  if (now < opens) return `Check-in opens at ${fmtTime(opens)}.`;
  if (now > oh.endsAt) return 'This open house has ended.';
  return null;
}

export function canMarkDone(oh: OpenHouse): string | null {
  return oh.status === 'checkedIn' ? null : 'Check in first.';
}

export function canMarkNoShow(oh: OpenHouse, now: number): string | null {
  if (oh.status !== 'booked') return 'No host to mark.';
  const from = oh.startsAt + NO_SHOW_MIN * MIN;
  if (now < from) return `Available from ${fmtTime(from)}, 15 minutes after start.`;
  return null;
}

export function canHostCancel(oh: OpenHouse, now: number): string | null {
  if (oh.status !== 'booked') return 'Nothing to cancel.';
  if (now >= oh.startsAt) return 'The open house has started. Call the listing agent.';
  return null;
}

export function canListerCancel(oh: OpenHouse, now: number): string | null {
  const status = effectiveStatus(oh, now);
  if (status !== 'open' && status !== 'booked') return 'Nothing to cancel.';
  return null;
}

export const isLate = (oh: OpenHouse, now: number) => oh.startsAt - now < 24 * HOUR;

const firstName = (name: string) => name.split(' ')[0];

export function reducer(s: AppState, a: Action): AppState {
  switch (a.type) {
    case 'setPersona':
      return { ...s, personaId: a.id, screen: { name: 'home' }, flash: null };
    case 'go':
      return { ...s, screen: a.screen, flash: null };
    case 'reset':
      return makeSeed(a.now);
    case 'flash':
      return { ...s, flash: a.message };

    case 'post': {
      const id = `oh-${a.now.toString(36)}`;
      const oh: OpenHouse = {
        ...a.input,
        id,
        listerId: s.personaId,
        status: 'open',
        hostId: null,
        checkedInAt: null,
        doneAt: null,
        accessViewedAt: null,
        distanceMi: 1.2,
      };
      const lister = s.agents[s.personaId];
      return {
        ...s,
        openHouses: { ...s.openHouses, [id]: oh },
        agents: { ...s.agents, [lister.id]: { ...lister, listerRecord: { ...lister.listerRecord, posted: lister.listerRecord.posted + 1 } } },
        screen: { name: 'openHouse', id },
        flash: 'Posted. Verified agents nearby can see it now.',
      };
    }

    case 'setFee': {
      const oh = s.openHouses[a.ohId];
      if (oh.status !== 'open') return s;
      return { ...s, openHouses: { ...s.openHouses, [oh.id]: { ...oh, fee: a.fee } }, flash: a.fee ? `Added a $${a.fee} fee. Hosts filtering to paid open houses will see it now.` : 'Fee removed.' };
    }

    case 'request': {
      if (canRequest(s, a.ohId, a.hostId, a.now)) return s;
      const id = `req-${a.now.toString(36)}`;
      const oh = s.openHouses[a.ohId];
      const waitlist = oh.status === 'booked';
      return {
        ...s,
        requests: { ...s.requests, [id]: { id, openHouseId: a.ohId, hostId: a.hostId, note: a.note, createdAt: a.now, status: 'pending' } },
        flash: waitlist ? `You're on the waitlist for ${oh.address}.` : `Requested. ${firstName(s.agents[oh.listerId].name)} will pick a host.`,
      };
    }

    case 'withdraw': {
      const req = s.requests[a.reqId];
      if (!req || req.status !== 'pending') return s;
      return { ...s, requests: { ...s.requests, [req.id]: { ...req, status: 'withdrawn' } }, flash: 'Request withdrawn.' };
    }

    case 'approve': {
      if (canApprove(s, a.ohId, a.reqId, a.now)) return s;
      const oh = s.openHouses[a.ohId];
      const req = s.requests[a.reqId];
      const host = s.agents[req.hostId];
      const others = pendingFor(s, a.ohId).filter(r => r.id !== req.id).length;
      return {
        ...s,
        openHouses: { ...s.openHouses, [oh.id]: { ...oh, status: 'booked', hostId: req.hostId } },
        requests: { ...s.requests, [req.id]: { ...req, status: 'approved' } },
        flash: `${firstName(host.name)} is hosting ${oh.address}. Access details went to ${firstName(host.name)} only.${others ? ` ${others} on the waitlist.` : ''}`,
      };
    }

    case 'decline': {
      const req = s.requests[a.reqId];
      if (!req || req.status !== 'pending') return s;
      return { ...s, requests: { ...s.requests, [req.id]: { ...req, status: 'declined' } }, flash: `Declined ${firstName(s.agents[req.hostId].name)}.` };
    }

    case 'hostCancel': {
      const oh = s.openHouses[a.ohId];
      if (!oh.hostId || canHostCancel(oh, a.now)) return s;
      const host = s.agents[oh.hostId];
      const late = isLate(oh, a.now);
      const req = requestBy(s, oh.id, host.id);
      const waitlist = pendingFor(s, oh.id).length;
      return {
        ...s,
        openHouses: { ...s.openHouses, [oh.id]: { ...oh, status: 'open', hostId: null, accessViewedAt: null } },
        requests: req ? { ...s.requests, [req.id]: { ...req, status: 'withdrawn' } } : s.requests,
        agents: late ? { ...s.agents, [host.id]: { ...host, hostRecord: { ...host.hostRecord, lateCancels: host.hostRecord.lateCancels + 1 } } } : s.agents,
        flash: `You cancelled ${oh.address}. ${firstName(s.agents[oh.listerId].name)} has been told${waitlist ? ` and can approve one of ${waitlist} waitlisted agent${waitlist === 1 ? '' : 's'}` : ''}.${late ? ' A cancel inside 24 hours shows on your record.' : ''}`,
      };
    }

    case 'listerCancel': {
      const oh = s.openHouses[a.ohId];
      if (canListerCancel(oh, a.now)) return s;
      const lister = s.agents[oh.listerId];
      const late = oh.hostId !== null && isLate(oh, a.now);
      const requests = { ...s.requests };
      for (const r of pendingFor(s, oh.id)) requests[r.id] = { ...r, status: 'declined' };
      return {
        ...s,
        openHouses: { ...s.openHouses, [oh.id]: { ...oh, status: 'cancelled' } },
        requests,
        agents: late ? { ...s.agents, [lister.id]: { ...lister, listerRecord: { ...lister.listerRecord, lateCancels: lister.listerRecord.lateCancels + 1 } } } : s.agents,
        flash: `Cancelled ${oh.address}.${oh.hostId ? ` ${firstName(s.agents[oh.hostId].name)} has been told.` : ''}${late ? ' A cancel inside 24 hours shows on your record.' : ''}`,
      };
    }

    case 'checkIn': {
      const oh = s.openHouses[a.ohId];
      if (canCheckIn(oh, a.now)) return s;
      return {
        ...s,
        openHouses: { ...s.openHouses, [oh.id]: { ...oh, status: 'checkedIn', checkedInAt: a.now } },
        flash: `Checked in at ${fmtTime(a.now)}. ${firstName(s.agents[oh.listerId].name)} can see you're here.`,
      };
    }

    case 'markDone': {
      const oh = s.openHouses[a.ohId];
      if (!oh.hostId || canMarkDone(oh)) return s;
      const host = s.agents[oh.hostId];
      return {
        ...s,
        openHouses: { ...s.openHouses, [oh.id]: { ...oh, status: 'done', doneAt: a.now } },
        agents: {
          ...s.agents,
          [host.id]: {
            ...host,
            hostRecord: { ...host.hostRecord, hosted: host.hostRecord.hosted + 1 },
            hostedForIds: host.hostedForIds.includes(oh.listerId) ? host.hostedForIds : [...host.hostedForIds, oh.listerId],
          },
        },
        flash: 'Done. The leads are yours.',
      };
    }

    case 'markNoShow': {
      const oh = s.openHouses[a.ohId];
      if (!oh.hostId || canMarkNoShow(oh, a.now)) return s;
      const host = s.agents[oh.hostId];
      const requests = { ...s.requests };
      for (const r of pendingFor(s, oh.id)) requests[r.id] = { ...r, status: 'declined' };
      return {
        ...s,
        openHouses: { ...s.openHouses, [oh.id]: { ...oh, status: 'uncovered' } },
        requests,
        agents: { ...s.agents, [host.id]: { ...host, hostRecord: { ...host.hostRecord, noShows: host.hostRecord.noShows + 1 } } },
        flash: `Marked as a no-show. It's on ${firstName(host.name)}'s record and a person will review it.`,
      };
    }

    case 'viewAccess': {
      const oh = s.openHouses[a.ohId];
      if (oh.hostId !== s.personaId || oh.accessViewedAt) return s;
      return { ...s, openHouses: { ...s.openHouses, [oh.id]: { ...oh, accessViewedAt: a.now } } };
    }
  }
}
