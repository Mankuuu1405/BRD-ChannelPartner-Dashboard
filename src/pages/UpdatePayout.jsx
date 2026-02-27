import React, { useState, useMemo } from "react";
import "./UpdatePayout.css";

const agentList = [
  { id: "AG001", name: "Rahul Verma",    type: "DSA",           tenant: "Mumbai",    leads: 142, converted: 38 },
  { id: "AG002", name: "Priya Sharma",   type: "Broker",        tenant: "Delhi",     leads: 98,  converted: 29 },
  { id: "AG003", name: "Amit Joshi",     type: "Lead Partner",  tenant: "Bangalore", leads: 210, converted: 54 },
  { id: "AG004", name: "Neha Gupta",     type: "DSA",           tenant: "Hyderabad", leads: 67,  converted: 14 },
  { id: "AG005", name: "Karan Mehta",    type: "Broker",        tenant: "Mumbai",    leads: 185, converted: 41 },
  { id: "AG006", name: "Sunita Rao",     type: "Lead Partner",  tenant: "Bangalore", leads: 54,  converted: 10 },
  { id: "AG007", name: "Deepak Singh",   type: "DSA",           tenant: "Mumbai",    leads: 130, converted: 33 },
  { id: "AG008", name: "Meera Pillai",   type: "Broker",        tenant: "Delhi",     leads: 44,  converted: 8  },
];

const initialPayouts = [
  { id: "AG001", flatFee: "2000",  percentRate: "1.5",  minPayout: "500",  maxPayout: "50000", cycleDay: "1",  payoutMode: "Bank Transfer", bonusThreshold: "50", bonusAmt: "5000",  active: true  },
  { id: "AG002", flatFee: "1500",  percentRate: "2.0",  minPayout: "500",  maxPayout: "40000", cycleDay: "15", payoutMode: "UPI",           bonusThreshold: "40", bonusAmt: "4000",  active: true  },
  { id: "AG003", flatFee: "3000",  percentRate: "2.5",  minPayout: "1000", maxPayout: "75000", cycleDay: "1",  payoutMode: "Bank Transfer", bonusThreshold: "60", bonusAmt: "8000",  active: true  },
  { id: "AG004", flatFee: "1000",  percentRate: "1.0",  minPayout: "300",  maxPayout: "20000", cycleDay: "1",  payoutMode: "Cheque",        bonusThreshold: "30", bonusAmt: "2000",  active: false },
  { id: "AG005", flatFee: "2500",  percentRate: "2.2",  minPayout: "800",  maxPayout: "60000", cycleDay: "15", payoutMode: "Bank Transfer", bonusThreshold: "55", bonusAmt: "6000",  active: true  },
  { id: "AG006", flatFee: "1200",  percentRate: "1.8",  minPayout: "400",  maxPayout: "30000", cycleDay: "1",  payoutMode: "UPI",           bonusThreshold: "35", bonusAmt: "3000",  active: true  },
  { id: "AG007", flatFee: "1800",  percentRate: "1.6",  minPayout: "600",  maxPayout: "45000", cycleDay: "15", payoutMode: "Bank Transfer", bonusThreshold: "45", bonusAmt: "4500",  active: true  },
  { id: "AG008", flatFee: "900",   percentRate: "0.8",  minPayout: "200",  maxPayout: "15000", cycleDay: "1",  payoutMode: "UPI",           bonusThreshold: "25", bonusAmt: "1500",  active: false },
];

const payoutModes = ["Bank Transfer", "UPI", "Cheque", "NEFT/RTGS"];
const typeColors  = { DSA: { bg: "#dbeafe", color: "#2563eb" }, Broker: { bg: "#fef9c3", color: "#b45309" }, "Lead Partner": { bg: "#dcfce7", color: "#16a34a" } };

function Toast({ msg, type, onClose }) {
  React.useEffect(() => { const t = setTimeout(onClose, 3200); return () => clearTimeout(t); }, []);
  return <div className={`up-toast up-toast-${type}`}><span>{type === "success" ? "✓" : "✕"}</span>{msg}</div>;
}

function StatCard({ label, value, sub, color, icon }) {
  return (
    <div className={`up-stat up-stat-${color}`}>
      <div className="up-stat-icon">{icon}</div>
      <div className="up-stat-val">{value}</div>
      <div className="up-stat-label">{label}</div>
      {sub && <div className="up-stat-sub">{sub}</div>}
    </div>
  );
}

export default function UpdatePayout() {
  const [payouts,    setPayouts]    = useState(initialPayouts);
  const [search,     setSearch]     = useState("");
  const [filterType, setFilterType] = useState("All");
  const [editing,    setEditing]    = useState(null); // agentId being edited
  const [draftForm,  setDraftForm]  = useState({});
  const [toast,      setToast]      = useState(null);
  const [saved,      setSaved]      = useState({});

  const showToast = (msg, type = "success") => setToast({ msg, type });

  const filtered = useMemo(() => agentList.filter(a => {
    const matchSearch = a.name.toLowerCase().includes(search.toLowerCase()) || a.id.includes(search);
    const matchType   = filterType === "All" || a.type === filterType;
    return matchSearch && matchType;
  }), [search, filterType]);

  const getPayout = (id) => payouts.find(p => p.id === id) || {};

  const startEdit = (agentId) => {
    setEditing(agentId);
    setDraftForm({ ...getPayout(agentId) });
    setSaved(p => ({ ...p, [agentId]: false }));
  };

  const cancelEdit = () => { setEditing(null); setDraftForm({}); };

  const df = (key, val) => setDraftForm(p => ({ ...p, [key]: val }));

  const saveEdit = (agentId) => {
    setPayouts(prev => prev.map(p => p.id === agentId ? { ...draftForm } : p));
    setSaved(p => ({ ...p, [agentId]: true }));
    setEditing(null);
    const agent = agentList.find(a => a.id === agentId);
    showToast(`Payout updated for ${agent?.name}`);
  };

  const toggleActive = (agentId) => {
    setPayouts(prev => prev.map(p => p.id === agentId ? { ...p, active: !p.active } : p));
    const agent   = agentList.find(a => a.id === agentId);
    const current = payouts.find(p => p.id === agentId);
    showToast(`${agent?.name} payout ${current?.active ? "disabled" : "enabled"}`, current?.active ? "error" : "success");
  };

  // summary stats
  const totalActive   = payouts.filter(p => p.active).length;
  const avgRate       = (payouts.reduce((s, p) => s + parseFloat(p.percentRate || 0), 0) / payouts.length).toFixed(1);
  const totalMaxPool  = payouts.reduce((s, p) => s + parseInt(p.maxPayout || 0), 0);

  return (
    <div className="up-root">
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      {/* Header */}
      <div className="up-header">
        <div className="up-header-left">
          <div className="up-header-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="22" height="22"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/><path d="M6 15h4M14 15h4"/></svg>
          </div>
          <div>
            <h1 className="up-title">Update Payout</h1>
            <p className="up-subtitle">Configure payout rules, rates & schedules per agent</p>
          </div>
        </div>
        <div className="up-header-actions">
          <button className="up-btn-outline">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="14" height="14"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Export
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="up-stats-row">
        <StatCard label="Active Payouts"  value={totalActive}          sub={`of ${payouts.length} agents`} color="green"  icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="18" height="18"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>} />
        <StatCard label="Avg. Rate"       value={`${avgRate}%`}        sub="per conversion"                color="blue"   icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="18" height="18"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>} />
        <StatCard label="Max Pool / mo."  value={`₹${(totalMaxPool/100000).toFixed(1)}L`} sub="combined cap"  color="purple" icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="18" height="18"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg>} />
        <StatCard label="Payout Modes"    value={[...new Set(payouts.map(p=>p.payoutMode))].length} sub="distinct methods" color="orange" icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="18" height="18"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>} />
      </div>

      {/* Main Card */}
      <div className="up-main-card">
        {/* Toolbar */}
        <div className="up-toolbar">
          <div className="up-search-wrap">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="14" height="14"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <input placeholder="Search agent..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="up-filters">
            {["All","DSA","Broker","Lead Partner"].map(t => (
              <button key={t} className={`up-filter-btn ${filterType === t ? "active" : ""}`} onClick={() => setFilterType(t)}>{t}</button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="up-table-wrap">
          <table className="up-table">
            <thead>
              <tr>
                <th>Agent</th>
                <th>Type</th>
                <th>Flat Fee (₹)</th>
                <th>% Rate</th>
                <th>Min / Max (₹)</th>
                <th>Cycle Day</th>
                <th>Mode</th>
                <th>Bonus</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(agent => {
                const p       = getPayout(agent.id);
                const isEdit  = editing === agent.id;

                return (
                  <tr key={agent.id} className={isEdit ? "row-editing" : ""}>
                    {/* Agent */}
                    <td>
                      <div className="up-agent-cell">
                        <div className="up-avatar">{agent.name.charAt(0)}</div>
                        <div>
                          <div className="up-agent-name">{agent.name}</div>
                          <div className="up-agent-id">{agent.id}</div>
                        </div>
                      </div>
                    </td>

                    {/* Type */}
                    <td>
                      <span className="up-type-badge" style={{ background: typeColors[agent.type]?.bg, color: typeColors[agent.type]?.color }}>
                        {agent.type}
                      </span>
                    </td>

                    {/* Flat Fee */}
                    <td>
                      {isEdit
                        ? <input className="up-inline-input" value={draftForm.flatFee || ""} onChange={e => df("flatFee", e.target.value)} />
                        : <span className="up-val-bold">₹{p.flatFee}</span>}
                    </td>

                    {/* % Rate */}
                    <td>
                      {isEdit
                        ? <div className="up-inline-rate">
                            <input className="up-inline-input" value={draftForm.percentRate || ""} onChange={e => df("percentRate", e.target.value)} />
                            <span>%</span>
                          </div>
                        : <span className="up-rate-badge">{p.percentRate}%</span>}
                    </td>

                    {/* Min / Max */}
                    <td>
                      {isEdit
                        ? <div className="up-minmax-wrap">
                            <input className="up-inline-input sm" placeholder="Min" value={draftForm.minPayout || ""} onChange={e => df("minPayout", e.target.value)} />
                            <span className="up-sep">/</span>
                            <input className="up-inline-input sm" placeholder="Max" value={draftForm.maxPayout || ""} onChange={e => df("maxPayout", e.target.value)} />
                          </div>
                        : <span className="up-minmax-text">₹{p.minPayout} / ₹{p.maxPayout}</span>}
                    </td>

                    {/* Cycle Day */}
                    <td>
                      {isEdit
                        ? <select className="up-inline-select" value={draftForm.cycleDay || "1"} onChange={e => df("cycleDay", e.target.value)}>
                            <option value="1">1st</option>
                            <option value="15">15th</option>
                          </select>
                        : <span className="up-cycle-badge">🗓 {p.cycleDay}{p.cycleDay === "1" ? "st" : "th"}</span>}
                    </td>

                    {/* Mode */}
                    <td>
                      {isEdit
                        ? <select className="up-inline-select" value={draftForm.payoutMode || "Bank Transfer"} onChange={e => df("payoutMode", e.target.value)}>
                            {payoutModes.map(m => <option key={m} value={m}>{m}</option>)}
                          </select>
                        : <span className="up-mode-text">{p.payoutMode}</span>}
                    </td>

                    {/* Bonus */}
                    <td>
                      {isEdit
                        ? <div className="up-minmax-wrap">
                            <input className="up-inline-input sm" placeholder="@Conv" value={draftForm.bonusThreshold || ""} onChange={e => df("bonusThreshold", e.target.value)} />
                            <span className="up-sep">→</span>
                            <input className="up-inline-input sm" placeholder="₹" value={draftForm.bonusAmt || ""} onChange={e => df("bonusAmt", e.target.value)} />
                          </div>
                        : <span className="up-bonus-text">@{p.bonusThreshold} → ₹{p.bonusAmt}</span>}
                    </td>

                    {/* Status */}
                    <td>
                      <button className={`up-toggle-status ${p.active ? "on" : "off"}`} onClick={() => toggleActive(agent.id)}>
                        <span className="up-toggle-thumb" />
                        {p.active ? "Active" : "Off"}
                      </button>
                    </td>

                    {/* Actions */}
                    <td>
                      {isEdit
                        ? <div className="up-action-btns">
                            <button className="up-save-btn" onClick={() => saveEdit(agent.id)}>Save</button>
                            <button className="up-cancel-btn" onClick={cancelEdit}>✕</button>
                          </div>
                        : <button className="up-edit-btn" onClick={() => startEdit(agent.id)}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="13" height="13"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                            Edit
                          </button>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="up-table-footer">
          <span>{filtered.length} agents shown</span>
        </div>
      </div>
    </div>
  );
}