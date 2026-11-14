import React, { useState } from 'react';
import { ContingencyReserve, ContingencyDraw, RiskItem, IssueItem } from '../types/project';
import { formatCurrency } from '../utils/matrixCalculations';
import { DollarSign, Shield, AlertTriangle, Plus, FileText, CheckCircle } from 'lucide-react';

interface ContingencyTrackerViewProps {
  contingency: ContingencyReserve;
  risks: RiskItem[];
  issues: IssueItem[];
  onAddDraw: (draw: ContingencyDraw) => void;
}

export const ContingencyTrackerView: React.FC<ContingencyTrackerViewProps> = ({
  contingency,
  risks,
  issues,
  onAddDraw,
}) => {
  const [showDrawModal, setShowDrawModal] = useState(false);
  const [amount, setAmount] = useState<number>(2000);
  const [description, setDescription] = useState('');
  const [selectedRiskId, setSelectedRiskId] = useState<string>('');
  const [selectedIssueId, setSelectedIssueId] = useState<string>('');
  const [authorizedBy, setAuthorizedBy] = useState('Pascual Terlizzi (PM)');

  const totalDrawn = contingency.draws.reduce((sum, d) => sum + d.amount, 0);
  const availablePMContingency = contingency.totalBudget - totalDrawn;
  const percentDrawn = Math.round((totalDrawn / contingency.totalBudget) * 100);

  const handleRecordDraw = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || amount <= 0 || !description.trim()) return;

    const newDraw: ContingencyDraw = {
      id: `DRAW-${String(contingency.draws.length + 1).padStart(3, '0')}`,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      amount,
      description,
      riskId: selectedRiskId || undefined,
      issueId: selectedIssueId || undefined,
      authorizedBy,
      sponsorNotified: amount > 5000
    };

    onAddDraw(newDraw);
    setShowDrawModal(false);
    setDescription('');
    setAmount(2000);
  };

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* PM Contingency Card */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">PM Contingency Reserve</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold font-mono tracking-tight text-slate-900">
            {formatCurrency(availablePMContingency)}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Available balance of {formatCurrency(contingency.totalBudget)} baseline
          </div>

          <div className="mt-4">
            <div className="flex justify-between text-xs text-slate-500 mb-1">
              <span>Drawdown Utilization</span>
              <span className="font-mono font-medium">{percentDrawn}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div
                className={`h-2 rounded-full transition-all ${
                  percentDrawn > 75 ? 'bg-red-500' : percentDrawn > 50 ? 'bg-amber-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${Math.min(100, percentDrawn)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Sponsor Management Reserve Card */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Sponsor Management Reserve</span>
            <Shield className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-bold font-mono tracking-tight text-slate-900">
            {formatCurrency(contingency.managementReserve)}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            ≈5% of direct estimate ($7,500 held by Sponsor)
          </div>
          <div className="mt-4 p-2.5 bg-slate-50 rounded border border-slate-200 text-xs text-slate-600">
            <strong>Protocol:</strong> Reserved for unknown-unknowns. Use requires formal Change Request (e.g. CR-007) and Mary's written approval.
          </div>
        </div>

        {/* PM Authority & Notification Rule */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">PM Authority Limit</span>
              <AlertTriangle className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl font-bold font-mono tracking-tight text-slate-900">
              ≤ $5,000 / event
            </div>
            <div className="text-xs text-slate-500 mt-1">
              Pre-approved drawdown without sponsor gating
            </div>
          </div>

          <div className="mt-4 p-2.5 bg-amber-50 rounded border border-amber-200 text-xs text-amber-900">
            <strong>Trigger:</strong> Any single draw &gt; $5,000 requires immediate Sponsor notification (notification only, not re-approval).
          </div>
        </div>
      </div>

      {/* Drawdown Log & Action */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              Executed Contingency Drawdowns
            </h3>
            <p className="text-xs text-slate-500">
              All expenditures released against known Risk Register and Issue Log line items.
            </p>
          </div>

          <button
            onClick={() => setShowDrawModal(true)}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Plus className="w-4 h-4 text-amber-400" />
            <span>Record Contingency Draw</span>
          </button>
        </div>

        {contingency.draws.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-xs">
            No contingency draws recorded yet. Full $15,000 reserve intact.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase">
                <tr>
                  <th className="py-2.5 px-3">Draw ID</th>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3 text-right">Amount</th>
                  <th className="py-2.5 px-4">Description</th>
                  <th className="py-2.5 px-3">Linked Risk / Issue</th>
                  <th className="py-2.5 px-3">Authorized By</th>
                  <th className="py-2.5 px-3 text-center">Sponsor Notification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {contingency.draws.map(draw => (
                  <tr key={draw.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-slate-900">{draw.id}</td>
                    <td className="py-3 px-3 text-slate-600 whitespace-nowrap">{draw.date}</td>
                    <td className="py-3 px-3 font-mono font-bold text-slate-900 text-right">{formatCurrency(draw.amount)}</td>
                    <td className="py-3 px-4 text-slate-800">{draw.description}</td>
                    <td className="py-3 px-3 text-slate-600 font-mono">
                      {draw.riskId || draw.issueId || '—'}
                    </td>
                    <td className="py-3 px-3 text-slate-600">{draw.authorizedBy}</td>
                    <td className="py-3 px-3 text-center">
                      {draw.amount > 5000 ? (
                        <span className="text-[11px] px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 font-medium">
                          Triggered (&gt;$5K)
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-400">Within PM cap</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Record Drawdown Modal */}
      {showDrawModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full border border-slate-200 overflow-hidden">
            <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between">
              <span className="text-sm font-bold">Record Contingency Drawdown</span>
              <button onClick={() => setShowDrawModal(false)} className="text-slate-400 hover:text-white cursor-pointer">
                ✕
              </button>
            </div>

            <form onSubmit={handleRecordDraw} className="p-5 space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Draw Amount (USD):</label>
                <input
                  type="number"
                  step={100}
                  required
                  value={amount}
                  onChange={(e) => setAmount(parseInt(e.target.value) || 0)}
                  className="w-full p-2 border border-slate-300 rounded text-slate-900 font-mono text-sm"
                />
                {amount > 5000 && (
                  <p className="text-[11px] text-amber-700 font-medium mt-1">
                    ⚠️ Notice: This draw exceeds $5,000 and requires immediate notification to Sponsor Mary.
                  </p>
                )}
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Purpose & Justification:</label>
                <textarea
                  rows={2}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Workaround implementation for CMS licensing / CRM field connector..."
                  className="w-full p-2 border border-slate-300 rounded text-slate-900"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Link to Risk Register Item:</label>
                <select
                  value={selectedRiskId}
                  onChange={(e) => setSelectedRiskId(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded bg-white text-slate-800"
                >
                  <option value="">None / Unlinked</option>
                  {risks.map(r => (
                    <option key={r.id} value={r.id}>{r.id}: {r.statement.slice(0, 45)}...</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Authorized By:</label>
                <input
                  type="text"
                  value={authorizedBy}
                  onChange={(e) => setAuthorizedBy(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded text-slate-900"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowDrawModal(false)}
                  className="px-3 py-1.5 border border-slate-200 rounded text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-slate-900 text-white font-semibold rounded hover:bg-slate-800 cursor-pointer"
                >
                  Confirm Drawdown
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
