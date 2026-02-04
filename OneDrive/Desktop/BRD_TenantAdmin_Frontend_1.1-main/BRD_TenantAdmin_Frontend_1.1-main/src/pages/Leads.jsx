import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar.jsx";
import CampaignManager from "../components/CampaignManager.jsx";
import PipelineManager from "../components/PipelineManager.jsx";
import leadService from "../services/leadService";


import {
  MegaphoneIcon,
  FunnelIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";

export default function Leads() {
  const [activeModule, setActiveModule] = useState("PIPELINE");
  const [leadCount, setLeadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  /* =========================
     FETCH LEADS METRICS
  ========================= */
  useEffect(() => {
  const fetchLeads = async () => {
    try {
      const data = await leadService.getAll();

      // DRF pagination safe
      const leads = data.results ?? data;
      setLeadCount(leads.length);
    } catch (error) {
      console.error("Failed to load leads count", error);
    } finally {
      setLoading(false);
    }
  };

  fetchLeads();
}, []);


  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* GLOBAL SIDEBAR */}
      <Sidebar />

      {/* MAIN CONTENT */}
      <div className="flex flex-col h-screen overflow-hidden relative">
        {/* HEADER */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-6">
            <h1 className="text-xl font-black text-slate-900 tracking-tight">
              Growth & Sales Engine
            </h1>

            {/* MODULE SWITCHER */}
            <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
              <button
                onClick={() => setActiveModule("CAMPAIGNS")}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-xs font-bold uppercase tracking-wide transition-all ${
                  activeModule === "CAMPAIGNS"
                    ? "bg-white text-blue-600 shadow-sm ring-1 ring-slate-200"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                <MegaphoneIcon className="h-4 w-4" />
                Acquisition
              </button>

              <button
                onClick={() => setActiveModule("PIPELINE")}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-xs font-bold uppercase tracking-wide transition-all ${
                  activeModule === "PIPELINE"
                    ? "bg-white text-emerald-600 shadow-sm ring-1 ring-slate-200"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                <FunnelIcon className="h-4 w-4" />
                Pipeline
              </button>
            </div>
          </div>

          {/* CONTEXTUAL INFO */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
              {loading ? (
                "Loading metrics..."
              ) : activeModule === "CAMPAIGNS" ? (
                <>
                  Campaigns generating leads
                  <ArrowRightIcon className="h-3 w-3" />
                  Feeding pipeline
                </>
              ) : (
                <>
                  Processing {leadCount} Leads
                  <ArrowRightIcon className="h-3 w-3" />
                  Closing deals
                </>
              )}
            </div>
          </div>
        </header>

        {/* DYNAMIC CONTENT */}
        <div className="flex-1 overflow-hidden relative">
          {activeModule === "CAMPAIGNS" ? (
            <CampaignManager />
          ) : (
            <PipelineManager />
          )}
        </div>
      </div>
    </div>
  );
}
