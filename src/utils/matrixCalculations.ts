import { ObjectiveImpacts, RiskLevel, IssuePriority, RiskItem } from '../types/project';
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

/**
 * Searches for an existing documented risk that is semantically similar
 * to prevent duplicate entries and point the user to the existing action plan.
 */
export function findSimilarRisk(statement: string, allRisks: RiskItem[]): RiskItem | null {
  const text = statement.toLowerCase().trim();
  if (text.length < 5) return null;

  for (const risk of allRisks) {
    const rText = risk.statement.toLowerCase();
    
    // Check specific known risk triggers and categories
    if (risk.id === 'R-01' && (text.includes('crm') || text.includes('lead-form') || text.includes('vertical') || (text.includes('api') && (text.includes('field') || text.includes('vendor'))))) return risk;
    if (risk.id === 'R-02' && (text.includes('wcag') || text.includes('accessibility') || text.includes('color-contrast') || text.includes('contrast') || text.includes('a11y') || text.includes('audit'))) return risk;
    if (risk.id === 'R-03' && (text.includes('contractor') || text.includes('frontend sow') || text.includes('vendor x') || text.includes('frontend build delay'))) return risk;
    if (risk.id === 'R-04' && (text.includes('mary') || (text.includes('design') && text.includes('approval')) || text.includes('m04') || text.includes('5-day delay'))) return risk;
    if (risk.id === 'R-05' && (text.includes('bio') || text.includes('consultant') || text.includes('directory') || text.includes('500+'))) return risk;
    if (risk.id === 'R-06' && (text.includes('medical') || text.includes('leave') || text.includes('absence') || text.includes('sick') || text.includes('bill') || text.includes('bob') || text.includes('christine'))) return risk;
    if (risk.id === 'R-07' && (text.includes('outage') || text.includes('cutover') || text.includes('hosting') || text.includes('maintenance window'))) return risk;
    if (risk.id === 'R-08' && (text.includes('gdpr') || text.includes('privacy') || text.includes('cookie') || text.includes('legal compliance'))) return risk;
    if (risk.id === 'R-09' && (text.includes('effort') || text.includes('estimate') || text.includes('cost overrun') || text.includes('optimistic') || text.includes('budget baseline'))) return risk;
    if (risk.id === 'R-10' && (text.includes('lcp') || text.includes('performance') || text.includes('speed') || text.includes('2.5s') || text.includes('slow page'))) return risk;
    if (risk.id === 'R-11' && (text.includes('marketing lead') || text.includes('careers') || text.includes('scope expansion') || text.includes('press') || text.includes('post-design approval'))) return risk;
    if (risk.id === 'R-12' && (text.includes('fy2026') || text.includes('funding') || text.includes('budget pressure') || text.includes('cfo'))) return risk;
    if (risk.id === 'R-13' && (text.includes('handoff') || text.includes('it ops') || text.includes('production support') || text.includes('runbook'))) return risk;

    // Check shared key tokens
    const words = text.split(/[\s,.;:!?]+/).filter(w => w.length > 3 && !['this', 'that', 'with', 'from', 'have', 'been', 'will', 'could', 'should', 'would'].includes(w));
    const rWords = rText.split(/[\s,.;:!?]+/).filter(w => w.length > 3);
    const matches = words.filter(w => rWords.includes(w));
    if (matches.length >= 3) return risk;
  }
  return null;
}
