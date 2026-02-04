import React, { useState } from 'react';
import { 
  XMarkIcon, PhoneIcon, ChatBubbleLeftRightIcon, 
  CalendarDaysIcon, ClockIcon, ArrowRightIcon,
  DocumentCheckIcon
} from "@heroicons/react/24/outline";

export default function LeadProfileDrawer({ lead, isOpen, onClose, onConvert }) {
  const [activeTab, setActiveTab] = useState("TIMELINE");

  if (!isOpen || !lead) return null;

  return (
    <div className="fixed inset-0 z-[60] flex justify-end bg-slate-900/20 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white h-full shadow-2xl animate-slide-in-right flex flex-col">
        
        {/* HEADER */}
        <div className="bg-slate-900 text-white p-6 relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">
            <XMarkIcon className="h-6 w-6" />
          </button>
          
          <div className="flex items-center gap-4 mt-2">
            <div className="h-14 w-14 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-xl font-bold">
              {lead.name ? lead.name.charAt(0) : "U"}
            </div>
            <div>
              <h2 className="text-xl font-bold">{lead.name}</h2>
              <div className="flex items-center gap-2 text-slate-400 text-sm">
                 <PhoneIcon className="h-3 w-3" /> {lead.mobile}
              </div>
              <div className="mt-2 flex gap-2">
                 <span className="bg-blue-500/20 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                   {lead.status}
                 </span>
                 <span className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                   High Intent
                 </span>
              </div>
            </div>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="grid grid-cols-3 border-b border-slate-200">
          <button className="flex flex-col items-center justify-center py-4 hover:bg-slate-50 transition border-r border-slate-100">
            <PhoneIcon className="h-5 w-5 text-slate-600 mb-1" />
            <span className="text-[10px] font-bold uppercase text-slate-500">Call</span>
          </button>
          <button className="flex flex-col items-center justify-center py-4 hover:bg-slate-50 transition border-r border-slate-100">
            <ChatBubbleLeftRightIcon className="h-5 w-5 text-slate-600 mb-1" />
            <span className="text-[10px] font-bold uppercase text-slate-500">WhatsApp</span>
          </button>
          <button className="flex flex-col items-center justify-center py-4 hover:bg-slate-50 transition">
            <CalendarDaysIcon className="h-5 w-5 text-slate-600 mb-1" />
            <span className="text-[10px] font-bold uppercase text-slate-500">Meeting</span>
          </button>
        </div>

        {/* TABS */}
        <div className="flex border-b border-slate-200">
           {['TIMELINE', 'TASKS', 'NOTES'].map(tab => (
             <button 
               key={tab}
               onClick={() => setActiveTab(tab)}
               className={`flex-1 py-3 text-xs font-bold uppercase tracking-widest ${
                 activeTab === tab ? 'border-b-2 border-slate-900 text-slate-900' : 'text-slate-400 hover:text-slate-600'
               }`}
             >
               {tab}
             </button>
           ))}
        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
          {activeTab === 'TIMELINE' && (
            <div className="space-y-6">
              <div className="relative pl-6 border-l-2 border-slate-200">
                 <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-green-500 ring-4 ring-white" />
                 <div className="text-xs text-slate-400 font-bold mb-1">Today, 10:30 AM</div>
                 <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
                    <p className="text-sm font-medium text-slate-800">Interested in Personal Loan</p>
                    <p className="text-xs text-slate-500 mt-1">Customer asked for ROI details. Sent brochure via WhatsApp.</p>
                 </div>
              </div>
            </div>
          )}

          {activeTab === 'TASKS' && (
            <div className="space-y-3">
               <div className="flex items-start gap-3 bg-white p-3 rounded-lg border border-slate-200">
                  <input type="checkbox" className="mt-1" />
                  <div>
                    <div className="text-sm font-bold text-slate-800">Follow up on Documents</div>
                    <div className="text-xs text-red-500 font-bold mt-1 flex items-center gap-1">
                      <ClockIcon className="h-3 w-3" /> Due Today
                    </div>
                  </div>
               </div>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="p-4 bg-white border-t border-slate-200">
          <button 
            onClick={() => onConvert(lead)}
            className="w-full flex items-center justify-center gap-2 bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700 shadow-lg shadow-emerald-600/20 transition transform active:scale-95"
          >
            <DocumentCheckIcon className="h-5 w-5" />
            Convert to Deal
          </button>
        </div>

      </div>
    </div>
  );
}
