import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

export default function AddLead() {
  const navigate = useNavigate();
  const [lead, setLead] = useState({
    name: "",
    mobile: "",
    email: "",
    leadSource: "Campaign",
    campaignName: "",
    leadStatus: "Raw",
    assignedTo: "",
    followUpDate: "",
    consentObtained: false,
    leadQuality: "Medium",
    product: "",
  });

  const update = (key, value) => setLead((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Adding lead:", lead);
    // TODO: call API to create the lead
    navigate("/leads");
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Sidebar />
      <div className="pl-64 pt-16">
        <main className="p-8">
          {/* HEADER */}
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => navigate("/leads")}
              className="p-2 hover:bg-slate-200 rounded-lg"
            >
              <ArrowLeftIcon className="h-6 w-6 text-slate-600" />
            </button>
            <div>
              <h1 className="text-3xl font-black text-slate-900">
                Add New Lead
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Create and manage a new lead entry
              </p>
            </div>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="max-w-4xl">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 space-y-8">
              {/* SECTION 1: Contact Information */}
              <div>
                <h2 className="text-lg font-bold text-slate-900 mb-4">
                  Contact Information
                </h2>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase mb-2">
                      Lead Name
                    </label>
                    <input
                      value={lead.name}
                      onChange={(e) => update("name", e.target.value)}
                      type="text"
                      className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20"
                      placeholder="e.g. John Doe"
                      required
                    />
                    <p className="text-[11px] text-slate-400 mt-1">
                      In Document: ✅
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase mb-2">
                      Mobile Number
                    </label>
                    <input
                      value={lead.mobile}
                      onChange={(e) => update("mobile", e.target.value)}
                      type="tel"
                      className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20"
                      placeholder="e.g. +91 98765 43210"
                      required
                    />
                    <p className="text-[11px] text-slate-400 mt-1">
                      In Document: ✅
                    </p>
                  </div>

                  <div className="col-span-2">
                    <label className="block text-xs font-bold text-slate-600 uppercase mb-2">
                      Email
                    </label>
                    <input
                      value={lead.email}
                      onChange={(e) => update("email", e.target.value)}
                      type="email"
                      className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20"
                      placeholder="e.g. john@example.com"
                      required
                    />
                    <p className="text-[11px] text-slate-400 mt-1">
                      In Document: ✅
                    </p>
                  </div>
                </div>
              </div>

              {/* SECTION 2: Lead Source & Campaign */}
              <div>
                <h2 className="text-lg font-bold text-slate-900 mb-4">
                  Lead Source & Campaign
                </h2>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase mb-2">
                      Lead Source
                    </label>
                    <select
                      value={lead.leadSource}
                      onChange={(e) => update("leadSource", e.target.value)}
                      className="w-full p-3 border border-slate-200 rounded-xl outline-none"
                    >
                      <option>Campaign</option>
                      <option>Third Party</option>
                      <option>Internal</option>
                      <option>Direct</option>
                    </select>
                    <p className="text-[11px] text-slate-400 mt-1">
                      In Document: ✅
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase mb-2">
                      Campaign Name (link)
                    </label>
                    <input
                      value={lead.campaignName}
                      onChange={(e) => update("campaignName", e.target.value)}
                      type="text"
                      className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20"
                      placeholder="Select or link to campaign"
                    />
                    <p className="text-[11px] text-slate-400 mt-1">
                      In Document: ✅
                    </p>
                  </div>
                </div>
              </div>

              {/* SECTION 3: Lead Status & Quality */}
              <div>
                <h2 className="text-lg font-bold text-slate-900 mb-4">
                  Lead Status & Quality
                </h2>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase mb-2">
                      Lead Status
                    </label>
                    <select
                      value={lead.leadStatus}
                      onChange={(e) => update("leadStatus", e.target.value)}
                      className="w-full p-3 border border-slate-200 rounded-xl outline-none"
                    >
                      <option>Raw</option>
                      <option>Hot</option>
                      <option>Deal</option>
                    </select>
                    <p className="text-[11px] text-slate-400 mt-1">
                      In Document: Raw → Hot → Deal ✅
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase mb-2">
                      Lead Quality
                    </label>
                    <select
                      value={lead.leadQuality}
                      onChange={(e) => update("leadQuality", e.target.value)}
                      className="w-full p-3 border border-slate-200 rounded-xl outline-none"
                    >
                      <option>High</option>
                      <option>Medium</option>
                      <option>Low</option>
                    </select>
                    <p className="text-[11px] text-slate-400 mt-1">
                      In Document: ✅
                    </p>
                  </div>
                </div>
              </div>

              {/* SECTION 4: Assignment & Follow-up */}
              <div>
                <h2 className="text-lg font-bold text-slate-900 mb-4">
                  Assignment & Follow-up
                </h2>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase mb-2">
                      Assigned User / Team
                    </label>
                    <input
                      value={lead.assignedTo}
                      onChange={(e) => update("assignedTo", e.target.value)}
                      type="text"
                      className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20"
                      placeholder="e.g. Sales Team A or user id"
                    />
                    <p className="text-[11px] text-slate-400 mt-1">
                      In Document: ✅
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase mb-2">
                      Follow-up Date
                    </label>
                    <input
                      value={lead.followUpDate}
                      onChange={(e) => update("followUpDate", e.target.value)}
                      type="date"
                      className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                    <p className="text-[11px] text-slate-400 mt-1">
                      In Document: ✅
                    </p>
                  </div>
                </div>
              </div>

              {/* SECTION 5: Consent & Product */}
              <div>
                <h2 className="text-lg font-bold text-slate-900 mb-4">
                  Consent & Product
                </h2>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase mb-2">
                      Product Selection
                    </label>
                    <select
                      value={lead.product}
                      onChange={(e) => update("product", e.target.value)}
                      className="w-full p-3 border border-slate-200 rounded-xl outline-none"
                    >
                      <option value="">-- Select Product --</option>
                      <option>Personal Loan</option>
                      <option>Home Loan</option>
                      <option>Credit Card</option>
                      <option>Savings Account</option>
                    </select>
                  </div>

                  <div>
                    <label className="flex items-center gap-3 text-sm">
                      <input
                        type="checkbox"
                        checked={lead.consentObtained}
                        onChange={(e) =>
                          update("consentObtained", e.target.checked)
                        }
                        className="w-5 h-5 rounded"
                      />
                      <span className="text-xs font-bold text-slate-600 uppercase">
                        Consent Obtained
                      </span>
                    </label>
                    <p className="text-[11px] text-slate-400 mt-3">
                      In Document: ✅
                    </p>
                  </div>
                </div>
              </div>

              {/* ACTIONS */}
              <div className="flex gap-3 pt-6 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => navigate("/leads")}
                  className="px-6 py-2 rounded-lg font-bold text-slate-600 hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-8 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition"
                >
                  Create Lead
                </button>
              </div>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}
