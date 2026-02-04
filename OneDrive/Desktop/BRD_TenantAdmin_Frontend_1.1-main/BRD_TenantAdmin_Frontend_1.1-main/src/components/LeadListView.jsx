import React from 'react';
import { ChevronRightIcon } from "@heroicons/react/24/outline";


export default function LeadListView({ leads = [], onLeadClick, searchTerm }) {

  const filteredLeads = leads.filter(l =>
    (l.name || "").toLowerCase().includes((searchTerm || "").toLowerCase()) ||
    (l.mobile || "").includes(searchTerm || "")
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'HOT': return 'bg-orange-100 text-orange-800';
      case 'QUALIFIED': return 'bg-blue-100 text-blue-800';
      case 'RAW': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden h-full flex flex-col">
      <div className="overflow-auto flex-1">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Lead Name</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Mobile</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Source</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredLeads.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-8 text-center text-gray-400">No leads found matching your search.</td>
              </tr>
            ) : (
              filteredLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-50 transition group cursor-pointer" onClick={() => onLeadClick(lead)}>
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-800">{lead.name}</div>
                    {/* If your API uses 'created_at' instead of 'created', update the key below */}
                    <div className="text-xs text-slate-400">Created: {lead.created || lead.created_at}</div>
                  </td>
                  <td className="px-6 py-4 text-sm font-mono text-slate-600">{lead.mobile}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${getStatusColor(lead.status)}`}>
                      {(lead.status || "").replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{lead.source}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-blue-600 hover:bg-blue-50 p-2 rounded-full">
                      <ChevronRightIcon className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
