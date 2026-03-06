import React, { useState, useMemo, useEffect } from "react";
import "./UpdatePayout.css";
import {
  PayoutDashboardService,
  PayoutSearchService,
  PayoutAgentService,
} from "../services/UpdatePayoutService";

const MODE_LABEL_TO_API = {
  "Bank Transfer": "bank_transfer",
  "UPI":           "upi",
  "Cheque":        "cheque",
  "NEFT/RTGS":     "neft/rtgs",
};
const MODE_API_TO_LABEL = Object.fromEntries(
  Object.entries(MODE_LABEL_TO_API).map(([k, v]) => [v, k])
);

function apiToUi(agent) {
  return {
    id:             String(agent.id),
    flatFee:        agent.flat_fee        ?? "",
    percentRate:    agent.percentage_rate ?? "",
    minPayout:      agent.min_amount      ?? "",
    maxPayout:      agent.max_amount      ?? "",
    cycleDay:       String(agent.cycle_day ?? "1"),
    payoutMode:     MODE_API_TO_LABEL[agent.mode] ?? "Bank Transfer",
    bonusThreshold: "",
    bonusAmt:       agent.bonus ?? "",
    active:         agent.status === "active",
    _raw:           agent,
  };
}

function uiToApi(draft, agentId, agentList) {
  const agent = agentList.find((a) => a.id === agentId);
  return {
    agent:           agent?.name ?? "",
    type:            agent?.type?.toLowerCase().replace(" ", "_") ?? "dsa",
    flat_fee:        draft.flatFee     || null,
    percentage_rate: draft.percentRate || "0",
    min_amount:      draft.minPayout   || null,
    max_amount:      draft.maxPayout   || null,
    cycle_day:       parseInt(draft.cycleDay ?? 1),
    mode:            MODE_LABEL_TO_API[draft.payoutMode] ?? "bank_transfer",
    bonus:           draft.bonusAmt    || null,
    status:          draft.active ? "active" : "off",
    action_edit:     false,
  };
}

const agentList = [
  { id: "AG001", name: "Rahul Verma",   type: "DSA",          tenant: "Mumbai",    leads: 142, converted: 38 },
  { id: "AG002", name: "Priya Sharma",  type: "Broker",       tenant: "Delhi",     leads: 98,  converted: 29 },
  { id: "AG003", name: "Amit Joshi",    type: "Lead Partner", tenant: "Bangalore", leads: 210, converted: 54 },
  { id: "AG004", name: "Neha Gupta",    type: "DSA",          tenant: "Hyderabad", leads: 67,  converted: 14 },
  { id: "AG005", name: "Karan Mehta",   type: "Broker",       tenant: "Mumbai",    leads: 185, converted: 41 },
  { id: "AG006", name: "Sunita Rao",    type: "Lead Partner", tenant: "Bangalore", leads: 54,  converted: 10 },
  { id: "AG007", name: "Deepak Singh",  type: "DSA",          tenant: "Mumbai",    leads: 130, converted: 33 },
  { id: "AG008", name: "Meera Pillai",  type: "Broker",       tenant: "Delhi",     leads: 44,  converted: 8  },
];

const payoutModes = ["Bank Transfer", "UPI", "Cheque", "NEFT/RTGS"];

const typeColors = {
  "DSA":          { bg: "#dbeafe", color: "#2563eb" },
  "Broker":       { bg: "#fef9c3", color: "#b45309" },
  "Lead Partner": { bg: "#dcfce7", color: "#16a34a" },
};

const MOCK_PAYOUTS = [
  { id: "AG001", flatFee: "2000", percentRate: "1.5", minPayout: "500",  maxPayout: "50000", cycleDay: "1",  payoutMode: "Bank Transfer", bonusThreshold: "50", bonusAmt: "5000", active: true,  _raw: {} },
  { id: "AG002", flatFee: "1500", percentRate: "2.0", minPayout: "500",  maxPayout: "40000", cycleDay: "15", payoutMode: "UPI",           bonusThreshold: "40", bonusAmt: "4000", active: true,  _raw: {} },
  { id: "AG003", flatFee: "3000", percentRate: "2.5", minPayout: "1000", maxPayout: "75000", cycleDay: "1",  payoutMode: "Bank Transfer", bonusThreshold: "60", bonusAmt: "8000", active: true,  _raw: {} },
  { id: "AG004", flatFee: "1000", percentRate: "1.0", minPayout: "300",  maxPayout: "20000", cycleDay: "1",  payoutMode: "Cheque",        bonusThreshold: "30", bonusAmt: "2000", active: false, _raw: {} },
  { id: "AG005", flatFee: "2500", percentRate: "2.2", minPayout: "800",  maxPayout: "60000", cycleDay: "15", payoutMode: "Bank Transfer", bonusThreshold: "55", bonusAmt: "6000", active: true,  _raw: {} },
  { id: "AG006", flatFee: "1200", percentRate: "1.8", minPayout: "400",  maxPayout: "30000", cycleDay: "1",  payoutMode: "UPI",           bonusThreshold: "35", bonusAmt: "3000", active: true,  _raw: {} },
  { id: "AG007", flatFee: "1800", percentRate: "1.6", minPayout: "600",  maxPayout: "45000", cycleDay: "15", payoutMode: "Bank Transfer", bonusThreshold: "45", bonusAmt: "4500", active: true,  _raw: {} },
  { id: "AG008", flatFee: "900",  percentRate: "0.8", minPayout: "200",  maxPayout: "15000", cycleDay: "1",  payoutMode: "UPI",           bonusThreshold: "25", bonusAmt: "1500", active: false, _raw: {} },
];

function Toast({ msg, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3200);
    return () => clearTimeout(t);
  }, []);
  return (
    <div className={`up-toast up-toast-${type}`}>
      <span>{type === "success" ? "✓" : "✕"}</span>
      {msg}
    </div>
  );
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
  const [payouts,    setPayouts]    = useState(MOCK_PAYOUTS);
  const [dashboard,  setDashboard]  = useState(null);
  const [search,     setSearch]     = useState("");
  const [filterType, setFilterType] = useState("All");
  const [editing,    setEditing]    = useState(null);
  const [draftForm,  setDraftForm]  = useState({});
  const [toast,      setToast]      = useState(null);
  const [saving,     setSaving]     = useState(false);

  const showToast = (msg, type = "success") => setToast({ msg, type });

  useEffect(() => {
    (async () => {
      try {
        const [agentsRes, dashRes] = await Promise.all([
          PayoutAgentService.getAll(),
          PayoutDashboardService.getAll(),
        ]);
        const agents = agentsRes.results ?? agentsRes;
        if (agents.length) setPayouts(agents.map(apiToUi));
        const dash = dashRes.results ?? dashRes;
        if (dash.length) setDashboard(dash[dash.length - 1]);
      } catch (err) {
        console.warn("API unavailable, using mock data:", err.message);
      }
    })();
  }, []);

  useEffect(() => {
    if (!search.trim()) return;
    const timer = setTimeout(async () => {
      try { await PayoutSearchService.create({ search, type: "dsa" }); } catch (_) {}
    }, 600);
    return () => clearTimeout(timer);
  }, [search]);

  const filtered = useMemo(() =>
    agentList.filter((a) => {
      const matchSearch = a.name.toLowerCase().includes(search.toLowerCase()) || a.id.includes(search);
      const matchType   = filterType === "All" || a.type === filterType;
      return matchSearch && matchType;
    }),
    [search, filterType]
  );

  const getPayout  = (id) => payouts.find((p) => p.id === id) || {};
  const startEdit  = (id) => { setEditing(id); setDraftForm({ ...getPayout(id) }); };
  const cancelEdit = ()   => { setEditing(null); setDraftForm({}); };
  const df         = (key, val) => setDraftForm((p) => ({ ...p, [key]: val }));

  const saveEdit = async (agentId) => {
    setSaving(true);
    try {
      const payload  = uiToApi(draftForm, agentId, agentList);
      const existing = getPayout(agentId);
      let result;
      if (existing._raw?.id) {
        result = await PayoutAgentService.update(existing._raw.id, payload);
      } else {
        result = await PayoutAgentService.create(payload);
      }
      setPayouts((prev) =>
        prev.map((p) => (p.id === agentId ? { ...apiToUi(result), id: agentId } : p))
      );
      setEditing(null);
      const agent = agentList.find((a) => a.id === agentId);
      showToast(`Payout updated for ${agent?.name}`);
    } catch (err) {
      showToast("Failed to save payout", "error");
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (agentId) => {
    const p         = getPayout(agentId);
    const agent     = agentList.find((a) => a.id === agentId);
    const newStatus = p.active ? "off" : "active";
    setPayouts((prev) => prev.map((r) => (r.id === agentId ? { ...r, active: !r.active } : r)));
    try {
      if (p._raw?.id) await PayoutAgentService.toggleStatus(p._raw.id, newStatus);
      showToast(
        `${agent?.name} payout ${newStatus === "active" ? "enabled" : "disabled"}`,
        newStatus === "active" ? "success" : "error"
      );
    } catch {
      setPayouts((prev) => prev.map((r) => (r.id === agentId ? { ...r, active: p.active } : r)));
      showToast("Status update failed", "error");
    }
  };

  const totalActive     = dashboard?.active_payouts ?? payouts.filter((p) => p.active).length;
  const avgRate         = dashboard?.Avg_rate ?? (payouts.length
    ? (payouts.reduce((s, p) => s + parseFloat(p.percentRate || 0), 0) / payouts.length).toFixed(1)
    : "0.0");
  const totalMaxPool    = dashboard?.max_pool ?? payouts.reduce((s, p) => s + parseInt(p.maxPayout || 0), 0);
  const payoutModeCount = dashboard?.payout_modes ?? [...new Set(payouts.map((p) => p.payoutMode))].length;

  return (
    <div className="up-root">

      {toast && (
        <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />
      )}

      <div className="up-header">
        <div className="up-header-left">
          <div className="up-header-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="22" height="22">
              <rect x="2" y="5" width="20" height="14" rx="2" />
              <path d="M2 10h20" />
              <path d="M6 15h4M14 15h4" />
            </svg>
          </div>
          <div>
            <h1 className="up-title">Update Payout</h1>
            <p className="up-subtitle">Configure payout rules, rates &amp; schedules per agent</p>
          </div>
        </div>
        <div className="up-header-actions">
          <button className="up-btn-outline">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="14" height="14">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Export
          </button>
        </div>
      </div>

      <div className="up-stats-row">
        <StatCard label="Active Payouts" value={totalActive} sub={`of ${payouts.length} agents`} color="green"
          icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="18" height="18"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>} />
        <StatCard label="Avg. Rate" value={`${avgRate}%`} sub="per conversion" color="blue"
          icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="18" height="18"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>} />
        <StatCard label="Max Pool / mo." value={`₹${(totalMaxPool / 100000).toFixed(1)}L`} sub="combined cap" color="purple"
          icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="18" height="18"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg>} />
        <StatCard label="Payout Modes" value={payoutModeCount} sub="distinct methods" color="orange"
          icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="18" height="18"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>} />
      </div>

      <div className="up-main-card">
        <div className="up-toolbar">
          <div className="up-search-wrap">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="14" height="14">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
            <input placeholder="Search agent..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="up-filters">
            {["All", "DSA", "Broker", "Lead Partner"].map((t) => (
              <button key={t} className={`up-filter-btn ${filterType === t ? "active" : ""}`} onClick={() => setFilterType(t)}>
                {t}
              </button>
            ))}
          </div>
        </div>

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
              {filtered.map((agent) => {
                const p      = getPayout(agent.id);
                const isEdit = editing === agent.id;
                return (
                  <tr key={agent.id} className={isEdit ? "row-editing" : ""}>
                    <td>
                      <div className="up-agent-cell">
                        <div className="up-avatar">{agent.name.charAt(0)}</div>
                        <div>
                          <div className="up-agent-name">{agent.name}</div>
                          <div className="up-agent-id">{agent.id}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="up-type-badge" style={{ background: typeColors[agent.type]?.bg, color: typeColors[agent.type]?.color }}>
                        {agent.type}
                      </span>
                    </td>
                    <td>
                      {isEdit ? (
                        <input className="up-inline-input" value={draftForm.flatFee || ""} onChange={(e) => df("flatFee", e.target.value)} />
                      ) : (
                        <span className="up-val-bold">₹{p.flatFee ?? "—"}</span>
                      )}
                    </td>
                    <td>
                      {isEdit ? (
                        <div className="up-inline-rate">
                          <input className="up-inline-input" value={draftForm.percentRate || ""} onChange={(e) => df("percentRate", e.target.value)} />
                          <span>%</span>
                        </div>
                      ) : (
                        <span className="up-rate-badge">{p.percentRate ?? "—"}%</span>
                      )}
                    </td>
                    <td>
                      {isEdit ? (
                        <div className="up-minmax-wrap">
                          <input className="up-inline-input sm" placeholder="Min" value={draftForm.minPayout || ""} onChange={(e) => df("minPayout", e.target.value)} />
                          <span className="up-sep">/</span>
                          <input className="up-inline-input sm" placeholder="Max" value={draftForm.maxPayout || ""} onChange={(e) => df("maxPayout", e.target.value)} />
                        </div>
                      ) : (
                        <span className="up-minmax-text">₹{p.minPayout ?? "—"} / ₹{p.maxPayout ?? "—"}</span>
                      )}
                    </td>
                    <td>
                      {isEdit ? (
                        <select className="up-inline-select" value={draftForm.cycleDay || "1"} onChange={(e) => df("cycleDay", e.target.value)}>
                          <option value="1">1st</option>
                          <option value="15">15th</option>
                        </select>
                      ) : (
                        <span className="up-cycle-badge">🗓 {p.cycleDay}{p.cycleDay === "1" ? "st" : "th"}</span>
                      )}
                    </td>
                    <td>
                      {isEdit ? (
                        <select className="up-inline-select" value={draftForm.payoutMode || "Bank Transfer"} onChange={(e) => df("payoutMode", e.target.value)}>
                          {payoutModes.map((m) => (<option key={m} value={m}>{m}</option>))}
                        </select>
                      ) : (
                        <span className="up-mode-text">{p.payoutMode ?? "—"}</span>
                      )}
                    </td>
                    <td>
                      {isEdit ? (
                        <div className="up-minmax-wrap">
                          <input className="up-inline-input sm" placeholder="@Conv" value={draftForm.bonusThreshold || ""} onChange={(e) => df("bonusThreshold", e.target.value)} />
                          <span className="up-sep">→</span>
                          <input className="up-inline-input sm" placeholder="₹" value={draftForm.bonusAmt || ""} onChange={(e) => df("bonusAmt", e.target.value)} />
                        </div>
                      ) : (
                        <span className="up-bonus-text">
                          {p.bonusThreshold ? `@${p.bonusThreshold} → ₹${p.bonusAmt}` : `₹${p.bonusAmt ?? "—"}`}
                        </span>
                      )}
                    </td>
                    <td>
                      <button className={`up-toggle-status ${p.active ? "on" : "off"}`} onClick={() => toggleActive(agent.id)}>
                        <span className="up-toggle-thumb" />
                        {p.active ? "Active" : "Off"}
                      </button>
                    </td>
                    <td>
                      {isEdit ? (
                        <div className="up-action-btns">
                          <button className="up-save-btn" onClick={() => saveEdit(agent.id)} disabled={saving}>
                            {saving ? "…" : "Save"}
                          </button>
                          <button className="up-cancel-btn" onClick={cancelEdit} disabled={saving}>✕</button>
                        </div>
                      ) : (
                        <button className="up-edit-btn" onClick={() => startEdit(agent.id)}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="13" height="13">
                            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                          </svg>
                          Edit
                        </button>
                      )}
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
