import { useState, type Dispatch, type FormEvent } from 'react';
import { Lock } from 'lucide-react';
import { Field } from '@/components/kit/Field';
import { PageHead } from '@/components/kit/PageHead';
import { Panel, PanelBar } from '@/components/kit/Panel';
import { PressButton } from '@/components/kit/PressButton';
import { Stamp } from '@/components/kit/Stamp';
import { fromDateTimeInputs, toDateInput } from '@/lib/format';
import type { Action } from '@/lib/reducer';
import { PROPERTY_TYPES, type AppState, type PropertyType } from '@/lib/types';
import { CHECK_CN, FIELD_CN, FIELD_INVALID_CN, HELP_CN, LABEL_CN } from '@/lib/ui';
import { cn } from '@/lib/cn';

function nextSaturday(now: number): string {
  const d = new Date(now);
  const ahead = (6 - d.getDay() + 7) % 7 || 7;
  d.setDate(d.getDate() + ahead);
  return toDateInput(d.getTime());
}

export function Post({ state, now, dispatch }: { state: AppState; now: number; dispatch: Dispatch<Action> }) {
  const me = state.agents[state.personaId];
  const [address, setAddress] = useState('');
  const [unit, setUnit] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [type, setType] = useState<PropertyType>('condo');
  const [price, setPrice] = useState('');
  const [beds, setBeds] = useState('2');
  const [baths, setBaths] = useState('1');
  const [date, setDate] = useState(() => nextSaturday(now));
  const [start, setStart] = useState('13:00');
  const [end, setEnd] = useState('15:00');
  const [paid, setPaid] = useState(false);
  const [fee, setFee] = useState('100');
  const [notes, setNotes] = useState('');
  const [access, setAccess] = useState('');
  const [sellerOk, setSellerOk] = useState(false);
  const [tried, setTried] = useState(false);

  const startsAt = fromDateTimeInputs(date, start);
  const endsAt = fromDateTimeInputs(date, end);
  const errors = {
    address: address.trim() ? null : 'Add the street address.',
    neighborhood: neighborhood.trim() ? null : 'Add the neighborhood so hosts can judge the distance.',
    price: Number(price) > 0 ? null : 'Add the asking price. Hosts use it to judge the leads.',
    when: Number.isNaN(startsAt) ? 'Pick a date.' : startsAt <= now ? 'Pick a time in the future.' : endsAt <= startsAt ? 'End time has to be after the start.' : null,
    fee: paid && !(Number(fee) > 0) ? 'Enter a fee, or switch to leads only.' : null,
    access: access.trim() ? null : 'Add how the host gets in. Only the host you approve will see it.',
    sellerOk: sellerOk ? null : 'Confirm your seller and broker are OK with this.',
  };
  const invalid = Object.values(errors).some(Boolean);
  const show = (key: keyof typeof errors) => (tried ? errors[key] : null);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setTried(true);
    if (invalid) return;
    dispatch({
      type: 'post',
      now,
      input: {
        address: address.trim(),
        unit: unit.trim() || null,
        neighborhood: neighborhood.trim(),
        propertyType: type,
        price: Number(price),
        beds: Number(beds),
        baths: Number(baths),
        startsAt,
        endsAt,
        fee: paid ? Number(fee) : null,
        notes: notes.trim(),
        access: access.trim(),
        sellerOk,
      },
    });
  };

  return (
    <form onSubmit={submit} noValidate className="space-y-6">
      <PageHead kicker="Post an open house" title="Can't make it? Post it." description={`Verified agents near the listing see it as soon as you post. You pick the host. Posting as ${me.name}, ${me.brokerage}.`} />

      <Panel>
        <PanelBar title="The listing" />
        <div className="grid gap-4 p-5 sm:grid-cols-6">
          <Field label="Address" htmlFor="address" error={show('address')} className="sm:col-span-4">
            <input id="address" value={address} onChange={e => setAddress(e.target.value)} placeholder="412 Sterling Pl" className={cn(FIELD_CN, show('address') && FIELD_INVALID_CN)} />
          </Field>
          <Field label="Unit" htmlFor="unit" className="sm:col-span-2">
            <input id="unit" value={unit} onChange={e => setUnit(e.target.value)} placeholder="#3" className={FIELD_CN} />
          </Field>
          <Field label="Neighborhood" htmlFor="neighborhood" error={show('neighborhood')} className="sm:col-span-3">
            <input id="neighborhood" value={neighborhood} onChange={e => setNeighborhood(e.target.value)} placeholder="Prospect Heights" className={cn(FIELD_CN, show('neighborhood') && FIELD_INVALID_CN)} />
          </Field>
          <Field label="Property type" htmlFor="type" className="sm:col-span-3">
            <select id="type" value={type} onChange={e => setType(e.target.value as PropertyType)} className={FIELD_CN}>
              {PROPERTY_TYPES.map(t => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Asking price" htmlFor="price" error={show('price')} className="sm:col-span-2">
            <input id="price" inputMode="numeric" value={price} onChange={e => setPrice(e.target.value.replace(/[^\d]/g, ''))} placeholder="1250000" className={cn(FIELD_CN, 'tabular-nums', show('price') && FIELD_INVALID_CN)} />
          </Field>
          <Field label="Beds" htmlFor="beds" className="sm:col-span-2">
            <input id="beds" inputMode="numeric" value={beds} onChange={e => setBeds(e.target.value)} className={cn(FIELD_CN, 'tabular-nums')} />
          </Field>
          <Field label="Baths" htmlFor="baths" className="sm:col-span-2">
            <input id="baths" inputMode="decimal" value={baths} onChange={e => setBaths(e.target.value)} className={cn(FIELD_CN, 'tabular-nums')} />
          </Field>
        </div>
      </Panel>

      <Panel>
        <PanelBar title="When" />
        <div className="grid gap-4 p-5 sm:grid-cols-3">
          <Field label="Date" htmlFor="date" error={show('when')}>
            <input id="date" type="date" value={date} onChange={e => setDate(e.target.value)} className={cn(FIELD_CN, show('when') && FIELD_INVALID_CN)} />
          </Field>
          <Field label="Starts" htmlFor="start">
            <input id="start" type="time" value={start} onChange={e => setStart(e.target.value)} className={FIELD_CN} />
          </Field>
          <Field label="Ends" htmlFor="end">
            <input id="end" type="time" value={end} onChange={e => setEnd(e.target.value)} className={FIELD_CN} />
          </Field>
        </div>
      </Panel>

      <Panel>
        <PanelBar title="What the host gets" />
        <div className="p-5">
          <div className="grid gap-3 sm:grid-cols-2" role="radiogroup" aria-label="Terms">
            <label className={cn('flex cursor-pointer items-start gap-3 rounded-kit border p-4', !paid ? 'border-accent bg-accent-edge/50' : 'border-line hover:bg-paper-hover')}>
              <input type="radio" name="terms" checked={!paid} onChange={() => setPaid(false)} className={cn(CHECK_CN, 'mt-0.5')} />
              <span>
                <span className="block text-sm font-bold text-ink">Leads only</span>
                <span className="mt-0.5 block text-sm text-mist">The host keeps the unrepresented buyer leads. The usual deal.</span>
              </span>
            </label>
            <label className={cn('flex cursor-pointer items-start gap-3 rounded-kit border p-4', paid ? 'border-accent bg-accent-edge/50' : 'border-line hover:bg-paper-hover')}>
              <input type="radio" name="terms" checked={paid} onChange={() => setPaid(true)} className={cn(CHECK_CN, 'mt-0.5')} />
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-bold text-ink">Add a fee</span>
                <span className="mt-0.5 block text-sm text-mist">For a slow listing or short notice. Hosts can filter to paid open houses.</span>
                {paid ? (
                  <span className="mt-2 flex items-center gap-2">
                    <span className="text-sm font-bold">$</span>
                    <input aria-label="Fee in dollars" inputMode="numeric" value={fee} onChange={e => setFee(e.target.value.replace(/[^\d]/g, ''))} className={cn(FIELD_CN, 'w-24 tabular-nums', show('fee') && FIELD_INVALID_CN)} />
                    <span className="text-xs text-mist">+ leads</span>
                  </span>
                ) : null}
              </span>
            </label>
          </div>
          {show('fee') ? <p className="mt-2 text-[13px] font-bold text-danger">{errors.fee}</p> : null}
          <p className={HELP_CN}>Shown on the post and locked once you approve a host. A fee is paid between your brokerages, not through Cover.</p>
        </div>
      </Panel>

      <Panel>
        <PanelBar title="For the host" />
        <div className="grid gap-5 p-5">
          <Field label="Notes" htmlFor="notes" help="Talking points, what the seller wants said, anything about the home. The approved host sees this.">
            <textarea id="notes" rows={3} value={notes} onChange={e => setNotes(e.target.value)} placeholder="Seller is motivated. Second bedroom is staged as an office. Roof deck key is on the kitchen hook." className={FIELD_CN} />
          </Field>
          <div>
            <label htmlFor="access" className={cn(LABEL_CN, 'flex items-center gap-1.5')}>
              <Lock size={14} />
              Access details
              <Stamp tone="mist" className="ml-1">Private</Stamp>
            </label>
            <textarea id="access" rows={2} value={access} onChange={e => setAccess(e.target.value)} placeholder="Lockbox on the gate rail, code 4417. Alarm is off." className={cn(FIELD_CN, show('access') && FIELD_INVALID_CN)} />
            {show('access') ? <p className="mt-1.5 text-[13px] font-bold text-danger">{errors.access}</p> : <p className={HELP_CN}>Only the host you approve sees this, and each view is logged. We'll remind you to change the code afterward.</p>}
          </div>
        </div>
      </Panel>

      <Panel className="p-5">
        <label className="flex cursor-pointer items-start gap-3">
          <input type="checkbox" checked={sellerOk} onChange={e => setSellerOk(e.target.checked)} className={cn(CHECK_CN, 'mt-0.5')} />
          <span>
            <span className="block text-sm font-bold text-ink">My seller and my broker are OK with another agent hosting.</span>
            {show('sellerOk') ? <span className="mt-1 block text-[13px] font-bold text-danger">{errors.sellerOk}</span> : <span className="mt-0.5 block text-sm text-mist">Cover shows the post to agents at other brokerages, so this has to be cleared on your side.</span>}
          </span>
        </label>
        <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-mist">{tried && invalid ? 'Fix the fields above to post.' : 'You approve every host. Nobody is assigned automatically.'}</p>
          <PressButton type="submit" size="lg">
            Post open house
          </PressButton>
        </div>
      </Panel>
    </form>
  );
}
