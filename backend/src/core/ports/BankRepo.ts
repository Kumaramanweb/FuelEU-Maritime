export interface BankRepo {
  getBank(shipId: string, year: number): Promise<number>;
  addBank(shipId: string, year: number, amount: number): Promise<void>;
  applyBank(shipId: string, year: number, amount: number): Promise<void>;
}