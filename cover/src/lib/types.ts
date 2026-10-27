export type LicenseStatus = 'verified' | 'unverified' | 'lapsed';
export type PropertyType = 'condo' | 'co-op' | 'townhouse' | 'house' | 'multi-family';
export type OpenHouseStatus = 'open' | 'booked' | 'checkedIn' | 'done' | 'cancelled' | 'uncovered';
export type RequestStatus = 'pending' | 'approved' | 'declined' | 'withdrawn';

export interface HostRecord {
  hosted: number;
  noShows: number;
  lateCancels: number;
  rating: number | null;
  ratingCount: number;
}

export interface ListerRecord {
  posted: number;
  lateCancels: number;
}

export interface Agent {
  id: string;
  name: string;
  initials: string;
  brokerage: string;
  licenseStatus: LicenseStatus;
  yearsLicensed: number;
  phone: string;
  hostRecord: HostRecord;
  listerRecord: ListerRecord;
  /** Listing agents this agent has hosted for (drives "Hosted for you before"). */
  hostedForIds: string[];
}

export interface OpenHouse {
  id: string;
  listerId: string;
  address: string;
  unit: string | null;
  neighborhood: string;
  propertyType: PropertyType;
  price: number;
  beds: number;
  baths: number;
  startsAt: number;
  endsAt: number;
  /** Optional flat fee in dollars; null means leads only. */
  fee: number | null;
  notes: string;
  /** Private. Only the approved host sees it. */
  access: string;
  sellerOk: boolean;
  status: OpenHouseStatus;
  hostId: string | null;
  checkedInAt: number | null;
  doneAt: number | null;
  accessViewedAt: number | null;
  /** Distance from the host persona. One number is enough for the demo. */
  distanceMi: number;
}

export interface HostRequest {
  id: string;
  openHouseId: string;
  hostId: string;
  note: string;
  createdAt: number;
  status: RequestStatus;
}

export type Screen =
  | { name: 'home' }
  | { name: 'post' }
  | { name: 'find' }
  | { name: 'openHouse'; id: string };

export interface AppState {
  agents: Record<string, Agent>;
  openHouses: Record<string, OpenHouse>;
  requests: Record<string, HostRequest>;
  personaId: string;
  screen: Screen;
  flash: string | null;
}

export const PROPERTY_TYPES: { value: PropertyType; label: string }[] = [
  { value: 'condo', label: 'Condo' },
  { value: 'co-op', label: 'Co-op' },
  { value: 'townhouse', label: 'Townhouse' },
  { value: 'house', label: 'House' },
  { value: 'multi-family', label: 'Multi-family' },
];

export const propertyLabel = (t: PropertyType) => PROPERTY_TYPES.find(p => p.value === t)?.label ?? t;
