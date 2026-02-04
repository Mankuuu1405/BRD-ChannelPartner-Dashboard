import React from 'react';
import { UserCircleIcon, PhoneIcon } from "@heroicons/react/24/solid";

export default function LeadKanban({ leads = [], onLeadClick, searchTerm }) {

  const COLUMNS = [
    { id: 'RAW', label: 'Raw Leads', color: 'border-blue-500' },
    { id: 'QUALIFIED', label: 'Qualified', color: 'border-blue-500' },
    { id: 'HOT', label: 'Hot / Doc Collected', color: 'border-orange-500' },
    { id: 'FOLLOW_UP', label: 'Follow Up', color: 'border-amber-500' },
  ];
  
  const getLeadsByStatus = (status) => {
    return leads.filter(l => 
      l.status === status && 
      (l.name || "").toLowerCase().includes((searchTerm || "").toLowerCase())
    );
  };

  return (
    <div className="flex h-full gap-4 overflow-x-auto pb-4">
      {COLUMNS.map((col) => (
        <div key={col.id} className="min-w-[300px] flex-1 flex flex-col bg-slate-100/50 rounded-xl border border-slate-200 h-full">
          {/* Column Header */}
          <div className={`p-4 border-t-4 ${col.color} bg-white rounded-t-xl shadow-sm mb-2`}>
            <h3 className="font-bold text-slate-700 text-sm uppercase tracking-wide flex justify-between">
              {col.label}
              <span className="bg-slate-100 text-slate-500 px-2 rounded-full text-xs flex items-center">
                {getLeadsByStatus(col.id).length}
              </span>
            </h3>
          </div>

          {/* Draggable Area */}
          <div className="flex-1 overflow-y-auto p-2 space-y-3">
            {getLeadsByStatus(col.id).map((lead) => (
              <div 
                key={lead.id}
                onClick={() => onLeadClick(lead)}
                className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 cursor-pointer hover:shadow-md hover:border-blue-300 transition group"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <UserCircleIcon className="h-8 w-8 text-slate-300" />
                    <div>
                      <div className="font-bold text-slate-800 text-sm">{lead.name}</div>
                      <div className="text-xs text-slate-400 font-mono">{lead.mobile}</div>
                    </div>
                  </div>
                  {/* Score pill styling preserved */}
                  <div className={`text-[10px] font-bold px-2 py-0.5 rounded ${lead.score > 50 ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                    {lead.score} Score
                  </div>
                </div>
                
                <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-50">
                   <span className="text-[10px] font-bold text-slate-400 uppercase">{lead.source}</span>
                   <button className="p-1.5 rounded-full bg-slate-50 text-slate-400 hover:bg-green-50 hover:text-green-600 transition">
                     <PhoneIcon className="h-4 w-4" />
                   </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
