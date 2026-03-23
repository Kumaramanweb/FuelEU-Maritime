import axios from 'axios';
import type { ApiPort } from '../../core/ports/api';

const client = axios.create({
  baseURL: 'http://localhost:3000',
});

export const ApiClient: ApiPort = {
  getRoutes: async () => {
    const res = await client.get('/routes');
    return res.data;
  },
  setBaseline: async (id: string) => {
    await client.post(`/routes/${id}/baseline`);
  },
  getComparison: async (year: number) => {
    const res = await client.get(`/routes/comparison?year=${year}`);
    return res.data;
  },
  getComplianceCb: async (shipId: string, year: number) => {
    const res = await client.get(`/compliance/cb?shipId=${shipId}&year=${year}`);
    return res.data;
  },
  getBankRecords: async (shipId: string, year: number) => {
    const res = await client.get(`/banking/records?shipId=${shipId}&year=${year}`);
    return res.data;
  },
  bankCb: async (shipId: string, year: number, cb: number) => {
    await client.post('/banking/bank', { shipId, year, cb });
  },
  applyBank: async (shipId: string, year: number, deficit: number) => {
    const res = await client.post('/banking/apply', { shipId, year, deficit });
    return res.data;
  },
  createPool: async (members) => {
    const res = await client.post('/pools', { members });
    return res.data;
  }
};
