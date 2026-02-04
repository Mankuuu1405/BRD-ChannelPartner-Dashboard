import { useEffect, useState } from "react";

// -----------------------------
// Field Component
// -----------------------------
const Field = ({ s, onChange }) => {
  const masked = s.is_encrypted && !s.reveal;

  const label = s.key
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());

  if (s.data_type === "BOOLEAN") {
    return (
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={s.value === "true"}
          onChange={(e) => onChange(s.key, e.target.checked ? "true" : "false")}
        />
        <span>{label}</span>
      </label>
    );
  }

  return (
    <div className="space-y-1">
      <div className="text-sm text-gray-700">{label}</div>
      <div className="flex gap-2">
        <input
          type="text"
          value={masked ? "••••" : s.value}
          onChange={(e) => !masked && onChange(s.key, e.target.value)}
          className="flex-1 h-9 rounded-lg border border-gray-300 px-3"
        />
        {s.is_encrypted && (
          <button
            type="button"
            className="h-9 px-3 rounded-lg border border-gray-200"
            onClick={() => onChange(s.key, s.value, { reveal: !s.reveal })}
          >
            {s.reveal ? "Hide" : "Reveal"}
          </button>
        )}
      </div>
    </div>
  );
};

// -----------------------------
// Modal Component
// -----------------------------
const SettingsModal = ({ 
  isOpen, 
  onClose, 
  title, 
  description, 
  settings, 
  onChange, 
  onSave, 
  saving 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop with blur effect - Fixed to cover entire screen */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal content */}
      <div className="relative bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[80vh] overflow-hidden m-4 flex flex-col z-10">
        <div className="p-6 flex-1 overflow-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-lg font-medium">{title}</div>
              <p className="text-xs text-gray-600 mt-1">{description}</p>
            </div>
            <button
              type="button"
              className="text-gray-400 hover:text-gray-600"
              onClick={onClose}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="space-y-3">
            {settings.map((s) => (
              <Field key={s.key} s={s} onChange={onChange} />
            ))}
          </div>
        </div>
        
        {/* Modal footer with save button */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-end gap-2">
            <button
              type="button"
              className="h-9 px-3 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              disabled={saving}
              className="h-9 px-3 rounded-lg bg-primary-600 text-white disabled:opacity-60"
              onClick={onSave}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// -----------------------------
// Main Settings Component
// -----------------------------
export default function Settings() {
  // Modal state
  const [activeModal, setActiveModal] = useState(null);

  // Settings state
  const [loan, setLoan] = useState([]);
  const [system, setSystem] = useState([]);
  const [notify, setNotify] = useState([]);

  // UI state
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Load settings
  const loadSettings = async () => {
    setLoading(true);
    setError(null);

    try {
      // Use mock data only
      const mockData = {
        loan: [
          { key: "loan_default_interest_rate", value: "0.12", data_type: "NUMBER", is_encrypted: false },
          { key: "loan_max_amount", value: "1000000", data_type: "NUMBER", is_encrypted: false },
          { key: "loan_min_term_months", value: "6", data_type: "NUMBER", is_encrypted: false },
          { key: "default_currency_symbol", value: "₹", data_type: "STRING", is_encrypted: false }
        ],
        system: [
          { key: "password_min_length", value: "8", data_type: "NUMBER", is_encrypted: false },
          { key: "session_timeout_minutes", value: "30", data_type: "NUMBER", is_encrypted: false },
          { key: "allow_anonymous_signup", value: "false", data_type: "BOOLEAN", is_encrypted: false }
        ],
        notify: [
          { key: "notification_sender_email", value: "no-reply@platform.com", data_type: "STRING", is_encrypted: false },
          { key: "webhook_secret_key", value: "secret123", data_type: "STRING", is_encrypted: true }
        ]
      };

      const addReveal = (arr) => arr.map((s) => ({ ...s, reveal: false }));

      setLoan(addReveal(mockData.loan || []));
      setSystem(addReveal(mockData.system || []));
      setNotify(addReveal(mockData.notify || []));
    } catch (err) {
      console.error("Error loading settings:", err);
      setError("Unable to load settings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Load data on component mount
    loadSettings();
  }, []);

  // Mutate a specific setting in a group
  const mutate =
    (groupSetter, group) =>
    (key, value, extra = {}) => {
      groupSetter(
        group.map((s) => (s.key === key ? { ...s, value, ...extra } : s))
      );
    };

  // Save all settings (simulated)
  const saveSettings = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      // Simulate saving process
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess("Settings saved successfully");
      setActiveModal(null); // Close modal after saving
    } catch (err) {
      console.error("Error saving settings:", err);
      setError("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  // Get current settings based on active modal
  const getCurrentSettings = () => {
    switch (activeModal) {
      case "loan":
        return { settings: loan, onChange: mutate(setLoan, loan) };
      case "system":
        return { settings: system, onChange: mutate(setSystem, system) };
      case "notify":
        return { settings: notify, onChange: mutate(setNotify, notify) };
      default:
        return { settings: [], onChange: () => {} };
    }
  };

  // Get modal title and description based on active modal
  const getModalInfo = () => {
    switch (activeModal) {
      case "loan":
        return {
          title: "Loan Configuration",
          description: "Configure default loan parameters such as interest rates, maximum and minimum amounts, and tenure limits. These settings will be used as defaults when creating new loan products."
        };
      case "system":
        return {
          title: "System & Security",
          description: "Manage system-wide security settings including password requirements, session timeout policies, and user authentication preferences."
        };
      case "notify":
        return {
          title: "Notifications & Email",
          description: "Configure notification settings including sender email addresses and webhook secrets for secure communication and alerts."
        };
      default:
        return { title: "", description: "" };
    }
  };

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <div className="text-xl font-semibold">Settings</div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 text-red-700 border border-red-200 rounded-lg p-3">
          {error}
        </div>
      )}

      {/* Success */}
      {success && (
        <div className="bg-green-50 text-green-700 border border-green-200 rounded-lg p-3">
          {success}
        </div>
      )}

      {/* Header for Settings */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <div className="text-lg font-medium">System Configuration</div>
        </div>
      </div>

      {/* Settings Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <button
          className="p-4 bg-white rounded-lg shadow border border-gray-200 hover:shadow-md transition-shadow"
          onClick={() => setActiveModal("loan")}
        >
          <div className="text-left">
            <div className="font-medium text-gray-900">Loan Configuration</div>
            <div className="text-sm text-gray-500 mt-1">
              Set default loan parameters and limits
            </div>
          </div>
        </button>

        <button
          className="p-4 bg-white rounded-lg shadow border border-gray-200 hover:shadow-md transition-shadow"
          onClick={() => setActiveModal("system")}
        >
          <div className="text-left">
            <div className="font-medium text-gray-900">System & Security</div>
            <div className="text-sm text-gray-500 mt-1">
              Manage security settings and policies
            </div>
          </div>
        </button>

        <button
          className="p-4 bg-white rounded-lg shadow border border-gray-200 hover:shadow-md transition-shadow"
          onClick={() => setActiveModal("notify")}
        >
          <div className="text-left">
            <div className="font-medium text-gray-900">Notifications & Email</div>
            <div className="text-sm text-gray-500 mt-1">
              Configure email and webhook settings
            </div>
          </div>
        </button>
      </div>

      {/* Loading */}
      {loading && <div className="text-gray-500">Loading settings...</div>}

      {/* Settings Modal */}
      <SettingsModal
        isOpen={!!activeModal}
        onClose={() => setActiveModal(null)}
        title={getModalInfo().title}
        description={getModalInfo().description}
        settings={getCurrentSettings().settings}
        onChange={getCurrentSettings().onChange}
        onSave={saveSettings}
        saving={saving}
      />
    </div>
  );
}