import React, { useState } from 'react';
import { RiskItem, RiskCategory, RiskLevel, RiskStatus } from '../types/project';
import { getRiskLevelBadgeClass, findSimilarRisk, calculateMatrixScore } from '../utils/matrixCalculations';
import { Search, Filter, Plus, ChevronDown, ChevronUp, AlertCircle, ArrowRight, Ban, X, Lock, CheckCircle2 } from 'lucide-react';

interface RiskRegisterViewProps {
  risks: RiskItem[];
  onAddRisk?: (newRisk: RiskItem) => void;
  onUpdateRisk: (updatedRisk: RiskItem) => void;
  onPromoteToIssue: (risk: RiskItem) => void;
  onOpenTriageModal: () => void;
  selectedRiskFromMatrix?: RiskItem | null;
}

export const RiskRegisterView: React.FC<RiskRegisterViewProps> = ({
  risks,
  onAddRisk,
  onUpdateRisk,
  onPromoteToIssue,
  onOpenTriageModal,
  selectedRiskFromMatrix,
}) => {
  const [viewMode, setViewMode] = useState<'initial' | 'response'>('initial');
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [levelFilter, setLevelFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [expandedRiskId, setExpandedRiskId] = useState<string | null>(selectedRiskFromMatrix?.id || null);

  // Manual Add Risk Modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newStatement, setNewStatement] = useState('');
  const [newCategory, setNewCategory] = useState<RiskCategory>('Technical');
  const [newOwner, setNewOwner] = useState('Andrew (PM)');
  const [newProb, setNewProb] = useState(3);
  const [newImpacts, setNewImpacts] = useState({ scope: 2, quality: 2, schedule: 3, cost: 2 });
  const [newActionPlan, setNewActionPlan] = useState('');

  // Check similarity in real-time
  const similarRiskMatch = findSimilarRisk(newStatement, risks);

  const filteredRisks = risks.filter(r => {
    const matchesSearch = r.statement.toLowerCase().includes(search.toLowerCase()) ||
      r.id.toLowerCase().includes(search.toLowerCase()) ||
      r.owner.toLowerCase().includes(search.toLowerCase());
    const matchesCat = categoryFilter === 'All' || r.category === categoryFilter;
    const matchesLevel = levelFilter === 'All' || r.level === levelFilter;
    const matchesStatus = statusFilter === 'All' || r.status === statusFilter;
    return matchesSearch && matchesCat && matchesLevel && matchesStatus;
  });

  const categories: RiskCategory[] = ['Technical', 'External', 'Organizational', 'Project Mgmt', 'Opportunity'];
  const levels: RiskLevel[] = ['Critical', 'High', 'Medium-High', 'Medium', 'Low', 'Very Low'];
  const statuses: RiskStatus[] = ['Open', 'Mitigating', 'Closed', 'Realized'];

  const handleSaveNewRisk = (e: React.FormEvent) => {
    e.preventDefault();
    if (similarRiskMatch) {
      alert(`Blocked: This risk is already documented as ${similarRiskMatch.id}. Please update or review that risk instead.`);
      return;
    }

    if (!onAddRisk || !newStatement.trim()) return;

    const scoreInfo = calculateMatrixScore(newProb, newImpacts);
    const newId = `R-${String(risks.length + 1).padStart(2, '0')}`;
    const newRisk: RiskItem = {
      id: newId,
      category: newCategory,
      statement: newStatement,
      owner: newOwner,
      probability: newProb,
      impacts: newImpacts,
      score: scoreInfo.score,
      level: scoreInfo.level,
      strategy: scoreInfo.score >= 13 ? 'Mitigate' : 'Monitor',
      actionPlan: newActionPlan || "Monitor against agreed schedule milestones.",
      responsibleParty: newOwner,
      triggerSymptom: "Checkpoint review variance.",
      residualP: Math.max(1, newProb - 1),
      residualScore: Math.round(scoreInfo.score / 2),
      status: 'Open',
      comments: `Added manually with duplicate verification check passed.`
    };

    onAddRisk(newRisk);
    setIsAddModalOpen(false);
    setNewStatement('');
    setNewActionPlan('');
  };

  return (
    <div className="space-y-5">
      {/* Top Banner and Mode Switcher */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                Project Risk Register
              </h2>
              <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono font-medium">
                {risks.length} Documented Risks
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Master artifact capturing qualitative identification, scoring, mitigation action plans, and residual risk tracking.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
            <div className="flex items-center p-1 bg-slate-100 rounded-lg text-xs font-medium">
              <button
                onClick={() => setViewMode('initial')}
                className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                  viewMode === 'initial'
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Identification & Analysis
              </button>
              <button
                onClick={() => setViewMode('response')}
                className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                  viewMode === 'response'
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Response Plan & Monitoring
              </button>
            </div>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-3 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-slate-600" />
              <span>Add Risk</span>
            </button>

            <button
              onClick={onOpenTriageModal}
              className="px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Plus className="w-4 h-4 text-amber-400" />
              <span>AI Triage & Score</span>
            </button>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by ID, statement, owner..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-2 border border-slate-300 rounded-md outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-md outline-none bg-white font-medium text-slate-700"
          >
            <option value="All">All Categories ({risks.length})</option>
            {categories.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-md outline-none bg-white font-medium text-slate-700"
          >
            <option value="All">All Risk Levels</option>
            {levels.map(l => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-md outline-none bg-white font-medium text-slate-700"
          >
            <option value="All">All Statuses</option>
            {statuses.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Risk Table */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
              {viewMode === 'initial' ? (
                <tr>
                  <th className="py-3 px-3 w-16">ID</th>
                  <th className="py-3 px-3 w-28">Category</th>
                  <th className="py-3 px-4">Risk Statement</th>
                  <th className="py-3 px-3 w-28">Owner</th>
                  <th className="py-3 px-2 w-10 text-center">P</th>
                  <th className="py-3 px-2 w-24 text-center">Impacts (Sc/Qu/Sch/Co)</th>
                  <th className="py-3 px-2 w-14 text-center">Score</th>
                  <th className="py-3 px-3 w-24 text-center">Level</th>
                  <th className="py-3 px-3 w-28">Strategy</th>
                  <th className="py-3 px-2 w-12 text-center">Details</th>
                </tr>
              ) : (
                <tr>
                  <th className="py-3 px-3 w-16">ID</th>
                  <th className="py-3 px-4">Action Plan & Pre-Agreed Response</th>
                  <th className="py-3 px-3 w-32">Responsible Party</th>
                  <th className="py-3 px-3 w-40">Trigger / Symptom</th>
                  <th className="py-3 px-2 w-14 text-center">Resid. P</th>
                  <th className="py-3 px-2 w-14 text-center">Resid. Score</th>
                  <th className="py-3 px-3 w-24 text-center">Status</th>
                  <th className="py-3 px-2 w-12 text-center">Details</th>
                </tr>
              )}
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {filteredRisks.map(risk => {
                const isExpanded = expandedRiskId === risk.id;

                return (
                  <React.Fragment key={risk.id}>
                    <tr 
                      className={`hover:bg-slate-50/80 transition-colors ${
                        isExpanded ? 'bg-slate-50' : ''
                      }`}
                    >
                      {viewMode === 'initial' ? (
                        <>
                          <td className="py-3 px-3 font-mono font-bold text-slate-900 whitespace-nowrap">
                            {risk.id}
                          </td>
                          <td className="py-3 px-3 text-slate-600 font-medium whitespace-nowrap">
                            {risk.category}
                          </td>
                          <td className="py-3 px-4 text-slate-900 font-medium">
                            {risk.statement}
                          </td>
                          <td className="py-3 px-3 text-slate-600 whitespace-nowrap">
                            {risk.owner}
                          </td>
                          <td className="py-3 px-2 font-mono font-semibold text-center text-slate-800">
                            {risk.probability}
                          </td>
                          <td className="py-3 px-2 font-mono text-center text-slate-600 whitespace-nowrap">
                            {risk.impacts.scope} / {risk.impacts.quality} / {risk.impacts.schedule} / {risk.impacts.cost}
                          </td>
                          <td className="py-3 px-2 font-mono font-bold text-center text-slate-900 text-sm">
                            {risk.score}
                          </td>
                          <td className="py-3 px-3 text-center whitespace-nowrap">
                            <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold border ${getRiskLevelBadgeClass(risk.level)}`}>
                              {risk.level}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-slate-700 whitespace-nowrap font-medium">
                            {risk.strategy}
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="py-3 px-3 font-mono font-bold text-slate-900 whitespace-nowrap">
                            {risk.id}
                          </td>
                          <td className="py-3 px-4 text-slate-800">
                            <pre className="font-sans whitespace-pre-wrap text-xs text-slate-800">{risk.actionPlan}</pre>
                          </td>
                          <td className="py-3 px-3 text-slate-600 font-medium text-xs">
                            {risk.responsibleParty}
                          </td>
                          <td className="py-3 px-3 text-slate-600 text-xs italic">
                            {risk.triggerSymptom}
                          </td>
                          <td className="py-3 px-2 font-mono text-center text-slate-700 font-medium">
                            {risk.residualP}
                          </td>
                          <td className="py-3 px-2 font-mono text-center font-bold text-slate-900">
                            {risk.residualScore}
                          </td>
                          <td className="py-3 px-3 text-center whitespace-nowrap">
                            <select
                              value={risk.status}
                              onChange={(e) => onUpdateRisk({ ...risk, status: e.target.value as RiskStatus })}
                              className="text-[11px] px-2 py-1 rounded bg-slate-100 border border-slate-300 font-medium text-slate-800 cursor-pointer"
                            >
                              <option value="Open">Open</option>
                              <option value="Mitigating">Mitigating</option>
                              <option value="Closed">Closed</option>
                              <option value="Realized">Realized</option>
                            </select>
                          </td>
                        </>
                      )}

                      <td className="py-3 px-2 text-center">
                        <button
                          onClick={() => setExpandedRiskId(isExpanded ? null : risk.id)}
                          className="p-1 text-slate-400 hover:text-slate-800 rounded transition-colors cursor-pointer"
                        >
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                      </td>
                    </tr>

                    {/* Expanded Drawer */}
                    {isExpanded && (
                      <tr className="bg-slate-50/70 border-b border-slate-200">
                        <td colSpan={10} className="p-4">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                            <div>
                              <span className="font-semibold text-slate-700 block mb-1">Detailed Action Plan:</span>
                              <pre className="font-sans whitespace-pre-wrap text-slate-600 bg-white p-2.5 rounded border border-slate-200 text-xs">
                                {risk.actionPlan}
                              </pre>
                            </div>

                            <div>
                              <span className="font-semibold text-slate-700 block mb-1">Monitoring & Triggers:</span>
                              <div className="bg-white p-2.5 rounded border border-slate-200 space-y-1.5 text-slate-600">
                                <div><strong className="text-slate-700">Trigger / Symptom:</strong> {risk.triggerSymptom}</div>
                                <div><strong className="text-slate-700">Responsible:</strong> {risk.responsibleParty}</div>
                                <div><strong className="text-slate-700">Comments:</strong> {risk.comments || 'None'}</div>
                                {risk.contingencyAllocation && (
                                  <div className="text-emerald-700 font-semibold">
                                    Contingency Allocation: ${risk.contingencyAllocation.toLocaleString()}
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="flex flex-col justify-between">
                              <div>
                                <span className="font-semibold text-slate-700 block mb-1">Status & Promotion:</span>
                                <div className="bg-white p-2.5 rounded border border-slate-200 space-y-2 text-slate-600">
                                  <div className="flex justify-between items-center">
                                    <span>Current Status:</span>
                                    <span className="font-semibold text-slate-900">{risk.status}</span>
                                  </div>
                                  <div className="flex justify-between items-center">
                                    <span>Initial Score:</span>
                                    <span className="font-mono font-bold">{risk.score} ({risk.level})</span>
                                  </div>
                                  <div className="flex justify-between items-center">
                                    <span>Residual Score:</span>
                                    <span className="font-mono">{risk.residualScore}</span>
                                  </div>
                                </div>
                              </div>

                              {risk.status !== 'Realized' && (
                                <button
                                  onClick={() => onPromoteToIssue(risk)}
                                  className="mt-3 px-3 py-2 bg-rose-50 border border-rose-200 text-rose-800 hover:bg-rose-100 rounded text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                                >
                                  <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                                  <span>Mark as Realized & Move to Issue Log</span>
                                </button>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Add Risk Modal with Live Duplicate Prevention */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden">
            <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between">
              <span className="text-sm font-bold">Add Custom Risk (with Duplicate Verification)</span>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveNewRisk} className="p-5 space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Risk Statement:</label>
                <textarea
                  rows={3}
                  required
                  value={newStatement}
                  onChange={(e) => setNewStatement(e.target.value)}
                  placeholder="e.g. Hosting provider cutover failure or API vendor missing field..."
                  className="w-full p-2.5 border border-slate-300 rounded outline-none focus:ring-1 focus:ring-slate-900 text-slate-900"
                />
              </div>

              {/* REAL-TIME DUPLICATE WARNING */}
              {similarRiskMatch && (
                <div className="bg-amber-50 border-2 border-amber-400 p-3 rounded-md text-amber-950 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-amber-900">
                    <Ban className="w-4 h-4 text-amber-600" />
                    <span>DUPLICATE RISK DETECTED: Similar to {similarRiskMatch.id}</span>
                  </div>
                  <p className="text-[11px] text-amber-900 font-medium">
                    Matches: <em>"{similarRiskMatch.statement}"</em>
                  </p>
                  <p className="text-[11px] text-slate-700">
                    <strong>Agreed Action Plan already documented:</strong> {similarRiskMatch.actionPlan}
                  </p>
                  <div className="pt-1 text-[11px] font-bold text-red-700">
                    Creation is blocked because the action plan is already identified in {similarRiskMatch.id}.
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Category:</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as RiskCategory)}
                    className="w-full p-2 border border-slate-300 rounded bg-white text-slate-900"
                  >
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Owner:</label>
                  <input
                    type="text"
                    value={newOwner}
                    onChange={(e) => setNewOwner(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Proposed Action Plan:</label>
                <textarea
                  rows={2}
                  value={newActionPlan}
                  onChange={(e) => setNewActionPlan(e.target.value)}
                  placeholder="Describe mitigation plan..."
                  className="w-full p-2 border border-slate-300 rounded text-slate-900"
                />
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-1.5 border border-slate-200 rounded text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>

                {similarRiskMatch ? (
                  <button
                    type="button"
                    disabled
                    className="px-4 py-2 bg-slate-200 text-slate-400 font-semibold rounded cursor-not-allowed flex items-center gap-1.5 border border-slate-300"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Creation Blocked (Matches {similarRiskMatch.id})</span>
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="px-4 py-2 bg-slate-900 text-white font-semibold rounded hover:bg-slate-800 cursor-pointer"
                  >
                    Save New Risk ({risks.length + 1})
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
