import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ExclamationTriangleIcon,
  ClipboardDocumentCheckIcon,
  DocumentChartBarIcon,
  BanknotesIcon,
  ScaleIcon,
} from "@heroicons/react/24/outline";

import { dashboardApi } from "../../services/dashboardService";

export default function RecoveryLegalDashboardView() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    escalatedNPAs: 0,
    openLegalCases: 0,
    documentsUploaded: 0,
    avgCaseAgeDays: 0,
    caseStatusDistribution: {},
    agingBuckets: [],
    externalFirms: [],
    recentCases: [],
  });

  useEffect(() => {
    fetchRecoveryStats();
  }, []);

  const fetchRecoveryStats = async () => {
    try {
      setLoading(true);
      const res = await dashboardApi.fetchRecoveryStats?.();
      if (res && res.data) setStats(res.data);
    } catch (err) {
      console.error("Failed to fetch recovery stats", err);
      // keep defaults
    } finally {
      setLoading(false);
    }
  };

  const getPct = (val, total) => {
    if (!total || total === 0) return "0%";
    return Math.round((val / total) * 100) + "%";
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Recovery & Legal Workspace
          </h1>
          <p className="text-sm text-gray-500">
            Track escalations, legal cases and document workflows.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/recovery/cases")}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
          >
            View All Cases
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-bold text-gray-400 uppercase">
              Escalated NPAs
            </span>
            <span className="text-xs font-bold bg-red-100 text-red-700 px-2 py-0.5 rounded">
              Critical
            </span>
          </div>
          <div className="text-2xl font-black text-gray-800">
            {stats.escalatedNPAs}
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-bold text-gray-400 uppercase">
              Open Legal Cases
            </span>
            <span className="text-xs font-bold bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded">
              Active
            </span>
          </div>
          <div className="text-2xl font-black text-gray-800">
            {stats.openLegalCases}
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-bold text-gray-400 uppercase">
              Documents Uploaded
            </span>
            <span className="text-xs font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
              Storage
            </span>
          </div>
          <div className="text-2xl font-black text-gray-800">
            {stats.documentsUploaded}
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-bold text-gray-400 uppercase">
              Avg Case Age
            </span>
            <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded">
              Days
            </span>
          </div>
          <div className="text-2xl font-black text-gray-800">
            {stats.avgCaseAgeDays}d
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
            <h3 className="font-bold text-gray-700">Open Cases (Recent)</h3>
            <span className="text-xs font-semibold bg-indigo-100 text-indigo-700 px-2 py-1 rounded">
              Priority Queue
            </span>
          </div>
          <div className="divide-y divide-gray-50">
            {stats.recentCases && stats.recentCases.length > 0 ? (
              stats.recentCases.map((c, i) => (
                <div
                  key={c.id || i}
                  className="p-4 hover:bg-gray-50 transition flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-red-50 text-red-700 flex items-center justify-center font-bold text-sm border border-red-100">
                      {(c.borrower || "B").charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">
                        {c.borrower || "Unknown"}
                      </h4>
                      <p className="text-xs text-gray-500">
                        {c.caseType || "Recovery"} • Case #{c.caseNo || "—"}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 items-center">
                    <div className="text-xs text-gray-500 mr-4">
                      Age:{" "}
                      <span className="font-bold text-gray-800">
                        {c.ageDays || 0}d
                      </span>
                    </div>
                    <button
                      onClick={() => navigate(`/recovery/cases/${c.id || ""}`)}
                      className="text-indigo-600 font-bold text-sm hover:bg-indigo-50 px-3 py-1.5 rounded transition"
                    >
                      Open
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-400 text-sm">
                No open cases found.
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col h-full">
          <div className="flex items-center gap-2 mb-4">
            <DocumentChartBarIcon className="w-5 h-5 text-gray-400" />
            <h3 className="font-bold text-gray-700">Legal Actions Pulse</h3>
          </div>

          <div className="space-y-4 flex-1">
            <div className="border border-yellow-100 bg-yellow-50/40 rounded-lg p-3">
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-gray-800 text-sm">
                  Pending Notices
                </span>
                <span className="text-[10px] bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded border border-yellow-200 font-bold">
                  {stats.caseStatusDistribution?.pending || 0}
                </span>
              </div>
              <p className="text-xs text-gray-500">
                Notices generated awaiting dispatch or approval.
              </p>
            </div>

            <div className="border border-green-100 bg-green-50/30 rounded-lg p-3">
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-gray-800 text-sm">
                  Court Filings
                </span>
                <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded border border-green-200 font-bold">
                  {stats.caseStatusDistribution?.filed || 0}
                </span>
              </div>
              <p className="text-xs text-gray-500">
                Filings completed with supporting documents uploaded.
              </p>
            </div>

            <button
              onClick={() => navigate("/recovery")}
              className="mt-4 w-full py-2 border border-dashed border-gray-300 rounded-lg text-xs font-bold text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition"
            >
              Manage Recovery
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
