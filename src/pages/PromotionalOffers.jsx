import React, { useState, useMemo } from "react";
import "./PromotionalOffers.css";

// ─── Mock Data ────────────────────────────────────────────────────────────────
const initialOffers = [
  {
    id: "OF001", title: "Summer Sprint Bonus",     type: "Bonus",     status: "Active",
    discount: "",   bonusAmt: "₹8,000",  bonusTrigger: "50 leads",
    startDate: "2026-01-01", endDate: "2026-03-31",
    agentTypes: ["DSA", "Broker"],
    tenants: ["Mumbai", "Delhi"],
    description: "Earn ₹8,000 extra bonus on closing 50 qualified leads before March end.",
    usageCount: 18, maxUsage: 50, color: "#f59e0b",
    tag: "🔥 Hot",
  },
  {
    id: "OF002", title: "New Agent Welcome",        type: "Flat Bonus", status: "Active",
    discount: "",   bonusAmt: "₹3,000",  bonusTrigger: "First 10 leads",
    startDate: "2026-01-01", endDate: "2026-12-31",
    agentTypes: ["DSA", "Broker", "Lead Partner"],
    tenants: ["All"],
    description: "Welcome bonus for newly onboarded agents completing their first 10 leads.",
    usageCount: 32, maxUsage: 100, color: "#22c55e",
    tag: "🌟 Welcome",
  },
  {
    id: "OF003", title: "Q1 Conversion Booster",   type: "Rate Hike",  status: "Active",
    discount: "+0.5%", bonusAmt: "",    bonusTrigger: "30% conversion rate",
    startDate: "2026-01-01", endDate: "2026-03-31",
    agentTypes: ["Broker"],
    tenants: ["Bangalore", "Chennai"],
    description: "Payout rate increased by 0.5% for agents maintaining 30%+ conversion this quarter.",
    usageCount: 9, maxUsage: 30, color: "#3b82f6",
    tag: "📈 Rate",
  },
  {
    id: "OF004", title: "Referral Champion",        type: "Bonus",      status: "Scheduled",
    discount: "",   bonusAmt: "₹5,000",  bonusTrigger: "5 agent referrals",
    startDate: "2026-04-01", endDate: "2026-06-30",
    agentTypes: ["DSA", "Lead Partner"],
    tenants: ["Mumbai", "Hyderabad"],
    description: "Bonus for agents who refer 5 or more new agents who get onboarded successfully.",
    usageCount: 0, maxUsage: 40, color: "#8b5cf6",
    tag: "🤝 Referral",
  },
  {
    id: "OF005", title: "Festive Season Mega Offer",type: "Bonus",      status: "Expired",
    discount: "",   bonusAmt: "₹12,000", bonusTrigger: "75 leads",
    startDate: "2025-10-01", endDate: "2025-11-30",
    agentTypes: ["DSA", "Broker"],
    tenants: ["All"],
    description: "Special festive season bonus for high performers crossing 75 leads.",
    usageCount: 47, maxUsage: 50, color: "#ef4444",
    tag: "🎉 Festive",
  },
  {
    id: "OF006", title: "Platinum Elite Perk",      type: "Rate Hike",  status: "Active",
    discount: "+1.0%", bonusAmt: "",    bonusTrigger: "Platinum tier",
    startDate: "2026-01-01", endDate: "2026-12-31",
    agentTypes: ["DSA", "Broker", "Lead Partner"],
    tenants: ["All"],
    description: "Permanent 1% rate hike for all agents who achieve Platinum performance tier.",
    usageCount: 7, maxUsage: 20, color: "#6366f1",
    tag: "💎 Elite",
  },
];

const offerTypes   = ["Bonus", "Flat Bonus", "Rate Hike", "Cashback", "Free Month"];
const agentTypeOpts= ["DSA", "Broker", "Lead Partner"];
const tenantOpts   = ["All", "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Pune"];
const typeColors   = {
  "Bonus":      { bg: "#fff7ed", color: "#ea580c", border: "#fed7aa" },
  "Flat Bonus": { bg: "#f0fdf4", color: "#16a34a", border: "#bbf7d0" },
  "Rate Hike":  { bg: "#eff6ff", color: "#2563eb", border: "#bfdbfe" },
  "Cashback":   { bg: "#fdf4ff", color: "#9333ea", border: "#e9d5ff" },
  "Free Month": { bg: "#fff1f2", color: "#e11d48", border: "#fecdd3" },
};
const statusStyles = {
  Active:    { bg: "#dcfce7", color: "#15803d", dot: "#22c55e" },
  Scheduled: { bg: "#dbeafe", color: "#1d4ed8", dot: "#3b82f6" },
  Expired:   { bg: "#f1f5f9", color: "#64748b", dot: "#94a3b8" },
  Paused:    { bg: "#fef9c3", color: "#a16207", dot: "#eab308" },
};

// ─── Toast ────────────────────────────────────────────────────────────────────
function Toast({ msg, type, onClose }) {
  React.useEffect(() => { const t = setTimeout(onClose, 3200); return () => clearTimeout(t); }, []);
  return (
    <div className={`po-toast po-toast-${type}`}>
      <span className="po-toast-icon">{type === "success" ? "✓" : "✕"}</span>
      {msg}
    </div>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, accent, icon }) {
  return (
    <div className="po-stat" style={{ "--accent": accent }}>
      <div className="po-stat-icon">{icon}</div>
      <div className="po-stat-val">{value}</div>
      <div className="po-stat-label">{label}</div>
      {sub && <div className="po-stat-sub">{sub}</div>}
    </div>
  );
}

// ─── Offer Modal (Add / Edit) ─────────────────────────────────────────────────
function OfferModal({ offer, onClose, onSave }) {
  const isEdit = !!offer;
  const blank = {
    title: "", type: "Bonus", status: "Active",
    discount: "", bonusAmt: "", bonusTrigger: "",
    startDate: "", endDate: "",
    agentTypes: [], tenants: [],
    description: "", maxUsage: 50, usageCount: 0,
    color: "#f59e0b", tag: "",
  };
  const [form,   setForm]   = useState(offer ? { ...offer } : { ...blank });
  const [errors, setErrors] = useState({});
  const [activeTab, setActiveTab] = useState(0);

  const f = (k, v) => { setForm(p => ({ ...p, [k]: v })); setErrors(p => ({ ...p, [k]: undefined })); };

  const toggleArr = (key, val) =>
    setForm(p => ({ ...p, [key]: p[key].includes(val) ? p[key].filter(x => x !== val) : [...p[key], val] }));

  const validate = () => {
    const e = {};
    if (!form.title?.trim())       e.title   = "Title is required";
    if (!form.startDate)           e.start   = "Start date required";
    if (!form.endDate)             e.end     = "End date required";
    if (!form.agentTypes?.length)  e.agents  = "Select at least one agent type";
    if (!form.tenants?.length)     e.tenants = "Select at least one tenant";
    return e;
  };

  const handleSave = () => {
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      if (e.title || e.start || e.end) setActiveTab(0);
      else if (e.agents || e.tenants)  setActiveTab(1);
      return;
    }
    onSave({
      ...form,
      id: offer?.id || `OF${String(Date.now()).slice(-3)}`,
    });
  };

  const tabs = ["Details", "Targeting", "Preview"];

  return (
    <div className="po-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="po-modal">
        {/* Modal Header */}
        <div className="po-modal-header">
          <div className="po-modal-title-row">
            <div className={`po-modal-icon-wrap ${isEdit ? "edit" : "add"}`}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/>
                <line x1="7" y1="7" x2="7.01" y2="7"/>
              </svg>
            </div>
            <div>
              <h2>{isEdit ? "Edit Offer" : "Create New Offer"}</h2>
              <p>{isEdit ? `Editing ${offer.id}` : "Set up a promotional offer for agents"}</p>
            </div>
          </div>
          <button className="po-close-btn" onClick={onClose}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="po-modal-tabs">
          {tabs.map((tab, i) => (
            <button key={tab} className={`po-modal-tab ${activeTab === i ? "active" : ""}`} onClick={() => setActiveTab(i)}>
              {tab}
              {((i === 0 && (errors.title || errors.start || errors.end)) ||
                (i === 1 && (errors.agents || errors.tenants))) && <span className="po-tab-dot" />}
            </button>
          ))}
        </div>

        <div className="po-modal-body">

          {/* TAB 0 – Details */}
          {activeTab === 0 && (
            <div className="po-modal-tab-content">
              <div className="po-field full">
                <label>Offer Title <span className="req">*</span></label>
                <input value={form.title} onChange={e => f("title", e.target.value)}
                  placeholder="e.g. Summer Sprint Bonus" className={errors.title ? "err" : ""} />
                {errors.title && <span className="po-err">{errors.title}</span>}
              </div>

              <div className="po-field">
                <label>Offer Type</label>
                <div className="po-type-grid">
                  {offerTypes.map(t => (
                    <button key={t} type="button"
                      className={`po-type-btn ${form.type === t ? "selected" : ""}`}
                      style={form.type === t ? { background: typeColors[t]?.bg, color: typeColors[t]?.color, borderColor: typeColors[t]?.border } : {}}
                      onClick={() => f("type", t)}>{t}</button>
                  ))}
                </div>
              </div>

              <div className="po-2col">
                <div className="po-field">
                  <label>Status</label>
                  <select value={form.status} onChange={e => f("status", e.target.value)}>
                    <option>Active</option><option>Scheduled</option><option>Paused</option>
                  </select>
                </div>
                <div className="po-field">
                  <label>Max Usage Limit</label>
                  <input type="number" value={form.maxUsage} onChange={e => f("maxUsage", e.target.value)} />
                </div>
              </div>

              <div className="po-2col">
                <div className="po-field">
                  <label>Start Date <span className="req">*</span></label>
                  <input type="date" value={form.startDate} onChange={e => f("startDate", e.target.value)} className={errors.start ? "err" : ""} />
                  {errors.start && <span className="po-err">{errors.start}</span>}
                </div>
                <div className="po-field">
                  <label>End Date <span className="req">*</span></label>
                  <input type="date" value={form.endDate} onChange={e => f("endDate", e.target.value)} className={errors.end ? "err" : ""} />
                  {errors.end && <span className="po-err">{errors.end}</span>}
                </div>
              </div>

              <div className="po-2col">
                <div className="po-field">
                  <label>Bonus Amount</label>
                  <input value={form.bonusAmt} onChange={e => f("bonusAmt", e.target.value)} placeholder="e.g. ₹5,000" />
                </div>
                <div className="po-field">
                  <label>Rate Discount</label>
                  <input value={form.discount} onChange={e => f("discount", e.target.value)} placeholder="e.g. +0.5%" />
                </div>
              </div>

              <div className="po-field full">
                <label>Trigger Condition</label>
                <input value={form.bonusTrigger} onChange={e => f("bonusTrigger", e.target.value)} placeholder="e.g. 50 qualified leads" />
              </div>

              <div className="po-field full">
                <label>Offer Tag</label>
                <input value={form.tag} onChange={e => f("tag", e.target.value)} placeholder="e.g. 🔥 Hot" />
              </div>

              <div className="po-field full">
                <label>Description</label>
                <textarea value={form.description} onChange={e => f("description", e.target.value)}
                  placeholder="Brief description of this offer..." rows={3} />
              </div>
            </div>
          )}

          {/* TAB 1 – Targeting */}
          {activeTab === 1 && (
            <div className="po-modal-tab-content">
              <div className="po-field full">
                <label>Target Agent Types <span className="req">*</span></label>
                {errors.agents && <span className="po-err">{errors.agents}</span>}
                <div className="po-check-row">
                  {agentTypeOpts.map(t => (
                    <label key={t} className={`po-check-card ${form.agentTypes.includes(t) ? "selected" : ""}`}>
                      <input type="checkbox" checked={form.agentTypes.includes(t)}
                        onChange={() => toggleArr("agentTypes", t)} />
                      {t}
                    </label>
                  ))}
                </div>
              </div>

              <div className="po-field full">
                <label>Target Tenants <span className="req">*</span></label>
                {errors.tenants && <span className="po-err">{errors.tenants}</span>}
                <div className="po-check-row wrap">
                  {tenantOpts.map(t => (
                    <label key={t} className={`po-check-card ${form.tenants.includes(t) ? "selected" : ""}`}>
                      <input type="checkbox" checked={form.tenants.includes(t)}
                        onChange={() => toggleArr("tenants", t)} />
                      {t}
                    </label>
                  ))}
                </div>
              </div>

              <div className="po-field full">
                <label>Accent Color</label>
                <div className="po-color-row">
                  {["#f59e0b","#22c55e","#3b82f6","#8b5cf6","#ef4444","#ec4899","#0ea5e9","#14b8a6"].map(c => (
                    <button key={c} type="button" className={`po-color-swatch ${form.color === c ? "selected" : ""}`}
                      style={{ background: c }} onClick={() => f("color", c)} />
                  ))}
                  <input type="color" value={form.color} onChange={e => f("color", e.target.value)} className="po-color-input" />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2 – Preview */}
          {activeTab === 2 && (
            <div className="po-modal-tab-content">
              <div className="po-preview-label">Live Card Preview</div>
              <div className="po-preview-card" style={{ "--card-color": form.color }}>
                <div className="po-preview-top">
                  <div className="po-preview-tag">{form.tag || "🏷 Offer"}</div>
                  <span className="po-preview-type" style={{ background: typeColors[form.type]?.bg, color: typeColors[form.type]?.color }}>
                    {form.type}
                  </span>
                </div>
                <h3 className="po-preview-title">{form.title || "Offer Title"}</h3>
                <p className="po-preview-desc">{form.description || "Offer description will appear here."}</p>
                <div className="po-preview-row">
                  {form.bonusAmt && <span className="po-preview-bonus">{form.bonusAmt}</span>}
                  {form.discount && <span className="po-preview-rate">{form.discount}</span>}
                  {form.bonusTrigger && <span className="po-preview-trigger">on {form.bonusTrigger}</span>}
                </div>
                <div className="po-preview-footer">
                  <span>{form.startDate ? new Date(form.startDate).toLocaleDateString("en-IN", { day:"numeric",month:"short",year:"numeric" }) : "Start"} → {form.endDate ? new Date(form.endDate).toLocaleDateString("en-IN", { day:"numeric",month:"short",year:"numeric" }) : "End"}</span>
                  <span className="po-preview-status" style={{ background: statusStyles[form.status]?.bg, color: statusStyles[form.status]?.color }}>
                    {form.status}
                  </span>
                </div>
              </div>
            </div>
          )}

        </div>

        <div className="po-modal-footer">
          <button className="po-btn-ghost" onClick={onClose}>Cancel</button>
          {activeTab < 2
            ? <button className="po-btn-primary" onClick={() => setActiveTab(activeTab + 1)}>Next →</button>
            : <button className="po-btn-primary" onClick={handleSave}>{isEdit ? "Save Changes" : "Create Offer"}</button>
          }
        </div>
      </div>
    </div>
  );
}

// ─── Offer Card ───────────────────────────────────────────────────────────────
function OfferCard({ offer, onEdit, onDelete, onToggleStatus }) {
  const ss  = statusStyles[offer.status];
  const tc  = typeColors[offer.type];
  const pct = offer.maxUsage > 0 ? Math.min(Math.round((offer.usageCount / offer.maxUsage) * 100), 100) : 0;

  return (
    <div className="po-card" style={{ "--card-color": offer.color }}>
      <div className="po-card-stripe" />

      <div className="po-card-head">
        <div className="po-card-tag-row">
          <span className="po-card-tag">{offer.tag}</span>
          <span className="po-card-type" style={{ background: tc?.bg, color: tc?.color, border: `1px solid ${tc?.border}` }}>
            {offer.type}
          </span>
        </div>
        <span className="po-card-status" style={{ background: ss?.bg, color: ss?.color }}>
          <span className="po-status-dot" style={{ background: ss?.dot }} />
          {offer.status}
        </span>
      </div>

      <h3 className="po-card-title">{offer.title}</h3>
      <p className="po-card-desc">{offer.description}</p>

      {/* Value */}
      <div className="po-card-value-row">
        {offer.bonusAmt && (
          <div className="po-value-chip bonus">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="13" height="13"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>
            {offer.bonusAmt}
          </div>
        )}
        {offer.discount && (
          <div className="po-value-chip rate">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="13" height="13"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
            {offer.discount}
          </div>
        )}
        {offer.bonusTrigger && <span className="po-trigger-text">on {offer.bonusTrigger}</span>}
      </div>

      {/* Usage bar */}
      <div className="po-card-usage">
        <div className="po-usage-header">
          <span>Usage</span>
          <span>{offer.usageCount} / {offer.maxUsage}</span>
        </div>
        <div className="po-usage-bar">
          <div className="po-usage-fill" style={{ width: `${pct}%`, background: offer.color }} />
        </div>
        <span className="po-usage-pct">{pct}%</span>
      </div>

      {/* Target info */}
      <div className="po-card-targets">
        <div className="po-target-row">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="12" height="12"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          <span>{offer.agentTypes.join(", ")}</span>
        </div>
        <div className="po-target-row">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="12" height="12"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>
          <span>{offer.tenants.join(", ")}</span>
        </div>
      </div>

      {/* Date range */}
      <div className="po-card-dates">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="12" height="12"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
        <span>
          {new Date(offer.startDate).toLocaleDateString("en-IN",{day:"numeric",month:"short"})} →&nbsp;
          {new Date(offer.endDate).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"})}
        </span>
      </div>

      {/* Actions */}
      <div className="po-card-actions">
        <button className="po-card-edit-btn" onClick={() => onEdit(offer)}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="13" height="13"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          Edit
        </button>
        <button className="po-card-pause-btn" onClick={() => onToggleStatus(offer.id)}
          title={offer.status === "Paused" ? "Resume" : "Pause"}>
          {offer.status === "Paused"
            ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="13" height="13"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="13" height="13"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
          }
        </button>
        <button className="po-card-del-btn" onClick={() => onDelete(offer.id)}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="13" height="13"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/></svg>
        </button>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function PromotionalOffers() {
  const [offers,      setOffers]      = useState(initialOffers);
  const [modal,       setModal]       = useState(null);
  const [search,      setSearch]      = useState("");
  const [filterType,  setFilterType]  = useState("All");
  const [filterStatus,setFilterStatus]= useState("All");
  const [viewMode,    setViewMode]    = useState("grid");
  const [toast,       setToast]       = useState(null);

  const showToast = (msg, type = "success") => setToast({ msg, type });

  const filtered = useMemo(() => offers.filter(o => {
    const ms = o.title.toLowerCase().includes(search.toLowerCase()) || o.id.includes(search);
    const mt = filterType   === "All" || o.type   === filterType;
    const ms2= filterStatus === "All" || o.status === filterStatus;
    return ms && mt && ms2;
  }), [offers, search, filterType, filterStatus]);

  const handleSave = (offer) => {
    if (offers.find(o => o.id === offer.id)) {
      setOffers(p => p.map(o => o.id === offer.id ? offer : o));
      showToast(`"${offer.title}" updated`);
    } else {
      setOffers(p => [offer, ...p]);
      showToast(`"${offer.title}" created!`);
    }
    setModal(null);
  };

  const handleDelete = (id) => {
    const o = offers.find(o => o.id === id);
    setOffers(p => p.filter(o => o.id !== id));
    showToast(`"${o?.title}" deleted`, "error");
  };

  const handleToggleStatus = (id) => {
    setOffers(p => p.map(o => {
      if (o.id !== id) return o;
      const next = o.status === "Active" ? "Paused" : "Active";
      return { ...o, status: next };
    }));
    const o = offers.find(o => o.id === id);
    showToast(`"${o?.title}" ${o?.status === "Active" ? "paused" : "resumed"}`);
  };

  // Summary stats
  const activeCount    = offers.filter(o => o.status === "Active").length;
  const totalUsage     = offers.reduce((s, o) => s + o.usageCount, 0);
  const scheduledCount = offers.filter(o => o.status === "Scheduled").length;

  return (
    <div className="po-root">
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
      {modal  && <OfferModal offer={modal === "add" ? null : modal} onClose={() => setModal(null)} onSave={handleSave} />}

      {/* ── Header ── */}
      <div className="po-header">
        <div className="po-header-left">
          <div className="po-header-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="22" height="22">
              <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/>
              <line x1="7" y1="7" x2="7.01" y2="7"/>
            </svg>
          </div>
          <div>
            <h1 className="po-title">Promotional Offers</h1>
            <p className="po-subtitle">Create and manage bonus offers, rate hikes and incentives for agents</p>
          </div>
        </div>
        <div className="po-header-actions">
          <button className="po-btn-outline">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="14" height="14"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Export
          </button>
          <button className="po-btn-primary" onClick={() => setModal("add")}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            New Offer
          </button>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="po-stats-row">
        <StatCard label="Total Offers"    value={offers.length}   sub="all time"           accent="#ec4899"
          icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="18" height="18"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>} />
        <StatCard label="Active Now"      value={activeCount}     sub="live offers"        accent="#22c55e"
          icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="18" height="18"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>} />
        <StatCard label="Scheduled"       value={scheduledCount}  sub="upcoming"           accent="#3b82f6"
          icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="18" height="18"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>} />
        <StatCard label="Total Redemptions" value={totalUsage}    sub="across all offers"  accent="#f59e0b"
          icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="18" height="18"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>} />
      </div>

      {/* ── Toolbar ── */}
      <div className="po-toolbar">
        <div className="po-toolbar-left">
          <div className="po-search-wrap">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="14" height="14"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <input placeholder="Search offers..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="po-filter-group">
            {["All", ...offerTypes].map(t => (
              <button key={t} className={`po-filter-btn ${filterType === t ? "active" : ""}`} onClick={() => setFilterType(t)}>{t}</button>
            ))}
          </div>
        </div>
        <div className="po-toolbar-right">
          <div className="po-status-filter">
            {["All","Active","Scheduled","Paused","Expired"].map(s => (
              <button key={s} className={`po-status-btn ${filterStatus === s ? "active" : ""}`} onClick={() => setFilterStatus(s)}>{s}</button>
            ))}
          </div>
          <div className="po-view-toggle">
            <button className={`po-view-btn ${viewMode === "grid" ? "active" : ""}`} onClick={() => setViewMode("grid")}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
            </button>
            <button className={`po-view-btn ${viewMode === "list" ? "active" : ""}`} onClick={() => setViewMode("list")}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
            </button>
          </div>
        </div>
      </div>

      {/* ── Offer Cards Grid ── */}
      {viewMode === "grid" && (
        <div className="po-cards-grid">
          {filtered.map(offer => (
            <OfferCard key={offer.id} offer={offer}
              onEdit={o => setModal(o)}
              onDelete={handleDelete}
              onToggleStatus={handleToggleStatus}
            />
          ))}
        </div>
      )}

      {/* ── List View ── */}
      {viewMode === "list" && (
        <div className="po-list-card">
          <table className="po-list-table">
            <thead>
              <tr>
                <th>Offer</th><th>Type</th><th>Value</th><th>Targets</th><th>Usage</th><th>Dates</th><th>Status</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(o => {
                const ss  = statusStyles[o.status];
                const tc  = typeColors[o.type];
                const pct = o.maxUsage > 0 ? Math.min(Math.round((o.usageCount / o.maxUsage) * 100), 100) : 0;
                return (
                  <tr key={o.id}>
                    <td>
                      <div className="po-list-title-cell">
                        <div className="po-list-dot" style={{ background: o.color }} />
                        <div>
                          <div className="po-list-name">{o.title}</div>
                          <div className="po-list-id">{o.id}</div>
                        </div>
                      </div>
                    </td>
                    <td><span className="po-list-type" style={{ background: tc?.bg, color: tc?.color }}>{o.type}</span></td>
                    <td><span className="po-list-val">{o.bonusAmt || o.discount || "—"}</span></td>
                    <td><span className="po-list-meta">{o.agentTypes.join(", ")}</span></td>
                    <td>
                      <div className="po-list-usage">
                        <div className="po-list-bar"><div style={{ width:`${pct}%`, background:o.color }} /></div>
                        <span>{o.usageCount}/{o.maxUsage}</span>
                      </div>
                    </td>
                    <td><span className="po-list-dates">{new Date(o.endDate).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"})}</span></td>
                    <td>
                      <span className="po-list-status" style={{ background: ss?.bg, color: ss?.color }}>
                        <span style={{ background: ss?.dot }} />
                        {o.status}
                      </span>
                    </td>
                    <td>
                      <div className="po-list-actions">
                        <button className="po-list-edit" onClick={() => setModal(o)}>Edit</button>
                        <button className="po-list-del" onClick={() => handleDelete(o.id)}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="13" height="13"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && <div className="po-empty">No offers found</div>}
        </div>
      )}

      {filtered.length === 0 && viewMode === "grid" && (
        <div className="po-empty-state">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="42" height="42">
            <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/>
            <line x1="7" y1="7" x2="7.01" y2="7"/>
          </svg>
          <p>No offers found</p>
          <button className="po-btn-primary" onClick={() => setModal("add")}>Create your first offer</button>
        </div>
      )}

      <div className="po-page-footer">{filtered.length} offers shown</div>
    </div>
  );
}