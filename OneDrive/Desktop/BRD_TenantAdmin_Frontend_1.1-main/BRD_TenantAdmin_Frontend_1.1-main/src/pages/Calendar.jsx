import { useEffect, useState, useMemo } from "react";
import { calendarAPI } from "../services/calendarService"; // ensure this is correct

export default function Calendar() {
  // -------------------- STATES --------------------
  const [financialYears, setFinancialYears] = useState([]);
  const [reportingPeriods, setReportingPeriods] = useState([]);
  const [holidays, setHolidays] = useState([]);
  const [workingDays, setWorkingDays] = useState([]);
  const [workingHours, setWorkingHours] = useState([]);
  const [overtimeSettings, setOvertimeSettings] = useState([]);
  const [assessmentYears, setAssessmentYears] = useState([]);

  const [modals, setModals] = useState({ fy: false, rp: false, h: false, wd: false, wh: false, ot: false, ay: false });

  const [loading, setLoading] = useState(true);

  const [fyForm, setFyForm] = useState({
    name: "",
    start: "",
    end: "",
    status: "Active",
    created_by: "", // Will be set from current user
  });
  const [rpForm, setRpForm] = useState({ name: "", start: "", end: "" });
  const [hForm, setHForm] = useState({ title: "", date: "" });
  const [wdForm, setWdForm] = useState({ days: [] });
  const [whForm, setWhForm] = useState({ start_time: "", end_time: "" });
  const [otForm, setOtForm] = useState({ enable_overtime: false, rate_multiplier: 1.5 });
  const [ayForm, setAyForm] = useState({ 
    name: "", 
    start: "", 
    end: "", 
    status: "Active",
    linked_fy_id: null,
    created_by: "",
    // Additional fields based on the detailed requirements
    financial_eligibility_years: 3, // Default to 3 years for income verification
    document_compliance_required: true,
    credit_assessment_enabled: true,
    itr_years_required: 3, // Default to 3 years for ITR verification
    loan_type_specific: false, // Can be configured based on loan type
    borrower_type_specific: false // Can be configured based on borrower type
  });

  // -------------------- COUNTS --------------------
  const fyCounts = useMemo(
    () => ({
      Active: (financialYears || []).filter((f) => f?.is_active).length,
      Inactive: (financialYears || []).filter((f) => !f?.is_active).length,
    }),
    [financialYears]
  );

  const ayCounts = useMemo(
    () => ({
      Active: (assessmentYears || []).filter((a) => a?.is_active).length,
      Inactive: (assessmentYears || []).filter((a) => !a?.is_active).length,
    }),
    [assessmentYears]
  );

  const statusBadge = (s) =>
    s
      ? "inline-flex px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800"
      : "inline-flex px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800";

  // -------------------- FETCH ALL DATA --------------------
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          loadFinancialYears(),
          loadReportingPeriods(),
          loadHolidays(),
          loadAssessmentYears()
        ]);
      } catch (error) {
        console.error("Error loading calendar data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  const loadFinancialYears = async () => {
    try {
      const res = await calendarAPI.getFinancialYears();
      setFinancialYears(res?.data || []);
    } catch (err) {
      console.error("Error loading FY:", err);
      setFinancialYears([]);
      throw err; // Re-throw to be caught by Promise.all
    }
  };

  const loadReportingPeriods = async () => {
    try {
      const res = await calendarAPI.getReportingPeriods();
      setReportingPeriods(res?.data || []);
    } catch (err) {
      console.error("Error loading RP:", err);
      setReportingPeriods([]);
      throw err;
    }
  };

  const loadHolidays = async () => {
    try {
      const res = await calendarAPI.getHolidays();
      setHolidays(res?.data || []);
    } catch (err) {
      console.error("Error loading holidays:", err);
      setHolidays([]);
      throw err;
    }
  };

  const loadAssessmentYears = async () => {
    try {
      const res = await calendarAPI.getAssessmentYears();
      setAssessmentYears(res?.data || []);
    } catch (err) {
      console.error("Error loading AY:", err);
      setAssessmentYears([]);
      throw err;
    }
  };

  // -------------------- CREATE OPERATIONS --------------------
  const saveFinancialYear = () => {
    if (!fyForm.name || !fyForm.start || !fyForm.end) {
      alert("Please fill all mandatory fields");
      return;
    }

    // Validate that FY follows Indian fiscal year (April to March)
    const startDate = new Date(fyForm.start);
    const endDate = new Date(fyForm.end);
    
    if (startDate.getMonth() !== 3 || startDate.getDate() !== 1) { // 3 = April (0-indexed)
      alert("Financial Year must start on April 1st");
      return;
    }
    
    if (endDate.getMonth() !== 2 || endDate.getDate() !== 31) { // 2 = March (0-indexed)
      alert("Financial Year must end on March 31st");
      return;
    }

    // Check if there's already an active FY
    const hasActiveFY = financialYears.some(fy => fy.is_active && fy.status === "Active");
    if (fyForm.status === "Active" && hasActiveFY) {
      alert("Only one Financial Year can be Active at a time. Please deactivate the existing active FY first.");
      return;
    }

    const payload = {
      name: fyForm.name,
      start: fyForm.start,
      end: fyForm.end,
      is_active: fyForm.status === "Active",
      created_by: fyForm.created_by || "current_user", // Replace with actual user ID
      created_date: new Date().toISOString().split('T')[0]
    };
    
    calendarAPI
      .createFinancialYear(payload)
      .then((res) => {
        setFinancialYears([...financialYears, res.data]);
        setModals((m) => ({ ...m, fy: false }));
        
        // Auto-create corresponding Assessment Year
        const startYear = parseInt(fyForm.start.split('-')[0]);
        const endYear = parseInt(fyForm.end.split('-')[0]);
        const ayName = `AY ${startYear}-${endYear}`;
        const ayStart = new Date(endDate);
        ayStart.setDate(ayStart.getDate() + 1); // Start AY the day after FY ends
        const ayEnd = new Date(ayStart);
        ayEnd.setFullYear(ayEnd.getFullYear() + 1);
        ayEnd.setDate(ayEnd.getDate() - 1); // End AY the day before next AY starts
        
        const ayPayload = {
          name: ayName,
          start: ayStart.toISOString().split('T')[0],
          end: ayEnd.toISOString().split('T')[0],
          is_active: fyForm.status === "Active",
          linked_fy_id: res.data.id,
          financial_eligibility_years: 3,
          document_compliance_required: true,
          credit_assessment_enabled: true,
          itr_years_required: 3
        };
        
        calendarAPI
          .createAssessmentYear(ayPayload)
          .then((ayRes) => {
            setAssessmentYears([...assessmentYears, ayRes.data]);
          })
          .catch((err) => console.error("Auto AY creation error:", err));
      })
      .catch((err) => {
        console.error("FY create error:", err);
        if (err.response) console.error("Backend response:", err.response.data);
      });
  };

  // Function to auto-generate FY name from start date
  const generateFYName = (startDate) => {
    if (!startDate) return "";
    
    const startYear = new Date(startDate).getFullYear();
    const endYear = startYear + 1;
    const endYearShort = endYear.toString().slice(-2);
    
    return `FY ${startYear}-${endYearShort}`;
  };

  // Function to auto-calculate end date from start date
  const calculateEndDate = (startDate) => {
    if (!startDate) return "";
    
    const start = new Date(startDate);
    const endYear = start.getFullYear() + 1;
    return `${endYear}-03-31`;
  };

  // Function to auto-generate AY name from linked FY
  const generateAYName = (linkedFyId) => {
    if (!linkedFyId) return "";
    
    const linkedFY = financialYears.find(fy => fy.id === linkedFyId);
    if (!linkedFY) return "";
    
    const startYear = parseInt(linkedFY.start.split('-')[0]) + 1;
    const endYear = parseInt(linkedFY.end.split('-')[0]) + 1;
    const endYearShort = endYear.toString().slice(-2);
    
    return `AY ${startYear}-${endYearShort}`;
  };

  // Function to auto-calculate AY dates from linked FY
  const calculateAYDates = (linkedFyId) => {
    if (!linkedFyId) return { start: "", end: "" };
    
    const linkedFY = financialYears.find(fy => fy.id === linkedFyId);
    if (!linkedFY) return { start: "", end: "" };
    
    const fyEndDate = new Date(linkedFY.end);
    const ayStartDate = new Date(fyEndDate);
    ayStartDate.setDate(ayStartDate.getDate() + 1); // Start AY the day after FY ends
    
    const ayEndDate = new Date(ayStartDate);
    ayEndDate.setFullYear(ayEndDate.getFullYear() + 1);
    ayEndDate.setDate(ayEndDate.getDate() - 1); // End AY the day before next AY starts
    
    return {
      start: ayStartDate.toISOString().split('T')[0],
      end: ayEndDate.toISOString().split('T')[0]
    };
  };

  const saveReportingPeriod = () => {
    if (!rpForm.name || !rpForm.start || !rpForm.end) {
      alert("Please fill all fields");
      return;
    }

    const payload = {
      name: rpForm.name,
      start: rpForm.start,
      end: rpForm.end,
    };

    calendarAPI
      .createReportingPeriod(payload)
      .then((res) => {
        setReportingPeriods([...reportingPeriods, res.data]);
        setModals((m) => ({ ...m, rp: false }));
      })
      .catch((err) => console.error("RP create error:", err));
  };

  const saveHoliday = () => {
    if (!hForm.title || !hForm.date) {
      alert("Please fill all fields");
      return;
    }

    const payload = { title: hForm.title, date: hForm.date };

    calendarAPI
      .createHoliday(payload)
      .then((res) => {
        setHolidays([...holidays, res.data]);
        setModals((m) => ({ ...m, h: false }));
      })
      .catch((err) => console.error("Holiday create error:", err));
  };
  
  const saveWorkingDays = () => {
    if (!wdForm.days || wdForm.days.length === 0) {
      alert("Select at least one day");
      return;
    }
    const item = { id: Date.now(), days: wdForm.days.slice() };
    setWorkingDays([...workingDays, item]);
    setModals((m) => ({ ...m, wd: false }));
  };
  
  const saveWorkingHours = () => {
    if (!whForm.start_time || !whForm.end_time) {
      alert("Please fill all fields");
      return;
    }
    const item = { id: Date.now(), start_time: whForm.start_time, end_time: whForm.end_time };
    setWorkingHours([...workingHours, item]);
    setModals((m) => ({ ...m, wh: false }));
  };
  
  const saveOvertime = () => {
    if (!otForm.rate_multiplier || Number(otForm.rate_multiplier) <= 0) {
      alert("Enter a valid rate multiplier");
      return;
    }
    const item = { id: Date.now(), enable_overtime: !!otForm.enable_overtime, rate_multiplier: Number(otForm.rate_multiplier) };
    setOvertimeSettings([...overtimeSettings, item]);
    setModals((m) => ({ ...m, ot: false }));
  };
  
  const saveAssessmentYear = () => {
    if (!ayForm.name || !ayForm.start || !ayForm.end || !ayForm.linked_fy_id) {
      alert("Please fill all mandatory fields");
      return;
    }
    
    // Validate that AY follows Indian fiscal year (April to March)
    const startDate = new Date(ayForm.start);
    const endDate = new Date(ayForm.end);
    
    if (startDate.getMonth() !== 3 || startDate.getDate() !== 1) { // 3 = April (0-indexed)
      alert("Assessment Year must start on April 1st");
      return;
    }
    
    if (endDate.getMonth() !== 2 || endDate.getDate() !== 31) { // 2 = March (0-indexed)
      alert("Assessment Year must end on March 31st");
      return;
    }
    
    // Check if AY is correctly linked to a FY
    const linkedFY = financialYears.find(fy => fy.id === ayForm.linked_fy_id);
    if (!linkedFY) {
      alert("Assessment Year must be linked to a valid Financial Year");
      return;
    }
    
    const item = { 
      id: Date.now(), 
      name: ayForm.name, 
      start: ayForm.start, 
      end: ayForm.end, 
      is_active: ayForm.status === "Active",
      linked_fy_id: ayForm.linked_fy_id,
      created_by: ayForm.created_by || "current_user", // Replace with actual user ID
      created_date: new Date().toISOString().split('T')[0],
      // Additional fields based on the detailed requirements
      financial_eligibility_years: ayForm.financial_eligibility_years,
      document_compliance_required: ayForm.document_compliance_required,
      credit_assessment_enabled: ayForm.credit_assessment_enabled,
      itr_years_required: ayForm.itr_years_required,
      loan_type_specific: ayForm.loan_type_specific,
      borrower_type_specific: ayForm.borrower_type_specific
    };
    setAssessmentYears([...assessmentYears, item]);
    setModals((m) => ({ ...m, ay: false }));
  };

  // -------------------- DELETE OPERATIONS --------------------
  const deleteReportingPeriod = (id) => {
    calendarAPI
      .deleteReportingPeriod(id)
      .then(() =>
        setReportingPeriods(reportingPeriods.filter((r) => r.id !== id))
      )
      .catch((err) => console.error("RP delete error:", err));
  };

  const deleteHoliday = (id) => {
    calendarAPI
      .deleteHoliday(id)
      .then(() => setHolidays(holidays.filter((h) => h.id !== id)))
      .catch((err) => console.error("Holiday delete error:", err));
  };
  
  const deleteWorkingDays = (id) => {
    setWorkingDays(workingDays.filter((w) => w.id !== id));
  };
  
  const deleteWorkingHours = (id) => {
    setWorkingHours(workingHours.filter((w) => w.id !== id));
  };
  
  const deleteOvertime = (id) => {
    setOvertimeSettings(overtimeSettings.filter((o) => o.id !== id));
  };
  
  const deleteAssessmentYear = (id) => {
    setAssessmentYears(assessmentYears.filter((a) => a.id !== id));
  };

  // -------------------- UI --------------------
  if (loading) {
    return (
      <div className="p-6 space-y-8 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading calendar data...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
        <h1 className="text-2xl font-bold text-gray-800">Calendar</h1>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* FINANCIAL YEARS */}
          <section className="bg-white rounded-xl shadow-md border p-4">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-semibold text-gray-700">
                Manage Financial Year
              </h2>
              <button
                className="px-4 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                onClick={() => {
                  // Pre-fill with default Indian fiscal year pattern
                  const currentYear = new Date().getFullYear();
                  const nextYear = currentYear + 1;
                  const startDate = `${currentYear}-04-01`;
                  const endDate = `${nextYear}-03-31`;
                  const fyName = generateFYName(startDate);
                  
                  setFyForm({ 
                    name: fyName, 
                    start: startDate, 
                    end: endDate, 
                    status: "Active",
                    created_by: "current_user" // Replace with actual user ID
                  });
                  setModals((m) => ({ ...m, fy: true }));
                }}
              >
                View
              </button>
            </div>

            <div className="text-sm text-gray-600 mb-2">
              Active: {fyCounts.Active} • Inactive: {fyCounts.Inactive}
            </div>
            
            <div className="text-xs text-blue-600 mb-2 italic">
              Indian Fiscal Year: 1 April to 31 March
            </div>

            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="text-left text-gray-500 border-b">
                  <th className="py-2">Name</th>
                  <th>Start</th>
                  <th>End</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {(financialYears || []).map((f) => (
                  <tr key={f?.id || Math.random()} className="border-b hover:bg-gray-50">
                    <td className="py-2 font-medium">{f?.name || ''}</td>
                    <td>{f?.start || ''}</td>
                    <td>{f?.end || ''}</td>
                    <td>
                      <span className={statusBadge(f?.is_active)}>
                        {f?.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          {/* ASSESSMENT YEARS */}
          <section className="bg-white rounded-xl shadow-md border p-4">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-semibold text-gray-700">
                Manage Assessment Year
              </h2>
              <button
                className="px-4 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                onClick={() => {
                  // Pre-fill with default Indian assessment year pattern
                  const currentYear = new Date().getFullYear();
                  const nextYear = currentYear + 1;
                  setAyForm({ 
                    name: `AY ${currentYear}-${nextYear}`, 
                    start: `${currentYear}-04-01`, 
                    end: `${nextYear}-03-31`, 
                    status: "Active",
                    linked_fy_id: null,
                    created_by: "current_user",
                    // Default values for the new fields
                    financial_eligibility_years: 3,
                    document_compliance_required: true,
                    credit_assessment_enabled: true,
                    itr_years_required: 3,
                    loan_type_specific: false,
                    borrower_type_specific: false
                  });
                  setModals((m) => ({ ...m, ay: true }));
                }}
              >
                View
              </button>
            </div>
            
            <div className="text-sm text-gray-600 mb-2">
              Active: {ayCounts.Active} • Inactive: {ayCounts.Inactive}
            </div>
            
            <div className="text-xs text-blue-600 mb-2 italic">
              Assessment Year follows Financial Year (used for tax assessment)
            </div>
            
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="text-left text-gray-500 border-b">
                  <th className="py-2">Name</th>
                  <th>Start</th>
                  <th>End</th>
                  <th>Status</th>
                  <th>Linked FY</th>
                </tr>
              </thead>
              <tbody>
                {(assessmentYears || []).map((a) => (
                  <tr key={a?.id || Math.random()} className="border-b hover:bg-gray-50">
                    <td className="py-2 font-medium">{a?.name || ''}</td>
                    <td>{a?.start || ''}</td>
                    <td>{a?.end || ''}</td>
                    <td>
                      <span className={statusBadge(a?.is_active)}>
                        {a?.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td>
                      {a?.linked_fy_id ? 
                        financialYears.find(fy => fy?.id === a?.linked_fy_id)?.name || "Unknown" : 
                        "Not linked"
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          {/* REPORTING PERIODS */}
          <section className="bg-white rounded-xl shadow-md border p-4">
            <div className="flex justify-between items-center mb-3">
              <h2 className="font-semibold text-gray-700">Manage Reporting Period</h2>
              <button
                className="px-4 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                onClick={() => {
                  setRpForm({ name: "", start: "", end: "" });
                  setModals((m) => ({ ...m, rp: true }));
                }}
              >
                Add
              </button>
            </div>

            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="text-left text-gray-500 border-b">
                  <th className="py-2">Name</th>
                  <th>Start</th>
                  <th>End</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {(reportingPeriods || []).map((r) => (
                  <tr key={r?.id || Math.random()} className="border-b hover:bg-gray-50">
                    <td className="py-2 font-medium">{r?.name || ''}</td>
                    <td>{r?.start || ''}</td>
                    <td>{r?.end || ''}</td>
                    <td>
                      <button
                        className="px-3 py-1 border rounded-lg text-red-600 hover:bg-red-50"
                        onClick={() => deleteReportingPeriod(r?.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          {/* HOLIDAYS */}
          <section className="bg-white rounded-xl shadow-md border p-4">
            <div className="flex justify-between items-center mb-3">
              <h2 className="font-semibold text-gray-700">Manage Holidays</h2>
              <button
                className="px-4 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                onClick={() => {
                  setHForm({ title: "", date: "" });
                  setModals((m) => ({ ...m, h: true }));
                }}
              >
                Add
              </button>
            </div>

            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="text-left text-gray-500 border-b">
                  <th className="py-2">Date</th>
                  <th>Title</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {(holidays || []).map((h) => (
                  <tr key={h?.id || Math.random()} className="border-b hover:bg-gray-50">
                    <td className="py-2">{h?.date || ''}</td>
                    <td className="font-medium">{h?.title || ''}</td>
                    <td>
                      <button
                        className="px-3 py-1 border rounded-lg text-red-600 hover:bg-red-50"
                        onClick={() => deleteHoliday(h?.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
          
          <section className="bg-white rounded-xl shadow-md border p-4">
            <div className="flex justify-between items-center mb-3">
              <h2 className="font-semibold text-gray-700">Manage Working Days</h2>
              <button
                className="px-4 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                onClick={() => {
                  setWdForm({ days: [] });
                  setModals((m) => ({ ...m, wd: true }));
                }}
              >
                Add
              </button>
            </div>
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="text-left text-gray-500 border-b">
                  <th className="py-2">Pattern</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {workingDays.map((w) => (
                  <tr key={w.id} className="border-b hover:bg-gray-50">
                    <td className="py-2">{w.days.join(", ")}</td>
                    <td>
                      <button
                        className="px-3 py-1 border rounded-lg text-red-600 hover:bg-red-50"
                        onClick={() => deleteWorkingDays(w.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
          
          <section className="bg-white rounded-xl shadow-md border p-4">
            <div className="flex justify-between items-center mb-3">
              <h2 className="font-semibold text-gray-700">Manage Working Hours</h2>
              <button
                className="px-4 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                onClick={() => {
                  setWhForm({ start_time: "", end_time: "" });
                  setModals((m) => ({ ...m, wh: true }));
                }}
              >
                Add
              </button>
            </div>
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="text-left text-gray-500 border-b">
                  <th className="py-2">Start Time</th>
                  <th>End Time</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {workingHours.map((w) => (
                  <tr key={w.id} className="border-b hover:bg-gray-50">
                    <td className="py-2">{w.start_time}</td>
                    <td>{w.end_time}</td>
                    <td>
                      <button
                        className="px-3 py-1 border rounded-lg text-red-600 hover:bg-red-50"
                        onClick={() => deleteWorkingHours(w.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
          
          <section className="bg-white rounded-xl shadow-md border p-4">
            <div className="flex justify-between items-center mb-3">
              <h2 className="font-semibold text-gray-700">Manage Overtime</h2>
              <button
                className="px-4 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                onClick={() => {
                  setOtForm({ enable_overtime: false, rate_multiplier: 1.5 });
                  setModals((m) => ({ ...m, ot: true }));
                }}
              >
                Add
              </button>
            </div>
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="text-left text-gray-500 border-b">
                  <th className="py-2">Enabled</th>
                  <th>Rate Multiplier</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {overtimeSettings.map((o) => (
                  <tr key={o.id} className="border-b hover:bg-gray-50">
                    <td className="py-2">{o.enable_overtime ? "Yes" : "No"}</td>
                    <td>{o.rate_multiplier}</td>
                    <td>
                      <button
                        className="px-3 py-1 border rounded-lg text-red-600 hover:bg-red-50"
                        onClick={() => deleteOvertime(o.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </div>
      </div>

      {/* -------------------- MODALS -------------------- */}
      {modals.fy && (
        <FinancialYearModal
          title="View Financial Year"
          form={fyForm}
          setForm={setFyForm}
          onClose={() => setModals((m) => ({ ...m, fy: false }))}
          onSave={saveFinancialYear}
          financialYears={financialYears}
          generateFYName={generateFYName}
          calculateEndDate={calculateEndDate}
        />
      )}
      {modals.ay && (
        <AssessmentYearModal
          title="View Assessment Year"
          form={ayForm}
          setForm={setAyForm}
          onClose={() => setModals((m) => ({ ...m, ay: false }))}
          onSave={saveAssessmentYear}
          financialYears={financialYears}
          generateAYName={generateAYName}
          calculateAYDates={calculateAYDates}
        />
      )}
      {modals.rp && (
        <FormModal
          title="Add Reporting Period"
          form={rpForm}
          setForm={setRpForm}
          onClose={() => setModals((m) => ({ ...m, rp: false }))}
          onSave={saveReportingPeriod}
          fields={["name", "start", "end"]}
        />
      )}
      {modals.h && (
        <FormModal
          title="Add Holiday"
          form={hForm}
          setForm={setHForm}
          onClose={() => setModals((m) => ({ ...m, h: false }))}
          onSave={saveHoliday}
          fields={["title", "date"]}
        />
      )}
      {modals.wd && (
        <DaysModal
          title="Add Working Days"
          form={wdForm}
          setForm={setWdForm}
          onClose={() => setModals((m) => ({ ...m, wd: false }))}
          onSave={saveWorkingDays}
        />
      )}
      {modals.wh && (
        <WorkingHoursModal
          title="Add Working Hours"
          form={whForm}
          setForm={setWhForm}
          onClose={() => setModals((m) => ({ ...m, wh: false }))}
          onSave={saveWorkingHours}
        />
      )}
      {modals.ot && (
        <OvertimeModal
          title="Add Overtime"
          form={otForm}
          setForm={setOtForm}
          onClose={() => setModals((m) => ({ ...m, ot: false }))}
          onSave={saveOvertime}
        />
      )}
    </>
  );
}

/* -------------------- MODAL COMPONENTS -------------------- */
function FormModal({ title, form, setForm, onClose, onSave, fields, description }) {
  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
    >
      <div
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      />
      <div
        className="relative bg-white rounded-xl w-full max-w-md p-6 shadow-xl z-[10000]"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-semibold mb-4">{title}</h3>
        
        {description && (
          <div className="text-xs text-blue-600 mb-3 italic">{description}</div>
        )}

        {fields.includes("name") && (
          <label className="block mb-3">
            Name
            <input
              value={form.name || ""}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="mt-1 w-full h-10 border rounded-lg px-3"
            />
          </label>
        )}

        {fields.includes("title") && (
          <label className="block mb-3">
            Title
            <input
              value={form.title || ""}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="mt-1 w-full h-10 border rounded-lg px-3"
            />
          </label>
        )}

        {fields.includes("date") && (
          <label className="block mb-3">
            Date
            <input
              type="date"
              value={form.date || ""}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="mt-1 w-full h-10 border rounded-lg px-3"
            />
          </label>
        )}

        {fields.includes("start") && (
          <label className="block mb-3">
            Start
            <input
              type="date"
              value={form.start || ""}
              onChange={(e) => setForm({ ...form, start: e.target.value })}
              className="mt-1 w-full h-10 border rounded-lg px-3"
            />
          </label>
        )}

        {fields.includes("end") && (
          <label className="block mb-3">
            End
            <input
              type="date"
              value={form.end || ""}
              onChange={(e) => setForm({ ...form, end: e.target.value })}
              className="mt-1 w-full h-10 border rounded-lg px-3"
            />
          </label>
        )}

        {fields.includes("status") && (
          <label className="block mb-3">
            Status
            <select
              value={form.status || "Active"}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="mt-1 w-full h-10 border rounded-lg px-3"
            >
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </label>
        )}

        <div className="flex justify-end gap-3 mt-4">
          <button
            className="px-4 py-2 border rounded-lg hover:bg-gray-50"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            onClick={onSave}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

function FinancialYearModal({ title, form, setForm, onClose, onSave, financialYears, generateFYName, calculateEndDate }) {
  // Check if there's already an active FY
  const hasActiveFY = financialYears.some(fy => fy.is_active && fy.status === "Active");
  
  // Local view filter state for the modal
  const [modalViewFilter, setModalViewFilter] = useState("yearly");
  
  // Handle start date change
  const handleStartDateChange = (e) => {
    const startDate = e.target.value;
    const endDate = calculateEndDate(startDate);
    const fyName = generateFYName(startDate);
    
    setForm({ 
      ...form, 
      start: startDate, 
      end: endDate,
      name: fyName
    });
  };
  
  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
    >
      <div
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      />
      <div
        className="relative bg-white rounded-xl w-full max-w-2xl p-6 shadow-xl z-[10000]"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-semibold mb-4">{title}</h3>
        
        <div className="text-xs text-blue-600 mb-3 italic">
          Financial Year follows Indian fiscal system (April 1 to March 31)
        </div>

        {/* View Filters */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">View Options</label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setModalViewFilter("yearly")}
              className={`px-3 py-1 text-xs rounded-lg transition-colors ${
                modalViewFilter === "yearly"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Yearly View
            </button>
            <button
              type="button"
              onClick={() => setModalViewFilter("halfyearly")}
              className={`px-3 py-1 text-xs rounded-lg transition-colors ${
                modalViewFilter === "halfyearly"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Half-Yearly View
            </button>
            <button
              type="button"
              onClick={() => setModalViewFilter("quarterly")}
              className={`px-3 py-1 text-xs rounded-lg transition-colors ${
                modalViewFilter === "quarterly"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Quarterly View
            </button>
          </div>
          <div className="text-xs text-gray-600 mt-1">
            {modalViewFilter === "yearly" && "Showing all financial years"}
            {modalViewFilter === "halfyearly" && `Showing financial years from the last 6 months`}
            {modalViewFilter === "quarterly" && `Showing financial years from the last 3 months`}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <label className="block mb-3">
            Financial Year Name
            <input
              value={form.name || ""}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="mt-1 w-full h-10 border rounded-lg px-3"
              placeholder="Format: FY YYYY-YY"
            />
            <div className="text-xs text-gray-500 mt-1">Auto-generated from start date</div>
          </label>

          <label className="block mb-3">
            Status
            <select
              value={form.status || "Active"}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="mt-1 w-full h-10 border rounded-lg px-3"
              disabled={form.status === "Active" && hasActiveFY}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
            {hasActiveFY && form.status !== "Active" && (
              <div className="text-xs text-orange-500 mt-1">Note: There is already an active Financial Year</div>
            )}
            {hasActiveFY && form.status === "Active" && (
              <div className="text-xs text-red-500 mt-1">Only one Financial Year can be Active at a time</div>
            )}
          </label>

          <label className="block mb-3">
            Start Date
            <input
              type="date"
              value={form.start || ""}
              onChange={handleStartDateChange}
              className="mt-1 w-full h-10 border rounded-lg px-3"
            />
            <div className="text-xs text-gray-500 mt-1">Must be April 1st</div>
          </label>

          <label className="block mb-3">
            End Date
            <input
              type="date"
              value={form.end || ""}
              readOnly
              className="mt-1 w-full h-10 border rounded-lg px-3 bg-gray-50"
            />
            <div className="text-xs text-gray-500 mt-1">Auto-calculated (March 31st)</div>
          </label>
        </div>

        <div className="flex justify-end gap-3 mt-4">
          <button
            className="px-4 py-2 border rounded-lg hover:bg-gray-50"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            onClick={onSave}
          >
            View
          </button>
        </div>
      </div>
    </div>
  );
}

function AssessmentYearModal({ title, form, setForm, onClose, onSave, financialYears, generateAYName, calculateAYDates }) {
  // Handle linked FY change
  const handleLinkedFYChange = (e) => {
    const linkedFyId = e.target.value;
    const ayName = generateAYName(linkedFyId);
    const ayDates = calculateAYDates(linkedFyId);
    
    setForm({ 
      ...form, 
      linked_fy_id: linkedFyId,
      name: ayName,
      start: ayDates.start,
      end: ayDates.end
    });
  };
  
  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
    >
      <div
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-[9998]"
        onClick={onClose}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      />
      <div
        className="relative bg-white rounded-xl w-full max-w-5xl p-6 shadow-xl z-[10000] max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-semibold mb-4">{title}</h3>
        
        <div className="text-xs text-blue-600 mb-3 italic">
          Assessment Year follows Financial Year (used for tax assessment)
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="block mb-3">
            Assessment Year Name
            <input
              value={form.name || ""}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="mt-1 w-full h-10 border rounded-lg px-3"
              placeholder="Format: AY YYYY-YY"
            />
            <div className="text-xs text-gray-500 mt-1">Auto-generated from linked Financial Year</div>
          </label>

          <label className="block mb-3">
            Linked Financial Year
            <select
              value={form.linked_fy_id || ""}
              onChange={handleLinkedFYChange}
              className="mt-1 w-full h-10 border rounded-lg px-3"
            >
              <option value="">Select Financial Year</option>
              {financialYears.map((fy) => (
                <option key={fy.id} value={fy.id}>
                  {fy.name}
                </option>
              ))}
            </select>
            <div className="text-xs text-gray-500 mt-1">Mandatory mapping to exactly one FY</div>
          </label>

          <label className="block mb-3">
            Start Date
            <input
              type="date"
              value={form.start || ""}
              onChange={(e) => setForm({ ...form, start: e.target.value })}
              className="mt-1 w-full h-10 border rounded-lg px-3"
            />
            <div className="text-xs text-gray-500 mt-1">Must be 1st April of next year after FY</div>
          </label>

          <label className="block mb-3">
            End Date
            <input
              type="date"
              value={form.end || ""}
              onChange={(e) => setForm({ ...form, end: e.target.value })}
              className="mt-1 w-full h-10 border rounded-lg px-3"
            />
            <div className="text-xs text-gray-500 mt-1">Must be 31st March</div>
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="block mb-3">
            Status
            <select
              value={form.status || "Active"}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="mt-1 w-full h-10 border rounded-lg px-3"
            >
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </label>
        </div>

        <div className="border-t pt-4 mt-4">
          <h4 className="text-md font-semibold text-gray-800 mb-4">Configuration Settings</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="block mb-3">
              Financial Eligibility Years
              <input
                type="number"
                min="1"
                max="10"
                value={form.financial_eligibility_years || 3}
                onChange={(e) => setForm({ ...form, financial_eligibility_years: parseInt(e.target.value) })}
                className="mt-1 w-full h-10 border rounded-lg px-3"
              />
              <div className="text-xs text-gray-500 mt-1">Number of years required for income verification</div>
            </label>

            <label className="block mb-3">
              Document Compliance Required
              <div className="flex items-center mt-1">
                <input
                  type="checkbox"
                  checked={!!form.document_compliance_required}
                  onChange={(e) => setForm({ ...form, document_compliance_required: e.target.checked })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Yes</span>
              </div>
              <div className="text-xs text-gray-500 mt-1">Require document validation for this AY</div>
            </label>

            <label className="block mb-3">
              Credit Assessment Enabled
              <div className="flex items-center mt-1">
                <input
                  type="checkbox"
                  checked={!!form.credit_assessment_enabled}
                  onChange={(e) => setForm({ ...form, credit_assessment_enabled: e.target.checked })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Yes</span>
              </div>
              <div className="text-xs text-gray-500 mt-1">Enable credit assessment for this AY</div>
            </label>

            <label className="block mb-3">
              ITR Years Required
              <input
                type="number"
                min="1"
                max="10"
                value={form.itr_years_required || 3}
                onChange={(e) => setForm({ ...form, itr_years_required: parseInt(e.target.value) })}
                className="mt-1 w-full h-10 border rounded-lg px-3"
              />
              <div className="text-xs text-gray-500 mt-1">Number of ITR years required for verification</div>
            </label>

            <label className="block mb-3">
              Loan Type Specific
              <div className="flex items-center mt-1">
                <input
                  type="checkbox"
                  checked={!!form.loan_type_specific}
                  onChange={(e) => setForm({ ...form, loan_type_specific: e.target.checked })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Yes</span>
              </div>
              <div className="text-xs text-gray-500 mt-1">Apply different rules based on loan type</div>
            </label>

            <label className="block mb-3">
              Borrower Type Specific
              <div className="flex items-center mt-1">
                <input
                  type="checkbox"
                  checked={!!form.borrower_type_specific}
                  onChange={(e) => setForm({ ...form, borrower_type_specific: e.target.checked })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Yes</span>
              </div>
              <div className="text-xs text-gray-500 mt-1">Apply different rules based on borrower type</div>
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-4">
          <button
            className="px-4 py-2 border rounded-lg hover:bg-gray-50"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            onClick={onSave}
          >
            View
          </button>
        </div>
      </div>
    </div>
  );
}

function DaysModal({ title, form, setForm, onClose, onSave }) {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const toggle = (d) => {
    const has = form.days.includes(d);
    const next = has ? form.days.filter((x) => x !== d) : [...form.days, d];
    setForm({ ...form, days: next });
  };
  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
    >
      <div
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      />
      <div className="relative bg-white rounded-xl w-full max-w-md p-6 shadow-xl z-[10000]" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-lg font-semibold mb-4">{title}</h3>
        <div className="grid grid-cols-3 gap-3">
          {days.map((d) => (
            <label key={d} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.days.includes(d)}
                onChange={() => toggle(d)}
              />
              <span>{d}</span>
            </label>
          ))}
        </div>
        <div className="flex justify-end gap-3 mt-4">
          <button className="px-4 py-2 border rounded-lg hover:bg-gray-50" onClick={onClose}>Cancel</button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700" onClick={onSave}>Save</button>
        </div>
      </div>
    </div>
  );
}

function WorkingHoursModal({ title, form, setForm, onClose, onSave }) {
  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
    >
      <div
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      />
      <div className="relative bg-white rounded-xl w-full max-w-md p-6 shadow-xl z-[10000]" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-lg font-semibold mb-4">{title}</h3>
        <label className="block mb-3">
          Start Time
          <input
            type="time"
            value={form.start_time || ""}
            onChange={(e) => setForm({ ...form, start_time: e.target.value })}
            className="mt-1 w-full h-10 border rounded-lg px-3"
          />
        </label>
        <label className="block mb-3">
          End Time
          <input
            type="time"
            value={form.end_time || ""}
            onChange={(e) => setForm({ ...form, end_time: e.target.value })}
            className="mt-1 w-full h-10 border rounded-lg px-3"
          />
        </label>
        <div className="flex justify-end gap-3 mt-4">
          <button className="px-4 py-2 border rounded-lg hover:bg-gray-50" onClick={onClose}>Cancel</button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700" onClick={onSave}>Save</button>
        </div>
      </div>
    </div>
  );
}

function OvertimeModal({ title, form, setForm, onClose, onSave }) {
  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
    >
      <div
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      />
      <div className="relative bg-white rounded-xl w-full max-w-md p-6 shadow-xl z-[10000]" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-lg font-semibold mb-4">{title}</h3>
        <label className="flex items-center gap-2 mb-3">
          <input
            type="checkbox"
            checked={!!form.enable_overtime}
            onChange={(e) => setForm({ ...form, enable_overtime: e.target.checked })}
          />
          <span>Enable Overtime</span>
        </label>
        <label className="block mb-3">
          Rate Multiplier
          <input
            type="number"
            step="0.1"
            min="0"
            value={form.rate_multiplier}
            onChange={(e) => setForm({ ...form, rate_multiplier: e.target.value })}
            className="mt-1 w-full h-10 border rounded-lg px-3"
          />
        </label>
        <div className="flex justify-end gap-3 mt-4">
          <button className="px-4 py-2 border rounded-lg hover:bg-gray-50" onClick={onClose}>Cancel</button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700" onClick={onSave}>Save</button>
        </div>
      </div>
    </div>
  );
}