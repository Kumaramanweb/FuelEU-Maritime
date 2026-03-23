import { useState, useEffect } from 'react';
import { ApiClient } from '../../infrastructure/ApiClient';
import type { Route } from '../../../core/domain/types';
import { Check, Star, Filter } from 'lucide-react';

export function RoutesTab() {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [filterYear, setFilterYear] = useState('All');

  const fetchRoutes = async () => {
    const data = await ApiClient.getRoutes();
    setRoutes(data);
  };

  useEffect(() => {
    fetchRoutes();
  }, []);

  const setBaseline = async (id: string) => {
    await ApiClient.setBaseline(id);
    await fetchRoutes();
  };

  const filteredRoutes = filterYear === 'All' ? routes : routes.filter(r => r.year.toString() === filterYear);

  return (
    <div className="bg-neutral-800 rounded-xl border border-neutral-700 p-6 shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Vessel Routes</h2>
          <p className="text-neutral-400 text-sm">Manage and view all registered route data across different years.</p>
        </div>
        <div className="flex items-center gap-3">
          <Filter size={18} className="text-neutral-400" />
          <select
            className="bg-neutral-900 border border-neutral-700 text-white rounded-md px-4 py-2 outline-none focus:border-emerald-500"
            value={filterYear}
            onChange={(e) => setFilterYear(e.target.value)}
          >
            <option value="All">All Years</option>
            <option value="2024">2024</option>
            <option value="2025">2025</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-neutral-700">
        <table className="w-full text-left text-sm text-neutral-300">
          <thead className="text-xs uppercase bg-neutral-900 text-neutral-400 border-b border-neutral-700">
            <tr>
              <th className="px-6 py-4">Ship/Route ID</th>
              <th className="px-6 py-4">Vessel Type</th>
              <th className="px-6 py-4">Fuel Type</th>
              <th className="px-6 py-4">Year</th>
              <th className="px-6 py-4">GHG Intensity</th>
              <th className="px-6 py-4 text-center">Baseline</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRoutes.map((route) => (
              <tr key={route.id} className="border-b border-neutral-700 hover:bg-neutral-800/50 transition-colors">
                <td className="px-6 py-4 font-medium text-white">{route.routeId}</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-sky-900/30 text-sky-400 rounded-md text-xs font-medium border border-sky-800/50">
                    {route.vesselType}
                  </span>
                </td>
                <td className="px-6 py-4">{route.fuelType}</td>
                <td className="px-6 py-4">{route.year}</td>
                <td className="px-6 py-4 font-mono">{route.ghgIntensity} gCO₂/MJ</td>
                <td className="px-6 py-4 text-center">
                  {route.isBaseline && (
                    <span className="inline-flex items-center gap-1 text-amber-400 bg-amber-900/20 px-2 py-1 rounded-md text-xs font-medium border border-amber-500/20">
                      <Star size={14} className="fill-amber-400" /> Active
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => setBaseline(route.routeId)}
                    disabled={route.isBaseline}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-md text-sm font-medium transition-all shadow hover:shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Set Baseline
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
