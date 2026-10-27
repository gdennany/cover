/**
 * The clock the demo runs on. Seed times are relative to now so the day-of flow is always
 * live, which would put today's open houses at 9 PM for someone opening the page in the
 * evening. Outside 9 AM to 5 PM the clock starts at 11 AM today and runs forward from there.
 */
function daytimeOffset(real: number): number {
  const hour = new Date(real).getHours();
  if (hour >= 9 && hour < 17) return 0;
  const target = new Date(real);
  target.setHours(11, 0, 0, 0);
  return target.getTime() - real;
}

const offset = daytimeOffset(Date.now());

export const clockNow = () => Date.now() + offset;

/** True when the demo clock differs from the viewer's own. */
export const clockShifted = offset !== 0;
