import { ObjectiveImpacts, RiskLevel, IssuePriority } from '../types/project';
import { MATRIX_THRESHOLDS } from '../data/seedData';

export function calculateMatrixScore(p: number, impacts: ObjectiveImpacts) {
  const maxImpact = Math.max(impacts.scope, impacts.quality, impacts.schedule, impacts.cost);
  const score = p * maxImpact;

  const thresholdInfo = MATRIX_THRESHOLDS.find(t => score >= t.min && score <= t.max) || MATRIX_THRESHOLDS[MATRIX_THRESHOLDS.length - 1];

  return {
    score,
    maxImpact,
    level: thresholdInfo.level as RiskLevel,
    thresholdInfo
  };
}

export function getRiskLevelBadgeClass(level: RiskLevel): string {
  switch (level) {
    case 'Critical':
      return 'bg-red-50 text-red-700 border-red-200';
    case 'High':
      return 'bg-rose-50 text-rose-700 border-rose-200';
    case 'Medium-High':
      return 'bg-amber-50 text-amber-800 border-amber-200';
    case 'Medium':
      return 'bg-yellow-50 text-yellow-800 border-yellow-200';
    case 'Low':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 'Very Low':
      return 'bg-slate-100 text-slate-700 border-slate-200';
    default:
      return 'bg-slate-100 text-slate-700 border-slate-200';
  }
}

export function getCellBgColor(p: number, impact: number): string {
  const score = p * impact;
  if (score >= 16) return 'bg-red-100/90 text-red-950 border-red-300 hover:bg-red-200';
  if (score >= 13) return 'bg-rose-100/90 text-rose-950 border-rose-300 hover:bg-rose-200';
  if (score >= 10) return 'bg-amber-100/90 text-amber-950 border-amber-300 hover:bg-amber-200';
  if (score >= 7) return 'bg-yellow-100/90 text-yellow-950 border-yellow-300 hover:bg-yellow-200';
  if (score >= 4) return 'bg-emerald-100/90 text-emerald-950 border-emerald-300 hover:bg-emerald-200';
  return 'bg-slate-100/90 text-slate-900 border-slate-200 hover:bg-slate-200';
}

export function getIssuePriorityBadgeClass(priority: IssuePriority): string {
  switch (priority) {
    case 'High':
      return 'bg-rose-50 text-rose-700 border-rose-200';
    case 'Medium':
      return 'bg-amber-50 text-amber-800 border-amber-200';
    case 'Low':
      return 'bg-slate-100 text-slate-700 border-slate-200';
  }
}

export function getIssueStatusBadgeClass(status: string): string {
  switch (status) {
    case 'Resolved':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 'In Progress':
      return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'Escalated':
      return 'bg-red-50 text-red-700 border-red-200';
    case 'Open':
    default:
      return 'bg-amber-50 text-amber-700 border-amber-200';
  }
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
}
