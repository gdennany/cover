import { Stamp } from '@/components/kit/Stamp';

/** What the host gets, as written on the post. */
export function TermsStamp({ fee }: { fee: number | null }) {
  return fee ? <Stamp tone="ink">${fee} fee + leads</Stamp> : <Stamp tone="ink">Leads only</Stamp>;
}

export const termsSentence = (fee: number | null) =>
  fee ? `The host keeps the buyer leads and gets a $${fee} fee, paid between your brokerages.` : 'The host keeps the buyer leads. No fee.';

export const termsSentenceHost = (fee: number | null) =>
  fee ? `You keep the buyer leads and get a $${fee} fee, paid between your brokerages.` : 'You keep the buyer leads. No fee.';
