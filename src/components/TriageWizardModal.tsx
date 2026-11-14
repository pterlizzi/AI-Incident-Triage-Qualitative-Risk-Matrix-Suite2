import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  AlertOctagon, 
  ShieldAlert, 
  CheckCircle2, 
  ArrowRight, 
  AlertTriangle, 
  FileText, 
  DollarSign, 
  Sliders, 
  RefreshCw,
  Ban,
  ExternalLink,
  Lock
} from 'lucide-react';
import { RiskItem, IssueItem, TriageAssessmentResult, ObjectiveImpacts, RiskLevel } from '../types/project';
import { calculateMatrixScore, getRiskLevelBadgeClass, formatCurrency } from '../utils/matrixCalculations';
import { PROBABILITY_DEFINITIONS, IMPACT_DEFINITIONS } from '../data/seedData';

interface TriageWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  risks: RiskItem[];
  issues: IssueItem[];
  onAddRisk: (newRisk: RiskItem) => void;
  onUpdateRisk?: (updatedRisk: RiskItem) => void;
  onAddIssue: (newIssue: IssueItem) => void;
  onExecuteContingencyDraw: (amount: number, description: string, riskId?: string, issueId?: string) => void;
  onSelectRisk?: (risk: RiskItem) => void;
}

const PRESET_INCIDENTS = [
  {
    label: "CRM API Missing Field (Similar to R-01)",
    text: "Vendor call today confirmed that the CRM API does not expose the 'industry vertical' field required for lead routing before go-live.",
  },
  {
    label: "UX Designer Sick Leave (Similar to R-06)",
    text: "Bill (UX designer) has taken unexpected medical leave for 5 business days during the brand design phase.",
  },
  {
    label: "WCAG Contrast Audit Failure (Similar to R-02)",
    text: "Accessibility compliance audit surfaced Severity-1 color contrast issues on primary design system components.",
  },
  {
    label: "Vendor Cutover Maintenance (Similar to R-07)",
    text: "Hosting provider announced a scheduled server maintenance window on November 22, exactly two days before site Go-Live.",
  },
  {
    label: "LCP Performance Target (Similar to R-10)",
    text: "Performance simulation indicates image-heavy consultant directory pages may exceed the target LCP of 2.5 seconds.",
  },
  {
    label: "Sponsor Requesting Scope Add (Similar to R-11)",
    text: "Sponsor Mary is requesting adding a new Press and Media section to the Phase 1 launch deliverable.",
  },
  {
    label: "Unprecedented Hardware Malfunction (Brand New Risk)",
    text: "A fire at the local power substation threatens the physical team office facility for the upcoming sprint.",
  }
];

export const TriageWizardModal: React.FC<TriageWizardModalProps> = ({
  isOpen,
  onClose,
  risks,
  issues,
  onAddRisk,
  onUpdateRisk,
  onAddIssue,
  onExecuteContingencyDraw,
  onSelectRisk,
}) => {
  const [incidentText, setIncidentText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [assessment, setAssessment] = useState<TriageAssessmentResult | null>(null);
  
  // Interactive adjustment overrides
  const [overrideProb, setOverrideProb] = useState<number>(3);
  const [overrideImpacts, setOverrideImpacts] = useState<ObjectiveImpacts>({
    scope: 2,
    quality: 2,
    schedule: 3,
    cost: 2
  });
  const [actionDoneMessage, setActionDoneMessage] = useState<string | null>(null);
  const [drawAmount, setDrawAmount] = useState<number>(1000);

  if (!isOpen) return null;

  const handleRunTriage = async (textToAssess = incidentText) => {
    if (!textToAssess.trim()) return;
    setIsAnalyzing(true);
    setActionDoneMessage(null);

    try {
      const response = await fetch('/api/triage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description: textToAssess,
          currentRisks: risks,
          currentIssues: issues
        })
      });

      if (!response.ok) {
        throw new Error('Server returned an error');
      }

      const data: TriageAssessmentResult = await response.json();
      setAssessment(data);
      setOverrideProb(data.probability);
      setOverrideImpacts(data.impacts);
    } catch (err) {
      console.error('Triage assessment error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Recalculate score live with user overrides
  const liveScoreInfo = calculateMatrixScore(overrideProb, overrideImpacts);

  // Check if matched to any documented risk
  const matchedRisk = assessment?.matchedRiskId 
    ? risks.find(r => r.id === assessment.matchedRiskId)
    : assessment?.similarRiskId 
    ? risks.find(r => r.id === assessment.similarRiskId)
    : null;

  const isDuplicateRisk = Boolean(
    assessment?.isSimilarToExistingRisk || 
    assessment?.matchedRiskId || 
    assessment?.allowNewRiskCreation === false ||
    matchedRisk
  );

  const handleCommitToIssueLog = () => {
    if (!assessment) return;
    const newId = `I-${String(issues.length + 1).padStart(3, '0')}`;
    const newIssue: IssueItem = {
      id: newId,
      type: (assessment.category as any) || 'Technical',
      description: matchedRisk ? `[REALIZED ${matchedRisk.id}]: ${incidentText}` : incidentText,
      priority: liveScoreInfo.score >= 13 ? 'High' : liveScoreInfo.score >= 7 ? 'Medium' : 'Low',
      impactOnObjectives: `Schedule: Level ${overrideImpacts.schedule}, Quality: Level ${overrideImpacts.quality}`,
      owner: assessment.recommendedOwner || 'Pascual Terlizzi (PM)',
      status: 'Open',
      resolution: assessment.matchedContingencyPlan || assessment.recommendedActionPlan,
      comments: matchedRisk 
        ? `Linked to documented risk ${matchedRisk.id}. Calculated Score: ${liveScoreInfo.score} (${liveScoreInfo.level}).`
        : `Triaged via AI RiskPilot. Calculated Score: ${liveScoreInfo.score} (${liveScoreInfo.level}).`
    };

    onAddIssue(newIssue);
    setActionDoneMessage(`Logged as new Issue ${newId} in Issue Log.`);
  };

  const handleCommitToRiskRegister = () => {
    if (!assessment) return;

    // Strict guard: Do NOT allow creating a new risk entry if similar to an existing one
    if (isDuplicateRisk) {
      alert(`Cannot create new risk entry: This risk is already documented under ${matchedRisk?.id || assessment.matchedRiskId}. Update or review that existing risk instead.`);
      return;
    }

    const newId = `R-${String(risks.length + 1).padStart(2, '0')}`;
    const newRisk: RiskItem = {
      id: newId,
      category: (assessment.category as any) || 'Technical',
      statement: incidentText,
      owner: assessment.recommendedOwner || 'Pascual Terlizzi (PM)',
      probability: overrideProb,
      impacts: overrideImpacts,
      score: liveScoreInfo.score,
      level: liveScoreInfo.level,
      strategy: (assessment.responseStrategy as any) || 'Mitigate',
      actionPlan: assessment.recommendedActionPlan,
      responsibleParty: assessment.recommendedOwner || 'Pascual Terlizzi (PM)',
      triggerSymptom: assessment.triggerSymptom || 'Milestone checkpoint variance.',
      residualP: Math.max(1, overrideProb - 1),
      residualScore: Math.round(liveScoreInfo.score / 2),
      status: 'Open',
      comments: `Identified & scored via AI RiskPilot. Required Response: ${liveScoreInfo.thresholdInfo.requiredResponse}`
    };

    onAddRisk(newRisk);
    setActionDoneMessage(`Added to Risk Register as new risk ${newId}.`);
  };

  const handleUpdateExistingRisk = () => {
    if (!matchedRisk || !onUpdateRisk) return;
    const updated: RiskItem = {
      ...matchedRisk,
      probability: overrideProb,
      impacts: overrideImpacts,
      score: liveScoreInfo.score,
      level: liveScoreInfo.level,
      comments: `Re-calibrated via AI Studio Triage. Score: ${liveScoreInfo.score} (${liveScoreInfo.level}). ${matchedRisk.comments || ''}`
    };
    onUpdateRisk(updated);
    setActionDoneMessage(`Updated and re-scored existing documented risk ${matchedRisk.id} in place.`);
  };

  const handleExecuteContingency = () => {
    if (!assessment) return;
    onExecuteContingencyDraw(
      drawAmount,
      `Contingency executed for ${matchedRisk ? matchedRisk.id : 'incident'}: ${incidentText.slice(0, 60)}...`,
      matchedRisk ? matchedRisk.id : assessment.matchedRiskId,
      undefined
    );
    setActionDoneMessage(`Drew ${formatCurrency(drawAmount)} from PM Contingency Reserve.`);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full border border-slate-200 overflow-hidden my-6">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight">AI Incident Triage & Matrix Scoring Studio</h2>
              <p className="text-xs text-slate-400">Classify Issue vs. Risk · Enforce Duplicate Prevention · Calculate 5×5 P×I Matrix</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-md transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Quick Presets */}
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">
              Quick Test from New Company Website Project Documents:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {PRESET_INCIDENTS.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setIncidentText(preset.text);
                    handleRunTriage(preset.text);
                  }}
                  className="text-xs px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors cursor-pointer border border-slate-200"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Incident Input */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Incident or Emerging Threat Description:
            </label>
            <textarea
              rows={3}
              value={incidentText}
              onChange={(e) => setIncidentText(e.target.value)}
              placeholder="e.g. Hosting provider reported planned maintenance window 2 days before cutover; or preliminary accessibility audit detected color contrast failure on brand buttons..."
              className="w-full text-sm p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-slate-900 focus:border-slate-900 outline-none text-slate-900 font-sans"
            />
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs text-slate-400">
                AI evaluates against New Company Website Risk Plan, RBS categories, and $15K contingency protocols.
              </span>
              <button
                disabled={!incidentText.trim() || isAnalyzing}
                onClick={() => handleRunTriage()}
                className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors ${
                  isAnalyzing || !incidentText.trim()
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    : 'bg-slate-900 text-white hover:bg-slate-800 shadow-sm'
                }`}
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-400" />
                    <span>Analyzing Incident...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Run AI Triage & Scoring</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Assessment Result Card */}
          {assessment && (
            <div className="space-y-5 pt-4 border-t border-slate-200">
              {/* Triage Decision Banner */}
              <div className={`p-4 rounded-lg border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                assessment.triageType === 'issue'
                  ? 'bg-rose-50 border-rose-200 text-rose-950'
                  : 'bg-blue-50 border-blue-200 text-blue-950'
              }`}>
                <div>
                  <div className="flex items-center gap-2">
                    {assessment.triageType === 'issue' ? (
                      <AlertOctagon className="w-5 h-5 text-rose-600 shrink-0" />
                    ) : (
                      <ShieldAlert className="w-5 h-5 text-blue-600 shrink-0" />
                    )}
                    <span className="text-sm font-bold">
                      {assessment.triageType === 'issue'
                        ? 'TRIAGE: Track in ISSUE LOG (Realized Problem)'
                        : 'TRIAGE: Track in RISK REGISTER (Uncertain Future Event)'}
                    </span>
                  </div>
                  <p className="text-xs mt-1 text-slate-700 leading-relaxed">
                    {assessment.classificationReason}
                  </p>
                </div>

                <div className="shrink-0 self-end sm:self-center">
                  <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-white border border-slate-300">
                    Category: {assessment.category}
                  </span>
                </div>
              </div>

              {/* DUPLICATE RISK DETECTION BANNER (Mandatory Policy) */}
              {isDuplicateRisk && matchedRisk && (
                <div className="bg-amber-50 border-2 border-amber-400 rounded-lg p-4.5 text-amber-950 shadow-xs">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2 text-amber-900 font-bold text-xs uppercase tracking-wider">
                      <Ban className="w-4 h-4 text-amber-600" />
                      <span>Documented Risk Detected: Matches {matchedRisk.id} · Creation Blocked</span>
                    </div>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-amber-200/80 font-bold text-amber-900">
                      Duplicate Entry Prohibited
                    </span>
                  </div>

                  <p className="text-xs text-amber-950 font-medium mb-2 leading-relaxed">
                    This risk statement is pretty similar to already documented risk <strong>{matchedRisk.id}</strong>: <em>"{matchedRisk.statement}"</em>.
                  </p>

                  <div className="bg-white/90 p-3 rounded-md border border-amber-300 text-xs text-slate-800 space-y-1">
                    <div className="font-semibold text-slate-900 flex items-center justify-between">
                      <span>Documented Pre-Agreed Action Plan ({matchedRisk.id}):</span>
                      <span className="text-[11px] text-slate-500 font-normal">Owner: {matchedRisk.owner}</span>
                    </div>
                    <pre className="font-sans whitespace-pre-wrap text-slate-700 text-xs leading-relaxed">{matchedRisk.actionPlan}</pre>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <span className="text-amber-900 font-medium">
                      ⚠️ <strong>Policy rule:</strong> Because the action is already identified in {matchedRisk.id}, you cannot create a duplicate risk entry. You can re-calibrate its score or execute contingency below.
                    </span>
                    {onSelectRisk && (
                      <button
                        onClick={() => {
                          onSelectRisk(matchedRisk);
                          onClose();
                        }}
                        className="px-2.5 py-1 bg-amber-200 hover:bg-amber-300 text-amber-900 rounded font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <span>View {matchedRisk.id} in Register</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Stakeholder Alerts */}
              {assessment.stakeholderAlerts && assessment.stakeholderAlerts.length > 0 && (
                <div className="space-y-1.5">
                  {assessment.stakeholderAlerts.map((alert, idx) => (
                    <div key={idx} className="bg-red-50 border border-red-200 text-red-900 text-xs p-2.5 rounded-md flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                      <span>{alert}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* 5x5 Matrix Scoring & Calibration Studio */}
              <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
                <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
                  <div className="flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-slate-600" />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                      5×5 Qualitative Scoring & Objective Calibration
                    </span>
                  </div>
                  <span className="text-xs text-slate-500 font-mono">
                    Score = P × max(Impact)
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Probability Calibration */}
                  <div className="bg-slate-50 p-3 rounded border border-slate-200">
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-xs font-semibold text-slate-700">
                        Probability (P): Level {overrideProb}
                      </label>
                      <span className="text-xs font-mono text-slate-500">
                        {overrideProb === 5 ? '>70% (Very High)' : overrideProb === 4 ? '50-70% (High)' : overrideProb === 3 ? '30-50% (Med)' : overrideProb === 2 ? '10-30% (Low)' : '<10% (Very Low)'}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={5}
                      value={overrideProb}
                      onChange={(e) => setOverrideProb(parseInt(e.target.value))}
                      className="w-full accent-slate-900 cursor-pointer"
                    />
                    <p className="text-[11px] text-slate-500 mt-1 italic">
                      {assessment.probabilityReasoning}
                    </p>
                  </div>

                  {/* Impact by 4 Objectives */}
                  <div className="bg-slate-50 p-3 rounded border border-slate-200 space-y-2">
                    <span className="text-xs font-semibold text-slate-700 block mb-1">
                      Objective Impacts (1–5 scale):
                    </span>

                    {/* Scope */}
                    <div className="flex items-center justify-between text-xs">
                      <span className="w-20 font-medium text-slate-700">Scope: {overrideImpacts.scope}</span>
                      <input
                        type="range"
                        min={1}
                        max={5}
                        value={overrideImpacts.scope}
                        onChange={(e) => setOverrideImpacts({ ...overrideImpacts, scope: parseInt(e.target.value) })}
                        className="w-32 accent-slate-900 cursor-pointer"
                      />
                      <span className="w-32 text-right text-[10px] text-slate-500 truncate">
                        {IMPACT_DEFINITIONS.find(d => d.level === overrideImpacts.scope)?.scope}
                      </span>
                    </div>

                    {/* Quality */}
                    <div className="flex items-center justify-between text-xs">
                      <span className="w-20 font-medium text-slate-700">Quality: {overrideImpacts.quality}</span>
                      <input
                        type="range"
                        min={1}
                        max={5}
                        value={overrideImpacts.quality}
                        onChange={(e) => setOverrideImpacts({ ...overrideImpacts, quality: parseInt(e.target.value) })}
                        className="w-32 accent-slate-900 cursor-pointer"
                      />
                      <span className="w-32 text-right text-[10px] text-slate-500 truncate">
                        {IMPACT_DEFINITIONS.find(d => d.level === overrideImpacts.quality)?.quality}
                      </span>
                    </div>

                    {/* Schedule */}
                    <div className="flex items-center justify-between text-xs">
                      <span className="w-20 font-medium text-slate-700">Schedule: {overrideImpacts.schedule}</span>
                      <input
                        type="range"
                        min={1}
                        max={5}
                        value={overrideImpacts.schedule}
                        onChange={(e) => setOverrideImpacts({ ...overrideImpacts, schedule: parseInt(e.target.value) })}
                        className="w-32 accent-slate-900 cursor-pointer"
                      />
                      <span className="w-32 text-right text-[10px] text-slate-500 truncate">
                        {IMPACT_DEFINITIONS.find(d => d.level === overrideImpacts.schedule)?.time}
                      </span>
                    </div>

                    {/* Cost */}
                    <div className="flex items-center justify-between text-xs">
                      <span className="w-20 font-medium text-slate-700">Cost: {overrideImpacts.cost}</span>
                      <input
                        type="range"
                        min={1}
                        max={5}
                        value={overrideImpacts.cost}
                        onChange={(e) => setOverrideImpacts({ ...overrideImpacts, cost: parseInt(e.target.value) })}
                        className="w-32 accent-slate-900 cursor-pointer"
                      />
                      <span className="w-32 text-right text-[10px] text-slate-500 truncate">
                        {IMPACT_DEFINITIONS.find(d => d.level === overrideImpacts.cost)?.cost}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Score Outcome Badge Banner */}
                <div className="mt-4 p-4 rounded-lg bg-slate-900 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs uppercase tracking-wider text-slate-400">Calculated Score</span>
                      <span className="text-2xl font-bold font-mono text-amber-400">
                        {liveScoreInfo.score}
                      </span>
                      <span className="text-xs text-slate-400">
                        (P:{overrideProb} × Max:{liveScoreInfo.maxImpact})
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded font-bold border ${getRiskLevelBadgeClass(liveScoreInfo.level)}`}>
                        {liveScoreInfo.level}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      <strong className="text-white">Required Response Protocol:</strong> {liveScoreInfo.thresholdInfo.requiredResponse}
                    </p>
                  </div>

                  <div className="text-right text-xs text-slate-400">
                    <div>Owner: <span className="text-white font-medium">{assessment.recommendedOwner}</span></div>
                    <div>Strategy: <span className="text-white font-medium">{assessment.responseStrategy}</span></div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-3">
                  Commit To Project Documentation:
                </span>

                {actionDoneMessage ? (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>{actionDoneMessage}</span>
                  </div>
                ) : (
                  <div className="flex flex-wrap items-center gap-3">
                    {/* If triaged as an issue (realized problem) */}
                    {assessment.triageType === 'issue' ? (
                      <button
                        onClick={handleCommitToIssueLog}
                        className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-md text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <FileText className="w-4 h-4" />
                        <span>
                          {matchedRisk 
                            ? `Log Realized Issue (${matchedRisk.id} -> ${issues.length + 1})` 
                            : `Commit to Issue Log (${issues.length + 1})`}
                        </span>
                      </button>
                    ) : (
                      /* If triaged as a risk (potential future event) */
                      <>
                        {isDuplicateRisk ? (
                          <>
                            {/* Disabled block button */}
                            <button
                              disabled
                              title="Creation blocked: pretty similar to an already documented risk"
                              className="px-4 py-2 bg-slate-200 text-slate-500 rounded-md text-xs font-semibold flex items-center gap-1.5 cursor-not-allowed border border-slate-300"
                            >
                              <Lock className="w-3.5 h-3.5 text-slate-400" />
                              <span>New Risk Blocked (Already in {matchedRisk?.id || assessment.matchedRiskId})</span>
                            </button>

                            {/* Allowed action: update existing documented risk */}
                            {matchedRisk && onUpdateRisk && (
                              <button
                                onClick={handleUpdateExistingRisk}
                                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-md text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                              >
                                <RefreshCw className="w-4 h-4 text-amber-400" />
                                <span>Update Existing Risk ({matchedRisk.id})</span>
                              </button>
                            )}
                          </>
                        ) : (
                          /* Only allow new risk creation if truly distinct */
                          <button
                            onClick={handleCommitToRiskRegister}
                            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-md text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                          >
                            <FileText className="w-4 h-4" />
                            <span>Commit New Risk to Register ({risks.length + 1})</span>
                          </button>
                        )}
                      </>
                    )}

                    {/* Contingency draw option if matched to an existing risk */}
                    {matchedRisk && (
                      <div className="flex items-center gap-2 border-l border-slate-200 pl-3">
                        <input
                          type="number"
                          step={500}
                          value={drawAmount}
                          onChange={(e) => setDrawAmount(parseInt(e.target.value) || 0)}
                          className="w-24 px-2 py-1.5 bg-white border border-slate-300 rounded text-xs font-mono"
                        />
                        <button
                          onClick={handleExecuteContingency}
                          className="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-md text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                        >
                          <DollarSign className="w-4 h-4" />
                          <span>Draw Contingency ({matchedRisk.id})</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-700 hover:text-slate-900 bg-white border border-slate-200 rounded-md transition-colors cursor-pointer"
          >
            Close Studio
          </button>
        </div>
      </div>
    </div>
  );
};
