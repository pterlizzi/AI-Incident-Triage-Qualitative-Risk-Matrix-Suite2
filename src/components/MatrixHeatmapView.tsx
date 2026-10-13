import React, { useState } from 'react';
import { RiskItem } from '../types/project';
import { MATRIX_THRESHOLDS, PROBABILITY_DEFINITIONS, IMPACT_DEFINITIONS } from '../data/seedData';
import { getCellBgColor, getRiskLevelBadgeClass } from '../utils/matrixCalculations';
import { Info, Filter, ArrowUpRight, CheckCircle2 } from 'lucide-react';

interface MatrixHeatmapViewProps {
  risks: RiskItem[];
  onSelectRisk: (risk: RiskItem) => void;
  onOpenTriageModal: () => void;
}

export const MatrixHeatmapView: React.FC<MatrixHeatmapViewProps> = ({
  risks,
  onSelectRisk,
  onOpenTriageModal,
}) => {
  const [selectedCell, setSelectedCell] = useState<{ p: number; impact: number } | null>(null);
  const [selectedThresholdLevel, setSelectedThresholdLevel] = useState<string | null>(null);
  const [showRubricDetails, setShowRubricDetails] = useState<boolean>(false);

  // Filter risks
  const filteredRisks = risks.filter(risk => {
    const maxImp = Math.max(risk.impacts.scope, risk.impacts.quality, risk.impacts.schedule, risk.impacts.cost);
    if (selectedCell) {
      return risk.probability === selectedCell.p && maxImp === selectedCell.impact;
    }
    if (selectedThresholdLevel) {
      return risk.level === selectedThresholdLevel;
    }
    return true;
  });

  const probabilities = [5, 4, 3, 2, 1];
  const impacts = [1, 2, 3, 4, 5];

  const getImpactName = (val: number) => {
    switch (val) {
      case 5: return 'Very High';
      case 4: return 'High';
      case 3: return 'Medium';
      case 2: return 'Low';
      case 1: return 'Very Low';
      default: return '';
    }
  };

  const getProbName = (val: number) => {
    switch (val) {
      case 5: return 'Very High (>70%)';
      case 4: return 'High (50–70%)';
      case 3: return 'Medium (30–50%)';
      case 2: return 'Low (10–30%)';
      case 1: return 'Very Low (<10%)';
      default: return '';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Control Bar */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                5×5 Probability & Impact Risk Matrix
              </h2>
              <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono font-medium">
                Score = P × max(Impact)
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl">
              Qualitative risk rating evaluating Scope, Quality, Schedule, and Cost objectives. Click any cell or threshold band to filter risks and review documented response protocols.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setShowRubricDetails(!showRubricDetails)}
              className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Info className="w-3.5 h-3.5 text-slate-500" />
              <span>{showRubricDetails ? 'Hide Rubrics' : 'View P & I Rubrics'}</span>
            </button>
            <button
              onClick={onOpenTriageModal}
              className="px-3 py-1.5 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-md transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span>+ Score Incident</span>
            </button>
          </div>
        </div>

        {/* Optional Rubric Drawer */}
        {showRubricDetails && (
          <div className="mt-5 pt-4 border-t border-slate-200 grid grid-cols-1 lg:grid-cols-2 gap-4 text-xs">
            <div className="bg-slate-50 p-3.5 rounded-md border border-slate-200">
              <span className="font-semibold text-slate-900 block mb-2">Probability Scale (1–5)</span>
              <div className="space-y-1.5">
                {PROBABILITY_DEFINITIONS.map(p => (
                  <div key={p.level} className="flex justify-between items-baseline text-slate-600">
                    <span className="font-medium text-slate-800">
                      Level {p.level} · {p.name} ({p.range})
                    </span>
                    <span className="text-right text-slate-500 text-[11px]">{p.description}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-md border border-slate-200">
              <span className="font-semibold text-slate-900 block mb-2">Impact by Objective Rubric</span>
              <div className="space-y-1.5">
                {IMPACT_DEFINITIONS.map(imp => (
                  <div key={imp.level} className="text-slate-600 border-b border-slate-200/60 pb-1 last:border-0 last:pb-0">
                    <span className="font-medium text-slate-800 block">
                      Level {imp.level} ({imp.name}):
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Time: {imp.time} · Cost: {imp.cost} · Scope: {imp.scope} · Quality: {imp.quality}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Grid + Threshold Cards Container */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Heatmap Matrix: 8 cols on xl */}
        <div className="xl:col-span-8 bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Matrix Heatmap ({risks.length} Active Risks Plotted)
            </span>
            {selectedCell && (
              <button
                onClick={() => setSelectedCell(null)}
                className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 cursor-pointer"
              >
                Clear cell filter (P:{selectedCell.p}, I:{selectedCell.impact})
              </button>
            )}
          </div>

          <div className="overflow-x-auto pb-2">
            <div className="min-w-[560px]">
              {/* Matrix Table */}
              <div className="grid grid-cols-6 gap-2">
                {/* Top-left empty header */}
                <div className="flex flex-col justify-end p-2 text-right">
                  <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                    PROBABILITY ↓
                  </span>
                  <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                    IMPACT →
                  </span>
                </div>

                {/* Column Headers: Impact 1-5 */}
                {impacts.map(imp => (
                  <div key={imp} className="text-center p-2 bg-slate-50 rounded border border-slate-200">
                    <div className="font-mono font-bold text-sm text-slate-800">{imp}</div>
                    <div className="text-[11px] font-medium text-slate-500">{getImpactName(imp)}</div>
                  </div>
                ))}

                {/* Rows: Probability 5 down to 1 */}
                {probabilities.map(p => (
                  <React.Fragment key={p}>
                    {/* Row Header */}
                    <div className="flex flex-col justify-center p-2 bg-slate-50 rounded border border-slate-200 text-right">
                      <div className="font-mono font-bold text-sm text-slate-800">{p}</div>
                      <div className="text-[10px] text-slate-500 font-medium leading-tight">
                        {p === 5 ? '>70%' : p === 4 ? '50-70%' : p === 3 ? '30-50%' : p === 2 ? '10-30%' : '<10%'}
                      </div>
                    </div>

                    {/* 5 Impact Cells for this Probability */}
                    {impacts.map(imp => {
                      const score = p * imp;
                      const cellRisks = risks.filter(r => {
                        const maxImp = Math.max(r.impacts.scope, r.impacts.quality, r.impacts.schedule, r.impacts.cost);
                        return r.probability === p && maxImp === imp;
                      });

                      const isSelected = selectedCell?.p === p && selectedCell?.impact === imp;
                      const cellColorClass = getCellBgColor(p, imp);

                      return (
                        <div
                          key={`${p}-${imp}`}
                          onClick={() => setSelectedCell(isSelected ? null : { p, impact: imp })}
                          className={`relative min-h-[76px] p-2 rounded-md border transition-all cursor-pointer flex flex-col justify-between ${cellColorClass} ${
                            isSelected ? 'ring-2 ring-slate-900 border-slate-900 shadow-sm' : ''
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-mono font-bold text-sm">
                              {score}
                            </span>
                            {cellRisks.length > 0 && (
                              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full bg-slate-900/10">
                                {cellRisks.length} {cellRisks.length === 1 ? 'risk' : 'risks'}
                              </span>
                            )}
                          </div>

                          {/* Plotted Risk IDs preview */}
                          <div className="flex flex-wrap gap-1 mt-1">
                            {cellRisks.map(r => (
                              <span
                                key={r.id}
                                title={`${r.id}: ${r.statement}`}
                                className="text-[10px] font-mono px-1 py-0.2 bg-white/80 rounded border border-black/10 font-medium truncate max-w-[70px]"
                              >
                                {r.id}
                              </span>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Threshold Levels & Required Governance Responses: 4 cols on xl */}
        <div className="xl:col-span-4 bg-white border border-slate-200 rounded-lg p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Risk Levels & Agreed Responses
              </span>
              {selectedThresholdLevel && (
                <button
                  onClick={() => setSelectedThresholdLevel(null)}
                  className="text-xs text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
                >
                  Clear filter
                </button>
              )}
            </div>

            <div className="space-y-2.5">
              {MATRIX_THRESHOLDS.map(th => {
                const count = risks.filter(r => r.level === th.level).length;
                const isSelected = selectedThresholdLevel === th.level;

                return (
                  <div
                    key={th.level}
                    onClick={() => {
                      setSelectedThresholdLevel(isSelected ? null : th.level);
                      setSelectedCell(null);
                    }}
                    className={`p-3 rounded-md border transition-all cursor-pointer ${th.badgeClass} ${
                      isSelected ? 'ring-2 ring-slate-900 shadow-xs' : 'hover:opacity-90'
                    }`}
                  >
                    <div className="flex items-center justify-between font-semibold text-xs">
                      <span className="flex items-center gap-1.5">
                        <span>{th.level}</span>
                        <span className="font-mono text-[11px] opacity-75">({th.range})</span>
                      </span>
                      <span className="font-mono text-xs px-1.5 py-0.5 rounded bg-white/70">
                        {count} {count === 1 ? 'risk' : 'risks'}
                      </span>
                    </div>
                    <p className="text-[11px] mt-1.5 leading-relaxed opacity-90">
                      <span className="font-semibold">Required:</span> {th.requiredResponse}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200 text-[11px] text-slate-500">
            <span className="font-semibold text-slate-700">Governance Rule:</span> High & Critical risks mandate mitigation plans within 10 days and weekly tracking.
          </div>
        </div>
      </div>

      {/* Risks Matching Selection */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-500" />
            <h3 className="text-sm font-bold text-slate-900">
              {selectedCell
                ? `Risks with Probability ${selectedCell.p} & Impact ${selectedCell.impact} (${filteredRisks.length})`
                : selectedThresholdLevel
                ? `${selectedThresholdLevel} Risks (${filteredRisks.length})`
                : `All Monitored Risks (${filteredRisks.length})`}
            </h3>
          </div>
          {(selectedCell || selectedThresholdLevel) && (
            <button
              onClick={() => {
                setSelectedCell(null);
                setSelectedThresholdLevel(null);
              }}
              className="text-xs text-slate-500 hover:text-slate-800 underline cursor-pointer"
            >
              Show all risks
            </button>
          )}
        </div>

        {filteredRisks.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-xs">
            No active risks mapped to this score coordinate.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredRisks.map(r => (
              <div
                key={r.id}
                onClick={() => onSelectRisk(r)}
                className="py-3 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:bg-slate-50 px-2 rounded-md transition-colors cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  <span className="font-mono font-bold text-xs text-slate-900 px-2 py-0.5 bg-slate-100 rounded">
                    {r.id}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-900">{r.statement}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                      <span>Owner: <strong className="text-slate-700">{r.owner}</strong></span>
                      <span>·</span>
                      <span>Category: {r.category}</span>
                      <span>·</span>
                      <span className="font-mono">P:{r.probability} × Max(Imp):{Math.max(r.impacts.scope, r.impacts.quality, r.impacts.schedule, r.impacts.cost)} = {r.score}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
                  <span className={`text-xs px-2 py-0.5 rounded border font-medium ${getRiskLevelBadgeClass(r.level)}`}>
                    {r.level}
                  </span>
                  <span className="text-xs text-slate-500 font-mono">
                    Residual: {r.residualScore}
                  </span>
                  <ArrowUpRight className="w-4 h-4 text-slate-400" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
