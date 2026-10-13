import React from 'react';
import { AlertCircle, AlertTriangle, ShieldCheck, DollarSign } from 'lucide-react';
import { RiskItem, IssueItem, ContingencyReserve } from '../types/project';
import { formatCurrency } from '../utils/matrixCalculations';

interface KPIBarProps {
  risks: RiskItem[];
  issues: IssueItem[];
  contingency: ContingencyReserve;
  onSelectTab: (tab: 'matrix' | 'triage' | 'risks' | 'issues' | 'contingency') => void;
}

export const KPIBar: React.FC<KPIBarProps> = ({
  risks,
  issues,
  contingency,
  onSelectTab,
}) => {
  const openIssues = issues.filter(i => i.status === 'Open' || i.status === 'In Progress' || i.status === 'Escalated');
  const criticalRisks = risks.filter(r => r.level === 'Critical' && r.status !== 'Closed');
  const highRisks = risks.filter(r => (r.level === 'High' || r.level === 'Medium-High') && r.status !== 'Closed');
  
  const totalDrawn = contingency.draws.reduce((sum, d) => sum + d.amount, 0);
  const remainingContingency = contingency.totalBudget - totalDrawn;
  const contingencyPercentDrawn = Math.round((totalDrawn / contingency.totalBudget) * 100);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* KPI 1: Active Open Issues */}
      <div 
        onClick={() => onSelectTab('issues')}
        className="bg-white border border-slate-200 rounded-lg p-4 cursor-pointer hover:border-slate-300 transition-all shadow-xs"
      >
        <div className="flex items-center justify-between text-slate-500 mb-1">
          <span className="text-xs font-medium uppercase tracking-wider">Active Issues</span>
          <AlertCircle className="w-4 h-4 text-rose-500" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold font-mono tracking-tight text-slate-900">
            {openIssues.length}
          </span>
          <span className="text-xs text-slate-500">
            / {issues.length} total logged
          </span>
        </div>
        <div className="mt-2 text-xs text-slate-500 flex items-center gap-1.5">
          <span className="text-rose-600 font-semibold">{issues.filter(i => i.status === 'Escalated').length} escalated</span>
          <span>·</span>
          <span>{issues.filter(i => i.status === 'In Progress').length} in progress</span>
        </div>
      </div>

      {/* KPI 2: Critical / High Risks */}
      <div 
        onClick={() => onSelectTab('matrix')}
        className="bg-white border border-slate-200 rounded-lg p-4 cursor-pointer hover:border-slate-300 transition-all shadow-xs"
      >
        <div className="flex items-center justify-between text-slate-500 mb-1">
          <span className="text-xs font-medium uppercase tracking-wider">Critical Threats</span>
          <AlertTriangle className="w-4 h-4 text-amber-500" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold font-mono tracking-tight text-red-600">
            {criticalRisks.length}
          </span>
          <span className="text-xs text-slate-500">
            Critical (Score 16–25)
          </span>
        </div>
        <div className="mt-2 text-xs text-slate-500 flex items-center gap-1.5">
          <span className="text-amber-600 font-medium">{highRisks.length} High/Med-High</span>
          <span>·</span>
          <span>Active mitigation required</span>
        </div>
      </div>

      {/* KPI 3: PM Contingency Reserve */}
      <div 
        onClick={() => onSelectTab('contingency')}
        className="bg-white border border-slate-200 rounded-lg p-4 cursor-pointer hover:border-slate-300 transition-all shadow-xs"
      >
        <div className="flex items-center justify-between text-slate-500 mb-1">
          <span className="text-xs font-medium uppercase tracking-wider">Contingency Reserve</span>
          <DollarSign className="w-4 h-4 text-emerald-600" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold font-mono tracking-tight text-slate-900">
            {formatCurrency(remainingContingency)}
          </span>
          <span className="text-xs text-slate-500">
            avail / {formatCurrency(contingency.totalBudget)}
          </span>
        </div>
        <div className="mt-2 text-xs text-slate-500 flex items-center justify-between">
          <span>{formatCurrency(totalDrawn)} drawn ({contingencyPercentDrawn}%)</span>
          <span className="font-mono text-slate-400">PM Hold</span>
        </div>
      </div>

      {/* KPI 4: Governance Posture */}
      <div 
        onClick={() => onSelectTab('risks')}
        className="bg-white border border-slate-200 rounded-lg p-4 cursor-pointer hover:border-slate-300 transition-all shadow-xs"
      >
        <div className="flex items-center justify-between text-slate-500 mb-1">
          <span className="text-xs font-medium uppercase tracking-wider">Methodology Posture</span>
          <ShieldCheck className="w-4 h-4 text-blue-600" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-bold tracking-tight text-slate-900">
            PMBOK 8th Ed.
          </span>
          <span className="text-xs text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-mono">
            5×5 Matrix
          </span>
        </div>
        <div className="mt-2 text-xs text-slate-500 flex items-center gap-1.5 truncate">
          <span>Formula: P × max(Impact)</span>
          <span>·</span>
          <span>Nov 2026 Target</span>
        </div>
      </div>
    </div>
  );
};
