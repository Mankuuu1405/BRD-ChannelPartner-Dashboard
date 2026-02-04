import {
  ClipboardDocumentCheckIcon,
  ShieldExclamationIcon,
  PresentationChartLineIcon,
  UserGroupIcon,
  BanknotesIcon,
} from "@heroicons/react/24/outline";

const teamsData = [
  {
    id: "legal_verification",
    title: "Legal & Verification",
    description: "Handles compliance, KYC, and document verification",
    icon: ClipboardDocumentCheckIcon,
  },
  {
    id: "fraud_team",
    title: "Fraud Team",
    description: "Monitors and investigates suspicious activities",
    icon: ShieldExclamationIcon,
  },
  {
    id: "valuation",
    title: "Valuation",
    description: "Manages asset and collateral valuation",
    icon: PresentationChartLineIcon,
  },
  {
    id: "crm_sales",
    title: "CRM & Sales",
    description: "Leads, opportunities, and sales pipelines",
    icon: UserGroupIcon,
  },
  {
    id: "finance",
    title: "Finance",
    description: "Payments, invoicing, and financial reconciliation",
    icon: BanknotesIcon,
  },
];

export default function InternalTeamDashboards() {
  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <div className="text-2xl font-bold text-gray-800">
            Dashboard & Role Management Hub
          </div>
          <div className="text-sm text-gray-500">
            Configure and manage all internal team dashboards and their
            permissions.
          </div>
        </div>
      </div>
      <div className="space-y-4">
        <div className="text-lg font-semibold text-gray-700 border-b pb-2">
          Internal Team Dashboards
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {teamsData.map((team) => (
            <button
              key={team.id}
              className="p-4 rounded-lg border border-gray-200 bg-white text-gray-800 shadow-card hover:shadow-md hover:bg-gray-50 text-left transition-all"
            >
              <div className="flex items-center space-x-3 mb-2">
                {(() => {
                  const Icon = team.icon;
                  return <Icon className="h-5 w-5 text-blue-600" />;
                })()}
                <span className="font-bold">{team.title}</span>
              </div>
              <p className="text-xs text-gray-600">{team.description}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}