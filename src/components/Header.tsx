import React from 'react';
import { ShieldAlert, BookOpen, PlusCircle } from 'lucide-react';

interface HeaderProps {
  activeTab: 'matrix' | 'triage' | 'risks' | 'issues' | 'contingency';
  setActiveTab: (tab: 'matrix' | 'triage' | 'risks' | 'issues' | 'contingency') => void;
  onOpenTriageModal: () => void;
  onOpenGovernanceModal: () => void;
  onOpenWelcomeModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenTriageModal,
  onOpenGovernanceModal,
  onOpenWelcomeModal,
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single text wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-lg shadow-sm">
              <ShieldAlert className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap">
                RiskPilot
              </span>
              <span className="hidden sm:inline-block ml-2 text-xs text-slate-500 font-medium border-l border-slate-200 pl-2">
                New Company Website
              </span>
            </div>
          </div>

          {/* Zone 2: Navigation tabs */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
            <button
              onClick={() => setActiveTab('triage')}
              className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
                activeTab === 'triage'
                  ? 'bg-slate-100 text-slate-900 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Incident Triage
            </button>
            <button
              onClick={() => setActiveTab('matrix')}
              className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
                activeTab === 'matrix'
                  ? 'bg-slate-100 text-slate-900 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              5×5 Risk Matrix
            </button>
            <button
              onClick={() => setActiveTab('risks')}
              className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
                activeTab === 'risks'
                  ? 'bg-slate-100 text-slate-900 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Risk Register
            </button>
            <button
              onClick={() => setActiveTab('issues')}
              className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
                activeTab === 'issues'
                  ? 'bg-slate-100 text-slate-900 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Issue Log
            </button>
            <button
              onClick={() => setActiveTab('contingency')}
              className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
                activeTab === 'contingency'
                  ? 'bg-slate-100 text-slate-900 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Contingency Reserve
            </button>
          </nav>

          {/* Zone 3: Primary Action & Governance */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onOpenWelcomeModal}
              title="Welcome Tour & First-Time User Guide"
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-medium border border-slate-200 cursor-pointer"
            >
              <span className="hidden sm:inline">Guide</span>
            </button>
            <button
              onClick={onOpenGovernanceModal}
              title="View New Company Website PMBOK Risk Management Plan"
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-medium border border-slate-200 cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-slate-500" />
              <span className="hidden sm:inline">Governance Plan</span>
            </button>
            <button
              onClick={onOpenTriageModal}
              className="px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 text-amber-400" />
              <span>Triage Incident</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile nav bar */}
      <div className="md:hidden flex items-center overflow-x-auto px-4 py-2 bg-slate-50 border-t border-slate-200 gap-1 text-xs font-medium">
        <button
          onClick={() => setActiveTab('triage')}
          className={`px-2.5 py-1 rounded whitespace-nowrap ${activeTab === 'triage' ? 'bg-white shadow-xs text-slate-900 font-semibold' : 'text-slate-600'}`}
        >
          Triage Studio
        </button>
        <button
          onClick={() => setActiveTab('matrix')}
          className={`px-2.5 py-1 rounded whitespace-nowrap ${activeTab === 'matrix' ? 'bg-white shadow-xs text-slate-900 font-semibold' : 'text-slate-600'}`}
        >
          5×5 Matrix
        </button>
        <button
          onClick={() => setActiveTab('risks')}
          className={`px-2.5 py-1 rounded whitespace-nowrap ${activeTab === 'risks' ? 'bg-white shadow-xs text-slate-900 font-semibold' : 'text-slate-600'}`}
        >
          Risk Register
        </button>
        <button
          onClick={() => setActiveTab('issues')}
          className={`px-2.5 py-1 rounded whitespace-nowrap ${activeTab === 'issues' ? 'bg-white shadow-xs text-slate-900 font-semibold' : 'text-slate-600'}`}
        >
          Issue Log
        </button>
        <button
          onClick={() => setActiveTab('contingency')}
          className={`px-2.5 py-1 rounded whitespace-nowrap ${activeTab === 'contingency' ? 'bg-white shadow-xs text-slate-900 font-semibold' : 'text-slate-600'}`}
        >
          Contingency
        </button>
      </div>
    </header>
  );
};
