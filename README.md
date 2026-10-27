# Cover

A clickable demo of an open house coverage marketplace for real estate agents. Listing agents post an open house they can't attend, verified agents nearby request to host, and the listing agent picks one from a host card built on license status and track record.

- **Product doc:** [Cover: Open House Coverage Marketplace](https://docs.google.com/document/d/1mMTGO8rnrABQH-BgadnwEUKx7VrECVPMMMxMzwavDVE/edit?tab=t.0) (Google Doc; a Markdown export is in [PRODUCT.md](PRODUCT.md)). The research, the core problem, the trust design, compensation, failure handling, scope, and V2 priorities all live there.
- **Live demo:** https://cover-fawn-iota.vercel.app
- **Source:** [`cover/`](cover/)

## Run it

Requires Node 24 and pnpm 10.

```bash
cd cover
pnpm install
pnpm dev          # http://localhost:5173
pnpm check        # type-check + design lint
pnpm build        # tsc --noEmit && vite build, output in dist/
```

Deploy is a static Vite build on Vercel: `vercel --prod` from `cover/`.

Live demo: https://cover-fawn-iota.vercel.app

## Walkthrough (about three minutes)

Switch personas with the Maya / Jordan control in the header. The circular arrow resets the data. Seed times are relative to the moment you open the page, so the day-of flow is always live, and the demo clock then stays put, so nothing expires while the tab is open. Opened outside 9 AM to 5 PM, the demo clock reads 11 AM instead, and Home shows the demo time.

1. **As Maya (listing agent):** Home shows what needs her. Open **412 Sterling Pl**, where three agents want to host. Compare the cards (license, brokerage, raw track record, their note) and approve Jordan. The others stay on a waitlist, and the access details go to Jordan only.
2. **Switch to Jordan (host):** Find open houses. 77 Dean St is blocked because it overlaps 88 Carroll St, which he's hosting today. Filter to paid: 561 4th St is blocked too, because it overlaps 412 Sterling Pl, which Maya just approved him for. Clear the filter and request **140 Clinton Ave**.
3. **Still as Jordan:** from Home, open **88 Carroll St**. Show the access details (the view is logged), check in at the door, mark it done.
4. **Back to Maya:** 88 Carroll St shows checked in and done. **215 Park Pl** has no check-in: call the host, or mark a no-show. The strike lands on their record.
5. **As Maya:** Post an open house. It lands on the new post's empty state with the "add a fee" nudge.

What is mock: the data, login, and the license lookup. What is real: every flow, state, guard, and empty state the product doc describes.

## Tech stack

| Piece | Choice | Why |
|---|---|---|
| Build | Vite 8 | Static output, fast dev server, nothing to configure |
| UI | React 19 + TypeScript 7 (strict) | Typed state transitions are the point of the demo |
| Styling | Tailwind v4 via `@tailwindcss/vite`, tokens in `@theme` | One token file, no runtime CSS-in-JS |
| Icons | lucide-react | |
| State | One `useReducer` at the root over seeded data | The whole app is a state machine; see below |
| Routing | None, the current screen is a state field | Four screens, no deep links needed |
| Backend, auth, persistence | None | Out of scope for a take-home; reload or Reset reseeds |
| Hosting | Vercel | |

## Code architecture

Everything is under `cover/src/`.

```
src/
  main.tsx              React root
  App.tsx               header (nav, persona switcher, reset), screen switch, flash toast
  lib/
    types.ts            Agent, OpenHouse, HostRequest, Screen, AppState
    seed.ts             makeSeed(now): 7 agents, 7 open houses, 6 requests, times relative to now
    reducer.ts          Action union, guards, pure reducer
    derive.ts           read models: effective status, waitlist, conflicts, action items
    format.ts           money, time ranges, relative time, date inputs
    clock.ts            the demo clock: fixed at load time, or 11 AM if opened outside the day
    ui.ts               shared class strings for fields, labels, links, focus rings
    cn.ts               clsx + tailwind-merge
  components/
    kit/                design primitives (Panel, Stamp, Legend, PressButton, Chip,
                        Field, Dialog, StatusChip, Avatar, PageHead, TypeTile)
    HostCard.tsx        the host as the listing agent sees them: license, brokerage,
                        raw track record, note. No composite score.
    OpenHouseCard.tsx   list row for Home and Find
    RequestDialog.tsx   request-to-host with a note
    TermsStamp.tsx      "Leads only" or "Leads + $fee" terms badge and sentence
    AgentLine.tsx       listing agent line on a host-facing card
    Flash.tsx           toast
  screens/
    Home.tsx            what needs you, across both roles
    Post.tsx            post an open house (one page, validated)
    Find.tsx            browse nearby open houses with filters
    OpenHouse.tsx       one open house: lister view, host view, day-of
  styles/globals.css    Tailwind import + @theme tokens
scripts/design-lint.mjs  fails the build on the design Never list
```

### Data model

Three records. An agent is one account with two records (as host and as lister); the role is set per open house, not per account.

- **Agent:** name, brokerage, license status (`verified | unverified | lapsed`), years licensed, phone, host record (hosted, no-shows, late cancels, rating), lister record (posted, late cancels), and which listers they have hosted for before.
- **OpenHouse:** listing details, start and end, fee (`null` means leads only), notes, access details, seller-OK flag, status (`open | booked | checkedIn | done | cancelled | uncovered`), approved host, check-in and done timestamps, when access was viewed, distance from the host persona.
- **HostRequest:** open house, host, note, status (`pending | approved | declined | withdrawn`).

The waitlist is not stored. It is every request still pending on a booked open house.

### State machine

`reducer.ts` is pure. Each user-facing action has a guard that returns the reason it is blocked, or `null`. The UI shows the reason inline and the reducer re-checks before applying, so a disabled button and a blocked dispatch always agree.

| Action | Guard | Effect |
|---|---|---|
| `post` | seller OK, starts in the future | new open house, status `open` |
| `setFee` | open, no host | fee changes (locks once booked) |
| `request` | host verified, not own listing, open house still open or booked, no existing request, no overlapping hosting | request `pending` (on a booked open house, it joins the waitlist) |
| `withdraw` | pending | `withdrawn` |
| `approve` | open house open, request pending, host not hosting elsewhere then | request `approved`, open house `booked`; other requests stay pending as the waitlist; access visible to this host only |
| `decline` | pending | `declined` |
| `hostCancel` | booked, before start | back to `open`; late cancel on the host's record if under 24h |
| `listerCancel` | open or booked | `cancelled`; pending requests declined; late cancel on the lister's record if under 24h |
| `checkIn` | booked, from 30 minutes before start until the end | `checkedIn` |
| `markDone` | checked in | `done` |
| `markNoShow` | booked (no check-in), 15 minutes past start | `uncovered`; no-show on the host's record |
| `viewAccess` | approved host only | records the first view time, shown to the lister |

`derive.ts` turns stored state into what screens show: the effective status given the clock (an `open` post past its start reads as uncovered; a booked one with no check-in 10 minutes in raises the alert), the display label and tone, and the Home screen's action items sorted by urgency.

### Time

Seed data is built from the demo clock at load, so "today" open houses are always today, one is always mid-window for the day-of flow, and one is always past its no-check-in threshold.

The demo clock (`clock.ts`) is fixed at the moment the page loads, so none of those states expire while the tab sits open; reload or reset to start over. Between 9 AM and 5 PM it is the real load time. Outside those hours it reads 11 AM today, so someone opening the demo in the evening doesn't see open houses at 9 PM.

## Design rules

The visual language is a port of the discipline from a previous project's design kit, without that project's skin. The mechanical half of the rules is enforced by `scripts/design-lint.mjs`, which runs in `pnpm check` and scans `src/` for the patterns that make a UI read as generated.

**Never:** gradients, glass or blur, blurred drop shadows, hover motion (nothing lifts, scales, eases or animates), a colored stripe on one edge of a card, named Tailwind radii (two tokens only: 10px surfaces, 6px controls, plus full circles for avatars, dots and filter chips), emoji, em dashes (en dashes only inside a time or date range), uppercase badges, composite trust scores, filler stats, cheers in copy.

**Always:** one accent (navy) for the single primary action and links. Green means verified, red means a strike or an error, gray means not set yet. Every number sits in a Legend cell: the value, then what it counts, and the cell exists only when the fact exists. Badges are tinted fills in sentence case. Surfaces are white with a hairline and no shadow. Type is the system sans at 15px for copy and Outfit for titles only. Copy says what happened and what is next; empty states say what the user can do.

Tokens are in `src/styles/globals.css`. Changing the ground, accent, or radii is a one-line edit there.

## How this was built

Claude Code as a research and writing partner for the product doc and as the pair for the demo build. The design kit, the Never list, and the lint came from my own prior project; pointing the model at them is what kept the generated screens on one visual language. The product doc's Appendix B has the full list.
