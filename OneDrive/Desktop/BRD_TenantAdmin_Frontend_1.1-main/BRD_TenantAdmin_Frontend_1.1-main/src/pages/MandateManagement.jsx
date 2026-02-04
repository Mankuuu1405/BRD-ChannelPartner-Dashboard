import { useState, useEffect } from "react";
import { getMandates, updateMandate } from "../services/mandateService";
import {
  BuildingLibraryIcon,
  CheckBadgeIcon,
  XCircleIcon,
  ArrowPathIcon,
  QrCodeIcon,
} from "@heroicons/react/24/outline";

export default function MandateManagement() {
  const [mandates, setMandates] = useState([]);
  const [processing, setProcessing] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMandates();
  }, []);

  const fetchMandates = async () => {
    try {
      setLoading(true);
      const res = await getMandates();
      setMandates(res.data || []);
    } catch (err) {
      console.error("Failed to load mandates", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id) => {
    setProcessing(id);
    try {
      await updateMandate(id, { action: "SUCCESS" });

      setMandates((prev) =>
        prev.map((m) =>
          m.id === id ? { ...m, action: "SUCCESS" } : m
        )
      );
    } catch {
      alert("Action failed");
    } finally {
      setProcessing(null);
    }
  };

  if (loading) {
    return (
      <div className="p-10 text-center text-slate-500">
        Loading mandates...
      </div>
    );
  }

  return (
    <div className="p-8 max-w-[1600px] mx-auto min-h-screen bg-slate-50">
      {/* Header */}
      <div className="flex items-center gap-4 mb-10">
        <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl">
          <BuildingLibraryIcon className="h-8 w-8" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-slate-900">
            Mandate & Banking
          </h1>
          <p className="text-slate-500 font-medium">
            Verify accounts and register repayment mandates
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-[2rem] shadow-xl border overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b text-xs font-bold uppercase text-slate-400">
            <tr>
              <th className="px-8 py-5">Application</th>
              <th className="px-8 py-5">Customer</th>
              <th className="px-8 py-5">Bank</th>
              <th className="px-8 py-5">Penny Drop</th>
              <th className="px-8 py-5">eNACH</th>
              <th className="px-8 py-5 text-right">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {mandates.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50">
                {/* Application */}
                <td className="px-8 py-6 font-bold text-indigo-600">
                  {item.application_id}
                </td>

                {/* Customer */}
                <td className="px-8 py-6 font-bold">
                  {item.customer}
                </td>

                {/* Bank */}
                <td className="px-8 py-6">
                  <div className="font-bold">{item.bank}</div>
                  <div className="text-xs text-slate-400">
                    {item.ifsc} • {item.account}
                  </div>
                </td>

                {/* Penny Drop */}
                <td className="px-8 py-6">
                  {item.penny_drop_status === "SUCCESS" ? (
                    <span className="text-emerald-600 flex items-center gap-1 font-bold">
                      <CheckBadgeIcon className="h-4 w-4" />
                      Verified
                    </span>
                  ) : (
                    <span className="text-slate-400 text-xs">Pending</span>
                  )}
                </td>

                {/* eNACH */}
                <td className="px-8 py-6">
                  {item.enach_status === "SUCCESS" ? (
                    <span className="text-emerald-600 flex items-center gap-1 font-bold">
                      <QrCodeIcon className="h-4 w-4" />
                      Active
                    </span>
                  ) : (
                    <span className="text-orange-400 text-xs">
                      Not Registered
                    </span>
                  )}
                </td>

                {/* ACTION — BACKEND DRIVEN */}
                <td className="px-8 py-6 text-right">
                  {item.action === "PENDING" && (
                    <button
                      onClick={() => handleAction(item.id)}
                      disabled={processing === item.id}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold"
                    >
                      {processing === item.id
                        ? "Processing..."
                        : "Proceed"}
                    </button>
                  )}

                  {item.action === "SUCCESS" && (
                    <span className="text-emerald-600 font-bold flex justify-end items-center gap-1">
                      <CheckBadgeIcon className="h-4 w-4" />
                      Completed
                    </span>
                  )}

                  {item.action === "FAILED" && (
                    <span className="text-red-600 font-bold flex justify-end items-center gap-1">
                      <XCircleIcon className="h-4 w-4" />
                      Failed
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
