import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ClipboardDocumentCheckIcon, 
  ClockIcon, 
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

export default function CreditDashboardView() {
  const navigate = useNavigate();

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Credit Operations Workspace</h1>
          <p className="text-sm text-gray-500">Underwriting queue and risk assessment console.</p>
        </div>
        <button 
          onClick={() => navigate('/loan-applications')}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
        >
          View All Applications
        </button>
      </div>
      
      {/* 1. KEY METRICS ROW */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
            <ClipboardDocumentCheckIcon className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase">Pending Review</p>
            <h3 className="text-2xl font-black text-gray-800">12</h3>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-yellow-50 text-yellow-600 rounded-lg">
            <ClockIcon className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase">Queries Raised</p>
            <h3 className="text-2xl font-black text-gray-800">5</h3>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-green-50 text-green-600 rounded-lg">
            <CheckCircleIcon className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase">Approved Today</p>
            <h3 className="text-2xl font-black text-gray-800">3</h3>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-red-50 text-red-600 rounded-lg">
            <ExclamationTriangleIcon className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase">Risk Flagged</p>
            <h3 className="text-2xl font-black text-gray-800">2</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 2. PRIORITY QUEUE (Left 2/3) */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
            <h3 className="font-bold text-gray-700">Priority Application Queue</h3>
            <span className="text-xs font-semibold bg-blue-100 text-blue-700 px-2 py-1 rounded">SLA Critical</span>
          </div>
          <table className="w-full text-left">
            <thead className="text-xs font-bold text-gray-400 uppercase bg-white border-b border-gray-100">
              <tr>
                <th className="px-6 py-3">App ID</th>
                <th className="px-6 py-3">Customer</th>
                <th className="px-6 py-3">Amount</th>
                <th className="px-6 py-3">Risk Score</th>
                <th className="px-6 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              <tr className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 text-sm font-mono text-gray-500">APP-2023-001</td>
                <td className="px-6 py-4">
                  <div className="font-bold text-gray-900">Rajesh Kumar</div>
                  <div className="text-xs text-gray-500">Salaried • IT Sector</div>
                </td>
                <td className="px-6 py-4 font-semibold text-gray-700">₹ 5,00,000</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                    Low (750)
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button 
                    onClick={() => navigate('/loan-applications')} 
                    className="text-indigo-600 font-bold text-sm hover:bg-indigo-50 px-3 py-1.5 rounded transition"
                  >
                    Underwrite
                  </button>
                </td>
              </tr>
              <tr className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 text-sm font-mono text-gray-500">APP-2023-045</td>
                <td className="px-6 py-4">
                  <div className="font-bold text-gray-900">Sneha Gupta</div>
                  <div className="text-xs text-gray-500">Self-Employed • Retail</div>
                </td>
                <td className="px-6 py-4 font-semibold text-gray-700">₹ 12,00,000</td>
                <td className="px-6 py-4">
                   <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                    Medium (680)
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button 
                    onClick={() => navigate('/loan-applications')} 
                    className="text-indigo-600 font-bold text-sm hover:bg-indigo-50 px-3 py-1.5 rounded transition"
                  >
                    Underwrite
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* 3. RISK ALERTS WIDGET (Right 1/3) */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <ChartBarIcon className="w-5 h-5 text-gray-500" />
            <h3 className="font-bold text-gray-700">Risk Analysis Alerts</h3>
          </div>
          <div className="space-y-4">
            <div className="p-3 bg-red-50 rounded-lg border border-red-100">
              <div className="flex justify-between items-start">
                <h4 className="text-sm font-bold text-red-800">High Deviation</h4>
                <span className="text-[10px] bg-white px-1.5 rounded border border-red-200 text-red-600">APP-099</span>
              </div>
              <p className="text-xs text-red-600 mt-1">Applicant income documents do not match bank statement flows.</p>
            </div>
            
            <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-100">
              <div className="flex justify-between items-start">
                <h4 className="text-sm font-bold text-yellow-800">Policy Check</h4>
                <span className="text-[10px] bg-white px-1.5 rounded border border-yellow-200 text-yellow-600">APP-102</span>
              </div>
              <p className="text-xs text-yellow-700 mt-1">Loan amount exceeds 60% of collateral value (LTV breach).</p>
            </div>

             <div className="mt-4 pt-4 border-t border-gray-100">
                <h4 className="text-xs font-bold text-gray-400 uppercase mb-2">My Efficiency</h4>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Avg Decision Time</span>
                  <span className="font-bold text-gray-900">4.2 Hrs</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5">
                  <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '80%' }}></div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}