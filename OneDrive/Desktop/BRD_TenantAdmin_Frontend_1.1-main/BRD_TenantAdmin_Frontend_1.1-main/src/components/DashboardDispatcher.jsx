import React from "react";
import { usePermissions } from "../hooks/usePermissions";

// Specialized Dashboards
import Dashboard from "../pages/Dashboard.jsx"; // Admin / Generic
import SalesDashboardView from "../pages/dashboards/SalesDashboardView.jsx"; // Sales
import CreditDashboardView from "../pages/dashboards/CreditDashboardView.jsx"; // Credit/Ops
import CollectionDashboardView from "../pages/dashboards/CollectionDashboardView.jsx"; // Collections

// ✅ Point 8 Components
import PersonaFocusWidget from "./PersonaFocusWidget.jsx";
import EscalationWidget from "./EscalationWidget.jsx";

export default function DashboardDispatcher() {
  const { roleType, loading } = usePermissions();

  if (loading) return <div className="p-10 text-center text-gray-500">Initializing Workspace...</div>;

  // Logic to determine base view
  let DashboardComponent;
  switch (roleType) {
    case 'sales':
    case 'channel_partner':
      DashboardComponent = SalesDashboardView;
      break;
    case 'credit_manager':
    case 'underwriter':
      DashboardComponent = CreditDashboardView;
      break;
    case 'collection_agent':
      DashboardComponent = CollectionDashboardView;
      break;
    default:
      DashboardComponent = Dashboard; // Admin or Manager
      break;
  }

  return (
    <div className="flex flex-col w-full">
      {/* ✅ Point 8: Auto Persona Layer
         This layer sits on top of ANY dashboard. 
         It intercepts the user flow if there are urgent "Activity Clusters".
         FIX: Hidden for 'admin' to prevent cluttering the main dashboard.
      */}
      {roleType !== 'admin' && <PersonaFocusWidget />}

      {/* ✅ Point 8: Hierarchy Layer
         Visible specifically for roles that handle escalations (Admin/Manager).
         We include it here to ensure it persists across role views if a manager mimics another role.
      */}
      {(roleType === 'admin' || roleType === 'manager') && (
        <EscalationWidget />
      )}

      {/* Base Dashboard View */}
      <DashboardComponent />
    </div>
  );
}