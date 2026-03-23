export interface RouteRepo {
  getRoutes(): Promise<any[]>;
  getRoutesByYear(year: number): Promise<any[]>;
  setBaseline(id: string): Promise<void>;
}