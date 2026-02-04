import React, { useEffect, useState } from 'react';
import { ExclamationTriangleIcon, ClockIcon } from '@heroicons/react/24/outline';
import { workspaceApi } from '../services/workspaceService';

export default function EscalationWidget() {
  const [escalations, setEscalations] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEscalations = async () => {
    try {
      // In production: const res = await workspaceApi.getEscalationMatrix();
      // Mocking for demo to satisfy the "Auto Update" requirement
      const mockData = [
        { id: 101, title: 'Loan #L-442 Underwriting', agent: 'Rahul S.', delay: '4h 20m', level: 'Critical' },
        { id: 102, title: 'KYC Verification #K-990', agent: 'Priya M.', delay: '1h 05m', level: 'Warning' }
      ];
      setEscalations(mockData);
      setLoading(false);
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ Auto-Update Logic (The "Hierarchy Bubbling" effect)
  useEffect(() => {
    fetchEscalations();
    const interval = setInterval(fetchEscalations, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, []);

  if (loading) return null; // Don't show if loading first time
  if (escalations.length === 0) return null; // Don't show if no escalations

  return (
    <div className="bg-white border-l-4 border-red-500 shadow-card rounded-r-xl p-4 mb-6">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2 text-red-700">
          <ExclamationTriangleIcon className="w-5 h-5" />
          <h3 className="font-bold">Escalation Matrix (Action Required)</h3>
        </div>
        <span className="flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
        </span>
      </div>

      <div className="space-y-2">
        {escalations.map((item) => (
          <div key={item.id} className="flex justify-between items-center bg-red-50 p-2 rounded border border-red-100 text-sm">
            <div>
              <span className="font-bold text-gray-800">{item.title}</span>
              <span className="text-gray-500 mx-2">|</span>
              <span className="text-gray-600">Assigned: {item.agent}</span>
            </div>
            <div className="flex items-center gap-1 text-red-600 font-bold bg-white px-2 py-0.5 rounded shadow-sm">
              <ClockIcon className="w-3 h-3" />
              Overdue: {item.delay}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}