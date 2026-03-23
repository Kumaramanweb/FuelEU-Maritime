import { useState, useEffect } from 'react';
import { ApiClient } from '../../infrastructure/ApiClient';
import type { RouteComparison } from '../../../core/domain/types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export function CompareTab() {
  const [data, setData] = useState<RouteComparison[]>([]);
  const [year, setYear] = useState('2024');

  const TARGET = 89.3368;

  useEffect(() => {
    fetchData();
  }, [year]);

  const fetchData = async () => {
    try {
      const res = await ApiClient.getComparison(Number(year));
      setData(res);
    } catch (e) {
      setData([]); // probably no baseline
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-neutral-800 rounded-xl border border-neutral-700 p-6 shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">GHG Intensity Comparison</h2>
            <p className="text-neutral-400 text-sm">Compare vessels against the baseline and the Fuel EU Target ({TARGET} gCO₂/MJ).</p>
          </div>
          <select
            className="bg-neutral-900 border border-neutral-700 text-white rounded-md px-4 py-2 outline-none focus:border-emerald-500"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          >
            <option value="2024">2024</option>
            <option value="2025">2025</option>
          </select>
        </div>

        {data.length === 0 ? (
          <div className="text-center py-12 text-neutral-500 bg-neutral-900/50 border border-dashed border-neutral-700 rounded-lg">
            No baseline set for {year} or no data exists. Please set a baseline in the Routes tab.
          </div>
        ) : (
          <>
            <div className="h-[400px] w-full mb-8">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#404040" />
                  <XAxis dataKey="routeId" stroke="#a3a3a3" />
                  <YAxis domain={[80, 100]} stroke="#a3a3a3" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#171717', border: '1px solid #404040', borderRadius: '8px' }}
                    itemStyle={{ color: '#e5e5e5' }}
                  />
                  <Legend />
                  <ReferenceLine y={TARGET} label={{ position: 'top', value: `Fuel EU Target (${TARGET})`, fill: '#ef4444', fontSize: 12 }} stroke="#ef4444" strokeDasharray="3 3" />
                  <Bar dataKey="ghgIntensity" name="GHG Intensity" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="overflow-x-auto rounded-lg border border-neutral-700">
              <table className="w-full text-left text-sm text-neutral-300">
                <thead className="text-xs uppercase bg-neutral-900 text-neutral-400 border-b border-neutral-700">
                  <tr>
                    <th className="px-6 py-4">Ship ID</th>
                    <th className="px-6 py-4">GHG Intensity</th>
                    <th className="px-6 py-4">% Diff (vs Baseline)</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((r) => (
                    <tr key={r.id} className="border-b border-neutral-700 hover:bg-neutral-800/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-white">
                        {r.routeId} {r.isBaseline && <span className="text-xs text-amber-500 ml-2">(Baseline)</span>}
                      </td>
                      <td className="px-6 py-4 font-mono">{r.ghgIntensity}</td>
                      <td className={`px-6 py-4 font-mono ${Number(r.percentDiff) > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                        {Number(r.percentDiff) > 0 ? '+' : ''}{r.percentDiff}%
                      </td>
                      <td className="px-6 py-4">
                        {r.compliant ? (
                          <span className="flex items-center gap-1 text-emerald-400"><CheckCircle2 size={16} /> Compliant</span>
                        ) : (
                          <span className="flex items-center gap-1 text-red-400"><AlertCircle size={16} /> Non-Compliant</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
