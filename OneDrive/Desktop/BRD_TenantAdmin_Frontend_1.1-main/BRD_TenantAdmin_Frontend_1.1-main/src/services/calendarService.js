import axiosInstance from "../utils/axiosInstance";

export const calendarAPI = {

  // ---------------- FINANCIAL YEARS ----------------
  getFinancialYears() {
    return axiosInstance.get("tenants/calendar/financial-years/");
  },
  createFinancialYear(data) {
    return axiosInstance.post("tenants/calendar/financial-years/", data);
  },
  updateFinancialYear(id, data) {
    return axiosInstance.put(`tenants/calendar/financial-years/${id}/`, data);
  },
  deleteFinancialYear(id) {
    return axiosInstance.delete(`tenants/calendar/financial-years/${id}/`);
  },

  // ---------------- REPORTING PERIODS ----------------
  getReportingPeriods() {
    return axiosInstance.get("tenants/calendar/reporting-periods/");
  },
  createReportingPeriod(data) {
    return axiosInstance.post("tenants/calendar/reporting-periods/", data);
  },
  deleteReportingPeriod(id) {
    return axiosInstance.delete(`tenants/calendar/reporting-periods/${id}/`);
  },

  // ---------------- HOLIDAYS ----------------
  getHolidays() {
    return axiosInstance.get("tenants/calendar/holidays/");
  },
  createHoliday(data) {
    return axiosInstance.post("tenants/calendar/holidays/", data);
  },
  deleteHoliday(id) {
    return axiosInstance.delete(`tenants/calendar/holidays/${id}/`);
  },

  // ---------------- ASSESSMENT YEARS ----------------
  getAssessmentYears() {
    return axiosInstance.get("tenants/calendar/assessment-years/");
  },
  createAssessmentYear(data) {
    return axiosInstance.post("tenants/calendar/assessment-years/", data);
  },
  updateAssessmentYear(id, data) {
    return axiosInstance.put(`tenants/calendar/assessment-years/${id}/`, data);
  },
  deleteAssessmentYear(id) {
    return axiosInstance.delete(`tenants/calendar/assessment-years/${id}/`);
  },

};