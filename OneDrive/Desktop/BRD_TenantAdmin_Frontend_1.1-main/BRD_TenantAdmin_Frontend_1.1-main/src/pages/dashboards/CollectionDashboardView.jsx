import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BanknotesIcon,
  PhoneIcon,
  ExclamationCircleIcon,
  ClockIcon,
  ClipboardDocumentCheckIcon
} from '@heroicons/react/24/outline';

export default function CollectionDashboardView() {
  const navigate = useNavigate();

  return (
    <div className="p-6 space-y-6 animate-fade-in">
       {/* HEADER */}
       <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Collections Workspace</h1>
          <p className="text-sm text-gray-500">Daily recovery targets and delinquency queue.</p>
        </div>
        <div className="flex gap-2">
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold border border-green-200 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Online
            </span>
        </div>
      </div>

      {/* 1. KEY RECOVERY METRICS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Metric 1: Total Overdue */}
          <div className="bg-white p-5 rounded-xl border border-red-100 shadow-sm flex items-center justify-between relative overflow-hidden">
              <div className="relative z-10">
                  <p className="text-xs font-bold text-red-500 uppercase tracking-wider">Total Overdue (My Queue)</p>
                  <h3 className="text-3xl font-black text-gray-800 mt-1">₹ 45.2L</h3>
                  <p className="text-xs text-red-400 mt-1 font-semibold">↑ 2.5% from yesterday</p>
              </div>
              <div className="p-3 bg-red-50 rounded-lg text-red-500">
                <ExclamationCircleIcon className="w-8 h-8" />
              </div>
          </div>

          {/* Metric 2: Assigned Cases */}
          <div className="bg-white p-5 rounded-xl border border-orange-100 shadow-sm flex items-center justify-between">
              <div>
                  <p className="text-xs font-bold text-orange-500 uppercase tracking-wider">Assigned Cases</p>
                  <h3 className="text-3xl font-black text-gray-800 mt-1">24</h3>
                  <p className="text-xs text-gray-400 mt-1 font-medium">5 Critical (90+ DPD)</p>
              </div>
              <div className="p-3 bg-orange-50 rounded-lg text-orange-500">
                <ClockIcon className="w-8 h-8" />
              </div>
          </div>

          {/* Metric 3: Recovery Progress */}
          <div className="bg-emerald-600 p-5 rounded-xl border border-emerald-700 shadow-sm flex items-center justify-between text-white">
              <div>
                  <p className="text-xs font-bold text-emerald-100 uppercase tracking-wider">Collected Today</p>
                  <h3 className="text-3xl font-black mt-1">₹ 1.5L</h3>
                  <div className="w-full bg-emerald-800 rounded-full h-1.5 mt-3 w-32">
                    <div className="bg-white h-1.5 rounded-full" style={{ width: '65%' }}></div>
                  </div>
              </div>
              <BanknotesIcon className="w-10 h-10 opacity-80" />
          </div>
      </div>

      {/* 2. DAILY TASK LIST (PTP & Follow-ups) */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <h3 className="font-bold text-gray-700 flex items-center gap-2">
                <ClipboardDocumentCheckIcon className="w-5 h-5 text-gray-400" />
                Today's Call Queue
            </h3>
            <button onClick={() => navigate('/collections')} className="text-xs font-bold text-indigo-600 hover:underline">
                View All Cases
            </button>
        </div>
        <table className="w-full text-left">
            <thead className="bg-white text-xs font-bold text-gray-400 uppercase border-b border-gray-100">
                <tr>
                    <th className="px-6 py-3">Borrower Details</th>
                    <th className="px-6 py-3">Overdue Amt</th>
                    <th className="px-6 py-3">DPD</th>
                    <th className="px-6 py-3">Last Remark</th>
                    <th className="px-6 py-3 text-right">Action</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
                {/* Row 1 */}
                <tr className="hover:bg-gray-50 transition group">
                    <td className="px-6 py-4">
                        <div className="font-bold text-gray-900">Amit Verma</div>
                        <div className="text-xs text-gray-500 font-mono">LN-88392 • Personal Loan</div>
                    </td>
                    <td className="px-6 py-4 font-bold text-red-600">₹ 15,400</td>
                    <td className="px-6 py-4">
                        <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded font-bold border border-red-200">45 Days</span>
                    </td>
                    <td className="px-6 py-4">
                        <span className="text-xs font-semibold text-gray-600 bg-gray-100 px-2 py-1 rounded">PTP Broken</span>
                        <div className="text-[10px] text-gray-400 mt-1">Promised yesterday</div>
                    </td>
                    <td className="px-6 py-4 text-right">
                        <button className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition shadow-sm text-xs">
                            <PhoneIcon className="w-3.5 h-3.5" /> Call Now
                        </button>
                    </td>
                </tr>
                {/* Row 2 */}
                <tr className="hover:bg-gray-50 transition group">
                    <td className="px-6 py-4">
                        <div className="font-bold text-gray-900">Priya Singh</div>
                        <div className="text-xs text-gray-500 font-mono">LN-99201 • Business Loan</div>
                    </td>
                    <td className="px-6 py-4 font-bold text-red-600">₹ 8,200</td>
                    <td className="px-6 py-4">
                        <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded font-bold border border-orange-200">12 Days</span>
                    </td>
                    <td className="px-6 py-4">
                        <span className="text-xs font-semibold text-gray-600 bg-gray-100 px-2 py-1 rounded">RNR</span>
                        <div className="text-[10px] text-gray-400 mt-1">Ringing No Response</div>
                    </td>
                    <td className="px-6 py-4 text-right">
                        <button className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition shadow-sm text-xs">
                            <PhoneIcon className="w-3.5 h-3.5" /> Call Now
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>
        <div className="p-3 bg-gray-50 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-400 font-medium">You have cleared 12 of 36 tasks today.</p>
        </div>
      </div>
    </div>
  );
}