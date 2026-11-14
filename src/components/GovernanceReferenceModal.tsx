import React from 'react';
import { X, BookOpen, ShieldCheck, Scale, DollarSign, Calendar } from 'lucide-react';
import { 
  PROBABILITY_DEFINITIONS, 
  IMPACT_DEFINITIONS, 
  MATRIX_THRESHOLDS, 
  STAKEHOLDER_TOLERANCES, 
  INITIAL_PROJECT_INFO 
} from '../data/seedData';

interface GovernanceReferenceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GovernanceReferenceModal: React.FC<GovernanceReferenceModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full border border-slate-200 overflow-hidden my-6">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-500 text-white flex items-center justify-center font-bold">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight">Risk Management Plan & Governance Reference</h2>
              <p className="text-xs text-slate-400">{INITIAL_PROJECT_INFO.title} · Prepared May 19, 2026 · PMBOK 8th Edition</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-md transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto text-xs text-slate-700">
          {/* Strategy & Roles */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <span className="font-bold text-slate-900 text-xs uppercase tracking-wider block mb-2">
                1. Project Strategy & Core Rule
              </span>
              <p className="leading-relaxed text-slate-600">
                <strong>Balanced Risk Strategy:</strong> Actively identify and mitigate threats that could impair the November 2026 Go-Live, while pursuing a moderate appetite for opportunities that improve scope or schedule.
              </p>
              <div className="mt-3 p-2.5 bg-blue-50 rounded border border-blue-200 text-blue-950 font-medium">
                <strong>Core Rule:</strong> An incident that has already occurred is tracked in the <em>Issue Log</em>. Uncertain potential events are scored in the <em>Risk Register</em>.
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <span className="font-bold text-slate-900 text-xs uppercase tracking-wider block mb-2">
                2. Key Roles & Authority
              </span>
              <ul className="space-y-1.5 text-slate-600">
                <li><strong>Sponsor (Mary):</strong> Owns project-level risk acceptance, approves management reserve (&gt;$7.5K).</li>
                <li><strong>Project Manager (Pascual Terlizzi):</strong> Maintains Risk Register, facilitates analysis, allocates up to $15K contingency.</li>
                <li><strong>Risk Owners:</strong> Responsible for executing the documented mitigation plan and tracking triggers.</li>
                <li><strong>Team Members (Bob, Bill, Christine):</strong> Identify domain risks, execute technical mitigations.</li>
              </ul>
            </div>
          </div>

          {/* RBS (Risk Breakdown Structure) */}
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <span className="font-bold text-slate-900 text-xs uppercase tracking-wider block mb-2">
              3. Risk Breakdown Structure (RBS) Categories
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-white p-2.5 rounded border border-slate-200">
                <span className="font-bold text-slate-800 block">1.1 Technical</span>
                <span className="text-[11px] text-slate-500">Requirements, Technology Stack, Integration (CRM, CMS), Performance, Quality, Accessibility (WCAG).</span>
              </div>
              <div className="bg-white p-2.5 rounded border border-slate-200">
                <span className="font-bold text-slate-800 block">1.2 External</span>
                <span className="text-[11px] text-slate-500">Vendor / Contractor, Regulatory (GDPR, WCAG), Market, Hosting / Infrastructure.</span>
              </div>
              <div className="bg-white p-2.5 rounded border border-slate-200">
                <span className="font-bold text-slate-800 block">1.3 Organizational</span>
                <span className="text-[11px] text-slate-500">Funding / Budget, Resource Availability, Sponsor / Stakeholder, Priorities & Dependencies.</span>
              </div>
              <div className="bg-white p-2.5 rounded border border-slate-200">
                <span className="font-bold text-slate-800 block">1.4 Project Management</span>
                <span className="text-[11px] text-slate-500">Estimating, Planning, Communication, Controls & Reporting.</span>
              </div>
            </div>
          </div>

          {/* Stakeholder Risk Tolerances */}
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <span className="font-bold text-slate-900 text-xs uppercase tracking-wider block mb-2">
              4. Stakeholder Risk Tolerances
            </span>
            <div className="space-y-2">
              {STAKEHOLDER_TOLERANCES.map(st => (
                <div key={st.stakeholder} className="bg-white p-2.5 rounded border border-slate-200 flex flex-col sm:flex-row justify-between gap-1">
                  <span className="font-bold text-slate-800 sm:w-56 shrink-0">{st.stakeholder}</span>
                  <span className="text-slate-600">{st.tolerance}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 5x5 Matrix Thresholds and Required Responses */}
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <span className="font-bold text-slate-900 text-xs uppercase tracking-wider block mb-2">
              5. 5×5 Probability and Impact Matrix Score Thresholds
            </span>
            <div className="overflow-x-auto">
              <table className="w-full text-left bg-white rounded border border-slate-200">
                <thead className="bg-slate-100 text-slate-700 font-semibold uppercase text-[11px]">
                  <tr>
                    <th className="py-2 px-3">Score Range</th>
                    <th className="py-2 px-3">Risk Level</th>
                    <th className="py-2 px-4">Documented Required Response</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {MATRIX_THRESHOLDS.map(th => (
                    <tr key={th.level}>
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-900">{th.range}</td>
                      <td className="py-2.5 px-3 font-semibold text-slate-800">{th.level}</td>
                      <td className="py-2.5 px-4 text-slate-700">{th.requiredResponse}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Impact Scale by Objective */}
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <span className="font-bold text-slate-900 text-xs uppercase tracking-wider block mb-2">
              6. Definitions of Impact by Project Objective (1–5 Scale)
            </span>
            <div className="overflow-x-auto">
              <table className="w-full text-left bg-white rounded border border-slate-200 text-xs">
                <thead className="bg-slate-100 text-slate-700 font-semibold uppercase text-[11px]">
                  <tr>
                    <th className="py-2 px-3 w-20">Level</th>
                    <th className="py-2 px-3">Scope</th>
                    <th className="py-2 px-3">Quality</th>
                    <th className="py-2 px-3">Time / Schedule</th>
                    <th className="py-2 px-3">Cost Baseline</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {IMPACT_DEFINITIONS.map(d => (
                    <tr key={d.level}>
                      <td className="py-2 px-3 font-bold text-slate-900">
                        {d.level} ({d.name})
                      </td>
                      <td className="py-2 px-3 text-slate-700">{d.scope}</td>
                      <td className="py-2 px-3 text-slate-700">{d.quality}</td>
                      <td className="py-2 px-3 text-slate-700 font-mono">{d.time}</td>
                      <td className="py-2 px-3 text-slate-700 font-mono">{d.cost}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-md hover:bg-slate-800 cursor-pointer"
          >
            Close Reference
          </button>
        </div>
      </div>
    </div>
  );
};
