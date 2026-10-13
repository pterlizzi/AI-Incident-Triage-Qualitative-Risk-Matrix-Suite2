/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { RiskItem, IssueItem, ContingencyReserve, ContingencyDraw } from './types/project';
import { 
  INITIAL_RISKS, 
  INITIAL_ISSUES, 
  INITIAL_CONTINGENCY, 
  INITIAL_PROJECT_INFO 
} from './data/seedData';
import { Header } from './components/Header';
import { KPIBar } from './components/KPIBar';
import { MatrixHeatmapView } from './components/MatrixHeatmapView';
import { RiskRegisterView } from './components/RiskRegisterView';
import { IssueLogView } from './components/IssueLogView';
import { ContingencyTrackerView } from './components/ContingencyTrackerView';
import { TriageWizardModal } from './components/TriageWizardModal';
import { GovernanceReferenceModal } from './components/GovernanceReferenceModal';
import { Sparkles, RotateCcw, AlertTriangle, ShieldCheck, ArrowRight } from 'lucide-react';

export default function App() {
  // Load state from localStorage or seed
  const [risks, setRisks] = useState<RiskItem[]>(() => {
    try {
      const saved = localStorage.getItem('riskpilot_risks');
      return saved ? JSON.parse(saved) : INITIAL_RISKS;
    } catch {
      return INITIAL_RISKS;
    }
  });

  const [issues, setIssues] = useState<IssueItem[]>(() => {
    try {
      const saved = localStorage.getItem('riskpilot_issues');
      return saved ? JSON.parse(saved) : INITIAL_ISSUES;
    } catch {
      return INITIAL_ISSUES;
    }
  });

  const [contingency, setContingency] = useState<ContingencyReserve>(() => {
    try {
      const saved = localStorage.getItem('riskpilot_contingency');
      return saved ? JSON.parse(saved) : INITIAL_CONTINGENCY;
    } catch {
      return INITIAL_CONTINGENCY;
    }
  });

  const [activeTab, setActiveTab] = useState<'matrix' | 'triage' | 'risks' | 'issues' | 'contingency'>('triage');
  const [isTriageModalOpen, setIsTriageModalOpen] = useState(false);
  const [isGovernanceModalOpen, setIsGovernanceModalOpen] = useState(false);
  const [selectedRiskFromMatrix, setSelectedRiskFromMatrix] = useState<RiskItem | null>(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('riskpilot_risks', JSON.stringify(risks));
  }, [risks]);

  useEffect(() => {
    localStorage.setItem('riskpilot_issues', JSON.stringify(issues));
  }, [issues]);

  useEffect(() => {
    localStorage.setItem('riskpilot_contingency', JSON.stringify(contingency));
  }, [contingency]);

  const handleResetData = () => {
    if (window.confirm("Reset all project data back to the Mary's Consulting baseline?")) {
      setRisks(INITIAL_RISKS);
      setIssues(INITIAL_ISSUES);
      setContingency(INITIAL_CONTINGENCY);
      localStorage.removeItem('riskpilot_risks');
      localStorage.removeItem('riskpilot_issues');
      localStorage.removeItem('riskpilot_contingency');
    }
  };

  const handleAddRisk = (newRisk: RiskItem) => {
    setRisks(prev => [newRisk, ...prev]);
  };

  const handleUpdateRisk = (updated: RiskItem) => {
    setRisks(prev => prev.map(r => r.id === updated.id ? updated : r));
  };

  const handleAddIssue = (newIssue: IssueItem) => {
    setIssues(prev => [newIssue, ...prev]);
  };

  const handleUpdateIssue = (updated: IssueItem) => {
    setIssues(prev => prev.map(i => i.id === updated.id ? updated : i));
  };

  const handlePromoteRiskToIssue = (risk: RiskItem) => {
    // 1. Mark risk as realized
    handleUpdateRisk({ ...risk, status: 'Realized' });

    const mapCategoryToIssueType = (cat: string): IssueItem['type'] => {
      if (cat === 'Technical') return 'Technical';
      if (cat === 'External') return 'External';
      if (cat === 'Organizational') return 'Resource';
      if (cat === 'Project Mgmt') return 'Process';
      return 'Scope';
    };

    const newIssueId = `I-${String(issues.length + 1).padStart(3, '0')}`;
    const newIssue: IssueItem = {
      id: newIssueId,
      type: mapCategoryToIssueType(risk.category),
      description: `[REALIZED ${risk.id}]: ${risk.statement}`,
      priority: risk.level === 'Critical' || risk.level === 'High' ? 'High' : risk.level === 'Medium-High' || risk.level === 'Medium' ? 'Medium' : 'Low',
      impactOnObjectives: `Schedule: Level ${risk.impacts.schedule}, Cost: Level ${risk.impacts.cost}, Quality: Level ${risk.impacts.quality}`,
      owner: risk.owner,
      status: 'Open',
      resolution: risk.actionPlan,
      comments: `Promoted from Risk Register ${risk.id}. Trigger: ${risk.triggerSymptom}`
    };
    handleAddIssue(newIssue);
    setActiveTab('issues');
  };

  const handleExecuteContingencyDraw = (amount: number, description: string, riskId?: string, issueId?: string) => {
    const newDraw: ContingencyDraw = {
      id: `DRAW-${String(contingency.draws.length + 1).padStart(3, '0')}`,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      amount,
      description,
      riskId,
      issueId,
      authorizedBy: 'Andrew (PM)',
      sponsorNotified: amount > 5000
    };
    setContingency(prev => ({
      ...prev,
      draws: [newDraw, ...prev.draws]
    }));
  };

  const handleSelectRiskFromMatrix = (risk: RiskItem) => {
    setSelectedRiskFromMatrix(risk);
    setActiveTab('risks');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-amber-100 selection:text-slate-900">
      {/* Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenTriageModal={() => setIsTriageModalOpen(true)}
        onOpenGovernanceModal={() => setIsGovernanceModalOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Project Header Banner */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Active Project
              </span>
              <span className="text-xs font-mono text-slate-400">·</span>
              <span className="text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-medium border border-emerald-200">
                Go-Live Target: Nov 2026
              </span>
            </div>
            <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight mt-0.5">
              {INITIAL_PROJECT_INFO.title}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleResetData}
              title="Reset data back to seed state"
              className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Baseline</span>
            </button>
            <button
              onClick={() => setIsTriageModalOpen(true)}
              className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Launch Triage Studio</span>
            </button>
          </div>
        </div>

        {/* Hero KPI Strip */}
        <KPIBar
          risks={risks}
          issues={issues}
          contingency={contingency}
          onSelectTab={setActiveTab}
        />

        {/* Tab Views */}
        {activeTab === 'triage' && (
          <div className="space-y-6">
            {/* Triage Overview Hero Box */}
            <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs">
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold mb-3">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>AI-Powered Incident Triage & Automated Scoring</span>
                </div>
                <h2 className="text-xl font-bold tracking-tight text-slate-900">
                  Automate the PM Decision Pipeline
                </h2>
                <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                  Eliminate recurring manual lookup overhead. When an incident occurs or an uncertainty is identified, RiskPilot assesses whether it belongs in the <strong>Issue Log</strong> or <strong>Risk Register</strong>, searches for existing pre-planned contingencies, evaluates probability and impact against your 5×5 matrix definitions, and computes the exact governance response.
                </p>

                <div className="mt-5 flex flex-wrap gap-3">
                  <button
                    onClick={() => setIsTriageModalOpen(true)}
                    className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg flex items-center gap-2 cursor-pointer shadow-sm transition-colors"
                  >
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>Open Interactive Triage Studio</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                  <button
                    onClick={() => setActiveTab('matrix')}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-medium rounded-lg flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <span>View 5×5 Heatmap Matrix</span>
                  </button>
                </div>
              </div>

              {/* 3 Step Architecture explanation */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 pt-6 border-t border-slate-100 text-xs">
                <div className="bg-slate-50 p-3.5 rounded border border-slate-200">
                  <span className="font-bold text-slate-900 block mb-1">Step 1: Realized vs. Potential Triage</span>
                  <p className="text-slate-600 leading-relaxed">
                    Determines if an impediment has materialized (tracks in <strong>Issue Log</strong>) or remains a future probability (tracks in <strong>Risk Register</strong>).
                  </p>
                </div>
                <div className="bg-slate-50 p-3.5 rounded border border-slate-200">
                  <span className="font-bold text-slate-900 block mb-1">Step 2: Contingency Check</span>
                  <p className="text-slate-600 leading-relaxed">
                    Instantly cross-references the 15 project risks (R-01–R-15) and retrieves the pre-approved action plan and contingency allocation.
                  </p>
                </div>
                <div className="bg-slate-50 p-3.5 rounded border border-slate-200">
                  <span className="font-bold text-slate-900 block mb-1">Step 3: 5×5 Scoring & SLA Match</span>
                  <p className="text-slate-600 leading-relaxed">
                    Calculates <span className="font-mono font-semibold">P × max(Impact)</span> across Scope, Quality, Schedule, Cost and outputs the documented Required Response.
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Matrix Overview on Triage Page */}
            <MatrixHeatmapView
              risks={risks}
              onSelectRisk={handleSelectRiskFromMatrix}
              onOpenTriageModal={() => setIsTriageModalOpen(true)}
            />
          </div>
        )}

        {activeTab === 'matrix' && (
          <MatrixHeatmapView
            risks={risks}
            onSelectRisk={handleSelectRiskFromMatrix}
            onOpenTriageModal={() => setIsTriageModalOpen(true)}
          />
        )}

        {activeTab === 'risks' && (
          <RiskRegisterView
            risks={risks}
            onAddRisk={handleAddRisk}
            onUpdateRisk={handleUpdateRisk}
            onPromoteToIssue={handlePromoteRiskToIssue}
            onOpenTriageModal={() => setIsTriageModalOpen(true)}
            selectedRiskFromMatrix={selectedRiskFromMatrix}
          />
        )}

        {activeTab === 'issues' && (
          <IssueLogView
            issues={issues}
            onUpdateIssue={handleUpdateIssue}
            onOpenTriageModal={() => setIsTriageModalOpen(true)}
          />
        )}

        {activeTab === 'contingency' && (
          <ContingencyTrackerView
            contingency={contingency}
            risks={risks}
            issues={issues}
            onAddDraw={(draw) => {
              setContingency(prev => ({
                ...prev,
                draws: [draw, ...prev.draws]
              }));
            }}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 mt-auto text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            <span>RiskPilot · PMBOK 8th-Edition Risk & Issues Engine</span>
            <span className="hidden sm:inline-block ml-2 text-slate-400">|</span>
            <span className="ml-2 font-mono text-[11px] text-slate-400">Mary's Consulting Website Project</span>
          </div>
          <div className="flex items-center gap-4 text-slate-500">
            <button 
              onClick={() => setIsGovernanceModalOpen(true)}
              className="hover:text-slate-900 cursor-pointer"
            >
              Governance Thresholds
            </button>
            <span>·</span>
            <span>Contingency Reserve: $15,000</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <TriageWizardModal
        isOpen={isTriageModalOpen}
        onClose={() => setIsTriageModalOpen(false)}
        risks={risks}
        issues={issues}
        onAddRisk={handleAddRisk}
        onUpdateRisk={handleUpdateRisk}
        onAddIssue={handleAddIssue}
        onExecuteContingencyDraw={handleExecuteContingencyDraw}
        onSelectRisk={handleSelectRiskFromMatrix}
      />

      <GovernanceReferenceModal
        isOpen={isGovernanceModalOpen}
        onClose={() => setIsGovernanceModalOpen(false)}
      />
    </div>
  );
}
