import React, { useState } from 'react';
import { IssueItem, IssuePriority, IssueStatus, IssueType } from '../types/project';
import { getIssuePriorityBadgeClass, getIssueStatusBadgeClass } from '../utils/matrixCalculations';
import { Search, Plus, CheckCircle, AlertOctagon, Edit3, X } from 'lucide-react';

interface IssueLogViewProps {
  issues: IssueItem[];
  onUpdateIssue: (updatedIssue: IssueItem) => void;
  onOpenTriageModal: () => void;
}

export const IssueLogView: React.FC<IssueLogViewProps> = ({
  issues,
  onUpdateIssue,
  onOpenTriageModal,
}) => {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('All');
  const [priorityFilter, setPriorityFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  // Edit resolution modal
  const [editingIssue, setEditingIssue] = useState<IssueItem | null>(null);
  const [resolutionText, setResolutionText] = useState('');
  const [statusVal, setStatusVal] = useState<IssueStatus>('Open');

  const filteredIssues = issues.filter(i => {
    const matchesSearch = i.description.toLowerCase().includes(search.toLowerCase()) ||
      i.id.toLowerCase().includes(search.toLowerCase()) ||
      i.owner.toLowerCase().includes(search.toLowerCase()) ||
      (i.resolution && i.resolution.toLowerCase().includes(search.toLowerCase()));
    const matchesType = typeFilter === 'All' || i.type === typeFilter;
    const matchesPriority = priorityFilter === 'All' || i.priority === priorityFilter;
    const matchesStatus = statusFilter === 'All' || i.status === statusFilter;
    return matchesSearch && matchesType && matchesPriority && matchesStatus;
  });

  const types: IssueType[] = ['Resource', 'Technical', 'Stakeholder', 'Scope', 'Quality', 'External', 'Process'];
  const priorities: IssuePriority[] = ['High', 'Medium', 'Low'];
  const statuses: IssueStatus[] = ['Open', 'In Progress', 'Resolved', 'Escalated'];

  const handleOpenEdit = (issue: IssueItem) => {
    setEditingIssue(issue);
    setResolutionText(issue.resolution || '');
    setStatusVal(issue.status);
  };

  const handleSaveEdit = () => {
    if (!editingIssue) return;
    const isNowResolved = statusVal === 'Resolved' && editingIssue.status !== 'Resolved';
    const updated: IssueItem = {
      ...editingIssue,
      status: statusVal,
      resolution: resolutionText,
      resolutionDate: isNowResolved ? new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : editingIssue.resolutionDate
    };
    onUpdateIssue(updated);
    setEditingIssue(null);
  };

  return (
    <div className="space-y-5">
      {/* Top Banner and Controls */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                Project Issue Log
              </h2>
              <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono font-medium">
                {issues.length} Logged Issues
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Active operational problems and realized events affecting schedule, cost, scope, or quality.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenTriageModal}
              className="px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Plus className="w-4 h-4 text-amber-400" />
              <span>Log Incident</span>
            </button>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search description, owner, resolution..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-2 border border-slate-300 rounded-md outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
            />
          </div>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-md outline-none bg-white font-medium text-slate-700"
          >
            <option value="All">All Types ({issues.length})</option>
            {types.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-md outline-none bg-white font-medium text-slate-700"
          >
            <option value="All">All Priorities</option>
            {priorities.map(p => (
              <option key={p} value={p}>{p}</option>
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

      {/* Issues Table */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-3 w-16">ID</th>
                <th className="py-3 px-3 w-24">Type</th>
                <th className="py-3 px-4 min-w-[220px]">Description</th>
                <th className="py-3 px-2 w-16 text-center">Pri.</th>
                <th className="py-3 px-3 w-36">Impact on Objectives</th>
                <th className="py-3 px-3 w-28">Owner</th>
                <th className="py-3 px-3 w-28 text-center">Status</th>
                <th className="py-3 px-4 min-w-[200px]">Resolution / Action</th>
                <th className="py-3 px-2 w-12 text-center">Edit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredIssues.map(issue => (
                <tr key={issue.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-3 font-mono font-bold text-slate-900 whitespace-nowrap">
                    {issue.id}
                  </td>
                  <td className="py-3 px-3 text-slate-600 font-medium whitespace-nowrap">
                    {issue.type}
                  </td>
                  <td className="py-3 px-4 text-slate-900 font-medium">
                    {issue.description}
                  </td>
                  <td className="py-3 px-2 text-center whitespace-nowrap">
                    <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold border ${getIssuePriorityBadgeClass(issue.priority)}`}>
                      {issue.priority}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-600">
                    {issue.impactOnObjectives}
                  </td>
                  <td className="py-3 px-3 text-slate-600 font-medium whitespace-nowrap">
                    {issue.owner}
                  </td>
                  <td className="py-3 px-3 text-center whitespace-nowrap">
                    <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold border ${getIssueStatusBadgeClass(issue.status)}`}>
                      {issue.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-700">
                    <div>{issue.resolution || <span className="text-slate-400 italic">No resolution documented</span>}</div>
                    {issue.resolutionDate && (
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                        Resolved: {issue.resolutionDate}
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-2 text-center">
                    <button
                      onClick={() => handleOpenEdit(issue)}
                      className="p-1 text-slate-400 hover:text-slate-900 rounded transition-colors cursor-pointer"
                      title="Update status or resolution notes"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Issue Modal */}
      {editingIssue && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden">
            <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between">
              <span className="text-sm font-bold">Update Issue: {editingIssue.id}</span>
              <button onClick={() => setEditingIssue(null)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div>
                <span className="text-slate-500 block mb-1">Issue Description:</span>
                <p className="text-slate-900 font-medium bg-slate-50 p-2.5 rounded border border-slate-200">
                  {editingIssue.description}
                </p>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Resolution Status:</label>
                <select
                  value={statusVal}
                  onChange={(e) => setStatusVal(e.target.value as IssueStatus)}
                  className="w-full p-2 border border-slate-300 rounded bg-white text-slate-900 font-medium"
                >
                  <option value="Open">Open (just logged)</option>
                  <option value="In Progress">In Progress (actively being worked)</option>
                  <option value="Resolved">Resolved (closed with fix)</option>
                  <option value="Escalated">Escalated (raised to sponsor / external party)</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Resolution / Workaround Notes:</label>
                <textarea
                  rows={3}
                  value={resolutionText}
                  onChange={(e) => setResolutionText(e.target.value)}
                  placeholder="Document the negotiated resolution or active fallback..."
                  className="w-full p-2 border border-slate-300 rounded outline-none focus:ring-1 focus:ring-slate-900 text-slate-900"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  onClick={() => setEditingIssue(null)}
                  className="px-3 py-1.5 border border-slate-200 rounded text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="px-3 py-1.5 bg-slate-900 text-white font-semibold rounded hover:bg-slate-800 cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
