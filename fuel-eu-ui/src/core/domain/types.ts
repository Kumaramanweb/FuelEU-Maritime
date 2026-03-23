export interface Route {
  id: string;
  routeId: string;
  vesselType: string;
  fuelType: string;
  year: number;
  ghgIntensity: number;
  fuelConsumption: number;
  distance: number;
  totalEmissions: number;
  isBaseline: boolean;
}

export interface RouteComparison extends Route {
  percentDiff: string;
  compliant: boolean;
}

export interface ComplianceBalance {
  shipId: string;
  year: number;
  cb: number;
}

export interface BankRecord {
  bank: number;
}

export interface BankApplyResult {
  applied: number;
  remainingBank: number;
  newDeficit: number;
}

export interface PoolMember {
  id: string;
  cb: number;
  cb_after?: number;
}
