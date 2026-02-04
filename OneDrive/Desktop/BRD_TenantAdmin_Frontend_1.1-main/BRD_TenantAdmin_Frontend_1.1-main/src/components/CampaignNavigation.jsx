import React from 'react';
import { 
  PhoneIcon, EnvelopeIcon, DevicePhoneMobileIcon, 
  ChatBubbleLeftRightIcon, MegaphoneIcon, GlobeAltIcon,
  ChartBarIcon 
} from "@heroicons/react/24/outline";

// This is Configuration (Design), not Mock Data. We keep this.
const CAMPAIGN_TYPES = [
  { id: 'DIALER', label: 'Dialer Campaigns', icon: PhoneIcon, desc: 'Auto-dialer & Call Scripts' },
  { id: 'EMAIL', label: 'Email Marketing', icon: EnvelopeIcon, desc: 'Newsletters & Drip' },
  { id: 'SMS', label: 'SMS Blasts', icon: DevicePhoneMobileIcon, desc: 'Short Codes & OTPs' },
  { id: 'WHATSAPP', label: 'WhatsApp', icon: ChatBubbleLeftRightIcon, desc: 'Business API Msgs' },
  { id: 'VOICE', label: 'Voice Broadcast', icon: MegaphoneIcon, desc: 'Pre-recorded OBD' },
  { id: 'SOCIAL', label: 'Social Media', icon: GlobeAltIcon, desc: 'FB/Insta Lead Forms' },
];

// Added 'campaigns' prop to receive real data
export default function CampaignNavigation({ activeChannel, onChange, campaigns = [] }) {
  
  // Helper to count how many campaigns exist for a specific channel
  const getCount = (channelId) => {
    return campaigns.filter(c => c.type === channelId || c.channel === channelId).length;
  };

  return (
    <div className="space-y-6">
      
      {/* SECTION: OVERVIEW */}
      <div>
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-2">Analytics</h3>
        <button 
           onClick={() => onChange('OVERVIEW')}
           className={`w-full flex items-center justify-between px-3 py-3 rounded-xl text-left transition-all ${
             activeChannel === 'OVERVIEW' ? 'bg-white shadow-sm ring-1 ring-slate-200' : 'hover:bg-slate-200/50'
           }`}
        >
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${activeChannel === 'OVERVIEW' ? 'bg-blue-100 text-blue-600' : 'bg-slate-200 text-slate-500'}`}>
              <ChartBarIcon className="h-5 w-5" />
            </div>
            <div>
              <div className={`text-xs font-bold ${activeChannel === 'OVERVIEW' ? 'text-slate-900' : 'text-slate-600'}`}>All Campaigns</div>
              <div className="text-[10px] text-slate-400 font-medium">Global Performance</div>
            </div>
          </div>
          {/* Dynamic Badge for Total */}
          <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">
            {campaigns.length}
          </span>
        </button>
      </div>

      {/* SECTION: CHANNELS */}
      <div>
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-2">Channels</h3>
        <div className="space-y-1">
          {CAMPAIGN_TYPES.map((type) => {
            const count = getCount(type.id);
            return (
              <button
                key={type.id}
                onClick={() => onChange(type.id)}
                className={`w-full flex items-center justify-between px-3 py-3 rounded-xl text-left transition-all group ${
                  activeChannel === type.id ? 'bg-white shadow-sm ring-1 ring-slate-200' : 'hover:bg-slate-200/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg transition-colors ${
                    activeChannel === type.id 
                    ? 'bg-blue-100 text-blue-600' 
                    : 'bg-white border border-slate-200 text-slate-400 group-hover:border-blue-200 group-hover:text-blue-500'
                  }`}>
                    <type.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className={`text-xs font-bold ${activeChannel === type.id ? 'text-slate-900' : 'text-slate-600'}`}>
                      {type.label}
                    </div>
                    <div className="text-[10px] text-slate-400 font-medium leading-none mt-1">
                      {type.desc}
                    </div>
                  </div>
                </div>
                {/* Dynamic Badge per Channel */}
                {count > 0 && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    activeChannel === type.id ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'
                  }`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
