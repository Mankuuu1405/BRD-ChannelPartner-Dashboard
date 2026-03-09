import React, { useState } from "react";
import "./PerformanceTemplate.css";

const initialTemplates = [
  {
    id: "PT001", name: "Standard DSA Template", agentType: "DSA", status: "Active",
    metrics: [
      { key: "leads",      label: "Leads Generated",  weight: 30, target: 100, unit: "leads" },
      { key: "conversion", label: "Conversion Rate",   weight: 40, target: 25,  unit: "%"     },
      { key: "revenue",    label: "Revenue Generated", weight: 30, target: 500000, unit: "₹"  },
    ],
    tiers: [
      { name: "Bronze", min: 0,  max: 49,  color: "#cd7f32", bonus: "₹0",     badge: "🥉" },
      { name: "Silver", min: 50, max: 74,  color: "#94a3b8", bonus: "₹2,000", badge: "🥈" },
      { name: "Gold",   min: 75, max: 89,  color: "#f59e0b", bonus: "₹5,000", badge: "🥇" },
      { name: "Platinum",min:90, max: 100, color: "#6366f1", bonus: "₹10,000",badge: "💎" },
    ],
    cycle: "Monthly", lastUpdated: "Jan 15, 2026", usedBy: 12,
  },
  {
    id: "PT002", name: "Broker Performance Plan", agentType: "Broker", status: "Active",
    metrics: [
      { key: "deals",      label: "Deals Closed",      weight: 50, target: 20,  unit: "deals" },
      { key: "conversion", label: "Lead Conversion",   weight: 30, target: 30,  unit: "%"     },
      { key: "retention",  label: "Client Retention",  weight: 20, target: 85,  unit: "%"     },
    ],
    tiers: [
      { name: "Bronze",  min: 0,  max: 49,  color: "#cd7f32", bonus: "₹0",     badge: "🥉" },
      { name: "Silver",  min: 50, max: 74,  color: "#94a3b8", bonus: "₹3,000", badge: "🥈" },
      { name: "Gold",    min: 75, max: 89,  color: "#f59e0b", bonus: "₹7,500", badge: "🥇" },
      { name: "Platinum",min: 90, max: 100, color: "#6366f1", bonus: "₹15,000",badge: "💎" },
    ],
    cycle: "Monthly", lastUpdated: "Jan 20, 2026", usedBy: 8,
  },
  {
    id: "PT003", name: "Lead Partner Template", agentType: "Lead Partner", status: "Draft",
    metrics: [
      { key: "leads",    label: "Qualified Leads",  weight: 60, target: 200, unit: "leads" },
      { key: "quality",  label: "Lead Quality Score",weight: 40, target: 80, unit: "pts"  },
    ],
    tiers: [
      { name: "Bronze",  min: 0,  max: 49,  color: "#cd7f32", bonus: "₹0",    badge: "🥉" },
      { name: "Silver",  min: 50, max: 74,  color: "#94a3b8", bonus: "₹1,500",badge: "🥈" },
      { name: "Gold",    min: 75, max: 89,  color: "#f59e0b", bonus: "₹4,000",badge: "🥇" },
      { name: "Platinum",min: 90, max: 100, color: "#6366f1", bonus: "₹8,000",badge: "💎" },
    ],
    cycle: "Quarterly", lastUpdated: "Dec 10, 2025", usedBy: 0,
  },
];

const typeColors = {
  DSA:            { bg: "#dbeafe", color: "#2563eb" },
  Broker:         { bg: "#fef9c3", color: "#b45309" },
  "Lead Partner": { bg: "#dcfce7", color: "#16a34a" },
};

function Toast({ msg, type, onClose }) {
  React.useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, []);
  return <div className={`pt-toast pt-toast-${type}`}><span>{type === "success" ? "✓" : "✕"}</span>{msg}</div>;
}

function TemplateModal({ template, onClose, onSave }) {
  const isEdit = !!template;
  const [form, setForm] = useState(template ? { ...template, metrics: template.metrics.map(m => ({...m})) } : {
    name: "", agentType: "DSA", status: "Draft", cycle: "Monthly",
    metrics: [{ key: "leads", label: "Leads Generated", weight: 100, target: 100, unit: "leads" }],
    tiers: [
      { name: "Bronze",  min: 0,  max: 49,  color: "#cd7f32", bonus: "₹0",    badge: "🥉" },
      { name: "Silver",  min: 50, max: 74,  color: "#94a3b8", bonus: "₹2,000",badge: "🥈" },
      { name: "Gold",    min: 75, max: 89,  color: "#f59e0b", bonus: "₹5,000",badge: "🥇" },
      { name: "Platinum",min: 90, max: 100, color: "#6366f1", bonus: "₹10,000",badge: "💎" },
    ],
    usedBy: 0, lastUpdated: new Date().toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" }),
  });
  const [errors, setErrors] = useState({});

  const totalWeight = form.metrics.reduce((s, m) => s + Number(m.weight), 0);

  const addMetric = () => setForm(p => ({ ...p, metrics: [...p.metrics, { key: `m${Date.now()}`, label: "", weight: 0, target: 0, unit: "" }] }));
  const removeMetric = (i) => setForm(p => ({ ...p, metrics: p.metrics.filter((_, idx) => idx !== i) }));
  const updateMetric = (i, key, val) => setForm(p => ({ ...p, metrics: p.metrics.map((m, idx) => idx === i ? { ...m, [key]: val } : m) }));
  const updateTier = (i, key, val) => setForm(p => ({ ...p, tiers: p.tiers.map((t, idx) => idx === i ? { ...t, [key]: val } : t) }));

  const handleSave = () => {
    const e = {};
    if (!form.name?.trim()) e.name = "Template name is required";
    if (totalWeight !== 100) e.weight = "Total metric weights must equal 100%";
    if (Object.keys(e).length) { setErrors(e); return; }
    onSave({ ...form, id: template?.id || `PT${String(Date.now()).slice(-3)}`, lastUpdated: new Date().toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" }) });
  };

  return (
    <div className="pt-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="pt-modal">
        <div className="pt-modal-header">
          <div className="pt-modal-title-wrap">
            <div className={`pt-modal-icon ${isEdit ? "edit" : "add"}`}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/>
              </svg>
            </div>
            <div>
              <h2>{isEdit ? "Edit Template" : "Create Template"}</h2>
              <p>{isEdit ? `Editing ${template.id}` : "Define metrics and scoring tiers"}</p>
            </div>
          </div>
          <button className="pt-close" onClick={onClose}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div className="pt-modal-body">
          {/* Basic */}
          <div className="pt-section-title">Basic Info</div>
          <div className="pt-modal-grid">
            <div className="pt-mf full">
              <label>Template Name <span>*</span></label>
              <input value={form.name} onChange={e => { setForm(p=>({...p,name:e.target.value})); setErrors(p=>({...p,name:undefined})); }} placeholder="e.g. Standard DSA Template" className={errors.name ? "err" : ""} />
              {errors.name && <span className="pt-err">{errors.name}</span>}
            </div>
            <div className="pt-mf">
              <label>Agent Type</label>
              <select value={form.agentType} onChange={e => setForm(p=>({...p,agentType:e.target.value}))}>
                <option>DSA</option><option>Broker</option><option>Lead Partner</option>
              </select>
            </div>
            <div className="pt-mf">
              <label>Review Cycle</label>
              <select value={form.cycle} onChange={e => setForm(p=>({...p,cycle:e.target.value}))}>
                <option>Monthly</option><option>Quarterly</option><option>Half-Yearly</option><option>Annual</option>
              </select>
            </div>
            <div className="pt-mf">
              <label>Status</label>
              <div className="pt-status-toggle">
                {["Active","Draft"].map(s => (
                  <button key={s} type="button" className={`pt-tog ${form.status===s?(s==="Active"?"on":"draft"):""}`} onClick={() => setForm(p=>({...p,status:s}))}>{s}</button>
                ))}
              </div>
            </div>
          </div>

          {/* Metrics */}
          <div className="pt-section-title" style={{marginTop:20}}>
            Performance Metrics
            <span className={`pt-weight-badge ${totalWeight===100?"ok":"warn"}`}>{totalWeight}% / 100%</span>
          </div>
          {errors.weight && <span className="pt-err" style={{marginBottom:8,display:"block"}}>{errors.weight}</span>}
          <div className="pt-metrics-list">
            {form.metrics.map((m, i) => (
              <div key={i} className="pt-metric-row">
                <input className="pt-metric-label" value={m.label} onChange={e => updateMetric(i,"label",e.target.value)} placeholder="Metric name" />
                <div className="pt-metric-field">
                  <span>Weight</span>
                  <input type="number" value={m.weight} onChange={e => updateMetric(i,"weight",e.target.value)} />
                  <span>%</span>
                </div>
                <div className="pt-metric-field">
                  <span>Target</span>
                  <input type="number" value={m.target} onChange={e => updateMetric(i,"target",e.target.value)} />
                </div>
                <input className="pt-metric-unit" value={m.unit} onChange={e => updateMetric(i,"unit",e.target.value)} placeholder="unit" />
                <button className="pt-metric-del" onClick={() => removeMetric(i)} disabled={form.metrics.length <= 1}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="13" height="13"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>
            ))}
            <button className="pt-add-metric" onClick={addMetric}>+ Add Metric</button>
          </div>

          {/* Tiers */}
          <div className="pt-section-title" style={{marginTop:20}}>Scoring Tiers & Bonuses</div>
          <div className="pt-tiers-grid">
            {form.tiers.map((t, i) => (
              <div key={i} className="pt-tier-card" style={{borderTopColor: t.color}}>
                <div className="pt-tier-badge">{t.badge} {t.name}</div>
                <div className="pt-tier-range">
                  <input type="number" value={t.min} onChange={e => updateTier(i,"min",Number(e.target.value))} />
                  <span>–</span>
                  <input type="number" value={t.max} onChange={e => updateTier(i,"max",Number(e.target.value))} />
                  <span>pts</span>
                </div>
                <div className="pt-tier-bonus-field">
                  <span>Bonus</span>
                  <input value={t.bonus} onChange={e => updateTier(i,"bonus",e.target.value)} placeholder="₹0" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-modal-footer">
          <button className="pt-btn-ghost" onClick={onClose}>Cancel</button>
          <button className="pt-btn-primary" onClick={handleSave}>{isEdit ? "Save Changes" : "Create Template"}</button>
        </div>
      </div>
    </div>
  );
}

export default function PerformanceTemplate() {
  const [templates, setTemplates] = useState(initialTemplates);
  const [modal, setModal]         = useState(null); // null | "add" | template obj
  const [search, setSearch]       = useState("");
  const [filterType, setFilter]   = useState("All");
  const [toast, setToast]         = useState(null);
  const [expanded, setExpanded]   = useState(null);

  const showToast = (msg, type="success") => setToast({msg,type});

  const filtered = templates.filter(t => {
    const ms = t.name.toLowerCase().includes(search.toLowerCase()) || t.id.includes(search);
    const mf = filterType==="All" || t.agentType===filterType || t.status===filterType;
    return ms && mf;
  });

  const handleSave = (tpl) => {
    if (templates.find(t => t.id === tpl.id)) {
      setTemplates(p => p.map(t => t.id===tpl.id ? tpl : t));
      showToast(`Template "${tpl.name}" updated`);
    } else {
      setTemplates(p => [tpl, ...p]);
      showToast(`Template "${tpl.name}" created`);
    }
    setModal(null);
  };

  const handleDelete = (id) => {
    const t = templates.find(t=>t.id===id);
    setTemplates(p=>p.filter(t=>t.id!==id));
    showToast(`"${t?.name}" deleted`, "error");
  };

  const toggleStatus = (id) => {
    setTemplates(p=>p.map(t=>t.id===id?{...t,status:t.status==="Active"?"Draft":"Active"}:t));
    const t = templates.find(t=>t.id===id);
    showToast(`"${t?.name}" set to ${t?.status==="Active"?"Draft":"Active"}`);
  };

  return (
    <div className="pt-root">
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={()=>setToast(null)} />}
      {modal && <TemplateModal template={modal==="add"?null:modal} onClose={()=>setModal(null)} onSave={handleSave} />}

      {/* Header */}
      <div className="pt-header">
        <div className="pt-header-left">
          <div className="pt-header-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="22" height="22"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/><path d="M9 12h6M9 16h4"/></svg>
          </div>
          <div>
            <h1 className="pt-title">Performance Template</h1>
            <p className="pt-subtitle">Define scoring metrics and reward tiers for each agent type</p>
          </div>
        </div>
        <div className="pt-header-actions">
          <button className="pt-btn-primary" onClick={()=>setModal("add")}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            New Template
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="pt-summary">
        {[
          { label:"Total Templates", value:templates.length, color:"violet" },
          { label:"Active",          value:templates.filter(t=>t.status==="Active").length, color:"green" },
          { label:"Drafts",          value:templates.filter(t=>t.status==="Draft").length,  color:"amber" },
          { label:"Agents Covered",  value:templates.reduce((s,t)=>s+t.usedBy,0),          color:"blue"  },
        ].map(s => (
          <div key={s.label} className={`pt-stat pt-stat-${s.color}`}>
            <div className="pt-stat-val">{s.value}</div>
            <div className="pt-stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="pt-toolbar">
        <div className="pt-search">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="14" height="14"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input placeholder="Search templates..." value={search} onChange={e=>setSearch(e.target.value)} />
        </div>
        <div className="pt-filters">
          {["All","DSA","Broker","Lead Partner","Active","Draft"].map(f=>(
            <button key={f} className={`pt-filter ${filterType===f?"active":""}`} onClick={()=>setFilter(f)}>{f}</button>
          ))}
        </div>
      </div>

      {/* Template Cards */}
      <div className="pt-grid">
        {filtered.map(t => (
          <div key={t.id} className={`pt-card ${expanded===t.id?"expanded":""}`}>
            <div className="pt-card-top">
              <div className="pt-card-left">
                <div className="pt-card-id">{t.id}</div>
                <h3 className="pt-card-name">{t.name}</h3>
                <div className="pt-card-meta">
                  <span className="pt-type-badge" style={{background:typeColors[t.agentType]?.bg,color:typeColors[t.agentType]?.color}}>{t.agentType}</span>
                  <span className="pt-cycle-chip">🔄 {t.cycle}</span>
                  <span className="pt-used-chip">👥 {t.usedBy} agents</span>
                </div>
              </div>
              <div className="pt-card-right">
                <span className={`pt-status-badge ${t.status==="Active"?"active":"draft"}`}>{t.status}</span>
              </div>
            </div>

            {/* Metrics preview */}
            <div className="pt-metrics-preview">
              {t.metrics.map(m => (
                <div key={m.key} className="pt-metric-chip">
                  <span className="pt-metric-name">{m.label}</span>
                  <span className="pt-metric-weight">{m.weight}%</span>
                </div>
              ))}
            </div>

            {/* Expanded tiers */}
            {expanded === t.id && (
              <div className="pt-tiers-preview">
                <div className="pt-tiers-title">Scoring Tiers</div>
                <div className="pt-tiers-row">
                  {t.tiers.map(tier => (
                    <div key={tier.name} className="pt-tier-pill" style={{borderColor:tier.color,background:`${tier.color}15`}}>
                      <span>{tier.badge}</span>
                      <div>
                        <div className="pt-tier-pill-name" style={{color:tier.color}}>{tier.name}</div>
                        <div className="pt-tier-pill-range">{tier.min}–{tier.max} pts</div>
                        <div className="pt-tier-pill-bonus">{tier.bonus}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-card-footer">
              <span className="pt-updated">Updated {t.lastUpdated}</span>
              <div className="pt-card-actions">
                <button className="pt-action-ghost" onClick={()=>setExpanded(expanded===t.id?null:t.id)}>
                  {expanded===t.id?"Hide Tiers ▲":"View Tiers ▼"}
                </button>
                <button className="pt-action-ghost" onClick={()=>toggleStatus(t.id)}>
                  {t.status==="Active"?"Deactivate":"Activate"}
                </button>
                <button className="pt-action-icon" onClick={()=>setModal(t)} title="Edit">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="14" height="14"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                </button>
                <button className="pt-action-icon delete" onClick={()=>handleDelete(t.id)} title="Delete">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="14" height="14"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="pt-empty">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="40" height="40"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/></svg>
          <p>No templates found</p>
        </div>
      )}
    </div>
  );
}