import { useState } from 'react';
import { ApiClient } from '../../infrastructure/ApiClient';
import { Search, ArrowDownToLine, ArrowUpToLine } from 'lucide-react';

export function BankingTab() {
  const [shipId, setShipId] = useState('');
  const [year, setYear] = useState('2024');

  const [cb, setCb] = useState<number | null>(null);
  const [bank, setBank] = useState<number>(0);
  const [amountInput, setAmountInput] = useState<string>('');

  const handleSearch = async () => {
    try {
      const cbData = await ApiClient.getComplianceCb(shipId, Number(year));
      setCb(cbData.cb);

      const bankData = await ApiClient.getBankRecords(shipId, Number(year));
      setBank(bankData.bank);
    } catch (e) {
      alert("Ship not found for the given year");
    }
  };

  const handleBank = async () => {
    if (!cb || cb <= 0) return;
    await ApiClient.bankCb(shipId, Number(year), cb);
    alert('Banked Successfully!');
    handleSearch();
  };

  const handleApply = async () => {
    if (!amountInput || isNaN(Number(amountInput))) return;
    await ApiClient.applyBank(shipId, Number(year), Number(amountInput));
    alert('Applied Successfully!');
    setAmountInput('');
    handleSearch();
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-neutral-800 rounded-xl border border-neutral-700 p-6 shadow-xl">
        <h2 className="text-2xl font-bold text-white mb-2">Article 20 – Banking</h2>
        <p className="text-neutral-400 text-sm mb-6">Manage specific compliance balance (CB) surplus banking and deficit applications.</p>

        <div className="flex gap-4 mb-8">
          <input
            type="text"
            placeholder="Ship ID (e.g. R001)"
            className="flex-1 bg-neutral-900 border border-neutral-700 text-white rounded-md px-4 py-2 outline-none focus:border-emerald-500 transition-colors"
            value={shipId}
            onChange={(e) => setShipId(e.target.value)}
          />
          <select
            className="bg-neutral-900 border border-neutral-700 text-white rounded-md px-4 py-2 outline-none focus:border-emerald-500"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          >
            <option value="2024">2024</option>
            <option value="2025">2025</option>
          </select>
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-md flex items-center gap-2 transition-all shadow hover:shadow-sky-500/20"
          >
            <Search size={18} /> Lookup
          </button>
        </div>

        {cb !== null && (
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-neutral-900 border border-neutral-700 p-6 rounded-xl flex flex-col items-center justify-center">
              <span className="text-sm text-neutral-400 mb-2 uppercase tracking-wide font-semibold">Current Balance (CB)</span>
              <span className={`text-4xl font-mono font-bold ${cb >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {cb >= 0 ? '+' : ''}{cb.toFixed(2)}
              </span>
            </div>

            <div className="bg-neutral-900 border border-neutral-700 p-6 rounded-xl flex flex-col items-center justify-center">
              <span className="text-sm text-neutral-400 mb-2 uppercase tracking-wide font-semibold">Total Banked</span>
              <span className="text-4xl font-mono font-bold text-sky-400">
                {bank.toFixed(2)}
              </span>
            </div>
          </div>
        )}
      </div>

      {cb !== null && cb > 0 && (
        <div className="bg-emerald-950/20 rounded-xl border border-emerald-900/50 p-6 shadow-xl flex justify-between items-center">
          <div>
            <h3 className="text-emerald-400 font-medium text-lg">Surplus Available</h3>
            <p className="text-emerald-500/70 text-sm">You have a positive CB. You can bank this surplus for future years.</p>
          </div>
          <button
            onClick={handleBank}
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-md font-medium transition-all shadow-lg shadow-emerald-600/20 flex items-center gap-2"
          >
            <ArrowUpToLine size={20} /> Bank Surplus
          </button>
        </div>
      )}

      {cb !== null && cb < 0 && (
        <div className="bg-red-950/20 rounded-xl border border-red-900/50 p-6 shadow-xl">
          <h3 className="text-red-400 font-medium text-lg mb-1">Deficit Action Required</h3>
          <p className="text-red-500/70 text-sm mb-4">You have a negative CB. You can apply banked surplus to offset this deficit.</p>

          <div className="flex gap-4">
            <input
              type="number"
              placeholder="Amount to Apply"
              className="flex-1 bg-neutral-900 border border-red-900/50 text-white rounded-md px-4 py-2 outline-none focus:border-red-500"
              value={amountInput}
              onChange={(e) => setAmountInput(e.target.value)}
            />
            <button
              onClick={handleApply}
              disabled={bank <= 0}
              className="px-6 py-2 bg-red-600 hover:bg-red-500 text-white rounded-md font-medium transition-all shadow-lg shadow-red-600/20 disabled:opacity-50 flex items-center gap-2"
            >
              <ArrowDownToLine size={20} /> Apply Offset
            </button>
          </div>
          {bank <= 0 && <p className="text-sm text-neutral-500 mt-2">You don't have any banked surplus to apply.</p>}
        </div>
      )}
    </div>
  );
}
