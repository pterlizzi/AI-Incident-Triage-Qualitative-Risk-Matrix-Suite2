import React from 'react';
import { 
  X, 
  Sparkles, 
  ShieldAlert, 
  CheckCircle2, 
  ArrowRight, 
  Grid, 
  DollarSign, 
  BookOpen, 
  Compass,
  Ban
} from 'lucide-react';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLaunchTriage: () => void;
  onExploreMatrix: () => void;
}

export const WelcomeModal: React.FC<WelcomeModalProps> = ({
  isOpen,
  onClose,
  onLaunchTriage,
  onExploreMatrix,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden my-6">
        {/* Header */}
        <div className="px-6 py-5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center font-bold shadow-xs">
              <Compass className="w-5 h-5 text-slate-900" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-semibold">
                  First-Time Guide
                </span>
                <span className="text-slate-400">·</span>
                <span className="text-xs text-slate-400">PMBOK 8th Edition</span>
              </div>
              <h2 className="text-lg font-bold tracking-tight text-white mt-0.5">
                Welcome to RiskPilot
              </h2>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-md transition-colors cursor-pointer"
            aria-label="Close welcome guide"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto text-xs text-slate-700">
          {/* Mission statement */}
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <h3 className="font-bold text-slate-900 text-sm mb-1">
              What RiskPilot Does
            </h3>
            <p className="text-slate-600 leading-relaxed">
              RiskPilot solves the most recurring, time-consuming challenge in project management: 
              distinguishing whether an incident is an active problem that belongs in the <strong>Issue Log</strong> or an uncertain future condition that belongs in the <strong>Risk Register</strong>. It cross-references your project documentation, enforces contingency protocols, and automates 5×5 qualitative matrix scoring.
            </p>
          </div>

          {/* Key Features Grid */}
          <div>
            <h4 className="font-bold uppercase tracking-wider text-slate-900 text-xs mb-3">
              Core Capabilities
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Feature 1 */}
              <div className="p-3.5 bg-white rounded-lg border border-slate-200 space-y-1">
                <div className="flex items-center gap-2 text-slate-900 font-semibold text-xs">
                  <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>AI Incident Triage</span>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Enter any raw incident; Gemini analyzes whether it has already occurred or remains a threat, linking existing pre-planned contingencies.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="p-3.5 bg-white rounded-lg border border-slate-200 space-y-1">
                <div className="flex items-center gap-2 text-slate-900 font-semibold text-xs">
                  <Ban className="w-4 h-4 text-rose-500 shrink-0" />
                  <span>Duplicate Risk Prevention</span>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Automatically flags when a new threat is similar to an already documented risk, blocking duplicate entries so you execute established action plans.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="p-3.5 bg-white rounded-lg border border-slate-200 space-y-1">
                <div className="flex items-center gap-2 text-slate-900 font-semibold text-xs">
                  <Grid className="w-4 h-4 text-blue-500 shrink-0" />
                  <span>5×5 Risk Matrix Heatmap</span>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Calculates <span className="font-mono font-semibold">P × max(Impact)</span> across Scope, Quality, Schedule, Cost and maps exact required response timelines.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="p-3.5 bg-white rounded-lg border border-slate-200 space-y-1">
                <div className="flex items-center gap-2 text-slate-900 font-semibold text-xs">
                  <DollarSign className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Contingency Reserve Tracker</span>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Monitors the PM's $15,000 contingency reserve with automated triggers for the $5,000 single-event sponsor notification rule.
                </p>
              </div>
            </div>
          </div>

          {/* Where to start steps */}
          <div className="bg-amber-50/70 p-4 rounded-lg border border-amber-200">
            <h4 className="font-bold text-amber-950 text-xs uppercase tracking-wider mb-2">
              Where to Start
            </h4>
            <ol className="space-y-2 text-[11px] text-amber-900 leading-relaxed list-decimal list-inside">
              <li>
                <strong>Try the Triage Studio:</strong> Click the <em>"Triage Incident"</em> button in the header or use one of the pre-loaded incident presets (like the CRM API field issue or UX designer sick leave) to see the automated decision tree.
              </li>
              <li>
                <strong>Inspect the 5×5 Matrix:</strong> Click any coordinate on the visual heatmap to drill down into active project risks and review required SLAs.
              </li>
              <li>
                <strong>Review Governance Rules:</strong> Click <em>"Governance Plan"</em> in the top navigation to view New Company Website stakeholder tolerances and scoring rubrics.
              </li>
            </ol>
          </div>
        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="text-xs text-slate-500 hover:text-slate-800 underline order-2 sm:order-1 cursor-pointer"
          >
            Don't show again on startup
          </button>

          <div className="flex items-center gap-2.5 order-1 sm:order-2 w-full sm:w-auto">
            <button
              onClick={() => {
                onClose();
                onExploreMatrix();
              }}
              className="px-3.5 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white border border-slate-200 rounded-lg transition-colors cursor-pointer w-full sm:w-auto text-center"
            >
              Explore 5×5 Matrix
            </button>
            <button
              onClick={() => {
                onClose();
                onLaunchTriage();
              }}
              className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs w-full sm:w-auto text-center"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Launch Triage Studio</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
