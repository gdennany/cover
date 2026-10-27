# Cover: Open House Coverage Marketplace

**Research & Product Definition** · Grant Dennany · [Google Doc](https://docs.google.com/document/d/1mMTGO8rnrABQH-BgadnwEUKx7VrECVPMMMxMzwavDVE/edit?usp=sharing) · [Sources](#heading=h.svhcfjmu44ej)

## Product Summary

- When listing agents can't make their own open house, the only fallback today is a post in their brokerage's group chats and hoping someone is free.  
- The agents most eager to host are newer agents who need buyer leads, and most of them are outside that chat.  
- **The core problem: give listing agents more host coverage reach without losing the trust they get from colleagues.**  
- Cover (working product name) is a cross brokerage marketplace where:  
  - Listing agents post an open house they can’t attend.  
  - Verified agents request to host.  
  - The listing agent picks one based on license, brokerage, and track record.  
  - The host keeps the buyer leads, and the listing agent can add a payment fee as a fallback.  
- **Where this MVP goes deep:** Trust, because it's the core problem.   
  - License verification, the host card a listing agent picks from, and show up protection: check in, a visible no show and late cancel record, and a waitlist as backup.  
- **Where this MVP stays shallow**: maps, calendars, and payments don’t solve the core problem. Platform monetization is out of scope.

## Problem Statement

When a listing agent can’t make one of their open houses, they post in their brokerages group chats and hope a colleague can cover for them. This approach has one main limitation:

- Reach & Discovery: the request only reaches their colleagues. Agents at other brokerages who would happily cover never see the request.

What posting in your brokerages group chat does well today is **handling trust**. Every person in that chat is a colleague in the same brokerage, and often known at a personal level. 

Therefore, the core problem this marketplace should solve is to facilitate open house coverage without sacrificing trust.

*Context: 3 hour timebox. Original Problem Statement. Sources*

## User Definitions

This is a two sided marketplace. Both sides are licensed agents, but the [data](#sources) suggests they're usually at different stages of their careers, which points to different motivations:

|  | Listing agent (needs coverage) | Host agent (covers) |
| :---- | :---- | :---- |
| Typical profile | Established agent with listings. Most new leads come through existing relationships. | Newer and building relationships. Has no leads pipeline yet. |
| Evidence | 66% of sellers chose an agent they were referred to or had used before. Agents with 16+ years get a median 49% of their business from repeat clients and 32% from referrals. | 15% of Realtors have two years experience or less. Their median is 2 transaction sides and \$8k gross income, with 0% of business from repeat clients or referrals. |
| Wants | The open house shown well, the time gained from not attending the open house. | A way to meet buyers that doesn’t require owning a listing, practice, network growth. |
| Risks | Their reputation with the seller. | A wasted day or not getting credit for coverage. |

These are roles, not account types. One account can post and host, and the role is set per open house. A newer agent who hosts today will have listings later, and their hosting record should come with them.

The data also gives us some insight into how to structure the transaction in this marketplace:

1. **The value exchange is lopsided in a useful way.** A walk in buyer lead is worth little to an established agent with a referral pipeline and much more to a newer agent with none. **Leads are a natural default payment**.  
2.  **The trust gap is lopsided too.** The listing agent has the most to lose, their seller relationship, and they're handing off to the agent with the least track record (a median of 2 deals). Getting the **listing agent to trust the host is the hard part** of this marketplace.  
3. **Not every agent wants to host.**  
   1. 62% of Realtors got no business from in person open houses in 2025\. In 2019, only 36% had ever landed a client from one, and 4% called open houses a top source.  
   2. So the realistic pool of hosts is the agents who deliberately use open houses to find clients, mostly newer and buyer focused. That's far fewer than "every licensed agent nearby," so any given open house will have fewer potential hosts than the number of local agents suggests.  
4. **Teams already solve this.** 21% of Realtors are on a team (median 4 people) and can usually cover internally. Note*:* that makes Cover most useful to **solo agents**, the \~79% who aren't on a team.

## Core Problem: Facilitate Reach Without Losing Trust

Putting it all together:

- Listing agents have the problem, and the leads to pay with.  
- Their trusted network is small. The brokerage chat is trusted but limited to one firm.  
- The most eager hosts are outside that network. They're newer agents with little track record.  
- Listing agents need more reach without losing the trust they get from colleagues.  
- Leads pay for most of the reach: they’re worth little to the listing agent and a lot to the hosting agent.

What makes it difficult:

- Fixed time and place. A Saturday 1-3 PM open house can only be hosted by someone who's free then and nearby, so reach has to be wide and fast.  
- Hosts must be licensed, and outside your own brokerage you can't take that for granted.  
- A no show is the worst outcome. Buyers arrive at a locked door, and the seller hears about it.

**Secondary problem: the handoff** (access, talking points, logistics). It's real, but it's solved minimally in the MVP and would need more definition in a V2 product.

## How Cover Solves it

Three bets:

1. **Reach**: one feed of every open house that needs a host, across brokerages. One post reaches every verified agent in the network nearby.  
2. **Trust: borrowed, earned, and controlled.**  
   1. Borrowed*:* the license is verified against the state record, and their brokerage is shown.  
   2. Earned*:* a visible track record of showing up: open houses hosted, no-shows, late cancels.  
   3. Controlled*:* the listing agent approves every host.  
3. **Leads as the default payment.**   
   1. The listing agent can also offer the host a flat fee (e.g. \$100 payment to the person who covers my open house).  
   2. The fee is part of the written terms, but it's paid outside Cover (see [Compensation](#compensation)). Cover itself charges nothing in the MVP.

**Matching: request to book, not instant claim.**

- Agents request to host and the listing agent picks one. Like Airbnb's request to book, rather than Uber's first to accept.  
- Trust matters more than speed when selecting a request.  
- Instant claims could come later for hosts a listing agent already trusts, or are from their same brokerage, etc.

**Design principle: the listing agent's first post has to work.**

- Their need comes up only now and then,  so posting has to take under 2 minutes and draw a credible request quickly. If the first post fails, they don't come back.

## Core UX Flows

**Happy path:** a listing agent posts an open house \-\> nearby agents see it and request to host \-\> the listing agent picks the best fit \-\> the host gets the access details, checks in, and hosts \-\> they rate each other, and the host keeps the leads that show up.

**One-time setup (both roles):** sign up and verify your license once. One account works for posting and hosting. After that, Cover re-checks the license automatically each time they request to host.

**Listing agent: "I can't make Saturday"**

1. **Post** the open house: listing details (address, property type, price, beds/baths, photo), time, payment terms, access details, notes for the host, and a checkbox confirming the seller and their broker are okay with another agent hosting.  
2. **Review requests.** Each request shows a host card. Needs to facilitate the trust (see [Facilitate Trust](#facilitate-trust:-handing-your-listing-to-a-stranger) section for a deep dive)  
3. **Approve** one host. Access details go to that host only automatically. The other requests stay open as a waitlist.  
4. **See them check in** on the day.  
5. **Rate** the host.

**Host agent: "I'm free Saturday and want leads"**

1. **Browse** nearby open houses by time, distance, payment, property type, and price. This tells the host what kind of buyers (and leads) to expect.  
2. **Request to host,** with a short note.  
3. **Get approved** and receive the access details.  
4. **Check in,** host the open house, and **mark it done.** The leads are theirs.  
5. **Rate** the listing agent.

Navigation is organized by task, not by role: "Post an open house" and "Find open houses" sit side by side.

For when a step fails (no requests, a cancellation, a no-show), see [What Could Go Wrong](#handling-what-could-go-wrong) section.

## Facilitate Trust: Handing Your Listing to a Stranger {#facilitate-trust:-handing-your-listing-to-a-stranger}

Put yourself in the listing agent's shoes. Your seller trusted you with their home, and you're about to hand it to someone you've never met. These are the questions I'd ask, in order, and how Cover answers each:

| As the listing agent, I'd ask… | What Cover shows or does |
| :---- | :---- |
| "Are they real and licensed?" | The license is checked against the state record: active status, name and brokerage match. Unverified agents can browse but can't request to host. |
| "Have they done this before, and did they show up?" | Their track record as a host: number hosted, no shows, late, cancels, rating.  |
| "Will they represent my listing well?" | Ratings and comments from other listing agents, years licensed, and their request note to me. |
| "Do we have anything in common?" | "Same brokerage" and "Hosted for you before" badges |
| "Do I stay in control?" | I pick the host, nobody is auto assigned. Access details go only to the host I approve. Terms are set before I approve. |
| "Will I know they actually showed up?" | The host taps check in when they arrive, and I get notified. V2: confirm their phone is at the property. |
| "What if it goes wrong?" | A no-show leaves a visible strike, a person reviews reports, and repeat offenders are suspended. |

**The first time host problem:**

- Most hosts are newer agents, so many will have no track record yet.  
- We show this honestly ("New host, no open houses on Cover yet") next to the signals they do have: verified license, years licensed, brokerage, and their note.  
- Hiding newness would undermine trust in every track record on the platform.

**Trust goes both ways.** Hosts see the listing agent's verified status and their track record as a listing agent: open houses posted, late cancels etc.

**License verification (MVP):**

1. The agent enters their license number at signup.  
2. Cover checks it against the state's public license record for active status, a name match, and the sponsoring brokerage. For example, NY publishes active licensees as open data ([reference lookup](https://appext20.dos.ny.gov/nydos/selSearchType.do)).  
3. If everything matches, the agent is **Verified**.   
4. The license is checked again when the agent applies to host, so an expired license can't host.

In the clickable demo, license status is mock data.

## Compensation {#compensation}

**Leads are the default payment.** The host keeps the unrepresented buyer leads from the open house. We bet that’s enough for most open houses, but it's unproven.

**A flat fee is the fallback payment.**

- For open houses where leads may not be enough, like a slow listing or short notice, the listing agent can add a fee when posting.  
- The fee shows on the post, and hosts can filter to paid open houses, so each host decides what's worth their time.  
- It locks once a host is approved.

**No payments in the MVP.**

- The fee is part of the written terms both agents see, but Cover doesn't move money or track whether it's been paid.  
- Payments and holding fees are V2. Referral fees and swap credits only if agents ask (see [V2 Priorities](#v2-priorities)).

## Handling What Could Go Wrong {#handling-what-could-go-wrong}

| Scenario | How we notice | How Cover handles it |
| :---- | :---- | :---- |
| Nobody requests to host | No requests 24h before start | Suggest adding a fee. At start time the post closes as uncovered. |
| Host cancels | Host cancels in the app | The post reopens immediately and the waitlist is notified, so the listing agent can approve another host in one tap. A cancellation within 24h shows on the host's record. |
| Host doesn't show | No check in 10 min after start | Alert the listing agent with the host's number. After 15 min they can mark a no show. Strike on their record. |
| Listing agent cancels (seller changed plans, goes under contract) | Listing agent cancels | The host is notified right away. A cancellation within 24h shows on the listing agent's record. |
| Time or terms need to change after approval | Listing agent tries to edit | Time and payment are locked. To change them, cancel and repost, so the host is never held to terms they didn't agree to. V2 would include a request to the approved host with the edits. |
| Host double books themselves | Overlapping times | Blocked before they can request |
| License has lapsed | Re-check when they request to host | They can't request, and they're told why |
| Access details misused | A report, each view is logged as evidence  | Only the approved host ever sees them. The listing agent is prompted to change the lockbox code after the event, confirmed misuse is a ban. |
| Host safety (alone in a vacant home) | Check in and "done" times | The listing agent knows when the host arrives and leaves. No "done" 30 min after end \-\> a check in message to the host. |
| Disagreement over leads, or an unpaid fee | Terms on the post | Terms are written before approval and visible to both. The host reports it, and a person reviews it with the record. |
| Bad conduct (poaching the seller, misrepresenting the home) | A report or a rating | Reviewed by a person \-\> warning or suspension |

## MVP Scope & Key Decisions

**In the MVP scope:**

- Sign up once with a verified license (one account for both roles)  
- Post an open house  
- Find open houses nearby  
- Request to host & approval (with a waitlist)  
- Access details for the approved host only  
- Check in / mark done  
- Optional fee in the posted terms (paid outside Cover)  
- Two-way ratings  
- Cancellation handling

**Where we go shallow, and why:**

| Area | MVP | Why |
| :---- | :---- | :---- |
| Maps | A list sorted by time and distance | Agents decide on when and how far; a map adds build time without changing the decision |
| Calendars | Notifications, add to calendar later | An open house is a single event, not a schedule to sync |
| Payments | The fee is shown in the terms, no payments or paid tracking | Paying another agent goes through their broker, doing it right is more complex than it sounds. |
| Handoff | Access details \+ notes only | A secondary problem, fuller handoff deferred to V2 |

Refer [V2 Priorities Section](#v2-priorities).

## Assumptions & Open Questions

**Assumptions for the MVP:**

1. **Single launch market.** One city (NYC, the five boroughs, is the working assumption), so there's one state's license rules, one time zone, and enough agent density for hosts to be nearby.  
2. No payments in the MVP. An optional fee shows in the posted terms, but Cover doesn't move money or track whether it's been paid.   
3. **The demo screens are clickable, built on mock data.** The flows and states are real. The backend, login, and license lookup are not.  
4. Hosting requires an active license in the property's state, held under a brokerage.  
5. The listing agent has their seller's and broker's OK for another agent to host, confirmed with a checkbox when posting.  
6. Listing agents usually know they need coverage at least a day ahead.  
7. **Residential only:** houses, townhouses, condos, co-ops, and small multi-family. Commercial properties are rarely sold through public open houses.

**Open questions** (to validate from 3-5 agent calls of each user persona):

- Are leads enough payment? What fee would make you say yes?  
- What would make you trust a host from another brokerage?  
- Does your brokerage restrict outside agents from hosting its listings?  
- How far ahead do you usually know you need coverage?  
- Who keeps open house leads by convention in your office?

## Risks, Validation & Metrics {#risks,-validation-&-metrics}

| Risk / assumption | Why it matters | How we'd test or mitigate it |
| :---- | :---- | :---- |
| Liquidity: enough hosts near this open house at this time | Slots are local and time boxed, and one empty post loses a listing agent | Launch in one dense market, recruit hosts before listing agents, measure fill rate by neighborhood. |
| Hosts are the easier side to acquire | Shapes the go to market | \~216k NAR members have two years' experience or less (15% of 1.44M), but only a segment works open houses. Confirm on calls |
| Leads are enough payment | If not, posts go unfilled | Agent calls, the optional fee is the fallback |
| Listing agents need coverage only now and then | Infrequent use means they forget the product exists | Make posting fast, notifications to hosts keep the supply side engaged |
| Leakage: after one good match, the listing agent texts the host directly next time | The marketplace gets bypassed | Fine early on (the product is free); the track record only builds on Cover |
| Regulatory: pay through brokers; brokerage policies on outside hosts | Compliance | No payments in the MVP; V2 pays through brokerages; verify per state |

**Metrics:**

- **North star:** fill rate, the % of posted open houses that get an approved host who shows up.  
- **Supporting:**  
  - Time to first request  
  - No show rate  
  - % of listing agents who post again within 30 days  
  - % of hosts who host a second time

## V2 Priorities {#v2-priorities}

Ordered by the north star metric (fill rate) and the biggest risks from the [above section](#risks,-validation-&-metrics). Each item has a signal from the MVP that will tell us when it's time to build it.

| Theme | What we'd build | Build it when… |
| :---- | :---- | :---- |
| Fill more open houses faster | Alerts based on when and where a host is free ("Saturdays, within 2 miles"); text alerts for urgent posts; a wider search radius when a post sits unfilled | Posts go unfilled or wait too long for a first request |
| Make the leads count | Visitor sign in by QR code, so leads land in the host's account a short feedback report the listing agent can send their seller | Hosting agents don’t return. It tests the core bet (are leads enough?) with real numbers and gives listing agents a reason to stay on Cover. |
| Trust at scale | Auto approve hosts a listing agent already trusts (hosted for them before, same brokerage), colleague vouching for first time hosts, license lookups in more states, location confirmed check in (the host's phone has to be at the property) | Listing agents spend too long reviewing requests, first time hosts rarely get approved, or there are disputes over whether a host really showed up |
| Payments | Fees paid through brokerages, paid tracking, a "pays on time" record, holding fees against no shows | A meaningful share of posts include a fee, or unpaid fee reports pile up |
| Fuller handoff | Checklists, talking points, calendar sync, day of logistics | Problems on the day trace back to the handoff |
| Brokerages & new markets | Brokerage settings (e.g. whether outside agents can host its listings), a brokerage view of coverage, the next metro area | Fill rate is healthy in the launch market |

**Later, only if agents ask:** maps, in app chat, referral fees, swap credits, brokerage-only posting.

## Demo Screens

A clickable prototype built on mock data: the flows and states are real, the backend, login, and license lookup are not. A persona switcher lets a reviewer walk through both sides: **Maya** (listing agent) and **Jordan** (host). 

| \# | Screen | Who | Why this one |
| :---- | :---- | :---- | :---- |
| 1 | **Choose a host:** host cards with license, track record, badges; approve | Listing agent | It's where trust, the core problem, gets decided |
| 2 | **Post an open house:** listing details (incl. property type and price), time, payment terms, notes, access details | Listing agent | The first post has to work: quick and intuitive to post, solves the happy path. |
| 3 | **Find open houses:** nearby open houses by time, distance, payment, and property type, each showing price; filter to paid or by property type | Host | The reach half of the core problem, the host decides what's worth their time |
| 4 | **Day of:** access details, check in, mark done, plus the listing agent's "checked in" view | Host | Shows the no show protection working |
| 5 | **Home** (what needs your attention, across both roles) and **Agent profile** | Both | Ties the flows together |

## Sources {#sources}

1. NAR 2026 Member Profile (2025 data), via [HousingWire](https://www.housingwire.com/articles/nar-2026-member-profile-experience/) and the [NAR press release](https://www.nar.realtor/newsroom/experienced-realtors-anchor-the-industry-as-housing-affordability-remains-top-hurdle-new-nar-report)  
2. NAR 2019 Member Profile, via [HomeSpotter](https://blog.homespotter.com/2020/03/02/four-groups-and-potential-clients-agents-are-overlooking-at-open-houses/)  
3. NAR 2025 Profile of Home Buyers and Sellers, via [NowBam](https://nowbam.com/how-home-buyers-and-sellers-find-their-agents-in-2025/) (secondary source; verify against the report)

## Appendix A: Original Prompt

Please write a design doc and mock up a few screens for a service that helps real estate agents cover each other's open houses.  
Today, real estate agents who can't make one of their own open houses usually post in their brokerage's Slack or group chat and hope a colleague is free to host it. Other agents would happily cover one when the time and place suit them, but there is no easy way for them to find those open houses. We'd like you to design a service that connects agents who need an open house covered with licensed agents nearby who are available to host it.  
What we are looking for:

1. A design doc that considers the features and aspects of the platform: who it's for, the core flows for the agent who needs coverage and the agent who covers, and what you would build as an MVP.  
2. A few demo screens of the flows you think matter most. There are no points gained or lost for something fully functional or bug free, but a good UI and UX do count.  
3. Consider how agents might want to be compensated for covering someone else's open house, in whatever form makes the most sense to them.  
4. Put yourself in the shoes of an agent handing their listing to someone they've never met. What would make you trust them, and how does your design handle it?  
5. Consider edge-cases, where things could go wrong, handling problems, etc.

There is a lot of surface area here (maps, calendars, license verification, payments), so go deep on what you think matters most rather than trying to cover everything.  
A few ground rules:

* Please limit yourself to 3 hours, and use whatever tools you'd like.  
* We encourage you to build with AI, and we will want to discuss the tools you used.  
* Please send everything back by end of day Wednesday, October 28, Eastern Time (let me know if this timeline is an issue at all).  
* This is the first time we are running this exercise, so I expect you may have questions. Please reach out (no points off for driving clarification)\!

## Appendix B: Tools Used

- **Claude Code (Opus 5.5)** as a research and writing partner: web research on NAR data, drafting and reviewing this doc section by section, and building the clickable screens.  
- I pointed Claude Code at my own design rule book and a lint that fails the build on gradients and em dashes"  to style the mock screens.