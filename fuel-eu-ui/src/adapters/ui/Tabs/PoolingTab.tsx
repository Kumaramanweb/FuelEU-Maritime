import { useState, useEffect } from 'react';
import { ApiClient } from '../../infrastructure/ApiClient';
import type { PoolMember } from '../../../core/domain/types';
import { Users, Plus, Trash2 } from 'lucide-react';

export function PoolingTab() {
  const [year, setYear] = useState('2024');
  const [members, setMembers] = useState<PoolMember[]>([]);
  const [shipInput, setShipInput] = useState('');

  const [poolResult, setPoolResult] = useState<PoolMember[] | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const addMember = async () => {
    if (!shipInput) return;
    try {
      const cbData = await ApiClient.getComplianceCb(shipInput, Number(year));

      if (members.find(m => m.id === shipInput)) {
        setErrorMsg('Ship already added');
        return;
      }

      setMembers([...members, { id: shipInput, cb: cbData.cb }]);
      setShipInput('');
      setErrorMsg('');
      setPoolResult(null);
    } catch (e) {
      setErrorMsg(`Ship ${shipInput} not found or no data for ${year}`);
    }
  };

  const handleCreatePool = async () => {
    try {
      const res = await ApiClient.createPool(members);
      setPoolResult(res);
      setErrorMsg('');
    } catch (e: any) {
      setErrorMsg(e.response?.data?.error || e.message);
    }
  };

  const removeMember = (id: string) => {
    setMembers(members.filter(m => m.id !== id));
    setPoolResult(null);
  };

  const totalCb = members.reduce((sum, m) => sum + m.cb, 0);
  const isValidPool = totalCb >= 0 && members.length > 1;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-neutral-800 rounded-xl border border-neutral-700 p-6 shadow-xl">
        <h2 className="text-2xl font-bold text-white mb-2">Article 21 – Pooling</h2>
        <p className="text-neutral-400 text-sm mb-6">Create a compliance pool. Deficit ships can be offset by surplus ships within the pool.</p>

        <div className="flex gap-4 mb-6">
          <select
            className="bg-neutral-900 border border-neutral-700 text-white rounded-md px-4 py-2 outline-none"
            value={year}
            onChange={(e) => {
              setYear(e.target.value);
              setMembers([]);
              setPoolResult(null);
            }}
          >
            <option value="2024">2024</option>
            <option value="2025">2025</option>
          </select>
          <input
            type="text"
            placeholder="Ship ID (e.g. R001)"
            className="flex-1 bg-neutral-900 border border-neutral-700 text-white rounded-md px-4 py-2 outline-none focus:border-emerald-500"
            value={shipInput}
            onChange={(e) => setShipInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addMember()}
          />
          <button
            onClick={addMember}
            className="px-4 py-2 bg-neutral-700 hover:bg-neutral-600 text-white rounded-md flex items-center gap-2 transition-colors"
          >
            <Plus size={18} /> Add Ship
          </button>
        </div>

        {errorMsg && (
          <div className="text-red-400 bg-red-950/30 border border-red-900/50 rounded-lg p-3 text-sm mb-4">
            {errorMsg}
          </div>
        )}

        <div className="border border-neutral-700 rounded-lg overflow-hidden mt-6">
          <table className="w-full text-left text-sm text-neutral-300">
            <thead className="bg-neutral-900 border-b border-neutral-700 text-neutral-400 uppercase text-xs">
              <tr>
                <th className="px-6 py-3">Ship ID</th>
                <th className="px-6 py-3 text-right">CB Before</th>
                {poolResult && <th className="px-6 py-3 text-right">CB After (Pooled)</th>}
                <th className="px-6 py-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {members.length === 0 ? (
                <tr>
                  <td colSpan={poolResult ? 4 : 3} className="px-6 py-8 text-center text-neutral-500 border-b border-neutral-800">
                    No members added yet. Add at least 2 ships.
                  </td>
                </tr>
              ) : (
                members.map(m => {
                  const afterData = poolResult?.find(p => p.id === m.id);
                  return (
                    <tr key={m.id} className="border-b border-neutral-800 hover:bg-neutral-800/50">
                      <td className="px-6 py-3 font-medium text-white">{m.id}</td>
                      <td className={`px-6 py-3 text-right font-mono ${m.cb >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {m.cb >= 0 ? '+' : ''}{m.cb.toFixed(2)}
                      </td>
                      {poolResult && (
                        <td className={`px-6 py-3 text-right font-mono ${afterData?.cb_after && afterData.cb_after >= 0 ? 'text-emerald-400' : 'text-neutral-500'}`}>
                          {afterData?.cb_after?.toFixed(2) ?? '-'}
                        </td>
                      )}
                      <td className="px-6 py-3 text-center">
                        <button onClick={() => removeMember(m.id)} className="text-neutral-500 hover:text-red-400 transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
            {members.length > 0 && (
              <tfoot className="bg-neutral-900/50">
                <tr>
                  <td className="px-6 py-3 font-bold text-white text-right">Pool Total:</td>
                  <td className={`px-6 py-3 text-right font-bold font-mono ${totalCb >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                    {totalCb >= 0 ? '+' : ''}{totalCb.toFixed(2)}
                  </td>
                  {poolResult && <td className="px-6 py-3"></td>}
                  <td></td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm text-neutral-500 flex items-center gap-2">
            <Users size={16} /> Valid pool must have net CB ≥ 0
          </p>
          <button
            onClick={handleCreatePool}
            disabled={!isValidPool}
            className={`px-6 py-2 rounded-md font-medium text-white shadow-lg transition-all flex items-center gap-2 ${isValidPool
              ? 'bg-sky-600 hover:bg-sky-500 shadow-sky-600/20'
              : 'bg-neutral-700 text-neutral-500 cursor-not-allowed hidden' // hidden or disabled
              }`}
          >
            Create Compliance Pool
          </button>
        </div>
      </div>
    </div>
  );
}
