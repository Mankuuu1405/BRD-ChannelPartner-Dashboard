import React, { useState, useEffect } from 'react';
import leadService from "../services/leadService";
// Ensure these components exist in src/components/
import CampaignNavigation from "./CampaignNavigation"; 
import CampaignWorkspace from "./CampaignWorkspace"; 
import CreateCampaignModal from "./CreateCampaignModal"; 

export default function CampaignManager() {
  const [activeChannel, setActiveChannel] = useState("OVERVIEW");
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);

  const [campaignData, setCampaignData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        setLoading(true);
        // Assuming your service has a getCampaigns method or use getAll with a param
        const data = await leadService.getAll({ type: 'campaign' }); 
        setCampaignData(Array.isArray(data) ? data : data.results || []);
      } catch (error) {
        console.error("Error fetching campaigns:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  return (
    <div className="flex h-full">
      {/* LEFT: Channel Navigation */}
      <div className="w-64 bg-slate-50 border-r border-slate-200 flex-shrink-0 overflow-y-auto h-full">
        <div className="p-4">
           <button 
             onClick={() => setCreateModalOpen(true)}
             className="w-full mb-4 bg-primary-600 text-white py-3 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-primary-700 shadow-lg shadow-primary-200 border border-transparent transition-all active:scale-95"
           >
             + New Campaign
           </button>
           <CampaignNavigation activeChannel={activeChannel} onChange={setActiveChannel} campaigns={campaignData} />
        </div>
      </div>

      {/* RIGHT: Workspace */}
      <div className="flex-1 overflow-y-auto bg-white p-8">
        <CampaignWorkspace channel={activeChannel} data={campaignData} />
      </div>

      {/* MODAL */}
      <CreateCampaignModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setCreateModalOpen(false)} 
        defaultChannel={activeChannel}
      />
    </div>
  );
}
