import { Building, Building2, Home, House, Layers } from 'lucide-react';
import { cn } from '@/lib/cn';
import type { PropertyType } from '@/lib/types';

const ICON: Record<PropertyType, typeof Home> = {
  condo: Building2,
  'co-op': Building,
  townhouse: Home,
  house: House,
  'multi-family': Layers,
};

/** Stands in for the listing photo: a tinted tile with the property type's glyph. */
export function TypeTile({ type, size = 'md', className }: { type: PropertyType; size?: 'md' | 'lg'; className?: string }) {
  const Icon = ICON[type];
  return (
    <span aria-hidden className={cn('flex shrink-0 items-center justify-center rounded-ctl bg-accent-edge text-accent-text', size === 'lg' ? 'h-14 w-14 [&>svg]:h-6 [&>svg]:w-6' : 'h-11 w-11 [&>svg]:h-5 [&>svg]:w-5', className)}>
      <Icon />
    </span>
  );
}
