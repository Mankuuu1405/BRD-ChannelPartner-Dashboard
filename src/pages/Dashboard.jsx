import React from "react";
import { useNavigate } from "react-router-dom";
import "./AgentPerformance.css";

const statsData = [
  { label: "Total Agents",     value: "2,480",  change: "+12%", positive: true,  color: "blue",   icon: "👥" },
  { label: "Active Agents",    value: "1,843",  change: "+8%",  positive: true,  color: "green",  icon: "✅" },
  { label: "Total Payouts",    value: "₹48.2L", change: "+23%", positive: true,  color: "purple", icon: "💳" },
  { label: "Leads Generated",  value: "10,294", change: "-3%",  positive: false, color: "orange", icon: "📈" },
];

const recentAgents = [
  { id: "AG001", name: "Rahul Verma",  type: "DSA",          status: "Active",   payout: "₹1,14,000" },
  { id: "AG002", name: "Priya Sharma", type: "Broker",       status: "Active",   payout: "₹87,000"   },
  { id: "AG003", name: "Amit Joshi",   type: "Lead Partner", status: "Active",   payout: "₹1,62,000" },
  { id: "AG004", name: "Neha Gupta",   type: "DSA",          status: "Inactive", payout: "₹42,000"   },
  { id: "AG005", name: "Karan Mehta",  type: "Broker",       status: "Active",   payout: "₹1,23,000" },
];

const typeColors = {
  DSA:            { bg: "#dbeafe", color: "#2563eb" },
  Broker:         { bg: "#fef9c3", color: "#b45309" },
  "Lead Partner": { bg: "#dcfce7", color: "#16a34a" },
};

const quickStats = [
  { label: "Payouts This Month",  value: "₹12.4L", sub: "43 agents paid" },
  { label: "Pending Approvals",   value: "18",     sub: "Needs review" },
  { label: "Offers Active",       value: "5",      sub: "2 expiring soon" },
  { label: "Avg Conversion Rate", value: "26.4%",  sub: "Industry avg: 22%" },
];

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="ap-root">

      {/* Header */}
      <div className="ap-page-header">
        <div>
          <h1 className="ap-title">Dashboard</h1>
          <p className="ap-subtitle">Welcome back, Amit! Here's what's happening today.</p>
        </div>
        <div className="ap-header-actions">
          <button className="ap-btn-outline">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="14" height="14">
              <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            Jan 2026
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="ap-stats">
        {statsData.map((s) => (
          <div key={s.label} className={`ap-stat-card ap-stat-${s.color}`}>
            <div className="ap-stat-top">
              <div className={`ap-stat-icon ap-icon-${s.color}`} style={{ fontSize: 18 }}>{s.icon}</div>
              <span className={`ap-stat-change ${s.positive ? "pos" : "neg"}`}>
                {s.positive ? "↑" : "↓"} {s.change}
              </span>
            </div>
            <div className="ap-stat-value">{s.value}</div>
            <div className="ap-stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Quick Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14 }}>
        {quickStats.map((q) => (
          <div key={q.label} className="ap-card" style={{ padding: "16px 20px" }}>
            <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 500, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.5px" }}>{q.label}</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: "#0f172a", letterSpacing: "-0.5px", marginBottom: 2 }}>{q.value}</div>
            <div style={{ fontSize: 12, color: "#64748b" }}>{q.sub}</div>
          </div>
        ))}
      </div>

      {/* Recent Agents Table */}
      <div className="ap-card ap-table-card">
        <div className="ap-card-header">
          <div>
            <h3>Recent Agents</h3>
            <p>Latest onboarded agents</p>
          </div>
          <button className="ap-btn-outline" style={{ fontSize: 12 }} onClick={() => navigate("/dashboard/agent-performance")}>View All →</button>
        </div>
        <div className="ap-table-wrap">
          <table className="ap-table">
            <thead>
              <tr>
                <th>Agent ID</th>
                <th>Name</th>
                <th>Type</th>
                <th>Payout</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentAgents.map((a) => (
                <tr key={a.id}>
                  <td className="ap-agent-id">{a.id}</td>
                  <td className="ap-agent-name">
                    <div className="ap-avatar">{a.name.charAt(0)}</div>
                    {a.name}
                  </td>
                  <td>
                    <span className="ap-type-badge" style={{ background: typeColors[a.type]?.bg, color: typeColors[a.type]?.color }}>
                      {a.type}
                    </span>
                  </td>
                  <td className="ap-payout">{a.payout}</td>
                  <td>
                    <span className={`ap-status-badge ${a.status === "Active" ? "active" : "inactive"}`}>
                      {a.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}