import { Route, RouteComparison, ComplianceBalance, BankRecord, BankApplyResult, PoolMember } from '../domain/types';

export interface ApiPort {
  getRoutes(): Promise<Route[]>;
  setBaseline(id: string): Promise<void>;
  getComparison(year: number): Promise<RouteComparison[]>;
  
  getComplianceCb(shipId: string, year: number): Promise<ComplianceBalance>;
  
  getBankRecords(shipId: string, year: number): Promise<BankRecord>;
  bankCb(shipId: string, year: number, cb: number): Promise<void>;
  applyBank(shipId: string, year: number, deficit: number): Promise<BankApplyResult>;
  
  createPool(members: PoolMember[]): Promise<PoolMember[]>;
}
